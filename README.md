# Javadoc Tools for Visual Studio Code

This extension allows user to generate javadoc comments for all methods within a class.
Below commands are available for use - 

## New Features (v1.8.0)
* **Javadoc Preview** - New Javadoc Preview webview added to the Explorer sidebar (can be moved to panel section too). The preview panel has syntax highlighting and live Markdown rendering, updating as the cursor moves. The preview always matches the current VS Code color theme, including dynamic theme switching.

![Explorer Preview](/img/explorerPreview.png)

![Panel Javadoc Preview](/img/panelJavadocPreview.png)


## Features
* **Javadoc Tools: Export Javadoc** - This command allows you to export your Javadoc. The command should be executed in a Workspace(Multi-root workspaces supported as of version 1.6.0)
  > Below properties can be set to customize this command
  > * **javadoc-tools.generateJavadoc.workspaceSourceFolder** - Sets the default source folder which is read when Generating the Javadoc. Default value is the \"src\" folder in Workspace Root
  > * **javadoc-tools.generateJavadoc.targetFolder** - Sets the target folder where the Javadoc will be generated. Default path will be ${WorkspaceRoot}\\javadoc
  > * **javadoc-tools.generateJavadoc.runMode** - Set value to run in corresponding mode. Default value is \"-public\". Possible values are ["-package","-private","-protected","-public"]
  > * **javadoc-tools.generateJavadoc.isUsingPwsh** - Set this property to true if you are using Powershell as your default Terminal

* **Javadoc Tools: Generate Comments for Select methods** - This command allows user to choose the methods for which javadoc comments need to be created. Can also be triggered from the right-click context menu within a file.
* **Javadoc Tools: Generate Javadoc Comments for Open File** - Only generates Javadoc Comments for the open File in focus
* **Javadoc Tools: Generate Javadoc Comments for Workspace** - Generates Javadoc for all classes within the workspace.
    The files will be opened in the editor and the javadoc comments will be added. This command will not autosave the modified Files.
    >Warning: Running this command on a large workspace may cause performance degradation AND will require you to wait longer while it processes the files(which is worse)
* **Generate Javadoc Comments** - New option added to the context menu for Java Clases. Generates Javadoc Comments for the selected class.

### Export Javadoc for your workspace
![Export javadoc](/img/export_javadoc.jpg)

### Generate Comments for Select methods
![Generate Comment for Select Method](/img/select_method.gif)

### Generate Javadoc Comments from Context Menu
![Generate Javadoc](/img/genFromContext.png)

### Generate Javadoc Comments for Open File/Workspace
![Generate Comments For Open File](/img/CmdPallete.png)

## Issues
For any problems with the extension please raise an issue on the github page - [https://github.com/madhavd1/vscode-javadoc-tools](https://github.com/madhavd1/vscode-javadoc-tools)
## Requirements
* [Language Support for Java(TM) by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.java)

## Most Recent Release Notes
### V1.8.0
- New Javadoc Preview webview added to the Explorer sidebar. The preview panel has syntax highlighting and live Markdown rendering, updating as the cursor moves. The preview always matches the current VS Code color theme, including dynamic theme switching. [Issue #31](https://github.com/madhavd1/vscode-javadoc-tools/issues/31).
- [Issue #24](https://github.com/madhavd1/vscode-javadoc-tools/issues/24) Added explicit check to ensure either "java.home" setting or "JAVA_HOME" env variable is present before preparting the export command.
- [Issue #25](https://github.com/madhavd1/vscode-javadoc-tools/issues/25) Added a new dialog box will allows you to choose which submodules to include in export. Also ignores hidden folders now.

>For complete version history, please see the [changelog](https://marketplace.visualstudio.com/items/madhavd1.javadoc-tools/changelog).
