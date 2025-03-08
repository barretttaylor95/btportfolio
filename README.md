# Barrett Taylor Portfolio Website

## Overview
This is an interactive IDE-style portfolio website showcasing Barrett Taylor's skills, projects, and experience as an IT Professional and Web Developer.

## Recent Updates (March 8, 2025)
- Added code challenge feature (partial implementation)
- Modified server.js for better MIME type handling
- Improved module loading approach for feature modules
- Enhanced terminal command processing
- Fixed HTML markup in feature modules

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
- `challenge` - Interactive coding challenges (in progress)

### IDE-Style Interface
The portfolio mimics popular IDEs with:
- Resizable panels (directory, editor, terminal)
- Tabbed file navigation
- Syntax highlighting
- Dark/light theme toggle

## Project Structure
- `index.html` - Main HTML document
- `styles.css` - All styling
- `main.js` - Core application logic
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
- Code challenge feature has MIME type loading issues
- Some responsive design improvements needed for very small screens
- Project demo module might need updates for new project content

## Next Development Steps
- Complete code challenge feature implementation
- Add more interactive demos
- Enhance mobile responsiveness
- Improve accessibility features
- Add unit tests for core functionality

## Credits
Developed by Barrett Taylor
Contact: barrett.taylor95@gmail.com

Last updated: March 8, 2025