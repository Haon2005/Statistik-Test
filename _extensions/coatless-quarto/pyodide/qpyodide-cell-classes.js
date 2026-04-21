/**
 * Factory function to create different types of cells based on options.
 * @param {Object} cellData - JSON object containing code, id, and options.
 * @returns {BaseCell} Instance of the appropriate cell class.
 */
globalThis.qpyodideCreateCell = function(cellData) {
    switch (cellData.options.context) {
        case 'interactive':
            return new InteractiveCell(cellData);
        case 'output':
            return new OutputCell(cellData);
        case 'setup':
            return new SetupCell(cellData);
        default:
            return new InteractiveCell(cellData);
            // throw new Error('Invalid cell type specified in options.');
    }
}  

/**
 * CellContainer class for managing a collection of cells.
 * @class
 */
class CellContainer {
    /**
     * Constructor for CellContainer.
     * Initializes an empty array to store cells.
     * @constructor
     */
    constructor() {
        this.cells = [];
    }

    /**
     * Add a cell to the container.
     * @param {BaseCell} cell - Instance of a cell (BaseCell or its subclasses).
     */
    addCell(cell) {
        this.cells.push(cell);
    }

    /**
     * Execute all cells in the container.
     */
    async executeAllCells() {
        for (const cell of this.cells) {
            await cell.executeCode();
        }
    }

    /**
     * Execute all cells in the container.
     */
    async autoRunExecuteAllCells() {
        for (const cell of this.cells) {
            await cell.autoRunExecuteCode();
        }
    }
}
  

/**
 * BaseCell class for handling code execution using Pyodide.
 * @class
 */
class BaseCell {
    /**
     * Constructor for BaseCell.
     * @constructor
     * @param {Object} cellData - JSON object containing code, id, and options.
     */
    constructor(cellData) {
        this.code = cellData.code;
        this.id = cellData.id;
        this.options = cellData.options;
        this.insertionLocation = document.getElementById(`qpyodide-insertion-location-${this.id}`);
        this.executionLock = false;
    }

    cellOptions() {
        // Subclass this? 
        console.log(this.options);
        return this.options;
    }

    /**
     * Execute the Python code using Pyodide.
     * @returns {*} Result of the code execution.
     */
    async executeCode() {
        // Execute code using Pyodide
        const result = getPyodide().runPython(this.code);
        return result;
    }
};

/**
 * InteractiveCell class for creating editable code editor with Monaco Editor.
 * @class
 * @extends BaseCell
 */
class InteractiveCell extends BaseCell {

    /**
     * Constructor for InteractiveCell.
     * @constructor
     * @param {Object} cellData - JSON object containing code, id, and options.
     */
    constructor(cellData) {
        super(cellData);
        this.editor = null;
        this.setupElement();
        this.setupMonacoEditor();
    }

    /**
     * Set up the interactive cell elements
     */
    setupElement() {
        
        // Create main div element
        var mainDiv = document.createElement('div');
        mainDiv.id = `qpyodide-interactive-area-${this.id}`;
        mainDiv.className = `qpyodide-interactive-area`;
        if (this.options.classes) {
            mainDiv.className += " " + this.options.classes
        }

        // Add a unique cell identifier that users can customize
        if (this.options.label) {
            mainDiv.setAttribute('data-id', this.options.label);
        }

        // Create toolbar div
        var toolbarDiv = document.createElement('div');
        toolbarDiv.className = 'qpyodide-editor-toolbar';
        toolbarDiv.id = `qpyodide-editor-toolbar-${this.id}`;

        // Create a div to hold the left buttons
        var leftButtonsDiv = document.createElement('div');
        leftButtonsDiv.className = 'qpyodide-editor-toolbar-left-buttons';

         // Create a div for middle label
         var middleToolBarDiv = document.createElement('div');
         middleToolBarDiv.className = 'qpyodide-editor-toolbar-middle';

        // Create a div to hold the right buttons
        var rightButtonsDiv = document.createElement('div');
        rightButtonsDiv.className = 'qpyodide-editor-toolbar-right-buttons';

        // Create Run Code button
        var runCodeButton = document.createElement('button');
        runCodeButton.className = 'btn btn-default qpyodide-button qpyodide-button-run';
        runCodeButton.disabled = true;
        runCodeButton.type = 'button';
        runCodeButton.id = `qpyodide-button-run-${this.id}`;
        runCodeButton.textContent = '🟡 Loading Pyodide...';
        runCodeButton.title = `Run code (Shift + Enter)`;

        // Append buttons to the leftButtonsDiv
        leftButtonsDiv.appendChild(runCodeButton);

        // Create Read Only Label
        var readOnlyLabel = document.createElement('label');
        readOnlyLabel.className = 'qpyodide-label qpyodide-readonly-label';
        readOnlyLabel.type = 'label';
        readOnlyLabel.id = `qpyodide-readonly-label-${this.id}`;
        readOnlyLabel.textContent = "ReadOnly";
        readOnlyLabel.title = `Read Only`;

        // Append label to middleToolBar
        middleToolBarDiv.appendChild(readOnlyLabel);

        // Create Reset button
        var resetButton = document.createElement('button');
        resetButton.className = 'btn btn-light btn-xs qpyodide-button qpyodide-button-reset';
        resetButton.type = 'button';
        resetButton.id = `qpyodide-button-reset-${this.id}`;
        resetButton.title = 'Start over';
        resetButton.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i>';

        // Create Copy button
        var copyButton = document.createElement('button');
        copyButton.className = 'btn btn-light btn-xs qpyodide-button qpyodide-button-copy';
        copyButton.type = 'button';
        copyButton.id = `qpyodide-button-copy-${this.id}`;
        copyButton.title = 'Copy code';
        copyButton.innerHTML = '<i class="fa-regular fa-copy"></i>';

        if (globalThis.feedback == true){
            // Create Feedback button
            var feedbackButton = document.createElement('button');
            feedbackButton.className = 'btn  btn-default qpyodide-button qpyodide-button-feedback';
            feedbackButton.disabled = true;
            feedbackButton.type = 'button';
            feedbackButton.id = `qpyodide-button-feedback-${this.id}`;
            feedbackButton.title = 'Give feedback';
            feedbackButton.textContent = "Feedback";
        }

        // Create AddCodeBlockButton button
        var addCodeBlockButton = document.createElement('button');
        addCodeBlockButton.className = 'btn  btn-default qpyodide-button qpyodide-button-codeblock';
        addCodeBlockButton.type = 'button';
        addCodeBlockButton.id = `qpyodide-button-codeblock-${this.id}`;
        addCodeBlockButton.title = 'Add Codeblock';
        if (this.options['read-only']== "false"){
            addCodeBlockButton.textContent = "AddNewCodeBlock";
        }else{
            addCodeBlockButton.textContent = "AddCodeBlock";
        }
        

        // Append buttons to the rightButtonsDiv
        rightButtonsDiv.appendChild(resetButton);
        rightButtonsDiv.appendChild(copyButton);
        if (globalThis.feedback == true && this.options['read-only'] == "false") {
            rightButtonsDiv.appendChild(feedbackButton);
        }
        rightButtonsDiv.appendChild(addCodeBlockButton);

        // Create console area div
        var consoleAreaDiv = document.createElement('div');
        consoleAreaDiv.id = `qpyodide-console-area-${this.id}`;
        consoleAreaDiv.className = 'qpyodide-console-area';

        // Create editor div
        var editorDiv = document.createElement('div');
        editorDiv.id = `qpyodide-editor-${this.id}`;
        editorDiv.className = 'qpyodide-editor';

        // Create output code area div
        var outputCodeAreaDiv = document.createElement('div');
        outputCodeAreaDiv.id = `qpyodide-output-code-area-${this.id}`;
        outputCodeAreaDiv.className = 'qpyodide-output-code-area';
        outputCodeAreaDiv.setAttribute('aria-live', 'assertive');

        // Create pre element inside output code area
        var preElement = document.createElement('pre');
        preElement.style.visibility = 'hidden';
        outputCodeAreaDiv.appendChild(preElement);

        if (globalThis.feedback == true){
            // Create output feedback area div
            var outputFeedbackAreaDiv = document.createElement('div');
            outputFeedbackAreaDiv.id = `qpyodide-output-feedback-area-${this.id}`;
            outputFeedbackAreaDiv.className = 'qpyodide-output-feedback-area';
            outputFeedbackAreaDiv.setAttribute('aria-live', 'assertive');
        }

        // Create output graph area div
        var outputGraphAreaDiv = document.createElement('div');
        outputGraphAreaDiv.id = `qpyodide-output-graph-area-${this.id}`;
        outputGraphAreaDiv.className = 'qpyodide-output-graph-area';

        // Create the collapsible `details` and `summary` element
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        details.open = true; // Open by default
        summary.textContent = "Show Python Code"; // Text for the summary element

        // Add the toolbar and console to `details`
        details.appendChild(summary);
        details.appendChild(toolbarDiv); // Add the toolbar

        // Add the console area (editorDiv and outputCodeAreaDiv) to `details`
        consoleAreaDiv.appendChild(editorDiv);
        consoleAreaDiv.appendChild(outputCodeAreaDiv);
        if (globalThis.feedback == true && this.options['read-only'] === "false") {
            consoleAreaDiv.appendChild(outputFeedbackAreaDiv);
        }

        details.appendChild(consoleAreaDiv); // Add the console
        details.appendChild(outputGraphAreaDiv); // Add the output graph area

        // Append the `details` element to the main div
        mainDiv.appendChild(details);


        // Append buttons to the toolbar
        toolbarDiv.appendChild(leftButtonsDiv);
        toolbarDiv.appendChild(middleToolBarDiv);
        toolbarDiv.appendChild(rightButtonsDiv);

        // Insert the dynamically generated object at the document location.
        this.insertionLocation.appendChild(mainDiv);
    }
    


    setupNewElement() {

        // Create main div element
        this.id = this.id+".2";
         
        // Create details element
        var detailsElement = document.createElement('details');
        detailsElement.id = `qpyodide-details-${this.id}`;
        detailsElement.open = true; 

        // Create summary element
        var summaryElement = document.createElement('summary');
        summaryElement.textContent = "Show Python Code"; // Text for the summary
        summaryElement.className = "qpyodide-summary"; // Optional class for styling

        // Append summary to details
        detailsElement.appendChild(summaryElement);

        var mainDiv = document.createElement('div');
        mainDiv.id = `qpyodide-interactive-area-${this.id}`;
        mainDiv.className = `qpyodide-interactive-area`;
        if (this.options.classes) {
            mainDiv.className += " " + this.options.classes
        }

        // Add a unique cell identifier that users can customize
        if (this.options.label) {
            mainDiv.setAttribute('data-id', this.options.label);
        }

        // Create toolbar div
        var toolbarDiv = document.createElement('div');
        toolbarDiv.className = 'qpyodide-editor-toolbar';
        toolbarDiv.id = `qpyodide-editor-toolbar-${this.id}`;

        // Create a div to hold the left buttons
        var leftButtonsDiv = document.createElement('div');
        leftButtonsDiv.className = 'qpyodide-editor-toolbar-left-buttons';

         // Create a div for middle label
         var middleToolBarDiv = document.createElement('div');
         middleToolBarDiv.className = 'qpyodide-editor-toolbar-middle';

        // Create a div to hold the right buttons
        var rightButtonsDiv = document.createElement('div');
        rightButtonsDiv.className = 'qpyodide-editor-toolbar-right-buttons';

        // Create Run Code button
        var runCodeButton = document.createElement('button');
        runCodeButton.className = 'btn btn-default qpyodide-button qpyodide-button-run';
        runCodeButton.disabled = true;
        runCodeButton.type = 'button';
        runCodeButton.id = `qpyodide-button-run-${this.id}`;
        runCodeButton.textContent = '🟡 Loading Pyodide...';
        runCodeButton.title = `Run code (Shift + Enter)`;

        // Append buttons to the leftButtonsDiv
        leftButtonsDiv.appendChild(runCodeButton);

        // Create Read Only Label
        var readOnlyLabel = document.createElement('label');
        readOnlyLabel.className = 'qpyodide-label qpyodide-readonly-label';
        readOnlyLabel.type = 'label';
        readOnlyLabel.id = `qpyodide-readonly-label-${this.id}`;
        readOnlyLabel.textContent = "ReadOnly";
        readOnlyLabel.title = `Read Only`;

        // Append label to middleToolBar
        middleToolBarDiv.appendChild(readOnlyLabel);

        // Create Reset button
        var resetButton = document.createElement('button');
        resetButton.className = 'btn btn-light btn-xs qpyodide-button qpyodide-button-reset';
        resetButton.type = 'button';
        resetButton.id = `qpyodide-button-reset-${this.id}`;
        resetButton.title = 'Start over';
        resetButton.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i>';

        // Create Copy button
        var copyButton = document.createElement('button');
        copyButton.className = 'btn btn-light btn-xs qpyodide-button qpyodide-button-copy';
        copyButton.type = 'button';
        copyButton.id = `qpyodide-button-copy-${this.id}`;
        copyButton.title = 'Copy code';
        copyButton.innerHTML = '<i class="fa-regular fa-copy"></i>';

        if (globalThis.feedback == true){
            // Create Feedback button
            var feedbackButton = document.createElement('button');
            feedbackButton.className = 'btn  btn-default qpyodide-button qpyodide-button-feedback';
            feedbackButton.disabled = true;
            feedbackButton.type = 'button';
            feedbackButton.id = `qpyodide-button-feedback-${this.id}`;
            feedbackButton.title = 'Give feedback';
            feedbackButton.textContent = "Feedback";
        }

        // Append buttons to the rightButtonsDiv
        rightButtonsDiv.appendChild(resetButton);
        rightButtonsDiv.appendChild(copyButton);
        if (globalThis.feedback == true){
            rightButtonsDiv.appendChild(feedbackButton);
        }

        // Create console area div
        var consoleAreaDiv = document.createElement('div');
        consoleAreaDiv.id = `qpyodide-console-area-${this.id}`;
        consoleAreaDiv.className = 'qpyodide-console-area';

        // Create editor div
        var editorDiv = document.createElement('div');
        editorDiv.id = `qpyodide-editor-${this.id}`;
        editorDiv.className = 'qpyodide-editor';

        // Create output code area div
        var outputCodeAreaDiv2 = document.createElement('div');
        outputCodeAreaDiv2.id = `qpyodide-output-code-area-${this.id}`;
        outputCodeAreaDiv2.className = 'qpyodide-output-code-area';
        outputCodeAreaDiv2.setAttribute('aria-live', 'assertive');

        // Create pre element inside output code area
        var preElement = document.createElement('pre');
        preElement.style.visibility = 'hidden';
        outputCodeAreaDiv2.appendChild(preElement);

        if (globalThis.feedback == true){
            // Create output feedback area div
            var outputFeedbackAreaDiv2 = document.createElement('div');
            outputFeedbackAreaDiv2.id = `qpyodide-output-feedback-area-${this.id}`;
            outputFeedbackAreaDiv2.className = 'qpyodide-output-feedback-area';
            outputFeedbackAreaDiv2.setAttribute('aria-live', 'assertive');
        }

        // Create output graph area div
        var outputGraphAreaDiv2 = document.createElement('div');
        outputGraphAreaDiv2.id = `qpyodide-output-graph-area-${this.id}`;
        outputGraphAreaDiv2.className = 'qpyodide-output-graph-area';

        // Append buttons to the toolbar
        toolbarDiv.appendChild(leftButtonsDiv);
        toolbarDiv.appendChild(middleToolBarDiv);
        toolbarDiv.appendChild(rightButtonsDiv);
        

        // Append all elements to the main div
        mainDiv.appendChild(toolbarDiv);
        consoleAreaDiv.appendChild(editorDiv);
        consoleAreaDiv.appendChild(outputCodeAreaDiv2);
        if (globalThis.feedback == true){
            consoleAreaDiv.appendChild(outputFeedbackAreaDiv2);
        }
        mainDiv.appendChild(consoleAreaDiv);
        mainDiv.appendChild(outputGraphAreaDiv2);

        // Append main div to details
        detailsElement.appendChild(mainDiv);

        // Insert the details element at the document location.
        this.insertionLocation.appendChild(detailsElement);

        // Unlock interactive buttons
        qpyodideSetInteractiveButtonState(
        `<i class="fa-solid fa-play qpyodide-icon-run-code"></i> <span>Run Code</span>`, 
        true
        ); 
    }; 

      

    /**
     * Set up Monaco Editor for code editing.
     */
    setupMonacoEditor() {
        // Retrieve the previously created document elements
        this.runButton = document.getElementById(`qpyodide-button-run-${this.id}`);
        this.resetButton = document.getElementById(`qpyodide-button-reset-${this.id}`);
        this.copyButton = document.getElementById(`qpyodide-button-copy-${this.id}`);
        this.feedbackButton = document.getElementById(`qpyodide-button-feedback-${this.id}`);
        this.addCodeBlockButton = document.getElementById(`qpyodide-button-codeblock-${this.id}`);
        this.readOnlyLabel = document.getElementById(`qpyodide-readonly-label-${this.id}`);
        this.editorDiv = document.getElementById(`qpyodide-editor-${this.id}`);
        this.outputCodeDiv = document.getElementById(`qpyodide-output-code-area-${this.id}`);
        this.outputFeedbackDiv = document.getElementById(`qpyodide-output-feedback-area-${this.id}`);
        this.outputGraphDiv = document.getElementById(`qpyodide-output-graph-area-${this.id}`);
        
        // Store reference to the object
        var thiz = this;

        if (thiz.options['read-only'] == "true") {
            thiz.editorDiv.parentElement.previousElementSibling.style.backgroundColor = "#cecece";
            thiz.readOnlyLabel.textContent = "Read-Only";
        } else {
            thiz.editorDiv.parentElement.previousElementSibling.style.backgroundColor = "#bdecb6";
            thiz.readOnlyLabel.textContent = "Editable";
        }

        // Load the Monaco Editor and create an instance
        require(['vs/editor/editor.main'], function () {
            thiz.editor = monaco.editor.create(
                thiz.editorDiv, {
                    value: thiz.code,
                    language: 'python',
                    theme: 'vs-light',
                    automaticLayout: true,           // Works wonderfully with RevealJS
                    scrollBeyondLastLine: false,
                    minimap: {
                        enabled: false
                    },
                    fontSize: '17.5pt',              // Bootstrap is 1 rem
                    renderLineHighlight: "none",     // Disable current line highlighting
                    hideCursorInOverviewRuler: true,  // Remove cursor indictor in right hand side scroll bar
                    readOnly: thiz.options['read-only'] ?? false
                }
            );
        
            // Store the official counter ID to be used in keyboard shortcuts
            thiz.editor.__qpyodideCounter = thiz.id;
        
            // Store the official div container ID
            thiz.editor.__qpyodideEditorId = `qpyodide-editor-${thiz.id}`;
        
            // Store the initial code value and options
            thiz.editor.__qpyodideinitialCode = thiz.code;
            thiz.editor.__qpyodideOptions = thiz.options;
        
            // Set at the model level the preferred end of line (EOL) character to LF.
            // This prevent `\r\n` from being given to the Pyodide engine if the user is on Windows.
            // See details in: https://github.com/coatless/quarto-Pyodide/issues/94
            // Associated error text: 
            // Error: <text>:1:7 unexpected input
        
            // Retrieve the underlying model
            const model = thiz.editor.getModel();
            // Set EOL for the model
            model.setEOL(monaco.editor.EndOfLineSequence.LF);
        
            // Dynamically modify the height of the editor window if new lines are added.
            let ignoreEvent = false;
            const updateHeight = () => {
            const contentHeight = thiz.editor.getContentHeight();
            // We're avoiding a width change
            //editorDiv.style.width = `${width}px`;
            thiz.editorDiv.style.height = `${contentHeight}px`;
                try {
                    ignoreEvent = true;
            
                    // The key to resizing is this call
                    thiz.editor.layout();
                } finally {
                    ignoreEvent = false;
                }
            };
        
            // Helper function to check if selected text is empty
            function isEmptyCodeText(selectedCodeText) {
                return (selectedCodeText === null || selectedCodeText === undefined || selectedCodeText === "");
            }
        
            // Registry of keyboard shortcuts that should be re-added to each editor window
            // when focus changes.
            const addPyodideKeyboardShortCutCommands = () => {
            // Add a keydown event listener for Shift+Enter to run all code in cell
            thiz.editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
                // Retrieve all text inside the editor
                thiz.runCode(thiz.editor.getValue());
                thiz.outputCodeDiv.classList.add('has-content');
            });
        
            // Add a keydown event listener for CMD/Ctrl+Enter to run selected code
            thiz.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                    // Get the selected text from the editor
                    const selectedText = thiz.editor.getModel().getValueInRange(thiz.editor.getSelection());
                    // Check if no code is selected
                    if (isEmptyCodeText(selectedText)) {
                        // Obtain the current cursor position
                        let currentPosition = thiz.editor.getPosition();
                        // Retrieve the current line content
                        let currentLine = thiz.editor.getModel().getLineContent(currentPosition.lineNumber);
                
                        // Propose a new position to move the cursor to
                        let newPosition = new monaco.Position(currentPosition.lineNumber + 1, 1);
                
                        // Check if the new position is beyond the last line of the editor
                        if (newPosition.lineNumber > thiz.editor.getModel().getLineCount()) {
                            // Add a new line at the end of the editor
                            thiz.editor.executeEdits("addNewLine", [{
                            range: new monaco.Range(newPosition.lineNumber, 1, newPosition.lineNumber, 1),
                            text: "\n", 
                            forceMoveMarkers: true,
                            }]);
                        }
                        
                        // Run the entire line of code.
                        thiz.runCode(currentLine);
                
                        // Move cursor to new position
                        thiz.editor.setPosition(newPosition);
                    } else {
                        // Code to run when Ctrl+Enter is pressed with selected code
                        thiz.runCode(selectedText);
                    }
                    thiz.outputCodeDiv.classList.add('has-content');
                });
            }
        
            // Register an on focus event handler for when a code cell is selected to update
            // what keyboard shortcut commands should work.
            // This is a workaround to fix a regression that happened with multiple
            // editor windows since Monaco 0.32.0 
            // https://github.com/microsoft/monaco-editor/issues/2947
            thiz.editor.onDidFocusEditorText(addPyodideKeyboardShortCutCommands);
        
            // Register an on change event for when new code is added to the editor window
            thiz.editor.onDidContentSizeChange(updateHeight);
        
            // Manually re-update height to account for the content we inserted into the call
            updateHeight();
                
        });

        
        // Add a click event listener to the run button
        thiz.runButton.onclick = function () {
            thiz.runCode(
                thiz.editor.getValue()
            );
            thiz.outputCodeDiv.classList.add('has-content');
        };
        
        // Add a click event listener to the copy button
        thiz.copyButton.onclick = function () {
            // Retrieve current code data
            const data = thiz.editor.getValue();
            
            // Write code data onto the clipboard.
            navigator.clipboard.writeText(data || "");
        };
        
        // Add a click event listener to the reset button
        thiz.resetButton.onclick = function () {
            thiz.editor.setValue(thiz.editor.__qpyodideinitialCode);
            if(thiz.outputFeedbackDiv.classList.contains('has-content')){
                thiz.outputFeedbackDiv.innerHTML = "";
            }
            if(thiz.outputCodeDiv.classList.contains('has-content')){
                thiz.outputCodeDiv.innerHTML = "";
            }
            if(thiz.outputGraphDiv.classList.contains('has-content')){
                thiz.outputGraphDiv.innerHTML = "";
            }
        };

        if (thiz.options['read-only'] == "false") {
            
            document.addEventListener('DOMContentLoaded', function () {
                if(globalThis.backend == "groq"){
                    // Check if an API key is stored in sessionStorage
                    const storedApiKey = sessionStorage.getItem('apiKey');
                    if (storedApiKey) {
                        document.getElementById('apiKeyInput').value = storedApiKey;
                    }
                }

            // Add a click event listener to the feedback button
            thiz.feedbackButton.onclick = async function () {
                const system_prompt = "You are an AI Assistant, specialized in coding issues. You give concise answers, without asking further questions.";
                const prompt1 = "Review the following Python code for errors and provide feedback. The code output, including any syntax errors, will be provided for detailed analysis. This is the source code of the user:\n"; 
                const prompt2 = "Your feedback should highlight both the strengths of the code and any potential errors, providing explanations where necessary. While you may offer tips for improvement, avoid providing exact code solutions. Focus on guiding the user towards better practices and understanding. Structure the feedback like this: Syntax errors: \n Strengths of the code: \n Potential improvements:\n ";    
                // Retrieve current code data  
                const data = thiz.editor.getValue();
                

                let runtime_message;
                try {
                    // Check if we have an execution lock
                    if (thiz.executeLock) return; 
                    
                    thiz.disableInteractiveCells();

                    // Force wait procedure
                    await mainPyodide;

                    // Clear the output stock
                    qpyodideResetOutputArray();

                    // Obtain results from the base class
                    try {
                        // Always check to see if the user adds new packages
                        await mainPyodide.loadPackagesFromImports(data);

                        // Process result
                        const output = await mainPyodide.runPythonAsync(data);

                        // Add output
                        qpyodideAddToOutputArray(output, "stdout");
                    } catch (err) {
                        // Add error message
                        qpyodideAddToOutputArray(err, "stderr");
                        // TODO: There has to be a way to remove the Pyodide portion of the errors... 
                    }

                runtime_message = qpyodideRetrieveOutput(); 
                // Re-enable execution
                thiz.enableInteractiveCells();
                } catch (error) {
                    runtime_message = `Error: ${error.message}`;
                }
                const runtime_prompt = "\nHere is the output of the python interpreter:\n";

            

                if(globalThis.backend == "copyPrompt"){
                    // Generate a copyable prompt for any AI chatbot
                    const promptText =
`Ich brauche Hilfe mit meinem Python-Code aus einem Statistik-Tutorial.

**Mein Code:**
\`\`\`python
${data}
\`\`\`

**Ausgabe / Fehlermeldung:**
\`\`\`
${runtime_message || "(keine Ausgabe)"}
\`\`\`

Bitte erkläre mir, was der Code macht, ob es Fehler gibt und wie ich sie beheben kann. Gib mir keine fertige Lösung, sondern hilf mir zu verstehen, was falsch ist.`;

                    thiz.outputFeedbackDiv.innerHTML = "";

                    const headerDiv = document.createElement("div");
                    headerDiv.style.fontWeight = "bold";
                    headerDiv.style.marginBottom = "8px";
                    headerDiv.style.fontSize = "1em";
                    headerDiv.textContent = "💡 KI-Prompt generiert – kopiere ihn in ChatGPT, Claude oder einen anderen KI-Assistenten:";
                    thiz.outputFeedbackDiv.appendChild(headerDiv);

                    const preEl = document.createElement("pre");
                    preEl.style.cssText = "white-space:pre-wrap;background:#f4f4f4;color:#222;border:1px solid #ccc;border-radius:4px;padding:10px;font-size:0.85em;margin:6px 0;";
                    preEl.textContent = promptText;
                    thiz.outputFeedbackDiv.appendChild(preEl);

                    const copyBtn = document.createElement("button");
                    copyBtn.textContent = "📋 Prompt kopieren";
                    copyBtn.style.cssText = "margin-top:4px;padding:4px 12px;cursor:pointer;border-radius:4px;border:1px solid #aaa;background:#e8e8e8;";
                    copyBtn.onclick = function() {
                        navigator.clipboard.writeText(promptText).then(() => {
                            copyBtn.textContent = "✅ Kopiert!";
                            setTimeout(() => { copyBtn.textContent = "📋 Prompt kopieren"; }, 2000);
                        });
                    };
                    thiz.outputFeedbackDiv.appendChild(copyBtn);
                }

                if(globalThis.backend == "groq"){
                    alert('Kein API-Key konfiguriert. Bitte nutze den "copyPrompt"-Modus.');
                }

                if(globalThis.backend == "flask"){
                    alert('Flask-Backend nicht verfügbar.');
                }

                thiz.outputFeedbackDiv.classList.add('has-content');
                };
            })};


            // Add an event listener to call the function when the button is clicked
            thiz.addCodeBlockButton.onclick = function () {
                thiz.setupNewElement();
                thiz.setupNewMonacoEditor();
                thiz.addCodeBlockButton.disabled = true;
            };  
        }
    

    setupNewMonacoEditor() {
        // Retrieve the previously created document elements
        this.runButton = document.getElementById(`qpyodide-button-run-${this.id}`);
        this.resetButton = document.getElementById(`qpyodide-button-reset-${this.id}`);
        this.copyButton = document.getElementById(`qpyodide-button-copy-${this.id}`);
        this.feedbackButton = document.getElementById(`qpyodide-button-feedback-${this.id}`);
        this.readOnlyLabel = document.getElementById(`qpyodide-readonly-label-${this.id}`);
        this.editorDiv = document.getElementById(`qpyodide-editor-${this.id}`);
        this.outputCodeDiv2 = document.getElementById(`qpyodide-output-code-area-${this.id}`);
        this.outputFeedbackDiv2 = document.getElementById(`qpyodide-output-feedback-area-${this.id}`);
        this.outputGraphDiv2 = document.getElementById(`qpyodide-output-graph-area-${this.id}`);
        
        // Store reference to the object
        var thiz = this;

        thiz.editorDiv.parentElement.previousElementSibling.style.backgroundColor = "#bdecb6";
        thiz.readOnlyLabel.textContent = "Editable";

        // Load the Monaco Editor and create an instance
        require(['vs/editor/editor.main'], function () {
            thiz.newEditor = monaco.editor.create(
                thiz.editorDiv, {
                    value: "",
                    language: 'python',
                    theme: 'vs-light',
                    automaticLayout: true,           // Works wonderfully with RevealJS
                    scrollBeyondLastLine: false,
                    minimap: {
                        enabled: false
                    },
                    fontSize: '17.5pt',              // Bootstrap is 1 rem
                    renderLineHighlight: "none",     // Disable current line highlighting
                    hideCursorInOverviewRuler: true,  // Remove cursor indictor in right hand side scroll bar
                    readOnly: false
                }
            );
        
            // Store the official counter ID to be used in keyboard shortcuts
            thiz.newEditor.__qpyodideCounter = thiz.id;
        
            // Store the official div container ID
            thiz.newEditor.__qpyodideEditorId = `qpyodide-editor-${thiz.id}`;
        
            // Store the initial code value and options
            thiz.newEditor.__qpyodideinitialCode = "";
            thiz.newEditor.__qpyodideOptions = thiz.options;
        
            // Set at the model level the preferred end of line (EOL) character to LF.
            // This prevent `\r\n` from being given to the Pyodide engine if the user is on Windows.
            // See details in: https://github.com/coatless/quarto-Pyodide/issues/94
            // Associated error text: 
            // Error: <text>:1:7 unexpected input
        
            // Retrieve the underlying model
            const model = thiz.newEditor.getModel();
            // Set EOL for the model
            model.setEOL(monaco.editor.EndOfLineSequence.LF);
        
            // Dynamically modify the height of the editor window if new lines are added.
            let ignoreEvent = false;
            const updateHeight = () => {
            const contentHeight = thiz.newEditor.getContentHeight();
            // We're avoiding a width change
            //editorDiv.style.width = `${width}px`;
            thiz.editorDiv.style.height = `${contentHeight}px`;
                try {
                    ignoreEvent = true;
            
                    // The key to resizing is this call
                    thiz.newEditor.layout();
                } finally {
                    ignoreEvent = false;
                }
            };
        
            // Helper function to check if selected text is empty
            function isEmptyCodeText(selectedCodeText) {
                return (selectedCodeText === null || selectedCodeText === undefined || selectedCodeText === "");
            }
        
            // Registry of keyboard shortcuts that should be re-added to each editor window
            // when focus changes.
            const addPyodideKeyboardShortCutCommands = () => {
            // Add a keydown event listener for Shift+Enter to run all code in cell
            thiz.newEditor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
                // Retrieve all text inside the editor
                thiz.runCodeNE(thiz.newEditor.getValue());
                thiz.outputCodeDiv2.classList.add('has-content');
            });
        
            // Add a keydown event listener for CMD/Ctrl+Enter to run selected code
            thiz.newEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                    // Get the selected text from the editor
                    const selectedText = thiz.newEditor.getModel().getValueInRange(thiz.newEditor.getSelection());
                    // Check if no code is selected
                    if (isEmptyCodeText(selectedText)) {
                        // Obtain the current cursor position
                        let currentPosition = thiz.newEditor.getPosition();
                        // Retrieve the current line content
                        let currentLine = thiz.newEditor.getModel().getLineContent(currentPosition.lineNumber);
                
                        // Propose a new position to move the cursor to
                        let newPosition = new monaco.Position(currentPosition.lineNumber + 1, 1);
                
                        // Check if the new position is beyond the last line of the editor
                        if (newPosition.lineNumber > thiz.newEditor.getModel().getLineCount()) {
                            // Add a new line at the end of the editor
                            thiz.newEditor.executeEdits("addNewLine", [{
                            range: new monaco.Range(newPosition.lineNumber, 1, newPosition.lineNumber, 1),
                            text: "\n", 
                            forceMoveMarkers: true,
                            }]);
                        }
                        
                        // Run the entire line of code.
                        thiz.runCodeNE(currentLine);
                
                        // Move cursor to new position
                        thiz.newEditor.setPosition(newPosition);
                    } else {
                        // Code to run when Ctrl+Enter is pressed with selected code
                        thiz.runCodeNE(selectedText);
                    }
                    thiz.outputCodeDiv2.classList.add('has-content');
                });
            }
        
            // Register an on focus event handler for when a code cell is selected to update
            // what keyboard shortcut commands should work.
            // This is a workaround to fix a regression that happened with multiple
            // editor windows since Monaco 0.32.0 
            // https://github.com/microsoft/monaco-editor/issues/2947
            thiz.newEditor.onDidFocusEditorText(addPyodideKeyboardShortCutCommands);
        
            // Register an on change event for when new code is added to the editor window
            thiz.newEditor.onDidContentSizeChange(updateHeight);
        
            // Manually re-update height to account for the content we inserted into the call
            updateHeight();
                
        });

        
        // Add a click event listener to the run button
        thiz.runButton.onclick = function () {
            thiz.runCodeNE(
                thiz.newEditor.getValue()
            );
            thiz.outputCodeDiv2.classList.add('has-content');
        };
        
        // Add a click event listener to the copy button
        thiz.copyButton.onclick = function () {
            // Retrieve current code data
            const data = thiz.newEditor.getValue();
            
            // Write code data onto the clipboard.
            navigator.clipboard.writeText(data || "");
        };
        
        // Add a click event listener to the reset button
        thiz.resetButton.onclick = function () {
            thiz.newEditor.setValue(thiz.newEditor.__qpyodideinitialCode);
            if(thiz.outputFeedbackDiv2.classList.contains('has-content')){
                thiz.outputFeedbackDiv2.innerHTML = "";
            }
            if(thiz.outputCodeDiv2.classList.contains('has-content')){
                thiz.outputCodeDiv2.innerHTML = "";
            }
            if(thiz.outputGraphDiv2.classList.contains('has-content')){
                thiz.outputGraphDiv2.innerHTML = "";
            }
        };

        

        

        thiz.feedbackButton.onclick = async function () {
            const system_prompt = "You are an AI Assistant, specialized in coding issues. You give concise answers, without asking further questions.";
            const prompt1 = "Review the following Python code for errors and provide feedback. The code output, including any syntax errors, will be provided for detailed analysis. This is the source code of the user:\n"; 
            const prompt2 = "Your feedback should highlight both the strengths of the code and any potential errors, providing explanations where necessary. While you may offer tips for improvement, avoid providing exact code solutions. Focus on guiding the user towards better practices and understanding. Structure the feedback like this: Syntax errors: \n Strengths of the code: \n Potential improvements:\n ";    
            // Retrieve current code data  
            const data = thiz.newEditor.getValue();
            

            let runtime_message;
            try {
                // Check if we have an execution lock
                if (thiz.executeLock) return; 
                
                thiz.disableInteractiveCells();

                // Force wait procedure
                await mainPyodide;

                // Clear the output stock
                qpyodideResetOutputArray();

                // Obtain results from the base class
                try {
                    // Always check to see if the user adds new packages
                    await mainPyodide.loadPackagesFromImports(data);

                    // Process result
                    const output = await mainPyodide.runPythonAsync(data);

                    // Add output
                    qpyodideAddToOutputArray(output, "stdout");
                } catch (err) {
                    // Add error message
                    qpyodideAddToOutputArray(err, "stderr");
                    // TODO: There has to be a way to remove the Pyodide portion of the errors... 
                }

            runtime_message = qpyodideRetrieveOutput(); 
            // Re-enable execution
            thiz.enableInteractiveCells();
            } catch (error) {
                runtime_message = `Error: ${error.message}`;
            }
            const runtime_prompt = "\nHere is the output of the python interpreter:\n";

        

            if(globalThis.backend == "copyPrompt"){
                const promptText =
`Ich brauche Hilfe mit meinem Python-Code aus einem Statistik-Tutorial.

**Mein Code:**
\`\`\`python
${data}
\`\`\`

**Ausgabe / Fehlermeldung:**
\`\`\`
${runtime_message || "(keine Ausgabe)"}
\`\`\`

Bitte erkläre mir, was der Code macht, ob es Fehler gibt und wie ich sie beheben kann. Gib mir keine fertige Lösung, sondern hilf mir zu verstehen, was falsch ist.`;

                thiz.outputFeedbackDiv2.innerHTML = "";

                const headerDiv = document.createElement("div");
                headerDiv.style.fontWeight = "bold";
                headerDiv.style.marginBottom = "8px";
                headerDiv.textContent = "KI-Prompt zum Kopieren:";
                thiz.outputFeedbackDiv2.appendChild(headerDiv);

                const pre = document.createElement("pre");
                pre.style.whiteSpace = "pre-wrap";
                pre.style.wordBreak = "break-word";
                pre.style.fontSize = "0.85em";
                pre.style.padding = "8px";
                pre.style.borderRadius = "4px";
                pre.style.userSelect = "all";
                pre.textContent = promptText;
                thiz.outputFeedbackDiv2.appendChild(pre);

                const copyBtn = document.createElement("button");
                copyBtn.textContent = "Prompt kopieren";
                copyBtn.style.marginTop = "6px";
                copyBtn.style.padding = "4px 12px";
                copyBtn.style.cursor = "pointer";
                copyBtn.addEventListener("click", () => {
                    navigator.clipboard.writeText(promptText).then(() => {
                        copyBtn.textContent = "Kopiert!";
                        setTimeout(() => { copyBtn.textContent = "Prompt kopieren"; }, 2000);
                    });
                });
                thiz.outputFeedbackDiv2.appendChild(copyBtn);
            }
            
            thiz.outputFeedbackDiv2.classList.add('has-content');
        };
    }; 

    disableInteractiveCells() {
        // Enable locking of execution for the cell
        this.executionLock = true;

        // Disallowing execution of other code cells
        document.querySelectorAll(".qpyodide-button-run").forEach((btn) => {
            btn.disabled = true;
        });
    }

    enableInteractiveCells() {
        // Remove locking of execution for the cell
        this.executionLock = false;

        // All execution of other code cells
        document.querySelectorAll(".qpyodide-button-run").forEach((btn) => {
            btn.disabled = false;
        });
    }

    /**
     * Execute the Python code inside the editor.
     */
    async runCode(code) {
        
        // Check if we have an execution lock
        if (this.executeLock) return; 
        
        this.disableInteractiveCells();

        // Force wait procedure
        await mainPyodide;

        // Clear the output stock
        qpyodideResetOutputArray();

        // Generate a new canvas element, avoid attaching until the end
        let graphFigure = document.createElement("figure");
        document.pyodideMplTarget = graphFigure;

        console.log("Running code!");
        // Obtain results from the base class
        try {
            // Always check to see if the user adds new packages
            await mainPyodide.loadPackagesFromImports(code);

            // Process result
            const output = await mainPyodide.runPythonAsync(code);

            // Add output
            qpyodideAddToOutputArray(output, "stdout");
        } catch (err) {
            // Add error message
            qpyodideAddToOutputArray(err, "stderr");
            // TODO: There has to be a way to remove the Pyodide portion of the errors... 
        }

        const result = qpyodideRetrieveOutput();

        // Nullify the output area of content
        this.outputCodeDiv.innerHTML = "";
        this.outputGraphDiv.innerHTML = "";        

        // Design an output object for messages
        const pre = document.createElement("pre");
        if (/\S/.test(result)) {
            // Display results as HTML elements to retain output styling
            const div = document.createElement("div");
            div.innerHTML = result;
            pre.appendChild(div);
            this.outputCodeDiv.classList.add('has-content');
        } else {
            // If nothing is present, hide the element.
            pre.style.visibility = "hidden";
             // If no output, hide the code output div
            this.outputCodeDiv.classList.remove('has-content');
        }

        // Add output under interactive div
        this.outputCodeDiv.appendChild(pre);

        // Place the graphics onto the page
        if (graphFigure.children.length>0) {

            if (this.options['fig-cap']) {
                // Create figcaption element
                const figcaptionElement = document.createElement('figcaption');
                figcaptionElement.innerText = this.options['fig-cap'];
                // Append figcaption to figure
                graphFigure.appendChild(figcaptionElement);    
            }

            this.outputGraphDiv.appendChild(graphFigure);
            this.outputGraphDiv.classList.add('has-content');
        }
        else {
            this.outputGraphDiv.classList.remove('has-content');
        }

        // Re-enable execution
        this.enableInteractiveCells();
    }

    /**
     * Execute the Python code inside the editor.
     */
    async runCodeNE(code) {
        
        // Check if we have an execution lock
        if (this.executeLock) return; 
        
        this.disableInteractiveCells();

        // Force wait procedure
        await mainPyodide;

        // Clear the output stock
        qpyodideResetOutputArray();

        // Generate a new canvas element, avoid attaching until the end
        let graphFigure = document.createElement("figure");
        document.pyodideMplTarget = graphFigure;

        console.log("Running code!");
        // Obtain results from the base class
        try {
            // Always check to see if the user adds new packages
            await mainPyodide.loadPackagesFromImports(code);

            // Process result
            const output = await mainPyodide.runPythonAsync(code);

            // Add output
            qpyodideAddToOutputArray(output, "stdout");
        } catch (err) {
            // Add error message
            qpyodideAddToOutputArray(err, "stderr");
            // TODO: There has to be a way to remove the Pyodide portion of the errors... 
        }

        const result = qpyodideRetrieveOutput();

        // Nullify the output area of content
        this.outputCodeDiv2.innerHTML = "";
        this.outputGraphDiv2.innerHTML = "";        

        // Design an output object for messages
        const pre = document.createElement("pre");
        if (/\S/.test(result)) {
            // Display results as HTML elements to retain output styling
            const div = document.createElement("div");
            div.innerHTML = result;
            pre.appendChild(div);
            this.outputCodeDiv2.classList.add('has-content');
        } else {
            // If nothing is present, hide the element.
            pre.style.visibility = "hidden";
            // If no output, hide the code output div
            this.outputCodeDiv2.classList.remove('has-content');
        }

        // Add output under interactive div
        this.outputCodeDiv2.appendChild(pre);

        // Place the graphics onto the page
        if (graphFigure.children.length>0) {

            if (this.options['fig-cap']) {
                // Create figcaption element
                const figcaptionElement = document.createElement('figcaption');
                figcaptionElement.innerText = this.options['fig-cap'];
                // Append figcaption to figure
                graphFigure.appendChild(figcaptionElement);    
            }

            this.outputGraphDiv2.appendChild(graphFigure);
            this.outputGraphDiv2.classList.add('has-content');
        } else {
            this.outputGraphDiv2.classList.remove('has-content');
        }

        // Re-enable execution
        this.enableInteractiveCells();
    }

    
};

/**
 * OutputCell class for customizing and displaying output.
 * @class
 * @extends BaseCell
 */
class OutputCell extends BaseCell {
    /**
     * Constructor for OutputCell.
     * @constructor
     * @param {Object} cellData - JSON object containing code, id, and options.
     */
    constructor(cellData) {
      super(cellData);
    }
  
    /**
     * Display customized output on the page.
     * @param {*} output - Result to be displayed.
     */
    displayOutput(output) {
        const results = this.executeCode();
        return results;
    }
  }

/**
 * SetupCell class for suppressed output.
 * @class
 * @extends BaseCell
 */
class SetupCell extends BaseCell {
    /**
     * Constructor for SetupCell.
     * @constructor
     * @param {Object} cellData - JSON object containing code, id, and options.
     */
    constructor(cellData) {
        super(cellData);
    }

    /**
     * Execute the Python code without displaying the results.
     */
    runSetupCode() {
        // Execute code without displaying output
        this.executeCode();
    }
};