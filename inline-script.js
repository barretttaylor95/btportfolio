/**
 * Inline script to ensure all UI elements are created
 * This script is designed to run directly in the HTML file
 */

// Ensure DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }

    console.log('Inline script running - creating UI elements');

    // Create the terminal panel
    createTerminalPanel();

    // Create the terminal toggle button
    createTerminalToggleButton();

    // Create the features dropdown
    createFeaturesDropdown();

    // Set up file click handling
    setupFileClickHandlers();
});

// Create terminal panel
function createTerminalPanel() {
    console.log('Creating terminal panel');

    const contentArea = document.querySelector('.content-area');
    if (!contentArea) {
        console.error('Content area not found');
        return;
    }

    // Check if the terminal already exists
    if (document.getElementById('terminalPanel')) {
        console.log('Terminal panel already exists');
        return;
    }

    // Create the terminal panel
    const terminalPanel = document.createElement('div');
    terminalPanel.id = 'terminalPanel';
    terminalPanel.className = 'terminal-panel';

    // Set styles
    Object.assign(terminalPanel.style, {
        position: 'absolute',
        left: '0',
        right: '0',
        bottom: '25px',
        height: '200px',
        backgroundColor: '#1e1e1e',
        borderTop: '1px solid #323232',
        display: 'flex',
        flexDirection: 'column',
        zIndex: '3'
    });

    // Add terminal content
    terminalPanel.innerHTML = `
        <div class="terminal-header" style="height: 32px; background-color: #3c3f41; border-bottom: 1px solid #323232; display: flex; align-items: center; padding: 0 15px;">
            <div class="terminal-title" style="font-weight: bold;">Terminal</div>
            <div class="terminal-tabs" style="display: flex; height: 100%;">
                <div class="terminal-tab active" style="padding: 0 15px; display: flex; align-items: center; border-right: 1px solid #323232; background-color: #1e1e1e;">
                    CLI
                </div>
            </div>
        </div>
        <div class="terminal-content" style="flex: 1; background-color: #1e1e1e; padding: 10px; font-family: 'JetBrains Mono', 'Consolas', monospace; color: #dcdcdc; overflow-y: auto;">
            <div class="terminal-output">Welcome to Barrett Taylor's Interactive CLI.</div>
            <div class="terminal-output">Type help to see available commands.</div>
            <div class="terminal-prompt">
                <span class="terminal-user">guest</span>
                <span class="terminal-at">@</span>
                <span class="terminal-machine">portfolio</span>
                <span class="terminal-colon">:</span>
                <span class="terminal-directory">~</span>
                <span class="terminal-symbol">$</span>
                <span class="terminal-input" contenteditable="true" spellcheck="false"></span>
                <span class="typing-cursor"></span>
            </div>
        </div>
    `;

    // Add to DOM
    contentArea.appendChild(terminalPanel);

    // Adjust editor area
    const editorArea = document.getElementById('editorArea');
    if (editorArea) {
        editorArea.style.bottom = '225px';  // 200px terminal + 25px status bar
    }

    // Set up terminal input
    setupTerminalInput();

    console.log('Terminal panel created successfully');
}

// Create terminal toggle button
function createTerminalToggleButton() {
    console.log('Creating terminal toggle button');

    // Find target location
    const mainDropdown = document.querySelector('.dropdown');
    if (!mainDropdown) {
        console.error('Cannot find dropdown for terminal button');
        return;
    }

    // Check if button already exists
    if (document.querySelector('.terminal-toggle-button')) {
        console.log('Terminal toggle button already exists');
        return;
    }

    // Create button
    const toggleButton = document.createElement('div');
    toggleButton.className = 'terminal-toggle-button';

    // Set styles
    Object.assign(toggleButton.style, {
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        height: '100%',
        cursor: 'pointer',
        marginLeft: '10px',
        transition: 'background-color 0.2s'
    });

    toggleButton.innerHTML = '<i class="fas fa-terminal" style="margin-right: 5px;"></i> Terminal';

    // Add hover effect
    toggleButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });

    toggleButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '';
    });

    // Insert button after dropdown
    mainDropdown.parentNode.insertBefore(toggleButton, mainDropdown.nextSibling);

    // Add click handler
    toggleButton.addEventListener('click', function() {
        toggleTerminal();
    });

    console.log('Terminal toggle button created successfully');
}

// Toggle terminal visibility
function toggleTerminal() {
    const terminalPanel = document.getElementById('terminalPanel');
    const editorArea = document.getElementById('editorArea');

    if (!terminalPanel || !editorArea) {
        console.error('Terminal panel or editor area not found');
        return;
    }

    const isVisible = terminalPanel.style.display !== 'none';

    if (isVisible) {
        // Hide terminal
        terminalPanel.style.display = 'none';
        editorArea.style.bottom = '25px';  // Just room for status bar
    } else {
        // Show terminal
        terminalPanel.style.display = 'flex';
        editorArea.style.bottom = '225px';  // 200px terminal + 25px status bar
    }

    // Toggle active class on button
    const toggleButton = document.querySelector('.terminal-toggle-button');
    if (toggleButton) {
        toggleButton.style.backgroundColor = isVisible ? '' : '#4e5254';
    }
}

// Create features dropdown
function createFeaturesDropdown() {
    console.log('Creating features dropdown');

    // Find target location
    const terminalButton = document.querySelector('.terminal-toggle-button');
    if (!terminalButton) {
        console.error('Cannot find terminal button for dropdown');
        return;
    }

    // Check if dropdown already exists
    if (document.querySelector('.features-dropdown')) {
        console.log('Features dropdown already exists');
        return;
    }

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'features-dropdown';

    // Set styles
    Object.assign(dropdown.style, {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        height: '100%',
        cursor: 'pointer',
        marginLeft: '10px',
        transition: 'background-color 0.2s'
    });

    dropdown.innerHTML = `
        <i class="fas fa-code" style="margin-right: 5px;"></i> Features
        <i class="fas fa-chevron-down" style="margin-left: 5px; font-size: 10px; opacity: 0.7;"></i>
        <div class="features-menu" style="position: absolute; top: 100%; left: 0; background-color: #3c3f41; border: 1px solid #555; border-radius: 3px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); z-index: 100; display: none; width: 220px;">
            <div class="features-menu-item" style="padding: 8px 12px; border-bottom: 1px solid #555; display: flex; align-items: center;">
                <i class="fas fa-puzzle-piece" style="width: 20px;"></i>
                <div style="margin-left: 8px;">
                    <div>Code Challenges</div>
                    <div style="font-size: 11px; opacity: 0.7;">Interactive coding problems</div>
                </div>
            </div>
            <div class="features-menu-item" style="padding: 8px 12px; border-bottom: 1px solid #555; display: flex; align-items: center;">
                <i class="fab fa-java" style="width: 20px;"></i>
                <div style="margin-left: 8px;">
                    <div>Java Terminal</div>
                    <div style="font-size: 11px; opacity: 0.7;">Java code execution environment</div>
                </div>
            </div>
            <div class="features-menu-item" style="padding: 8px 12px; border-bottom: 1px solid #555; display: flex; align-items: center;">
                <i class="fas fa-desktop" style="width: 20px;"></i>
                <div style="margin-left: 8px;">
                    <div>Project Demos</div>
                    <div style="font-size: 11px; opacity: 0.7;">Live project demonstrations</div>
                </div>
            </div>
            <div class="features-menu-item" style="padding: 8px 12px; display: flex; align-items: center;">
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

    // Insert dropdown after terminal button
    terminalButton.parentNode.insertBefore(dropdown, terminalButton.nextSibling);

    // Toggle dropdown on click
    dropdown.addEventListener('click', function(e) {
        if (e.target.closest('.features-menu-item')) {
            return;  // Don't toggle when clicking a menu item
        }

        const menu = this.querySelector('.features-menu');
        if (menu) {
            const isVisible = menu.style.display === 'block';
            menu.style.display = isVisible ? 'none' : 'block';
        }
    });

    // Add hover effect to menu items
    const menuItems = dropdown.querySelectorAll('.features-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#4e5254';
        });

        item.addEventListener('mouseout', function() {
            this.style.backgroundColor = '';
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.features-dropdown')) {
            const menu = dropdown.querySelector('.features-menu');
            if (menu) {
                menu.style.display = 'none';
            }
        }
    });

    console.log('Features dropdown created successfully');
}

// Setup terminal input handling
function setupTerminalInput() {
    const terminalContent = document.querySelector('.terminal-content');
    if (!terminalContent) {
        console.error('Terminal content not found');
        return;
    }

    const input = terminalContent.querySelector('.terminal-input');
    if (!input) {
        console.error('Terminal input not found');
        return;
    }

    // Focus input
    input.focus();

    // Make terminal clickable to focus input
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

            // Clear input
            this.textContent = '';

            // Process simple commands
            processBasicCommand(command, terminalContent);
        }
    });
}

// Process basic terminal commands
function processBasicCommand(command, terminal) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Process command
    switch (command.toLowerCase()) {
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
`;
            break;

        case 'about':
        case 'skills':
        case 'projects':
        case 'experience':
        case 'hobbies':
        case 'contact':
            output.innerHTML = `Opening ${command}.md...`;
            activateTab(null, command);
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
            // Clear terminal content
            while (terminal.firstChild) {
                terminal.removeChild(terminal.firstChild);
            }

            // Add welcome message
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'terminal-output';
            welcomeMsg.textContent = "Terminal cleared. Type help to see available commands.";
            terminal.appendChild(welcomeMsg);

            createNewPrompt(terminal);
            return;

        default:
            output.innerHTML = `Command not found: ${command}<br>Type 'help' to see available commands.`;
    }

    // Add output
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

    // Focus new input
    const input = prompt.querySelector('.terminal-input');
    if (input) {
        input.focus();

        // Add event listener for new input
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

// Setup file click handlers
function setupFileClickHandlers() {
    document.querySelectorAll('.tree-file').forEach(file => {
        file.addEventListener('click', function(e) {
            e.stopPropagation();

            const fileName = this.textContent.trim();
            const section = fileName.replace('.md', '');

            activateTab(null, section);
        });
    });
}

// Activate a tab
function activateTab(filename, section) {
    if (!section) return;

    const tab = document.getElementById(section + 'Tab');
    const content = document.getElementById(section + 'Content');

    if (!tab || !content) return;

    // Hide all content
    document.querySelectorAll('.code-content').forEach(c => {
        c.classList.remove('active');
    });

    // Deactivate all tabs
    document.querySelectorAll('.editor-tab').forEach(t => {
        t.classList.remove('active');
    });

    // Show tab and content
    tab.style.display = 'flex';
    tab.classList.add('active');
    content.classList.add('active');
}