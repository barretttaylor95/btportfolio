# Barrett Taylor Portfolio Website

## Overview
This is an interactive IDE-style portfolio website showcasing Barrett Taylor's skills, projects, and experience as an IT Professional and Web Developer.

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

```
/
├── index.html           # Main HTML document
├── styles.css           # All styling
├── main.js              # Consolidated JavaScript
├── server.js            # Express server for hosting
├── manifest.json        # Progressive Web App manifest
├── service-worker.js    # Service worker for offline support
└── features/            # Interactive feature modules
    ├── java-terminal.js
    ├── api-demo.js
    ├── db-viewer.js
    ├── git-viewer.js
    ├── build-tools.js
    ├── project-demo.js
    ├── ide-tools.js
    └── code-challenge.js
```

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

## Recent Updates
- **Consolidated JavaScript Files**: Combined multiple JS files into a single main.js for better maintainability
- **Added Terminal Toggle Button**: Users can now show/hide the terminal panel with a button in the top navigation
- **Improved UI Responsiveness**: Enhanced resize handles for terminal and project directory panels
- **Enhanced Error Handling**: Better error recovery for feature module loading

## Browser Compatibility
- Chrome/Edge (latest versions) - Full support
- Firefox (latest version) - Full support
- Safari (latest version) - Full support
- Mobile browsers - Basic support with some limitations on interactive features

## Credits
Developed by Barrett Taylor
Contact: barrett.taylor95@gmail.com
Last updated: March 2025