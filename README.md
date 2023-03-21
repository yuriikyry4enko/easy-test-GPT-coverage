# Easy GPT Test Coverage

This VS Code extension provides a convenient way to generate unit tests using the OpenAI API. It uses the text-davinci-002 model to generate test cases based on a given code snippet. The default programming language is C#, and the default framework is NUnit.

# Features

The extension provides the following commands:

- 'easy-test-coverage-GPT.covertWithTestCommand': Generates a unit test for the selected C# method using the configured parameters and OpenAI GPT. The generated code is then inserted at the end of the selection.

- 'easy-test-coverage-GPT.changeChatGPTApiKeyCommand': Allows you to update the OpenAI API key used by the extension.

# Requirements

To use this extension, you need an OpenAI API key.

# Extension Settings

This extension contributes the following settings:

easytestcoverage.apiKey: the OpenAI API key used to generate nUnit tests.

# Usage

1. Select a code snippet that you want to generate a unit test for.
2. Open the Command Palette (Ctrl + Shift + P).
3. Search for "Convert with Test" and select it.
4. Wait for the test to be generated and inserted into the editor.

# Configuration

To configure the extension, go to the VS Code settings and find the "Easy Test Coverage GPT" section.

- openai-api-key: Your OpenAI API key. This can be obtained from the OpenAI website.
- base-framework: The testing framework to use. The default value is NUnit.
- base-programming-language: The programming language to use. The default value is C#.
- additional-prompt: Additional prompt text to use when generating the test. This can be useful for adding context to the generated test.

# Commands

- 'Easy Test Coverage GPT: Convert with Test': Generates a unit test for the selected code snippet using the OpenAI API.
- 'Easy Test Coverage GPT: Change OpenAI API Key': Allows you to update your OpenAI API key.

# Known Issues

There are no known issues at this time.

# Release Notes

1.0.2

# Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on the GitHub repository.

# License

This extension is licensed under the MIT License.
