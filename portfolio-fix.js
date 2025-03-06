// Fix 1: Force hide loading overlay to ensure site visibility
document.addEventListener('DOMContentLoaded', function() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
  }
});

// Fix 2: Create terminal panel if missing
function createTerminalPanel() {
  if (document.getElementById('terminalPanel')) {
    return; // Already exists
  }

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

  // Create terminal resize handle
  const resizeHandle = document.createElement('div');
  resizeHandle.id = 'terminalResizeHandle';
  resizeHandle.className = 'resize-handle vertical-resize-handle';
  resizeHandle.style.position = 'absolute';
  resizeHandle.style.cursor = 'row-resize';
  resizeHandle.style.height = '5px';
  resizeHandle.style.left = '0';
  resizeHandle.style.right = '0';
  resizeHandle.style.top = '0';
  resizeHandle.style.zIndex = '50';
  
  // Add all components together
  terminalPanel.appendChild(terminalHeader);
  terminalPanel.appendChild(terminalContent);
  terminalPanel.appendChild(resizeHandle);
  
  // Add to the page
  document.querySelector('.content-area').appendChild(terminalPanel);
  
  // Set up terminal functionality
  setupTerminalFunctionality();
}

// Fix 3: Create status bar if missing
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

// Fix 4: Correct layout positioning
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

// Fix 5: Basic terminal functionality
function setupTerminalFunctionality() {
  const terminalContent = document.querySelector('.terminal-content');
  if (!terminalContent) return;

  // Find or create terminal input
  let terminalInput = terminalContent.querySelector('.terminal-input');
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

  // Set up command handling
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
          
        case '':
          // Empty command, do nothing
          return;
        
        // Handle advanced features (stubs)
        case 'java':
          output.innerHTML = `Starting Java REPL mode...`;
          if (window.javaTerminal && typeof window.javaTerminal.start === 'function') {
            window.javaTerminal.start(terminalContent, document.getElementById('editorArea'));
          } else {
            output.innerHTML = `Java REPL mode not available.`;
          }
          break;
          
        case 'api':
          output.innerHTML = `Starting API demo...`;
          if (window.apiDemo && typeof window.apiDemo.start === 'function') {
            window.apiDemo.start(terminalContent, document.getElementById('editorArea'));
          } else {
            output.innerHTML = `API demo not available.`;
          }
          break;
          
        case 'database':
          output.innerHTML = `Opening database schema viewer...`;
          if (window.databaseViewer && typeof window.databaseViewer.start === 'function') {
            window.databaseViewer.start(terminalContent, document.getElementById('editorArea'));
          } else {
            output.innerHTML = `Database schema viewer not available.`;
          }
          break;
          
        case 'git':
          output.innerHTML = `Starting Git repository viewer...`;
          if (window.gitViewer && typeof window.gitViewer.start === 'function') {
            window.gitViewer.start(terminalContent, document.getElementById('editorArea'));
          } else {
            output.innerHTML = `Git repository viewer not available.`;
          }
          break;
          
        case 'build':
          output.innerHTML = `Opening build tools...`;
          if (window.buildTools && typeof window.buildTools.start === 'function') {
            window.buildTools.start(terminalContent, document.getElementById('editorArea'));
          } else {
            output.innerHTML = `Build tools not available.`;
          }
          break;
          
        case 'demos':
          output.innerHTML = `Starting project demos...`;
          if (window.projectDemo && typeof window.projectDemo.start === 'function') {
            window.projectDemo.start(terminalContent, document.getElementById('editorArea'));
          } else {
            output.innerHTML = `Project demos not available.`;
          }
          break;
          
        case 'tools':
          output.innerHTML = `Opening development tools showcase...`;
          if (window.ideTools && typeof window.ideTools.start === 'function') {
            window.ideTools.start(terminalContent, document.getElementById('editorArea'));
          } else {
            output.innerHTML = `Development tools showcase not available.`;
          }
          break;
          
        case 'challenge':
          output.innerHTML = `Starting coding challenge...`;
          if (window.codeChallenge && typeof window.codeChallenge.start === 'function') {
            window.codeChallenge.start(terminalContent, document.getElementById('editorArea'));
          } else {
            output.innerHTML = `Coding challenge not available.`;
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
  
  // Focus the input
  terminalInput.focus();
  
  // Make terminal clickable to focus
  terminalContent.addEventListener('click', function(e) {
    // Only focus if not clicking another interactive element
    if (!e.target.closest('a, button, [contenteditable], textarea')) {
      const input = this.querySelector('.terminal-prompt:last-child .terminal-input');
      if (input) input.focus();
    }
  });
}

// Fix 6: Ensure tabs work correctly
function fixTabNavigation() {
  // Make sure tabs are clickable
  document.querySelectorAll('.editor-tab').forEach(tab => {
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

// Fix 7: Make project directory files clickable
function makeFilesClickable() {
  document.querySelectorAll('.tree-file').forEach(file => {
    file.addEventListener('click', function() {
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
    folderItem.addEventListener('click', function() {
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

// Fix 8: Master initialization function
function initializePortfolio() {
  // Step 1: Ensure loading overlay is gone
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
  }
  
  // Step 2: Create missing components
  createTerminalPanel();
  createStatusBar();
  
  // Step 3: Fix layout
  fixLayoutPositioning();
  
  // Step 4: Set up interactions
  setupTerminalFunctionality();
  fixTabNavigation();
  makeFilesClickable();
  
  // Step 5: Set basic stubs for advanced features
  window.javaTerminal = {
    start: () => console.log("Java Terminal started"),
    processInput: () => true,
    isActive: () => false
  };
  
  window.apiDemo = {
    start: () => console.log("API Demo started"),
    processInput: () => true,
    isActive: () => false
  };
  
  window.databaseViewer = {
    start: () => console.log("Database Viewer started"),
    processInput: () => true,
    isActive: () => false
  };
  
  window.gitViewer = {
    start: () => console.log("Git Viewer started"),
    processInput: () => true,
    isActive: () => false
  };
  
  window.buildTools = {
    start: () => console.log("Build Tools started"),
    processInput: () => true,
    isActive: () => false
  };
  
  window.projectDemo = {
    start: () => console.log("Project Demo started"),
    processInput: () => true,
    isActive: () => false
  };
  
  window.ideTools = {
    start: () => console.log("IDE Tools started"),
    processInput: () => true,
    isActive: () => false
  };
  
  window.codeChallenge = {
    start: () => console.log("Code Challenge started"),
    processInput: () => true,
    isActive: () => false
  };
  
  // Show default tab
  const aboutTab = document.getElementById('aboutTab');
  if (aboutTab) {
    aboutTab.click();
  }
  
  console.log("Portfolio initialization complete");
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initializePortfolio);