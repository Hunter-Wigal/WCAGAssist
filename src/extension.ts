// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "test1" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	const disposable = vscode.commands.registerCommand('wcagassist.removeTables', () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const docText = document.getText();

			// Create a range covering the entire document
			const firstLine = document.lineAt(0);
			const lastLine = document.lineAt(document.lineCount - 1);
			const entireRange = new vscode.Range(firstLine.range.start, lastLine.range.end);

			let newText = removeTable(docText);

			editor.edit(editBuilder => {
				editBuilder.replace(entireRange, newText);
			});
		}
		else {
			vscode.window.showErrorMessage("No open text editor!");
		}
	});

	context.subscriptions.push(disposable);
}


// Both start and end of table tag
let tableRe = /(<table\s*([a-zA-Z0-9_-]*(="[^?]*?"\s*)*)*>)|(<\/table>)/g;
let theadRe = /(<thead\s*([a-zA-Z0-9_-]*(="[^?]*?"\s*)*)*>)|(<\/thead>)/g;
let tbodyRe = /(<tbody\s*([a-zA-Z0-9_-]*(="[^?]*?"\s*)*)*>)|(<\/tbody>)/g;
let tdRe =/(<td\s*([a-zA-Z0-9_-]*(="[^?]*?"\s*)*)*>)|(<\/td>)/g;
let thRe = /(<th\s*([a-zA-Z0-9_-]*(="[^?]*?"\s*)*)*>)|(<\/th>)/g;
let trRe = /(<tr\s*([a-zA-Z0-9_-]*(="[^?]*?"\s*)*)*>)|(<\/tr>)/g;

// TODO change to remove all or remove selection. I guess do that above
function removeTable(fileData: string): string {
	let newFileData = fileData;

	let lines = newFileData.split("\n");
	let newLines = [];

	for (let line of lines) {
		let newLine = removeMatch(line, tableRe);
		newLine = removeMatch(newLine, theadRe);
		newLine = removeMatch(newLine, tbodyRe);
		newLine = removeMatch(newLine, trRe);
		newLine = removeMatch(newLine, tdRe);
		newLine = removeMatch(newLine, thRe);

		// Other matching above

		if(newLine !== null){
			// Null means empty, not needed line
			newLines.push(newLine);
		}
	}
	// console.log(lines);
	newFileData = newLines.join("\n");


	return newFileData;
}

function removeMatch(line: string | null, pattern: RegExp) : string | null {
	if(line === null){
		return null;
	}

	let match = line.search(pattern);
	let matched = false;

	if (match > 0) {
		line = line.replaceAll(pattern, "");
		matched = true;
	}

	if (!matched) {
		// No changes made to line
		return line;
	}

	if (matched && line.trim().length > 0) {
		// Changes made and line is not empty
		console.log(line.trim());
		return line;
	}

	return null;
}