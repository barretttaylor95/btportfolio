/**
 * Interactive Java Terminal Simulator
 * Provides a simulated Java REPL environment within the portfolio terminal
 */

// Terminal state tracking
let javaTerminalActive = false;
let javaHistory = [];
let javaVariables = {};
let javaClasses = {};
let javaImports = [];

// Standard Java imports that are automatically available
const standardImports = [
    'java.lang.*',
    'java.util.*',
    'java.io.*'
];

/**
 * Initialize the Java Terminal Mode
 * @param {Object} terminal - The terminal DOM element
 */
function initJavaTerminal(terminal) {
    javaTerminalActive = true;
    javaHistory = [];
    javaVariables = {};
    javaClasses = {};
    javaImports = [...standardImports];

    // Display Java terminal welcome message
    const welcomeOutput = document.createElement('div');
    welcomeOutput.className = 'terminal-output';
    welcomeOutput.innerHTML = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Java Terminal 11.0.2 (Portfolio Edition)</div>
        <div>Type Java code directly into the terminal. End statements with ';'</div>
        <div>Type 'exit()' to return to the main terminal.</div>
        <div>Available commands: <span style="color: #cc7832">new, import, class, void, public, private, static</span></div>
        <div style="margin-top: 10px; color: #808080;">// This is a simulated environment with limited functionality</div>
    `;

    // Update prompt style for Java mode
    updateJavaPrompt(terminal);

    // Insert welcome message before the prompt
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(welcomeOutput, lastPrompt);

    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Update the terminal prompt to Java style
 * @param {Object} terminal - The terminal DOM element
 */
function updateJavaPrompt(terminal) {
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        // Change prompt style for Java mode
        const userSpan = lastPrompt.querySelector('.terminal-user');
        if (userSpan) userSpan.textContent = 'java';

        const machineSpan = lastPrompt.querySelector('.terminal-machine');
        if (machineSpan) machineSpan.textContent = 'jdk-11';

        const directorySpan = lastPrompt.querySelector('.terminal-directory');
        if (directorySpan) directorySpan.textContent = 'repl';

        const symbolSpan = lastPrompt.querySelector('.terminal-symbol');
        if (symbolSpan) symbolSpan.textContent = '>';
    }
}

/**
 * Process Java code entered in the terminal
 * @param {string} code - The Java code to process
 * @param {Object} terminal - The terminal DOM element
 * @returns {boolean} - Whether to continue in Java mode
 */
function processJavaCode(code, terminal) {
    // Check for exit command
    if (code.trim().toLowerCase() === 'exit()') {
        const exitMsg = document.createElement('div');
        exitMsg.className = 'terminal-output';
        exitMsg.textContent = 'Exiting Java terminal mode...';

        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        terminal.insertBefore(exitMsg, lastPrompt);

        // Reset terminal style
        javaTerminalActive = false;
        return false;
    }

    // Add to history
    javaHistory.push(code);

    // Process code
    const result = simulateJavaExecution(code);

    // Display result
    const outputElement = document.createElement('div');
    outputElement.className = 'terminal-output';

    if (result.error) {
        outputElement.innerHTML = `<span style="color: #cc0000;">${result.error}</span>`;
    } else if (result.output) {
        outputElement.innerHTML = result.output;
    }

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(outputElement, lastPrompt);

    // Update prompt
    updateJavaPrompt(terminal);

    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;

    return true;
}

/**
 * Simulate Java code execution
 * @param {string} code - The Java code to execute
 * @returns {Object} - Simulation result with output or error
 */
function simulateJavaExecution(code) {
    // Trim code
    code = code.trim();

    // Skip empty code
    if (!code) {
        return { output: '' };
    }

    // Check for missing semicolon
    if (!code.endsWith(';') && !code.includes('class') && !isCompleteBlock(code)) {
        return { error: 'error: \';\' expected' };
    }

    try {
        // Handle different types of Java statements
        if (code.startsWith('import ')) {
            return handleImport(code);
        } else if (code.includes('class ')) {
            return handleClassDefinition(code);
        } else if (code.includes('System.out.print')) {
            return handlePrint(code);
        } else if (code.includes('new ')) {
            return handleObjectCreation(code);
        } else if (code.includes('=')) {
            return handleVariableAssignment(code);
        } else if (isMethodCall(code)) {
            return handleMethodCall(code);
        } else {
            // Try to evaluate as an expression
            return handleExpression(code);
        }
    } catch (e) {
        return { error: `Exception in thread "main" ${e.message}` };
    }
}

/**
 * Check if code represents a complete block (with balanced braces)
 * @param {string} code - The code to check
 * @returns {boolean} - Whether the code is a complete block
 */
function isCompleteBlock(code) {
    let braceCount = 0;
    for (let char of code) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
    }
    return braceCount === 0 && code.includes('{');
}

/**
 * Handle Java import statement
 * @param {string} code - The import statement
 * @returns {Object} - Processing result
 */
function handleImport(code) {
    // Extract import path
    const importMatch = code.match(/import\s+([^;]+);/);
    if (!importMatch) {
        return { error: 'Invalid import statement' };
    }

    const importPath = importMatch[1].trim();

    // Add to imports if not already present
    if (!javaImports.includes(importPath)) {
        javaImports.push(importPath);
    }

    return { output: '' }; // Import statements don't produce output
}

/**
 * Handle Java class definition
 * @param {string} code - The class definition
 * @returns {Object} - Processing result
 */
function handleClassDefinition(code) {
    // Simplified class extraction - just store the whole definition
    const className = code.match(/class\s+(\w+)/)?.[1];

    if (!className) {
        return { error: 'Invalid class definition' };
    }

    javaClasses[className] = code;
    return { output: `Defined class ${className}` };
}

/**
 * Handle System.out.print statements
 * @param {string} code - The print statement
 * @returns {Object} - Processing result with printed output
 */
function handlePrint(code) {
    // Extract the content between parentheses
    const contentMatch = code.match(/System\.out\.print(?:ln)?\s*\(\s*(.+)\s*\)\s*;/);

    if (!contentMatch) {
        return { error: 'Invalid print statement' };
    }

    let content = contentMatch[1];

    // Handle string literals
    if (content.startsWith('"') && content.endsWith('"')) {
        content = content.substring(1, content.length - 1);
    }
    // Handle variable references
    else if (javaVariables[content]) {
        content = javaVariables[content];
    }

    // Check if it's println (add newline) or print
    const isPrintln = code.includes('println');

    return {
        output: content + (isPrintln ? '' : '')
    };
}

/**
 * Handle object creation with new keyword
 * @param {string} code - The object creation statement
 * @returns {Object} - Processing result
 */
function handleObjectCreation(code) {
    // Extract variable name and class type
    const match = code.match(/(\w+)\s*=\s*new\s+(\w+)(?:<.+>)?\((.*)\)\s*;/);

    if (!match) {
        return { error: 'Invalid object creation' };
    }

    const [_, varName, className, args] = match;

    // Check if class exists or is a common Java class
    const commonClasses = ['String', 'Integer', 'ArrayList', 'HashMap', 'Scanner'];

    if (!javaClasses[className] && !commonClasses.includes(className)) {
        return { error: `Cannot find symbol: class ${className}` };
    }

    // Create a simple representation of the object
    javaVariables[varName] = `${className}@${Math.floor(Math.random() * 1000000).toString(16)}`;

    return { output: '' };
}

/**
 * Handle variable assignment
 * @param {string} code - The assignment statement
 * @returns {Object} - Processing result
 */
function handleVariableAssignment(code) {
    // Extract variable name and value
    const match = code.match(/(?:(?:int|String|double|boolean|char)\s+)?(\w+)\s*=\s*(.+)\s*;/);

    if (!match) {
        return { error: 'Invalid assignment' };
    }

    const [_, varName, valueExpr] = match;

    // Simple evaluation for numeric values
    let value;
    if (valueExpr.startsWith('"') && valueExpr.endsWith('"')) {
        // String literal
        value = valueExpr.substring(1, valueExpr.length - 1);
    } else if (valueExpr === 'true' || valueExpr === 'false') {
        // Boolean literal
        value = valueExpr;
    } else if (/^\d+$/.test(valueExpr)) {
        // Integer literal
        value = parseInt(valueExpr);
    } else if (/^\d+\.\d+$/.test(valueExpr)) {
        // Double literal
        value = parseFloat(valueExpr);
    } else if (javaVariables[valueExpr]) {
        // Variable reference
        value = javaVariables[valueExpr];
    } else {
        try {
            // Try to evaluate as a simple expression
            value = eval(valueExpr.replace(/;$/, ''));
        } catch (e) {
            return { error: `Cannot evaluate expression: ${valueExpr}` };
        }
    }

    javaVariables[varName] = value;
    return { output: '' };
}

/**
 * Check if the code is a method call
 * @param {string} code - The code to check
 * @returns {boolean} - Whether the code is a method call
 */
function isMethodCall(code) {
    return /\w+\.\w+\(.*\);/.test(code);
}

/**
 * Handle method call on an object
 * @param {string} code - The method call statement
 * @returns {Object} - Processing result
 */
function handleMethodCall(code) {
    // Extract object name, method name and arguments
    const match = code.match(/(\w+)\.(\w+)\((.*)\);/);

    if (!match) {
        return { error: 'Invalid method call' };
    }

    const [_, objName, methodName, args] = match;

    // Check if object exists
    if (!javaVariables[objName]) {
        return { error: `Cannot find symbol: variable ${objName}` };
    }

    // Simulate method call based on common Java methods
    if (objName === 'System' && methodName === 'exit') {
        return {
            output: 'Process finished with exit code 0',
            exit: true
        };
    }

    // For ArrayList-like objects
    if (javaVariables[objName].startsWith('ArrayList@')) {
        if (methodName === 'add') {
            return { output: 'true' };
        } else if (methodName === 'size') {
            return { output: '1' };
        } else if (methodName === 'get') {
            return { output: 'null' };
        }
    }

    // For HashMap-like objects
    if (javaVariables[objName].startsWith('HashMap@')) {
        if (methodName === 'put') {
            return { output: 'null' };
        } else if (methodName === 'get') {
            return { output: 'null' };
        } else if (methodName === 'size') {
            return { output: '0' };
        }
    }

    // For String-like objects
    if (typeof javaVariables[objName] === 'string' || javaVariables[objName].startsWith('String@')) {
        if (methodName === 'length') {
            return { output: '0' };
        } else if (methodName === 'charAt') {
            return { output: '' };
        } else if (methodName === 'substring') {
            return { output: '' };
        }
    }

    return { output: 'null' }; // Default output for unrecognized methods
}

/**
 * Handle a Java expression that's not a statement
 * @param {string} code - The expression
 * @returns {Object} - Evaluation result
 */
function handleExpression(code) {
    // Remove trailing semicolon
    const expr = code.replace(/;$/, '');

    // Check if it's a variable reference
    if (javaVariables[expr]) {
        return { output: String(javaVariables[expr]) };
    }

    // Try to evaluate as a simple expression
    try {
        const result = eval(expr);
        return { output: String(result) };
    } catch (e) {
        return { error: `Cannot evaluate expression: ${expr}` };
    }
}

/**
 * Add Java syntax highlighting to displayed code
 * @param {string} code - The code to highlight
 * @returns {string} - HTML with syntax highlighting
 */
function highlightJavaSyntax(code) {
    // Java keywords
    const keywords = [
        'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch',
        'char', 'class', 'const', 'continue', 'default', 'do', 'double',
        'else', 'enum', 'extends', 'final', 'finally', 'float', 'for',
        'if', 'implements', 'import', 'instanceof', 'int', 'interface',
        'long', 'native', 'new', 'package', 'private', 'protected',
        'public', 'return', 'short', 'static', 'strictfp', 'super',
        'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
        'try', 'void', 'volatile', 'while', 'true', 'false', 'null'
    ];

    // Highlight strings
    let highlighted = code.replace(/"([^"]*)"/g, '<span style="color: #6a8759;">"$1"</span>');

    // Highlight keywords
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        highlighted = highlighted.replace(regex, `<span style="color: #cc7832;">${keyword}</span>`);
    });

    // Highlight class names
    highlighted = highlighted.replace(/\b([A-Z]\w*)\b/g, '<span style="color: #a9b7c6;">$1</span>');

    // Highlight method calls
    highlighted = highlighted.replace(/(\w+)\(/g, '<span style="color: #ffc66d;">$1</span>(');

    // Highlight comments
    highlighted = highlighted.replace(/\/\/.*$/gm, match => `<span style="color: #808080;">${match}</span>`);
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, match => `<span style="color: #808080;">${match}</span>`);

    return highlighted;
}

/**
 * Exported methods to interface with the main terminal system
 */
export default {
    /**
     * Start Java terminal mode
     * @param {Object} terminal - The terminal DOM element
     */
    start: function(terminal) {
        initJavaTerminal(terminal);
    },

    /**
     * Process Java terminal input
     * @param {string} code - The entered code
     * @param {Object} terminal - The terminal DOM element
     * @returns {boolean} - Whether to stay in Java mode
     */
    processInput: function(code, terminal) {
        return processJavaCode(code, terminal);
    },

    /**
     * Check if Java terminal mode is active
     * @returns {boolean} - Java terminal mode status
     */
    isActive: function() {
        return javaTerminalActive;
    }
};