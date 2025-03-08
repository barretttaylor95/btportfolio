// Function to load a script via a traditional script tag
function loadScript(url, callback) {
    console.log(`Loading script: ${url}`);
    const script = document.createElement('script');
    script.type = 'text/javascript'; // Regular script, not a module
    script.src = url;
    script.onload = function() {
        console.log(`Successfully loaded: ${url}`);
        callback(null);
    };
    script.onerror = function() {
        console.error(`Failed to load: ${url}`);
        callback(new Error(`Failed to load script: ${url}`));
    };
    document.head.appendChild(script);
}

// Fix import section - define import variables but handle missing modules gracefully
let javaTerminal, apiDemo, databaseViewer, gitViewer, buildTools, projectDemo, ideTools, codeChallenge;

// Module loading approach that tries ES imports first, then falls back to global objects
async function loadModuleWithFallback(name, path) {
    try {
        // Try ES module import first
        console.log(`Trying to import ${name} as ES module from ${path}`);
        const module = await import(path);
        console.log(`Successfully imported ${name} as ES module`);
        return module.default;
    } catch (err) {
        console.warn(`ES module import failed for ${name}, trying global object fallback:`, err);

        // Check if we already have a global object available
        const globalName = name.charAt(0).toLowerCase() + name.slice(1);
        if (window[globalName]) {
            console.log(`Found global object for ${name}`);
            return window[globalName];
        }

        // If no global object yet, attempt to load via script tag
        return new Promise((resolve, reject) => {
            loadScript(`./features/${path}`, (err) => {
                if (err) {
                    console.error(`Failed to load ${name} via script tag:`, err);
                    // Return fallback module as last resort
                    resolve(createFallbackModule(name));
                } else {
                    // Check again for global object after script loading
                    if (window[globalName]) {
                        console.log(`Successfully loaded ${name} via script tag`);
                        resolve(window[globalName]);
                    } else {
                        console.warn(`Loaded script for ${name}, but no global object found`);
                        resolve(createFallbackModule(name));
                    }
                }
            });
        });
    }
}

// Safely import modules with proper error handling
document.addEventListener('DOMContentLoaded', function() {
    // First, make sure we have the terminal panel
    createTerminalPanel();

    // Try to import all modules with proper fallbacks
    Promise.all([
        loadModuleWithFallback('javaTerminal', './features/java-terminal.js'),
        loadModuleWithFallback('apiDemo', './features/api-demo.js'),
        loadModuleWithFallback('databaseViewer', './features/db-viewer.js'),
        loadModuleWithFallback('gitViewer', './features/git-viewer.js'),
        loadModuleWithFallback('buildTools', './features/build-tools.js'),
        loadModuleWithFallback('projectDemo', './features/project-demo.js'),
        loadModuleWithFallback('ideTools', './features/ide-tools.js'),
        loadModuleWithFallback('codeChallenge', './features/code-challenge.js')
    ]).then(modules => {
        // Assign each module to its variable
        [javaTerminal, apiDemo, databaseViewer, gitViewer, buildTools, projectDemo, ideTools, codeChallenge] = modules;
        console.log("All modules loaded successfully (or with fallbacks)");

        // Initialize after loading
        initializePortfolio();
    }).catch(error => {
        console.warn("Error during module loading:", error);
        // Initialize anyway with fallbacks
        initializePortfolio();
    });
});

// Create fallback module for features that fail to load
function createFallbackModule(featureName) {
    return {
        start: function(terminal, editorArea) {
            displayModuleErrorMessage(featureName, terminal);
        },
        processInput: function() { return false; },
        isActive: function() { return false; }
    };
}

// Global variables for panel sizes
let directoryWidth = 250;
let terminalHeight = 200;
let isDraggingDirectoryHandle = false;
let isDraggingTerminalHandle = false;
let startX = 0;
let startY = 0;

// Initialize active tab and content
let activeTab = 'about';
let isDarkMode = true; // Default to dark mode
let currentTerminalInput = ''; // Store current user terminal input
let commandHistory = []; // Store command history
let historyIndex = -1; // Current position in command history

// Safe localStorage wrapper function to handle private browsing mode
function safeLocalStorage(action, key, value) {
    try {
        if (action === 'get') {
            return localStorage.getItem(key);
        } else if (action === 'set') {
            localStorage.setItem(key, value);
        } else if (action === 'remove') {
            localStorage.removeItem(key);
        } else if (action === 'parse') {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
    } catch (e) {
        console.warn('LocalStorage not available:', e);
        return action === 'get' ? null : false;
    }
}

// Create the terminal panel if it doesn't exist
function createTerminalPanel() {
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) {
        console.error('Content area not found, cannot create terminal panel');
        return;
    }

    // Check if terminal panel already exists
    if (document.getElementById('terminalPanel')) {
        console.log('Terminal panel already exists');
        return;
    }

    console.log('Creating terminal panel');

    // Create the terminal panel
    const terminalPanel = document.createElement('div');
    terminalPanel.className = 'terminal-panel';
    terminalPanel.id = 'terminalPanel';

    // Set initial style to ensure visibility
    terminalPanel.style.position = 'absolute';
    terminalPanel.style.left = '0';
    terminalPanel.style.right = '0';
    terminalPanel.style.bottom = '25px'; // Leave room for status bar
    terminalPanel.style.height = '200px';
    terminalPanel.style.minHeight = '100px';
    terminalPanel.style.zIndex = '3';
    terminalPanel.style.display = 'flex';
    terminalPanel.style.flexDirection = 'column';
    terminalPanel.style.backgroundColor = '#1e1e1e';
    terminalPanel.style.borderTop = '1px solid #323232';

    // Create resize handle for terminal
    const terminalResizeHandle = document.createElement('div');
    terminalResizeHandle.className = 'resize-handle vertical-resize-handle';
    terminalResizeHandle.id = 'terminalResizeHandle';
    terminalResizeHandle.style.position = 'absolute';
    terminalResizeHandle.style.cursor = 'row-resize';
    terminalResizeHandle.style.height = '5px';
    terminalResizeHandle.style.left = '0';
    terminalResizeHandle.style.right = '0';
    terminalResizeHandle.style.top = '0';
    terminalResizeHandle.style.zIndex = '50';
    terminalPanel.appendChild(terminalResizeHandle);

    // Create terminal header
    const terminalHeader = document.createElement('div');
    terminalHeader.className = 'terminal-header';
    terminalHeader.innerHTML = '<div class="terminal-title">Terminal</div><div class="terminal-tabs"><div class="terminal-tab active">CLI</div></div>';
    terminalPanel.appendChild(terminalHeader);

    // Create terminal content
    const terminalContent = document.createElement('div');
    terminalContent.className = 'terminal-content';

    // Add welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'terminal-output';
    welcomeMsg.textContent = "Welcome to Barrett Taylor's Interactive CLI.";

    const helpMsg = document.createElement('div');
    helpMsg.className = 'terminal-output';
    helpMsg.textContent = "Type help to see available commands.";

    terminalContent.appendChild(welcomeMsg);
    terminalContent.appendChild(helpMsg);

    // Create prompt
    const prompt = document.createElement('div');
    prompt.className = 'terminal-prompt';
    prompt.innerHTML = `
        <span class="terminal-user">guest</span>
        <span class="terminal-at">@</span>
        <span class="terminal-machine">portfolio</span>
        <span class="terminal-colon">:</span>
        <span class="terminal-directory">~</span>
        <span class="terminal-symbol">$</span>
        <span class="terminal-input" contenteditable="true" spellcheck="false"></span>
        <span class="typing-cursor"></span>
    `;

    terminalContent.appendChild(prompt);
    terminalPanel.appendChild(terminalContent);

    // Add terminal panel to content area
    contentArea.appendChild(terminalPanel);

    console.log('Terminal panel created successfully');

    // Adjust the editor area to make room for terminal
    const editorArea = document.getElementById('editorArea');
    if (editorArea) {
        editorArea.style.bottom = (terminalHeight + 25) + 'px'; // terminal height + status bar
    }
}

// Initialize the portfolio
function initializePortfolio() {
    console.log('Initializing portfolio');

    // Initialize resizable panels
    initResizablePanels();

    // Check for theme preference
    const storedTheme = safeLocalStorage('get', 'theme');
    if (storedTheme) {
        isDarkMode = storedTheme === 'dark';
        if (!isDarkMode) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
        }
    }

    // Set up theme toggle button if it exists
    const themeToggleBtn = document.querySelector('.action-button');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Expand the root folder by default
    const rootFolder = document.querySelector('.tree-item');
    if (rootFolder) {
        toggleFolder(rootFolder);
    }

    // Check if there's a hash in the URL and show that section
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
        const section = hash.substring(1);
        showSection(section);
    } else {
        // Otherwise, try to load from localStorage or default to 'about'
        const savedTab = safeLocalStorage('get', 'activeTab');
        showSection(savedTab || 'about');
    }

    // Setup terminal command handler for editor links
    setupTerminalCommandHandler();

    // Set up interactive terminal
    setupInteractiveTerminal();

    // Setup tab close buttons
    document.querySelectorAll('.close-tab').forEach(closeBtn => {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const tab = this.closest('.editor-tab');
            if (tab) {
                tab.style.display = 'none';
                if (tab.classList.contains('active')) {
                    showSection('about');
                }
            }
        });
    });

    // Apply syntax highlighting
    applySyntaxHighlighting();

    // Hide loading overlay if it exists
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }

    console.log('Portfolio initialization complete');
}

// Show the active section content and tab
function showSection(section) {
    try {
        // Hide all content sections
        document.querySelectorAll('.code-content').forEach(content => {
            content.classList.remove('active');
        });

        // Hide all tabs
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.style.display = 'none';
            tab.classList.remove('active');
        });

        // Show active content and tab
        const contentElement = document.getElementById(section + 'Content');
        const tabElement = document.getElementById(section + 'Tab');

        if (contentElement && tabElement) {
            contentElement.classList.add('active');
            tabElement.style.display = 'flex';
            tabElement.classList.add('active');

            // Update active tab variable
            activeTab = section;

            // Save to localStorage
            safeLocalStorage('set', 'activeTab', section);
        } else {
            console.warn(`Section '${section}' not found, defaulting to 'about'`);
            // Default to about if section not found
            const aboutContent = document.getElementById('aboutContent');
            const aboutTab = document.getElementById('aboutTab');

            if (aboutContent && aboutTab) {
                aboutContent.classList.add('active');
                aboutTab.style.display = 'flex';
                aboutTab.classList.add('active');
                activeTab = 'about';
            }
        }
    } catch (error) {
        console.error('Error showing section:', error);
        // Default to a visible state if error occurs
        document.querySelectorAll('.code-content')[0]?.classList.add('active');
    }
}

// Toggle folder expand/collapse in file tree
function toggleFolder(element) {
    try {
        const nestedFiles = element.nextElementSibling;
        const icon = element.querySelector('.fa-chevron-right');

        if (nestedFiles && nestedFiles.classList.contains('nested-files')) {
            const isExpanded = nestedFiles.style.display === 'block';
            nestedFiles.style.display = isExpanded ? 'none' : 'block';

            if (icon) {
                icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
            }

            // Save expanded state to localStorage
            const folderPath = getFolderPath(element);
            if (folderPath) {
                try {
                    const expandedFolders = JSON.parse(safeLocalStorage('get', 'expandedFolders') || '{}');
                    expandedFolders[folderPath] = !isExpanded;
                    safeLocalStorage('set', 'expandedFolders', JSON.stringify(expandedFolders));
                } catch (e) {
                    console.warn('Error saving folder state:', e);
                }
            }
        }
    } catch (error) {
        console.error('Error toggling folder:', error);
    }
}

// Get folder path for localStorage
function getFolderPath(element) {
    try {
        let path = '';
        const text = element.textContent?.trim() || '';

        // Get parent folders
        let parent = element.closest('.nested-files');
        while (parent) {
            const parentFolder = parent.previousElementSibling;
            if (parentFolder && parentFolder.textContent) {
                path = parentFolder.textContent.trim() + '/' + path;
            }
            parent = parent.closest('.nested-files')?.parentElement?.closest('.nested-files');
        }

        return path + text;
    } catch (error) {
        console.error('Error getting folder path:', error);
        return null;
    }
}

// Activate a tab and show its content
function activateTab(filename, section) {
    try {
        if (!filename || !section) return;

        showSection(section);

        // Add to recent files in localStorage
        try {
            const recentFiles = JSON.parse(safeLocalStorage('get', 'recentFiles') || '[]');
            const fileInfo = { filename, section };

            // Remove if exists already
            const index = recentFiles.findIndex(f => f.filename === filename);
            if (index !== -1) {
                recentFiles.splice(index, 1);
            }

            // Add to beginning
            recentFiles.unshift(fileInfo);

            // Keep only 10 most recent
            if (recentFiles.length > 10) {
                recentFiles.pop();
            }

            safeLocalStorage('set', 'recentFiles', JSON.stringify(recentFiles));
        } catch (e) {
            console.warn('Error saving recent files:', e);
        }
    } catch (error) {
        console.error('Error activating tab:', error);
    }
}

// Theme toggle functionality
function toggleTheme() {
    try {
        const body = document.body;
        isDarkMode = !isDarkMode;

        if (isDarkMode) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
        }

        // Save preference to localStorage
        safeLocalStorage('set', 'theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}

// Initialize the resizable panels
function initResizablePanels() {
    // Ensure terminal panel exists
    createTerminalPanel();

    const directoryHandle = document.getElementById('directoryResizeHandle');
    const terminalHandle = document.getElementById('terminalResizeHandle');
    const projectDirectory = document.getElementById('projectDirectory');
    const editorArea = document.getElementById('editorArea');
    const terminalPanel = document.getElementById('terminalPanel');

    // Restore saved panel sizes from localStorage
    const savedDirectoryWidth = parseInt(safeLocalStorage('get', 'directoryWidth'));
    const savedTerminalHeight = parseInt(safeLocalStorage('get', 'terminalHeight'));

    if (!isNaN(savedDirectoryWidth) && savedDirectoryWidth > 150 && savedDirectoryWidth < window.innerWidth - 300) {
        directoryWidth = savedDirectoryWidth;
    }

    if (!isNaN(savedTerminalHeight) && savedTerminalHeight > 100 && savedTerminalHeight < window.innerHeight - 200) {
        terminalHeight = savedTerminalHeight;
    }

    // Apply initial panel sizes
    updatePanelSizes();

    // Directory resize handle events
    if (directoryHandle) {
        directoryHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDraggingDirectoryHandle = true;
            startX = e.clientX;
            document.body.style.cursor = 'col-resize';
        });
    } else {
        console.warn('Directory resize handle not found');
    }

    // Terminal resize handle events
    if (terminalHandle) {
        terminalHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDraggingTerminalHandle = true;
            startY = e.clientY;
            document.body.style.cursor = 'row-resize';
            console.log('Terminal resize started');
        });
    } else {
        console.warn('Terminal resize handle not found');
    }

    // Mouse move event for both handles
    document.addEventListener('mousemove', (e) => {
        if (isDraggingDirectoryHandle) {
            const deltaX = e.clientX - startX;
            directoryWidth += deltaX;
            startX = e.clientX;

            // Constrain to minimum and maximum widths
            directoryWidth = Math.max(150, Math.min(window.innerWidth - 300, directoryWidth));
            updatePanelSizes();

            // Save to localStorage
            safeLocalStorage('set', 'directoryWidth', directoryWidth.toString());
        }

        if (isDraggingTerminalHandle) {
            // Calculate height from bottom of window to cursor position
            // We need to invert the calculation as we're dragging from top of terminal
            const editorBottom = window.innerHeight - 25; // 25px for status bar
            const newTerminalHeight = editorBottom - e.clientY;

            // Only update if it's a reasonable size
            if (newTerminalHeight > 100 && newTerminalHeight < window.innerHeight - 200) {
                terminalHeight = newTerminalHeight;
                updatePanelSizes();

                // Save to localStorage
                safeLocalStorage('set', 'terminalHeight', terminalHeight.toString());
                console.log('Terminal height updated to', terminalHeight);
            }
        }
    });

    // Mouse up event to stop dragging
    document.addEventListener('mouseup', () => {
        if (isDraggingDirectoryHandle || isDraggingTerminalHandle) {
            isDraggingDirectoryHandle = false;
            isDraggingTerminalHandle = false;
            document.body.style.cursor = 'default';
            console.log('Resize operation ended');
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        // Ensure panels don't exceed window bounds after resize
        directoryWidth = Math.min(directoryWidth, window.innerWidth - 300);
        terminalHeight = Math.min(terminalHeight, window.innerHeight - 200);
        updatePanelSizes();
    });
}

// Update panel sizes based on current values
function updatePanelSizes() {
    const projectDirectory = document.getElementById('projectDirectory');
    const editorArea = document.getElementById('editorArea');
    const terminalPanel = document.getElementById('terminalPanel');
    const statusBar = document.querySelector('.status-bar');

    if (!projectDirectory || !editorArea || !terminalPanel) {
        console.error('Missing critical elements for resizing');
        console.log({
            projectDirectory: !!projectDirectory,
            editorArea: !!editorArea,
            terminalPanel: !!terminalPanel
        });
        return;
    }

    try {
        // Update directory width
        projectDirectory.style.width = `${directoryWidth}px`;

        // Update editor position and width
        editorArea.style.left = `${directoryWidth}px`;
        editorArea.style.width = `calc(100% - ${directoryWidth}px)`;

        // Position the terminal panel properly
        terminalPanel.style.height = `${terminalHeight}px`;

        // Update editor height to account for terminal
        editorArea.style.bottom = `${terminalHeight + 25}px`; // Add status bar height

        console.log('Panel sizes updated', {
            directoryWidth,
            terminalHeight,
            editorBottom: editorArea.style.bottom
        });
    } catch (error) {
        console.error('Error updating panel sizes:', error);
    }
}

// Setup terminal command handler for links in the editor
function setupTerminalCommandHandler() {
    // Make sure we don't define it twice
    if (!window.terminalProcessCommand) {
        window.terminalProcessCommand = function(command) {
            const terminal = document.querySelector('.terminal-content');
            if (!terminal) {
                console.error('Terminal content not found');
                return;
            }

            // Find the input element
            const inputElement = terminal.querySelector('.terminal-prompt:last-child .terminal-input');
            if (!inputElement) {
                console.error('Terminal input not found');
                return;
            }

            // Set the command text
            inputElement.textContent = command;

            // Create and dispatch an Enter key event
            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });

            inputElement.dispatchEvent(event);
        };
    }
}

// Apply syntax highlighting to code blocks
function applySyntaxHighlighting() {
    document.querySelectorAll('pre code').forEach(block => {
        // Get the language class
        const langMatch = block.className.match(/language-(\w+)/);
        if (langMatch) {
            const lang = langMatch[1];

            // Simple syntax highlighting based on patterns
            let html = block.innerHTML;

            // Comments
            html = html.replace(/\/\/.*$/gm, match => `<span class="comment">${match}</span>`);
            html = html.replace(/\/\*[\s\S]*?\*\//g, match => `<span class="comment">${match}</span>`);
            html = html.replace(/#.*$/gm, match => `<span class="comment">${match}</span>`);

            // Strings
            html = html.replace(/"([^"]*)"/g, (match, p1) => `"<span class="string">${p1}</span>"`);
            html = html.replace(/'([^']*)'/g, (match, p1) => `'<span class="string">${p1}</span>'`);

            // Keywords
            const keywords = {
                java: ['public', 'class', 'private', 'protected', 'final', 'static', 'void', 'import', 'package', 'return', 'new', 'this', 'if', 'else', 'for', 'while', 'try', 'catch'],
                javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'await', 'async', 'import', 'export', 'default', 'from', 'class', 'this'],
                python: ['def', 'import', 'from', 'class', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'return', 'with', 'as', 'in', 'not', 'and', 'or', 'self']
            };

            if (keywords[lang]) {
                keywords[lang].forEach(keyword => {
                    const re = new RegExp(`\\b${keyword}\\b`, 'g');
                    html = html.replace(re, `<span class="keyword">${keyword}</span>`);
                });
            }

            block.innerHTML = html;
        }
    });
}

function startCodingChallenge() {
  console.log("Starting coding challenge feature");

  const terminal = document.querySelector('.terminal-content');
  const editorArea = document.getElementById('editorArea');

  // Try direct script load first
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = './features/code-challenge.js';

  script.onload = function() {
    console.log("Directly loaded code-challenge.js", !!window.codeChallenge);

    // Try using the global object
    if (window.codeChallenge && typeof window.codeChallenge.start === 'function') {
      console.log("Using globally available code challenge module from direct load");
      window.codeChallenge.start(terminal, editorArea);
      return;
    }
  };

  script.onerror = function(error) {
    console.error("Failed to load code-challenge.js directly:", error);
    displayModuleErrorMessage('Code Challenge module', terminal);
  };

  document.head.appendChild(script);
}
// Advanced feature command handlers
function enterJavaMode() {
    const terminal = document.querySelector('.terminal-content');
    const editorArea = document.getElementById('editorArea');

    if (javaTerminal && typeof javaTerminal.start === 'function') {
        javaTerminal.start(terminal, editorArea);
    } else {
        displayModuleErrorMessage('Java Terminal module', terminal);
    }
}

function showApiDemo() {
    const terminal = document.querySelector('.terminal-content');
    const editorArea = document.getElementById('editorArea');

    if (apiDemo && typeof apiDemo.start === 'function') {
        apiDemo.start(terminal, editorArea);
    } else {
        displayModuleErrorMessage('API Demo module', terminal);
    }
}

function showDatabaseViewer() {
    const terminal = document.querySelector('.terminal-content');
    const editorArea = document.getElementById('editorArea');

    if (databaseViewer && typeof databaseViewer.start === 'function') {
        databaseViewer.start(terminal, editorArea);
    } else {
        displayModuleErrorMessage('Database Viewer module', terminal);
    }
}

function showGitViewer() {
    const terminal = document.querySelector('.terminal-content');
    const editorArea = document.getElementById('editorArea');

    if (gitViewer && typeof gitViewer.start === 'function') {
        gitViewer.start(terminal, editorArea);
    } else {
        displayModuleErrorMessage('Git Viewer module', terminal);
    }
}

function showBuildTools() {
    const terminal = document.querySelector('.terminal-content');
    const editorArea = document.getElementById('editorArea');

    if (buildTools && typeof buildTools.start === 'function') {
        buildTools.start(terminal, editorArea);
    } else {
        displayModuleErrorMessage('Build Tools module', terminal);
    }
}

function showProjectDemo() {
    const terminal = document.querySelector('.terminal-content');
    const editorArea = document.getElementById('editorArea');

    if (projectDemo && typeof projectDemo.start === 'function') {
        projectDemo.start(terminal, editorArea);
    } else {
        displayModuleErrorMessage('Project Demo module', terminal);
    }
}

function showDevelopmentTools() {
    const terminal = document.querySelector('.terminal-content');
    const editorArea = document.getElementById('editorArea');

    if (ideTools && typeof ideTools.start === 'function') {
        ideTools.start(terminal, editorArea);
    } else {
        displayModuleErrorMessage('IDE Tools module', terminal);
    }
}

// Display error message for missing modules
function displayModuleErrorMessage(moduleName, terminal) {
    if (!terminal) {
        console.error('Terminal not found for error message');
        return;
    }

    const output = document.createElement('div');
    output.className = 'terminal-output';
    output.innerHTML = `<span style="color: #cc0000;">Error: ${moduleName} could not be loaded. Please check your network connection or try again later.</span>`;

    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        terminal.insertBefore(output, lastPrompt);
    } else {
        terminal.appendChild(output);
    }

    terminal.scrollTop = terminal.scrollHeight;
}

// Process terminal commands
function processTerminalCommand(command) {
    try {
        const terminal = document.querySelector('.terminal-content');
        const editorArea = document.getElementById('editorArea');

        if (!terminal) {
            console.error('Terminal content not found for command processing');
            return;
        }

        // Ensure the command is trimmed
        const trimmedCommand = command.trim();

        // First check if code challenge is active (via any method)
        if ((codeChallenge && typeof codeChallenge.isActive === 'function' && codeChallenge.isActive()) ||
           (window.codeChallenge && typeof window.codeChallenge.isActive === 'function' && window.codeChallenge.isActive())) {

            // Try module version first, then global version
            if (codeChallenge && typeof codeChallenge.processInput === 'function') {
                return codeChallenge.processInput(trimmedCommand, terminal, editorArea);
            } else if (window.codeChallenge && typeof window.codeChallenge.processInput === 'function') {
                return window.codeChallenge.processInput(trimmedCommand, terminal, editorArea);
            }
        }

        // Check if any other advanced mode is active
        if (javaTerminal && typeof javaTerminal.isActive === 'function' && javaTerminal.isActive()) {
            return javaTerminal.processInput(trimmedCommand, terminal, editorArea);
        } else if (apiDemo && typeof apiDemo.isActive === 'function' && apiDemo.isActive()) {
            return apiDemo.processInput(trimmedCommand, terminal, editorArea);
        } else if (databaseViewer && typeof databaseViewer.isActive === 'function' && databaseViewer.isActive()) {
            return databaseViewer.processInput(trimmedCommand, terminal, editorArea);
        } else if (gitViewer && typeof gitViewer.isActive === 'function' && gitViewer.isActive()) {
            return gitViewer.processInput(trimmedCommand, terminal, editorArea);
        } else if (buildTools && typeof buildTools.isActive === 'function' && buildTools.isActive()) {
            return buildTools.processInput(trimmedCommand, terminal, editorArea);
        } else if (projectDemo && typeof projectDemo.isActive === 'function' && projectDemo.isActive()) {
            return projectDemo.processInput(trimmedCommand, terminal, editorArea);
        } else if (ideTools && typeof ideTools.isActive === 'function' && ideTools.isActive()) {
            return ideTools.processInput(trimmedCommand, terminal, editorArea);
        }

        const output = document.createElement('div');
        output.className = 'terminal-output';

        // Define advanced command handlers
        const advancedCommands = {
            'java': enterJavaMode,
            'api': showApiDemo,
            'database': showDatabaseViewer,
            'git': showGitViewer,
            'build': showBuildTools,
            'demos': showProjectDemo,
            'tools': showDevelopmentTools,
            'challenge': startCodingChallenge
        };

        // Process different commands
        if (advancedCommands[trimmedCommand.toLowerCase()]) {
            // Handle advanced mode commands
            advancedCommands[trimmedCommand.toLowerCase()]();
            return;
        }

        switch (trimmedCommand.toLowerCase()) {
            case 'help':
                output.innerHTML = `
Available commands:

  about       - View my profile information
  skills      - View my technical skills
  projects    - Browse my portfolio projects
  experience  - See my work history
  hobbies     - Learn about my interests
  contact     - View my contact information
  github      - Open my GitHub profile
  linkedin    - Open my LinkedIn profile
  email       - Send me an email
  message     - Send me a message
  clear       - Clear the terminal

  // Advanced features
  java        - Enter Java REPL mode
  api         - Launch API demo interface
  database    - Open database schema viewer
  git         - View Git commit history
  build       - Show build pipeline visualization
  demos       - Access live project demos
  tools       - View development tools showcase
  challenge   - Try coding challenges
`;
                break;

            case 'about':