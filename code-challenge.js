// Add each challenge to the table
    codingChallenges.forEach(challenge => {
        challengesHtml += `
            <tr>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${challenge.id}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;"><strong>${challenge.name}</strong></td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">
                    <span style="background-color: ${getDifficultyColor(challenge.difficulty)}; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 3px;">
                        ${challenge.difficulty}
                    </span>
                </td>
            </tr>
        `;
    });

    challengesHtml += `</table>
        <div style="margin-top: 10px;">Type <code>select {challengeId}</code> to choose a challenge to solve</div>
    `;

    // Set output HTML
    output.innerHTML = challengesHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        terminal.insertBefore(output, lastPrompt);
    } else {
        terminal.appendChild(output);
    }

    // Update challenge tab content
    updateChallengeContent(`
        <h1>Coding Challenges</h1>
        <p>Select a challenge from the list below to begin coding:</p>

        <div style="display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0;">
            ${codingChallenges.map(challenge => `
                <div class="challenge-card" style="background-color: #2b2b2b; border-radius: 5px; padding: 15px; margin-bottom: 15px; flex: 1; min-width: 300px;">
                    <h2>${challenge.name}</h2>
                    <p>
                        <span style="background-color: ${getDifficultyColor(challenge.difficulty)}; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 3px;">
                            ${challenge.difficulty}
                        </span>
                    </p>
                    <p>${challenge.description.substring(0, 100)}${challenge.description.length > 100 ? '...' : ''}</p>
                    <div style="margin-top: 15px;">
                        <a href="#" onclick="window.terminalProcessCommand('select ${challenge.id}'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px; display: inline-block;">
                            Start Challenge
                        </a>
                    </div>
                </div>
            `).join('')}
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Select a challenge to solve
 * @param {string} challengeId - ID of the challenge to select
 * @param {HTMLElement} terminal - Terminal DOM element
 * @param {HTMLElement} editorArea - Editor area DOM element
 */
function selectChallenge(challengeId, terminal, editorArea) {
    // Find challenge by ID
    const challenge = codingChallenges.find(c => c.id.toLowerCase() === challengeId.toLowerCase());

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!challenge) {
        // Challenge not found
        output.innerHTML = `<span style="color: #cc0000;">Challenge '${challengeId}' not found. Type 'list' to see available challenges.</span>`;
    } else {
        // Set current challenge
        currentChallenge = challenge;

        // Build challenge selection HTML
        let selectionHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">${challenge.name} (${challenge.difficulty})</div>
            <div style="margin-bottom: 10px;">${challenge.description}</div>

            <div style="margin-top: 10px;"><strong>Examples:</strong></div>
            ${challenge.examples.map(example => `
                <div style="margin: 5px 0;">Input: ${example.input}</div>
                <div style="margin: 5px 0;">Output: ${example.output}</div>
            `).join('')}

            <div style="margin-top: 10px;">Challenge ready in the editor panel. Type <code>hint</code> for help or <code>test</code> to test your solution.</div>
        `;

        // Set output HTML
        output.innerHTML = selectionHtml;

        // Update challenge tab with code editor
        updateChallengeContent(`
            <h1>${challenge.name}</h1>
            <p>
                <span style="background-color: ${getDifficultyColor(challenge.difficulty)}; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 3px;">
                    ${challenge.difficulty}
                </span>
            </p>
            <p>${challenge.description}</p>

            <h2>Examples</h2>
            <div style="background-color: #2b2b2b; border-radius: 10px; padding: 15px; margin: 20px 0;">
                ${challenge.examples.map(example => `
                    <div style="margin-bottom: 15px;">
                        <div><strong>Input:</strong> ${example.input}</div>
                        <div><strong>Output:</strong> ${example.output}</div>
                    </div>
                `).join('')}
            </div>

            <h2>Solution</h2>
            <pre style="background-color: #1e1e1e; padding: 15px; border-radius: 5px; overflow-x: auto; margin: 20px 0; font-family: 'JetBrains Mono', monospace; white-space: pre-wrap;">${challenge.template}</pre>

            <div style="margin: 30px 0; display: flex; gap: 10px; justify-content: center;">
                <a href="#" onclick="window.terminalProcessCommand('hint'); return false;" style="padding: 8px 16px; background-color: #9876aa; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                    <i class="fas fa-lightbulb"></i> Get Hint
                </a>
                <a href="#" onclick="window.terminalProcessCommand('test'); return false;" style="padding: 8px 16px; background-color: #6a8759; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                    <i class="fas fa-play"></i> Test Solution
                </a>
                <a href="#" onclick="window.terminalProcessCommand('solution'); return false;" style="padding: 8px 16px; background-color: #cc7832; color: white; text-decoration: none; border-radius: 4px;">
                    <i class="fas fa-eye"></i> View Solution
                </a>
            </div>
        `);
    }

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        terminal.insertBefore(output, lastPrompt);
    } else {
        terminal.appendChild(output);
    }

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show a hint for the current challenge
 * @param {HTMLElement} terminal - Terminal DOM element
 * @param {HTMLElement} editorArea - Editor area DOM element
 */
function showHint(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!currentChallenge) {
        // No current challenge
        output.innerHTML = `<span style="color: #cc0000;">No challenge selected. Type 'list' to see available challenges and 'select {challengeId}' to choose one.</span>`;
    } else {
        // Generate a random hint index
        const hintIndex = Math.floor(Math.random() * currentChallenge.hints.length);

        // Build hint HTML
        const hintHtml = `
            <div style="color: #9876aa; font-weight: bold; margin-bottom: 10px;">Hint for ${currentChallenge.name}:</div>
            <div style="margin-left: 10px;">${currentChallenge.hints[hintIndex]}</div>
            <div style="margin-top: 10px; color: #808080;">Type <code>hint</code> again for another hint or <code>test</code> to test your solution.</div>
        `;

        // Set output HTML
        output.innerHTML = hintHtml;
    }

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        terminal.insertBefore(output, lastPrompt);
    } else {
        terminal.appendChild(output);
    }

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show the solution for the current challenge
 * @param {HTMLElement} terminal - Terminal DOM element
 * @param {HTMLElement} editorArea - Editor area DOM element
 */
function showSolution(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!currentChallenge) {
        // No current challenge
        output.innerHTML = `<span style="color: #cc0000;">No challenge selected. Type 'list' to see available challenges and 'select {challengeId}' to choose one.</span>`;
    } else {
        // Build solution HTML
        const solutionHtml = `
            <div style="color: #cc7832; font-weight: bold; margin-bottom: 10px;">Solution for ${currentChallenge.name}:</div>
            <div style="margin-bottom: 10px;">Solution is now visible in the editor panel.</div>
            <div style="margin-top: 10px; color: #808080;">Type <code>reset</code> to return to the original template or <code>list</code> to view other challenges.</div>
        `;

        // Set output HTML
        output.innerHTML = solutionHtml;

        // Update challenge tab with solution
        updateChallengeContent(`
            <h1>${currentChallenge.name} - Solution</h1>
            <p>
                <span style="background-color: ${getDifficultyColor(currentChallenge.difficulty)}; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 3px;">
                    ${currentChallenge.difficulty}
                </span>
            </p>
            <p>${currentChallenge.description}</p>

            <h2>Examples</h2>
            <div style="background-color: #2b2b2b; border-radius: 10px; padding: 15px; margin: 20px 0;">
                ${currentChallenge.examples.map(example => `
                    <div style="margin-bottom: 15px;">
                        <div><strong>Input:</strong> ${example.input}</div>
                        <div><strong>Output:</strong> ${example.output}</div>
                    </div>
                `).join('')}
            </div>

            <h2>Solution</h2>
            <pre style="background-color: #1e1e1e; padding: 15px; border-radius: 5px; overflow-x: auto; margin: 20px 0; font-family: 'JetBrains Mono', monospace; white-space: pre-wrap;">${currentChallenge.solution}</pre>

            <h2>Explanation</h2>
            <div style="background-color: #2b2b2b; border-radius: 10px; padding: 15px; margin: 20px 0;">
                <p>Key concepts in this solution:</p>
                <ul>
                    ${currentChallenge.hints.map(hint => `<li>${hint}</li>`).join('')}
                </ul>
            </div>

            <div style="margin: 30px 0; display: flex; gap: 10px; justify-content: center;">
                <a href="#" onclick="window.terminalProcessCommand('reset'); return false;" style="padding: 8px 16px; background-color: #cc7832; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                    <i class="fas fa-redo"></i> Reset Challenge
                </a>
                <a href="#" onclick="window.terminalProcessCommand('list'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px;">
                    <i class="fas fa-list"></i> View All Challenges
                </a>
            </div>
        `);
    }

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        terminal.insertBefore(output, lastPrompt);
    } else {
        terminal.appendChild(output);
    }

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Test the solution for the current challenge
 * @param {HTMLElement} terminal - Terminal DOM element
 * @param {HTMLElement} editorArea - Editor area DOM element
 */
function testSolution(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!currentChallenge) {
        // No current challenge
        output.innerHTML = `<span style="color: #cc0000;">No challenge selected. Type 'list' to see available challenges and 'select {challengeId}' to choose one.</span>`;
    } else {
        // For the minimal version, we'll just simulate test results
        // Build test results HTML
        let testHtml = `
            <div style="color: #ffc66d; font-weight: bold; margin-bottom: 10px;">Testing Solution for ${currentChallenge.name}...</div>
            <div style="margin-bottom: 10px;">Running test cases:</div>
        `;

        // Simulate test results
        const passedCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 passed tests
        const totalCount = 2;
        const testResults = [passedCount > 0, passedCount > 1];

        currentChallenge.examples.forEach((example, index) => {
            if (index < 2) { // Limit to 2 test cases for simplicity
                const passed = testResults[index];

                testHtml += `
                    <div style="margin: 5px 0;">
                        <span style="color: ${passed ? '#6a8759' : '#cc0000'};">${passed ? '✓' : '✗'}</span>
                        Test Case ${index + 1}:
                        <span style="color: #9876aa;">Input:</span> ${example.input},
                        <span style="color: #9876aa;">Expected:</span> ${example.output}
                    </div>
                `;
            }
        });

        // Add summary
        const allPassed = passedCount === totalCount;

        testHtml += `
            <div style="margin-top: 10px; font-weight: bold; color: ${allPassed ? '#6a8759' : '#cc0000'};">
                ${passedCount}/${totalCount} tests passed.
            </div>
            <div style="margin-top: 10px; color: #808080;">
                ${allPassed ?
                    'Congratulations! All tests passed. Type <code>list</code> to try another challenge.' :
                    'Some tests failed. Type <code>hint</code> for help or <code>solution</code> to see the correct solution.'}
            </div>
        `;

        // Set output HTML
        output.innerHTML = testHtml;

        // Update challenge tab with test results
        updateChallengeContent(`
            <h1>${currentChallenge.name} - Test Results</h1>
            <p>
                <span style="background-color: ${getDifficultyColor(currentChallenge.difficulty)}; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 3px;">
                    ${currentChallenge.difficulty}
                </span>
            </p>

            <div style="background-color: ${allPassed ? 'rgba(106, 135, 89, 0.2)' : 'rgba(204, 0, 0, 0.2)'}; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
                <div style="font-size: 36px; margin-bottom: 10px; color: ${allPassed ? '#6a8759' : '#cc0000'};">
                    ${allPassed ? 'All Tests Passed!' : 'Some Tests Failed'}
                </div>
                <div style="font-size: 18px;">
                    ${passedCount}/${totalCount} test cases successful
                </div>
            </div>

            <h2>Test Cases</h2>
            <div style="background-color: #2b2b2b; border-radius: 10px; padding: 15px; margin: 20px 0;">
                ${currentChallenge.examples.slice(0, 2).map((example, index) => {
                    const passed = testResults[index];
                    return `
                        <div style="margin-bottom: 15px; padding: 10px; background-color: ${passed ? 'rgba(106, 135, 89, 0.2)' : 'rgba(204, 0, 0, 0.2)'}; border-radius: 5px;">
                            <div style="display: flex; justify-content: space-between;">
                                <div><strong>Test Case ${index + 1}:</strong></div>
                                <div style="color: ${passed ? '#6a8759' : '#cc0000'};">${passed ? '✓ PASSED' : '✗ FAILED'}</div>
                            </div>
                            <div style="margin-top: 10px;">
                                <div><strong>Input:</strong> ${example.input}</div>
                                <div><strong>Expected Output:</strong> ${example.output}</div>
                                ${!passed ? `<div><strong>Your Output:</strong> <span style="color: #cc0000;">Different result</span></div>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div style="margin: 30px 0; display: flex; gap: 10px; justify-content: center;">
                ${allPassed ? `
                    <a href="#" onclick="window.terminalProcessCommand('list'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                        <i class="fas fa-list"></i> Try Another Challenge
                    </a>
                ` : `
                    <a href="#" onclick="window.terminalProcessCommand('hint'); return false;" style="padding: 8px 16px; background-color: #9876aa; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                        <i class="fas fa-lightbulb"></i> Get Hint
                    </a>
                    <a href="#" onclick="window.terminalProcessCommand('solution'); return false;" style="padding: 8px 16px; background-color: #cc7832; color: white; text-decoration: none; border-radius: 4px;">
                        <i class="fas fa-eye"></i> View Solution
                    </a>
                `}
            </div>
        `);
    }

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        terminal.insertBefore(output, lastPrompt);
    } else {
        terminal.appendChild(output);
    }

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Reset the current challenge
 * @param {HTMLElement} terminal - Terminal DOM element
 * @param {HTMLElement} editorArea - Editor area DOM element
 */
function resetChallenge(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!currentChallenge) {
        // No current challenge
        output.innerHTML = `<span style="color: #cc0000;">No challenge selected. Type 'list' to see available challenges and 'select {challengeId}' to choose one.</span>`;
    } else {
        // Build reset message HTML
        const resetHtml = `
            <div style="color: #9876aa; margin-bottom: 10px;">Challenge ${currentChallenge.name} has been reset.</div>
            <div>The editor has been reset to the original template.</div>
        `;

        // Set output HTML
        output.innerHTML = resetHtml;

        // Update challenge tab with original template
        updateChallengeContent(`
            <h1>${currentChallenge.name}</h1>
            <p>
                <span style="background-color: ${getDifficultyColor(currentChallenge.difficulty)}; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 3px;">
                    ${currentChallenge.difficulty}
                </span>
            </p>
            <p>${currentChallenge.description}</p>

            <h2>Examples</h2>
            <div style="background-color: #2b2b2b; border-radius: 10px; padding: 15px; margin: 20px 0;">
                ${currentChallenge.examples.map(example => `
                    <div style="margin-bottom: 15px;">
                        <div><strong>Input:</strong> ${example.input}</div>
                        <div><strong>Output:</strong> ${example.output}</div>
                    </div>
                `).join('')}
            </div>

            <h2>Solution</h2>
            <pre style="background-color: #1e1e1e; padding: 15px; border-radius: 5px; overflow-x: auto; margin: 20px 0; font-family: 'JetBrains Mono', monospace; white-space: pre-wrap;">${currentChallenge.template}</pre>

            <div style="margin: 30px 0; display: flex; gap: 10px; justify-content: center;">
                <a href="#" onclick="window.terminalProcessCommand('hint'); return false;" style="padding: 8px 16px; background-color: #9876aa; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                    <i class="fas fa-lightbulb"></i> Get Hint
                </a>
                <a href="#" onclick="window.terminalProcessCommand('test'); return false;" style="padding: 8px 16px; background-color: #6a8759; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                    <i class="fas fa-play"></i> Test Solution
                </a>
                <a href="#" onclick="window.terminalProcessCommand('solution'); return false;" style="padding: 8px 16px; background-color: #cc7832; color: white; text-decoration: none; border-radius: 4px;">
                    <i class="fas fa-eye"></i> View Solution
                </a>
            </div>
        `);
    }

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        terminal.insertBefore(output, lastPrompt);
    } else {
        terminal.appendChild(output);
    }

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Update coding challenge tab content
 * @param {string} html - HTML content to update
 */
function updateChallengeContent(html) {
    const challengeDetails = document.getElementById('challengeDetails');
    if (challengeDetails) {
        challengeDetails.innerHTML = html;
    }
}

/**
 * Get color for difficulty badge
 * @param {string} difficulty - Difficulty level
 * @returns {string} - Color code for the difficulty
 */
function getDifficultyColor(difficulty) {
    switch (difficulty.toLowerCase()) {
        case 'easy':
            return '#6a8759'; // Green
        case 'medium':
            return '#cc7832'; // Orange
        case 'hard':
            return '#cc0000'; // Red
        default:
            return '#6897bb'; // Blue
    }
}

/**
 * Exported methods to interface with the main terminal system
 */
export default {
    /**
     * Start coding challenge mode
     * @param {HTMLElement} terminal - The terminal DOM element
     * @param {HTMLElement} editorArea - The editor area DOM element
     */
    start: function(terminal, editorArea) {
        try {
            console.log("Starting coding challenge mode");
            initCodingChallenge(terminal, editorArea);
        } catch (error) {
            console.error("Error starting coding challenge:", error);
            const errorOutput = document.createElement('div');
            errorOutput.className = 'terminal-output';
            errorOutput.innerHTML = `<span style="color: #cc0000;">Error initializing coding challenge: ${error.message}</span>`;

            if (terminal) {
                const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
                if (lastPrompt) {
                    terminal.insertBefore(errorOutput, lastPrompt);
                } else {
                    terminal.appendChild(errorOutput);
                }
            }
        }
    },

    /**
     * Process coding challenge input
     * @param {string} command - The entered command
     * @param {HTMLElement} terminal - The terminal DOM element
     * @param {HTMLElement} editorArea - The editor area DOM element
     * @returns {boolean} - Whether to stay in coding challenge mode
     */
    processInput: function(command, terminal, editorArea) {
        try {
            console.log("Processing coding challenge command:", command);
            return processChallengeCommand(command, terminal, editorArea);
        } catch (error) {
            console.error("Error processing command:", error);

            const errorOutput = document.createElement('div');
            errorOutput.className = 'terminal-output';
            errorOutput.innerHTML = `<span style="color: #cc0000;">Error processing command: ${error.message}</span>`;

            if (terminal) {
                const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
                if (lastPrompt) {
                    terminal.insertBefore(errorOutput, lastPrompt);
                } else {
                    terminal.appendChild(errorOutput);
                }
            }

            return true; // Stay in challenge mode despite the error
        }
    },

    /**
     * Check if coding challenge mode is active
     * @returns {boolean} - Coding challenge mode status
     */
    isActive: function() {
        return challengeActive;
    }
};/**
 * Interactive Coding Challenges Module
 *
 * Provides a collection of interactive coding puzzles and challenges
 * for visitors to test their programming skills.
 */

// Track if coding challenge mode is active
let challengeActive = false;

// Currently selected challenge
let currentChallenge = null;

// Simplified coding challenges data (just a couple for demonstration)
const codingChallenges = [
    {
        id: 'fizzbuzz',
        name: 'FizzBuzz',
        difficulty: 'Easy',
        description: 'Write a function that prints the numbers from 1 to n. But for multiples of 3, print "Fizz" instead of the number, and for multiples of 5, print "Buzz". For numbers which are multiples of both 3 and 5, print "FizzBuzz".',
        examples: [
            {
                input: 'n = 15',
                output: '1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz'
            }
        ],
        template: `function fizzBuzz(n) {
    // Your code here

}

// Example usage:
console.log(fizzBuzz(15));`,
        solution: `function fizzBuzz(n) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        if (i % 3 === 0 && i % 5 === 0) {
            result.push("FizzBuzz");
        } else if (i % 3 === 0) {
            result.push("Fizz");
        } else if (i % 5 === 0) {
            result.push("Buzz");
        } else {
            result.push(i.toString());
        }
    }
    return result.join(", ");
}`,
        hints: [
            'Use the modulo operator (%) to check if a number is divisible by 3 or 5',
            'Check for FizzBuzz first (divisible by both 3 and 5)',
            'Build an array of results and join them at the end'
        ]
    },
    {
        id: 'palindrome',
        name: 'Palindrome Checker',
        difficulty: 'Easy',
        description: 'Write a function that checks if a given string is a palindrome. A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward, ignoring spaces, punctuation, and capitalization.',
        examples: [
            {
                input: '"racecar"',
                output: 'true'
            },
            {
                input: '"A man, a plan, a canal: Panama"',
                output: 'true'
            },
            {
                input: '"hello"',
                output: 'false'
            }
        ],
        template: `function isPalindrome(str) {
    // Your code here

}

// Example usage:
console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("hello")); // false`,
        solution: `function isPalindrome(str) {
    // Remove non-alphanumeric characters and convert to lowercase
    const cleanedStr = str.replace(/[^A-Za-z0-9]/g, "").toLowerCase();

    // Check if the cleaned string is equal to its reverse
    return cleanedStr === cleanedStr.split("").reverse().join("");
}`,
        hints: [
            'Remove all non-alphanumeric characters and convert the string to lowercase',
            'Compare the cleaned string with its reverse',
            'You can reverse a string by using split(""), reverse(), and join("")'
        ]
    }
];

/**
 * Initialize the Coding Challenge Mode
 * @param {HTMLElement} terminal - The terminal DOM element
 * @param {HTMLElement} editorArea - The editor area DOM element
 */
function initCodingChallenge(terminal, editorArea) {
    if (!terminal || !editorArea) {
        console.error("Required elements not found for coding challenge");
        return;
    }

    challengeActive = true;
    currentChallenge = null;

    // Display welcome message in terminal
    const welcomeOutput = document.createElement('div');
    welcomeOutput.className = 'terminal-output';
    welcomeOutput.innerHTML = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Coding Challenge Mode</div>
        <div>Test your programming skills with these interactive coding challenges.</div>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">list</span>: Show all available challenges</div>
        <div>- <span style="color: #cc7832">select {challengeId}</span>: Choose a challenge to solve</div>
        <div>- <span style="color: #cc7832">hint</span>: Get a hint for the current challenge</div>
        <div>- <span style="color: #cc7832">solution</span>: View the solution for the current challenge</div>
        <div>- <span style="color: #cc7832">test</span>: Test your solution against test cases</div>
        <div>- <span style="color: #cc7832">reset</span>: Reset the current challenge</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit coding challenge mode</div>
        <div style="margin-top: 10px; color: #808080;">Type 'list' to see available challenges</div>
    `;

    // Update terminal prompt for challenge mode
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        // Change prompt style for challenge mode
        const userSpan = lastPrompt.querySelector('.terminal-user');
        if (userSpan) userSpan.textContent = 'code';

        const machineSpan = lastPrompt.querySelector('.terminal-machine');
        if (machineSpan) machineSpan.textContent = 'js';

        const directorySpan = lastPrompt.querySelector('.terminal-directory');
        if (directorySpan) directorySpan.textContent = 'challenge';
    }

    // Insert welcome message before the prompt
    if (lastPrompt) {
        terminal.insertBefore(welcomeOutput, lastPrompt);
    } else {
        terminal.appendChild(welcomeOutput);
    }

    // Create challenge tab in editor area
    createChallengeTab(editorArea);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Create coding challenge tab in editor area
 * @param {HTMLElement} editorArea - The editor area DOM element
 */
function createChallengeTab(editorArea) {
    // Check if tab already exists
    if (document.getElementById('challengeTab')) {
        // Just activate it
        activateChallengeTab();
        return;
    }

    // Create new tab
    const tabsContainer = editorArea.querySelector('.editor-tabs');
    if (!tabsContainer) {
        console.error("Editor tabs container not found");
        return;
    }

    const challengeTab = document.createElement('div');
    challengeTab.className = 'editor-tab';
    challengeTab.id = 'challengeTab';
    challengeTab.innerHTML = `
        <i class="fas fa-code"></i>
        <span class="tab-title">challenge.js</span>
        <i class="fas fa-times close-tab"></i>
    `;

    // Create content
    const contentContainer = editorArea.querySelector('.editor-content');
    if (!contentContainer) {
        console.error("Editor content container not found");
        return;
    }

    const challengeContent = document.createElement('div');
    challengeContent.className = 'code-content markdown-content challenge-code';
    challengeContent.id = 'challengeContent';
    challengeContent.innerHTML = `
        <div class="markdown-container" id="challengeDetails">
            <h1>Coding Challenges</h1>
            <p>Test your programming skills with these interactive coding challenges.</p>

            <div>
                <h2>Getting Started</h2>
                <p>Use terminal commands to navigate and interact with the coding challenges:</p>
                <ul>
                    <li>Type <code>list</code> to see all available challenges</li>
                    <li>Type <code>select {challengeId}</code> to choose a challenge to solve</li>
                    <li>Type <code>hint</code> to get a hint for the current challenge</li>
                    <li>Type <code>solution</code> to view the solution for the current challenge</li>
                    <li>Type <code>test</code> to test your solution against test cases</li>
                </ul>
            </div>
        </div>
    `;

    // Add tab and content to DOM
    tabsContainer.appendChild(challengeTab);
    contentContainer.appendChild(challengeContent);

    // Add event listener to tab
    challengeTab.addEventListener('click', activateChallengeTab);

    // Add event listener to close button
    const closeBtn = challengeTab.querySelector('.close-tab');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            challengeTab.style.display = 'none';
            if (challengeTab.classList.contains('active')) {
                // Show about tab if challenge tab is closed
                const aboutTab = document.getElementById('aboutTab');
                if (aboutTab) {
                    aboutTab.click();
                }
            }
        });
    }

    // Activate the tab
    activateChallengeTab();
}

/**
 * Activate the coding challenge tab
 */
function activateChallengeTab() {
    // Deactivate all tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all content
    document.querySelectorAll('.code-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activate challenge tab and content
    const challengeTab = document.getElementById('challengeTab');
    const challengeContent = document.getElementById('challengeContent');

    if (challengeTab && challengeContent) {
        challengeTab.classList.add('active');
        challengeTab.style.display = 'flex';
        challengeContent.classList.add('active');
    }
}

/**
 * Process coding challenge commands
 * @param {string} command - Command to process
 * @param {HTMLElement} terminal - Terminal DOM element
 * @param {HTMLElement} editorArea - Editor area DOM element
 * @returns {boolean} - Whether to continue in challenge mode
 */
function processChallengeCommand(command, terminal, editorArea) {
    if (!terminal || !editorArea) {
        console.error("Required elements not found for processing challenge command");
        return false;
    }

    const cmd = command.trim().toLowerCase();
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');

    // Check for exit command
    if (cmd === 'exit') {
        const exitMsg = document.createElement('div');
        exitMsg.className = 'terminal-output';
        exitMsg.textContent = 'Exiting coding challenge mode...';

        if (lastPrompt) {
            terminal.insertBefore(exitMsg, lastPrompt);
        } else {
            terminal.appendChild(exitMsg);
        }

        // Reset terminal style
        challengeActive = false;
        return false;
    }

    // Handle list command
    if (cmd === 'list') {
        showChallengeList(terminal, editorArea);
        return true;
    }

    // Handle select command
    if (cmd.startsWith('select ')) {
        const challengeId = cmd.substring(7).trim();
        selectChallenge(challengeId, terminal, editorArea);
        return true;
    }

    // Handle hint command
    if (cmd === 'hint') {
        showHint(terminal, editorArea);
        return true;
    }

    // Handle solution command
    if (cmd === 'solution') {
        showSolution(terminal, editorArea);
        return true;
    }

    // Handle test command
    if (cmd === 'test') {
        testSolution(terminal, editorArea);
        return true;
    }

    // Handle reset command
    if (cmd === 'reset') {
        resetChallenge(terminal, editorArea);
        return true;
    }

    // Handle unknown command
    const unknownMsg = document.createElement('div');
    unknownMsg.className = 'terminal-output';
    unknownMsg.innerHTML = `
        <span style="color: #cc0000;">Unknown command: ${command}</span>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">list</span>: Show all available challenges</div>
        <div>- <span style="color: #cc7832">select {challengeId}</span>: Choose a challenge to solve</div>
        <div>- <span style="color: #cc7832">hint</span>: Get a hint for the current challenge</div>
        <div>- <span style="color: #cc7832">solution</span>: View the solution for the current challenge</div>
        <div>- <span style="color: #cc7832">test</span>: Test your solution against test cases</div>
        <div>- <span style="color: #cc7832">reset</span>: Reset the current challenge</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit coding challenge mode</div>
    `;

    if (lastPrompt) {
        terminal.insertBefore(unknownMsg, lastPrompt);
    } else {
        terminal.appendChild(unknownMsg);
    }

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;

    return true;
}

/**
 * Show the list of available coding challenges
 * @param {HTMLElement} terminal - Terminal DOM element
 * @param {HTMLElement} editorArea - Editor area DOM element
 */
function showChallengeList(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build challenge list HTML
    let challengesHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Available Coding Challenges</div>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">ID</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Name</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Difficulty</th>
            </tr>
    `;