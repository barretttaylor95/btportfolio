/**
 * Portfolio Fix Script
 * This script provides fallbacks and fixes for critical functionality
 * in case the main JavaScript encounters issues.
 */

// Force hide loading overlay to ensure site visibility
document.addEventListener('DOMContentLoaded', function() {
  // This will run after all content has loaded
  setTimeout(function() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  }, 1000); // Short timeout to ensure it runs even if other JS is delayed
});

// Create the terminal panel if it doesn't exist after a delay
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    if (!document.getElementById('terminalPanel')) {
      createTerminalPanel();
    }

    if (!document.querySelector('.status-bar')) {
      createStatusBar();
    }

    // Fix layout if needed
    fixLayoutPositioning();

    // Setup basic functionality
    setupTerminalFunctionality();
    fixTabNavigation();
    makeFilesClickable();
  }, 2000); // Wait for main.js to run first, this is a fallback
});

// Create terminal panel if missing
function createTerminalPanel() {
  const contentArea = document.querySelector('.content-area');
  if (!contentArea) return;

  // Create terminal panel container
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

  // Create terminal resize handle - ENSURE THIS IS FIRST FOR PROPER Z-INDEX STACKING
  const resizeHandle = document.createElement('div');
  resizeHandle.id = 'terminalResizeHandle';
  resizeHandle.className = 'resize-handle vertical-resize-handle';
  resizeHandle.style.position = 'absolute';
  resizeHandle.style.cursor = 'row-resize';
  resizeHandle.style.height = '5px';
  resizeHandle.style.left = '0';
  resizeHandle.style.right = '0';
  resizeHandle.style.top = '0';
  resizeHandle.style.zIndex = '100';
  terminalPanel.appendChild(resizeHandle);

  // Create terminal header
  const terminalHeader = document.createElement('div');
  terminalHeader.className = 'terminal-header';
  terminalHeader.style.height = '32px';
  terminalHeader.style.backgroundColor = '#3c3f41';
  terminalHeader.style.borderBottom = '1px solid #323232';
  terminalHeader.style.display = 'flex';
  terminalHeader.style.alignItems = 'center';
  terminalHeader.style.padding = '0 15px';
  terminalHeader.innerHTML = `
    <div class="terminal-title" style="font-weight: bold;">Terminal</div>
    <div class="terminal-tabs" style="display: flex; height: 100%;">
      <div class="terminal-tab active" style="padding: 0 15px; display: flex; align-items: center; background-color: #1e1e1e; border-right: 1px solid #323232;">
        Terminal
      </div>
    </div>
  `;

  // Create terminal content
  const terminalContent = document.createElement('div');
  terminalContent.className = 'terminal-content';
  terminalContent.style.flex = '1';
  terminalContent.style.backgroundColor = '#1e1e1e';
  terminalContent.style.padding = '10px';
  terminalContent.style.fontFamily = "'JetBrains Mono', 'Consolas', monospace";
  terminalContent.style.color = '#dcdcdc';
  terminalContent.style.overflowY = 'auto';
  terminalContent.innerHTML = `
    <div class="terminal-output">Welcome to Barrett Taylor's Interactive CLI.</div>
    <div class="terminal-output">Type help to see available commands.</div>
    <div class="terminal-prompt">
      <span class="terminal-user">guest</span><span class="terminal-at">@</span><span class="terminal-machine">portfolio</span><span class="terminal-colon">:</span><span class="terminal-directory">~</span><span class="terminal-symbol">$</span>
      <span class="terminal-input" contenteditable="true" spellcheck="false"></span>
      <span class="typing-cursor"></span>
    </div>
  `;

  // Add components to the terminal panel
  terminalPanel.appendChild(terminalHeader);
  terminalPanel.appendChild(terminalContent);

  // Add terminal panel to the page
  contentArea.appendChild(terminalPanel);

  // Set up resize handle interaction
  setupResizeHandle(resizeHandle);

  // Set up terminal functionality
  setupTerminalFunctionality();
}

// Add resizing functionality to the terminal panel
function setupResizeHandle(resizeHandle) {
  if (!resizeHandle) return;

  let isDragging = false;
  let startY = 0;
  let startHeight = 0;

  // Mouse down - start resizing
  resizeHandle.addEventListener('mousedown', function(e) {
    // Prevent text selection during resize
    e.preventDefault();
    e.stopPropagation();

    const terminalPanel = document.getElementById('terminalPanel');
    if (!terminalPanel) return;

    isDragging = true;
    startY = e.clientY;
    startHeight = parseInt(terminalPanel.offsetHeight);

    document.body.style.cursor = 'row-resize';

    // Disable text selection during resize
    document.body.style.userSelect = 'none';
  });

  // Mouse move - resize terminal
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;

    const terminalPanel = document.getElementById('terminalPanel');
    const editorArea = document.getElementById('editorArea');
    if (!terminalPanel || !editorArea) return;

    const deltaY = startY - e.clientY;
    const newHeight = Math.max(100, Math.min(window.innerHeight - 200, startHeight + deltaY));

    terminalPanel.style.height = newHeight + 'px';
    editorArea.style.bottom = newHeight + 'px';
  });

  // Mouse up - stop resizing
  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = '';

      // Try to save the terminal height to localStorage
      try {
        const terminalPanel = document.getElementById('terminalPanel');
        if (terminalPanel) {
          localStorage.setItem('terminalHeight', terminalPanel.offsetHeight);
        }
      } catch (e) {
        console.warn('Unable to save terminal height to localStorage:', e);
      }
    }
  });
}

// Create status bar if missing
function createStatusBar() {
  if (document.querySelector('.status-bar')) {
    return; // Already exists
  }

  const statusBar = document.createElement('div');
  statusBar.className = 'status-bar';
  statusBar.style.height = '25px';
  statusBar.style.minHeight = '25px';
  statusBar.style.backgroundColor = '#3c3f41';
  statusBar.style.borderTop = '1px solid #323232';
  statusBar.style.display = 'flex';
  statusBar.style.alignItems = 'center';
  statusBar.style.padding = '0 15px';
  statusBar.style.fontSize = '12px';
  statusBar.style.position = 'absolute';
  statusBar.style.bottom = '0';
  statusBar.style.left = '0';
  statusBar.style.right = '0';
  statusBar.style.zIndex = '5';

  statusBar.innerHTML = `
    <div class="status-item">
      <i class="fas fa-code-branch"></i> main
    </div>
    <div class="status-item">
      <i class="fas fa-map-marker-alt"></i> Ln 1, Col 1
    </div>
    <div class="right-status" style="margin-left: auto; display: flex;">
      <div class="status-item" style="margin-right: 15px;">JavaScript</div>
      <div class="status-item">UTF-8</div>
    </div>
  `;

  document.querySelector('.content-area').appendChild(statusBar);
}

// Correct layout positioning
function fixLayoutPositioning() {
  // Fix project directory
  const projectDirectory = document.getElementById('projectDirectory');
  if (projectDirectory) {
    projectDirectory.style.width = '250px';
    projectDirectory.style.minWidth = '150px';
    projectDirectory.style.maxWidth = '400px';
    projectDirectory.style.position = 'absolute';
    projectDirectory.style.top = '35px';
    projectDirectory.style.left = '0';
    projectDirectory.style.bottom = '25px';
    projectDirectory.style.zIndex = '2';
    projectDirectory.style.display = 'flex';
    projectDirectory.style.flexDirection = 'column';
    projectDirectory.style.backgroundColor = '#2d2f30';
    projectDirectory.style.borderRight = '1px solid #323232';
  }

  // Fix editor area
  const editorArea = document.getElementById('editorArea');
  if (editorArea) {
    editorArea.style.position = 'absolute';
    editorArea.style.top = '35px';
    editorArea.style.left = '250px';
    editorArea.style.right = '0';
    editorArea.style.bottom = '225px'; // 200px terminal + 25px status bar
    editorArea.style.zIndex = '1';
    editorArea.style.display = 'flex';
    editorArea.style.flexDirection = 'column';
    editorArea.style.backgroundColor = '#2b2b2b';
    editorArea.style.overflow = 'hidden';
  }

  // Make sure nested files are displayed
  const nestedFiles = document.querySelector('.nested-files');
  if (nestedFiles) {
    nestedFiles.style.display = 'block';
  }
}

// Basic terminal functionality
function setupTerminalFunctionality() {
  const terminalContent = document.querySelector('.terminal-content');
  if (!terminalContent) return;

  // Find or create terminal input
  let terminalInput = terminalContent.querySelector('.terminal-prompt:last-child .terminal-input');
  if (!terminalInput) {
    const newPrompt = document.createElement('div');
    newPrompt.className = 'terminal-prompt';
    newPrompt.innerHTML = `
      <span class="terminal-user">guest</span><span class="terminal-at">@</span><span class="terminal-machine">portfolio</span><span class="terminal-colon">:</span><span class="terminal-directory">~</span><span class="terminal-symbol">$</span>
      <span class="terminal-input" contenteditable="true" spellcheck="false"></span>
      <span class="typing-cursor"></span>
    `;
    terminalContent.appendChild(newPrompt);
    terminalInput = newPrompt.querySelector('.terminal-input');
  }

  // Make terminal clickable to focus
  terminalContent.addEventListener('click', function(e) {
    // Only focus if not clicking another interactive element
    if (!e.target.closest('a, button, [contenteditable], textarea')) {
      const input = this.querySelector('.terminal-prompt:last-child .terminal-input');
      if (input) input.focus();
    }
  });

  // Set up command handling if not already set up
  if (!terminalInput.getAttribute('data-initialized')) {
    terminalInput.setAttribute('data-initialized', 'true');

    terminalInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();

        // Get command
        const command = this.textContent.trim();

        // Clear input
        this.textContent = '';

        // Create output element
        const output = document.createElement('div');
        output.className = 'terminal-output';

        // Process different commands
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
            output.innerHTML = `Opening ${command}.md...`;

            // Try to activate the tab
            try {
              const tabToActivate = document.getElementById(`${command}Tab`);
              if (tabToActivate) {
                // Show tab
                document.querySelectorAll('.editor-tab').forEach(tab => {
                  tab.style.display = 'none';
                  tab.classList.remove('active');
                });
                tabToActivate.style.display = 'flex';
                tabToActivate.classList.add('active');

                // Show content
                document.querySelectorAll('.code-content').forEach(content => {
                  content.classList.remove('active');
                });
                document.getElementById(`${command}Content`).classList.add('active');
              }
            } catch (err) {
              console.error(`Error activating ${command} tab:`, err);
            }
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

          case 'clear':
            // Clear all outputs and previous prompts
            const outputs = terminalContent.querySelectorAll('.terminal-output, .terminal-prompt:not(:last-child)');
            outputs.forEach(el => el.remove());

            // Add welcome message
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'terminal-output';
            welcomeMsg.textContent = "Welcome to Barrett Taylor's Interactive CLI.";
            const helpMsg = document.createElement('div');
            helpMsg.className = 'terminal-output';
            helpMsg.textContent = "Type help to see available commands.";

            terminalContent.insertBefore(helpMsg, terminalContent.querySelector('.terminal-prompt'));
            terminalContent.insertBefore(welcomeMsg, helpMsg);
            return; // Skip adding output for clear command

          case 'message':
            promptMessage(terminalContent);
            return; // Skip adding output for message command

          case '':
            // Empty command, do nothing
            return;

          // Handle advanced features requests (even if modules aren't loaded)
          case 'java':
          case 'api':
          case 'database':
          case 'git':
          case 'build':
          case 'demos':
          case 'tools':
          case 'challenge':
            if (window[command + 'Viewer'] && typeof window[command + 'Viewer'].start === 'function') {
              window[command + 'Viewer'].start(terminalContent, document.getElementById('editorArea'));
            } else if (command === 'java' && window.javaTerminal && typeof window.javaTerminal.start === 'function') {
              window.javaTerminal.start(terminalContent, document.getElementById('editorArea'));
            } else if (command === 'challenge' && window.codeChallenge && typeof window.codeChallenge.start === 'function') {
              window.codeChallenge.start(terminalContent, document.getElementById('editorArea'));
            } else {
              output.innerHTML = `<span style="color: #cc7832;">${command}</span> feature demonstration is not available. Please check back later.`;
            }
            break;

          default:
            output.innerHTML = `Command not found: ${command}<br>Type 'help' to see available commands.`;
        }

        // Clone current prompt
        const currentPrompt = terminalContent.querySelector('.terminal-prompt:last-child');
        const newPrompt = currentPrompt.cloneNode(true);
        const newInput = newPrompt.querySelector('.terminal-input');
        newInput.textContent = '';
        newInput.setAttribute('contenteditable', 'true');
        newInput.setAttribute('data-initialized', 'true');

        // Update current prompt to show entered command
        currentPrompt.querySelector('.terminal-input').textContent = command;
        currentPrompt.querySelector('.terminal-input').removeAttribute('contenteditable');

        // Remove cursor from old prompt
        const oldCursor = currentPrompt.querySelector('.typing-cursor');
        if (oldCursor) oldCursor.remove();

        // Add output and new prompt
        terminalContent.appendChild(output);
        terminalContent.appendChild(newPrompt);

        // Focus new input
        newInput.focus();

        // Add event listener to new input
        newInput.addEventListener('keydown', arguments.callee);

        // Scroll to bottom
        terminalContent.scrollTop = terminalContent.scrollHeight;
      }
    });
  }

  // Focus the input
  terminalInput.focus();
}

// Function to handle message command
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

// Ensure tabs work correctly
function fixTabNavigation() {
  // Make sure tabs are clickable
  document.querySelectorAll('.editor-tab').forEach(tab => {
    // Skip if already has click handler
    if (tab.getAttribute('data-click-initialized')) return;
    tab.setAttribute('data-click-initialized', 'true');

    tab.addEventListener('click', function(e) {
      e.stopPropagation();

      // Get section from tab ID
      const tabId = this.id;
      const section = tabId.replace('Tab', '');

      // Hide all tabs and content
      document.querySelectorAll('.editor-tab').forEach(t => {
        t.style.display = 'none';
        t.classList.remove('active');
      });
      document.querySelectorAll('.code-content').forEach(c => {
        c.classList.remove('active');
      });

      // Show this tab and its content
      this.style.display = 'flex';
      this.classList.add('active');

      const contentId = `${section}Content`;
      const content = document.getElementById(contentId);
      if (content) {
        content.classList.add('active');
      }
    });

    // Make close buttons work
    const closeBtn = tab.querySelector('.close-tab');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const tab = this.closest('.editor-tab');
        if (tab) {
          tab.style.display = 'none';
          if (tab.classList.contains('active')) {
            // Default to about tab if this was active
            const aboutTab = document.getElementById('aboutTab');
            if (aboutTab) {
              aboutTab.click();
            }
          }
        }
      });
    }
  });
}

// Make project directory files clickable
function makeFilesClickable() {
  document.querySelectorAll('.tree-file').forEach(file => {
    if (file.getAttribute('data-click-initialized')) return;
    file.setAttribute('data-click-initialized', 'true');

    file.addEventListener('click', function(e) {
      e.stopPropagation();
      const fileName = this.textContent.trim();
      const section = fileName.replace('.md', '');

      // Find corresponding tab
      const tab = document.getElementById(`${section}Tab`);
      if (tab) {
        tab.click();
      }
    });
  });

  // Make sure folder toggle works
  document.querySelectorAll('.tree-item').forEach(folderItem => {
    if (folderItem.getAttribute('data-click-initialized')) return;
    folderItem.setAttribute('data-click-initialized', 'true');

    folderItem.addEventListener('click', function(e) {
      e.stopPropagation();
      const nestedFiles = this.nextElementSibling;
      const icon = this.querySelector('.fa-chevron-right');

      if (nestedFiles && nestedFiles.classList.contains('nested-files')) {
        const isExpanded = nestedFiles.style.display === 'block';
        nestedFiles.style.display = isExpanded ? 'none' : 'block';

        if (icon) {
          icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
        }
      }
    });
  });
}

// Define global toggle folder function if needed
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
      console.error('Error toggling folder:', error);
    }
  };
}