/**
 * Enhanced main.js
 * Includes terminal toggle button and robust feature loading
 */

// Global variables for module storage
let javaTerminal, projectDemo, ideTools, codeChallenge;

// Global variables for panel sizes
let directoryWidth = 250;
let terminalHeight = 200;
let terminalVisible = true; // Controls terminal visibility
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

// Define makeFilesClickable function first to avoid reference errors
function makeFilesClickable() {
    document.querySelectorAll('.tree-file').forEach(file => {
        // Skip if already has click handler
        if (file.getAttribute('data-click-initialized')) return;
        file.setAttribute('data-click-initialized', 'true');

        file.addEventListener('click', function(e) {
            e.stopPropagation();

            // Get the file name and corresponding section
            const fileName = this.textContent.trim();
            const section = fileName.replace('.md', '');

            // Find corresponding tab
            const tab = document.getElementById(`${section}Tab`);
            if (tab) {
                // Make sure the tab is visible
                tab.style.display = 'flex';

                // Add to openTabs in localStorage
                try {
                    let openTabs = JSON.parse(localStorage.getItem('openTabs') || '[]');
                    if (!openTabs.includes(section)) {
                        openTabs.push(section);
                        localStorage.setItem('openTabs', JSON.stringify(openTabs));
                    // Create output element for response
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Handle common commands
    const cmd = command.toLowerCase().trim();

    switch (cmd) {
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
        case 'skills':
        case 'projects':
        case 'experience':
        case 'hobbies':
        case 'contact':
            output.innerHTML = `Opening ${cmd}.md...`;
            showSection(cmd);
            break;

        case 'github':
            output.innerHTML = 'Opening GitHub profile in a new tab...';
            window.open('https://github.com/barretttaylor95', '_blank');
            break;

        case 'linkedin':
            output.innerHTML = 'Opening LinkedIn profile in a new tab...';
            window.open('https://www.linkedin.com/in/barrett-taylor-422237182/', '_blank');
            break;

        case 'email':
            output.innerHTML = 'Opening email client...';
            window.location.href = 'mailto:barrett.taylor95@gmail.com';
            break;

        case 'clear':
            // Clear all outputs and previous prompts
            while (terminal.firstChild) {
                terminal.removeChild(terminal.firstChild);
            }

            // Add welcome message
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'terminal-output';
            welcomeMsg.textContent = "Terminal cleared. Type help to see available commands.";
            terminal.appendChild(welcomeMsg);

            createNewPrompt(terminal);
            return; // Skip adding output and creating another prompt

        case 'message':
            showMessageForm(terminal);
            return; // Skip adding output and creating another prompt

        case 'java':
            if (javaTerminal && typeof javaTerminal.start === 'function') {
                output.innerHTML = 'Starting Java REPL mode...';
                terminal.appendChild(output);
                javaTerminal.start(terminal);
                return; // Skip creating another prompt as the module will handle it
            } else {
                output.innerHTML = 'Java terminal feature is not available.';
            }
            break;

        case 'demos':
            if (projectDemo && typeof projectDemo.start === 'function') {
                output.innerHTML = 'Starting project demos explorer...';
                terminal.appendChild(output);
                projectDemo.start(terminal, document.getElementById('editorArea'));
                return; // Skip creating another prompt as the module will handle it
            } else {
                output.innerHTML = 'Project demos feature is not available.';
            }
            break;

        case 'tools':
            if (ideTools && typeof ideTools.start === 'function') {
                output.innerHTML = 'Starting development tools showcase...';
                terminal.appendChild(output);
                ideTools.start(terminal, document.getElementById('editorArea'));
                return; // Skip creating another prompt as the module will handle it
            } else {
                output.innerHTML = 'IDE tools feature is not available.';
            }
            break;

        case 'challenge':
            if (codeChallenge && typeof codeChallenge.start === 'function') {
                output.innerHTML = 'Starting coding challenge mode...';
                terminal.appendChild(output);
                codeChallenge.start(terminal, document.getElementById('editorArea'));
                return; // Skip creating another prompt as the module will handle it
            } else {
                output.innerHTML = 'Coding challenge feature is not available.';
            }
            break;

        default:
            output.innerHTML = `Command not found: ${command}<br>Type 'help' to see available commands.`;
    }

    // Add output
    terminal.appendChild(output);

    // Create new prompt
    createNewPrompt(terminal);

    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
                } catch (e) {
                    console.warn('Error updating open tabs:', e);
                }

                // Activate the tab
                showSection(section);
            }
        });
    });

    // Make sure folder toggle works
    document.querySelectorAll('.tree-item').forEach(folderItem => {
        // Skip if already has click handler
        if (folderItem.getAttribute('data-click-initialized')) return;
        folderItem.setAttribute('data-click-initialized', 'true');

        folderItem.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFolder(this);
        });
    });
}

// Setup global functions for HTML elements
function setupGlobalFunctions() {
    // Make sure window.activateTab is available for HTML onclick attributes
    if (!window.activateTab) {
        window.activateTab = function(filename, section) {
            // Just show the section - it will now stay open along with other tabs
            if (section) {
                const tab = document.getElementById(section + 'Tab');
                if (tab) {
                    tab.style.display = 'flex';
                    showSection(section);
                }
            }
        };
    }

    // Make sure terminalProcessCommand is globally available
    if (!window.terminalProcessCommand) {
        window.terminalProcessCommand = function(command) {
            const terminal = document.querySelector('.terminal-content');
            if (!terminal) return;

            const inputElement = terminal.querySelector('.terminal-prompt:last-child .terminal-input');
            if (!inputElement) return;

            // Set the command text
            inputElement.textContent = command;

            // Create and dispatch Enter key event
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

    // Make sure toggleFolder is globally available
    if (!window.toggleFolder) {
        window.toggleFolder = toggleFolder;
    }
}

// Initialize resizable panels
function initResizablePanels() {
    const directoryHandle = document.getElementById('directoryResizeHandle');
    const terminalHandle = document.getElementById('terminalResizeHandle');
    const projectDirectory = document.getElementById('projectDirectory');
    const editorArea = document.getElementById('editorArea');
    const terminalPanel = document.getElementById('terminalPanel');

    // Restore saved panel sizes from localStorage
    try {
        const savedDirectoryWidth = parseInt(localStorage.getItem('directoryWidth'));
        const savedTerminalHeight = parseInt(localStorage.getItem('terminalHeight'));

        if (!isNaN(savedDirectoryWidth) && savedDirectoryWidth > 150 && savedDirectoryWidth < window.innerWidth - 300) {
            directoryWidth = savedDirectoryWidth;
        }

        if (!isNaN(savedTerminalHeight) && savedTerminalHeight > 100 && savedTerminalHeight < window.innerHeight - 200) {
            terminalHeight = savedTerminalHeight;
        }
    } catch (e) {
        console.warn('Error loading panel sizes:', e);
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
    }

    // Terminal resize handle events
    if (terminalHandle) {
        terminalHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDraggingTerminalHandle = true;
            startY = e.clientY;
            document.body.style.cursor = 'row-resize';
        });
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
            try {
                localStorage.setItem('directoryWidth', directoryWidth.toString());
            } catch (e) {
                console.warn('Error saving directoryWidth:', e);
            }
        }

        if (isDraggingTerminalHandle) {
            // Calculate height from bottom of window to cursor position
            const editorBottom = window.innerHeight - 25; // 25px for status bar
            const newTerminalHeight = editorBottom - e.clientY;

            // Only update if it's a reasonable size
            if (newTerminalHeight > 100 && newTerminalHeight < window.innerHeight - 200) {
                terminalHeight = newTerminalHeight;
                updatePanelSizes();

                // Save to localStorage
                try {
                    localStorage.setItem('terminalHeight', terminalHeight.toString());
                } catch (e) {
                    console.warn('Error saving terminalHeight:', e);
                }
            }
        }
    });

    // Mouse up event to stop dragging
    document.addEventListener('mouseup', () => {
        if (isDraggingDirectoryHandle || isDraggingTerminalHandle) {
            isDraggingDirectoryHandle = false;
            isDraggingTerminalHandle = false;
            document.body.style.cursor = 'default';
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

    if (!projectDirectory || !editorArea || !terminalPanel) {
        console.error('Missing critical elements for resizing');
        return;
    }

    try {
        // Update directory width
        projectDirectory.style.width = `${directoryWidth}px`;

        // Update editor position and width
        editorArea.style.left = `${directoryWidth}px`;
        editorArea.style.width = `calc(100% - ${directoryWidth}px)`;

        // Position the terminal panel
        terminalPanel.style.height = `${terminalHeight}px`;

        // Update editor height to account for terminal
        // Only adjust if terminal is visible
        if (terminalVisible) {
            editorArea.style.bottom = `${terminalHeight + 25}px`; // Add status bar height
        } else {
            editorArea.style.bottom = '25px'; // Just status bar
        }
    } catch (error) {
        console.error('Error updating panel sizes:', error);
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
        try {
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        } catch (e) {
            console.warn('Error saving theme preference:', e);
        }
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}

// Function to load a script asynchronously
function loadScript(url, callback) {
    console.log(`Loading script: ${url}`);
    const script = document.createElement('script');
    script.type = 'text/javascript';
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

// Export functions for use in HTML attributes if needed
window.toggleTerminalVisibility = toggleTerminalVisibility;
window.toggleTheme = toggleTheme;
window.toggleFolder = toggleFolder;
window.showSection = showSection;
window.launchFeature = launchFeature;
window.activateTab = activateTab;

// Setup tab click events
function setupTabEvents() {
    // Add click events to tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
        // Skip if already has click handler
        if (tab.getAttribute('data-click-initialized')) return;
        tab.setAttribute('data-click-initialized', 'true');

        tab.addEventListener('click', function() {
            const sectionId = this.id.replace('Tab', '');
            showSection(sectionId);
        });

        // Add click events to close buttons
        const closeBtn = tab.querySelector('.close-tab');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent activating the tab when closing

                // Get the tab and its associated content
                const tab = this.closest('.editor-tab');
                const sectionId = tab.id.replace('Tab', '');

                // Hide the tab and content
                tab.style.display = 'none';

                // Update openTabs in localStorage
                try {
                    let openTabs = JSON.parse(localStorage.getItem('openTabs') || '[]');
                    openTabs = openTabs.filter(tabId => tabId !== sectionId);

                    // Make sure we always have at least one tab open
                    if (openTabs.length === 0) {
                        openTabs.push('about');
                        document.getElementById('aboutTab').style.display = 'flex';
                    }

                    localStorage.setItem('openTabs', JSON.stringify(openTabs));
                } catch (e) {
                    console.warn('Error updating open tabs:', e);
                }

                // If this was the active tab, activate another visible tab
                if (tab.classList.contains('active')) {
                    // Find another visible tab to activate
                    const visibleTabs = Array.from(document.querySelectorAll('.editor-tab'))
                        .filter(t => t.style.display !== 'none');

                    if (visibleTabs.length > 0) {
                        // Activate the first visible tab
                        const newActiveTabId = visibleTabs[0].id.replace('Tab', '');
                        showSection(newActiveTabId);
                    } else {
                        // If no visible tabs, show about tab
                        const aboutTab = document.getElementById('aboutTab');
                        if (aboutTab) {
                            aboutTab.style.display = 'flex';
                            showSection('about');
                        }
                    }
                }
            });
        }
    });
}

// Show the active section content and tab
function showSection(section) {
    try {
        // Find the content and tab elements
        const contentElement = document.getElementById(section + 'Content');
        const tabElement = document.getElementById(section + 'Tab');

        if (!contentElement || !tabElement) {
            console.warn(`Section '${section}' not found`);
            return;
        }

        // Hide all content sections
        document.querySelectorAll('.code-content').forEach(content => {
            content.classList.remove('active');
        });

        // Deactivate all tabs (but don't hide them)
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show and activate the selected content and tab
        contentElement.classList.add('active');
        tabElement.style.display = 'flex'; // Ensure the tab is visible
        tabElement.classList.add('active');

        // Update active tab variable
        activeTab = section;

        // Save to localStorage
        try {
            localStorage.setItem('activeTab', section);

            // Make sure this tab is in the openTabs list
            let openTabs = JSON.parse(localStorage.getItem('openTabs') || '[]');
            if (!openTabs.includes(section)) {
                openTabs.push(section);
                localStorage.setItem('openTabs', JSON.stringify(openTabs));
            }
        } catch (e) {
            console.warn('Error saving tab state:', e);
        }
    } catch (error) {
        console.error('Error showing section:', error);
    }
}

// Export activateTab function globally and early to avoid undefined errors
window.activateTab = function(filename, section) {
    // Just show the section - it will now stay open along with other tabs
    if (section) {
        const tab = document.getElementById(section + 'Tab');
        if (tab) {
            tab.style.display = 'flex';
            showSection(section);
        }
    }
};

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
        }
    } catch (error) {
        console.error('Error toggling folder:', error);
    }
}

// Document ready event
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded, initializing application');

    // Export toggle function globally early to avoid undefined errors
    window.toggleFolder = toggleFolder;

    // Hide loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }

    // Check for saved terminal visibility preference
    try {
        const savedVisibility = localStorage.getItem('terminalVisible');
        if (savedVisibility !== null) {
            terminalVisible = savedVisibility === 'true';
        }
    } catch (e) {
        console.warn('Could not load terminal visibility preference:', e);
    }

    // Create terminal toggle button
    createTerminalToggleButton();

    // Create features dropdown
    createFeaturesDropdown();

    // Initialize the application
    initializePortfolio();

    // Load feature modules after UI is ready
    loadFeatureModules();

// Show message form in terminal
function showMessageForm(terminal) {
    const formContainer = document.createElement('div');
    formContainer.className = 'terminal-output';
    formContainer.innerHTML = `
        <div>Enter your message (press Enter to send, ESC to cancel):</div>
        <textarea style="width: 100%; height: 80px; background-color: #2d2d2d; color: #dcdcdc; border: 1px solid #444; padding: 8px; margin-top: 8px; outline: none; resize: none; font-family: 'JetBrains Mono', 'Consolas', monospace;"></textarea>
    `;

    // Add to terminal
    terminal.appendChild(formContainer);

    // Focus textarea
    const textarea = formContainer.querySelector('textarea');
    textarea.focus();

    // Handle key events
    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = this.value.trim();

            // Remove textarea
            formContainer.removeChild(textarea);

            const responseDiv = document.createElement('div');
            responseDiv.className = 'terminal-output';

            if (message) {
                // Show confirmation
                responseDiv.innerHTML = `Message sent:<br>${message}<br><br>Thank you! Your message has been sent to barrett.taylor95@gmail.com`;
                // Add response to the form container
                formContainer.appendChild(responseDiv);
            } else {
                // Empty message
                responseDiv.innerHTML = `Message canceled - empty message.`;
                // Add response to the form container
                formContainer.appendChild(responseDiv);
            }

            // Create new prompt
            createNewPrompt(terminal);

            // Scroll to bottom
            terminal.scrollTop = terminal.scrollHeight;
        } else if (e.key === 'Escape') {
            // Cancel message
            formContainer.removeChild(textarea);

            const cancelDiv = document.createElement('div');
            cancelDiv.className = 'terminal-output';
            cancelDiv.textContent = 'Message canceled.';
            formContainer.appendChild(cancelDiv);

            // Create new prompt
            createNewPrompt(terminal);

            // Scroll to bottom
            terminal.scrollTop = terminal.scrollHeight;
        }
    });
}

// Launch a specific feature
// Show message for unavailable features
function showFeatureUnavailableMessage(featureName) {
    const terminal = document.querySelector('.terminal-content');
    if (!terminal) return;

    const output = document.createElement('div');
    output.className = 'terminal-output';
    output.innerHTML = `<span style="color: #cc7832;">${featureName}</span> feature is currently unavailable. Please check the console for errors or try again later.`;

    // Add output to terminal
    terminal.appendChild(output);

    // Create new prompt
    createNewPrompt(terminal);

    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

function launchFeature(feature) {
    console.log(`Launching feature: ${feature}`);

    // Make sure terminal is visible for features that need it
    const terminalPanel = document.getElementById('terminalPanel');
    if (terminalPanel && terminalPanel.style.display === 'none') {
        toggleTerminalVisibility();
    }

    // Handle different features
    switch (feature) {
        case 'challenge':
            if (codeChallenge && typeof codeChallenge.start === 'function') {
                codeChallenge.start(
                    document.querySelector('.terminal-content'),
                    document.getElementById('editorArea')
                );
            } else {
                showFeatureUnavailableMessage('Code Challenge');
            }
            break;

        case 'java':
            if (javaTerminal && typeof javaTerminal.start === 'function') {
                javaTerminal.start(document.querySelector('.terminal-content'));
            } else {
                showFeatureUnavailableMessage('Java Terminal');
            }
            break;

        case 'tools':
            if (ideTools && typeof ideTools.start === 'function') {
                ideTools.start(
                    document.querySelector('.terminal-content'),
                    document.getElementById('editorArea')
                );
            } else {
                showFeatureUnavailableMessage('IDE Tools');
            }
            break;

        case 'demos':
            if (projectDemo && typeof projectDemo.start === 'function') {
                projectDemo.start(
                    document.querySelector('.terminal-content'),
                    document.getElementById('editorArea')
                );
            } else {
                showFeatureUnavailableMessage('Project Demos');
            }
            break;

        default:
            console.error(`Unknown feature: ${feature}`);
    }
}

    // Setup global functions for HTML elements
    setupGlobalFunctions();

    // Apply terminal visibility setting after initialization
    const terminalPanel = document.getElementById('terminalPanel');
    const editorArea = document.getElementById('editorArea');
    if (terminalPanel && editorArea) {
        if (!terminalVisible) {
            terminalPanel.style.display = 'none';
            editorArea.style.bottom = '25px';
        }
    }
});

// Create a terminal toggle button in the top navigation area
function createTerminalToggleButton() {
    // Find target location (after main dropdown)
    const mainDropdown = document.querySelector('.dropdown');
    if (!mainDropdown) {
        console.error('Cannot find main dropdown to place terminal toggle button');
        return;
    }

    // Add styles for the terminal toggle button
    const style = document.createElement('style');
    style.textContent = `
        .terminal-toggle-button {
            transition: background-color 0.2s;
            position: relative;
            display: flex;
            align-items: center;
            padding: 0 12px;
            height: 100%;
            cursor: pointer;
            margin-left: 10px;
        }
        .terminal-toggle-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .terminal-toggle-button.active {
            background-color: #4e5254;
        }
        .terminal-toggle-button i {
            margin-right: 6px;
            font-size: 14px;
        }
        .tooltip {
            position: absolute;
            bottom: -35px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #3c3f41;
            color: #a9b7c6;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            white-space: nowrap;
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 100;
            border: 1px solid #555;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
        .tooltip::before {
            content: "";
            position: absolute;
            top: -5px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 0 5px 5px;
            border-style: solid;
            border-color: transparent transparent #3c3f41;
        }
        .terminal-toggle-button:hover .tooltip {
            visibility: visible;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Create button
    const toggleButton = document.createElement('div');
    toggleButton.className = 'terminal-toggle-button';
    toggleButton.innerHTML = `
        <i class="fas fa-terminal"></i> Terminal
        <div class="tooltip">Toggle Terminal Panel</div>
    `;

    // Set initial active state
    toggleButton.classList.toggle('active', terminalVisible);

    // Insert after main dropdown
    mainDropdown.parentNode.insertBefore(toggleButton, mainDropdown.nextSibling);

    // Add click event
    toggleButton.addEventListener('click', function() {
        toggleTerminalVisibility();
        // Update the active class based on terminal visibility
        this.classList.toggle('active', terminalVisible);
    });
}

// Create features dropdown menu in the top navigation area
function createFeaturesDropdown() {
    // Find target location (after terminal button)
    const terminalButton = document.querySelector('.terminal-toggle-button');
    if (!terminalButton) {
        console.error('Cannot find terminal button to place features dropdown');
        return;
    }

    // Add styles for the features dropdown
    const style = document.createElement('style');
    style.textContent = `
        .features-dropdown {
            position: relative;
            display: flex;
            align-items: center;
            padding: 0 12px;
            height: 100%;
            cursor: pointer;
            margin-left: 10px;
            transition: background-color 0.2s;
        }
        .features-dropdown:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .features-dropdown i {
            margin-right: 6px;
            font-size: 14px;
        }
        .features-dropdown .fa-chevron-down {
            margin-left: 6px;
            font-size: 10px;
            opacity: 0.7;
        }
        .features-menu {
            position: absolute;
            top: 100%;
            left: 0;
            background-color: #3c3f41;
            border: 1px solid #555;
            border-radius: 3px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            z-index: 100;
            display: none;
            width: 220px;
        }
        .features-dropdown.open .features-menu {
            display: block;
        }
        .features-menu-item {
            padding: 8px 12px;
            border-bottom: 1px solid #555;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
        }
        .features-menu-item:last-child {
            border-bottom: none;
        }
        .features-menu-item:hover {
            background-color: #4e5254;
        }
        .features-menu-item i {
            width: 20px;
            text-align: center;
        }
        .features-menu-item span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .features-menu-item .description {
            font-size: 11px;
            opacity: 0.7;
            margin-top: 3px;
            white-space: normal;
        }
    `;
    document.head.appendChild(style);

    // Create dropdown button
    const dropdown = document.createElement('div');
    dropdown.className = 'features-dropdown';
    dropdown.innerHTML = `
        <i class="fas fa-code"></i> Features <i class="fas fa-chevron-down"></i>
        <div class="features-menu">
            <div class="features-menu-item" data-feature="challenge">
                <i class="fas fa-puzzle-piece"></i>
                <div>
                    <span>Code Challenges</span>
                    <div class="description">Interactive coding problems to solve</div>
                </div>
            </div>
            <div class="features-menu-item" data-feature="java">
                <i class="fab fa-java"></i>
                <div>
                    <span>Java Terminal</span>
                    <div class="description">Java code execution environment</div>
                </div>
            </div>
            <div class="features-menu-item" data-feature="tools">
                <i class="fas fa-tools"></i>
                <div>
                    <span>IDE Tools</span>
                    <div class="description">Development tools showcase</div>
                </div>
            </div>
            <div class="features-menu-item" data-feature="demos">
                <i class="fas fa-desktop"></i>
                <div>
                    <span>Project Demos</span>
                    <div class="description">Live project demonstrations</div>
                </div>
            </div>
        </div>
    `;

    // Insert after terminal button
    terminalButton.parentNode.insertBefore(dropdown, terminalButton.nextSibling);

    // Toggle dropdown on click
    dropdown.addEventListener('click', function(e) {
        if (e.target.closest('.features-menu-item')) {
            // If clicking a menu item, don't toggle the dropdown
            return;
        }
        this.classList.toggle('open');
    });

    // Handle feature selection
    const menuItems = dropdown.querySelectorAll('.features-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            launchFeature(feature);
            dropdown.classList.remove('open');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.features-dropdown')) {
            dropdown.classList.remove('open');
        }
    });
}

// Toggle terminal panel visibility
function toggleTerminalVisibility() {
    const terminalPanel = document.getElementById('terminalPanel');
    const editorArea = document.getElementById('editorArea');

    if (!terminalPanel || !editorArea) return;

    if (terminalVisible) {
        // Hide terminal
        terminalPanel.style.display = 'none';
        editorArea.style.bottom = '25px'; // Just allow for status bar
    } else {
        // Show terminal
        terminalPanel.style.display = 'flex';
        editorArea.style.bottom = `${terminalHeight + 25}px`; // terminal + status bar
    }

    terminalVisible = !terminalVisible;

    // Update toggle button appearance
    const toggleButton = document.querySelector('.terminal-toggle-button');
    if (toggleButton) {
        toggleButton.classList.toggle('active', terminalVisible);
    }

    // Save preference to localStorage
    try {
        localStorage.setItem('terminalVisible', terminalVisible ? 'true' : 'false');
    } catch (e) {
        console.warn('Could not save terminal visibility preference:', e);
    }
}

// Initialize the portfolio
function initializePortfolio() {
    console.log('Initializing portfolio');

    // Create terminal panel
    createTerminalPanel();

    // Initialize resizable panels
    initResizablePanels();

    // Check for theme preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        isDarkMode = storedTheme === 'dark';
        if (!isDarkMode) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
        }
    }

    // Set up theme toggle button
    const themeToggleBtn = document.querySelector('.action-button');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Load the open tabs from localStorage
    try {
        const openTabs = JSON.parse(localStorage.getItem('openTabs') || '["about"]');

        // Make sure all tabs in the list are displayed
        openTabs.forEach(tabId => {
            const tab = document.getElementById(tabId + 'Tab');
            if (tab) {
                tab.style.display = 'flex';
            }
        });

        // Activate the last active tab
        const savedTab = localStorage.getItem('activeTab') || 'about';
        if (openTabs.includes(savedTab)) {
            showSection(savedTab);
        } else if (openTabs.length > 0) {
            showSection(openTabs[0]);
        } else {
            showSection('about');
        }
    } catch (e) {
        console.warn('Error loading open tabs:', e);

        // Expand the root folder by default
        const rootFolder = document.querySelector('.tree-item');
        if (rootFolder) {
            toggleFolder(rootFolder);
        }

        // Default to about tab
        showSection('about');
    }

    // Setup tab click events
    setupTabEvents();

    // Make project directory files clickable
    makeFilesClickable();

    // Check if there's a hash in the URL
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
        const section = hash.substring(1);
        const tab = document.getElementById(section + 'Tab');

        // Only show section if tab exists
        if (tab) {
            tab.style.display = 'flex';
            showSection(section);
        }
    }
}

// Create the terminal panel
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

    // Set initial styles
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

    // Create initial prompt
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

    // Set up interactive terminal
    setupInteractiveTerminal();

    // Adjust the editor area to make room for terminal
    const editorArea = document.getElementById('editorArea');
    if (editorArea) {
        editorArea.style.bottom = (terminalHeight + 25) + 'px'; // terminal height + status bar
    }

    console.log('Terminal panel created successfully');
}

// Load feature modules
function loadFeatureModules() {
    console.log('Loading feature modules...');

    // Load java terminal
    loadScript('./features/java-terminal.js', function(err) {
        if (err) {
            console.warn('Error loading java-terminal.js:', err);
        } else {
            console.log('Successfully loaded java-terminal.js');
            javaTerminal = window.javaTerminal;
        }
    });

    // Load project demo
    loadScript('./features/project-demo.js', function(err) {
        if (err) {
            console.warn('Error loading project-demo.js:', err);
        } else {
            console.log('Successfully loaded project-demo.js');
            projectDemo = window.projectDemo;
        }
    });

    // Load IDE tools
    loadScript('./features/ide-tools.js', function(err) {
        if (err) {
            console.warn('Error loading ide-tools.js:', err);
        } else {
            console.log('Successfully loaded ide-tools.js');
            ideTools = window.ideTools;
        }
    });

    // Load code challenge (after fixing it)
    loadScript('./features/code-challenge.js', function(err) {
        if (err) {
            console.warn('Error loading code-challenge.js:', err);
            console.log('Code challenge will be unavailable');
        } else {
            console.log('Successfully loaded code-challenge.js');
            codeChallenge = window.codeChallenge;
        }
    });
}

// Set up interactive terminal
function setupInteractiveTerminal() {
    const terminalContent = document.querySelector('.terminal-content');
    if (!terminalContent) {
        console.error('Terminal content not found');
        return;
    }

    const terminalInput = terminalContent.querySelector('.terminal-prompt:last-child .terminal-input');
    if (!terminalInput) {
        console.error('Terminal input not found');
        return;
    }

    // Focus the input
    terminalInput.focus();

    // Make terminal clickable to focus input
    terminalContent.addEventListener('click', function(e) {
        // Only focus if not clicking an interactive element
        if (!e.target.closest('a, button, [contenteditable], textarea')) {
            const currentInput = this.querySelector('.terminal-prompt:last-child .terminal-input');
            if (currentInput) {
                currentInput.focus();
            }
        }
    });

    // Handle key events
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            // Get command
            const command = this.textContent.trim();

            // Store in history
            if (command) {
                commandHistory.unshift(command);
                if (commandHistory.length > 50) commandHistory.pop(); // Limit history size
                historyIndex = -1;
            }

            // Clear input
            this.textContent = '';

            // Create command echo
            const commandOutput = document.createElement('div');
            commandOutput.className = 'terminal-output';
            commandOutput.innerHTML = `
                <span class="terminal-user">guest</span>
                <span class="terminal-at">@</span>
                <span class="terminal-machine">portfolio</span>
                <span class="terminal-colon">:</span>
                <span class="terminal-directory">~</span>
                <span class="terminal-symbol">$</span>
                <span>${command}</span>
            `;
            terminalContent.appendChild(commandOutput);

            // Process command
            processTerminalCommand(command, terminalContent);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();

            // Navigate history
            if (historyIndex === -1) {
                currentTerminalInput = this.textContent;
            }

            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                this.textContent = commandHistory[historyIndex];
                // Place cursor at end
                positionCursorAtEnd(this);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();

            // Navigate history
            if (historyIndex > 0) {
                historyIndex--;
                this.textContent = commandHistory[historyIndex];
            } else if (historyIndex === 0) {
                historyIndex = -1;
                this.textContent = currentTerminalInput;
            }

            // Place cursor at end
            positionCursorAtEnd(this);
        }
    });
}

// Position cursor at the end of an element
function positionCursorAtEnd(element) {
    if (element.textContent) {
        const range = document.createRange();
        const selection = window.getSelection();

        range.selectNodeContents(element);
        range.collapse(false); // false means collapse to end

        selection.removeAllRanges();
        selection.addRange(range);
    }
}

// Create a new terminal prompt
function createNewPrompt(terminal, user = 'guest', machine = 'portfolio', directory = '~') {
    const prompt = document.createElement('div');
    prompt.className = 'terminal-prompt';
    prompt.innerHTML = `
        <span class="terminal-user">${user}</span>
        <span class="terminal-at">@</span>
        <span class="terminal-machine">${machine}</span>
        <span class="terminal-colon">:</span>
        <span class="terminal-directory">${directory}</span>
        <span class="terminal-symbol">${user === 'code' ? '>' : '

// Process terminal commands
function processTerminalCommand(command, terminal) {
    if (!command.trim()) {
        createNewPrompt(terminal);
        return;
    }

    // First check if any special mode is active
    if (javaTerminal && typeof javaTerminal.isActive === 'function' && javaTerminal.isActive()) {
        const continueInMode = javaTerminal.processInput(command, terminal);
        if (continueInMode) {
            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }
        // If returned false, mode has exited, create new standard prompt
        createNewPrompt(terminal);
        return;
    } else if (projectDemo && typeof projectDemo.isActive === 'function' && projectDemo.isActive()) {
        const continueInMode = projectDemo.processInput(command, terminal, document.getElementById('editorArea'));
        if (continueInMode) {
            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }
        // If returned false, mode has exited, create new standard prompt
        createNewPrompt(terminal);
        return;
    } else if (ideTools && typeof ideTools.isActive === 'function' && ideTools.isActive()) {
        const continueInMode = ideTools.processInput(command, terminal, document.getElementById('editorArea'));
        if (continueInMode) {
            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }
        // If returned false, mode has exited, create new standard prompt
        createNewPrompt(terminal);
        return;
    } else if (codeChallenge && typeof codeChallenge.isActive === 'function' && codeChallenge.isActive()) {
        const continueInMode = codeChallenge.processInput(command, terminal, document.getElementById('editorArea'));
        if (continueInMode) {
            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }
        // If returned false, mode has exited, create new standard prompt
        createNewPrompt(terminal);
        return;
    }}</span>
        <span class="terminal-input" contenteditable="true" spellcheck="false"></span>
        <span class="typing-cursor"></span>
    `;

    // Add to terminal
    terminal.appendChild(prompt);

    // Set up event listeners for new input
    const input = prompt.querySelector('.terminal-input');
    if (input) {
        input.focus();

        // Handle key events
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();

                // Get command
                const command = this.textContent.trim();

                // Store in history
                if (command) {
                    commandHistory.unshift(command);
                    if (commandHistory.length > 50) commandHistory.pop(); // Limit history size
                    historyIndex = -1;
                }

                // Clear input
                this.textContent = '';

                // Create command echo
                const commandOutput = document.createElement('div');
                commandOutput.className = 'terminal-output';
                commandOutput.innerHTML = `
                    <span class="terminal-user">${user}</span>
                    <span class="terminal-at">@</span>
                    <span class="terminal-machine">${machine}</span>
                    <span class="terminal-colon">:</span>
                    <span class="terminal-directory">${directory}</span>
                    <span class="terminal-symbol">${user === 'code' ? '>' : '

// Process terminal commands
function processTerminalCommand(command, terminal) {
    if (!command.trim()) {
        createNewPrompt(terminal);
        return;
    }

    // First check if any special mode is active
    if (javaTerminal && typeof javaTerminal.isActive === 'function' && javaTerminal.isActive()) {
        const continueInMode = javaTerminal.processInput(command, terminal);
        if (continueInMode) {
            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }
        // If returned false, mode has exited, create new standard prompt
        createNewPrompt(terminal);
        return;
    } else if (projectDemo && typeof projectDemo.isActive === 'function' && projectDemo.isActive()) {
        const continueInMode = projectDemo.processInput(command, terminal, document.getElementById('editorArea'));
        if (continueInMode) {
            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }
        // If returned false, mode has exited, create new standard prompt
        createNewPrompt(terminal);
        return;
    } else if (ideTools && typeof ideTools.isActive === 'function' && ideTools.isActive()) {
        const continueInMode = ideTools.processInput(command, terminal, document.getElementById('editorArea'));
        if (continueInMode) {
            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }
        // If returned false, mode has exited, create new standard prompt
        createNewPrompt(terminal);
        return;
    } else if (codeChallenge && typeof codeChallenge.isActive === 'function' && codeChallenge.isActive()) {
        const continueInMode = codeChallenge.processInput(command, terminal, document.getElementById('editorArea'));
        if (continueInMode) {
            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }
        // If returned false, mode has exited, create new standard prompt
        createNewPrompt(terminal);
        return;
    }}</span>
                    <span>${command}</span>
                `;
                terminal.appendChild(commandOutput);

                // Process command
                processTerminalCommand(command, terminal);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();

                // Navigate history
                if (historyIndex === -1) {
                    currentTerminalInput = this.textContent;
                }

                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    this.textContent = commandHistory[historyIndex];
                    // Place cursor at end
                    positionCursorAtEnd(this);
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();

                // Navigate history
                if (historyIndex > 0) {
                    historyIndex--;
                    this.textContent = commandHistory[historyIndex];
                } else if (historyIndex === 0) {
                    historyIndex = -1;
                    this.textContent = currentTerminalInput;
                }

                // Place cursor at end
                positionCursorAtEnd(this);
            }
        });
    }

    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

// Process terminal commands
function processTerminalCommand(command, terminal) {
    if (!command.trim()) {
        createNewPrompt(terminal);
        return;
    }

    // First check if any special mode is active
    if (javaTerminal && typeof javaTerminal.isActive === 'function' && javaTerminal.isActive()) {
        const continueInMode = javaTerminal.processInput(command, terminal);
        if (continueInMode) {
            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }
        // If returned false, mode has exited, create new standard prompt
        createNewPrompt(terminal);
        return;
    } else if (projectDemo && typeof projectDemo.isActive === 'function' && projectDemo.isActive()) {
        const continueInMode = projectDemo.processInput(command, terminal, document.getElementById('editorArea'));
        if (continueInMode) {
            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }
        // If returned false, mode has exited, create new standard prompt
        createNewPrompt(terminal);
        return;
    } else if (ideTools && typeof ideTools.isActive === 'function' && ideTools.isActive()) {
        const continueInMode = ideTools.processInput(command, terminal, document.getElementById('editorArea'));
        if (continueInMode) {
            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }
        // If returned false, mode has exited, create new standard prompt
        createNewPrompt(terminal);
        return;
    } else if (codeChallenge && typeof codeChallenge.isActive === 'function' && codeChallenge.isActive()) {
        const continueInMode = codeChallenge.processInput(command, terminal, document.getElementById('editorArea'));
        if (continueInMode) {
            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }
        // If returned false, mode has exited, create new standard prompt
        createNewPrompt(terminal);
        return;
    }