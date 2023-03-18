const OpenAI = require('openai-api');
// @ts-ignore
const openai = new OpenAI('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');
const vscode = require('vscode');

const model = 'text-davinci-002';
const maxTokens = 2048;
const basePrompt = "Create nUnit tests (only code without descuptions) with Mock if needed for this code: \n"
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	context.subscriptions.push(vscode.commands.registerCommand('easytestcoverage.copySelectionCommand', function () {
		
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
		  return;
		}
		const selection = editor.selection;

		if (selection.isEmpty) {
		  return;
		}
		covertWithTest();
	  }));

	context.subscriptions.push(
		vscode.commands.registerCommand('easytestcoverage.covertWithTestCommand', covertWithTest)
	  );
}

function covertWithTest() {
	const editorText = vscode.window.activeTextEditor;
	const selectedText = editorText.selection;
	const text = editorText.document.getText(selectedText);
	
	openai.complete({
		engine: model,
		prompt: basePrompt + text,
		maxTokens: maxTokens
	  })
	  .then(response => {
		console.log(response.data.choices[0].text);
		let responseText = response.data.choices[0].text + "\n";

		const endPos = selectedText.end;
		const newPosition = endPos.with(endPos.line + 1, 0);
		
		editorText.edit(editBuilder => {
		editBuilder.insert(newPosition, responseText);
		});
	  })
	  .catch(error => {
		console.error(error);
	  });	
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
