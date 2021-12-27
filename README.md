# Javadoc Tools for Visual Studio Code

This extension allows user to generate javadoc comments for all methods within a class.
Below commands are available for use - 
* **Javadoc Tools: Export Javadoc** - This command allows you to export your Javadoc as well!
  > Below properties can be set to customize this command
  > * **javadoc-tools.generateJavadoc.workspaceSourceFolder** - Sets the default source folder which is read when Generating the Javadoc. Default value is the \"src\" folder in Workspace Root
  > * **javadoc-tools.generateJavadoc.targetFolder** - Sets the target folder where the Javadoc will be generated. Default path will be ${WorkspaceRoot}\\javadoc
  > * **javadoc-tools.generateJavadoc.runMode** - Set value to run in corresponding mode. Default value is \"-public\". Possible values are ["-package","-private","-protected","-public"]
  > * **javadoc-tools.generateJavadoc.isUsingPwsh** - Set this property to true if you are using Powershell as your default Terminal

* **Javadoc Tools: Generate Comments for Select methods** - This command allows user to choose the methods for which javadoc comments need to be created
* **Javadoc Tools: Generate Javadoc Comments for Open File** - Only generates Javadoc Comments for the open File in focus
* **Javadoc Tools: Generate Javadoc Comments for Workspace** - Generates Javadoc for all classes within the workspace.
    The files will be opened in the editor and the javadoc comments will be added. This command will not autosave the modified Files.
    >Warning: Running this command on a large workspace may cause performance degradation AND will require you to wait longer while it processes the files(which is worse)
* **Generate Javadoc Comments** - New option added to the context menu for Java Clases. Generates Javadoc Comments for the selected class.

## Features

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
### V1.5.0
- Added a new Property `javadoc-tools.generateJavadoc.isUsingPwsh` which cane be set to true to support Powershell javadoc export. Thanks to @JoshJamesLS for pointing out the need for this.

>For complete version history, please see the changelog.