# Handover Document: Barrett Taylor Portfolio Website Update

## Project Overview
This document outlines the recent updates and improvements made to Barrett Taylor's IDE-style portfolio website. The project aims to provide an authentic IDE experience while showcasing Barrett's skills and projects.

## Recent Updates (March 8, 2025)

### UI/UX Enhancements
1. **Terminal Toggle Button**
  - Added a toggle button in the top navigation area to show/hide the terminal panel
  - Improves readability when users want to focus on content without terminal distraction
  - Preserves terminal state between page refreshes via localStorage

2. **Features Dropdown Menu**
  - Added a dropdown menu for quick access to interactive features
  - Provides shortcuts to Java Terminal, Code Challenges, IDE Tools, and Project Demos
  - Makes features more discoverable than just through terminal commands

3. **Multi-Tab Functionality**
  - Implemented true multi-tab support for opening multiple files simultaneously
  - Files remain open until explicitly closed via the 'x' button
  - Remembers open tabs between sessions via localStorage

4. **Panel Resizing**
  - Enhanced the resizing functionality for both the terminal panel and project directory
  - Added visible resize handles for better usability
  - Preserves panel sizes between sessions

### Technical Improvements
1. **Error Handling**
  - Added robust error handling for localStorage operations
  - Improved module loading to handle missing or broken feature modules
  - Added graceful degradation for features that fail to load

2. **Global Function Management**
  - Restructured global function declarations to prevent reference errors
  - Ensured HTML onclick attributes can access necessary functions
  - Fixed timing issues with function availability

## Known Issues and Workarounds

1. **Server Connectivity Issues**
  - The development server (npm run dev) may experience connection issues
  - This might be related to port conflicts or networking settings
  - Workaround: Try using a different port or check firewall settings

2. **Feature Module Loading**
  - Some feature modules may fail to load correctly
  - Emergency mode provides basic functionality even when modules fail
  - For persistent issues, check browser console for specific errors

3. **Code-Challenge.js Syntax Errors**
  - The code-challenge.js file had syntax errors that were fixed but may recur
  - If necessary, revert to using the emergency-main-js-fix.js for baseline functionality
  - Avoid using ES module export syntax as it conflicts with direct script loading

## Implementation Notes

### Critical Files
- **main.js** - Core application logic and UI initialization
- **emergency-main-js-fix.js** - Simplified version for recovery if main.js fails
- **features/*.js** - Feature modules for special functionality
- **index.html** - Main HTML structure and script loading

### Key DOM Elements
- **#projectDirectory** - Left panel for file navigation
- **#editorArea** - Center panel for content viewing
- **#terminalPanel** - Bottom panel for command input
- **#directoryResizeHandle** - Handle for resizing project directory
- **#terminalResizeHandle** - Handle for resizing terminal panel

### Global Variables and Functions
The following global variables and functions must be maintained for proper functionality:
- **window.activateTab** - Used by file tree click handlers
- **window.toggleFolder** - Used by folder expansion click handlers
- **window.terminalProcessCommand** - Used by terminal command execution
- **terminalVisible** - Tracks terminal visibility state
- **directoryWidth** - Stores project directory width
- **terminalHeight** - Stores terminal panel height

## Recommendations for Future Development

1. **Module Loading System**
  - Implement a more robust module loading system
  - Consider using a proper bundler like Webpack or Rollup
  - Create a registry for feature modules to improve discoverability

2. **UI Component Framework**
  - Consider migrating to a lightweight UI framework for components
  - This would improve maintainability while keeping the codebase small

3. **Feature Isolation**
  - Strengthen the isolation between features to prevent cross-feature issues
  - Implement a proper pub/sub system for communication between components

4. **Responsive Design**
  - Enhance mobile support for better experience on small screens
  - Implement collapsible panels for narrow viewports

---

# README Update

# Barrett Taylor Portfolio Website

## Overview
This is an interactive IDE-style portfolio website showcasing Barrett Taylor's skills, projects, and experience as an IT Professional and Web Developer.

## Recent Updates (March 8, 2025)
- **Added Terminal Toggle Functionality** - Users can now show/hide the terminal panel with a button in the top navigation
- **Added Features Dropdown Menu** - Quick access to Java Terminal, Code Challenges, IDE Tools, and Project Demos
- **Implemented Multi-Tab Support** - Users can now open multiple files simultaneously for better navigation
- **Enhanced Panel Resizing** - Improved resize handles for terminal and project directory panels
- **Fixed Code Challenge Feature** - Corrected syntax errors and improved error handling
- **Added Emergency Recovery Mode** - Simplified fallback script ensures basic functionality even when errors occur

## Features

### Interactive Terminal
The site features a fully interactive terminal that accepts commands to navigate through the portfolio. Key commands include:
- `about` - View profile information
- `skills` - View technical skills
- `projects` - Browse portfolio projects
- `experience` - See work history
- `hobbies` - Learn about interests
- `contact` - View contact information
- `help` - See all available commands

### Advanced Interactive Features
- `java` - Java terminal emulator
- `api` - API demo interface
- `database` - Database schema viewer
- `git` - Git commit history viewer
- `build` - Build pipeline visualization
- `demos` - Live project demos
- `tools` - Development tools showcase
- `challenge` - Interactive coding challenges

### IDE-Style Interface
The portfolio mimics popular IDEs with:
- Resizable panels (directory, editor, terminal)
- Tabbed file navigation with multiple open files
- Syntax highlighting
- Dark/light theme toggle
- Terminal toggle button

## Project Structure
- `index.html` - Main HTML document
- `styles.css` - All styling
- `main.js` - Core application logic
- `emergency-main-js-fix.js` - Simplified backup script
- `server.js` - Express server for hosting
- `features/` - Interactive feature modules
  - `java-terminal.js`
  - `api-demo.js`
  - `db-viewer.js`
  - `git-viewer.js`
  - `build-tools.js`
  - `project-demo.js`
  - `ide-tools.js`
  - `code-challenge.js`

## Technical Implementation
- Express.js backend
- Vanilla JavaScript frontend (no frameworks)
- Responsive design
- Progressive Web App features
- Local storage for user preferences
- Module-based architecture for features

## Running the Project
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. For production: `npm start`

## Known Issues
- Development server may experience connectivity issues on some networks
- Code challenge feature module may have intermittent loading issues
- Some responsive design improvements needed for very small screens

## Next Development Steps
- Further improve the module loading system for better reliability
- Enhance mobile responsiveness
- Improve accessibility features
- Add unit tests for core functionality

## Credits
Developed by Barrett Taylor
Contact: barrett.taylor95@gmail.com

Last updated: March 8, 2025