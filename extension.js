const OpenAI = require('openai-api');
const vscode = require('vscode');

const OPEN_AI_KEY_NAME = 'openai-api-key';

let baseFrameWork = 'NUnit';
let baseProgrammingLanguage = 'C#';
let basePromptStart = `Create unit tests using ${baseFrameWork} framework for the ${baseProgrammingLanguage} C# method: \n`;
let basePromptEnd = "\nProvide only code for copy without any additional info.";

const configuration = vscode.workspace.getConfiguration('easy-test-coverage-GPT');
const model = 'text-davinci-002';
const maxTokens = 2048;

let additionalPromt = '';
let openaiApiKey = '';

function activate(context) {

	initializeSubscriptions(context);

    openaiApiKey = configuration.get(OPEN_AI_KEY_NAME);
}

function initializeSubscriptions(context) {
	context.subscriptions.push(
        vscode.commands.registerCommand('easy-test-coverage-GPT.covertWithTestCommand', covertWithTest)
    );

	context.subscriptions.push(
        vscode.commands.registerCommand('easy-test-coverage-GPT.changeChatGPTApiKeyCommand', changeChatGPTApiKey)
    );
}

async function covertWithTest() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const selectedText = editor.selection;
    if (selectedText.isEmpty) {
        return;
    }
    const text = editor.document.getText(selectedText);

    checkApiKeyAvailable();

	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "Test coverage in progress..",
		cancellable: false
	}, async (progress, token) => {
		// @ts-ignore
		const openai = new OpenAI(openaiApiKey);
		
		try {
			const response = await openai.complete({
				engine: model,
				prompt: createPrompt(text, additionalPromt),
				maxTokens: maxTokens
			});

			console.log(response.data.choices[0].text);
			let responseText = response.data.choices[0].text + "\n";

			const endPos = selectedText.end;
			const newPosition = endPos.with(endPos.line + 1, 0);

			editor.edit(editBuilder => {
				editBuilder.insert(newPosition, responseText);
			});
		}catch (error) {
			console.error(error);
			vscode.window.showErrorMessage('Failed to generate test coverage');
		}
	});
}

function checkApiKeyAvailable() {
    if (!openaiApiKey) {
		changeChatGPTApiKey();
    }
}

function createPrompt(text, additionalPrompt) {
	return `${basePromptStart}${text}${additionalPrompt}${basePromptEnd}`;
  }

function setGPTApiKey(apiKey) {
    configuration.update('openai-api-key', apiKey, vscode.ConfigurationTarget.Global)
        .then(() => {
            vscode.window.showInformationMessage('OpenAI API key has been updated.');
            openaiApiKey = apiKey;
        })
        // @ts-ignore
        .catch((error) => {
            vscode.window.showErrorMessage('Failed to update OpenAI API key: ' + error.message);
        });
}

function changeChatGPTApiKey() {
	vscode.window.showInputBox({
		prompt: 'Please set your OpenAI API key',
		value: openaiApiKey
	}).then(apiKey => {
		setGPTApiKey(apiKey);
		return;
	});
}

function deactivate() {}


module.exports = {
    activate,
    deactivate
};

