# Change Log
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