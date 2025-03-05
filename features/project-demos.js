/**
 * Project Demo Module
 *
 * Provides an interactive project demonstration experience showcasing
 * Barrett Taylor's software development projects with live demos and
 * technology stack visualization.
 */

// Track if project demo mode is active
let projectDemoActive = false;

// Project data structure for demos
const projectData = [
    {
        id: 'petpals',
        name: 'PetPals',
        type: 'Web Application',
        description: 'Full-stack pet health management application developed as a capstone project.',
        features: [
            'Pet health record management',
            'Interactive symptom tracking',
            'Medication scheduling & reminders',
            'Veterinary appointment management',
            'Offline-capable Progressive Web App'
        ],
        techStack: {
            frontend: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Bulma CSS'],
            backend: ['Java', 'Spring Boot', 'RESTful API'],
            database: ['MySQL', 'Hibernate ORM'],
            devOps: ['Git', 'GitHub Actions', 'Heroku']
        },
        screenshots: [
            {
                url: '/assets/project-data/petpals/dashboard.png',
                caption: 'Pet Dashboard View'
            },
            {
                url: '/assets/project-data/petpals/health-record.png',
                caption: 'Health Records Management'
            },
            {
                url: '/assets/project-data/petpals/medication.png',
                caption: 'Medication Scheduling Interface'
            }
        ],
        demoLink: 'https://petpals-demo.herokuapp.com',
        githubLink: 'https://github.com/barretttaylor95/petpals',
        videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ',
        demoComponents: [
            {
                name: 'Pet Health Chart',
                description: 'Visualizes pet health metrics over time',
                component: '<div id="petHealthChart"></div>'
            },
            {
                name: 'Medication Calendar',
                description: 'Interactive medication scheduling tool',
                component: '<div id="medicationCalendar"></div>'
            }
        ]
    },
    {
        id: 'church-website',
        name: 'Church Website Template',
        type: 'Website Template',
        description: 'Modern, responsive website template designed for local churches with easy content management.',
        features: [
            'Responsive mobile-first design',
            'Modern aesthetic with customizable colors',
            'Sermon archives with audio player',
            'Events calendar with registration',
            'Integrated donation system',
            'Contact form with Google Maps',
            'Photo gallery with lightbox',
            'SEO-optimized structure'
        ],
        techStack: {
            frontend: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
            backend: ['Node.js', 'Express'],
            database: ['MongoDB'],
            devOps: ['Git', 'Netlify']
        },
        screenshots: [
            {
                url: '/assets/project-data/church-website/home.png',
                caption: 'Homepage Design'
            },
            {
                url: '/assets/project-data/church-website/sermons.png',
                caption: 'Sermon Archives Page'
            },
            {
                url: '/assets/project-data/church-website/events.png',
                caption: 'Events Calendar'
            }
        ],
        demoLink: 'https://church-template-demo.netlify.app',
        githubLink: 'https://github.com/barretttaylor95/church-website-template',
        videoUrl: null,
        demoComponents: [
            {
                name: 'Sermon Player',
                description: 'Audio player with sermon details',
                component: '<div id="sermonPlayer"></div>'
            },
            {
                name: 'Events Calendar',
                description: 'Interactive calendar of upcoming events',
                component: '<div id="eventsCalendar"></div>'
            }
        ]
    },
    {
        id: 'it-docs',
        name: 'IT Documentation System',
        type: 'Documentation Framework',
        description: 'Standardized technical documentation framework to streamline training and support procedures.',
        features: [
            'Standardized documentation templates',
            'Version control integration',
            'Searchable knowledge base',
            'Role-based access control',
            'Interactive troubleshooting guides',
            'Support ticket integration',
            'Asset management tracking'
        ],
        techStack: {
            frontend: ['React', 'TypeScript', 'Material UI'],
            backend: ['Node.js', 'Express', 'GraphQL'],
            database: ['PostgreSQL'],
            devOps: ['Docker', 'AWS', 'CI/CD Pipeline']
        },
        screenshots: [
            {
                url: '/assets/project-data/it-docs/dashboard.png',
                caption: 'Documentation Dashboard'
            },
            {
                url: '/assets/project-data/it-docs/template.png',
                caption: 'Documentation Template Editor'
            },
            {
                url: '/assets/project-data/it-docs/knowledge-base.png',
                caption: 'Searchable Knowledge Base'
            }
        ],
        demoLink: 'https://it-docs-demo.herokuapp.com',
        githubLink: 'https://github.com/barretttaylor95/it-documentation-system',
        videoUrl: null,
        demoComponents: [
            {
                name: 'Documentation Search',
                description: 'Full-text search capabilities',
                component: '<div id="docSearch"></div>'
            },
            {
                name: 'Asset Tracker',
                description: 'IT asset management visualization',
                component: '<div id="assetTracker"></div>'
            }
        ]
    }
];

/**
 * Initialize the Project Demo Mode
 * @param {Object} terminal - The terminal DOM element
 * @param {Object} editorArea - The editor area DOM element
 */
function initProjectDemo(terminal, editorArea) {
    projectDemoActive = true;

    // Display welcome message in terminal
    const welcomeOutput = document.createElement('div');
    welcomeOutput.className = 'terminal-output';
    welcomeOutput.innerHTML = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Project Demo Explorer</div>
        <div>This interactive module allows you to explore Barrett's software development projects.</div>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">list</span>: Show all available projects</div>
        <div>- <span style="color: #cc7832">show {projectId}</span>: View detailed information about a project</div>
        <div>- <span style="color: #cc7832">demo {projectId}</span>: Launch interactive demo of a project</div>
        <div>- <span style="color: #cc7832">stack {projectId}</span>: Visualize the technology stack of a project</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit project demo mode</div>
        <div style="margin-top: 10px; color: #808080;">Type 'list' to see available projects</div>
    `;

    // Update prompt style for project demo mode
    updateProjectDemoPrompt(terminal);

    // Insert welcome message before the prompt
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(welcomeOutput, lastPrompt);

    // Create project demo tab in editor area if it doesn't exist
    createProjectDemoTab(editorArea);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Update the terminal prompt to project demo style
 * @param {Object} terminal - The terminal DOM element
 */
function updateProjectDemoPrompt(terminal) {
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        // Change prompt style for project demo mode
        const userSpan = lastPrompt.querySelector('.terminal-user');
        if (userSpan) userSpan.textContent = 'demos';

        const machineSpan = lastPrompt.querySelector('.terminal-machine');
        if (machineSpan) machineSpan.textContent = 'portfolio';

        const directorySpan = lastPrompt.querySelector('.terminal-directory');
        if (directorySpan) directorySpan.textContent = 'projects';

        const symbolSpan = lastPrompt.querySelector('.terminal-symbol');
        if (symbolSpan) symbolSpan.textContent = '>';
    }
}

/**
 * Create project demo tab in editor area
 * @param {Object} editorArea - The editor area DOM element
 */
function createProjectDemoTab(editorArea) {
    // Check if tab already exists
    if (document.getElementById('projectDemoTab')) {
        // Just activate it
        activateProjectDemoTab();
        return;
    }

    // Create new tab
    const tabsContainer = editorArea.querySelector('.editor-tabs');
    const projectDemoTab = document.createElement('div');
    projectDemoTab.className = 'editor-tab';
    projectDemoTab.id = 'projectDemoTab';
    projectDemoTab.innerHTML = `
        <i class="fas fa-rocket"></i>
        <span class="tab-title">project-demo.jsx</span>
        <i class="fas fa-times close-tab"></i>
    `;

    // Create content
    const contentContainer = editorArea.querySelector('.editor-content');
    const projectDemoContent = document.createElement('div');
    projectDemoContent.className = 'code-content markdown-content project-demo-code';
    projectDemoContent.id = 'projectDemoContent';
    projectDemoContent.innerHTML = `
        <div class="markdown-container">
            <h1>Project Demonstrations</h1>
            <p>Explore interactive demonstrations of Barrett Taylor's software development projects.</p>

            <div id="projectDemoDetails">
                <h2>Available Projects</h2>
                <p>Use terminal commands to explore and interact with project demos:</p>
                <ul>
                    <li>Type <code>list</code> to see all available projects</li>
                    <li>Type <code>show {projectId}</code> to view details for a specific project</li>
                    <li>Type <code>demo {projectId}</code> to launch an interactive demo</li>
                    <li>Type <code>stack {projectId}</code> to visualize the technology stack</li>
                </ul>
            </div>
        </div>
    `;

    // Add tab and content to DOM
    tabsContainer.appendChild(projectDemoTab);
    contentContainer.appendChild(projectDemoContent);

    // Add event listener to tab
    projectDemoTab.addEventListener('click', activateProjectDemoTab);

    // Add event listener to close button
    const closeBtn = projectDemoTab.querySelector('.close-tab');
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        projectDemoTab.style.display = 'none';
        if (projectDemoTab.classList.contains('active')) {
            // Show about tab if project demo tab is closed
            const aboutTab = document.getElementById('aboutTab');
            if (aboutTab) {
                aboutTab.click();
            }
        }
    });

    // Activate the tab
    activateProjectDemoTab();
}

/**
 * Activate the project demo tab
 */
function activateProjectDemoTab() {
    // Deactivate all tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all content
    document.querySelectorAll('.code-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activate project demo tab and content
    const projectDemoTab = document.getElementById('projectDemoTab');
    const projectDemoContent = document.getElementById('projectDemoContent');

    if (projectDemoTab && projectDemoContent) {
        projectDemoTab.classList.add('active');
        projectDemoTab.style.display = 'flex';
        projectDemoContent.classList.add('active');
    }
}

/**
 * Process project demo commands
 * @param {string} command - Command to process
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 * @returns {boolean} - Whether to continue in project demo mode
 */
function processProjectDemoCommand(command, terminal, editorArea) {
    const cmd = command.trim().toLowerCase();

    // Check for exit command
    if (cmd === 'exit') {
        const exitMsg = document.createElement('div');
        exitMsg.className = 'terminal-output';
        exitMsg.textContent = 'Exiting project demo mode...';

        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        terminal.insertBefore(exitMsg, lastPrompt);

        // Reset terminal style
        projectDemoActive = false;
        return false;
    }

    // Handle list command
    if (cmd === 'list') {
        showProjectList(terminal, editorArea);
        return true;
    }

    // Handle show command
    if (cmd.startsWith('show ')) {
        const projectId = cmd.substring(5).trim();
        showProjectDetails(projectId, terminal, editorArea);
        return true;
    }

    // Handle demo command
    if (cmd.startsWith('demo ')) {
        const projectId = cmd.substring(5).trim();
        launchProjectDemo(projectId, terminal, editorArea);
        return true;
    }

    // Handle stack command
    if (cmd.startsWith('stack ')) {
        const projectId = cmd.substring(6).trim();
        showTechStack(projectId, terminal, editorArea);
        return true;
    }

    // Handle unknown command
    const unknownMsg = document.createElement('div');
    unknownMsg.className = 'terminal-output';
    unknownMsg.innerHTML = `
        <span style="color: #cc0000;">Unknown command: ${command}</span>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">list</span>: Show all available projects</div>
        <div>- <span style="color: #cc7832">show {projectId}</span>: View detailed information about a project</div>
        <div>- <span style="color: #cc7832">demo {projectId}</span>: Launch interactive demo of a project</div>
        <div>- <span style="color: #cc7832">stack {projectId}</span>: Visualize the technology stack of a project</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit project demo mode</div>
    `;

    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(unknownMsg, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;

    return true;
}

/**
 * Show the list of available projects
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showProjectList(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build project list HTML
    let projectsHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Available Projects</div>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">ID</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Name</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Type</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Features</th>
            </tr>
    `;

    // Add each project to the table
    projectData.forEach(project => {
        projectsHtml += `
            <tr>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${project.id}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;"><strong>${project.name}</strong></td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${project.type}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${project.features.length} features</td>
            </tr>
        `;
    });

    projectsHtml += `</table>
        <div style="margin-top: 10px;">Type <code>show {projectId}</code> to view details for a specific project</div>
    `;

    // Set output HTML
    output.innerHTML = projectsHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update project demo tab content
    updateProjectDemoContent(`
        <h1>Project Demonstrations</h1>
        <p>Below is a list of Barrett Taylor's software development projects.</p>

        <div class="projects-grid">
            ${projectData.map(project => `
                <div class="demo-container">
                    <h2>${project.name}</h2>
                    <p><em>${project.type}</em></p>
                    <p>${project.description}</p>
                    <div style="margin-top: 15px;">
                        <a href="#" onclick="window.terminalProcessCommand('show ${project.id}'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">View Details</a>
                        <a href="#" onclick="window.terminalProcessCommand('demo ${project.id}'); return false;" style="padding: 8px 16px; background-color: #6a8759; color: white; text-decoration: none; border-radius: 4px;">Launch Demo</a>
                    </div>
                </div>
            `).join('')}
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show details of a specific project
 * @param {string} projectId - ID of the project to show
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showProjectDetails(projectId, terminal, editorArea) {
    // Find project by ID
    const project = projectData.find(p => p.id.toLowerCase() === projectId.toLowerCase());

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!project) {
        // Project not found
        output.innerHTML = `<span style="color: #cc0000;">Project '${projectId}' not found. Type 'list' to see available projects.</span>`;
    } else {
        // Build project details HTML
        let detailsHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">${project.name}</div>
            <div><strong>Type:</strong> ${project.type}</div>
            <div style="margin: 5px 0 10px 0;">${project.description}</div>

            <div style="margin-top: 10px;"><strong>Key Features:</strong></div>
            <ul style="margin: 5px 0 10px 20px; padding: 0;">
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>

            <div style="margin-top: 10px;"><strong>Tech Stack:</strong></div>
            <div style="margin: 5px 0 5px 10px;"><span style="color: #cc7832;">Frontend:</span> ${project.techStack.frontend.join(', ')}</div>
            <div style="margin: 5px 0 5px 10px;"><span style="color: #cc7832;">Backend:</span> ${project.techStack.backend.join(', ')}</div>
            <div style="margin: 5px 0 5px 10px;"><span style="color: #cc7832;">Database:</span> ${project.techStack.database.join(', ')}</div>
            <div style="margin: 5px 0 5px 10px;"><span style="color: #cc7832;">DevOps:</span> ${project.techStack.devOps.join(', ')}</div>

            <div style="margin-top: 10px;">
                <div>Type <code>demo ${project.id}</code> to launch an interactive demo</div>
                <div>Type <code>stack ${project.id}</code> to visualize the technology stack</div>
            </div>
        `;

        // Set output HTML
        output.innerHTML = detailsHtml;

        // Update project demo tab with project details
        updateProjectDemoContent(`
            <h1>${project.name}</h1>
            <p><em>${project.type}</em></p>
            <p>${project.description}</p>

            <div style="display: flex; justify-content: space-between; margin: 20px 0;">
                <a href="#" onclick="window.terminalProcessCommand('demo ${project.id}'); return false;" style="padding: 8px 16px; background-color: #6a8759; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">Launch Demo</a>
                <a href="#" onclick="window.terminalProcessCommand('stack ${project.id}'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">View Tech Stack</a>
                ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" style="padding: 8px 16px; background-color: #333; color: white; text-decoration: none; border-radius: 4px;"><i class="fab fa-github"></i> GitHub Repo</a>` : ''}
            </div>

            <h2>Key Features</h2>
            <ul>
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>

            <h2>Screenshots</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0;">
                ${project.screenshots.map(screenshot => `
                    <div style="flex: 1; min-width: 300px; max-width: 400px; background-color: #2b2b2b; border-radius: 5px; padding: 10px;">
                        <div style="text-align: center; padding: 10px; background-color: #3c3f41; border-radius: 5px;">
                            <img src="${screenshot.url}" alt="${screenshot.caption}" style="max-width: 100%; height: auto; border-radius: 3px;" />
                        </div>
                        <p style="text-align: center; margin-top: 10px;">${screenshot.caption}</p>
                    </div>
                `).join('')}
            </div>

            ${project.videoUrl ? `
                <h2>Demo Video</h2>
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0;">
                    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="${project.videoUrl}" frameborder="0" allowfullscreen></iframe>
                </div>
            ` : ''}

            <h2>Technology Stack</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Category</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Technologies</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><strong>Frontend</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${project.techStack.frontend.map(tech => `<span style="display: inline-block; background-color: #2b2b2b; padding: 3px 8px; margin: 2px; border-radius: 3px;">${tech}</span>`).join(' ')}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><strong>Backend</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${project.techStack.backend.map(tech => `<span style="display: inline-block; background-color: #2b2b2b; padding: 3px 8px; margin: 2px; border-radius: 3px;">${tech}</span>`).join(' ')}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><strong>Database</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${project.techStack.database.map(tech => `<span style="display: inline-block; background-color: #2b2b2b; padding: 3px 8px; margin: 2px; border-radius: 3px;">${tech}</span>`).join(' ')}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><strong>DevOps</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${project.techStack.devOps.map(tech => `<span style="display: inline-block; background-color: #2b2b2b; padding: 3px 8px; margin: 2px; border-radius: 3px;">${tech}</span>`).join(' ')}</td>
                </tr>
            </table>
        `);
    }

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Launch interactive demo of a project
 * @param {string} projectId - ID of the project to demo
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function launchProjectDemo(projectId, terminal, editorArea) {
    // Find project by ID
    const project = projectData.find(p => p.id.toLowerCase() === projectId.toLowerCase());

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!project) {
        // Project not found
        output.innerHTML = `<span style="color: #cc0000;">Project '${projectId}' not found. Type 'list' to see available projects.</span>`;
    } else {
        // Build demo launch HTML
        let demoHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Launching Demo: ${project.name}</div>
            <div>Initializing interactive demonstration components...</div>

            <div style="margin: 10px 0;">
                <span style="display: inline-block; animation: blink 1s infinite;"><i class="fas fa-circle-notch fa-spin"></i></span>
                <span>Loading resources...</span>
            </div>
        `;

        // Set output HTML
        output.innerHTML = demoHtml;

        // Add output to terminal
        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        terminal.insertBefore(output, lastPrompt);

        // Simulate demo loading delay
        setTimeout(() => {
            // Add completion message
            const completionMessage = document.createElement('div');
            completionMessage.className = 'terminal-output';
            completionMessage.innerHTML = `
                <div style="color: #6a8759;">Demo components loaded successfully.</div>
                <div>Interactive demo is now available in the editor panel.</div>
                <div style="margin-top: 10px;">Use the editor panel to interact with the demo components.</div>
            `;

            terminal.insertBefore(completionMessage, lastPrompt);

            // Update project demo tab with interactive demo content
            updateProjectDemoContent(`
                <h1>${project.name} - Interactive Demo</h1>
                <p>Explore the functionality and features of ${project.name} through this interactive demonstration.</p>

                ${project.demoLink ? `
                    <div style="margin: 20px 0; text-align: center;">
                        <a href="${project.demoLink}" target="_blank" style="padding: 12px 24px; background-color: #6a8759; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                            <i class="fas fa-external-link-alt"></i> Open Full Demo
                        </a>
                    </div>
                ` : ''}

                <div class="demo-container">
                    <h2>Demo Components</h2>
                    <p>Below are interactive components from the ${project.name} project:</p>

                    <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px;">
                        ${project.demoComponents.map(component => `
                            <div style="flex: 1; min-width: 300px; background-color: #2b2b2b; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
                                <h3>${component.name}</h3>
                                <p>${component.description}</p>
                                <div style="margin-top: 15px; padding: 10px; background-color: #3c3f41; border-radius: 5px; min-height: 200px; display: flex; align-items: center; justify-content: center;">
                                    ${component.component}
                                    <span style="color: #808080;">Demo component placeholder</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div style="margin: 30px 0; text-align: center;">
                    <a href="#" onclick="window.terminalProcessCommand('show ${project.id}'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                        <i class="fas fa-info-circle"></i> Project Details
                    </a>
                    <a href="#" onclick="window.terminalProcessCommand('stack ${project.id}'); return false;" style="padding: 8px 16px; background-color: #9876aa; color: white; text-decoration: none; border-radius: 4px;">
                        <i class="fas fa-layer-group"></i> View Tech Stack
                    </a>
                </div>
            `);

            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
        }, 1500); // 1.5 second delay
    }

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show technology stack visualization for a project
 * @param {string} projectId - ID of the project to visualize
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showTechStack(projectId, terminal, editorArea) {
    // Find project by ID
    const project = projectData.find(p => p.id.toLowerCase() === projectId.toLowerCase());

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!project) {
        // Project not found
        output.innerHTML = `<span style="color: #cc0000;">Project '${projectId}' not found. Type 'list' to see available projects.</span>`;
    } else {
        // Build tech stack visualization (simplified ASCII for terminal)
        let stackHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">${project.name} - Technology Stack</div>
            <pre style="margin: 10px 0; font-family: monospace;">
┌───────────────────────────────────────────────────────┐
│                  APPLICATION LAYERS                   │
├───────────────┬───────────────┬───────────────┬───────┘
│   FRONTEND    │    BACKEND    │   DATABASE    │  DEVOPS
├───────────────┼───────────────┼───────────────┼───────┐
${project.techStack.frontend.map(t => `│ • ${t.padEnd(12)}`).join('')} ${project.techStack.backend.map(t => `│ • ${t.padEnd(12)}`).join('')} ${project.techStack.database.map(t => `│ • ${t.padEnd(12)}`).join('')} ${project.techStack.devOps.map(t => `│ • ${t.padEnd(12)}`).join('')} │
└───────────────┴───────────────┴───────────────┴───────┘
            </pre>
            <div style="margin-top: 10px;">Technology stack visualization created in editor panel.</div>
        `;

        // Set output HTML
        output.innerHTML = stackHtml;

        // Update project demo tab with tech stack visualization
        updateProjectDemoContent(`
            <h1>${project.name} - Technology Stack</h1>
            <p>Visual representation of the technology stack used in the ${project.name} project.</p>

            <div style="margin: 30px auto; max-width: 800px;">
                <!-- Architecture Diagram -->
                <div style="background-color: #2b2b2b; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
                    <h2 style="text-align: center; margin-bottom: 20px;">Application Architecture</h2>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <!-- Frontend Layer -->
                        <div style="background-color: #214283; color: white; padding: 15px; border-radius: 5px;">
                            <h3 style="margin: 0 0 10px 0; text-align: center;">Frontend</h3>
                            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                                ${project.techStack.frontend.map(tech => `
                                    <div style="background-color: rgba(255,255,255,0.1); padding: 8px 15px; border-radius: 20px;">
                                        ${tech}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <!-- API Layer -->
                        <div style="display: flex; justify-content: center;">
                            <div style="width: 40px; height: 30px; border-left: 2px dashed #6a8759; border-right: 2px dashed #6a8759;"></div>
                        </div>
                        <!-- Backend Layer -->
                        <div style="background-color: #6a8759; color: white; padding: 15px; border-radius: 5px;">
                            <h3 style="margin: 0 0 10px 0; text-align: center;">Backend</h3>
                            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                                ${project.techStack.backend.map(tech => `
                                    <div style="background-color: rgba(255,255,255,0.1); padding: 8px 15px; border-radius: 20px;">
                                        ${tech}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <!-- Data Access Layer -->
                        <div style="display: flex; justify-content: center;">
                            <div style="width: 40px; height: 30px; border-left: 2px dashed #cc7832; border-right: 2px dashed #cc7832;"></div>
                        </div>
                        <!-- Database Layer -->
                        <div style="background-color: #cc7832; color: white; padding: 15px; border-radius: 5px;">
                            <h3 style="margin: 0 0 10px 0; text-align: center;">Database</h3>
                            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                                ${project.techStack.database.map(tech => `
                                    <div style="background-color: rgba(255,255,255,0.1); padding: 8px 15px; border-radius: 20px;">
                                        ${tech}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- DevOps Pipeline -->
                <div style="background-color: #2b2b2b; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
                    <h2 style="text-align: center; margin-bottom: 20px;">DevOps Pipeline</h2>
                    <div style="display: flex; flex-wrap: wrap; justify-content: space-around; gap: 5px; margin-top: 20px;">
                        <!-- Pipeline Stages -->
                        <div class="pipeline-stage">Source Control</div>
                        <div style="display: flex; align-items: center;">→</div>
                        <div class="pipeline-stage">Build</div>
                        <div style="display: flex; align-items: center;">→</div>
                        <div class="pipeline-stage">Test</div>
                        <div style="display: flex; align-items: center;">→</div>
                        <div class="pipeline-stage">Deploy</div>
                        <div style="display: flex; align-items: center;">→</div>
                        <div class="pipeline-stage">Monitor</div>
                    </div>
                    <div style="margin-top: 20px; text-align: center;">
                        <h3 style="margin-bottom: 15px;">Tools & Technologies</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                            ${project.techStack.devOps.map(tech => `
                                <div style="background-color: #3c3f41; padding: 8px 15px; border-radius: 5px;">
                                    ${tech}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div style="margin: 30px 0; text-align: center;">
                <a href="#" onclick="window.terminalProcessCommand('show ${project.id}'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                    <i class="fas fa-info-circle"></i> Project Details
                </a>
                <a href="#" onclick="window.terminalProcessCommand('demo ${project.id}'); return false;" style="padding: 8px 16px; background-color: #6a8759; color: white; text-decoration: none; border-radius: 4px;">
                    <i class="fas fa-play-circle"></i> Launch Demo
                </a>
            </div>
        `);
    }

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Update project demo tab content
 * @param {string} html - HTML content to update
 */
function updateProjectDemoContent(html) {
    const projectDemoDetails = document.getElementById('projectDemoDetails');
    if (projectDemoDetails) {
        projectDemoDetails.innerHTML = html;
    }
}

/**
 * Enable the window object to process terminal commands
 * This allows links in the editor to trigger terminal commands
 */
function setupTerminalCommandHandler() {
    // Make sure we don't define it twice
    if (!window.terminalProcessCommand) {
        window.terminalProcessCommand = function(command) {
            const terminal = document.querySelector('.terminal-content');
            if (!terminal) return;

            // Find the input element
            const inputElement = terminal.querySelector('.terminal-prompt:last-child .terminal-input');
            if (!inputElement) return;

            // Set the command text
            inputElement.textContent = command;

            // Create and dispatch an Enter key event
            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });

            inputElement.dispatchEvent(event);
        };
    }
}

/**
 * Exported methods to interface with the main terminal system
 */
export default {
    /**
     * Start project demo mode
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     */
    start: function(terminal, editorArea) {
        setupTerminalCommandHandler();
        initProjectDemo(terminal, editorArea);
    },

    /**
     * Process project demo input
     * @param {string} command - The entered command
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     * @returns {boolean} - Whether to stay in project demo mode
     */
    processInput: function(command, terminal, editorArea) {
        return processProjectDemoCommand(command, terminal, editorArea);
    },

    /**
     * Check if project demo mode is active
     * @returns {boolean} - Project demo mode status
     */
    isActive: function() {
        return projectDemoActive;
    }
};