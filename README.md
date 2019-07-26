# Javadoc Tools for Visual Studio Code

This extension allows user to generate javadoc comments for all methods within a class.
There are two ways to generate the comments
 * **Generate Javadoc Comments for Open File** - Only generates Javadoc Comments for the open File in focus
 * **Generate Javadoc Comments for Workspace** - Generates Javadoc for all classes within the workspace.
    The files will be opened in the editor and the javadoc comments will be added. This command will not autosave the modified Files.
    >Warning: Running this command on a large workspace may cause performance degradation AND will require you to wait longer while it processes the files(which is worse)
* **Generate Javadoc Comments** - New option added to the context menu for Java Clases. Generates Javadoc Comments for the selected class.

## Features

### Generate Javadoc Comments
    
![Generate Javadoc](/img/generate-jdoc.gif)

## Requirements
* [Language Support for Java(TM) by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.java)

## Release Notes
### V1.2.0
- **Generate Javadoc Comments for Workspace** renamed as **Javadoc Tools: Generate Javadoc Comments for Workspace**
- **Generate Javadoc Comments for Open File** renamed as **Javadoc Tools: Generate Javadoc Comments for Open File**
- Added new command in the File Explorer Context Menu **Generate Javadoc Comments**