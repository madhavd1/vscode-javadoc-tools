import * as vscode from 'vscode';
import { TIMEOUT } from 'dns';
import { throws } from 'assert';
import {JdocTools} from './jdocTools';



export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "hello-world" is now active!');

	let disposable = vscode.commands.registerCommand('extension.jdocGenerate', async () => {
		const activeWindow = vscode.window;
		const activeEditor = activeWindow.activeTextEditor;
		JdocTools.createJdocCommentsCurrFile(activeEditor);

		// vscode.window.showInformationMessage('Hello WorldForkers!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
