/**
 * Code Challenge Module
 *
 * Provides interactive coding challenges in different languages
 * with tests and feedback to help developers improve their skills.
 */

// Track if code challenge mode is active
let challengeModeActive = false;
let currentChallenge = null;
let userSolution = '';

// Collection of coding challenges
const codingChallenges = [
    {
        id: 'reverse-string',
        name: 'Reverse a String',
        difficulty: 'easy',
        description: 'Write a function that reverses a string. The input string is given as an array of characters.',
        language: 'javascript',
        startingCode: `function reverseString(str) {
  // Your code here

  return str;
}`,
        testCases: [
            { input: '"hello"', expectedOutput: '"olleh"' },
            { input: '"world"', expectedOutput: '"dlrow"' },
            { input: '"javascript"', expectedOutput: '"tpircsavaj"' }
        ],
        solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
        hints: [
            'Try converting the string to an array first',
            'JavaScript arrays have a reverse() method',
            'After reversing, join the array back into a string'
        ]
    },
    {
        id: 'palindrome-check',
        name: 'Palindrome Check',
        difficulty: 'easy',
        description: 'Write a function that checks if a given string is a palindrome. A palindrome is a word, phrase, or sequence that reads the same backward as forward, ignoring spaces, punctuation, and capitalization.',
        language: 'javascript',
        startingCode: `function isPalindrome(str) {
  // Your code here

  return true;
}`,
        testCases: [
            { input: '"racecar"', expectedOutput: 'true' },
            { input: '"hello"', expectedOutput: 'false' },
            { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' }
        ],
        solution: `function isPalindrome(str) {
  // Remove non-alphanumeric characters and convert to lowercase
  const cleanStr = str.replace(/[^0-9a-z]/gi, '').toLowerCase();

  // Compare with its reverse
  return cleanStr === cleanStr.split('').reverse().join('');
}`,
        hints: [
            'Remember to remove spaces and punctuation',
            'Case shouldn\'t matter, so convert to lowercase first',
            'Compare the cleaned string with its reverse'
        ]
    },
    {
        id: 'fizzbuzz',
        name: 'FizzBuzz',
        difficulty: 'easy',
        description: 'Write a function that returns an array containing the numbers from 1 to n. For multiples of 3, use "Fizz" instead of the number. For multiples of 5, use "Buzz". For numbers that are multiples of both 3 and 5, use "FizzBuzz".',
        language: 'javascript',
        startingCode: `function fizzBuzz(n) {
  // Your code here

  return [];
}`,
        testCases: [
            { input: '15', expectedOutput: '[1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"]' }
        ],
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
      result.push(i);
    }
  }

  return result;
}`,
        hints: [
            'Use a loop to iterate from 1 to n',
            'Check for divisibility by both 3 and 5 first',
            'Then check for divisibility by 3 or 5 separately'
        ]
    },
    {
        id: 'two-sum',
        name: 'Two Sum',
        difficulty: 'medium',
        description: 'Given an array of integers and a target sum, return the indices of two numbers such that they add up to the target. You may assume that each input has exactly one solution, and you may not use the same element twice.',
        language: 'javascript',
        startingCode: `function twoSum(nums, target) {
  // Your code here

  return [0, 0];
}`,
        testCases: [
            { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
            { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' },
            { input: '[3, 3], 6', expectedOutput: '[0, 1]' }
        ],
        solution: `function twoSum(nums, target) {
  const numMap = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }

    numMap.set(nums[i], i);
  }

  return []; // No solution found
}`,
        hints: [
            'Consider using a hash map to store values and their indices',
            'For each number, check if its complement (target - number) exists in the map',
            'This allows you to find the answer in a single pass through the array'
        ]
    },
    {
        id: 'fibonacci',
        name: 'Fibonacci Sequence',
        difficulty: 'medium',
        description: 'Write a function that returns the nth number in the Fibonacci sequence. The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding ones.',
        language: 'javascript',
        startingCode: `function fibonacci(n) {
  // Your code here

  return 0;
}`,
        testCases: [
            { input: '0', expectedOutput: '0' },
            { input: '1', expectedOutput: '1' },
            { input: '2', expectedOutput: '1' },
            { input: '3', expectedOutput: '2' },
            { input: '10', expectedOutput: '55' }
        ],
        solution: `function fibonacci(n) {
  if (n <= 1) {
    return n;
  }

  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }

  return b;
}`,
        hints: [
            'Try using an iterative approach to avoid stack overflow for large values of n',
            'You need to keep track of the two previous Fibonacci numbers',
            'Be careful with the base cases (n=0 and n=1)'
        ]
    },
    {
        id: 'anagram-check',
        name: 'Valid Anagram',
        difficulty: 'medium',
        description: 'Given two strings, write a function to determine if the second string is an anagram of the first. An anagram is a word, phrase, or name formed by rearranging the letters of another.',
        language: 'javascript',
        startingCode: `function isAnagram(s, t) {
  // Your code here

  return false;
}`,
        testCases: [
            { input: '"anagram", "nagaram"', expectedOutput: 'true' },
            { input: '"rat", "car"', expectedOutput: 'false' },
            { input: '"listen", "silent"', expectedOutput: 'true' }
        ],
        solution: `function isAnagram(s, t) {
  if (s.length !== t.length) {
    return false;
  }

  const charCount = {};

  // Count characters in s
  for (const char of s) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Decrement counts for characters in t
  for (const char of t) {
    if (!charCount[char]) {
      return false;
    }
    charCount[char]--;
  }

  // All counts should be zero
  return Object.values(charCount).every(count => count === 0);
}`,
        hints: [
            'An anagram has the same characters with the same frequency',
            'Try using a hash map to count character occurrences',
            'You could also sort both strings and compare them'
        ]
    }
];

/**
 * Initialize the code challenge mode
 * @param {Object} terminal - The terminal DOM element
 * @param {Object} editorArea - The editor area DOM element
 */
function initCodeChallenge(terminal, editorArea) {
    challengeModeActive = true;

    // Display welcome message in terminal
    const welcomeOutput = document.createElement('div');
    welcomeOutput.className = 'terminal-output';
    welcomeOutput.innerHTML = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Code Challenge Mode</div>
        <div>Welcome to the coding challenge platform! Test your skills with various programming challenges.</div>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">list</span>: Show all available challenges</div>
        <div>- <span style="color: #cc7832">start {challengeId}</span>: Begin a specific challenge</div>
        <div>- <span style="color: #cc7832">submit</span>: Submit your solution for testing</div>
        <div>- <span style="color: #cc7832">hint</span>: Get a hint for the current challenge</div>
        <div>- <span style="color: #cc7832">solution</span>: View the solution (only use after trying!)</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit challenge mode</div>
        <div style="margin-top: 10px; color: #808080;">Type 'list' to see available challenges</div>
    `;

    // Update prompt style for challenge mode
    updateChallengePrompt(terminal);

    // Insert welcome message before the prompt
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(welcomeOutput, lastPrompt);

    // Create code challenge tab in editor area if it doesn't exist
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
        if (machineSpan) machineSpan.textContent = 'challenge';

        const directorySpan = lastPrompt.querySelector('.terminal-directory');
        if (directorySpan) directorySpan.textContent = 'exercises';

        const symbolSpan = lastPrompt.querySelector('.terminal-symbol');
        if (symbolSpan) symbolSpan.textContent = '>';
    }
}

/**
 * Create code challenge tab in editor area
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
            <p>Select a challenge from the terminal to get started.</p>

            <div id="challengeDetails">
                <h2>Available Challenges</h2>
                <p>Use terminal commands to explore challenges:</p>
                <ul>
                    <li>Type <code>list</code> to see all available challenges</li>
                    <li>Type <code>start {challengeId}</code> to begin a specific challenge</li>
                    <li>Once in a challenge, edit the code in this editor panel</li>
                    <li>Type <code>submit</code> to test your solution</li>
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
 * Activate the challenge tab
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
 * Process code challenge commands
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
        exitMsg.textContent = 'Exiting code challenge mode...';

        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        terminal.insertBefore(exitMsg, lastPrompt);

        // Reset terminal style
        challengeModeActive = false;
        currentChallenge = null;
        userSolution = '';

        // Update the challenge content
        updateChallengeContent('');

        return false;
    }

    // Handle list command
    if (cmd === 'list') {
        listChallenges(terminal, editorArea);
        return true;
    }

    // Handle start command
    if (cmd.startsWith('start ')) {
        const challengeId = cmd.substring(6).trim();
        startChallenge(challengeId, terminal, editorArea);
        return true;
    }

    // Handle submit command
    if (cmd === 'submit') {
        submitSolution(terminal, editorArea);
        return true;
    }

    // Handle hint command
    if (cmd === 'hint') {
        getHint(terminal);
        return true;
    }

    // Handle solution command
    if (cmd === 'solution') {
        showSolution(terminal, editorArea);
        return true;
    }

    // Handle unknown command
    const unknownMsg = document.createElement('div');
    unknownMsg.className = 'terminal-output';
    unknownMsg.innerHTML = `
        <span style="color: #cc0000;">Unknown command: ${command}</span>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">list</span>: Show all available challenges</div>
        <div>- <span style="color: #cc7832">start {challengeId}</span>: Begin a specific challenge</div>
        <div>- <span style="color: #cc7832">submit</span>: Submit your solution for testing</div>
        <div>- <span style="color: #cc7832">hint</span>: Get a hint for the current challenge</div>
        <div>- <span style="color: #cc7832">solution</span>: View the solution (only use after trying!)</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit challenge mode</div>
    `;

    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(unknownMsg, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;

    return true;
}

/**
 * List available challenges
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function listChallenges(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build challenges list HTML
    let challengesHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Available Coding Challenges</div>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">ID</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Challenge</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Difficulty</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Language</th>
            </tr>
    `;

    // Add each challenge to the table
    codingChallenges.forEach(challenge => {
        challengesHtml += `
            <tr>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${challenge.id}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;"><strong>${challenge.name}</strong></td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">
                    <span class="difficulty-badge ${challenge.difficulty}">${challenge.difficulty}</span>
                </td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${challenge.language}</td>
            </tr>
        `;
    });

    challengesHtml += `</table>
        <div style="margin-top: 10px;">Type <code>start {challengeId}</code> to begin a challenge</div>
    `;

    // Set output HTML
    output.innerHTML = challengesHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update challenge editor content
    updateChallengeContent(`
        <h1>Coding Challenges</h1>
        <p>Choose from the following challenges to test your programming skills:</p>

        <div class="challenges-list">
            ${codingChallenges.map(challenge => `
                <div class="challenge-card">
                    <h2>${challenge.name}</h2>
                    <div class="difficulty-badge ${challenge.difficulty}">${challenge.difficulty}</div>
                    <p>${challenge.description}</p>
                    <p><strong>Language:</strong> ${challenge.language}</p>
                    <button onclick="window.terminalProcessCommand('start ${challenge.id}')" class="challenge-button">
                        Start Challenge
                    </button>
                </div>
            `).join('')}
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Start a specific challenge
 * @param {string} challengeId - ID of the challenge to start
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function startChallenge(challengeId, terminal, editorArea) {
    // Find challenge by ID
    const challenge = codingChallenges.find(c => c.id === challengeId);

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!challenge) {
        // Challenge not found
        output.innerHTML = `<span style="color: #cc0000;">Challenge '${challengeId}' not found. Type 'list' to see available challenges.</span>`;
    } else {
        // Set current challenge
        currentChallenge = challenge;
        userSolution = challenge.startingCode;

        // Build challenge info HTML
        let challengeInfoHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">${challenge.name}</div>
            <div><strong>Difficulty:</strong> <span class="difficulty-badge ${challenge.difficulty}">${challenge.difficulty}</span></div>
            <div style="margin: 5px 0 10px 0;">${challenge.description}</div>

            <div style="margin-top: 10px;">
                <div>Edit the code in the challenge editor.</div>
                <div>Type <code>submit</code> to test your solution.</div>
                <div>Type <code>hint</code> if you need a hint.</div>
            </div>
        `;

        // Set output HTML
        output.innerHTML = challengeInfoHtml;

        // Update challenge editor content
        updateChallengeContent(`
            <h1>${challenge.name}</h1>
            <div class="difficulty-badge ${challenge.difficulty}" style="margin-bottom: 20px;">${challenge.difficulty}</div>

            <div class="challenge-description">${challenge.description}</div>

            <h2>Your Code</h2>
            <div class="code-editor-container">
                <pre><code class="language-${challenge.language}" contenteditable="true" id="codeEditor">${challenge.startingCode}</code></pre>
            </div>

            <div class="challenge-actions" style="margin-top: 20px;">
                <button onclick="window.terminalProcessCommand('submit')" class="challenge-button submit-button">
                    Submit Solution
                </button>
                <button onclick="window.terminalProcessCommand('hint')" class="challenge-button hint-button">
                    Get Hint
                </button>
            </div>

            <h3>Test Cases</h3>
            <div class="test-cases">
                <table>
                    <tr>
                        <th>Input</th>
                        <th>Expected Output</th>
                    </tr>
                    ${challenge.testCases.map(testCase => `
                        <tr>
                            <td><code>${testCase.input}</code></td>
                            <td><code>${testCase.expectedOutput}</code></td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `);

        // Set up code editor event listener
        setTimeout(() => {
            const codeEditor = document.getElementById('codeEditor');
            if (codeEditor) {
                codeEditor.addEventListener('input', function() {
                    userSolution = this.textContent;
                });
            }
        }, 100);
    }

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Submit the current solution for testing
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function submitSolution(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!currentChallenge) {
        // No active challenge
        output.innerHTML = `<span style="color: #cc0000;">No active challenge. Type 'start {challengeId}' to begin a challenge.</span>`;
    } else {
        // Try to evaluate the solution
        try {
            const testResults = [];
            let allPassed = true;

            // Create a function from the user solution
            const solutionFunc = new Function(`return ${userSolution}`)();

            // Run test cases
            for (const testCase of currentChallenge.testCases) {
                try {
                    // Parse input and expected output
                    const input = JSON.parse(`[${testCase.input}]`);
                    const expectedOutput = JSON.parse(testCase.expectedOutput);

                    // Call the function with the input
                    const actualOutput = solutionFunc(...input);

                    // Compare with expected output
                    const isPassing = JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);
                    if (!isPassing) {
                        allPassed = false;
                    }

                    testResults.push({
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        actualOutput: JSON.stringify(actualOutput),
                        isPassing
                    });
                } catch (error) {
                    allPassed = false;
                    testResults.push({
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        actualOutput: `Error: ${error.message}`,
                        isPassing: false
                    });
                }
            }

            // Build test results HTML
            let resultsHtml = `
                <div style="color: ${allPassed ? '#6a8759' : '#cc0000'}; font-weight: bold; margin-bottom: 10px;">
                    ${allPassed ? 'All tests passed!' : 'Some tests failed.'}
                </div>
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Test Case</th>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Expected Output</th>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Actual Output</th>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Result</th>
                    </tr>
            `;

            // Add each test result to the table
            testResults.forEach((result, index) => {
                resultsHtml += `
                    <tr>
                        <td style="padding: 5px; border-bottom: 1px solid #444;">${result.input}</td>
                        <td style="padding: 5px; border-bottom: 1px solid #444;">${result.expectedOutput}</td>
                        <td style="padding: 5px; border-bottom: 1px solid #444;">${result.actualOutput}</td>
                        <td style="padding: 5px; border-bottom: 1px solid #444; color: ${result.isPassing ? '#6a8759' : '#cc0000'};">
                            ${result.isPassing ? 'Pass' : 'Fail'}
                        </td>
                    </tr>
                `;
            });

            resultsHtml += `</table>
                ${allPassed ?
                    `<div style="margin-top: 10px; color: #6a8759;">Congratulations! You've solved the challenge.</div>` :
                    `<div style="margin-top: 10px;">Type <code>hint</code> if you need help.</div>`
                }
            `;

            // Set output HTML
            output.innerHTML = resultsHtml;

            // Update the test results in the editor
            const codeEditor = document.getElementById('codeEditor');
            if (codeEditor) {
                // Save any changes to the solution
                userSolution = codeEditor.textContent;
            }

            // Add test results to the challenge content
            const challengeDetails = document.getElementById('challengeDetails');
            if (challengeDetails) {
                const testResultsSection = document.createElement('div');
                testResultsSection.className = 'test-results';
                testResultsSection.innerHTML = `
                    <h3>Test Results</h3>
                    <div class="test-results-container" style="margin-top: 20px;">
                        <div class="test-summary" style="margin-bottom: 15px; font-weight: bold; color: ${allPassed ? '#6a8759' : '#cc0000'};">
                            ${allPassed ? 'All tests passed!' : 'Some tests failed.'}
                        </div>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #555;">Test Case</th>
                                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #555;">Expected Output</th>
                                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #555;">Actual Output</th>
                                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #555;">Result</th>
                            </tr>
                            ${testResults.map((result, index) => `
                                <tr>
                                    <td style="padding: 8px; border-bottom: 1px solid #444;">${result.input}</td>
                                    <td style="padding: 8px; border-bottom: 1px solid #444;">${result.expectedOutput}</td>
                                    <td style="padding: 8px; border-bottom: 1px solid #444;">${result.actualOutput}</td>
                                    <td style="padding: 8px; border-bottom: 1px solid #444; color: ${result.isPassing ? '#6a8759' : '#cc0000'};">
                                        ${result.isPassing ? 'Pass' : 'Fail'}
                                    </td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                `;

                // Check if test results section already exists
                const existingResults = challengeDetails.querySelector('.test-results');
                if (existingResults) {
                    challengeDetails.replaceChild(testResultsSection, existingResults);
                } else {
                    challengeDetails.appendChild(testResultsSection);
                }
            }
        } catch (error) {
            // Error evaluating solution
            output.innerHTML = `<span style="color: #cc0000;">Error evaluating solution: ${error.message}</span>`;
        }
    }

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Get a hint for the current challenge
 * @param {Object} terminal - Terminal DOM element
 */
function getHint(terminal) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!currentChallenge) {
        // No active challenge
        output.innerHTML = `<span style="color: #cc0000;">No active challenge. Type 'start {challengeId}' to begin a challenge.</span>`;
    } else {
        // Get random hint
        const hintIndex = Math.floor(Math.random() * currentChallenge.hints.length);
        const hint = currentChallenge.hints[hintIndex];

        // Build hint HTML
        let hintHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Hint:</div>
            <div style="margin-left: 15px; font-style: italic;">${hint}</div>
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
        // No active challenge
        output.innerHTML = `<span style="color: #cc0000;">No active challenge. Type 'start {challengeId}' to begin a challenge.</span>`;
    } else {
        // Build solution HTML
        let solutionHtml = `
            <div style="color: #cc7832; font-weight: bold; margin-bottom: 10px;">Solution:</div>
            <pre style="margin: 10px 0; background-color: #2b2b2b; padding: 10px; border-radius: 4px; overflow-x: auto;"><code class="language-${currentChallenge.language}">${currentChallenge.solution}</code></pre>
            <div style="color: #808080; margin-top: 10px;">Try to understand the solution before moving to the next challenge!</div>
        `;

        // Set output HTML
        output.innerHTML = solutionHtml;

        // Update the solution in the editor
        const codeEditor = document.getElementById('codeEditor');
        if (codeEditor) {
            codeEditor.textContent = currentChallenge.solution;
            userSolution = currentChallenge.solution;
        }
    }

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Update challenge tab content
 * @param {string} html - HTML content to update
 */
function updateChallengeContent(html) {
    const challengeDetails = document.getElementById('challengeDetails');
    if (challengeDetails) {
        challengeDetails.innerHTML = html || `
            <h2>Available Challenges</h2>
            <p>Use terminal commands to explore challenges:</p>
            <ul>
                <li>Type <code>list</code> to see all available challenges</li>
                <li>Type <code>start {challengeId}</code> to begin a specific challenge</li>
                <li>Once in a challenge, edit the code in this editor panel</li>
                <li>Type <code>submit</code> to test your solution</li>
            </ul>
        `;
    }
}

// Exported methods to interface with the main terminal system
const codeChallenge = {
    /**
     * Start code challenge mode
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     */
    start: function(terminal, editorArea) {
        initCodeChallenge(terminal, editorArea);
    },

    /**
     * Process code challenge input
     * @param {string} command - The entered command
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     * @returns {boolean} - Whether to stay in code challenge mode
     */
    processInput: function(command, terminal, editorArea) {
        return processChallengeCommand(command, terminal, editorArea);
    },

    /**
     * Check if code challenge mode is active
     * @returns {boolean} - Code challenge mode status
     */
    isActive: function() {
        return challengeModeActive;
    }
};

// Export for global access
window.codeChallenge = codeChallenge;