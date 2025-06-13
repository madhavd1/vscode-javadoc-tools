# Javadoc Tools for Visual Studio Code

A powerful extension to generate, preview, and export Javadoc comments for your Java projects in Visual Studio Code.

---

## ✨ New & Improved in v1.8.0

- **Javadoc Preview Panel**: Live Markdown/HTML preview of Javadoc comments in the Explorer sidebar, with Shiki-powered syntax highlighting and dynamic theme support.

---

## 🚀 Features

### Javadoc Generation
- **Generate for Workspace**: Add Javadoc comments to all classes in your workspace. (Manual save required after generation.)
- **Generate for Open File**: Quickly add Javadoc comments to the currently open Java file.
- **Generate for Selected Methods**: Choose specific methods to document via a QuickPick menu.
- **Context Menu Integration**: Right-click on a Java class or file to generate Javadoc comments instantly.

### Export Javadoc
- **Export HTML Javadoc**: Export your project's Javadoc as HTML using the `Export Javadoc` command. Multi-root workspaces supported.
- **Customizable**: Configure source/target folders, visibility, and shell options via settings.

### Live Preview
- **Explorer Sidebar Panel**: See a live, syntax-highlighted preview of your Javadoc as you edit.
- **Theme-Aware**: Preview always matches your VS Code color theme, including dynamic switching.

---

## 🛠️ Usage

### Commands
- `Javadoc Tools: Generate Javadoc Comments for Workspace`
- `Javadoc Tools: Generate Javadoc Comments for Open File`
- `Javadoc Tools: Generate Comments for Select Methods`
- `Javadoc Tools: Export Javadoc`
- `Javadoc Tools: Show Javadoc Preview`

Access these via the Command Palette (`Cmd+Shift+P`/`Ctrl+Shift+P`) or right-click context menus.

### Settings
- `javadoc-tools.generateJavadoc.workspaceSourceFolder`: Default source folder (default: `src`)
- `javadoc-tools.generateJavadoc.targetFolder`: Output folder for exported Javadoc (default: `${WorkspaceRoot}/javadoc`)
- `javadoc-tools.generateJavadoc.runMode`: Javadoc visibility (`-public`, `-protected`, etc.)
- `javadoc-tools.generateJavadoc.isUsingPwsh`: Set to `true` if using PowerShell

---

## 📸 Screenshots

**Javadoc Preview in Explorer Sidebar**

![Explorer Preview](/img/explorerPreview.png)

**Javadoc Preview in Panel**

![Panel Javadoc Preview](/img/panelJavadocPreview.png)

**Export Javadoc for Workspace**

![Export javadoc](/img/export_javadoc.jpg)

**Generate Comments for Select Methods**

![Generate Comment for Select Method](/img/select_method.gif)

**Generate Javadoc from Context Menu**

![Generate Javadoc](/img/genFromContext.png)

**Generate Comments for Open File/Workspace**

![Generate Comments For Open File](/img/CmdPallete.png)

---

## ⚠️ Notes & Warnings
- Workspace-wide Javadoc generation can be slow on large projects. You will be prompted with a full warning before proceeding.
- Generated comments are not auto-saved. Review and save your files after generation.

---

## 🐞 Issues & Feedback
For bugs, feature requests, or feedback, please open an issue on [GitHub](https://github.com/madhavd1/vscode-javadoc-tools).

---

## 📦 Requirements
- [Language Support for Java(TM) by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.java)

---

## 📜 Changelog
After each update, the changelog will open automatically in a dedicated tab. You can also view it [here](https://marketplace.visualstudio.com/items/madhavd1.javadoc-tools/changelog).

---

## 📝 Most Recent Release Notes
### V1.8.0
- New Javadoc Preview webview added to the Explorer sidebar. The preview panel has syntax highlighting and live Markdown rendering, updating as the cursor moves. The preview always matches the current VS Code color theme, including dynamic theme switching. [Issue #31](https://github.com/madhavd1/vscode-javadoc-tools/issues/31).
- [Issue #24](https://github.com/madhavd1/vscode-javadoc-tools/issues/24) Added explicit check to ensure either "java.home" setting or "JAVA_HOME" env variable is present before preparting the export command.
- [Issue #25](https://github.com/madhavd1/vscode-javadoc-tools/issues/25) Added a new dialog box will allows you to choose which submodules to include in export. Also ignores hidden folders now.

> For complete version history, see the [changelog](https://marketplace.visualstudio.com/items/madhavd1.javadoc-tools/changelog).
