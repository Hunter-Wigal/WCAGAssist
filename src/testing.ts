// Shoult not actually be used! 
// This code is for testing and is for reference only


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
	const disposable = vscode.commands.registerCommand('test1.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Test1!');
	});

	const disposable2 = vscode.commands.registerCommand('test1.copyFile', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user


		let filename = copyFile();

		if (filename){
			readCopiedFile(filename);
		}
	});

	const disposable3 = vscode.commands.registerCommand('test1.removeTable', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let filename = copyFile();
		if(filename){
			let fileData = readCopiedFile(filename);
			
			if (fileData.length > 0){
				let newData = removeTable(fileData);

				console.log(newData);
			}
		}
	});


	const disposable4 = vscode.commands.registerCommand('test1.removeTable2', ()=>{
		const editor = vscode.window.activeTextEditor;

		if (editor){
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
		else{
			vscode.window.showErrorMessage("No open text editor!");
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);
	context.subscriptions.push(disposable4);
}

// This method is called when your extension is deactivated
export function deactivate() { }


function copyFile() : string | undefined {
	vscode.window.showInformationMessage('Hello World from Test1!');

	let filename = vscode.window.activeTextEditor?.document.fileName;
	if (filename === undefined) {
		vscode.window.showErrorMessage("No file opened to modify");
		return;
	}
	filename = filename.replaceAll("\\", "/");

	let tempDir = process.cwd() + "/.vstemp/";
	if (!fs.existsSync(tempDir)) {
		fs.mkdirSync(tempDir);
	}
	let newFilename = tempDir + filename.substring(filename.lastIndexOf("/") + 1);
	if (!fs.existsSync(newFilename)) {
		vscode.window.showInformationMessage(tempDir + filename);
		fs.readFile(filename, "utf-8", (err, data) => {
			if (err) { throw err; }
			
			fs.writeFile(newFilename, data, (err) => {
				if (err) {
					vscode.window.showErrorMessage("Could not create temporary file: " + err?.message);
				}
			});
		});
	}
	else{
		vscode.window.showInformationMessage("File already copied");
	}

	return filename;
}


function readCopiedFile(filename: string): string{
	if(fs.existsSync(filename)){
		let data = fs.readFileSync(filename, "utf-8");
		return data ? data : "";
	}
	return "";
}

let tableStartRe = /(<table\s*([a-zA-Z0-9_-]*(="[^?]*?"\s*)*)*>)/g;
let tableEndRe = /(<\/table>)/g;

// TODO change to remove all or remove selection. I guess do that above
function removeTable(fileData: string): string{
	let newFileData = fileData;

	let lines = newFileData.split("\n");
	let newLines = [];

	for(let line of lines){
		let match = line.match(tableStartRe);
		let matched = false;

		if(match){
			line = line.replaceAll(tableStartRe, "");
			matched = true;
		}
		match = line.match(tableEndRe);
		if(match){
			line = line.replaceAll(tableEndRe, "");
			matched = true;
		}

		if(!matched){
			// No changes made to line
			newLines.push(line);
		}

		if(matched && line.trim().length > 0){
			// Changes made and line is not empty
			console.log(line.trim());
			newLines.push(line);
		}
	}
	// console.log(lines);
	newFileData = newLines.join("\n");


	return newFileData;
}