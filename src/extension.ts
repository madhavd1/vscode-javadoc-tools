import * as vscode from 'vscode';
import { ExtensionContext, commands, window } from 'vscode';
import { JdocTools } from './jdocTools';
import * as open from 'open';
import * as consts from './Constants';
import * as fsUtils from './FSUtils';

const packageJSON = require('../package.json');
const path = require('path')

export function activate(context: ExtensionContext) {
	console.log('Javadoc Tools is now active');
	showUpgradeNotification(context);
	let disposable = commands.registerCommand('javadoc-tools.jdocGenerate', async () => {
		const activeEditor = window.activeTextEditor;
		JdocTools.createJdocCommentsCurrFile();

		// vscode.window.showInformationMessage('Hello WorldForkers!');
	});

	let disposable1 = commands.registerCommand('javadoc-tools.generateCommentsForWorkspace', () => {
		vscode.window.showInformationMessage(consts.RUN_CONFIRM, consts.YES, consts.NO).then((btn) => {
			if (btn === consts.YES) {
				JdocTools.createJdocCommentsForWorkspace();
			} else if (btn === consts.NO) {
				console.log('Javadoc Tools: User chose to cancel Workspace Javadoc creation');
			}
		});
	});

	let disposable2 = commands.registerCommand('javadoc-tools.jdocGenerateFromContext', (uri: vscode.Uri) => {
		console.log(uri);
		JdocTools.openFile(uri);
		// activeWindow.createTreeView('explorer',[]);
	});

	context.subscriptions.push(
		commands.registerCommand('javadoc-tools.generateCommentsForMethod', async () => {
			const activeEditor = window.activeTextEditor;
			if (activeEditor) {
				let methodsCurrFile = JdocTools.getMethodFromCurrDocument(activeEditor);
				methodsCurrFile.then((resolveMethods) => {
					if (resolveMethods) {
						let items = Object.values(resolveMethods).map((item) => ({
							label: item.name
						}));
						// const quickPOptions = new vscode.qui
						vscode.window
							.showQuickPick(items, {
								canPickMany: true,
								placeHolder: 'Select the methods to generate Comments'
							})
							.then((resolveQP) => {
								if (resolveQP) {
									let methodList: Array<vscode.DocumentSymbol | undefined> = new Array();
									for (const element of resolveQP) {
										let checkMethod = resolveMethods.filter((method) => method.name === element.label)[0];
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
		})
	);

	let disposable3 = commands.registerCommand('javadoc-tools.exportJavadoc', () => {
		//get workspace src folder
		let fldrs: string[][] = [];
		let srcFolder = vscode.workspace.getConfiguration().get('javadoc-tools.generateJavadoc.workspaceSourceFolder');
		if (!srcFolder) {
			srcFolder = vscode.workspace.rootPath + path.sep + 'src';
		}
		if (typeof srcFolder === 'string') {
			fldrs = fsUtils.getChildDir(srcFolder);
			fldrs = fldrs.filter((fldr) => fsUtils.isDirectory(fldr[1]));
			// fldrs = fldrs.map(fldr => fldr[0]);
			console.log(fldrs);
		}
		console.log(srcFolder);

		let trgFolder = vscode.workspace.getConfiguration().get('javadoc-tools.generateJavadoc.targetFolder');
		if (!trgFolder) {
			trgFolder = vscode.workspace.rootPath + path.sep + 'javadoc';
		}
		console.log(trgFolder);

		let javaHome: string | undefined = vscode.workspace.getConfiguration().get('java.home');
		if (!javaHome) {
			javaHome = process.env.JAVA_HOME;
		}
		if (javaHome) {
			if (javaHome.endsWith(path.sep)) {
				javaHome.replace(path.sep + '$', '');
			}
		}

		let runMode = vscode.workspace.getConfiguration().get('javadoc-tools.generateJavadoc.runMode');
		let usingPwsh = vscode.workspace.getConfiguration().get('javadoc-tools.generateJavadoc.isUsingPwsh');
		if (fldrs) {
			let cmd =
				'"' +
				javaHome +
				path.sep + 'bin' + path.sep + 'javadoc" ' +
				runMode +
				' -d "' +
				trgFolder +
				'" -sourcepath "' +
				srcFolder +
				'" -subpackages ' +
				fldrs.map((fldr) => fldr[0]).join(' ');
			if (usingPwsh) {
				cmd = '&' + cmd;
			}
			let terminal = window.createTerminal('Export Javadoc');
			terminal.show();
			terminal.sendText(cmd);
		}
	});
	context.subscriptions.push(disposable, disposable1, disposable2, disposable3);
}

export function deactivate() {}

export function showUpgradeNotification(context: ExtensionContext) {
	let instldVersion = context.globalState.get(consts.INSTL_VER);
	console.log(instldVersion);
	if (packageJSON.version !== instldVersion) {
		vscode.window.showInformationMessage(consts.CHNGLOG_MSG, consts.BTN_SHOW_CHNGLOG, consts.BTN_DONT_SHOW, consts.BTN_REMIND_LATER).then((btn) => {
			if (btn === consts.BTN_SHOW_CHNGLOG) {
				open(consts.CHNGLOG_URI);
				context.globalState.update(consts.INSTL_VER, packageJSON.version);
			} else if (btn === consts.BTN_DONT_SHOW) {
				context.globalState.update(consts.INSTL_VER, packageJSON.version);
			}
		});
	}
}
