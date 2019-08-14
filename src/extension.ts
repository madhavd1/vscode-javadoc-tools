import * as vscode from 'vscode';
import { ExtensionContext, commands, window } from 'vscode';
import { JdocTools } from './jdocTools';


export function activate(context: ExtensionContext) {

	console.log('Javadoc Tools is now active');

	let disposable = commands.registerCommand('javadoc-tools.jdocGenerate', async () => {
		const activeEditor = window.activeTextEditor;
		JdocTools.createJdocCommentsCurrFile();

		// vscode.window.showInformationMessage('Hello WorldForkers!');
	});

	let disposable1 = commands.registerCommand('javadoc-tools.generateCommentsForWorkspace', () => {
		JdocTools.createJdocCommentsForWorkspace();
	});


	let disposable2 = commands.registerCommand('javadoc-tools.jdocGenerateFromContext', (uri: vscode.Uri) => {
		console.log(uri);
		JdocTools.openFile(uri);
		// activeWindow.createTreeView('explorer',[]);
	});

	context.subscriptions.push(disposable, disposable1, disposable2);

	context.subscriptions.push(commands.registerCommand('javadoc-tools.generateCommentsForMethod', async () => {
		const activeEditor = window.activeTextEditor;
		if (activeEditor) {
			let methodsCurrFile = JdocTools.getMethodFromCurrDocument(activeEditor);
			methodsCurrFile.then((resolveMethods) => {
				if (resolveMethods) {
					let items = Object.values(resolveMethods).map(item => ({ label: item.name }));
					// const quickPOptions = new vscode.qui
					vscode.window.showQuickPick(items, { canPickMany: true, placeHolder: 'Select the methods to generate Comments' })
						.then((resolveQP) => {
							if (resolveQP) {
								let methodList: Array<vscode.DocumentSymbol | undefined> = new Array();
								for (const element of resolveQP) {
									let checkMethod = resolveMethods.filter(method => method.name == element.label)[0];
									if (checkMethod) {
										methodList.push(checkMethod);
									}
								}
								if (methodList) {
									JdocTools.processMethods(methodList, activeEditor);
								}
							}

						});
				}
			});

		}
	}));
}

export function deactivate() { }
