README Update
Barrett Taylor Portfolio Website
Overview
This is an interactive IDE-style portfolio website showcasing Barrett Taylor's skills, projects, and experience as an IT Professional and Web Developer.
Recent Updates (March 8, 2025)

Added Terminal Toggle Functionality - Users can now show/hide the terminal panel with a button in the top navigation
Added Features Dropdown Menu - Quick access to Java Terminal, Code Challenges, IDE Tools, and Project Demos
Implemented Multi-Tab Support - Users can now open multiple files simultaneously for better navigation
Enhanced Panel Resizing - Improved resize handles for terminal and project directory panels
Fixed Code Challenge Feature - Corrected syntax errors and improved error handling
Added Emergency Recovery Mode - Simplified fallback script ensures basic functionality even when errors occur

Features
Interactive Terminal
The site features a fully interactive terminal that accepts commands to navigate through the portfolio. Key commands include:

about - View profile information
skills - View technical skills
projects - Browse portfolio projects
experience - See work history
hobbies - Learn about interests
contact - View contact information
help - See all available commands

Advanced Interactive Features

java - Java terminal emulator
api - API demo interface
database - Database schema viewer
git - Git commit history viewer
build - Build pipeline visualization
demos - Live project demos
tools - Development tools showcase
challenge - Interactive coding challenges

IDE-Style Interface
The portfolio mimics popular IDEs with:

Resizable panels (directory, editor, terminal)
Tabbed file navigation with multiple open files
Syntax highlighting
Dark/light theme toggle
Terminal toggle button

Project Structure

index.html - Main HTML document
styles.css - All styling
main.js - Core application logic
emergency-main-js-fix.js - Simplified backup script
server.js - Express server for hosting
features/ - Interactive feature modules

java-terminal.js
api-demo.js
db-viewer.js
git-viewer.js
build-tools.js
project-demo.js
ide-tools.js
code-challenge.js



Technical Implementation

Express.js backend
Vanilla JavaScript frontend (no frameworks)
Responsive design
Progressive Web App features
Local storage for user preferences
Module-based architecture for features

Running the Project

Install dependencies: npm install
Start development server: npm run dev
For production: npm start

Known Issues

Development server may experience connectivity issues on some networks
Code challenge feature module may have intermittent loading issues
Some responsive design improvements needed for very small screens

Next Development Steps

Further improve the module loading system for better reliability
Enhance mobile responsiveness
Improve accessibility features
Add unit tests for core functionality

Credits
Developed by Barrett Taylor
Contact: barrett.taylor95@gmail.com
Last updated: March 8, 2025