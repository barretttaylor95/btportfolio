/**
 * IDE Tools Showcase Module
 *
 * Provides an interactive demonstration of development tools, IDE extensions,
 * and productivity features used in Barrett Taylor's development workflow.
 */

// Track if IDE tools mode is active
let ideToolsActive = false;

// IDE extensions and tools data
const ideTools = [
    {
        id: 'version-control',
        category: 'Version Control',
        name: 'Git Integration',
        description: 'Seamless Git integration with commit, push, and branch management directly from the IDE.',
        icon: 'code-branch',
        features: [
            'Inline blame annotations',
            'Commit history visualization',
            'Branch management',
            'Merge conflict resolution',
            'Pull request integration'
        ],
        demo: {
            type: 'animation',
            content: 'git-integration-demo'
        },
        productivity: 4.8
    },
    {
        id: 'code-quality',
        category: 'Code Quality',
        name: 'SonarLint',
        description: 'Real-time code quality and security analysis with automatic issue detection.',
        icon: 'shield-alt',
        features: [
            'Code smell detection',
            'Bug identification',
            'Security vulnerability scanning',
            'Code quality metrics',
            'Clean code suggestions'
        ],
        demo: {
            type: 'image',
            content: 'sonarlint-preview.png'
        },
        productivity: 4.6
    },
    {
        id: 'debugging',
        category: 'Debugging',
        name: 'Debugger',
        description: 'Comprehensive debugging tools with variable inspection, breakpoints, and step execution.',
        icon: 'bug',
        features: [
            'Conditional breakpoints',
            'Watch expressions',
            'Call stack navigation',
            'Variable inspection',
            'Expression evaluation'
        ],
        demo: {
            type: 'animation',
            content: 'debugger-demo'
        },
        productivity: 4.9
    },
    {
        id: 'code-completion',
        category: 'Productivity',
        name: 'IntelliSense',
        description: 'AI-powered code completion and suggestions that understand code context and patterns.',
        icon: 'brain',
        features: [
            'Context-aware completions',
            'Method signature help',
            'Code snippets',
            'Import suggestions',
            'Documentation integration'
        ],
        demo: {
            type: 'animation',
            content: 'intellisense-demo'
        },
        productivity: 4.7
    },
    {
        id: 'code-formatting',
        category: 'Code Style',
        name: 'Prettier',
        description: 'Automated code formatting to maintain consistent code style across the project.',
        icon: 'align-left',
        features: [
            'Auto-format on save',
            'Configurable style rules',
            'Language-specific formatting',
            'Integration with linters',
            'Customizable presets'
        ],
        demo: {
            type: 'image',
            content: 'prettier-demo.png'
        },
        productivity: 4.5
    },
    {
        id: 'testing',
        category: 'Testing',
        name: 'Test Runner',
        description: 'Integrated test execution with coverage reporting and test navigation.',
        icon: 'vial',
        features: [
            'Test discovery and execution',
            'Code coverage visualization',
            'Test debugging',
            'Parameterized tests',
            'Failed test navigation'
        ],
        demo: {
            type: 'animation',
            content: 'test-runner-demo'
        },
        productivity: 4.4
    },
    {
        id: 'database',
        category: 'Database',
        name: 'Database Tools',
        description: 'Database management with query execution, schema visualization, and data editing.',
        icon: 'database',
        features: [
            'SQL query execution',
            'Schema visualization',
            'Data editing',
            'Query history',
            'Connection management'
        ],
        demo: {
            type: 'image',
            content: 'database-tools.png'
        },
        productivity: 4.3
    },
    {
        id: 'collaboration',
        category: 'Collaboration',
        name: 'Live Share',
        description: 'Real-time collaborative editing and debugging with team members.',
        icon: 'users',
        features: [
            'Collaborative editing',
            'Shared terminals',
            'Co-debugging sessions',
            'Follow participant mode',
            'Audio calls integration'
        ],
        demo: {
            type: 'animation',
            content: 'live-share-demo'
        },
        productivity: 4.7
    }
];

// Productivity metrics data
const productivityMetrics = {
    timeSpent: {
        coding: 65,
        debugging: 15,
        testing: 10,
        documentation: 5,
        meetings: 5
    },
    keyboardShortcuts: {
        used: 85,
        timeSaved: 12.5, // hours per month
    },
    automationMetrics: {
        buildTime: {
            manual: 45, // minutes
            automated: 8  // minutes
        },
        deploymentTime: {
            manual: 90, // minutes
            automated: 12 // minutes
        },
        testingTime: {
            manual: 180, // minutes
            automated: 15 // minutes
        }
    }
};

/**
 * Initialize the IDE Tools Mode
 * @param {Object} terminal - The terminal DOM element
 * @param {Object} editorArea - The editor area DOM element
 */
function initIdeTools(terminal, editorArea) {
    ideToolsActive = true;

    // Display welcome message in terminal
    const welcomeOutput = document.createElement('div');
    welcomeOutput.className = 'terminal-output';
    welcomeOutput.innerHTML = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">IDE Tools & Extensions Showcase</div>
        <div>This module demonstrates the development tools and extensions that enhance my coding workflow.</div>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">list</span>: Show all available tools and extensions</div>
        <div>- <span style="color: #cc7832">show {toolId}</span>: View detailed information about a specific tool</div>
        <div>- <span style="color: #cc7832">category {categoryName}</span>: Show tools in a specific category</div>
        <div>- <span style="color: #cc7832">productivity</span>: Show productivity metrics and insights</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit IDE tools mode</div>
        <div style="margin-top: 10px; color: #808080;">Type 'list' to see available development tools</div>
    `;

    // Update prompt style for IDE tools mode
    updateIdeToolsPrompt(terminal);

    // Insert welcome message before the prompt
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(welcomeOutput, lastPrompt);

    // Create IDE tools tab in editor area if it doesn't exist
    createIdeToolsTab(editorArea);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Update the terminal prompt to IDE tools style
 * @param {Object} terminal - The terminal DOM element
 */
function updateIdeToolsPrompt(terminal) {
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        // Change prompt style for IDE tools mode
        const userSpan = lastPrompt.querySelector('.terminal-user');
        if (userSpan) userSpan.textContent = 'tools';

        const machineSpan = lastPrompt.querySelector('.terminal-machine');
        if (machineSpan) machineSpan.textContent = 'intellij';

        const directorySpan = lastPrompt.querySelector('.terminal-directory');
        if (directorySpan) directorySpan.textContent = 'extensions';

        const symbolSpan = lastPrompt.querySelector('.terminal-symbol');
        if (symbolSpan) symbolSpan.textContent = '>';
    }
}

/**
 * Create IDE tools tab in editor area
 * @param {Object} editorArea - The editor area DOM element
 */
function createIdeToolsTab(editorArea) {
    // Check if tab already exists
    if (document.getElementById('ideToolsTab')) {
        // Just activate it
        activateIdeToolsTab();
        return;
    }

    // Create new tab
    const tabsContainer = editorArea.querySelector('.editor-tabs');
    const ideToolsTab = document.createElement('div');
    ideToolsTab.className = 'editor-tab';
    ideToolsTab.id = 'ideToolsTab';
    ideToolsTab.innerHTML = `
        <i class="fas fa-tools"></i>
        <span class="tab-title">ide-extensions.md</span>
        <i class="fas fa-times close-tab"></i>
    `;

    // Create content
    const contentContainer = editorArea.querySelector('.editor-content');
    const ideToolsContent = document.createElement('div');
    ideToolsContent.className = 'code-content markdown-content ide-tools-code';
    ideToolsContent.id = 'ideToolsContent';
    ideToolsContent.innerHTML = `
        <div class="markdown-container">
            <h1>Development Tools & Extensions</h1>
            <p>Explore the IDE tools, extensions, and productivity features that enhance my development workflow.</p>

            <div id="ideToolsDetails">
                <h2>Available Tools</h2>
                <p>Use terminal commands to explore my development toolkit:</p>
                <ul>
                    <li>Type <code>list</code> to see all available tools and extensions</li>
                    <li>Type <code>show {toolId}</code> to view details for a specific tool</li>
                    <li>Type <code>category {categoryName}</code> to filter tools by category</li>
                    <li>Type <code>productivity</code> to see productivity metrics and insights</li>
                </ul>
            </div>
        </div>
    `;

    // Add tab and content to DOM
    tabsContainer.appendChild(ideToolsTab);
    contentContainer.appendChild(ideToolsContent);

    // Add event listener to tab
    ideToolsTab.addEventListener('click', activateIdeToolsTab);

    // Add event listener to close button
    const closeBtn = ideToolsTab.querySelector('.close-tab');
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        ideToolsTab.style.display = 'none';
        if (ideToolsTab.classList.contains('active')) {
            // Show about tab if IDE tools tab is closed
            const aboutTab = document.getElementById('aboutTab');
            if (aboutTab) {
                aboutTab.click();
            }
        }
    });

    // Activate the tab
    activateIdeToolsTab();
}

/**
 * Activate the IDE tools tab
 */
function activateIdeToolsTab() {
    // Deactivate all tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all content
    document.querySelectorAll('.code-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activate IDE tools tab and content
    const ideToolsTab = document.getElementById('ideToolsTab');
    const ideToolsContent = document.getElementById('ideToolsContent');

    if (ideToolsTab && ideToolsContent) {
        ideToolsTab.classList.add('active');
        ideToolsTab.style.display = 'flex';
        ideToolsContent.classList.add('active');
    }
}

/**
 * Process IDE tools commands
 * @param {string} command - Command to process
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 * @returns {boolean} - Whether to continue in IDE tools mode
 */
function processIdeToolsCommand(command, terminal, editorArea) {
    const cmd = command.trim().toLowerCase();

    // Check for exit command
    if (cmd === 'exit') {
        const exitMsg = document.createElement('div');
        exitMsg.className = 'terminal-output';
        exitMsg.textContent = 'Exiting IDE tools mode...';

        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        terminal.insertBefore(exitMsg, lastPrompt);

        // Reset terminal style
        ideToolsActive = false;
        return false;
    }

    // Handle list command
    if (cmd === 'list') {
        showToolsList(terminal, editorArea);
        return true;
    }

    // Handle show command
    if (cmd.startsWith('show ')) {
        const toolId = cmd.substring(5).trim();
        showToolDetails(toolId, terminal, editorArea);
        return true;
    }

    // Handle category command
    if (cmd.startsWith('category ')) {
        const category = cmd.substring(9).trim();
        showToolsByCategory(category, terminal, editorArea);
        return true;
    }

    // Handle productivity command
    if (cmd === 'productivity') {
        showProductivityMetrics(terminal, editorArea);
        return true;
    }

    // Handle unknown command
    const unknownMsg = document.createElement('div');
    unknownMsg.className = 'terminal-output';
    unknownMsg.innerHTML = `
        <span style="color: #cc0000;">Unknown command: ${command}</span>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">list</span>: Show all available tools and extensions</div>
        <div>- <span style="color: #cc7832">show {toolId}</span>: View detailed information about a specific tool</div>
        <div>- <span style="color: #cc7832">category {categoryName}</span>: Show tools in a specific category</div>
        <div>- <span style="color: #cc7832">productivity</span>: Show productivity metrics and insights</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit IDE tools mode</div>
    `;

    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(unknownMsg, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;

    return true;
}

/**
 * Show the list of available IDE tools
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showToolsList(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build tools list HTML
    let toolsHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Available IDE Tools & Extensions</div>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">ID</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Name</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Category</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Productivity</th>
            </tr>
    `;

    // Add each tool to the table
    ideTools.forEach(tool => {
        toolsHtml += `
            <tr>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${tool.id}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;"><strong>${tool.name}</strong></td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${tool.category}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${getStarRating(tool.productivity)}</td>
            </tr>
        `;
    });

    toolsHtml += `</table>
        <div style="margin-top: 10px;">Type <code>show {toolId}</code> to view details for a specific tool</div>
        <div>Type <code>category {categoryName}</code> to filter tools by category</div>
    `;

    // Set output HTML
    output.innerHTML = toolsHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update IDE tools tab content
    updateIdeToolsContent(`
        <h1>Development Tools & Extensions</h1>
        <p>These are the key development tools and IDE extensions that enhance my coding workflow and productivity.</p>

        <div class="tools-grid">
            ${ideTools.map(tool => `
                <div style="background-color: #2b2b2b; border-radius: 5px; padding: 15px; position: relative;">
                    <div style="position: absolute; top: 15px; right: 15px; color: ${getCategoryColor(tool.category)};">
                        <i class="fas fa-${tool.icon}"></i>
                    </div>
                    <h3>${tool.name}</h3>
                    <p><em>${tool.category}</em></p>
                    <p>${tool.description}</p>
                    <div style="margin-top: 10px;">${getStarRating(tool.productivity)}</div>
                    <div style="margin-top: 15px;">
                        <a href="#" onclick="window.terminalProcessCommand('show ${tool.id}'); return false;" style="padding: 6px 12px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px; font-size: 0.9em;">
                            View Details
                        </a>
                    </div>
                </div>
            `).join('')}
        </div>

        <h2 style="margin-top: 30px;">Categories</h2>
        <p>Tools are organized into the following categories:</p>

        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0;">
            ${[...new Set(ideTools.map(tool => tool.category))].map(category => `
                <a href="#" onclick="window.terminalProcessCommand('category ${category.toLowerCase()}'); return false;" style="padding: 8px 16px; background-color: ${getCategoryColor(category)}; color: white; text-decoration: none; border-radius: 4px; margin-bottom: 10px;">
                    ${category}
                </a>
            `).join('')}
        </div>

        <div style="margin-top: 20px; padding: 15px; background-color: #3c3f41; border-radius: 5px;">
            <h3 style="margin-top: 0;">Productivity Impact</h3>
            <p>The tools and extensions above help improve my development workflow and productivity.</p>
            <p><a href="#" onclick="window.terminalProcessCommand('productivity'); return false;">View detailed productivity metrics →</a></p>
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show details of a specific IDE tool
 * @param {string} toolId - ID of the tool to show
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showToolDetails(toolId, terminal, editorArea) {
    // Find tool by ID
    const tool = ideTools.find(t => t.id.toLowerCase() === toolId.toLowerCase());

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!tool) {
        // Tool not found
        output.innerHTML = `<span style="color: #cc0000;">Tool '${toolId}' not found. Type 'list' to see available tools.</span>`;
    } else {
        // Build tool details HTML
        let detailsHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">${tool.name}</div>
            <div><strong>Category:</strong> ${tool.category}</div>
            <div style="margin: 5px 0 10px 0;">${tool.description}</div>
            <div><strong>Productivity Impact:</strong> ${getStarRating(tool.productivity)}</div>

            <div style="margin-top: 10px;"><strong>Key Features:</strong></div>
            <ul style="margin: 5px 0 10px 20px; padding: 0;">
                ${tool.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>

            <div style="margin-top: 10px;">Interactive demonstration available in the editor panel.</div>
        `;

        // Set output HTML
        output.innerHTML = detailsHtml;

        // Update IDE tools tab with tool details
        updateIdeToolsContent(`
            <h1>${tool.name}</h1>
            <p><em>${tool.category}</em> · ${getStarRating(tool.productivity)}</p>
            <p>${tool.description}</p>

            <div style="margin: 20px 0; padding: 20px; background-color: #2b2b2b; border-radius: 10px;">
                <h2>Key Features</h2>
                <ul style="line-height: 1.6;">
                    ${tool.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>

            <h2>Demonstration</h2>
            <div style="background-color: #2b2b2b; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
                ${tool.demo.type === 'animation' ?
                    `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0;">
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #1e1e1e; border-radius: 5px;">
                            <div>
                                <i class="fas fa-${tool.icon}" style="font-size: 48px; color: ${getCategoryColor(tool.category)};"></i>
                                <p style="margin-top: 15px;">Animation: ${tool.demo.content}</p>
                            </div>
                        </div>
                    </div>` :
                    `<div style="width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; background-color: #1e1e1e; border-radius: 5px;">
                        <div>
                            <i class="fas fa-${tool.icon}" style="font-size: 48px; color: ${getCategoryColor(tool.category)};"></i>
                            <p style="margin-top: 15px;">Image: ${tool.demo.content}</p>
                        </div>
                    </div>`
                }
            </div>

            <h2>Productivity Impact</h2>
            <div style="background-color: #2b2b2b; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <p>This tool provides a significant productivity boost to my development workflow by:</p>
                <ul>
                    <li>Automating repetitive tasks</li>
                    <li>Providing real-time feedback and insights</li>
                    <li>Streamlining the development process</li>
                    <li>Improving code quality and maintainability</li>
                </ul>
                <div style="margin-top: 15px;">
                    <p><strong>Overall Impact:</strong> ${getStarRating(tool.productivity)}</p>
                </div>
            </div>

            <div style="margin-top: 20px; text-align: center;">
                <a href="#" onclick="window.terminalProcessCommand('list'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                    View All Tools
                </a>
                <a href="#" onclick="window.terminalProcessCommand('category ${tool.category.toLowerCase()}'); return false;" style="padding: 8px 16px; background-color: ${getCategoryColor(tool.category)}; color: white; text-decoration: none; border-radius: 4px;">
                    Browse ${tool.category} Tools
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
 * Show IDE tools filtered by category
 * @param {string} category - Category to filter by
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showToolsByCategory(category, terminal, editorArea) {
    // Filter tools by category (case-insensitive)
    const toolsInCategory = ideTools.filter(tool =>
        tool.category.toLowerCase() === category.toLowerCase()
    );

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (toolsInCategory.length === 0) {
        // No tools in category
        output.innerHTML = `<span style="color: #cc0000;">No tools found in category '${category}'. Type 'list' to see available tools.</span>`;
    } else {
        // Build category tools HTML
        let categoryHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">${capitalizeFirstLetter(category)} Tools</div>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">ID</th>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Name</th>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Description</th>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Productivity</th>
                </tr>
        `;

        // Add each tool to the table
        toolsInCategory.forEach(tool => {
            categoryHtml += `
                <tr>
                    <td style="padding: 5px; border-bottom: 1px solid #444;">${tool.id}</td>
                    <td style="padding: 5px; border-bottom: 1px solid #444;"><strong>${tool.name}</strong></td>
                    <td style="padding: 5px; border-bottom: 1px solid #444;">${tool.description}</td>
                    <td style="padding: 5px; border-bottom: 1px solid #444;">${getStarRating(tool.productivity)}</td>
                </tr>
            `;
        });

        categoryHtml += `</table>
            <div style="margin-top: 10px;">Type <code>show {toolId}</code> to view details for a specific tool</div>
        `;

        // Set output HTML
        output.innerHTML = categoryHtml;

        // Update IDE tools tab with category content
        updateIdeToolsContent(`
            <h1>${capitalizeFirstLetter(category)} Tools</h1>
            <p>These are the development tools and extensions focused on ${category.toLowerCase()}.</p>

            <div class="tools-grid">
                ${toolsInCategory.map(tool => `
                    <div style="background-color: #2b2b2b; border-radius: 5px; padding: 15px; position: relative;">
                        <div style="position: absolute; top: 15px; right: 15px; color: ${getCategoryColor(tool.category)};">
                            <i class="fas fa-${tool.icon}"></i>
                        </div>
                        <h3>${tool.name}</h3>
                        <p>${tool.description}</p>
                        <div style="margin-top: 10px;">${getStarRating(tool.productivity)}</div>
                        <div style="margin-top: 15px;">
                            <a href="#" onclick="window.terminalProcessCommand('show ${tool.id}'); return false;" style="padding: 6px 12px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px; font-size: 0.9em;">
                                View Details
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="margin-top: 30px; text-align: center;">
                <a href="#" onclick="window.terminalProcessCommand('list'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px;">
                    View All Categories
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
 * Show productivity metrics and insights
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showProductivityMetrics(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build productivity metrics HTML (simplified for terminal)
    let metricsHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Productivity Metrics</div>

        <div style="margin-top: 10px;"><strong>Time Allocation:</strong></div>
        <div>Coding: ${productivityMetrics.timeSpent.coding}%</div>
        <div>Debugging: ${productivityMetrics.timeSpent.debugging}%</div>
        <div>Testing: ${productivityMetrics.timeSpent.testing}%</div>
        <div>Documentation: ${productivityMetrics.timeSpent.documentation}%</div>
        <div>Meetings: ${productivityMetrics.timeSpent.meetings}%</div>

        <div style="margin-top: 10px;"><strong>Keyboard Shortcut Usage:</strong></div>
        <div>Utilization: ${productivityMetrics.keyboardShortcuts.used}%</div>
        <div>Time Saved: ${productivityMetrics.keyboardShortcuts.timeSaved} hours/month</div>

        <div style="margin-top: 10px;"><strong>Automation Impact:</strong></div>
        <div>Build Time: ${productivityMetrics.automationMetrics.buildTime.manual} min → ${productivityMetrics.automationMetrics.buildTime.automated} min</div>
        <div>Deployment Time: ${productivityMetrics.automationMetrics.deploymentTime.manual} min → ${productivityMetrics.automationMetrics.deploymentTime.automated} min</div>
        <div>Testing Time: ${productivityMetrics.automationMetrics.testingTime.manual} min → ${productivityMetrics.automationMetrics.testingTime.automated} min</div>

        <div style="margin-top: 10px;">Detailed visualizations available in the editor panel.</div>
    `;

    // Set output HTML
    output.innerHTML = metricsHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update IDE tools tab with productivity metrics visualizations
    updateIdeToolsContent(`
        <h1>Productivity Metrics & Insights</h1>
        <p>Analysis of how IDE tools and development practices impact my workflow efficiency.</p>

        <div style="display: flex; flex-wrap: wrap; gap: 20px; margin: 30px 0;">
            <!-- Time Allocation Chart -->
            <div style="flex: 1; min-width: 300px; background-color: #2b2b2b; border-radius: 10px; padding: 20px;">
                <h2>Time Allocation</h2>
                <div style="height: 300px; position: relative; margin-top: 20px;">
                    <!-- Simplified donut chart representation -->
                    <div style="position: relative; width: 200px; height: 200px; margin: 0 auto; border-radius: 50%; background: conic-gradient(
                        #6a8759 0% ${productivityMetrics.timeSpent.coding}%,
                        #cc7832 ${productivityMetrics.timeSpent.coding}% ${productivityMetrics.timeSpent.coding + productivityMetrics.timeSpent.debugging}%,
                        #9876aa ${productivityMetrics.timeSpent.coding + productivityMetrics.timeSpent.debugging}% ${productivityMetrics.timeSpent.coding + productivityMetrics.timeSpent.debugging + productivityMetrics.timeSpent.testing}%,
                        #6897bb ${productivityMetrics.timeSpent.coding + productivityMetrics.timeSpent.debugging + productivityMetrics.timeSpent.testing}% ${productivityMetrics.timeSpent.coding + productivityMetrics.timeSpent.debugging + productivityMetrics.timeSpent.testing + productivityMetrics.timeSpent.documentation}%,
                        #a9b7c6 ${productivityMetrics.timeSpent.coding + productivityMetrics.timeSpent.debugging + productivityMetrics.timeSpent.testing + productivityMetrics.timeSpent.documentation}% 100%
                    );">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100px; height: 100px; background-color: #2b2b2b; border-radius: 50%;"></div>
                    </div>
                    <div style="margin-top: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span><span style="display: inline-block; width: 12px; height: 12px; background-color: #6a8759; margin-right: 5px;"></span> Coding</span>
                            <span>${productivityMetrics.timeSpent.coding}%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span><span style="display: inline-block; width: 12px; height: 12px; background-color: #cc7832; margin-right: 5px;"></span> Debugging</span>
                            <span>${productivityMetrics.timeSpent.debugging}%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span><span style="display: inline-block; width: 12px; height: 12px; background-color: #9876aa; margin-right: 5px;"></span> Testing</span>
                            <span>${productivityMetrics.timeSpent.testing}%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span><span style="display: inline-block; width: 12px; height: 12px; background-color: #6897bb; margin-right: 5px;"></span> Documentation</span>
                            <span>${productivityMetrics.timeSpent.documentation}%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span><span style="display: inline-block; width: 12px; height: 12px; background-color: #a9b7c6; margin-right: 5px;"></span> Meetings</span>
                            <span>${productivityMetrics.timeSpent.meetings}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Keyboard Shortcuts Impact -->
            <div style="flex: 1; min-width: 300px; background-color: #2b2b2b; border-radius: 10px; padding: 20px;">
                <h2>Keyboard Shortcuts Impact</h2>
                <div style="height: 300px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="font-size: 36px; font-weight: bold; margin-bottom: 10px; color: #6a8759;">
                        ${productivityMetrics.keyboardShortcuts.used}%
                    </div>
                    <div style="margin-bottom: 20px;">Keyboard Shortcut Utilization</div>
                    <div style="font-size: 28px; font-weight: bold; color: #9876aa;">
                        ${productivityMetrics.keyboardShortcuts.timeSaved}
                    </div>
                    <div>Hours Saved Per Month</div>
                </div>
            </div>
        </div>

        <div style="margin: 30px 0; background-color: #2b2b2b; border-radius: 10px; padding: 20px;">
            <h2>Automation Impact</h2>
            <p>Comparison of manual vs. automated development processes:</p>

            <!-- Build Time -->
            <div style="margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Build Time</span>
                    <span>${Math.round((1 - productivityMetrics.automationMetrics.buildTime.automated / productivityMetrics.automationMetrics.buildTime.manual) * 100)}% reduction</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="flex: 1; height: 30px; background-color: #cc7832; border-radius: 4px; position: relative;">
                        <div style="position: absolute; top: 0; left: 0; height: 100%; display: flex; align-items: center; padding-left: 10px; color: white;">
                            Manual: ${productivityMetrics.automationMetrics.buildTime.manual} min
                        </div>
                    </div>
                    <div style="flex: ${productivityMetrics.automationMetrics.buildTime.automated / productivityMetrics.automationMetrics.buildTime.manual}; height: 30px; background-color: #6a8759; border-radius: 4px; position: relative;">
                        <div style="position: absolute; top: 0; left: 0; height: 100%; display: flex; align-items: center; padding-left: 10px; color: white; white-space: nowrap;">
                            Automated: ${productivityMetrics.automationMetrics.buildTime.automated} min
                        </div>
                    </div>
                </div>
            </div>

            <!-- Deployment Time -->
            <div style="margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Deployment Time</span>
                    <span>${Math.round((1 - productivityMetrics.automationMetrics.deploymentTime.automated / productivityMetrics.automationMetrics.deploymentTime.manual) * 100)}% reduction</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="flex: 1; height: 30px; background-color: #cc7832; border-radius: 4px; position: relative;">
                        <div style="position: absolute; top: 0; left: 0; height: 100%; display: flex; align-items: center; padding-left: 10px; color: white;">
                            Manual: ${productivityMetrics.automationMetrics.deploymentTime.manual} min
                        </div>
                    </div>
                    <div style="flex: ${productivityMetrics.automationMetrics.deploymentTime.automated / productivityMetrics.automationMetrics.deploymentTime.manual}; height: 30px; background-color: #6a8759; border-radius: 4px; position: relative;">
                        <div style="position: absolute; top: 0; left: 0; height: 100%; display: flex; align-items: center; padding-left: 10px; color: white; white-space: nowrap;">
                            Automated: ${productivityMetrics.automationMetrics.deploymentTime.automated} min
                        </div>
                    </div>
                </div>
            </div>

            <!-- Testing Time -->
            <div style="margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Testing Time</span>
                    <span>${Math.round((1 - productivityMetrics.automationMetrics.testingTime.automated / productivityMetrics.automationMetrics.testingTime.manual) * 100)}% reduction</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="flex: 1; height: 30px; background-color: #cc7832; border-radius: 4px; position: relative;">
                        <div style="position: absolute; top: 0; left: 0; height: 100%; display: flex; align-items: center; padding-left: 10px; color: white;">
                            Manual: ${productivityMetrics.automationMetrics.testingTime.manual} min
                        </div>
                    </div>
                    <div style="flex: ${productivityMetrics.automationMetrics.testingTime.automated / productivityMetrics.automationMetrics.testingTime.manual}; height: 30px; background-color: #6a8759; border-radius: 4px; position: relative;">
                        <div style="position: absolute; top: 0; left: 0; height: 100%; display: flex; align-items: center; padding-left: 10px; color: white; white-space: nowrap;">
                            Automated: ${productivityMetrics.automationMetrics.testingTime.automated} min
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-top: 30px; text-align: center;">
            <a href="#" onclick="window.terminalProcessCommand('list'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px;">
                View All Tools
            </a>
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Update IDE tools tab content
 * @param {string} html - HTML content to update
 */
function updateIdeToolsContent(html) {
    const ideToolsDetails = document.getElementById('ideToolsDetails');
    if (ideToolsDetails) {
        ideToolsDetails.innerHTML = html;
    }
}

/**
 * Get a star rating display based on a numeric score
 * @param {number} score - Numeric score (0-5)
 * @returns {string} - HTML string with star rating
 */
function getStarRating(score) {
    const fullStars = Math.floor(score);
    const halfStar = score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHtml = '';

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star" style="color: #ffc66d;"></i>';
    }

    // Add half star if needed
    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt" style="color: #ffc66d;"></i>';
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star" style="color: #ffc66d;"></i>';
    }

    return starsHtml + ` <span style="color: #a9b7c6; font-size: 0.9em;">(${score.toFixed(1)})</span>`;
}

/**
 * Get color for a category
 * @param {string} category - Category name
 * @returns {string} - Color hex code
 */
function getCategoryColor(category) {
    const categoryColors = {
        'Version Control': '#6a8759',
        'Code Quality': '#cc7832',
        'Debugging': '#cc0000',
        'Productivity': '#6897bb',
        'Code Style': '#9876aa',
        'Testing': '#ffc66d',
        'Database': '#507080',
        'Collaboration': '#a9b7c6'
    };

    return categoryColors[category] || '#214283';
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - String to capitalize
 * @returns {string} - Capitalized string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
     * Start IDE tools mode
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     */
    start: function(terminal, editorArea) {
        setupTerminalCommandHandler();
        initIdeTools(terminal, editorArea);
    },

    /**
     * Process IDE tools input
     * @param {string} command - The entered command
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     * @returns {boolean} - Whether to stay in IDE tools mode
     */
    processInput: function(command, terminal, editorArea) {
        return processIdeToolsCommand(command, terminal, editorArea);
    },

    /**
     * Check if IDE tools mode is active
     * @returns {boolean} - IDE tools mode status
     */
    isActive: function() {
        return ideToolsActive;
    }
};