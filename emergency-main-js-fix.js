/**
 * Emergency Main JS Fix
 * This script provides minimal fallback functionality in case main.js has issues
 */

// Create global space for emergency functionality
const emergencyFix = {};

// Make sure the functions are available in the window object
(function(global) {
    // Track if emergency functionality is active
    let emergencyActive = false;

    // Set up emergency fix on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Emergency fix script loaded - providing fallback functionality');

        // Wait a short time to see if main.js creates necessary elements
        setTimeout(checkForCriticalElements, 1000);
    });

    // Check if critical elements exist, if not, create them
    function checkForCriticalElements() {
        // Check for terminal
        if (!document.getElementById('terminalPanel')) {
            console.log('Terminal panel missing - creating emergency version');
            createEmergencyTerminal();
            emergencyActive = true;
        }

        // Check for terminal toggle button
        if (!document.querySelector('.terminal-toggle-button')) {
            console.log('Terminal toggle missing - creating emergency version');
            createEmergencyTerminalToggle();
            emergencyActive = true;
        }

        // Check for features dropdown
        if (!document.querySelector('.features-dropdown')) {
            console.log('Features dropdown missing - creating emergency version');
            createEmergencyFeaturesDropdown();
            emergencyActive = true;
        }

        // If any emergency functionality was needed
        if (emergencyActive) {
            console.warn('Emergency functionality activated - some features may be limited');
            // Set up event listeners and functionality
            setupEmergencyEventListeners();
        }
    }

    // Create emergency terminal panel
    function createEmergencyTerminal() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        // Create terminal panel
        const terminalPanel = document.createElement('div');
        terminalPanel.id = 'terminalPanel';
        terminalPanel.className = 'terminal-panel';
        terminalPanel.style.position = 'absolute';
        terminalPanel.style.left = '0';
        terminalPanel.style.right = '0';
        terminalPanel.style.bottom = '25px';
        terminalPanel.style.height = '200px';
        terminalPanel.style.backgroundColor = '#1e1e1e';
        terminalPanel.style.borderTop = '1px solid #323232';
        terminalPanel.style.display = 'flex';
        terminalPanel.style.flexDirection = 'column';
        terminalPanel.style.zIndex = '3';

        // Add resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle vertical-resize-handle';
        resizeHandle.id = 'terminalResizeHandle';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.cursor = 'row-resize';
        resizeHandle.style.height = '5px';
        resizeHandle.style.left = '0';
        resizeHandle.style.right = '0';
        resizeHandle.style.top = '0';
        resizeHandle.style.zIndex = '50';
        terminalPanel.appendChild(resizeHandle);

        // Add terminal header
        const terminalHeader = document.createElement('div');
        terminalHeader.className = 'terminal-header';
        terminalHeader.style.height = '32px';
        terminalHeader.style.backgroundColor = '#3c3f41';
        terminalHeader.style.borderBottom = '1px solid #323232';
        terminalHeader.style.display = 'flex';
        terminalHeader.style.alignItems = 'center';
        terminalHeader.style.padding = '0 15px';
        terminalHeader.innerHTML = '<div class="terminal-title">Terminal</div><div class="terminal-tabs"><div class="terminal-tab active">CLI</div></div>';
        terminalPanel.appendChild(terminalHeader);

        // Add terminal content
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
        welcomeMsg.textContent = "Welcome to Barrett Taylor's Interactive CLI (Emergency Mode).";
        terminalContent.appendChild(welcomeMsg);

        const helpMsg = document.createElement('div');
        helpMsg.className = 'terminal-output';
        helpMsg.textContent = "Type help to see available commands.";
        terminalContent.appendChild(helpMsg);

        // Add initial prompt
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

        // Add terminal to content area
        contentArea.appendChild(terminalPanel);

        // Adjust editor area to make room for terminal
        const editorArea = document.getElementById('editorArea');
        if (editorArea) {
            editorArea.style.bottom = '225px'; // 200px terminal + 25px status bar
        }

        // Setup basic terminal functionality
        setupEmergencyTerminal(terminalContent);
    }

    // Create emergency terminal toggle button
    function createEmergencyTerminalToggle() {
        const mainDropdown = document.querySelector('.dropdown');
        if (!mainDropdown) return;

        // Create toggle button
        const toggleButton = document.createElement('div');
        toggleButton.className = 'terminal-toggle-button active';
        toggleButton.style.display = 'flex';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.padding = '0 12px';
        toggleButton.style.height = '100%';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.marginLeft = '10px';
        toggleButton.style.backgroundColor = '#4e5254';
        toggleButton.innerHTML = '<i class="fas fa-terminal" style="margin-right: 6px;"></i> Terminal';

        // Insert after main dropdown
        mainDropdown.parentNode.insertBefore(toggleButton, mainDropdown.nextSibling);

        // Add click event for toggle
        toggleButton.addEventListener('click', function() {
            toggleEmergencyTerminal();
            this.classList.toggle('active');
        });
    }

    // Create emergency features dropdown
    function createEmergencyFeaturesDropdown() {
        const terminalButton = document.querySelector('.terminal-toggle-button');
        if (!terminalButton) return;

        // Create dropdown button
        const dropdown = document.createElement('div');
        dropdown.className = 'features-dropdown';
        dropdown.style.position = 'relative';
        dropdown.style.display = 'flex';
        dropdown.style.alignItems = 'center';
        dropdown.style.padding = '0 12px';
        dropdown.style.height = '100%';
        dropdown.style.cursor = 'pointer';
        dropdown.style.marginLeft = '10px';

        dropdown.innerHTML = `
            <i class="fas fa-code" style="margin-right: 6px;"></i> Features
            <i class="fas fa-chevron-down" style="margin-left: 6px; font-size: 10px; opacity: 0.7;"></i>
            <div class="features-menu" style="position: absolute; top: 100%; left: 0; background-color: #3c3f41; border: 1px solid #555; border-radius: 3px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); z-index: 100; display: none; width: 220px;">
                <div class="features-menu-item" data-feature="challenge" style="padding: 8px 12px; border-bottom: 1px solid #555; display: flex; align-items: center;">
                    <i class="fas fa-puzzle-piece" style="width: 20px; text-align: center;"></i>
                    <div>
                        <span>Code Challenges</span>
                        <div style="font-size: 11px; opacity: 0.7; margin-top: 3px;">Interactive coding problems to solve</div>
                    </div>
                </div>
                <div class="features-menu-item" data-feature="java" style="padding: 8px 12px; border-bottom: 1px solid #555; display: flex; align-items: center;">
                    <i class="fab fa-java" style="width: 20px; text-align: center;"></i>
                    <div>
                        <span>Java Terminal</span>
                        <div style="font-size: 11px; opacity: 0.7; margin-top: 3px;">Java code execution environment</div>
                    </div>
                </div>
                <div class="features-menu-item" data-feature="tools" style="padding: 8px 12px; border-bottom: 1px solid #555; display: flex; align-items: center;">
                    <i class="fas fa-tools" style="width: 20px; text-align: center;"></i>
                    <div>
                        <span>IDE Tools</span>
                        <div style="font-size: 11px; opacity: 0.7; margin-top: 3px;">Development tools showcase</div>
                    </div>
                </div>
                <div class="features-menu-item" data-feature="demos" style="padding: 8px 12px; display: flex; align-items: center;">
                    <i class="fas fa-desktop" style="width: 20px; text-align: center;"></i>
                    <div>
                        <span>Project Demos</span>
                        <div style="font-size: 11px; opacity: 0.7; margin-top: 3px;">Live project demonstrations</div>
                    </div>
                </div>
            </div>
        `;

        // Insert after terminal button
        terminalButton.parentNode.insertBefore(dropdown, terminalButton.nextSibling);

        // Add click events
        dropdown.addEventListener('click', function(e) {
            if (!e.target.closest('.features-menu-item')) {
                const menu = this.querySelector('.features-menu');
                if (menu) {
                    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                }
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.features-dropdown')) {
                const menu = document.querySelector('.features-dropdown .features-menu');
                if (menu) {
                    menu.style.display = 'none';
                }
            }
        });

        // Feature item click events
        const menuItems = dropdown.querySelectorAll('.features-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const feature = this.getAttribute('data-feature');
                showEmergencyFeatureMessage(feature);
                dropdown.querySelector('.features-menu').style.display = 'none';
            });
        });
    }

    // Setup emergency terminal functionality
    function setupEmergencyTerminal(terminalContent) {
        if (!terminalContent) return;

        const terminalInput = terminalContent.querySelector('.terminal-input');
        if (!terminalInput) return;

        // Focus input
        terminalInput.focus();

        // Make terminal clickable
        terminalContent.addEventListener('click', function(e) {
            if (!e.target.closest('a, button, [contenteditable], textarea')) {
                const input = this.querySelector('.terminal-prompt:last-child .terminal-input');
                if (input) input.focus();
            }
        });

        // Add key event listener
        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();

                // Get command
                const command = this.textContent.trim();

                // Clear input
                this.textContent = '';

                // Create echo of command
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

                // Process the command
                processEmergencyCommand(command, terminalContent);
            }
        });
    }

    // Process emergency terminal commands
    function processEmergencyCommand(command, terminal) {
        // Create output element
        const output = document.createElement('div');
        output.className = 'terminal-output';

        // Handle basic commands
        const cmd = command.toLowerCase().trim();

        switch(cmd) {
            case 'help':
                output.innerHTML = `
Available commands (Emergency Mode):

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

Advanced features are limited in emergency mode.
`;
                break;

            case 'about':
            case 'skills':
            case 'projects':
            case 'experience':
            case 'hobbies':
            case 'contact':
                output.innerHTML = `Opening ${cmd}.md...`;

                // Find and activate the tab
                const tab = document.getElementById(`${cmd}Tab`);
                if (tab) {
                    // Hide all tabs and content
                    document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.code-content').forEach(c => c.classList.remove('active'));

                    // Show this tab and content
                    tab.style.display = 'flex';
                    tab.classList.add('active');
                    const content = document.getElementById(`${cmd}Content`);
                    if (content) content.classList.add('active');
                }
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
                // Clear all outputs except the newest prompt
                const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
                while (terminal.firstChild) {
                    terminal.removeChild(terminal.firstChild);
                }

                // Add new welcome message
                const welcomeMsg = document.createElement('div');
                welcomeMsg.className = 'terminal-output';
                welcomeMsg.textContent = "Terminal cleared. Type help to see available commands.";
                terminal.appendChild(welcomeMsg);

                if (lastPrompt) terminal.appendChild(lastPrompt);
                return; // Skip adding output and creating another prompt

            default:
                if (cmd === 'java' || cmd === 'api' || cmd === 'database' || cmd === 'git' ||
                    cmd === 'build' || cmd === 'demos' || cmd === 'tools' || cmd === 'challenge') {
                    output.innerHTML = `
<span style="color: #cc7832;">Advanced feature '${cmd}' is not available in emergency mode.</span>
<br>Please reload the page or check the browser console for errors.
`;
                } else if (cmd !== '') {
                    output.innerHTML = `Command not found: ${command}<br>Type 'help' to see available commands.`;
                }
        }

        // Add output to terminal
        if (cmd !== '') {
            terminal.appendChild(output);
        }

        // Create new prompt
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
        terminal.appendChild(prompt);

        // Focus new input
        const input = prompt.querySelector('.terminal-input');
        if (input) input.focus();

        // Add event listener to new input
        if (input) {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();

                    // Get command
                    const command = this.textContent.trim();

                    // Clear input
                    this.textContent = '';

                    // Create echo of command
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

                    // Process the command
                    processEmergencyCommand(command, terminal);
                }
            });
        }

        // Scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    }

    // Toggle emergency terminal visibility
    function toggleEmergencyTerminal() {
        const terminalPanel = document.getElementById('terminalPanel');
        const editorArea = document.getElementById('editorArea');

        if (terminalPanel && editorArea) {
            if (terminalPanel.style.display === 'none') {
                terminalPanel.style.display = 'flex';
                editorArea.style.bottom = '225px'; // 200px terminal + 25px status bar
            } else {
                terminalPanel.style.display = 'none';
                editorArea.style.bottom = '25px'; // Just status bar
            }
        }
    }

    // Show emergency feature message
    function showEmergencyFeatureMessage(feature) {
        const terminal = document.querySelector('.terminal-content');
        if (!terminal) return;

        const output = document.createElement('div');
        output.className = 'terminal-output';
        output.innerHTML = `
<span style="color: #cc7832;">Feature '${feature}' is not available in emergency mode.</span>
<br>Please reload the page or check the browser console for errors.
`;

        // Add output to terminal
        terminal.appendChild(output);

        // Create new prompt
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
        terminal.appendChild(prompt);

        // Focus new input
        const input = prompt.querySelector('.terminal-input');
        if (input) {
            input.focus();

            // Add event listener
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const command = this.textContent.trim();
                    this.textContent = '';

                    // Create echo
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

                    // Process command
                    processEmergencyCommand(command, terminal);
                }
            });
        }

        // Scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    }

    // Set up event listeners
    function setupEmergencyEventListeners() {
        // Make sure folder toggle works
        if (!window.toggleFolder) {
            window.toggleFolder = function(element) {
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
                    console.error('Emergency toggle folder error:', error);
                }
            };
        }

        // Make sure tab system works
        document.querySelectorAll('.editor-tab').forEach(tab => {
            if (tab.getAttribute('data-emergency-initialized')) return;
            tab.setAttribute('data-emergency-initialized', 'true');

            tab.addEventListener('click', function() {
                const sectionId = this.id.replace('Tab', '');

                // Hide all content sections
                document.querySelectorAll('.code-content').forEach(content => {
                    content.classList.remove('active');
                });

                // Deactivate all tabs
                document.querySelectorAll('.editor-tab').forEach(t => {
                    t.classList.remove('active');
                });

                // Show this content and activate tab
                this.classList.add('active');
                const content = document.getElementById(sectionId + 'Content');
                if (content) content.classList.add('active');
            });

            // Handle close button
            const closeBtn = tab.querySelector('.close-tab');
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();

                    const tab = this.closest('.editor-tab');
                    tab.style.display = 'none';

                    if (tab.classList.contains('active')) {
                        // Find another visible tab to activate
                        const visibleTabs = Array.from(document.querySelectorAll('.editor-tab'))
                            .filter(t => t.style.display !== 'none');

                        if (visibleTabs.length > 0) {
                            visibleTabs[0].click();
                        } else {
                            // If no visible tabs, show about tab
                            const aboutTab = document.getElementById('aboutTab');
                            if (aboutTab) {
                                aboutTab.style.display = 'flex';
                                aboutTab.click();
                            }
                        }
                    }
                });
            }
        });

        // Make tree files clickable
        document.querySelectorAll('.tree-file').forEach(file => {
            if (file.getAttribute('data-emergency-initialized')) return;
            file.setAttribute('data-emergency-initialized', 'true');

            file.addEventListener('click', function() {
                const fileName = this.textContent.trim();
                const section = fileName.replace('.md', '');

                const tab = document.getElementById(section + 'Tab');
                if (tab) {
                    tab.style.display = 'flex';
                    tab.click();
                }
            });
        });
    }

    // Export emergency functions to global space
    global.emergencyFix = {
        isActive: function() {
            return emergencyActive;
        },
        activateEmergencyMode: function() {
            if (!emergencyActive) {
                checkForCriticalElements();
            }
            return emergencyActive;
        },
        toggleTerminal: toggleEmergencyTerminal
    };

})(window);