/**
 * Interactive Coding Challenges Module
 *
 * Provides a collection of interactive coding puzzles and challenges
 * for visitors to test their programming skills.
 */

// Track if coding challenge mode is active
let challengeActive = false;

// Currently selected challenge
let currentChallenge = null;

// Coding challenges data
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
        ],
        testCases: [
            {
                input: '15',
                expectedOutput: '1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz'
            },
            {
                input: '5',
                expectedOutput: '1, 2, Fizz, 4, Buzz'
            }
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
        ],
        testCases: [
            {
                input: '"racecar"',
                expectedOutput: 'true'
            },
            {
                input: '"A man, a plan, a canal: Panama"',
                expectedOutput: 'true'
            },
            {
                input: '"hello"',
                expectedOutput: 'false'
            }
        ]
    },
    {
        id: 'anagram',
        name: 'Valid Anagram',
        difficulty: 'Easy',
        description: 'Write a function that determines if two strings are anagrams of each other. An anagram is a word formed by rearranging the letters of another word, using all the original letters exactly once.',
        examples: [
            {
                input: 's = "anagram", t = "nagaram"',
                output: 'true'
            },
            {
                input: 's = "rat", t = "car"',
                output: 'false'
            }
        ],
        template: `function isAnagram(s, t) {
    // Your code here

}

// Example usage:
console.log(isAnagram("anagram", "nagaram")); // true
console.log(isAnagram("rat", "car")); // false`,
        solution: `function isAnagram(s, t) {
    // If lengths are different, they can't be anagrams
    if (s.length !== t.length) {
        return false;
    }

    // Create character frequency maps
    const sFreq = {};
    const tFreq = {};

    // Count character frequencies in string s
    for (let char of s) {
        sFreq[char] = (sFreq[char] || 0) + 1;
    }

    // Count character frequencies in string t
    for (let char of t) {
        tFreq[char] = (tFreq[char] || 0) + 1;
    }

    // Compare frequency maps
    for (let char in sFreq) {
        if (sFreq[char] !== tFreq[char]) {
            return false;
        }
    }

    return true;
}`,
        hints: [
            'If the strings have different lengths, they cannot be anagrams',
            'Create a frequency counter for each string to track character occurrences',
            'Compare the frequency counters to see if they match',
            'You could also sort both strings and compare them directly'
        ],
        testCases: [
            {
                input: '"anagram", "nagaram"',
                expectedOutput: 'true'
            },
            {
                input: '"rat", "car"',
                expectedOutput: 'false'
            },
            {
                input: '"listen", "silent"',
                expectedOutput: 'true'
            }
        ]
    },
    {
        id: 'twosum',
        name: 'Two Sum',
        difficulty: 'Medium',
        description: 'Given an array of integers and a target sum, return the indices of the two numbers such that they add up to the target. You may assume that each input has exactly one solution, and you may not use the same element twice.',
        examples: [
            {
                input: 'nums = [2, 7, 11, 15], target = 9',
                output: '[0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)'
            }
        ],
        template: `function twoSum(nums, target) {
    // Your code here

}

// Example usage:
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
        solution: `function twoSum(nums, target) {
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (map.has(complement)) {
            return [map.get(complement), i];
        }

        map.set(nums[i], i);
    }

    return null; // No solution found
}`,
        hints: [
            'Use a hash map to store numbers you\'ve seen and their indices',
            'For each number, check if its complement (target - number) exists in the map',
            'The brute force approach using nested loops would be O(n²), but using a hash map gives O(n)'
        ],
        testCases: [
            {
                input: '[2, 7, 11, 15], 9',
                expectedOutput: '[0, 1]'
            },
            {
                input: '[3, 2, 4], 6',
                expectedOutput: '[1, 2]'
            }
        ]
    },
    {
        id: 'maxsubarray',
        name: 'Maximum Subarray',
        difficulty: 'Medium',
        description: 'Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. This is known as Kadane\'s algorithm.',
        examples: [
            {
                input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
                output: '6 (the subarray [4, -1, 2, 1] has the largest sum = 6)'
            }
        ],
        template: `function maxSubArray(nums) {
    // Your code here

}

// Example usage:
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6`,
        solution: `function maxSubArray(nums) {
    if (nums.length === 0) {
        return 0;
    }

    let maxSum = nums[0];
    let currentSum = nums[0];

    for (let i = 1; i < nums.length; i++) {
        // Either take the current number or add it to the previous sum
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        // Update the maximum sum if the current sum is larger
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}`,
        hints: [
            'Use Kadane\'s algorithm: at each position, decide whether to start a new subarray or extend the current one',
            'Keep track of the current sum and the maximum sum found so far',
            'For each element, the current sum is the maximum of the element itself or the current sum plus the element'
        ],
        testCases: [
            {
                input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
                expectedOutput: '6'
            },
            {
                input: '[1]',
                expectedOutput: '1'
            },
            {
                input: '[-1]',
                expectedOutput: '-1'
            }
        ]
    }
];

/**
 * Initialize the Coding Challenge Mode
 * @param {Object} terminal - The terminal DOM element
 * @param {Object} editorArea - The editor area DOM element
 */
function initCodingChallenge(terminal, editorArea) {
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

    // Update prompt style for challenge mode
    updateChallengePrompt(terminal);

    // Insert welcome message before the prompt
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(welcomeOutput, lastPrompt);

    // Create challenge tab in editor area if it doesn't exist
    createChallengeTab(editorArea);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Update the terminal prompt to challenge style
 * @param {Object} terminal - The terminal DOM element
 */
function updateChallengePrompt(terminal) {
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        // Change prompt style for challenge mode
        const userSpan = lastPrompt.querySelector('.terminal-user');
        if (userSpan) userSpan.textContent = 'code';

        const machineSpan = lastPrompt.querySelector('.terminal-machine');
        if (machineSpan) machineSpan.textContent = 'js';

        const directorySpan = lastPrompt.querySelector('.terminal-directory');
        if (directorySpan) directorySpan.textContent = 'challenge';

        const symbolSpan = lastPrompt.querySelector('.terminal-symbol');
        if (symbolSpan) symbolSpan.textContent = '>';
    }
}

/**
 * Create coding challenge tab in editor area
 * @param {Object} editorArea - The editor area DOM element
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
    const challengeContent = document.createElement('div');
    challengeContent.className = 'code-content markdown-content challenge-code';
    challengeContent.id = 'challengeContent';
    challengeContent.innerHTML = `
        <div class="markdown-container">
            <h1>Coding Challenges</h1>
            <p>Test your programming skills with these interactive coding challenges.</p>

            <div id="challengeDetails">
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
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 * @returns {boolean} - Whether to continue in challenge mode
 */
function processChallengeCommand(command, terminal, editorArea) {
    const cmd = command.trim().toLowerCase();

    // Check for exit command
    if (cmd === 'exit') {
        const exitMsg = document.createElement('div');
        exitMsg.className = 'terminal-output';
        exitMsg.textContent = 'Exiting coding challenge mode...';

        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        terminal.insertBefore(exitMsg, lastPrompt);

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

    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(unknownMsg, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;

    return true;
}

/**
 * Show the list of available coding challenges
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
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

    // Add each challenge to the table
    codingChallenges.forEach(challenge => {
        challengesHtml += `
            <tr>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${challenge.id}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;"><strong>${challenge.name}</strong></td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${getDifficultyBadge(challenge.difficulty)}</td>
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
    terminal.insertBefore(output, lastPrompt);

    // Update challenge tab content
    updateChallengeContent(`
        <h1>Coding Challenges</h1>
        <p>Select a challenge from the list below to begin coding:</p>

        <div style="display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0;">
            ${codingChallenges.map(challenge => `
                <div class="challenge-card">
                    <h2>${challenge.name}</h2>
                    <p>${getDifficultyBadge(challenge.difficulty)}</p>
                    <p>${challenge.description.substring(0, 100)}${challenge.description.length > 100 ? '...' : ''}</p>
                    <div style="margin-top: 15px;">
                        <a href="#" onclick="window.terminalProcessCommand('select ${challenge.id}'); return false;" style="padding: 8px 16px; background-color: #214283; color: white; text-decoration: none; border-radius: 4px;">
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
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
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
            <p><span class="difficulty-badge ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</span></p>
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
    terminal.insertBefore(output, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show a hint for the current challenge
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
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
            <div style="margin-top: 10px; color: #808080;">Type <code>list</code> to view other challenges or <code>reset</code> to reset the current challenge.</div>
        `;

        // Set output HTML
        output.innerHTML = solutionHtml;

        // Update challenge tab with solution
        updateChallengeContent(`
            <h1>${currentChallenge.name} - Solution</h1>
            <p><span class="difficulty-badge ${currentChallenge.difficulty.toLowerCase()}">${currentChallenge.difficulty}</span></p>
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
    terminal.insertBefore(output, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Test the solution for the current challenge
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function testSolution(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!currentChallenge) {
        // No current challenge
        output.innerHTML = `<span style="color: #cc0000;">No challenge selected. Type 'list' to see available challenges and 'select {challengeId}' to choose one.</span>`;
    } else {
        // Build test results HTML
        let testHtml = `
            <div style="color: #ffc66d; font-weight: bold; margin-bottom: 10px;">Testing Solution for ${currentChallenge.name}...</div>
            <div style="margin-bottom: 10px;">Running test cases:</div>
        `;

        // Add test cases
        const testResults = [];
        currentChallenge.testCases.forEach((testCase, index) => {
            // Simulate test results (in a real system, would evaluate the solution)
            const passed = Math.random() > 0.5; // Randomly pass or fail for demo
            testResults.push(passed);

            testHtml += `
                <div style="margin: 5px 0;">
                    <span style="color: ${passed ? '#6a8759' : '#cc0000'};">${passed ? '✓' : '✗'}</span>
                    Test Case ${index + 1}:
                    <span style="color: #9876aa;">Input:</span> ${testCase.input},
                    <span style="color: #9876aa;">Expected:</span> ${testCase.expectedOutput}
                </div>
            `;
        });

        // Add summary
        const passedCount = testResults.filter(result => result).length;
        const totalCount = testResults.length;
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
            <p><span class="difficulty-badge ${currentChallenge.difficulty.toLowerCase()}">${currentChallenge.difficulty}</span></p>

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
                ${currentChallenge.testCases.map((testCase, index) => {
                    const passed = testResults[index];
                    return `
                        <div style="margin-bottom: 15px; padding: 10px; background-color: ${passed ? 'rgba(106, 135, 89, 0.2)' : 'rgba(204, 0, 0, 0.2)'}; border-radius: 5px;">
                            <div style="display: flex; justify-content: space-between;">
                                <div><strong>Test Case ${index + 1}:</strong></div>
                                <div style="color: ${passed ? '#6a8759' : '#cc0000'};">${passed ? '✓ PASSED' : '✗ FAILED'}</div>
                            </div>
                            <div style="margin-top: 10px;">
                                <div><strong>Input:</strong> ${testCase.input}</div>
                                <div><strong>Expected Output:</strong> ${testCase.expectedOutput}</div>
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
    terminal.insertBefore(output, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Reset the current challenge
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
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
            <p><span class="difficulty-badge ${currentChallenge.difficulty.toLowerCase()}">${currentChallenge.difficulty}</span></p>
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
    terminal.insertBefore(output, lastPrompt);

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
 * Get a colored badge for difficulty level
 * @param {string} difficulty - Difficulty level
 * @returns {string} - HTML for difficulty badge
 */
function getDifficultyBadge(difficulty) {
    let color;
    switch (difficulty.toLowerCase()) {
        case 'easy':
            color = '#6a8759'; // Green
            break;
        case 'medium':
            color = '#cc7832'; // Orange
            break;
        case 'hard':
            color = '#cc0000'; // Red
            break;
        default:
            color = '#6897bb'; // Blue
    }

    return `<span style="background-color: ${color}; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 3px;">${difficulty}</span>`;
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
     * Start coding challenge mode
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     */
    start: function(terminal, editorArea) {
        setupTerminalCommandHandler();
        initCodingChallenge(terminal, editorArea);
    },

    /**
     * Process coding challenge input
     * @param {string} command - The entered command
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     * @returns {boolean} - Whether to stay in coding challenge mode
     */
    processInput: function(command, terminal, editorArea) {
        return processChallengeCommand(command, terminal, editorArea);
    },

    /**
     * Check if coding challenge mode is active
     * @returns {boolean} - Coding challenge mode status
     */
    isActive: function() {
        return challengeActive;
    }
};080;">Type <code>hint</code> again for another hint or <code>test</code> to test your solution.</div>
        `;

        // Set output HTML
        output.innerHTML = hintHtml;
    }

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show the solution for the current challenge
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
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
            <div style="margin-top: 10px; color: #808