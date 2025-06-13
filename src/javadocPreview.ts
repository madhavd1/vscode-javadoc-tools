import * as vscode from 'vscode';
import { marked } from 'marked';
import * as shiki from 'shiki';
import { createHighlighter, type ThemeRegistration } from 'shiki';

let lastDisposable: vscode.Disposable | undefined;

// Global highlighter instance, initialized at extension activation
let highlighter: shiki.Highlighter | undefined;

export async function initializeJavadocPreviewHighlighter(context: vscode.ExtensionContext) {

    // Get the current VS Code theme name
    const themeName = getCurrentThemeName();
    let themeConfig: ThemeRegistration | undefined = await getThemeConfigByName(themeName);
    // Always include built-in shiki themes for fallback
    const builtinThemes = ['light-plus', 'dark-plus', 'github-dark', 'github-light'];
    let themesToLoad;
    if (themeConfig) {
        // Register the theme with the label as its name
        themesToLoad = [...builtinThemes, themeConfig];
    } else {
        themesToLoad = builtinThemes;
    }
    highlighter = await createHighlighter({
        langs: ['java', 'javascript', 'typescript', 'json', 'xml', 'markdown'],
        themes: themesToLoad
    });

    async function getThemeConfigByName(themeName: string): Promise<ThemeRegistration | undefined> {
        for (const ext of vscode.extensions.all) {
            const themes = ext.packageJSON.contributes && ext.packageJSON.contributes.themes;
            if (!themes) continue;
            for (const theme of themes) {
                if (isThemeMatch(theme, themeName)) {
                    const themePath = vscode.Uri.joinPath(ext.extensionUri, theme.path);
                    try {
                        const buffer = await vscode.workspace.fs.readFile(themePath);
                        const themeConfig = JSON.parse(Buffer.from(buffer).toString('utf8'));
                        if (themeConfig) themeConfig.name = theme.id;
                        return themeConfig;
                    } catch (e) {
                        // Ignore parse errors for non-JSON themes
                    }
                }
            }
        }
        return undefined;
    }

    function isThemeMatch(theme: any, themeName: string): boolean {
        return theme.label === themeName || theme.id === themeName;
    }

    // Listen for theme changes using onDidChangeConfiguration
    vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration('workbench.colorTheme')) {
            const newThemeName = getCurrentThemeName();
            const themeConfig = await getThemeConfigByName(newThemeName);
            if (highlighter && themeConfig) {
                await highlighter.loadTheme(themeConfig);
                // If the preview panel is open, refresh it
                // if (hoverPanel) {
                //     await showJavadocPreview();
                // }
            }
        }
    });

    // Register the view provider in extension activation
    javadocPreviewViewProvider = new JavadocPreviewViewProvider(context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            JavadocPreviewViewProvider.viewType,
            javadocPreviewViewProvider
        )
    );

    // Listen for cursor changes in the active editor to refresh the view
    vscode.window.onDidChangeTextEditorSelection(async (e) => {
        if (javadocPreviewViewProvider) {
            await javadocPreviewViewProvider.refreshOnCursorChange();
        }
    });
}

function getCurrentThemeName(): string {
    const themeName = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme');
    return themeName || 'light-plus';
}

function getTheme(): string {
    // Try to match the current VS Code theme name to a loaded theme
    const themeName = getCurrentThemeName();
    if (highlighter && highlighter.getTheme(themeName)) {
        return themeName;
    }
    // Fallback to color kind
    const colorTheme = vscode.window.activeColorTheme;
    if (colorTheme.kind === vscode.ColorThemeKind.Dark) {
        return 'dark-plus';
    } else if (colorTheme.kind === vscode.ColorThemeKind.Light) {
        return 'light-plus';
    } else if (colorTheme.kind === vscode.ColorThemeKind.HighContrastLight) {
        return 'github-light';
    } else if (colorTheme.kind === vscode.ColorThemeKind.HighContrast) {
        return 'github-dark';
    } else {
        return 'light-plus';
    }
}

// Custom marked renderer for Shiki highlighting
const renderer = new marked.Renderer();
renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
    try {
        if (highlighter) {
            return highlighter.codeToHtml(text, { lang: lang || 'java', theme: getTheme() });
        }
    } catch { }
    // fallback
    return `<pre><code>${text}</code></pre>`;
};

class JavadocPreviewViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'javadoc-tools.javadocPreviewView';
    private _view?: vscode.WebviewView;

    constructor(private readonly context: vscode.ExtensionContext) { }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            enableCommandUris: true,
            enableForms: true,
        };
        this.update();
    }

    async update() {
        if (!this._view || !this._view.visible) return;
        const html = await getCurrentJavadocPreviewHtml();
        this._view.webview.html = html;
    }

    async refreshOnCursorChange() {
        if (this._view && this._view.visible) {
            await this.update();
        }
    }
}

let javadocPreviewViewProvider: JavadocPreviewViewProvider | undefined;

async function getCurrentJavadocPreviewHtml(): Promise<string> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return `<html><body><em>No active editor.</em></body></html>`;
    }
    const position = editor.selection.active;
    const document = editor.document;
    const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider',
        document.uri,
        position
    );
    if (!hovers || hovers.length === 0) {
        return `<html><body><em>No hover content found at cursor.</em></body></html>`;
    }
    let hoverHtml = '';
    for (const hover of hovers) {
        for (const content of hover.contents) {
            if (typeof content === 'string') {
                hoverHtml += marked.parse(content, { renderer });
            } else if (typeof content === 'object' && 'value' in content) {
                if ('language' in content && content.language) {
                    if (highlighter) {
                        hoverHtml += highlighter.codeToHtml(content.value, { lang: content.language, theme: getTheme() });
                    } else {
                        hoverHtml += await shiki.codeToHtml(content.value, { lang: content.language, theme: getTheme() });
                    }
                } else {
                    hoverHtml += marked.parse(content.value, { renderer });
                }
            }
        }
    }
    const shikiCss = `
        <style>
        pre.shiki, pre code, .shiki {
            background: var(--vscode-editor-background, #1e1e1e) !important;
            color: var(--vscode-editor-foreground, #d4d4d4) !important;
        }
        </style>
    `;
    return `<!DOCTYPE html><html><head>${shikiCss}</head><body><div id="hover-content">${hoverHtml}</div></body></html>`;
}

// Command to update the view (no reveal for panel views)
export async function showJavadocPreview() {
    if (javadocPreviewViewProvider) {
        await javadocPreviewViewProvider.refreshOnCursorChange();
    } else {
        vscode.window.showInformationMessage('Javadoc Preview view is not available.');
    }
}
