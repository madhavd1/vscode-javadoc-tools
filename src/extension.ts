import * as vscode from 'vscode';
import { ExtensionContext, commands, window } from 'vscode';
import { JdocTools } from './jdocTools';
import * as open from 'open';
import * as consts from './Constants';
import * as fsUtils from './FSUtils';

const packageJSON = require('../package.json');
const path = require('path')

function ensureJavaHome(): string | undefined {
    let javaHome: string | undefined = vscode.workspace.getConfiguration().get('java.home');
    if (!javaHome) {
        javaHome = process.env.JAVA_HOME;
    }
    if (!javaHome) {
        vscode.window.showErrorMessage(
            'Javadoc Tools Error: Neither java.home (VS Code setting) nor JAVA_HOME (environment variable) is set. Please configure one of them to use Javadoc features.'
        );
        throw new Error('Javadoc Tools: No Java home found.');
    }
    return javaHome;
}

export function activate(context: ExtensionContext) {
    console.log('Javadoc Tools is now active');
    showUpgradeNotification(context);
    let disposable = commands.registerCommand('javadoc-tools.jdocGenerate', async () => {
        const activeEditor = window.activeTextEditor;
        JdocTools.createJdocCommentsCurrFile();
    });

    let disposable1 = commands.registerCommand('javadoc-tools.generateCommentsForWorkspace', () => {
        // vscode.window.showInformationMessage('Hello WorldForkers!');
        const items = [
            { label: consts.YES, description: 'Proceed with generating Javadoc comments for the workspace' },
            { label: consts.NO, description: 'Cancel' }
        ];
        vscode.window.showQuickPick(items, {
            placeHolder: consts.RUN_CONFIRM,
            canPickMany: false
        }).then((selected) => {
            if (selected && selected.label === consts.YES) {
                JdocTools.createJdocCommentsForWorkspace();
            } else if (selected && selected.label === consts.NO) {
                console.log('Javadoc Tools: User chose to cancel Workspace Javadoc creation');
            }
        });
    });

    let disposable2 = commands.registerCommand('javadoc-tools.jdocGenerateFromContext', (uri: vscode.Uri) => {
        console.log(uri);
        JdocTools.openFile(uri);
        // activeWindow.createTreeView('explorer',[]);
    });

    context.subscriptions.push(
        commands.registerCommand('javadoc-tools.generateCommentsForMethod', async () => {
            const activeEditor = window.activeTextEditor;
            if (activeEditor) {
                let methodsCurrFile = JdocTools.getMethodFromCurrDocument(activeEditor);
                methodsCurrFile.then((resolveMethods) => {
                    if (resolveMethods) {
                        let items = Object.values(resolveMethods).map((item) => ({
                            label: item.name
                        }));
                        // const quickPOptions = new vscode.qui
                        vscode.window
                            .showQuickPick(items, {
                                canPickMany: true,
                                placeHolder: 'Select the methods to generate Comments'
                            })
                            .then((resolveQP) => {
                                if (resolveQP) {
                                    let methodList: Array<vscode.DocumentSymbol | undefined> = new Array();
                                    for (const element of resolveQP) {
                                        let checkMethod = resolveMethods.filter((method) => method.name === element.label)[0];
                                        if (checkMethod) {
                                            methodList.push(checkMethod);
                                        }
                                    }
                                    if (methodList) {
                                        JdocTools.processMethods(methodList, activeEditor);
                                    }
                                }
                            });
                    }
                });
            }
        })
    );

    let disposable3 = commands.registerCommand('javadoc-tools.exportJavadoc', () => {
        let javaHome: string | undefined;
        try {
            javaHome = ensureJavaHome();
        } catch (e) {
            return;
        }
        //get workspace src folder
        let srcFolder = vscode.workspace.getConfiguration().get('javadoc-tools.generateJavadoc.workspaceSourceFolder');
        console.log('Source Folder: ' + srcFolder);

        let runMode = vscode.workspace.getConfiguration().get('javadoc-tools.generateJavadoc.runMode');
        let usingPwsh: string | undefined = vscode.workspace.getConfiguration().get('javadoc-tools.generateJavadoc.isUsingPwsh');
        console.log(vscode.workspace.getConfiguration().get('javadoc-tools.generateJavadoc.isUsingPwsh'));
        if (!srcFolder) {
            let workspaceFolders = vscode.workspace.workspaceFolders || [];
            if (workspaceFolders) {
                let items = workspaceFolders.map((item) => ({
                    label: item.name
                }));
                // const quickPOptions = new vscode.qui
                vscode.window
                    .showQuickPick(items, {
                        canPickMany: true,
                        placeHolder: 'Select the Workspace Root Folder to generate javadoc'
                    })
                    .then((selectedRoots) => {
                        if (selectedRoots) {
                            for (const element of selectedRoots) {
                                let root = workspaceFolders.filter((folder) => folder.name === element.label)[0];
                                let folder = root.uri.path + path.sep + 'src';
                                let fldrs: string[][] = [];
                                if (folder) {

                                    try {
                                        fldrs = fsUtils.getChildDir(folder);
                                        fldrs = fldrs.filter((fldr) => fsUtils.isDirectory(fldr[1]));
                                        console.log(fldrs);
                                    } catch (error) {
                                        vscode.window.showErrorMessage('Invalid Source Folder: ' + folder);
                                        return;
                                    }

                                    // fldrs = fldrs.map(fldr => fldr[0]);

                                }
                                let trgFolder = root.uri.fsPath + path.sep + 'javadoc';
                                let cmd =
                                    '"' +
                                    javaHome +
                                    path.sep + 'bin' + path.sep + 'javadoc" ' +
                                    runMode +
                                    ' -d "' +
                                    trgFolder +
                                    '" -sourcepath "' +
                                    folder +
                                    '" -subpackages ' +
                                    fldrs.map((fldr) => fldr[0]).join(' ');
                                if (usingPwsh !== 'false') {
                                    cmd = '&' + cmd;
                                }
                                let terminal = window.createTerminal('Export Javadoc - ' + element.label);
                                terminal.show();
                                terminal.sendText(cmd);
                            }
                        }

                    });
            }
        } else {
            let folder = vscode.workspace.rootPath + path.sep + srcFolder;
            let trgFolder = vscode.workspace.getConfiguration().get('javadoc-tools.generateJavadoc.targetFolder');
            if (!trgFolder) {
                trgFolder = vscode.workspace.rootPath + path.sep + 'javadoc';
            }
            console.log(trgFolder);



            let fldrs: string[][] = [];
            if (folder) {
                fldrs = fsUtils.getChildDir(folder);
                fldrs = fldrs.filter((fldr) => fsUtils.isDirectory(fldr[1]));
                // fldrs = fldrs.map(fldr => fldr[0]);
                console.log(fldrs);
            }
            let cmd =
                '"' +
                javaHome +
                path.sep + 'bin' + path.sep + 'javadoc" ' +
                runMode +
                ' -d "' +
                trgFolder +
                '" -sourcepath "' +
                srcFolder +
                '" -subpackages ' +
                fldrs.map((fldr) => fldr[0]).join(' ');
            if (usingPwsh !== 'false') {
                cmd = '&' + cmd;
            }
            let terminal = window.createTerminal('Export Javadoc');
            terminal.show();
            terminal.sendText(cmd);

        }


    });

    context.subscriptions.push(disposable, disposable1, disposable2, disposable3);
}

export function deactivate() { }

export function showUpgradeNotification(context: ExtensionContext) {
    let instldVersion = context.globalState.get(consts.INSTL_VER);
    console.log(instldVersion);
    if (packageJSON.version !== instldVersion) {
        vscode.window.showInformationMessage(consts.CHNGLOG_MSG, consts.BTN_SHOW_CHNGLOG, consts.BTN_DONT_SHOW, consts.BTN_REMIND_LATER).then((btn) => {
            if (btn === consts.BTN_SHOW_CHNGLOG) {
                open(consts.CHNGLOG_URI);
                context.globalState.update(consts.INSTL_VER, packageJSON.version);
            } else if (btn === consts.BTN_DONT_SHOW) {
                context.globalState.update(consts.INSTL_VER, packageJSON.version);
            }
        });
    }
}
