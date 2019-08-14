# Javadoc Tools for Visual Studio Code

This extension allows user to generate javadoc comments for all methods within a class.
Below commands are available for use - 
* **Javadoc Tools: Generate Comments for Select methods** - This command allows user to choose the methods for which javadoc comments need to be created
* **Javadoc Tools: Generate Javadoc Comments for Open File** - Only generates Javadoc Comments for the open File in focus
* **Javadoc Tools: Generate Javadoc Comments for Workspace** - Generates Javadoc for all classes within the workspace.
    The files will be opened in the editor and the javadoc comments will be added. This command will not autosave the modified Files.
    >Warning: Running this command on a large workspace may cause performance degradation AND will require you to wait longer while it processes the files(which is worse)
* **Generate Javadoc Comments** - New option added to the context menu for Java Clases. Generates Javadoc Comments for the selected class.

## Features

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

## Release Notes
### V1.3.0
- Added new Command **Javadoc Tools: Generate Comments for Select methods** - This command allows user to choose the methods for which javadoc comments need to be created
- Minor bug fixes