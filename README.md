# Barrett Taylor Portfolio

A modern, interactive portfolio website with an IntelliJ IDE-style interface, showcasing Barrett Taylor's skills, projects, and professional experience as a Java fullstack web developer.

## Overview

This portfolio website features a unique IDE-inspired interface with three main resizable panels:

1. **Project Directory Panel** - Navigation for different sections
2. **Code Editor Panel** - Content displayed in markdown format
3. **Terminal Panel** - Interactive CLI for commands and contact options

## Features

### Core Features
- 🖥️ IntelliJ IDE-style interface with dark theme
- 📂 Project directory navigation for sections
- 📝 Markdown content display with syntax highlighting
- 💻 Interactive terminal with command history
- 🔄 Resizable panels for customized viewing
- 🔍 Syntax highlighting for code examples
- 🌙 Dark mode aesthetics
- 📱 Responsive design
- 🚀 Progressive Web App (PWA) capabilities
- 📧 Contact functionality through terminal commands

### Advanced Features
- ☕ Interactive Java code terminal simulation
- 🔄 Spring Boot API demonstration with mock endpoints
- 📊 Database schema visualization for projects
- 🔀 Git integration with commit history
- 📦 Build tools and CI/CD pipeline visualization
- 🖥️ Live project demos in embedded sandbox
- 🧩 IDE extensions and development tools showcase
- 🏆 Interactive coding challenges for visitors

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Express.js for serving static files
- Custom-built components (no frameworks)
- Service Worker for offline capabilities
- Font Awesome for icons
- JetBrains Mono font for authentic IDE styling
- PWA manifest for app-like experience

## Getting Started

### Prerequisites

- Node.js (v14 or later) for running the Express server

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/barretttaylor95/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Visit the website in your browser:
   ```
   http://localhost:3000
   ```

## Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS stylesheet
├── main.js             # Core JavaScript functionality
├── server.js           # Express server
├── service-worker.js   # Service worker for PWA
├── manifest.json       # PWA manifest
├── features/           # Advanced feature modules
│   ├── java-terminal.js  # Java REPL simulation
│   ├── api-demo.js       # Spring Boot API demo
│   ├── db-viewer.js      # Database visualization
│   ├── git-viewer.js     # Git integration features
│   ├── build-tools.js    # CI/CD visualization
│   ├── project-demo.js   # Live project demos
│   ├── ide-tools.js      # Development tools showcase
│   └── code-challenge.js # Interactive puzzles
├── assets/             # Static assets and data
│   ├── project-data/     # JSON data for projects
│   ├── api-schemas/      # API endpoint definitions
│   ├── db-schemas/       # Database models
│   └── code-samples/     # Sample code snippets
├── icons/              # Icons for PWA
│   ├── icon-192x192.png
│   └── icon-512x512.png
└── README.md           # Project documentation
```

## Terminal Commands

The website features an interactive terminal that supports the following commands:

### Basic Commands
- `help` - Show available commands
- `about` - View profile information
- `skills` - View technical skills
- `projects` - Browse portfolio projects
- `experience` - See work history
- `hobbies` - Learn about interests
- `contact` - View contact information
- `github` - Open GitHub profile
- `linkedin` - Open LinkedIn profile
- `email` - Send an email
- `message` - Send a message through the terminal
- `clear` - Clear the terminal

### Advanced Commands
- `java` - Enter Java REPL mode
- `api` - Launch API demo interface
- `database` - Open database schema viewer
- `git` - View Git commit history
- `build` - Show build pipeline visualization
- `demos` - Access live project demos
- `tools` - View development tools showcase
- `challenge` - Try coding challenges

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

This site can be deployed to any Node.js hosting platform:

- Heroku
- Vercel
- Netlify
- DigitalOcean
- AWS Elastic Beanstalk

## Credits

- JetBrains Mono font by JetBrains
- Font Awesome for icons
- IntelliJ IDE for design inspiration

## License

This project is licensed under the MIT License.

## Author

Barrett Taylor - [GitHub](https://github.com/barretttaylor95) | [LinkedIn](https://www.linkedin.com/in/barrett-taylor-422237182/)