# Barrett Taylor Portfolio

An interactive, IDE-inspired portfolio website showcasing my skills, projects, and professional experience as an IT professional and web developer.

## Overview

This portfolio website emulates the look and feel of a modern integrated development environment (IDE), providing an interactive and engaging way to explore my background, technical skills, and project experience. The interface features resizable panels, an interactive terminal, and code samples that demonstrate my proficiency in various programming languages.

## Latest Updates

The following enhancements have been implemented in the latest version:

### Resizable Panel System
- **Fluid Panel Resizing**: Implemented a comprehensive resizing system that allows for dynamic adjustment of all three main panels (project directory, code editor, and terminal).
- **Horizontal Directory Resizing**: Users can now adjust the width of the project directory panel using a draggable handle.
- **Vertical Terminal Resizing**: Added functionality to resize the terminal panel vertically, providing more space for command output when needed.
- **Persistent Layout Preferences**: User panel size preferences are now saved in localStorage and restored between sessions.

### HTML Structure Improvements
- **Code Validation**: Fixed numerous HTML validation issues to ensure cross-browser compatibility.
- **Proper Tag Structure**: Ensured all tags are properly nested and closed throughout the document.
- **Semantic Markup**: Enhanced the semantic structure of content sections for better accessibility.

### Interactive Terminal Enhancements
- **Dynamic Creation**: The terminal panel is now dynamically created via JavaScript for better flexibility.
- **Command History**: Added support for command history navigation using up/down arrow keys.
- **Persistent Commands**: Command history is preserved between sessions using localStorage.
- **Command Execution**: Implemented proper handling of command execution with visual feedback.

### Feature Module System
- **Module Architecture**: Restructured feature demonstrations using a modular approach with dynamic imports.
- **Error Resilience**: Added graceful fallback handling for unavailable modules.
- **Visual Integration**: Features now display properly in both the terminal and editor panels.

## Features

- **Interactive File Navigation**: Browse different sections of the portfolio through a familiar file tree structure.
- **Tabbed Interface**: View different content sections through a tabbed editor interface.
- **Syntax Highlighting**: Code samples showcase syntax highlighting for various programming languages.
- **Terminal Interface**: Interact with the portfolio using command-line style inputs.
- **Responsive Design**: The interface adapts to different screen sizes while maintaining functionality.
- **Theme Toggle**: Switch between light and dark themes according to preference.
- **Feature Demonstrations**: Access interactive demonstrations of projects and technical capabilities.

## Project Structure

- **HTML**: Clean, semantic markup that forms the foundation of the interface.
- **CSS**: Comprehensive styling that achieves the IDE look and feel.
- **JavaScript**: Dynamic functionality that powers the interactive elements.
- **Feature Modules**: Specialized JavaScript modules for advanced demonstrations.

## Usage

### Navigation

- Click on files in the project directory to open different sections in the editor.
- Use the tabs at the top of the editor to switch between open sections.
- Resize panels by dragging the handles between them.

### Terminal Commands

The following commands are available in the terminal:

- `about` - View my profile information
- `skills` - View my technical skills
- `projects` - Browse my portfolio projects
- `experience` - See my work history
- `hobbies` - Learn about my interests
- `contact` - View my contact information
- `message` - Send me a message
- `clear` - Clear the terminal

### Advanced Features

The following advanced features can be accessed through the terminal:

- `java` - Enter Java REPL mode
- `api` - Launch API demo interface
- `database` - Open database schema viewer
- `git` - View Git commit history
- `build` - Show build pipeline visualization
- `demos` - Access live project demos
- `tools` - View development tools showcase
- `challenge` - Try coding challenges

## Technical Implementation

### Resize System

The resize functionality works through a combination of:
- DOM elements with special resize-handle classes
- JavaScript event listeners for mouse interactions
- CSS positioning and transitions for smooth visual feedback
- Storage APIs for persisting user preferences

### Terminal Creation

The terminal is dynamically created using JavaScript, which:
- Constructs the necessary DOM elements
- Sets up event listeners for user interaction
- Handles command processing and output
- Manages the interactive prompt system

### Feature Module Loading

Features are loaded using dynamic imports with:
- Asynchronous module loading to prevent blocking
- Error handling for graceful degradation
- Modular architecture to isolate functionality
- Shared interfaces for consistent user experience

## Browser Compatibility

This portfolio has been tested and optimized for:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contact

Feel free to reach out through any of these channels:

- Email: barrett.taylor95@gmail.com
- GitHub: github.com/barretttaylor95
- LinkedIn: linkedin.com/in/barrett-taylor-422237182

## Acknowledgments

Special thanks to the open source community for inspiration and resources that helped make this interactive portfolio possible.