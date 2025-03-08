/**
 * Feature Loader
 *
 * This script helps with loading feature modules and provides fallbacks
 * for when modules fail to load.
 */

// Store loaded features
const loadedFeatures = {};

/**
 * Load a feature module dynamically
 * @param {string} name - Name of the feature to load
 * @param {string} path - Path to the feature module
 * @returns {Promise<Object>} - The loaded feature module
 */
export async function loadFeature(name, path) {
    try {
        console.log(`Attempting to load feature: ${name} from ${path}`);
        const module = await import(path);
        console.log(`Successfully loaded feature: ${name}`);
        loadedFeatures[name] = module.default;
        return module.default;
    } catch (error) {
        console.error(`Error loading feature ${name}:`, error);
        const fallbackModule = createFallbackModule(name);
        loadedFeatures[name] = fallbackModule;
        return fallbackModule;
    }
}

/**
 * Create a fallback module for features that fail to load
 * @param {string} featureName - Name of the feature
 * @returns {Object} - A fallback module with minimal functionality
 */
function createFallbackModule(featureName) {
    return {
        start: function(terminal, editorArea) {
            displayFallbackUI(featureName, terminal, editorArea);
        },
        processInput: function() { return false; },
        isActive: function() { return false; }
    };
}

/**
 * Display a fallback UI for a feature that failed to load
 * @param {string} featureName - Name of the feature
 * @param {HTMLElement} terminal - Terminal DOM element
 * @param {HTMLElement} editorArea - Editor area DOM element
 */
function displayFallbackUI(featureName, terminal, editorArea) {
    if (!terminal) {
        console.error('Terminal not found');
        return;
    }

    // Create error message for terminal
    const output = document.createElement('div');
    output.className = 'terminal-output';
    output.innerHTML = `
        <span style="color: #cc0000;">Module Error: ${featureName} could not be loaded properly.</span>
        <br><br>Possible causes:
        <br>- Network issues when loading the module
        <br>- JavaScript errors in the module code
        <br>- Missing dependencies
        <br><br>Recommendations:
        <br>- Check the browser console for specific errors
        <br>- Ensure all feature scripts are properly included in your project
        <br>- Try refreshing the page
        <br><br>You can continue using other features of the portfolio.
    `;

    // Add the output to the terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        terminal.insertBefore(output, lastPrompt);
    } else {
        terminal.appendChild(output);
    }

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;

    // Create a tab in the editor area for the feature
    if (editorArea) {
        // Create or find feature tab
        let featureTab = document.getElementById(`${featureName.toLowerCase().replace(/\s+/g, '-')}Tab`);
        if (!featureTab) {
            featureTab = document.createElement('div');
            featureTab.className = 'editor-tab';
            featureTab.id = `${featureName.toLowerCase().replace(/\s+/g, '-')}Tab`;
            featureTab.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span class="tab-title">${featureName}.js</span>
                <i class="fas fa-times close-tab"></i>
            `;

            // Add event listener to tab
            featureTab.addEventListener('click', function() {
                activateFeatureTab(featureName, editorArea);
            });

            // Add event listener to close button
            const closeBtn = featureTab.querySelector('.close-tab');
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    featureTab.style.display = 'none';
                    // Show about tab if this was active
                    if (featureTab.classList.contains('active')) {
                        const aboutTab = document.getElementById('aboutTab');
                        if (aboutTab) {
                            aboutTab.click();
                        }
                    }
                });
            }

            // Add tab to tabs container
            const tabsContainer = editorArea.querySelector('.editor-tabs');
            if (tabsContainer) {
                tabsContainer.appendChild(featureTab);
            }
        }

        // Create or find feature content
        let featureContent = document.getElementById(`${featureName.toLowerCase().replace(/\s+/g, '-')}Content`);
        if (!featureContent) {
            featureContent = document.createElement('div');
            featureContent.className = 'code-content markdown-content';
            featureContent.id = `${featureName.toLowerCase().replace(/\s+/g, '-')}Content`;
            featureContent.innerHTML = `
                <div class="markdown-container">
                    <h1>${featureName} - Module Error</h1>
                    <div style="background-color: rgba(204, 0, 0, 0.1); border-left: 4px solid #cc0000; padding: 15px; margin: 20px 0;">
                        <h3 style="color: #cc0000;">Error Loading Module</h3>
                        <p>The ${featureName} module couldn't be loaded properly. This could be due to network issues, JavaScript errors, or missing dependencies.</p>
                    </div>

                    <h2>Troubleshooting Steps</h2>
                    <ol>
                        <li>Check the browser console (F12) for specific error messages</li>
                        <li>Verify that all required scripts are included in your project</li>
                        <li>Try refreshing the page</li>
                        <li>Clear your browser cache</li>
                    </ol>

                    <h2>Alternative Access</h2>
                    <p>You can try accessing other features of the portfolio while this issue is being addressed:</p>
                    <ul>
                        <li><a href="#" onclick="window.terminalProcessCommand('about'); return false;">About</a></li>
                        <li><a href="#" onclick="window.terminalProcessCommand('skills'); return false;">Skills</a></li>
                        <li><a href="#" onclick="window.terminalProcessCommand('projects'); return false;">Projects</a></li>
                        <li><a href="#" onclick="window.terminalProcessCommand('contact'); return false;">Contact</a></li>
                    </ul>
                </div>
            `;

            // Add content to editor content container
            const contentContainer = editorArea.querySelector('.editor-content');
            if (contentContainer) {
                contentContainer.appendChild(featureContent);
            }
        }

        // Activate the feature tab and content
        activateFeatureTab(featureName, editorArea);
    }
}

/**
 * Activate a feature tab and its content
 * @param {string} featureName - Name of the feature
 * @param {HTMLElement} editorArea - Editor area DOM element
 */
function activateFeatureTab(featureName, editorArea) {
    const tabId = `${featureName.toLowerCase().replace(/\s+/g, '-')}Tab`;
    const contentId = `${featureName.toLowerCase().replace(/\s+/g, '-')}Content`;

    // Hide all tabs and content
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    document.querySelectorAll('.code-content').forEach(content => {
        content.classList.remove('active');
    });

    // Show and activate the feature tab and content
    const tab = document.getElementById(tabId);
    const content = document.getElementById(contentId);

    if (tab) {
        tab.classList.add('active');
        tab.style.display = 'flex';
    }

    if (content) {
        content.classList.add('active');
    }
}

/**
 * Get a loaded feature module
 * @param {string} name - Name of the feature to get
 * @returns {Object|null} - The feature module or null if not loaded
 */
export function getFeature(name) {
    return loadedFeatures[name] || null;
}

/**
 * Check if a feature is loaded
 * @param {string} name - Name of the feature to check
 * @returns {boolean} - True if the feature is loaded
 */
export function isFeatureLoaded(name) {
    return !!loadedFeatures[name];
}

/**
 * Load all core features
 * @returns {Promise<Object>} - Object containing all loaded features
 */
export async function loadAllFeatures() {
    try {
        const features = {
            javaTerminal: await loadFeature('Java Terminal', './features/java-terminal.js'),
            apiDemo: await loadFeature('API Demo', './features/api-demo.js'),
            databaseViewer: await loadFeature('Database Viewer', './features/db-viewer.js'),
            gitViewer: await loadFeature('Git Viewer', './features/git-viewer.js'),
            buildTools: await loadFeature('Build Tools', './features/build-tools.js'),
            projectDemo: await loadFeature('Project Demo', './features/project-demo.js'),
            ideTools: await loadFeature('IDE Tools', './features/ide-tools.js'),
            codeChallenge: await loadFeature('Code Challenge', './features/code-challenge.js')
        };

        console.log('All features loaded (or fallbacks created)');
        return features;
    } catch (error) {
        console.error('Error loading features:', error);
        return {};
    }
}