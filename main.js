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

// Font loading handler
document.fonts.ready.then(function() {
    console.log('Fonts loaded successfully');
}).catch(function(error) {
    console.warn('Font loading issue:', error);
    // Add fallback fonts if needed
    document.body.style.fontFamily = "'JetBrains Mono', Consolas, 'Courier New', monospace";
});

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

// Initialize the resizable panels - FIXED function
function initResizablePanels() {
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
            safeLocalStorage('set', 'directoryWidth', directoryWidth.toString());
        }

        if (isDraggingTerminalHandle) {
            const deltaY = startY - e.clientY;
            terminalHeight += deltaY;
            startY = e.clientY;

            // Constrain to minimum and maximum heights
            terminalHeight = Math.max(100, Math.min(window.innerHeight - 200, terminalHeight));
            updatePanelSizes();

            // Save to localStorage
            safeLocalStorage('set', 'terminalHeight', terminalHeight.toString());
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

// Update panel sizes based on current values - FIXED function
function updatePanelSizes() {
    const projectDirectory = document.getElementById('projectDirectory');
    const editorArea = document.getElementById('editorArea');
    const terminalPanel = document.getElementById('terminalPanel');

    if (projectDirectory && editorArea && terminalPanel) {
        // Update directory width
        projectDirectory.style.width = `${directoryWidth}px`;

        // Update editor position and width
        editorArea.style.left = `${directoryWidth}px`;
        editorArea.style.width = `calc(100% - ${directoryWidth}px)`;

        // Update terminal height and position
        terminalPanel.style.height = `${terminalHeight}px`;

        // Update editor height to account for terminal
        editorArea.style.bottom = `${terminalHeight}px`;
    }
}

// Interactive Terminal Functionality
function processTerminalCommand(command) {
    try {
        const terminal = document.querySelector('.terminal-content');
        if (!terminal) return;

        const output = document.createElement('div');
        output.className = 'terminal-output';

        // Process different commands
        switch (command.toLowerCase().trim()) {
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
`;
                break;

            case 'about':
                output.innerHTML = `Opening about.md...`;
                showSection('about');
                break;

            case 'skills':
                output.innerHTML = `Opening skills.md...`;
                showSection('skills');
                break;

            case 'projects':
                output.innerHTML = `Opening projects.md...`;
                showSection('projects');
                break;

            case 'experience':
                output.innerHTML = `Opening experience.md...`;
                showSection('experience');
                break;

            case 'hobbies':
                output.innerHTML = `Opening hobbies.md...`;
                showSection('hobbies');
                break;

            case 'contact':
                output.innerHTML = `Opening contact.md...`;
                showSection('contact');
                break;

            case 'github':
                output.innerHTML = `Opening GitHub profile: github.com/barretttaylor95`;
                window.open('https://github.com/barretttaylor95', '_blank');
                break;

            case 'linkedin':
                output.innerHTML = `Opening LinkedIn profile: linkedin.com/in/barrett-taylor-422237182`;
                window.open('https://www.linkedin.com/in/barrett-taylor-422237182/', '_blank');
                break;

            case 'email':
                output.innerHTML = `Opening email client to contact barrett.taylor95@gmail.com`;
                window.location.href = 'mailto:barrett.taylor95@gmail.com';
                break;

            case 'message':
                promptMessage(terminal);
                return; // Skip adding output for message command

            case 'clear':
                // Clear all previous outputs and commands
                const outputs = terminal.querySelectorAll('.terminal-output, .terminal-prompt:not(:last-child)');
                outputs.forEach(el => el.remove());

                // Add welcome message
                const welcomeMsg = document.createElement('div');
                welcomeMsg.className = 'terminal-output';
                welcomeMsg.textContent = "Welcome to Barrett Taylor's Interactive CLI.";
                const helpMsg = document.createElement('div');
                helpMsg.className = 'terminal-output';
                helpMsg.textContent = "Type help to see available commands.";
                terminal.insertBefore(welcomeMsg, terminal.querySelector('.terminal-prompt'));
                terminal.insertBefore(helpMsg, terminal.querySelector('.terminal-prompt'));

                return; // Skip adding output for clear command

            case '':
                // Empty command, do nothing
                return;

            default:
                output.innerHTML = `Command not found: ${command}<br>Type 'help' to see available commands.`;
        }

        // Add output to terminal
        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        if (lastPrompt) {
            terminal.insertBefore(output, lastPrompt);
        } else {
            terminal.appendChild(output);
        }

        // Scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;

    } catch (error) {
        console.error('Error processing terminal command:', error);
    }
}

// Prompt user for a message
function promptMessage(terminal) {
    // Create message prompt
    const msgPrompt = document.createElement('div');
    msgPrompt.className = 'terminal-output';
    msgPrompt.innerHTML = 'Enter your message (press Enter to send, ESC to cancel):';

    // Create text area for message
    const msgInput = document.createElement('textarea');
    msgInput.style.width = '100%';
    msgInput.style.height = '80px';
    msgInput.style.backgroundColor = '#2d2d2d';
    msgInput.style.color = '#dcdcdc';
    msgInput.style.border = '1px solid #444';
    msgInput.style.padding = '8px';
    msgInput.style.marginTop = '8px';
    msgInput.style.outline = 'none';
    msgInput.style.resize = 'none';
    msgInput.style.fontFamily = "'JetBrains Mono', 'Consolas', monospace";

    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');

    // Add prompt and input to terminal
    terminal.insertBefore(msgPrompt, lastPrompt);
    terminal.insertBefore(msgInput, lastPrompt);

    // Focus the input
    msgInput.focus();

    // Handle key events
    msgInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = msgInput.value.trim();

            // Remove the input
            msgInput.remove();

            if (message) {
                // Show confirmation
                const confirmation = document.createElement('div');
                confirmation.className = 'terminal-output';
                confirmation.innerHTML = `Message sent:<br>${message}<br><br>Thank you! Your message has been sent to barrett.taylor95@gmail.com`;
                terminal.insertBefore(confirmation, lastPrompt);

                // Here you would normally send the email via a backend service
                // For demo purposes, we're just showing the confirmation

                // In a real implementation, you'd send this to your backend
                console.log(`Message to be sent: ${message}`);
            } else {
                const cancelled = document.createElement('div');
                cancelled.className = 'terminal-output';
                cancelled.textContent = 'Message cancelled - empty message.';
                terminal.insertBefore(cancelled, lastPrompt);
            }

            // Scroll to bottom
            terminal.scrollTop = terminal.scrollHeight;
        } else if (e.key === 'Escape') {
            // Remove the input and cancel
            msgInput.remove();
            const cancelled = document.createElement('div');
            cancelled.className = 'terminal-output';
            cancelled.textContent = 'Message cancelled.';
            terminal.insertBefore(cancelled, lastPrompt);

            // Scroll to bottom
            terminal.scrollTop = terminal.scrollHeight;
        }
    });
}

// Handle terminal input
function setupInteractiveTerminal() {
    try {
        const terminal = document.querySelector('.terminal-content');
        if (!terminal) return;

        // Remove typing cursor simulation for interactive terminal if it exists
        const typingCursor = terminal.querySelector('.typing-cursor');
        if (typingCursor) {
            typingCursor.style.display = 'inline-block';
        }

        // Create input field
        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        if (lastPrompt) {
            const terminalInput = lastPrompt.querySelector('.terminal-input');
            if (terminalInput) {
                // Focus on click anywhere in the terminal
                terminal.addEventListener('click', function(e) {
                    // But only if we're not clicking on another interactive element
                    if (!e.target.closest('a, button, [contenteditable], textarea')) {
                        terminalInput.focus();
                    }
                });

                // Handle keyboard input
                terminalInput.addEventListener('keydown', function(e) {
                    // Command history navigation
                    if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        navigateCommandHistory('up', this);
                        return;
                    }

                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        navigateCommandHistory('down', this);
                        return;
                    }

                    if (e.key === 'Enter') {
                        e.preventDefault();

                        // Get command
                        const command = this.textContent.trim();

                        // Save command to currentTerminalInput and history
                        currentTerminalInput = command;

                        // Add to command history if not empty
                        if (command && (commandHistory.length === 0 || commandHistory[0] !== command)) {
                            commandHistory.unshift(command);
                            // Reset history index
                            historyIndex = -1;

                            // Save to localStorage
                            try {
                                safeLocalStorage('set', 'terminalCommandHistory', JSON.stringify(commandHistory.slice(0, 20)));
                            } catch (err) {
                                console.warn('Error saving command history:', err);
                            }
                        }

                        // Clear input
                        this.textContent = '';

                        // Clone current prompt
                        const newPrompt = lastPrompt.cloneNode(true);
                        const newInput = newPrompt.querySelector('.terminal-input');
                        if (newInput) {
                            newInput.textContent = '';
                            newInput.setAttribute('contenteditable', 'true');
                            newInput.setAttribute('spellcheck', 'false');

                            // Setup keyboard event for new input
                            newInput.addEventListener('keydown', arguments.callee);
                        }

                        // Replace current prompt with non-editable version showing command
                        lastPrompt.querySelector('.terminal-input').textContent = command;
                        lastPrompt.querySelector('.terminal-input').removeAttribute('contenteditable');

                        // Remove cursor from current prompt
                        const oldCursor = lastPrompt.querySelector('.typing-cursor');
                        if (oldCursor) oldCursor.remove();

                        // Process command
                        processTerminalCommand(command);

                        // Add new prompt
                        terminal.appendChild(newPrompt);

                        // Focus new input
                        newInput.focus();

                        // Scroll to bottom
                        terminal.scrollTop = terminal.scrollHeight;
                    }
                });

                // Load command history from localStorage
                try {
                    const savedHistory = safeLocalStorage('parse', 'terminalCommandHistory');
                    if (savedHistory && Array.isArray(savedHistory)) {
                        commandHistory = savedHistory;
                    }
                } catch (err) {
                    console.warn('Error loading command history:', err);
                }
            }
        }
    } catch (error) {
        console.error('Error setting up interactive terminal:', error);
    }
}

// Navigate command history
function navigateCommandHistory(direction, inputElement) {
    try {
        if (!commandHistory.length) return;

        if (direction === 'up') {
            // Going back in history
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputElement.textContent = commandHistory[historyIndex];

                // Place cursor at the end of the text
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(inputElement);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } else if (direction === 'down') {
            // Going forward in history
            if (historyIndex > 0) {
                historyIndex--;
                inputElement.textContent = commandHistory[historyIndex];

                // Place cursor at the end of the text
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(inputElement);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (historyIndex === 0) {
                historyIndex = -1;
                inputElement.textContent = '';
            }
        }
    } catch (error) {
        console.error('Error navigating command history:', error);
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

// Initialize on document load
document.addEventListener('DOMContentLoaded', function() {
    try {
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
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }, 500);
        }

    } catch (error) {
        console.error('Error in DOMContentLoaded:', error);
    }
});

// Register service worker if browser supports it
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}