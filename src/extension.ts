import * as vscode from 'vscode';
import { TIMEOUT } from 'dns';
import { throws } from 'assert';
import {JdocTools} from './jdocTools';



export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "hello-world" is now active!');

	let disposable = vscode.commands.registerCommand('javadoc-tools.jdocGenerate', async () => {
		const activeEditor = vscode.window.activeTextEditor;
		JdocTools.createJdocCommentsCurrFile(activeEditor);

		// vscode.window.showInformationMessage('Hello WorldForkers!');
	});

	let disposable1 = vscode.commands.registerCommand('javadoc-tools.generateCommentsForWorkspace',()=>{
		JdocTools.createJdocCommentsForWorkspace();
	});

	context.subscriptions.push(disposable,disposable1);
}

export function deactivate() { }
