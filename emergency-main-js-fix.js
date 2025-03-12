// Setup directory resize functionality
function setupDirectoryResize() {
    // Find or create directory resize handle
    let directoryHandle = document.getElementById('directoryResizeHandle');

    if (!directoryHandle) {
        const projectDirectory = document.getElementById('projectDirectory');
        if (!projectDirectory) {
            console.warn('Project directory not found for resize handle');
            return;
        }

        // Create resize handle
        directoryHandle = document.createElement('div');
        directoryHandle.id = 'directoryResizeHandle';
        directoryHandle.className = 'resize-handle horizontal-resize-handle';
        directoryHandle.style.position = 'absolute';
        directoryHandle.style.top = '0';
        directoryHandle.style.bottom = '0';
        directoryHandle.style.right = '0';
        directoryHandle.style.width = '5px';
        directoryHandle.style.cursor = 'col-resize';
        directoryHandle.style.zIndex = '50';

        projectDirectory.appendChild(directoryHandle);
        projectDirectory.style.position = 'relative';
    }

    // Add event listeners for resize
    directoryHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isDraggingDirectoryHandle = true;
        startX = e.clientX;

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });
}

// Setup terminal resize functionality
function setupTerminalResize() {
    const terminalHandle = document.getElementById('terminalResizeHandle');
    if (!terminalHandle) {
        console.warn('Terminal resize handle not found');
        return;
    }

    // Add event listeners for resize
    terminalHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isDraggingTerminalHandle = true;
        startY = e.clientY;

        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
    });
}

// Update panel sizes based on current values
function updatePanelSizes() {
    const projectDirectory = document.getElementById('projectDirectory');
    const editorArea = document.getElementById('editorArea');
    const terminalPanel = document.getElementById('terminalPanel');

    if (!projectDirectory || !editorArea || !terminalPanel) {
        console.warn('Missing elements for resize');
        return;
    }

    // Update directory width
    projectDirectory.style.width = directoryWidth + 'px';

    // Update editor position
    editorArea.style.left = directoryWidth + 'px';
    editorArea.style.width = `calc(100% - ${directoryWidth}px)`;

    // Update terminal height
    terminalPanel.style.height = terminalHeight + 'px';

    // Update editor bottom position based on terminal visibility
    if (terminalVisible) {
        editorArea.style.bottom = (terminalHeight + 25) + 'px'; // terminal + status bar
    } else {
        editorArea.style.bottom = '25px'; // just status bar
    }
}/**
 * Emergency Fixed Version of main.js
 * This script focuses on reliably creating the terminal interface
 */

// Define the activateTab function globally early
window.activateTab = function(filename, section) {
    if (section) {
        const tab = document.getElementById(section + 'Tab');
        const content = document.getElementById(section + 'Content');

        if (tab && content) {
            // Hide all content
            document.querySelectorAll('.code-content').forEach(c => {
                c.classList.remove('active');
            });

            // Deactivate all tabs
            document.querySelectorAll('.editor-tab').forEach(t => {
                t.classList.remove('active');
            });

            // Show this tab and content
            tab.style.display = 'flex';
            tab.classList.add('active');
            content.classList.add('active');
        }
    }
};

// Define toggle folder globally early
window.toggleFolder = function(element) {
    const nestedFiles = element.nextElementSibling;
    const icon = element.querySelector('.fa-chevron-right');

    if (nestedFiles && nestedFiles.classList.contains('nested-files')) {
        const isExpanded = nestedFiles.style.display === 'block';
        nestedFiles.style.display = isExpanded ? 'none' : 'block';

        if (icon) {
            icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
        }
    }
};

// Define terminal command processor globally early
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

// Global state
let terminalVisible = true;
let terminalHeight = 200;
let directoryWidth = 250;
let isDraggingDirectoryHandle = false;
let isDraggingTerminalHandle = false;
let startX = 0;
let startY = 0;

// Simple event listener to ensure the terminal is created
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing emergency terminal');

    // Hide loading overlay if it exists
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }

    // Create the terminal immediately with simple approach
    createSimpleTerminal();

    // Create terminal toggle button
    createTerminalToggleButton();

    // Create features dropdown
    createFeaturesMenu();

    // Set up file click handlers
    setupFileClickHandlers();

    // Add resize event handlers
    setupTerminalResize();
    setupDirectoryResize();

    // Add resize-related listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
});

// Handle mouse move for resizing
function handleMouseMove(e) {
    if (isDraggingDirectoryHandle) {
        // Resize directory
        const deltaX = e.clientX - startX;
        directoryWidth += deltaX;
        startX = e.clientX;

        // Apply size constraints
        directoryWidth = Math.max(150, Math.min(window.innerWidth - 300, directoryWidth));

        // Update sizes
        updatePanelSizes();
    }

    if (isDraggingTerminalHandle) {
        // Calculate height from bottom of window to cursor position
        const windowBottom = window.innerHeight;
        const statusBarHeight = 25;
        const newTerminalHeight = windowBottom - e.clientY - statusBarHeight;

        // Apply size constraints
        if (newTerminalHeight >= 100 && newTerminalHeight <= window.innerHeight - 200) {
            terminalHeight = newTerminalHeight;

            // Update sizes
            updatePanelSizes();
        }
    }
}

// Handle mouse up for resizing
function handleMouseUp() {
    if (isDraggingDirectoryHandle || isDraggingTerminalHandle) {
        isDraggingDirectoryHandle = false;
        isDraggingTerminalHandle = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        // Try to save sizes to localStorage
        try {
            localStorage.setItem('directoryWidth', directoryWidth);
            localStorage.setItem('terminalHeight', terminalHeight);
        } catch (e) {
            console.warn('Failed to save panel sizes to localStorage:', e);
        }
    }
}

// Create a simple terminal panel
function createSimpleTerminal() {
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) {
        console.error('Content area not found');
        return;
    }

    // Check if terminal already exists
    if (document.getElementById('terminalPanel')) {
        console.log('Terminal panel already exists');
        return;
    }

    console.log('Creating simple terminal panel');

    // Create terminal panel
    const terminalPanel = document.createElement('div');
    terminalPanel.id = 'terminalPanel';
    terminalPanel.className = 'terminal-panel';
    terminalPanel.style.position = 'absolute';
    terminalPanel.style.left = '0';
    terminalPanel.style.right = '0';
    terminalPanel.style.bottom = '25px'; // space for status bar
    terminalPanel.style.height = '200px';
    terminalPanel.style.backgroundColor = '#1e1e1e';
    terminalPanel.style.borderTop = '1px solid #323232';
    terminalPanel.style.display = 'flex';
    terminalPanel.style.flexDirection = 'column';
    terminalPanel.style.zIndex = '3';

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
    terminalHeader.style.height = '32px';
    terminalHeader.style.backgroundColor = '#3c3f41';
    terminalHeader.style.borderBottom = '1px solid #323232';
    terminalHeader.style.display = 'flex';
    terminalHeader.style.alignItems = 'center';
    terminalHeader.style.padding = '0 15px';
    terminalHeader.innerHTML = '<div class="terminal-title" style="font-weight: bold;">Terminal</div>';

    // Create terminal content
    const terminalContent = document.createElement('div');
    terminalContent.className = 'terminal-content';
    terminalContent.style.flex = '1';
    terminalContent.style.backgroundColor = '#1e1e1e';
    terminalContent.style.padding = '10px';
    terminalContent.style.fontFamily = "'JetBrains Mono', 'Consolas', monospace";
    terminalContent.style.color = '#dcdcdc';
    terminalContent.style.overflowY = 'auto';

    // Add welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'terminal-output';
    welcomeMsg.textContent = "Welcome to Barrett Taylor's Interactive CLI.";
    terminalContent.appendChild(welcomeMsg);

    const helpMsg = document.createElement('div');
    helpMsg.className = 'terminal-output';
    helpMsg.textContent = "Type help to see available commands.";
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

    // Assemble terminal panel
    terminalPanel.appendChild(terminalHeader);
    terminalPanel.appendChild(terminalContent);

    // Add to DOM
    contentArea.appendChild(terminalPanel);

    // Setup terminal input handling
    setupBasicTerminal(terminalContent);

    // Adjust editor area to make room for terminal
    const editorArea = document.getElementById('editorArea');
    if (editorArea) {
        editorArea.style.bottom = '225px'; // 200px terminal + 25px status bar
    }

    // Setup resize for terminal panel
    setupTerminalResize();

    // Setup resize for project directory
    setupDirectoryResize();

    console.log('Simple terminal panel created successfully');
}

// Setup directory resize functionality
function setupDirectoryResize() {
    // Find or create directory resize handle
    let directoryHandle = document.getElementById('directoryResizeHandle');

    if (!directoryHandle) {
        const projectDirectory = document.getElementById('projectDirectory');
        if (!projectDirectory) {
            console.warn('Project directory not found for resize handle');
            return;
        }

        // Create resize handle
        directoryHandle = document.createElement('div');
        directoryHandle.id = 'directoryResizeHandle';
        directoryHandle.className = 'resize-handle horizontal-resize-handle';
        directoryHandle.style.position = 'absolute';
        directoryHandle.style.top = '0';
        directoryHandle.style.bottom = '0';
        directoryHandle.style.right = '0';
        directoryHandle.style.width = '5px';
        directoryHandle.style.cursor = 'col-resize';
        directoryHandle.style.zIndex = '50';

        projectDirectory.appendChild(directoryHandle);
        projectDirectory.style.position = 'relative';
    }

    // Add event listeners for resize
    directoryHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isDraggingDirectoryHandle = true;
        startX = e.clientX;

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });
}

// Setup terminal resize functionality
function setupTerminalResize() {
    const terminalHandle = document.getElementById('terminalResizeHandle');
    if (!terminalHandle) {
        console.warn('Terminal resize handle not found');
        return;
    }

    // Add event listeners for resize
    terminalHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isDraggingTerminalHandle = true;
        startY = e.clientY;

        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
    });

    // Add global mousemove handler for resizing
    document.addEventListener('mousemove', function(e) {
        if (isDraggingDirectoryHandle) {
            // Resize directory
            const deltaX = e.clientX - startX;
            directoryWidth += deltaX;
            startX = e.clientX;

            // Apply size constraints
            directoryWidth = Math.max(150, Math.min(window.innerWidth - 300, directoryWidth));

            // Update sizes
            updatePanelSizes();
        }

        if (isDraggingTerminalHandle) {
            // Calculate height from bottom of window to cursor position
            const windowBottom = window.innerHeight;
            const statusBarHeight = 25;
            const newTerminalHeight = windowBottom - e.clientY - statusBarHeight;

            // Apply size constraints
            if (newTerminalHeight >= 100 && newTerminalHeight <= window.innerHeight - 200) {
                terminalHeight = newTerminalHeight;

                // Update sizes
                updatePanelSizes();
            }
        }
    });

    // Add global mouseup handler to stop resizing
    document.addEventListener('mouseup', function() {
        if (isDraggingDirectoryHandle || isDraggingTerminalHandle) {
            isDraggingDirectoryHandle = false;
            isDraggingTerminalHandle = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            // Try to save sizes to localStorage
            try {
                localStorage.setItem('directoryWidth', directoryWidth);
                localStorage.setItem('terminalHeight', terminalHeight);
            } catch (e) {
                console.warn('Failed to save panel sizes to localStorage:', e);
            }
        }
    });
}

// Update panel sizes based on current values
function updatePanelSizes() {
    const projectDirectory = document.getElementById('projectDirectory');
    const editorArea = document.getElementById('editorArea');
    const terminalPanel = document.getElementById('terminalPanel');

    if (!projectDirectory || !editorArea || !terminalPanel) {
        console.warn('Missing elements for resize');
        return;
    }

    // Update directory width
    projectDirectory.style.width = directoryWidth + 'px';

    // Update editor position
    editorArea.style.left = directoryWidth + 'px';

    // Update terminal height
    terminalPanel.style.height = terminalHeight + 'px';

    // Update editor bottom position based on terminal visibility
    if (terminalVisible) {
        editorArea.style.bottom = (terminalHeight + 25) + 'px'; // terminal + status bar
    } else {
        editorArea.style.bottom = '25px'; // just status bar
    }
}

    // Create button
    const toggleButton = document.createElement('div');
    toggleButton.className = 'terminal-toggle-button';
    toggleButton.style.display = 'flex';
    toggleButton.style.alignItems = 'center';
    toggleButton.style.padding = '0 10px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.height = '100%';
    toggleButton.style.marginLeft = '10px';
    toggleButton.style.transition = 'background-color 0.2s';
    toggleButton.innerHTML = '<i class="fas fa-terminal" style="margin-right: 5px;"></i> Terminal';

    // If terminal is hidden initially, update button appearance
    if (!terminalVisible) {
        toggleButton.style.color = '#5e5e5e';
    }

    // Add hover effect
    toggleButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });

    toggleButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '';
    });

    // Insert after main dropdown
    mainDropdown.parentNode.insertBefore(toggleButton, mainDropdown.nextSibling);

    // Add click event handler
    toggleButton.addEventListener('click', function() {
        const terminal = document.getElementById('terminalPanel');
        const editor = document.getElementById('editorArea');

        if (!terminal || !editor) return;

        if (terminalVisible) {
            // Hide terminal
            terminal.style.display = 'none';
            editor.style.bottom = '25px';
            toggleButton.style.color = '#5e5e5e';
        } else {
            // Show terminal
            terminal.style.display = 'flex';
            editor.style.bottom = (terminalHeight + 25) + 'px';
            toggleButton.style.color = '';
        }

        terminalVisible = !terminalVisible;
    });
}

// Create features dropdown menu
function createFeaturesMenu() {
    // Find target location (after terminal button)
    const terminalButton = document.querySelector('.terminal-toggle-button');
    if (!terminalButton) {
        console.error('Cannot find terminal button for features menu');
        return;
    }

    // Create dropdown button
    const dropdown = document.createElement('div');
    dropdown.className = 'features-dropdown';
    dropdown.style.position = 'relative';
    dropdown.style.display = 'flex';
    dropdown.style.alignItems = 'center';
    dropdown.style.padding = '0 10px';
    dropdown.style.cursor = 'pointer';
    dropdown.style.height = '100%';
    dropdown.style.marginLeft = '10px';
    dropdown.style.transition = 'background-color 0.2s';
    dropdown.innerHTML = `
        <i class="fas fa-code" style="margin-right: 5px;"></i> Features
        <i class="fas fa-chevron-down" style="margin-left: 5px; font-size: 10px; opacity: 0.7;"></i>
        <div class="features-menu" style="display: none; position: absolute; top: 100%; left: 0; background-color: #3c3f41; border: 1px solid #555; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); z-index: 100; width: 220px;">
            <div class="features-item" style="padding: 8px 12px; border-bottom: 1px solid #555; display: flex; align-items: center;" data-feature="java">
                <i class="fab fa-java" style="width: 20px;"></i>
                <div style="margin-left: 8px;">
                    <div>Java Terminal</div>
                    <div style="font-size: 11px; opacity: 0.7;">Java code execution environment</div>
                </div>
            </div>
            <div class="features-item" style="padding: 8px 12px; border-bottom: 1px solid #555; display: flex; align-items: center;" data-feature="challenge">
                <i class="fas fa-puzzle-piece" style="width: 20px;"></i>
                <div style="margin-left: 8px;">
                    <div>Code Challenges</div>
                    <div style="font-size: 11px; opacity: 0.7;">Interactive coding problems</div>
                </div>
            </div>
            <div class="features-item" style="padding: 8px 12px; border-bottom: 1px solid #555; display: flex; align-items: center;" data-feature="demos">
                <i class="fas fa-desktop" style="width: 20px;"></i>
                <div style="margin-left: 8px;">
                    <div>Project Demos</div>
                    <div style="font-size: 11px; opacity: 0.7;">Interactive project demonstrations</div>
                </div>
            </div>
            <div class="features-item" style="padding: 8px 12px; display: flex; align-items: center;" data-feature="tools">
                <i class="fas fa-tools" style="width: 20px;"></i>
                <div style="margin-left: 8px;">
                    <div>IDE Tools</div>
                    <div style="font-size: 11px; opacity: 0.7;">Development tools showcase</div>
                </div>
            </div>
        </div>
    `;

    // Add hover effect
    dropdown.addEventListener('mouseover', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });

    dropdown.addEventListener('mouseout', function() {
        this.style.backgroundColor = '';
    });

    // Insert after terminal button
    terminalButton.parentNode.insertBefore(dropdown, terminalButton.nextSibling);

    // Toggle dropdown on click
    dropdown.addEventListener('click', function(e) {
        // Don't toggle if clicking on a menu item
        if (e.target.closest('.features-item')) return;

        const menu = this.querySelector('.features-menu');
        if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    });

    // Handle menu item clicks
    const menuItems = dropdown.querySelectorAll('.features-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            console.log(`Feature selected: ${feature}`);

            // Hide menu
            const menu = dropdown.querySelector('.features-menu');
            if (menu) {
                menu.style.display = 'none';
            }

            // Make sure terminal is visible
            const terminal = document.getElementById('terminalPanel');
            if (terminal && terminal.style.display === 'none') {
                document.querySelector('.terminal-toggle-button').click();
            }

            // Run the command in terminal
            window.terminalProcessCommand(feature);
        });

        // Add hover effect
        item.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#4e5254';
        });

        item.addEventListener('mouseout', function() {
            this.style.backgroundColor = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.features-dropdown')) {
            const menu = dropdown.querySelector('.features-menu');
            if (menu) {
                menu.style.display = 'none';
            }
        }
    });
}

// Set up file click handlers in project directory
function setupFileClickHandlers() {
    // Set up file clicks
    document.querySelectorAll('.tree-file').forEach(file => {
        file.addEventListener('click', function() {
            const fileName = this.textContent.trim();
            const section = fileName.replace('.md', '');

            // Use activateTab function
            window.activateTab(fileName, section);
        });
    });
}

// Basic terminal input handling
function setupBasicTerminal(terminalContent) {
    const input = terminalContent.querySelector('.terminal-input');
    if (!input) return;

    // Focus input
    input.focus();

    // Handle clicks on terminal to focus input
    terminalContent.addEventListener('click', function(e) {
        if (!e.target.closest('a, button, [contenteditable], textarea')) {
            const currentInput = this.querySelector('.terminal-prompt:last-child .terminal-input');
            if (currentInput) {
                currentInput.focus();
            }
        }
    });

    // Handle key events
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            // Get command
            const command = this.textContent.trim();

            // Create command output
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
            processBasicCommand(command, terminalContent);

            // Clear input
            this.textContent = '';
        }
    });
}

// Process basic terminal commands
function processBasicCommand(command, terminal) {
    if (!command) {
        createNewPrompt(terminal);
        return;
    }

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Process common commands
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
  clear       - Clear the terminal

  // Advanced features (some may be unavailable)
  java        - Enter Java REPL mode
  challenge   - Try coding challenges
  demos       - Access project demos
  tools       - View development tools
`;
            break;

        case 'about':
        case 'skills':
        case 'projects':
        case 'experience':
        case 'hobbies':
        case 'contact':
            output.innerHTML = `Opening ${cmd}.md...`;
            window.activateTab(`${cmd}.md`, cmd);
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
            // Clear all terminal content except the last prompt
            while (terminal.children.length > 1) {
                terminal.removeChild(terminal.firstChild);
            }

            // Add welcome message
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'terminal-output';
            welcomeMsg.textContent = "Terminal cleared. Type help to see available commands.";
            terminal.insertBefore(welcomeMsg, terminal.firstChild);

            // No need for new prompt or scrolling
            return;

        case 'java':
        case 'challenge':
        case 'demos':
        case 'tools':
            output.innerHTML = `The ${cmd} feature may be unavailable in simplified mode.`;
            break;

        default:
            output.innerHTML = `Command not found: ${command}<br>Type 'help' to see available commands.`;
    }

    // Add output to terminal
    terminal.appendChild(output);

    // Create new prompt
    createNewPrompt(terminal);

    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

// Create a new terminal prompt
function createNewPrompt(terminal) {
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

    // Add to terminal
    terminal.appendChild(prompt);

    // Focus input
    const input = prompt.querySelector('.terminal-input');
    if (input) {
        input.focus();

        // Handle key events
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();

                // Get command
                const command = this.textContent.trim();

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
                terminal.appendChild(commandOutput);

                // Clear input
                this.textContent = '';

                // Process command
                processBasicCommand(command, terminal);
            }
        });
    }

    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}