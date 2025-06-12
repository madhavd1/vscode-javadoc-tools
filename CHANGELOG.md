# Change Log
### V1.8.0
- New Javadoc Preview webview added to the Explorer sidebar. The preview panel has syntax highlighting and live Markdown rendering, updating as the cursor moves. The preview always matches the current VS Code color theme, including dynamic theme switching. [Issue #31](https://github.com/madhavd1/vscode-javadoc-tools/issues/31).
- [Issue #24](https://github.com/madhavd1/vscode-javadoc-tools/issues/24) Added explicit check to ensure either "java.home" setting or "JAVA_HOME" env variable is present before preparting the export command.
- [Issue #25](https://github.com/madhavd1/vscode-javadoc-tools/issues/25) Added a new dialog box will allows you to choose which submodules to include in export. Also ignores hidden folders now.

### V1.7.0
- Fix for Multiple Issues reported for Javadoc Generation stopping after First Method. [Issue #23, #26 & #28]. Thanks @fynn-kropp for providing fix for the issue with asynchronous function inside the For-loop.
- Fixed logic for Filtering Methods Objects eligible for Javadoc Creation.
- Updated logic for Iterating methods in reverse order to eliminate unnecessary offset calculations and consequently fix placement of Javadoc comments in the code without any extra Whitespaces.
- Refactor command for generating comments in workspace to use quick pick for user confirmation

### V1.6.0
- Added Support for Multi Root Workspaces
- Fix for [Issue #15] - Can't export: path separator issues on mac (probably also linux) 
### V1.5.1
- **Javadoc Tools: Generate Comments for Select methods** command can now be triggered from the right click Context Menu within the file.
### V1.5.0
- Added a new Property `javadoc-tools.generateJavadoc.isUsingPwsh` which can be set to true to support Powershell javadoc export. Thanks to @JoshJamesLS for pointing out the need for this.
- Fixes [Issue #1](https://github.com/madhavd1/vscode-javadoc-tools/issues/1) - Getters, Setters, Equals, Hashcode etc. methods added by Lombok are ignored during Javadoc Comment creation.
- Improved handling for `Javadoc Tools: Generate Javadoc Comments for Workspace` command. It will now show proper warnings and a Progress Bar. The command can also be cancelled now.
### V1.4.0
- Added new command **Javadoc Tools: Export Javadoc** - This command allows you to export your Javadoc as well!
> More information about the new command can be found in README file

### V1.3.1
- Better handling for Spring Boot Projects
- Fixed issue where javadoc comments were added below the @ annotation instead of above it

### V1.3.0
- Added new Command **Javadoc Tools: Generate Comments for Select methods** - This command allows user to choose the methods for which javadoc comments need to be created
- Minor bug fixes

### V1.2.1
- Fix to remove Context Command from Pallete
- Fix to display Pallete commands in correct file types only

### V1.2.0
- **Generate Javadoc Comments for Workspace** renamed as **Javadoc Tools: Generate Javadoc Comments for Workspace**
- **Generate Javadoc Comments for Open File** renamed as **Javadoc Tools: Generate Javadoc Comments for Open File**
- Added new command in the File Explorer Context Menu **Generate Javadoc Comments**


### V1.1.0
- Added new Command **Generate Javadoc Comments for Workspace**
- Fixed handling of generics
- Improved comment handling
- Housekeeping -  Removed junk comments;Moved logic to new file;

### V1.0.0
- Initial Release -  Allows you to generate Javadoc Comments