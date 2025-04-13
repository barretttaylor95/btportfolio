/**
 * Main JavaScript for Barrett Taylor's Portfolio
 * A complete, standalone implementation with terminal functionality
 */

// Global state variables
const state = {
  activeTab: 'about',
  terminalVisible: true,
  terminalHeight: 200,
  directoryWidth: 250,
  isDarkMode: true,
  commandHistory: [],
  historyIndex: -1,
  currentInput: ''
};

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Main script initializing...');

  // Hide loading overlay
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
  }

  // Load saved preferences
  loadSavedPreferences();

  // Initialize UI components
  initializeUI();

  // Initialize terminal
  initializeTerminal();

  // Set up event listeners
  setupEventListeners();

  console.log('Initialization complete');
});

/**
 * Load saved preferences from localStorage
 */
function loadSavedPreferences() {
  try {
    // Terminal visibility
    const savedVisibility = localStorage.getItem('terminalVisible');
    if (savedVisibility !== null) {
      state.terminalVisible = savedVisibility === 'true';
    }

    // Panel sizes
    const savedDirectoryWidth = parseInt(localStorage.getItem('directoryWidth'));
    if (!isNaN(savedDirectoryWidth) && savedDirectoryWidth > 150) {
      state.directoryWidth = savedDirectoryWidth;
    }

    const savedTerminalHeight = parseInt(localStorage.getItem('terminalHeight'));
    if (!isNaN(savedTerminalHeight) && savedTerminalHeight > 100) {
      state.terminalHeight = savedTerminalHeight;
    }

    // Theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      state.isDarkMode = savedTheme === 'dark';
      applyTheme();
    }

    // Active tab
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
      state.activeTab = savedTab;
    }

    // Open tabs
    try {
      const openTabs = JSON.parse(localStorage.getItem('openTabs') || '["about"]');
      openTabs.forEach(tabId => {
        const tab = document.getElementById(tabId + 'Tab');
        if (tab) {
          tab.style.display = 'flex';
        }
      });
    } catch (e) {
      console.warn('Error loading open tabs:', e);
    }

    console.log('Preferences loaded successfully');
  } catch (e) {
    console.warn('Error loading preferences:', e);
  }
}

/**
 * Initialize user interface elements
 */
function initializeUI() {
  // Create terminal toggle button
  createTerminalToggleButton();

  // Create features dropdown
  createFeaturesDropdown();

  // Create terminal panel if it doesn't exist
  createTerminalPanel();

  // Set up resizable panels
  setupResizablePanels();

  // Apply current theme
  applyTheme();

  // Show active tab
  showSection(state.activeTab);

  // Make files clickable
  makeFilesClickable();

  // Initialize tabs
  setupTabEvents();

  // Check URL hash for direct section navigation
  checkUrlHash();
}

/**
 * Create terminal toggle button
 */
function createTerminalToggleButton() {
  // Find the main dropdown
  const mainDropdown = document.querySelector('.dropdown');
  if (!mainDropdown) {
    console.error('Cannot find main dropdown for terminal toggle button');
    return;
  }

  // Check if button already exists
  if (document.querySelector('.terminal-toggle-button')) {
    return;
  }

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .terminal-toggle-button {
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 100%;
      cursor: pointer;
      margin-left: 10px;
      transition: background-color 0.2s;
    }
    .terminal-toggle-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .terminal-toggle-button.active {
      background-color: #4e5254;
    }
    .terminal-toggle-button i {
      margin-right: 6px;
    }
  `;
  document.head.appendChild(style);

  // Create button
  const toggleButton = document.createElement('div');
  toggleButton.className = 'terminal-toggle-button';
  if (state.terminalVisible) {
    toggleButton.classList.add('active');
  }
  toggleButton.innerHTML = '<i class="fas fa-terminal"></i> Terminal';

  // Add to DOM
  mainDropdown.parentNode.insertBefore(toggleButton, mainDropdown.nextSibling);

  // Add click event
  toggleButton.addEventListener('click', function() {
    toggleTerminalVisibility();
    this.classList.toggle('active', state.terminalVisible);
  });

  console.log('Terminal toggle button created');
}

/**
 * Create features dropdown
 */
function createFeaturesDropdown() {
  // Find terminal button
  const terminalButton = document.querySelector('.terminal-toggle-button');
  if (!terminalButton) {
    console.warn('Cannot find terminal button for features dropdown');
    return;
  }

  // Check if dropdown already exists
  if (document.querySelector('.features-dropdown')) {
    return;
  }

  // Add styles
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
    .features-menu-item div {
      margin-left: 8px;
    }
    .features-menu-item .description {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 3px;
    }
  `;
  document.head.appendChild(style);

  // Create dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'features-dropdown';
  dropdown.innerHTML = `
    <i class="fas fa-code"></i> Features
    <i class="fas fa-chevron-down"></i>
    <div class="features-menu">
      <div class="features-menu-item" data-feature="challenge">
        <i class="fas fa-puzzle-piece"></i>
        <div>
          <span>Code Challenges</span>
          <div class="description">Interactive coding problems</div>
        </div>
      </div>
      <div class="features-menu-item" data-feature="java">
        <i class="fab fa-java"></i>
        <div>
          <span>Java Terminal</span>
          <div class="description">Java code execution</div>
        </div>
      </div>
      <div class="features-menu-item" data-feature="tools">
        <i class="fas fa-tools"></i>
        <div>
          <span>IDE Tools</span>
          <div class="description">Development tools</div>
        </div>
      </div>
      <div class="features-menu-item" data-feature="demos">
        <i class="fas fa-desktop"></i>
        <div>
          <span>Project Demos</span>
          <div class="description">Live demonstrations</div>
        </div>
      </div>
    </div>
  `;

  // Add to DOM
  terminalButton.parentNode.insertBefore(dropdown, terminalButton.nextSibling);

  // Toggle dropdown on click
  dropdown.addEventListener('click', function(e) {
    if (!e.target.closest('.features-menu-item')) {
      this.classList.toggle('open');
    }
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

  console.log('Features dropdown created');
}

/**
 * Create terminal panel
 */
function createTerminalPanel() {
  // Find content area
  const contentArea = document.querySelector('.content-area');
  if (!contentArea) {
    console.error('Content area not found for terminal panel');
    return;
  }

  // Check if terminal panel already exists
  if (document.getElementById('terminalPanel')) {
    return;
  }

  // Create terminal panel
  const terminalPanel = document.createElement('div');
  terminalPanel.id = 'terminalPanel';
  terminalPanel.className = 'terminal-panel';

  // Add styles if not already in CSS
  if (!document.querySelector('style[data-for="terminal-panel"]')) {
    const style = document.createElement('style');
    style.setAttribute('data-for', 'terminal-panel');
    style.textContent = `
      .terminal-panel {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 25px;
        height: ${state.terminalHeight}px;
        background-color: #1e1e1e;
        border-top: 1px solid #323232;
        display: flex;
        flex-direction: column;
        z-index: 3;
      }
      .resize-handle {
        position: absolute;
        z-index: 10;
      }
      .vertical-resize-handle {
        cursor: row-resize;
        height: 5px;
        left: 0;
        right: 0;
        top: 0;
      }
      .terminal-header {
        height: 32px;
        background-color: #3c3f41;
        border-bottom: 1px solid #323232;
        display: flex;
        align-items: center;
        padding: 0 15px;
      }
      .terminal-title {
        font-weight: bold;
        margin-right: 20px;
      }
      .terminal-tabs {
        display: flex;
        height: 100%;
      }
      .terminal-tab {
        padding: 0 15px;
        display: flex;
        align-items: center;
        border-right: 1px solid #323232;
        cursor: pointer;
      }
      .terminal-tab.active {
        background-color: #1e1e1e;
      }
      .terminal-content {
        flex: 1;
        background-color: #1e1e1e;
        padding: 10px;
        font-family: 'JetBrains Mono', 'Consolas', monospace;
        color: #dcdcdc;
        overflow-y: auto;
      }
      .terminal-output {
        margin-bottom: 8px;
        white-space: pre-wrap;
      }
      .terminal-prompt {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
      .terminal-user {
        color: #6a9955;
      }
      .terminal-at {
        color: #808080;
      }
      .terminal-machine {
        color: #569cd6;
      }
      .terminal-colon {
        color: #dcdcdc;
      }
      .terminal-directory {
        color: #ce9178;
      }
      .terminal-symbol {
        color: #dcdcdc;
        margin-right: 5px;
      }
      .terminal-input {
        outline: none;
        background-color: transparent;
        border: none;
        color: #dcdcdc;
        font-family: inherit;
        flex: 1;
        min-width: 10px;
      }
      .typing-cursor {
        display: inline-block;
        width: 8px;
        height: 16px;
        background-color: #dcdcdc;
        animation: blink 1s step-end infinite;
        vertical-align: middle;
      }
      @keyframes blink {
        50% {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create resize handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle vertical-resize-handle';
  resizeHandle.id = 'terminalResizeHandle';

  // Create terminal header
  const terminalHeader = document.createElement('div');
  terminalHeader.className = 'terminal-header';
  terminalHeader.innerHTML = `
    <div class="terminal-title">Terminal</div>
    <div class="terminal-tabs">
      <div class="terminal-tab active">CLI</div>
    </div>
  `;

  // Create terminal content
  const terminalContent = document.createElement('div');
  terminalContent.className = 'terminal-content';
  terminalContent.innerHTML = `
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
  `;

  // Assemble terminal panel
  terminalPanel.appendChild(resizeHandle);
  terminalPanel.appendChild(terminalHeader);
  terminalPanel.appendChild(terminalContent);

  // Add to DOM
  contentArea.appendChild(terminalPanel);

  // Set initial visibility
  if (!state.terminalVisible) {
    terminalPanel.style.display = 'none';
  }

  // Adjust editor area
  updateLayout();

  console.log('Terminal panel created');
}

/**
 * Initialize terminal functionality
 */
function initializeTerminal() {
  const terminalContent = document.querySelector('.terminal-content');
  if (!terminalContent) {
    console.error('Terminal content not found');
    return;
  }

  const terminalInput = terminalContent.querySelector('.terminal-input');
  if (!terminalInput) {
    console.error('Terminal input not found');
    return;
  }

  // Focus the input
  terminalInput.focus();

  // Make terminal clickable
  terminalContent.addEventListener('click', function(e) {
    if (!e.target.closest('a, button, [contenteditable], textarea')) {
      const input = this.querySelector('.terminal-prompt:last-child .terminal-input');
      if (input) {
        input.focus();
      }
    }
  });

  // Set up command handling
  terminalInput.addEventListener('keydown', handleTerminalKeydown);

  console.log('Terminal initialized');
}

/**
 * Handle terminal keydown events
 * @param {KeyboardEvent} e - Keydown event
 */
function handleTerminalKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();

    // Get command
    const command = this.textContent.trim();

    // Add to history
    if (command) {
      state.commandHistory.unshift(command);
      if (state.commandHistory.length > 50) {
        state.commandHistory.pop();
      }
      state.historyIndex = -1;
    }

    // Get terminal content element
    const terminalContent = this.closest('.terminal-content');

    // Echo command
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

    // Process command
    processTerminalCommand(command, terminalContent);

  } else if (e.key === 'ArrowUp') {
    e.preventDefault();

    // Navigate history
    if (state.historyIndex === -1) {
      state.currentInput = this.textContent;
    }

    if (state.historyIndex < state.commandHistory.length - 1) {
      state.historyIndex++;
      this.textContent = state.commandHistory[state.historyIndex];
      positionCursorAtEnd(this);
    }

  } else if (e.key === 'ArrowDown') {
    e.preventDefault();

    // Navigate history
    if (state.historyIndex > 0) {
      state.historyIndex--;
      this.textContent = state.commandHistory[state.historyIndex];
    } else if (state.historyIndex === 0) {
      state.historyIndex = -1;
      this.textContent = state.currentInput;
    }

    positionCursorAtEnd(this);
  }
}

/**
 * Process terminal commands
 * @param {string} command - Command to process
 * @param {HTMLElement} terminal - Terminal element
 */
function processTerminalCommand(command, terminal) {
  if (!command) {
    createNewPrompt(terminal);
    return;
  }

  // Create output element
  const output = document.createElement('div');
  output.className = 'terminal-output';

  // Process command
  const cmd = command.toLowerCase();

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
      // Clear all outputs
      while (terminal.firstChild) {
        terminal.removeChild(terminal.firstChild);
      }

      // Add welcome message
      const welcomeMsg = document.createElement('div');
      welcomeMsg.className = 'terminal-output';
      welcomeMsg.textContent = "Terminal cleared. Type help to see available commands.";
      terminal.appendChild(welcomeMsg);

      createNewPrompt(terminal);
      return; // Skip adding output

    case 'message':
      showMessageForm(terminal);
      return; // Skip adding output

    case 'java':
    case 'api':
    case 'database':
    case 'git':
    case 'build':
    case 'demos':
    case 'tools':
    case 'challenge':
      output.innerHTML = `<span style="color: #cc7832;">${cmd}</span> feature is currently unavailable.`;
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

/**
 * Create a new terminal prompt
 * @param {HTMLElement} terminal - Terminal element
 */
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

  // Get input element
  const input = prompt.querySelector('.terminal-input');

  // Focus input
  if (input) {
    input.focus();

    // Add event listener
    input.addEventListener('keydown', handleTerminalKeydown);
  }

  // Scroll to bottom
  terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show message input form in terminal
 * @param {HTMLElement} terminal - Terminal element
 */
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
        responseDiv.innerHTML = `Message sent:<br>${message}<br><br>Thank you! Your message has been sent.`;
      } else {
        // Empty message
        responseDiv.innerHTML = `Message canceled - empty message.`;
      }

      // Add response to form container
      formContainer.appendChild(responseDiv);

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

/**
 * Position cursor at the end of an element
 * @param {HTMLElement} element - Element to position cursor in
 */
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

/**
 * Toggle terminal visibility
 */
function toggleTerminalVisibility() {
  state.terminalVisible = !state.terminalVisible;

  // Update layout
  updateLayout();

  // Update toggle button
  const toggleButton = document.querySelector('.terminal-toggle-button');
  if (toggleButton) {
    toggleButton.classList.toggle('active', state.terminalVisible);
  }

  // Save preference
  try {
    localStorage.setItem('terminalVisible', state.terminalVisible.toString());
  } catch (e) {
    console.warn('Error saving terminal visibility:', e);
  }
}

/**
 * Update layout based on current state
 */
function updateLayout() {
  const terminalPanel = document.getElementById('terminalPanel');
  const editorArea = document.getElementById('editorArea');
  const projectDirectory = document.getElementById('projectDirectory');

  if (!terminalPanel || !editorArea) {
    return;
  }

  // Apply terminal height
  terminalPanel.style.height = `${state.terminalHeight}px`;

  // Apply terminal visibility
  terminalPanel.style.display = state.terminalVisible ? 'flex' : 'none';

  // Adjust editor area based on terminal visibility
  if (state.terminalVisible) {
    editorArea.style.bottom = `${state.terminalHeight + 25}px`; // terminal + status bar
  } else {
    editorArea.style.bottom = '25px'; // Just status bar
  }

  // Apply directory width if project directory exists
  if (projectDirectory) {
    projectDirectory.style.width = `${state.directoryWidth}px`;

    // Update editor area position and width
    editorArea.style.left = `${state.directoryWidth}px`;
  }
}

/**
 * Set up resizable panels
 */
function setupResizablePanels() {
  const directoryHandle = document.getElementById('directoryResizeHandle');
  const terminalHandle = document.getElementById('terminalResizeHandle');

  // Set up directory resize
  if (directoryHandle) {
    directoryHandle.addEventListener('mousedown', startDirectoryResize);
  }

  // Set up terminal resize
  if (terminalHandle) {
    terminalHandle.addEventListener('mousedown', startTerminalResize);
  }
}

/**
 * Start directory resize operation
 * @param {MouseEvent} e - Mouse event
 */
function startDirectoryResize(e) {
  e.preventDefault();

  // Set up variables for resize operation
  const startX = e.clientX;
  const startWidth = state.directoryWidth;

  // Change cursor
  document.body.style.cursor = 'col-resize';

  // Handle mouse move
  function handleMouseMove(e) {
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(150, Math.min(window.innerWidth - 300, startWidth + deltaX));

    // Update state
    state.directoryWidth = newWidth;

    // Update layout
    updateLayout();
  }

  // Handle mouse up
  function handleMouseUp() {
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    // Reset cursor
    document.body.style.cursor = '';

    // Save directory width
    try {
      localStorage.setItem('directoryWidth', state.directoryWidth.toString());
    } catch (e) {
      console.warn('Error saving directory width:', e);
    }
  }

  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

/**
 * Start terminal resize operation
 * @param {MouseEvent} e - Mouse event
 */
function startTerminalResize(e) {
  e.preventDefault();

  // Set up variables for resize operation
  const startY = e.clientY;
  const startHeight = state.terminalHeight;

  // Change cursor
  document.body.style.cursor = 'row-resize';

  // Handle mouse move
  function handleMouseMove(e) {
    const editorBottom = window.innerHeight - 25; // 25px for status bar
    const newHeight = Math.max(100, Math.min(window.innerHeight - 200, editorBottom - e.clientY));

    // Update state
    state.terminalHeight = newHeight;

    // Update layout
    updateLayout();
  }

  // Handle mouse up
  function handleMouseUp() {
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    // Reset cursor
    document.body.style.cursor = '';

    // Save terminal height
    try {
      localStorage.setItem('terminalHeight', state.terminalHeight.toString());
    } catch (e) {
      console.warn('Error saving terminal height:', e);
    }
  }

  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

/**
 * Apply current theme
 */
function applyTheme() {
  const body = document.body;

  if (state.isDarkMode) {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
  }
}

/**
 * Toggle theme between light and dark
 */
function toggleTheme() {
  state.isDarkMode = !state.isDarkMode;

  // Apply theme
  applyTheme();

  // Save preference
  try {
    localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
  } catch (e) {
    console.warn('Error saving theme preference:', e);
  }
}

/**
 * Check URL hash for direct section navigation
 */
function checkUrlHash() {
  const hash = window.location.hash;
  if (hash && hash.length > 1) {
    const section = hash.substring(1);
    const tab = document.getElementById(section + 'Tab');

    if (tab) {
      tab.style.display = 'flex';
      showSection(section);
    }
  }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  // Theme toggle
  const themeToggle = document.querySelector('.action-button');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Window resize
  window.addEventListener('resize', function() {
    // Update layout
    updateLayout();
  });

  // Expose global functions for HTML attributes
  window.toggleTerminalVisibility = toggleTerminalVisibility;
  window.toggleTheme = toggleTheme;
  window.toggleFolder = toggleFolder;
  window.showSection = showSection;
  window.activateTab = activateTab;
}

/**
 * Make all project files clickable
 */
function makeFilesClickable() {
  document.querySelectorAll('.tree-file').forEach(file => {
    // Skip if already initialized
    if (file.getAttribute('data-click-initialized')) return;
    file.setAttribute('data-click-initialized', 'true');

    file.addEventListener('click', function(e) {
      e.stopPropagation();

      // Get file name and section
      const fileName = this.textContent.trim();
      const section = fileName.replace('.md', '');

      // Find corresponding tab
      const tab = document.getElementById(`${section}Tab`);
      if (tab) {
        // Show tab
        tab.style.display = 'flex';

        // Add to open tabs in localStorage
        try {
          let openTabs = JSON.parse(localStorage.getItem('openTabs') || '[]');
          if (!openTabs.includes(section)) {
            openTabs.push(section);
            localStorage.setItem('openTabs', JSON.stringify(openTabs));
          }
        } catch (e) {
          console.warn('Error updating open tabs:', e);
        }

        // Show section
        showSection(section);
      }
    });
  });

  // Make folders toggleable
  document.querySelectorAll('.tree-item').forEach(folder => {
    // Skip if already initialized
    if (folder.getAttribute('data-click-initialized')) return;
    folder.setAttribute('data-click-initialized', 'true');

    folder.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFolder(this);
    });
  });
}

/**
 * Toggle folder open/closed
 * @param {HTMLElement} element - Folder element
 */
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

/**
 * Set up tab click events
 */
function setupTabEvents() {
  document.querySelectorAll('.editor-tab').forEach(tab => {
    // Skip if already initialized
    if (tab.getAttribute('data-click-initialized')) return;
    tab.setAttribute('data-click-initialized', 'true');

    // Tab click to show content
    tab.addEventListener('click', function() {
      const sectionId = this.id.replace('Tab', '');
      showSection(sectionId);
    });

    // Close button
    const closeBtn = tab.querySelector('.close-tab');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Don't activate tab when closing

        // Get tab and section
        const tab = this.closest('.editor-tab');
        const sectionId = tab.id.replace('Tab', '');

        // Hide tab
        tab.style.display = 'none';

        // Update openTabs in localStorage
        try {
          let openTabs = JSON.parse(localStorage.getItem('openTabs') || '[]');
          openTabs = openTabs.filter(tabId => tabId !== sectionId);

          // Make sure at least one tab is open
          if (openTabs.length === 0) {
            openTabs.push('about');
            document.getElementById('aboutTab').style.display = 'flex';
          }

          localStorage.setItem('openTabs', JSON.stringify(openTabs));
        } catch (e) {
          console.warn('Error updating open tabs:', e);
        }

        // If this was the active tab, activate another one
        if (tab.classList.contains('active')) {
          // Find another visible tab
          const visibleTabs = Array.from(document.querySelectorAll('.editor-tab'))
            .filter(t => t.style.display !== 'none');

          if (visibleTabs.length > 0) {
            // Activate first visible tab
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

/**
 * Show a specific section
 * @param {string} section - Section ID
 */
function showSection(section) {
  try {
    // Find content and tab
    const contentElement = document.getElementById(section + 'Content');
    const tabElement = document.getElementById(section + 'Tab');

    if (!contentElement || !tabElement) {
      console.warn(`Section '${section}' not found`);
      return;
    }

    // Hide all content
    document.querySelectorAll('.code-content').forEach(content => {
      content.classList.remove('active');
    });

    // Deactivate all tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.classList.remove('active');
    });

    // Show content and activate tab
    contentElement.classList.add('active');
    tabElement.style.display = 'flex';
    tabElement.classList.add('active');

    // Update active tab
    state.activeTab = section;

    // Save to localStorage
    try {
      localStorage.setItem('activeTab', section);

      // Make sure tab is in openTabs
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

/**
 * Activate a tab (for use from HTML attributes)
 * @param {string} filename - Filename
 * @param {string} section - Section ID
 */
function activateTab(filename, section) {
  if (section) {
    const tab = document.getElementById(section + 'Tab');
    if (tab) {
      tab.style.display = 'flex';
      showSection(section);
    }
  }
}

/**
 * Launch a feature
 * @param {string} feature - Feature to launch
 */
function launchFeature(feature) {
  console.log(`Feature requested: ${feature}`);

  // Make sure terminal is visible for features
  if (!state.terminalVisible) {
    toggleTerminalVisibility();
  }

  // Show message in terminal
  const terminal = document.querySelector('.terminal-content');
  if (terminal) {
    const output = document.createElement('div');
    output.className = 'terminal-output';
    output.innerHTML = `<span style="color: #cc7832;">${feature}</span> feature is currently unavailable.`;

    terminal.appendChild(output);
    createNewPrompt(terminal);
    terminal.scrollTop = terminal.scrollHeight;
  }
}