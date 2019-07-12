// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TIMEOUT } from 'dns';
import { throws } from 'assert';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hello-world" is now active!');
	function NoMethodsFound() {
		console.log("No Methods Found");
		vscode.window.showInformationMessage('No Methods found in current File');
	}

	function SymbolsNotFound() {
		console.log("No Symbols Found");
		vscode.window.showInformationMessage('No Symbols found in current File');
	}

	const JAVADOC_START = "\n/** ";
	const JAVADOC_PARAMS = '@param ';
	const JAVADOC_THROWS = '@throws ';
	const JAVADOC_RETURN = '@return ';
	const JAVADOC_END = '\n */';
	const ASTERISK = '\n * ';
	const NEW_LINE = '\n';

	function getMethods(symbols?: Array<vscode.DocumentSymbol> | undefined) {
		if (symbols) {
			let javaClassObj = symbols.find(element => element.kind === vscode.SymbolKind.Class);
			return javaClassObj ? javaClassObj.children.filter(element => element.kind === vscode.SymbolKind.Method) : undefined;
		} else {
			SymbolsNotFound();
			return;
		}
	}

	function StripComments(currLine: string): string {
		let originalText = currLine.trim();
		let evaluateMore = false;
		let javadocCommentStart = currLine.indexOf('/**');
		let multiLineCommentStart = currLine.indexOf('/*');
		let multiLineCommentEnd = currLine.indexOf('*/');
		let lineComment = currLine.indexOf('//');
		if (currLine === "" || currLine === undefined) {
			return "";
		}
		if (currLine.startsWith("//")) {//check if this is a line comment. Iff true then return blank
			return "";
		}
		else if (currLine.startsWith('/**') || currLine.startsWith('/*')) {//Check if this is beginning a multi line comment
			if (currLine.endsWith('*/')) {//if comment ends in same line, return blank
				return "";
			}
			else {//if comment does not end in same line
				if (multiLineCommentEnd > -1 && multiLineCommentEnd < currLine.length - 1) { //redundant check to make sure that comment does not end in same line
					// if (endIndex < currLine.length - 1) {
					return StripComments(currLine.substring(multiLineCommentEnd, currLine.length).trim()); //In case it ends in same line before the end of actual line, strip the comment part
					// evaluateMore=true;
					// console.log(returnText);
					// }
				} else {//else return blank - same as currLine.endsWith('*/')
					return "";
				}
			}

		}
		else if (currLine.startsWith('@')) {//ignoring this for now. Annotations to be handled in later release
			return "";
		}
		else if (lineComment > 1) {//if the comment starts in the middle of the line
			return StripComments(currLine.substring(0, lineComment));
		}
		else if (multiLineCommentStart > 0) {//if multiline or javadoc comment start 
			if (!currLine.endsWith('*/') && multiLineCommentEnd > -1) {
				return StripComments(currLine.substring(0, multiLineCommentStart) + currLine.substring(multiLineCommentEnd + 2, currLine.length));
			}
			else if (currLine.endsWith('*/')) {
				return StripComments(currLine.substring(0, multiLineCommentStart));
			}
		}
		else if (javadocCommentStart > 0) {//if multiline or javadoc comment start 
			if (!currLine.endsWith('*/') && multiLineCommentEnd > -1) {
				return StripComments(currLine.substring(0, multiLineCommentStart) + currLine.substring(multiLineCommentEnd + 2, currLine.length));
			}
			else if (currLine.endsWith('*/')) {
				return StripComments(currLine.substring(0, javadocCommentStart));
			}
		}
		else if (currLine.indexOf('{') > -1) {
			return StripComments(currLine.substring(0, currLine.indexOf('{')));
		}
		else if (currLine.indexOf('*') > -1) {
			if (multiLineCommentEnd > -1 && !currLine.endsWith('*/')) {
				return StripComments(currLine.substring(multiLineCommentEnd + 1, currLine.length));
			} else if (multiLineCommentEnd > -1 && currLine.endsWith('*/')) {
				return "";
			} else {
				return "";
			}
		}
		return currLine.trim();
	}

	function checkJdocExists(methodObj: vscode.DocumentSymbol, activeEditor: vscode.TextEditor): string | undefined {
		let existingJdoc;
		let methodText = activeEditor.document.getText(methodObj.range);
		let methodDefnText = methodText.substring(0, methodText.indexOf("{")).trim();//Complete method definition. May contain existing javadoc
		const tagsRegex = /((@param|@throws|@see|@returns|@author){1}[\s]+[\n]*([a-zA-Z_$0-9\s\n*]*))/g;

		if (methodDefnText.startsWith("/**") && methodDefnText.indexOf('*/') > -1) {
			existingJdoc = methodDefnText.substring(0, methodDefnText.indexOf("*/") + 2).trim();
			// let m;
			// if ((m = existingJdoc.match(tagsRegex)) !== null) {
			// 	let s = m.map(ele => ele.trim().split(" "));
			// 	console.log(m);
			// 	// m.forEach((match) => {
			// 	// 	jdArray.push(match);
			// 	// 	console.log(match);
			// 	// });
			// }
		}
		return existingJdoc;
	}

	let disposable = vscode.commands.registerCommand('extension.jdocGenerate', async () => {
		// The code you place here will be executed every time your command is executed
		const activeWindow = vscode.window;
		const activeEditor = activeWindow.activeTextEditor;
		// const regex = /([\s]*(@param|@throws)+[\s]+(.+))/g;
		// const tagsRegex = /((@param|@throws|@see|@returns|@author){1}[\s]+[\n]*([a-zA-Z_$]*)[\s\n]+(.+))/g;
		

		if (!activeEditor) {
			return;
		}
		let symbols: Array<vscode.DocumentSymbol> | undefined = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', activeEditor.document.uri);
		let methods = getMethods(symbols);
		if (!methods) {
			return;
		}
		let jdOffset = 0;
		methods.forEach(methodObj => {
			// let methodRange:vscode.Range= ;
			let methodDefnText = "";
			let defnFoundBoolean = false;
			let lineIndex = 0;
			let existingJdoc = checkJdocExists(methodObj, activeEditor);
			if (!existingJdoc) {
				do {
					let currLine = activeEditor.document.lineAt(methodObj.range.start.line + lineIndex).text.trim();// getText(methodObj.range);
					if (currLine.indexOf('{') > -1) {
						defnFoundBoolean = true;
					}
					methodDefnText = methodDefnText + StripComments(currLine);
					lineIndex++;
				} while (!defnFoundBoolean);
				console.log(methodDefnText);
				// methodDefnText = methodText.substring(0, methodText.indexOf("{")).trim();//Complete method definition. May contain existing javadoc
				let tagArray = new Map<string, string>();
				let javadocString: string = ""; //The final Javadoc string that will be inserted
				let targetPosition: vscode.Position = methodObj.range.start.with(methodObj.range.start.line + jdOffset, methodObj.range.start.character);

				//Start Processing params
				let paramStartIndex = methodDefnText.indexOf("(");
				let paramEndIndex = methodDefnText.indexOf(")");
				let paramString = methodDefnText.substring(paramStartIndex + 1, paramEndIndex).trim();
				let paramList;
				if (paramString !== undefined && paramString !== "") {
					paramList = paramString.split(",").map((element) => element.trim().split(" ").slice(-1).pop());
				} else {
					console.log("No Params Found for: " + methodObj.name);
					// vscode.window.showInformationMessage('No @Params Found for: ' + methodObj.name);
				}


				let throwsIndex = methodDefnText.lastIndexOf('throws');
				let throwsList;
				if (throwsIndex > -1) {
					throwsList = methodDefnText.substr(throwsIndex + 6, methodDefnText.length).trim().split(",").map((element) => element.trim());
				}
				//Format the Param Strings
				if (paramList) {
					// console.log(paramList);
					paramList.forEach(param => {
						javadocString += ASTERISK + JAVADOC_PARAMS + param;
						jdOffset += 1;
					});
				}
				//Format the Return String
				let returnType: string = methodObj.detail.substring(methodObj.detail.indexOf(":") + 1, methodObj.detail.length).trim(); //detail is in fact the return type
				if (returnType !== 'void') {
					javadocString += ASTERISK + JAVADOC_RETURN + returnType;
					jdOffset += 1;
				}
				//Format the Throws Strings
				if (throwsList) {
					throwsList.forEach(ex => {
						javadocString += ASTERISK + JAVADOC_THROWS + ex;
						jdOffset += 1;
					});
				}
				if (javadocString !== "") {
					let finalJDocString: vscode.SnippetString = new vscode.SnippetString(JAVADOC_START + javadocString + JAVADOC_END+NEW_LINE);
					activeEditor.insertSnippet(finalJDocString, targetPosition);
					jdOffset += 3;
				}
			}
		});
		vscode.window.showInformationMessage('Hello WorldForkers!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
