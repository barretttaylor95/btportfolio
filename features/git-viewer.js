<td style="padding: 5px; border-bottom: 1px solid #444;"><span style="color: ${statusColor};">${pr.status}</span></td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${pr.author}</td>
            </tr>
        `;
    });

    prsHtml += `</table>
        <div style="margin-top: 10px;">Type <code>pr {id}</code> to view PR details</div>
    `;

    // Set output HTML
    output.innerHTML = prsHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update Git tab content
    updateGitContent(`
        <h1>Pull Requests</h1>
        <p>Pull requests for the ${gitRepository.name} repository.</p>

        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">ID</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Title</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Branches</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Status</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Author</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Updated</th>
            </tr>
            ${gitRepository.pullRequests.map(pr => {
                const statusColor = pr.status === 'Open' ? '#6a8759' : pr.status === 'Merged' ? '#6897bb' : '#cc0000';
                const updatedDate = formatDate(pr.updatedAt);

                return `
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #444;"><a href="#" onclick="window.terminalProcessCommand('pr ${pr.id}'); return false;">#${pr.id}</a></td>
                        <td style="padding: 8px; border-bottom: 1px solid #444;"><a href="#" onclick="window.terminalProcessCommand('pr ${pr.id}'); return false;">${pr.title}</a></td>
                        <td style="padding: 8px; border-bottom: 1px solid #444;"><span style="color: #cc7832;">${pr.sourceBranch}</span> → <span style="color: #cc7832;">${pr.targetBranch}</span></td>
                        <td style="padding: 8px; border-bottom: 1px solid #444;"><span style="color: ${statusColor};">${pr.status}</span></td>
                        <td style="padding: 8px; border-bottom: 1px solid #444;">${pr.author}</td>
                        <td style="padding: 8px; border-bottom: 1px solid #444;">${updatedDate}</td>
                    </tr>
                `;
            }).join('')}
        </table>

        <div style="margin-top: 20px;">
            <h2>Pull Request Status</h2>
            <div style="display: flex; justify-content: space-around; margin-top: 15px; text-align: center;">
                <div style="flex: 1; padding: 15px; background-color: rgba(106, 135, 89, 0.2); border-radius: 5px; margin: 0 5px;">
                    <h3 style="color: #6a8759; margin-top: 0;">${gitRepository.pullRequests.filter(pr => pr.status === 'Open').length}</h3>
                    <p>Open</p>
                </div>
                <div style="flex: 1; padding: 15px; background-color: rgba(104, 151, 187, 0.2); border-radius: 5px; margin: 0 5px;">
                    <h3 style="color: #6897bb; margin-top: 0;">${gitRepository.pullRequests.filter(pr => pr.status === 'Merged').length}</h3>
                    <p>Merged</p>
                </div>
                <div style="flex: 1; padding: 15px; background-color: rgba(204, 0, 0, 0.2); border-radius: 5px; margin: 0 5px;">
                    <h3 style="color: #cc0000; margin-top: 0;">${gitRepository.pullRequests.filter(pr => pr.status === 'Closed').length}</h3>
                    <p>Closed</p>
                </div>
            </div>
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show pull request details
 * @param {number} prId - ID of the pull request to show
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showPullRequestDetails(prId, terminal, editorArea) {
    // Find PR by ID
    const pr = gitRepository.pullRequests.find(p => p.id === prId);

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!pr) {
        // PR not found
        output.innerHTML = `<span style="color: #cc0000;">Pull request #${prId} not found.</span>`;
    } else {
        // Format dates
        const createdDate = new Date(pr.createdAt);
        const updatedDate = new Date(pr.updatedAt);
        const formattedCreated = `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`;
        const formattedUpdated = `${updatedDate.toLocaleDateString()} ${updatedDate.toLocaleTimeString()}`;

        // Build PR details HTML
        let prHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Pull Request #${pr.id}: ${pr.title}</div>
            <div>Status: <span style="color: ${pr.status === 'Open' ? '#6a8759' : pr.status === 'Merged' ? '#6897bb' : '#cc0000'};">${pr.status}</span></div>
            <div>Created: ${formattedCreated} by ${pr.author}</div>
            <div>Updated: ${formattedUpdated}</div>
            <div style="margin-top: 10px;">Source: <span style="color: #cc7832;">${pr.sourceBranch}</span> → Target: <span style="color: #cc7832;">${pr.targetBranch}</span></div>
            <div style="margin: 10px 0; padding: 5px; background-color: #2b2b2b;">${pr.description}</div>

            <div style="color: #cc7832; margin-top: 10px;">Commits:</div>
        `;

        // Add commits
        pr.commits.forEach(commitHash => {
            const commit = gitRepository.commits.find(c => c.hash === commitHash || c.shortHash === commitHash);
            if (commit) {
                prHtml += `<div>- ${commit.shortHash}: ${commit.message}</div>`;
            }
        });

        // Add reviewers
        prHtml += `<div style="color: #cc7832; margin-top: 10px;">Reviewers:</div>`;
        pr.reviewers.forEach(reviewer => {
            prHtml += `<div>- ${reviewer}</div>`;
        });

        // Add comments
        if (pr.comments && pr.comments.length > 0) {
            prHtml += `<div style="color: #cc7832; margin-top: 10px;">Comments:</div>`;
            pr.comments.forEach(comment => {
                const commentDate = new Date(comment.date);
                const formattedCommentDate = `${commentDate.toLocaleDateString()} ${commentDate.toLocaleTimeString()}`;
                prHtml += `
                    <div style="margin-top: 5px; padding: 5px; background-color: #2b2b2b;">
                        <div>${comment.author} (${formattedCommentDate}):</div>
                        <div style="margin-top: 5px;">${comment.content}</div>
                        ${comment.resolved ? '<div style="color: #6a8759;">✓ Resolved</div>' : '<div style="color: #cc0000;">○ Unresolved</div>'}
                    </div>
                `;
            });
        }

        // Set output HTML
        output.innerHTML = prHtml;

        // Update Git tab content
        updateGitContent(`
            <h1>Pull Request #${pr.id}</h1>
            <div style="padding: 16px; background-color: #2b2b2b; border-radius: 5px; margin-bottom: 20px;">
                <h2 style="margin-top: 0;">${pr.title}</h2>
                <p><span style="background-color: ${pr.status === 'Open' ? '#6a8759' : pr.status === 'Merged' ? '#6897bb' : '#cc0000'}; color: white; padding: 2px 8px; border-radius: 3px;">${pr.status}</span></p>
                <p><strong>Author:</strong> ${pr.author}</p>
                <p><strong>Source:</strong> <span style="color: #cc7832;">${pr.sourceBranch}</span> → <strong>Target:</strong> <span style="color: #cc7832;">${pr.targetBranch}</span></p>
                <p><strong>Created:</strong> ${formatDate(pr.createdAt)}</p>
                <p><strong>Last Updated:</strong> ${formatDate(pr.updatedAt)}</p>
                ${pr.mergedAt ? `<p><strong>Merged At:</strong> ${formatDate(pr.mergedAt)}</p>` : ''}
                ${pr.closedAt ? `<p><strong>Closed At:</strong> ${formatDate(pr.closedAt)}</p>` : ''}
            </div>

            <h2>Description</h2>
            <div style="padding: 16px; background-color: #2b2b2b; border-radius: 5px; margin-bottom: 20px;">
                <p>${pr.description}</p>
            </div>

            <h2>Commits</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Hash</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Message</th>
                </tr>
                ${pr.commits.map(commitHash => {
                    const commit = gitRepository.commits.find(c => c.hash === commitHash || c.shortHash === commitHash);
                    return commit ? `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #444;"><a href="#" onclick="window.terminalProcessCommand('show ${commit.shortHash}'); return false;">${commit.shortHash}</a></td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${commit.message}</td>
                        </tr>
                    ` : '';
                }).join('')}
            </table>

            <div style="display: flex; margin-top: 20px;">
                <div style="flex: 1; margin-right: 10px;">
                    <h2>Reviewers</h2>
                    <ul style="list-style-type: none; padding-left: 0;">
                        ${pr.reviewers.map(reviewer => `
                            <li style="padding: 8px; background-color: #2b2b2b; border-radius: 5px; margin-bottom: 5px;">
                                ${reviewer}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div style="flex: 2;">
                    <h2>Comments</h2>
                    ${pr.comments.length > 0 ?
                        pr.comments.map(comment => `
                            <div style="padding: 12px; background-color: #2b2b2b; border-radius: 5px; margin-bottom: 10px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <strong>${comment.author}</strong>
                                    <span>${formatDate(comment.date)}</span>
                                </div>
                                <p style="margin: 0 0 8px 0;">${comment.content}</p>
                                <div style="text-align: right;">
                                    ${comment.resolved ?
                                        '<span style="color: #6a8759; background-color: rgba(106, 135, 89, 0.2); padding: 2px 8px; border-radius: 3px;">✓ Resolved</span>' :
                                        '<span style="color: #cc0000; background-color: rgba(204, 0, 0, 0.2); padding: 2px 8px; border-radius: 3px;">○ Unresolved</span>'
                                    }
                                </div>
                            </div>
                        `).join('') :
                        '<p>No comments on this pull request.</p>'
                    }
                </div>
            </div>

            <div style="margin-top: 20px; padding: 10px; background-color: #3c3f41; border-radius: 5px;">
                <strong>Navigation:</strong>
                <ul>
                    <li><a href="#" onclick="window.terminalProcessCommand('prs'); return false;">Back to Pull Requests</a></li>
                    <li><a href="#" onclick="window.terminalProcessCommand('show ${pr.commits[0]}'); return false;">View Latest Commit</a></li>
                </ul>
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
 * Show Git commit graph visualization
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showGitGraph(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build simplified ASCII graph for terminal
    let graphHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Git Commit Graph</div>
        <div>Git commit graph visualization generated in editor panel.</div>
    `;

    // Set output HTML
    output.innerHTML = graphHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Generate Mermaid Git graph
    const mermaidGraph = generateMermaidGitGraph();

    // Update Git tab content
    updateGitContent(`
        <h1>Repository Commit Graph</h1>
        <p>Visual representation of the commit history and branch structure.</p>

        <div class="mermaid-graph" style="margin-top: 20px;">
            ${mermaidGraph}
        </div>

        <div style="margin-top: 20px; padding: 10px; background-color: #3c3f41; border-radius: 5px;">
            <strong>Legend:</strong>
            <ul>
                <li>Each node represents a commit</li>
                <li>Branch names are shown in <span style="color: #cc7832;">orange</span></li>
                <li>Tags are shown in <span style="color: #6a8759;">green</span></li>
                <li>Main branch is shown with a thicker line</li>
            </ul>
        </div>

        <div style="margin-top: 20px; text-align: center;">
            <a href="#" onclick="window.terminalProcessCommand('log'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">View Commit Log</a>
            <a href="#" onclick="window.terminalProcessCommand('branches'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px;">View Branches</a>
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Generate Mermaid syntax for Git graph
 * @returns {string} - Mermaid Git graph syntax
 */
function generateMermaidGitGraph() {
    // Create a gitGraph Mermaid diagram
    return `gitGraph
       commit id: "5d76af2" tag: "v1.0.0"
       branch "feature/medication-reminders"
       checkout "feature/medication-reminders"
       commit id: "9de42b1"
       checkout main
       branch "bugfix/pet-owner-relationship"
       checkout "bugfix/pet-owner-relationship"
       commit id: "21eb7f4"
       checkout main
       merge "bugfix/pet-owner-relationship"
       commit id: "e8c4d9a" tag: "v1.1.0"
       branch "feature/symptom-tracking"
       checkout "feature/symptom-tracking"
       commit id: "a7c2e09"
       checkout main
       commit id: "f3a5492"`;
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

/**
 * Update Git tab content
 * @param {string} html - HTML content to update
 */
function updateGitContent(html) {
    const gitDetails = document.getElementById('gitDetails');
    if (gitDetails) {
        gitDetails.innerHTML = html;
    }
}

/**
 * Exported methods to interface with the main terminal system
 */
export default {
    /**
     * Start Git viewer mode
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     */
    start: function(terminal, editorArea) {
        initGitViewer(terminal, editorArea);
    },

    /**
     * Process Git viewer input
     * @param {string} command - The entered command
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     * @returns {boolean} - Whether to stay in Git viewer mode
     */
    processInput: function(command, terminal, editorArea) {
        return processGitCommand(command, terminal, editorArea);
    },

    /**
     * Check if Git viewer mode is active
     * @returns {boolean} - Git viewer mode status
     */
    isActive: function() {
        return gitViewerActive;
    }
};

/**
 * Show Git repository status
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showGitStatus(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Get current branch
    const currentBranch = gitRepository.branches.find(branch => branch.isDefault);

    // Build status HTML
    const statusHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Git Status</div>
        <div>On branch <span style="color: #cc7832;">${currentBranch.name}</span></div>
        <div>Your branch is up to date with 'origin/${currentBranch.name}'</div>
        <div style="margin-top: 10px;">Repository: <span style="color: #9876aa;">${gitRepository.name}</span></div>
        <div>Remote: <span style="color: #6a8759;">${gitRepository.remote}</span></div>
        <div>Latest commit: <span style="color: #6897bb;">${currentBranch.lastCommit}</span></div>
        <div style="margin-top: 10px;">Working tree clean</div>
    `;

    // Set output HTML
    output.innerHTML = statusHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update Git tab content
    updateGitContent(`
        <h1>Repository Status</h1>
        <div style="padding: 16px; background-color: #2b2b2b; border-radius: 5px; margin-bottom: 20px;">
            <p><strong>Current Branch:</strong> <span style="color: #cc7832;">${currentBranch.name}</span></p>
            <p><strong>Remote URL:</strong> <a href="${gitRepository.remote}" target="_blank">${gitRepository.remote}</a></p>
            <p><strong>Last Commit:</strong> <a href="#" onclick="window.terminalProcessCommand('show ${currentBranch.lastCommit}'); return false;">${currentBranch.lastCommit}</a></p>
            <p><strong>Branches:</strong> ${gitRepository.branches.length} (<a href="#" onclick="window.terminalProcessCommand('branches'); return false;">view all</a>)</p>
            <p><strong>Pull Requests:</strong> ${gitRepository.pullRequests.filter(pr => pr.status === 'Open').length} open / ${gitRepository.pullRequests.length} total</p>
        </div>

        <h2>Recent Activity</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Commit</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Message</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Author</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Date</th>
            </tr>
            ${gitRepository.commits.slice(0, 3).map(commit => `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><a href="#" onclick="window.terminalProcessCommand('show ${commit.shortHash}'); return false;">${commit.shortHash}</a></td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${commit.message}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${commit.author}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${formatDate(commit.date)}</td>
                </tr>
            `).join('')}
        </table>

        <h2>Commands</h2>
        <p>Use the following commands to explore the repository:</p>
        <ul>
            <li><code>log</code> - View commit history</li>
            <li><code>branches</code> - List all branches</li>
            <li><code>prs</code> - List pull requests</li>
            <li><code>graph</code> - Visualize commit history</li>
        </ul>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show Git commit history
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showGitLog(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build log HTML
    let logHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Git Log</div>
    `;

    // Add each commit to the log
    gitRepository.commits.forEach(commit => {
        const date = new Date(commit.date);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        logHtml += `
            <div style="margin-top: 10px;">
                <div>
                    <span style="color: #cc7832;">commit</span> <span style="color: #6897bb;">${commit.hash}</span>
                    ${commit.isTagged ? `<span style="color: #6a8759;">(tag: ${commit.tag})</span>` : ''}
                </div>
                <div>Author: ${commit.author}</div>
                <div>Date: ${formattedDate}</div>
                <div style="margin-top: 5px; margin-left: 10px;">${commit.message}</div>
            </div>
        `;
    });

    // Set output HTML
    output.innerHTML = logHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update Git tab content
    updateGitContent(`
        <h1>Commit History</h1>
        <p>The commit history for the ${gitRepository.name} repository.</p>

        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Commit</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Message</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Author</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Date</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Branch</th>
            </tr>
            ${gitRepository.commits.map(commit => `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">
                        <a href="#" onclick="window.terminalProcessCommand('show ${commit.shortHash}'); return false;">${commit.shortHash}</a>
                        ${commit.isTagged ? `<br><span style="color: #6a8759; font-size: 0.8em;">${commit.tag}</span>` : ''}
                    </td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${commit.message}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${commit.author}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${formatDate(commit.date)}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><span style="color: #cc7832;">${commit.branch}</span></td>
                </tr>
            `).join('')}
        </table>

        <div style="margin-top: 20px; padding: 10px; background-color: #3c3f41; border-radius: 5px;">
            <strong>View Details:</strong> Type <code>show {commitHash}</code> to see commit details or <code>diff {commitHash}</code> to see changes.
        </div>

        <div style="margin-top: 20px; text-align: center;">
            <a href="#" onclick="window.terminalProcessCommand('graph'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px;">View Commit Graph</a>
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show Git branches
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showGitBranches(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build branches HTML
    let branchesHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Git Branches</div>
    `;

    // Add each branch to the list
    gitRepository.branches.forEach(branch => {
        branchesHtml += `
            <div>
                ${branch.isDefault ? '* ' : '  '}
                <span style="color: ${branch.isDefault ? '#cc7832' : '#6897bb'};">${branch.name}</span>
                ${branch.isDefault ? '<span style="color: #808080;">(current)</span>' : ''}
            </div>
        `;
    });

    // Set output HTML
    output.innerHTML = branchesHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update Git tab content
    updateGitContent(`
        <h1>Repository Branches</h1>
        <p>The branches in the ${gitRepository.name} repository.</p>

        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Branch</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Latest Commit</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Status</th>
            </tr>
            ${gitRepository.branches.map(branch => `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">
                        <span style="color: #cc7832;">${branch.name}</span>
                        ${branch.isDefault ? '<span style="background-color: #214283; color: white; font-size: 0.7em; padding: 2px 5px; border-radius: 3px; margin-left: 8px;">DEFAULT</span>' : ''}
                    </td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><a href="#" onclick="window.terminalProcessCommand('show ${branch.lastCommit}'); return false;">${branch.lastCommit}</a></td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${branch.isDefault ? 'Current' : ''}</td>
                </tr>
            `).join('')}
        </table>

        <h2>Branch Visualization</h2>
        <div style="margin-top: 20px; text-align: center;">
            <a href="#" onclick="window.terminalProcessCommand('graph'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px;">Show Commit Graph</a>
        </div>

        <h2>Pull Requests</h2>
        <p>The following pull requests involve these branches:</p>
        <ul>
            ${gitRepository.pullRequests.map(pr =>
                `<li><strong>${pr.sourceBranch} → ${pr.targetBranch}:</strong> <a href="#" onclick="window.terminalProcessCommand('pr ${pr.id}'); return false;">${pr.title}</a> (${pr.status})</li>`
            ).join('')}
        </ul>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show Git tags
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showGitTags(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build tags HTML
    let tagsHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Git Tags</div>
    `;

    // Add each tag to the list
    gitRepository.tags.forEach(tag => {
        tagsHtml += `
            <div>
                <span style="color: #6a8759;">${tag.name}</span>
                <span style="color: #808080;">(${tag.commit})</span>
                <span style="color: #6897bb;">${tag.date}</span>
            </div>
        `;
    });

    // Set output HTML
    output.innerHTML = tagsHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update Git tab content
    updateGitContent(`
        <h1>Repository Tags</h1>
        <p>The tags in the ${gitRepository.name} repository.</p>

        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Tag</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Commit</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Date</th>
            </tr>
            ${gitRepository.tags.map(tag => {
                // Find associated commit
                const commit = gitRepository.commits.find(c => c.hash === tag.commit);
                return `
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #444;"><span style="color: #6a8759;">${tag.name}</span></td>
                        <td style="padding: 8px; border-bottom: 1px solid #444;"><a href="#" onclick="window.terminalProcessCommand('show ${tag.commit}'); return false;">${tag.commit}</a></td>
                        <td style="padding: 8px; border-bottom: 1px solid #444;">${tag.date}</td>
                    </tr>
                `;
            }).join('')}
        </table>

        <h2>Release Notes</h2>
        <div style="padding: 16px; background-color: #2b2b2b; border-radius: 5px; margin-top: 20px;">
            <h3>v1.1.0 (Latest Release)</h3>
            <p>Released on February 28, 2024</p>
            <ul>
                <li>Added health record trends visualization</li>
                <li>Implemented filtering for health records</li>
                <li>Improved mobile responsiveness</li>
                <li>Bug fixes and performance improvements</li>
            </ul>

            <h3>v1.0.0 (Initial Release)</h3>
            <p>Released on January 15, 2024</p>
            <ul>
                <li>Core functionality for pet health management</li>
                <li>Owner account management</li>
                <li>Basic health record tracking</li>
                <li>Mobile friendly interface</li>
            </ul>
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show commit details
 * @param {string} commitHash - Hash of the commit to show
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showCommitDetails(commitHash, terminal, editorArea) {
    // Find commit by hash (full or short)
    const commit = gitRepository.commits.find(c =>
        c.hash === commitHash || c.shortHash === commitHash
    );

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!commit) {
        // Commit not found
        output.innerHTML = `<span style="color: #cc0000;">Commit '${commitHash}' not found.</span>`;
    } else {
        // Format date
        const date = new Date(commit.date);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        // Build commit details HTML
        let commitHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Commit: ${commit.hash}</div>
            <div>Author: ${commit.author}</div>
            <div>Date: ${formattedDate}</div>
            <div>Branch: <span style="color: #cc7832;">${commit.branch}</span></div>
            ${commit.isTagged ? `<div>Tag: <span style="color: #6a8759;">${commit.tag}</span></div>` : ''}
            <div style="margin: 10px 0; padding: 5px; background-color: #2b2b2b;">${commit.message}</div>
            <div>
                <span style="color: #6a8759;">+${commit.changes.additions}</span> insertions,
                <span style="color: #cc0000;">-${commit.changes.deletions}</span> deletions in
                ${commit.changes.files} files
            </div>
            <div style="margin-top: 10px;">Type <code>diff ${commit.shortHash}</code> to see changes</div>
        `;

        // Set output HTML
        output.innerHTML = commitHtml;

        // Update Git tab content
        updateGitContent(`
            <h1>Commit Details</h1>
            <div style="padding: 16px; background-color: #2b2b2b; border-radius: 5px; margin-bottom: 20px;">
                <p><strong>Commit:</strong> ${commit.hash} ${commit.isTagged ? `<span style="color: #6a8759; margin-left: 10px;">${commit.tag}</span>` : ''}</p>
                <p><strong>Author:</strong> ${commit.author}</p>
                <p><strong>Date:</strong> ${formatDate(commit.date)}</p>
                <p><strong>Branch:</strong> <span style="color: #cc7832;">${commit.branch}</span></p>
                <p><strong>Message:</strong> ${commit.message}</p>
            </div>

            <h2>Changes</h2>
            <p>
                <span style="color: #6a8759;">+${commit.changes.additions}</span> insertions,
                <span style="color: #cc0000;">-${commit.changes.deletions}</span> deletions in
                ${commit.changes.files} files
            </p>

            <div style="margin: 20px 0; text-align: center;">
                <a href="#" onclick="window.terminalProcessCommand('diff ${commit.shortHash}'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px;">View Changes</a>
            </div>

            ${gitRepository.diffs[commit.shortHash] ?
                `<h2>Files Changed</h2>
                <ul>
                    ${gitRepository.diffs[commit.shortHash].files.map(file =>
                        `<li><code>${file.filename}</code> (${file.status}, <span style="color: #6a8759;">+${file.additions}</span> <span style="color: #cc0000;">-${file.deletions}</span>)</li>`
                    ).join('')}
                </ul>`
                : ''
            }

            <div style="margin-top: 20px; padding: 10px; background-color: #3c3f41; border-radius: 5px;">
                <strong>Navigation:</strong>
                <ul>
                    <li><a href="#" onclick="window.terminalProcessCommand('log'); return false;">Back to Commit Log</a></li>
                    <li><a href="#" onclick="window.terminalProcessCommand('diff ${commit.shortHash}'); return false;">View File Changes</a></li>
                </ul>
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
 * Show commit diff
 * @param {string} commitHash - Hash of the commit to show diff for
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showCommitDiff(commitHash, terminal, editorArea) {
    // Find commit by hash (full or short)
    const commit = gitRepository.commits.find(c =>
        c.hash === commitHash || c.shortHash === commitHash
    );

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!commit) {
        // Commit not found
        output.innerHTML = `<span style="color: #cc0000;">Commit '${commitHash}' not found.</span>`;
    } else if (!gitRepository.diffs[commit.shortHash]) {
        // Diff not found
        output.innerHTML = `<span style="color: #cc0000;">Diff for commit '${commitHash}' not available.</span>`;
    } else {
        // Get diff data
        const diff = gitRepository.diffs[commit.shortHash];

        // Build diff HTML (simplified for terminal)
        let diffHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Diff for commit: ${commit.shortHash}</div>
            <div style="margin-bottom: 10px;">${diff.title}</div>
        `;

        // Add file summaries
        diffHtml += `<div style="color: #cc7832; margin-top: 10px;">Files changed:</div>`;
        diff.files.forEach(file => {
            diffHtml += `
                <div>
                    ${file.status === 'added' ? 'A' : file.status === 'modified' ? 'M' : file.status === 'deleted' ? 'D' : ' '}
                    ${file.filename}
                    (<span style="color: #6a8759;">+${file.additions}</span>, <span style="color: #cc0000;">-${file.deletions}</span>)
                </div>
            `;
        });

        // Show simplified diff content
        diffHtml += `
            <div style="color: #cc7832; margin-top: 10px;">Viewing full changes in editor panel</div>
        `;

        // Set output HTML
        output.innerHTML = diffHtml;

        // Update Git tab with detailed diff
        updateGitContent(`
            <h1>Commit Changes</h1>
            <div style="padding: 16px; background-color: #2b2b2b; border-radius: 5px; margin-bottom: 20px;">
                <p><strong>Commit:</strong> <a href="#" onclick="window.terminalProcessCommand('show ${commit.shortHash}'); return false;">${commit.shortHash}</a></p>
                <p><strong>Title:</strong> ${diff.title}</p>
                <p><strong>Changes:</strong> ${diff.files.length} files changed, with <span style="color: #6a8759;">${diff.files.reduce((sum, file) => sum + file.additions, 0)}</span> additions and <span style="color: #cc0000;">${diff.files.reduce((sum, file) => sum + file.deletions, 0)}</span> deletions</p>
            </div>

            ${diff.files.map(file => `
                <div style="margin-bottom: 30px;">
                    <h3>
                        ${file.status === 'added' ? '<span style="color: #6a8759;">Added:</span>' :
                         file.status === 'modified' ? '<span style="color: #cc7832;">Modified:</span>' :
                         file.status === 'deleted' ? '<span style="color: #cc0000;">Deleted:</span>' : ''}
                        ${file.filename}
                    </h3>
                    <div style="background-color: #2b2b2b; border-radius: 5px; padding: 10px; margin-top: 10px; overflow-x: auto;">
                        <pre style="margin: 0;">${formatDiffContent(file.content)}</pre>
                    </div>
                </div>
            `).join('')}

            <div style="margin-top: 20px; padding: 10px; background-color: #3c3f41; border-radius: 5px;">
                <strong>Navigation:</strong>
                <ul>
                    <li><a href="#" onclick="window.terminalProcessCommand('show ${commit.shortHash}'); return false;">Back to Commit Details</a></li>
                    <li><a href="#" onclick="window.terminalProcessCommand('log'); return false;">View Commit Log</a></li>
                </ul>
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
 * Format diff content with syntax highlighting
 * @param {string} content - Diff content to format
 * @returns {string} - Formatted HTML
 */
function formatDiffContent(content) {
    if (!content) return '';

    // Escape HTML
    let html = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Highlight diff lines
    html = html.split('\n').map(line => {
        if (line.startsWith('+')) {
            return `<span style="color: #6a8759; background-color: rgba(106, 135, 89, 0.2);">${line}</span>`;
        } else if (line.startsWith('-')) {
            return `<span style="color: #cc0000; background-color: rgba(204, 0, 0, 0.2);">${line}</span>`;
        } else if (line.startsWith('@')) {
            return `<span style="color: #6897bb; background-color: rgba(104, 151, 187, 0.2);">${line}</span>`;
        } else {
            return line;
        }
    }).join('\n');

    return html;
}

/**
 * Show pull requests
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showPullRequests(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build PRs HTML
    let prsHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Pull Requests</div>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">ID</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Title</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Status</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Author</th>
            </tr>
    `;

    // Add each PR to the table
    gitRepository.pullRequests.forEach(pr => {
        const statusColor = pr.status === 'Open' ? '#6a8759' : pr.status === 'Merged' ? '#6897bb' : '#cc0000';

        prsHtml += `
            <tr>
                <td style="padding: 5px; border-bottom: 1px solid #444;">#${pr.id}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${pr.title}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;"><span style="color: ${statusColor};">${pr.status}</span></td>
                <td style="padding: 5px; border-bottom:/**
 * Git Integration Visualization Module
 *
 * Provides interactive Git repository visualization with commit history,
 * branch management, code diff review, and PR visualization features.
 */

// Track if Git viewer mode is active
let gitViewerActive = false;

// Mock Git repository data
const gitRepository = {
    name: 'PetPals',
    remote: 'https://github.com/barretttaylor95/petpals',
    branches: [
        {
            name: 'main',
            isDefault: true,
            lastCommit: 'f3a5492'
        },
        {
            name: 'feature/symptom-tracking',
            isDefault: false,
            lastCommit: 'a7c2e09'
        },
        {
            name: 'feature/medication-reminders',
            isDefault: false,
            lastCommit: '9de42b1'
        },
        {
            name: 'bugfix/pet-owner-relationship',
            isDefault: false,
            lastCommit: '21eb7f4'
        }
    ],
    tags: [
        { name: 'v1.0.0', commit: '5d76af2', date: '2024-01-15' },
        { name: 'v1.1.0', commit: 'e8c4d9a', date: '2024-02-28' }
    ],
    commits: [
        {
            hash: 'f3a5492',
            shortHash: 'f3a5492',
            message: 'Implement offline data synchronization',
            author: 'Barrett Taylor',
            date: '2024-03-10T14:25:00Z',
            branch: 'main',
            changes: { additions: 156, deletions: 43, files: 12 }
        },
        {
            hash: 'e8c4d9a',
            shortHash: 'e8c4d9a',
            message: 'Release v1.1.0: Add health record trends and filtering',
            author: 'Barrett Taylor',
            date: '2024-02-28T10:15:00Z',
            branch: 'main',
            changes: { additions: 89, deletions: 27, files: 8 },
            isTagged: true,
            tag: 'v1.1.0'
        },
        {
            hash: 'a7c2e09',
            shortHash: 'a7c2e09',
            message: 'Add interactive symptom selection and tracking',
            author: 'Barrett Taylor',
            date: '2024-02-25T15:45:00Z',
            branch: 'feature/symptom-tracking',
            changes: { additions: 215, deletions: 18, files: 14 }
        },
        {
            hash: '21eb7f4',
            shortHash: '21eb7f4',
            message: 'Fix cascade delete behavior for pet-owner relationship',
            author: 'Barrett Taylor',
            date: '2024-02-20T09:30:00Z',
            branch: 'bugfix/pet-owner-relationship',
            changes: { additions: 15, deletions: 7, files: 3 }
        },
        {
            hash: '9de42b1',
            shortHash: '9de42b1',
            message: 'Add medication schedule notifications',
            author: 'Barrett Taylor',
            date: '2024-02-15T11:20:00Z',
            branch: 'feature/medication-reminders',
            changes: { additions: 178, deletions: 12, files: 9 }
        },
        {
            hash: '5d76af2',
            shortHash: '5d76af2',
            message: 'Initial release: v1.0.0',
            author: 'Barrett Taylor',
            date: '2024-01-15T16:40:00Z',
            branch: 'main',
            changes: { additions: 1542, deletions: 0, files: 56 },
            isTagged: true,
            tag: 'v1.0.0'
        }
    ],
    pullRequests: [
        {
            id: 12,
            title: 'Add symptom tracking feature',
            description: 'Implements interactive symptom tracking with history and visualization',
            sourceBranch: 'feature/symptom-tracking',
            targetBranch: 'main',
            author: 'Barrett Taylor',
            reviewers: ['Jane Smith', 'John Doe'],
            status: 'Open',
            createdAt: '2024-02-26T09:15:00Z',
            updatedAt: '2024-03-08T14:30:00Z',
            commits: ['a7c2e09', '3b7e192', 'c9f1a35'],
            comments: [
                {
                    author: 'Jane Smith',
                    date: '2024-02-28T11:25:00Z',
                    content: 'Please add appropriate error handling for API failures.',
                    resolved: true
                },
                {
                    author: 'Barrett Taylor',
                    date: '2024-02-28T13:40:00Z',
                    content: 'Added error handling as requested.',
                    resolved: true
                },
                {
                    author: 'John Doe',
                    date: '2024-03-01T09:10:00Z',
                    content: 'The symptom selection UI could use more clear labels.',
                    resolved: false
                }
            ]
        },
        {
            id: 11,
            title: 'Fix pet-owner cascade delete issue',
            description: 'Resolves the bug where deleting an owner doesn\'t properly handle associated pets',
            sourceBranch: 'bugfix/pet-owner-relationship',
            targetBranch: 'main',
            author: 'Barrett Taylor',
            reviewers: ['Jane Smith'],
            status: 'Merged',
            createdAt: '2024-02-20T10:15:00Z',
            updatedAt: '2024-02-21T15:30:00Z',
            mergedAt: '2024-02-21T15:30:00Z',
            commits: ['21eb7f4'],
            comments: [
                {
                    author: 'Jane Smith',
                    date: '2024-02-20T14:25:00Z',
                    content: 'Looks good! Please add a test case for this scenario.',
                    resolved: true
                },
                {
                    author: 'Barrett Taylor',
                    date: '2024-02-21T09:40:00Z',
                    content: 'Added test case that verifies the fix.',
                    resolved: true
                }
            ]
        },
        {
            id: 10,
            title: 'Implement medication reminders',
            description: 'Adds scheduling and notification system for pet medications',
            sourceBranch: 'feature/medication-reminders',
            targetBranch: 'main',
            author: 'Barrett Taylor',
            reviewers: ['John Doe', 'Jane Smith'],
            status: 'Closed',
            createdAt: '2024-02-16T08:45:00Z',
            updatedAt: '2024-02-17T16:20:00Z',
            closedAt: '2024-02-17T16:20:00Z',
            commits: ['9de42b1'],
            comments: [
                {
                    author: 'John Doe',
                    date: '2024-02-16T13:15:00Z',
                    content: 'Implementation looks overcomplicated. Can we simplify the notification scheduling?',
                    resolved: false
                },
                {
                    author: 'Barrett Taylor',
                    date: '2024-02-16T15:30:00Z',
                    content: 'The complexity is needed to handle recurring notifications with different intervals.',
                    resolved: false
                },
                {
                    author: 'Jane Smith',
                    date: '2024-02-17T10:45:00Z',
                    content: 'I agree with John, let\'s refactor this to use the existing notification framework.',
                    resolved: false
                }
            ]
        }
    ],
    diffs: {
        'a7c2e09': {
            title: 'Add interactive symptom selection and tracking',
            files: [
                {
                    filename: 'src/main/java/com/petpals/controller/SymptomController.java',
                    status: 'added',
                    additions: 86,
                    deletions: 0,
                    content: `package com.petpals.controller;

import com.petpals.model.Symptom;
import com.petpals.model.Pet;
import com.petpals.service.SymptomService;
import com.petpals.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/symptoms")
public class SymptomController {

    private final SymptomService symptomService;
    private final PetService petService;

    @Autowired
    public SymptomController(SymptomService symptomService, PetService petService) {
        this.symptomService = symptomService;
        this.petService = petService;
    }

    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<Symptom>> getSymptomsByPetId(@PathVariable Long petId) {
        Optional<Pet> pet = petService.findById(petId);
        if (!pet.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(symptomService.findByPetId(petId));
    }

    @PostMapping("/pet/{petId}")
    public ResponseEntity<Symptom> addSymptomToPet(
            @PathVariable Long petId,
            @RequestBody Symptom symptom) {

        Optional<Pet> pet = petService.findById(petId);
        if (!pet.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        symptom.setPet(pet.get());
        Symptom savedSymptom = symptomService.save(symptom);

        return ResponseEntity.ok(savedSymptom);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSymptom(@PathVariable Long id) {
        if (!symptomService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        symptomService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getSymptomCategories() {
        return ResponseEntity.ok(symptomService.findAllCategories());
    }

    @GetMapping("/trends/pet/{petId}")
    public ResponseEntity<Map<String, Integer>> getSymptomTrendsForPet(@PathVariable Long petId) {
        Optional<Pet> pet = petService.findById(petId);
        if (!pet.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(symptomService.getSymptomFrequencyByCategory(petId));
    }
}`
                },
                {
                    filename: 'src/main/java/com/petpals/model/Symptom.java',
                    status: 'added',
                    additions: 64,
                    deletions: 0,
                    content: `package com.petpals.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "symptom")
@Data
public class Symptom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String category;

    @Column(length = 1000)
    private String description;

    @Column(name = "severity_level")
    private Integer severityLevel;

    @NotNull
    @Column(name = "observation_date", nullable = false)
    private LocalDateTime observationDate;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    @JsonIgnore
    private Pet pet;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}`
                },
                {
                    filename: 'src/main/java/com/petpals/service/SymptomService.java',
                    status: 'added',
                    additions: 65,
                    deletions: 0,
                    content: `package com.petpals.service;

import com.petpals.model.Symptom;
import com.petpals.repository.SymptomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SymptomService {

    private final SymptomRepository symptomRepository;

    @Autowired
    public SymptomService(SymptomRepository symptomRepository) {
        this.symptomRepository = symptomRepository;
    }

    public List<Symptom> findByPetId(Long petId) {
        return symptomRepository.findByPetIdOrderByObservationDateDesc(petId);
    }

    public Symptom save(Symptom symptom) {
        return symptomRepository.save(symptom);
    }

    public boolean existsById(Long id) {
        return symptomRepository.existsById(id);
    }

    public void deleteById(Long id) {
        symptomRepository.deleteById(id);
    }

    public List<String> findAllCategories() {
        return symptomRepository.findDistinctCategories();
    }

    public Map<String, Integer> getSymptomFrequencyByCategory(Long petId) {
        List<Symptom> symptoms = findByPetId(petId);

        Map<String, Integer> frequencyMap = new HashMap<>();

        for (Symptom symptom : symptoms) {
            String category = symptom.getCategory();
            frequencyMap.put(category, frequencyMap.getOrDefault(category, 0) + 1);
        }

        return frequencyMap;
    }
}`
                }
            ]
        },
        '21eb7f4': {
            title: 'Fix cascade delete behavior for pet-owner relationship',
            files: [
                {
                    filename: 'src/main/java/com/petpals/model/Owner.java',
                    status: 'modified',
                    additions: 8,
                    deletions: 3,
                    content: `package com.petpals.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "owner")
@Data
public class Owner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    private String address;

-   @OneToMany(mappedBy = "owner")
+   @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pet> pets = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

+   /**
+    * Helper method to add a pet and maintain relationship consistency
+    */
+   public void addPet(Pet pet) {
+       pets.add(pet);
+       pet.setOwner(this);
+   }
+
+   /**
+    * Helper method to remove a pet and maintain relationship consistency
+    */
+   public void removePet(Pet pet) {
+       pets.remove(pet);
+       pet.setOwner(null);
+   }
}`
                },
                {
                    filename: 'src/main/java/com/petpals/service/OwnerService.java',
                    status: 'modified',
                    additions: 7,
                    deletions: 4,
                    content: `package com.petpals.service;

import com.petpals.model.Owner;
import com.petpals.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
+import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OwnerService {

    private final OwnerRepository ownerRepository;
-   private final PetService petService;

    @Autowired
-   public OwnerService(OwnerRepository ownerRepository, PetService petService) {
+   public OwnerService(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
-       this.petService = petService;
    }

    public List<Owner> findAll() {
        return ownerRepository.findAll();
    }

    public Optional<Owner> findById(Long id) {
        return ownerRepository.findById(id);
    }

    public Owner save(Owner owner) {
        return ownerRepository.save(owner);
    }

+   @Transactional
    public void deleteById(Long id) {
-       // We need to delete all pets of this owner first
-       petService.deleteByOwnerId(id);
        ownerRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return ownerRepository.existsById(id);
    }
}`
                }
            ]
        }
    }
};

/**
 * Initialize Git Viewer Mode
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function initGitViewer(terminal, editorArea) {
    gitViewerActive = true;

    // Create welcome message in terminal
    const welcomeOutput = document.createElement('div');
    welcomeOutput.className = 'terminal-output';
    welcomeOutput.innerHTML = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Git Repository Viewer</div>
        <div>This interactive tool allows you to explore the PetPals Git repository.</div>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">status</span>: Show repository status</div>
        <div>- <span style="color: #cc7832">log</span>: Show commit history</div>
        <div>- <span style="color: #cc7832">branches</span>: List all branches</div>
        <div>- <span style="color: #cc7832">show {commitHash}</span>: Show commit details</div>
        <div>- <span style="color: #cc7832">diff {commitHash}</span>: Show commit changes</div>
        <div>- <span style="color: #cc7832">prs</span>: List pull requests</div>
        <div>- <span style="color: #cc7832">pr {id}</span>: Show pull request details</div>
        <div>- <span style="color: #cc7832">tags</span>: List all tags</div>
        <div>- <span style="color: #cc7832">graph</span>: Show commit graph</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit Git viewer mode</div>
        <div style="margin-top: 10px; color: #808080;">Type 'status' to begin exploring the repository</div>
    `;

    // Update prompt style for Git mode
    updateGitPrompt(terminal);

    // Insert welcome message before the prompt
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(welcomeOutput, lastPrompt);

    // Create Git tab in editor area if it doesn't exist
    createGitTab(editorArea);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Update the terminal prompt to Git mode style
 * @param {Object} terminal - The terminal DOM element
 */
function updateGitPrompt(terminal) {
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        // Change prompt style for Git mode
        const userSpan = lastPrompt.querySelector('.terminal-user');
        if (userSpan) userSpan.textContent = 'git';

        const machineSpan = lastPrompt.querySelector('.terminal-machine');
        if (machineSpan) machineSpan.textContent = 'main';

        const directorySpan = lastPrompt.querySelector('.terminal-directory');
        if (directorySpan) directorySpan.textContent = 'petpals';

        const symbolSpan = lastPrompt.querySelector('.terminal-symbol');
        if (symbolSpan) symbolSpan.textContent = '>';
    }
}

/**
 * Create Git tab in editor area
 * @param {Object} editorArea - The editor area DOM element
 */
function createGitTab(editorArea) {
    // Check if tab already exists
    if (document.getElementById('gitTab')) {
        // Just activate it
        activateGitTab();
        return;
    }

    // Create new tab
    const tabsContainer = editorArea.querySelector('.editor-tabs');
    const gitTab = document.createElement('div');
    gitTab.className = 'editor-tab';
    gitTab.id = 'gitTab';
    gitTab.innerHTML = `
        <i class="fas fa-code-branch"></i>
        <span class="tab-title">petpals-repo</span>
        <i class="fas fa-times close-tab"></i>
    `;

    // Create content
    const contentContainer = editorArea.querySelector('.editor-content');
    const gitContent = document.createElement('div');
    gitContent.className = 'code-content markdown-content git-code';
    gitContent.id = 'gitContent';
    gitContent.innerHTML = `
        <div class="markdown-container">
            <h1>PetPals Git Repository</h1>
            <p>Explore the version control history and structure of the PetPals project.</p>

            <div id="gitDetails">
                <h2>Repository Overview</h2>
                <p>Use terminal commands to explore the Git repository:</p>
                <ul>
                    <li>Type <code>status</code> to see current repository status</li>
                    <li>Type <code>log</code> to see commit history</li>
                    <li>Type <code>branches</code> to view all branches</li>
                </ul>
            </div>
        </div>
    `;

    // Add tab and content to DOM
    tabsContainer.appendChild(gitTab);
    contentContainer.appendChild(gitContent);

    // Add event listener to tab
    gitTab.addEventListener('click', activateGitTab);

    // Add event listener to close button
    const closeBtn = gitTab.querySelector('.close-tab');
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        gitTab.style.display = 'none';
        if (gitTab.classList.contains('active')) {
            // Show about tab if Git tab is closed
            const aboutTab = document.getElementById('aboutTab');
            if (aboutTab) {
                aboutTab.click();
            }
        }
    });

    // Activate the tab
    activateGitTab();
}

/**
 * Activate the Git tab
 */
function activateGitTab() {
    // Deactivate all tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all content
    document.querySelectorAll('.code-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activate Git tab and content
    const gitTab = document.getElementById('gitTab');
    const gitContent = document.getElementById('gitContent');

    if (gitTab && gitContent) {
        gitTab.classList.add('active');
        gitTab.style.display = 'flex';
        gitContent.classList.add('active');
    }
}

/**
 * Process Git viewer commands
 * @param {string} command - Command to process
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 * @returns {boolean} - Whether to continue in Git viewer mode
 */
function processGitCommand(command, terminal, editorArea) {
    const cmd = command.trim().toLowerCase();

    // Check for exit command
    if (cmd === 'exit') {
        const exitMsg = document.createElement('div');
        exitMsg.className = 'terminal-output';
        exitMsg.textContent = 'Exiting Git viewer mode...';

        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        terminal.insertBefore(exitMsg, lastPrompt);

        // Reset terminal style
        gitViewerActive = false;
        return false;
    }

    // Handle status command
    if (cmd === 'status') {
        showGitStatus(terminal, editorArea);
        return true;
    }

    // Handle log command
    if (cmd === 'log') {
        showGitLog(terminal, editorArea);
        return true;
    }

    // Handle branches command
    if (cmd === 'branches') {
        showGitBranches(terminal, editorArea);
        return true;
    }

    // Handle tags command
    if (cmd === 'tags') {
        showGitTags(terminal, editorArea);
        return true;
    }

    // Handle graph command
    if (cmd === 'graph') {
        showGitGraph(terminal, editorArea);
        return true;
    }

    // Handle show command
    if (cmd.startsWith('show ')) {
        const commitHash = cmd.substring(5).trim();
        showCommitDetails(commitHash, terminal, editorArea);
        return true;
    }

    // Handle diff command
    if (cmd.startsWith('diff ')) {
        const commitHash = cmd.substring(5).trim();
        showCommitDiff(commitHash, terminal, editorArea);
        return true;
    }

    // Handle prs command
    if (cmd === 'prs') {
        showPullRequests(terminal, editorArea);
        return true;
    }

    // Handle pr command
    if (cmd.startsWith('pr ')) {
        const prId = parseInt(cmd.substring(3).trim(), 10);
        showPullRequestDetails(prId, terminal, editorArea);
        return true;
    }

    // Handle unknown command
    const unknownMsg = document.createElement('div');
    unknownMsg.className = 'terminal-output';
    unknownMsg.innerHTML = `
        <span style="color: #cc0000;">Unknown command: ${command}</span>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">status</span>: Show repository status</div>
        <div>- <span style="color: #cc7832">log</span>: Show commit history</div>
        <div>- <span style="color: #cc7832">branches</span>: List all branches</div>
        <div>- <span style="color: #cc7832">show {commitHash}</span>: Show commit details</div>
        <div>- <span style="color: #cc7832">diff {commitHash}</span>: Show commit changes</div>
        <div>- <span style="color: #cc7832">prs</span>: List pull requests</div>
        <div>- <span style="color: #cc7832">pr {id}</span>: Show pull request details</div>
        <div>- <span style="color: #cc7832">tags</span>: List all tags</div>
        <div>- <span style="color: #cc7832">graph</span>: Show commit graph</div>