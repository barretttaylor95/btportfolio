/**
 * Feature Loader - Fixed Version
 *
 * This script helps with loading feature modules and provides fallbacks
 * for when modules fail to load.
 */

// Store loaded features
const loadedFeatures = {};

/**
 * Load a feature module dynamically using a traditional script tag
 * @param {string} name - Name of the feature to load
 * @param {string} path - Path to the feature module
 * @returns {Promise<Object>} - The loaded feature module
 */
export async function loadFeature(name, path) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`Attempting to load feature: ${name} from ${path}`);

            // Create a script element
            const script = document.createElement('script');
            script.type = 'text/javascript'; // Regular script, not a module
            script.src = path;

            // Handle successful load
            script.onload = function() {
                console.log(`Successfully loaded feature: ${name}`);

                // Check if the module registered itself globally
                const globalName = name.replace(/([A-Z])/g, (_, letter) => letter.toLowerCase()) + 'Placeholder';

                if (window[globalName]) {
                    loadedFeatures[name] = window[globalName];
                    resolve(window[globalName]);
                } else {
                    console.warn(`Module loaded but global object ${globalName} not found`);
                    const fallbackModule = createFallbackModule(name);
                    loadedFeatures[name] = fallbackModule;
                    resolve(fallbackModule);
                }
            };

            // Handle load error
            script.onerror = function(error) {
                console.error(`Error loading feature ${name}:`, error);
                const fallbackModule = createFallbackModule(name);
                loadedFeatures[name] = fallbackModule;
                resolve(fallbackModule); // Resolve with fallback instead of rejecting
            };

            // Add script to document
            document.head.appendChild(script);

        } catch (error) {
            console.error(`Exception loading feature ${name}:`, error);
            const fallbackModule = createFallbackModule(name);
            loadedFeatures[name] = fallbackModule;
            resolve(fallbackModule); // Resolve with fallback instead of rejecting
        }
    });
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
        const formattedName = featureName.replace(/([A-Z])/g, '-$1').toLowerCase();
        let featureTab = document.getElementById(`${formattedName}-tab`);
        if (!featureTab) {
            featureTab = document.createElement('div');
            featureTab.className = 'editor-tab';
            featureTab.id = `${formattedName}-tab`;
            featureTab.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span class="tab-title">${featureName}.js</span>
                <i class="fas fa-times close-tab"></i>
            `;

            // Add event listener to tab
            featureTab.addEventListener('click', function() {
                activateFeatureTab(formattedName, editorArea);
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
        let featureContent = document.getElementById(`${formattedName}-content`);
        if (!featureContent) {
            featureContent = document.createElement('div');
            featureContent.className = 'code-content markdown-content';
            featureContent.id = `${formattedName}-content`;
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
        activateFeatureTab(formattedName, editorArea);
    }
}

/**
 * Activate a feature tab and its content
 * @param {string} featureName - Name of the feature
 * @param {HTMLElement} editorArea - Editor area DOM element
 */
function activateFeatureTab(featureName, editorArea) {
    const tabId = `${featureName}-tab`;
    const contentId = `${featureName}-content`;

    // Hide all tabs and content
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
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
        // Load features sequentially to avoid race conditions
        const javaTerminal = await loadFeature('javaTerminal', './features/java-terminal.js');
        const apiDemo = await loadFeature('apiDemo', './features/api-demo.js');
        const databaseViewer = await loadFeature('databaseViewer', './features/db-viewer.js');
        const gitViewer = await loadFeature('gitViewer', './features/git-viewer.js');
        const buildTools = await loadFeature('buildTools', './features/build-tools.js');
        const projectDemo = await loadFeature('projectDemo', './features/project-demo.js');
        const ideTools = await loadFeature('ideTools', './features/ide-tools.js');
        const codeChallenge = await loadFeature('codeChallenge', './features/code-challenge.js');

        const features = {
            javaTerminal,
            apiDemo,
            databaseViewer,
            gitViewer,
            buildTools,
            projectDemo,
            ideTools,
            codeChallenge
        };

        console.log('All features loaded (or fallbacks created)');
        return features;
    } catch (error) {
        console.error('Error loading features:', error);
        return {};
    }
}