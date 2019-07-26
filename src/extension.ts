import * as vscode from 'vscode';
import { TIMEOUT } from 'dns';
import { throws } from 'assert';
import {JdocTools} from './jdocTools';



export function activate(context: vscode.ExtensionContext) {

	console.log('Javadoc Tools is now active');

	let disposable = vscode.commands.registerCommand('javadoc-tools.jdocGenerate', async () => {
		const activeEditor = vscode.window.activeTextEditor;
		JdocTools.createJdocCommentsCurrFile();

		// vscode.window.showInformationMessage('Hello WorldForkers!');
	});

	let disposable1 = vscode.commands.registerCommand('javadoc-tools.generateCommentsForWorkspace',()=>{
		JdocTools.createJdocCommentsForWorkspace();
	});


	let disposable2 = vscode.commands.registerCommand('javadoc-tools.jdocGenerateFromContext', (uri: vscode.Uri)=>{
		console.log(uri);
		JdocTools.openFile(uri);
		// activeWindow.createTreeView('explorer',[]);
	});

	context.subscriptions.push(disposable,disposable1,disposable2);
}

export function deactivate() { }
