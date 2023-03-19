const OpenAI = require('openai-api');
const vscode = require('vscode');

const OPEN_AI_KEY_NAME = 'openai-api-key';

const configuration = vscode.workspace.getConfiguration('easy-test-coverage-GPT');
const model = 'text-davinci-002';
const maxTokens = 2048;
const basePrompt = "Please write an nUnit test for the following code: \n"

let openaiApiKey = '';

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	
	openaiApiKey = configuration.get(OPEN_AI_KEY_NAME);

	context.subscriptions.push(vscode.commands.registerCommand('easy-test-coverage-GPT.covertWithTestCommand', function () {
		
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
}

function covertWithTest() {
	const editorText = vscode.window.activeTextEditor;
	const selectedText = editorText.selection;
	const text = editorText.document.getText(selectedText);
	
	checkApiKeyAvailable();

	// @ts-ignore
	const openai = new OpenAI(openaiApiKey);

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

function checkApiKeyAvailable(){
	if (!openaiApiKey) {
		// Prompt the user to enter their API key
		vscode.window.showInputBox({
			prompt: 'Please set your OpenAI API key',
			value: openaiApiKey
		}).then(apiKey => {
			// Set the API key in the configuration
			setApiKey(apiKey);
			return;
		});
	}
}

function setApiKey(apiKey) {
    configuration.update('openai-api-key', apiKey, vscode.ConfigurationTarget.Global)
        .then(() => {
            // Configuration parameter updated successfully
            vscode.window.showInformationMessage('OpenAI API key has been updated.');
			openaiApiKey = apiKey;
        })
        // @ts-ignore
        .catch((error) => {
            // Error updating configuration parameter
            vscode.window.showErrorMessage('Failed to update OpenAI API key: ' + error.message);
        });
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
