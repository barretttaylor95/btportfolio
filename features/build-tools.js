/**
 * Build Tools & CI/CD Pipeline Visualization Module
 *
 * Provides interactive visualization of build processes, CI/CD pipelines,
 * testing frameworks, and deployment flows.
 */

// Track if build tools mode is active
let buildToolsActive = false;

// Build configuration data
const buildConfig = {
    project: 'PetPals',
    buildTool: 'Maven',
    javaVersion: '17',
    springBootVersion: '3.2.0',
    dependencies: [
        { name: 'spring-boot-starter-web', version: '3.2.0', scope: 'compile' },
        { name: 'spring-boot-starter-data-jpa', version: '3.2.0', scope: 'compile' },
        { name: 'spring-boot-starter-validation', version: '3.2.0', scope: 'compile' },
        { name: 'spring-boot-starter-security', version: '3.2.0', scope: 'compile' },
        { name: 'mysql-connector-java', version: '8.0.33', scope: 'runtime' },
        { name: 'lombok', version: '1.18.30', scope: 'compile' },
        { name: 'spring-boot-starter-test', version: '3.2.0', scope: 'test' },
        { name: 'h2', version: '2.2.224', scope: 'test' }
    ],
    plugins: [
        { name: 'spring-boot-maven-plugin', version: '3.2.0' },
        { name: 'maven-compiler-plugin', version: '3.11.0' },
        { name: 'maven-surefire-plugin', version: '3.2.2' },
        { name: 'jacoco-maven-plugin', version: '0.8.11' }
    ],
    pomFile: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.petpals</groupId>
    <artifactId>petpals</artifactId>
    <version>1.1.0</version>
    <name>PetPals</name>
    <description>Pet health records and care management application</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Test dependencies -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.jacoco</groupId>
                <artifactId>jacoco-maven-plugin</artifactId>
                <version>0.8.11</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>prepare-agent</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>report</id>
                        <phase>test</phase>
                        <goals>
                            <goal>report</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>`
};

// CI/CD pipeline data
const cicdPipeline = {
    provider: 'GitHub Actions',
    stages: [
        {
            name: 'Build',
            steps: [
                { name: 'Checkout code', command: 'actions/checkout@v3' },
                { name: 'Set up JDK 17', command: 'actions/setup-java@v3' },
                { name: 'Cache Maven packages', command: 'actions/cache@v3' },
                { name: 'Build with Maven', command: 'mvn -B package --file pom.xml' }
            ]
        },
        {
            name: 'Test',
            steps: [
                { name: 'Run tests', command: 'mvn test' },
                { name: 'Generate JaCoCo report', command: 'mvn jacoco:report' },
                { name: 'Upload test results', command: 'actions/upload-artifact@v3' }
            ]
        },
        {
            name: 'Code Quality',
            steps: [
                { name: 'Run SonarQube analysis', command: 'mvn sonar:sonar' },
                { name: 'Check code style', command: 'mvn checkstyle:check' },
                { name: 'Check for dependency vulnerabilities', command: 'mvn dependency-check:check' }
            ]
        },
        {
            name: 'Package',
            steps: [
                { name: 'Package application', command: 'mvn package -DskipTests' },
                { name: 'Create Docker image', command: 'docker build -t petpals:${{ github.sha }} .' },
                { name: 'Push Docker image', command: 'docker push petpals:${{ github.sha }}' }
            ]
        },
        {
            name: 'Deploy to Staging',
            environment: 'staging',
            steps: [
                { name: 'Configure AWS credentials', command: 'aws-actions/configure-aws-credentials@v2' },
                { name: 'Update ECS service', command: 'aws ecs update-service --force-new-deployment' },
                { name: 'Wait for deployment', command: 'aws ecs wait services-stable' }
            ]
        },
        {
            name: 'Integration Tests',
            environment: 'staging',
            steps: [
                { name: 'Run API tests', command: 'mvn verify -Pintegration-tests' },
                { name: 'Run performance tests', command: 'mvn gatling:test' },
                { name: 'Generate report', command: 'mvn site' }
            ]
        },
        {
            name: 'Manual Approval',
            type: 'manual',
            steps: [
                { name: 'Request approval', command: 'actions/github-script@v6' }
            ]
        },
        {
            name: 'Deploy to Production',
            environment: 'production',
            steps: [
                { name: 'Configure AWS credentials', command: 'aws-actions/configure-aws-credentials@v2' },
                { name: 'Update ECS service', command: 'aws ecs update-service --force-new-deployment' },
                { name: 'Wait for deployment', command: 'aws ecs wait services-stable' }
            ]
        }
    ],
    workflowFile: `name: Java CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven

    - name: Cache Maven packages
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
        restore-keys: ${{ runner.os }}-m2

    - name: Build with Maven
      run: mvn -B package --file pom.xml

    - name: Run tests
      run: mvn test

    - name: Generate JaCoCo report
      run: mvn jacoco:report

    - name: Upload test results
      uses: actions/upload-artifact@v3
      with:
        name: test-results
        path: target/surefire-reports

  code-quality:
    needs: build
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven

    - name: Run SonarQube analysis
      run: mvn sonar:sonar -Dsonar.projectKey=petpals -Dsonar.host.url=${{ secrets.SONAR_URL }} -Dsonar.login=${{ secrets.SONAR_TOKEN }}

    - name: Check code style
      run: mvn checkstyle:check

    - name: Check for dependency vulnerabilities
      run: mvn dependency-check:check

  package:
    needs: code-quality
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven

    - name: Package application
      run: mvn package -DskipTests

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}

    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: petpals:${{ github.sha }},petpals:latest

  deploy-staging:
    needs: package
    runs-on: ubuntu-latest
    environment: staging

    steps:
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Update ECS service
      run: aws ecs update-service --cluster petpals-staging --service petpals-service --force-new-deployment

    - name: Wait for deployment
      run: aws ecs wait services-stable --cluster petpals-staging --services petpals-service

  integration-tests:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: staging

    steps:
    - uses: actions/checkout@v3

    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven

    - name: Run API tests
      run: mvn verify -Pintegration-tests

    - name: Run performance tests
      run: mvn gatling:test

    - name: Generate report
      run: mvn site

  manual-approval:
    needs: integration-tests
    runs-on: ubuntu-latest
    environment: production-approval

    steps:
    - name: Request approval
      uses: actions/github-script@v6
      with:
        script: |
          const { repo, owner } = context.repo;
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: owner,
            repo: repo,
            body: '👋 Production deployment requires manual approval.'
          });

  deploy-production:
    needs: manual-approval
    runs-on: ubuntu-latest
    environment: production

    steps:
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Update ECS service
      run: aws ecs update-service --cluster petpals-production --service petpals-service --force-new-deployment

    - name: Wait for deployment
      run: aws ecs wait services-stable --cluster petpals-production --services petpals-service`
};

// Test results data
const testResults = {
    summary: {
        total: 87,
        passed: 84,
        failed: 1,
        skipped: 2,
        duration: '12.6 seconds',
        coverage: '86.4%'
    },
    coverageByPackage: [
        { package: 'com.petpals.controller', coverage: '92.3%', linesCovered: 72, linesTotal: 78 },
        { package: 'com.petpals.service', coverage: '88.7%', linesCovered: 94, linesTotal: 106 },
        { package: 'com.petpals.repository', coverage: '95.6%', linesCovered: 43, linesTotal: 45 },
        { package: 'com.petpals.model', coverage: '83.1%', linesCovered: 64, linesTotal: 77 },
        { package: 'com.petpals.config', coverage: '72.0%', linesCovered: 18, linesTotal: 25 },
        { package: 'com.petpals.exception', coverage: '76.9%', linesCovered: 20, linesTotal: 26 }
    ],
    testClasses: [
        {
            name: 'PetControllerTest',
            package: 'com.petpals.controller',
            tests: [
                { name: 'testGetAllPets', status: 'PASSED', duration: '0.135s' },
                { name: 'testGetPetById', status: 'PASSED', duration: '0.082s' },
                { name: 'testGetPetByIdNotFound', status: 'PASSED', duration: '0.054s' },
                { name: 'testCreatePet', status: 'PASSED', duration: '0.128s' },
                { name: 'testUpdatePet', status: 'PASSED', duration: '0.097s' },
                { name: 'testDeletePet', status: 'PASSED', duration: '0.062s' }
            ]
        },
        {
            name: 'OwnerControllerTest',
            package: 'com.petpals.controller',
            tests: [
                { name: 'testGetAllOwners', status: 'PASSED', duration: '0.108s' },
                { name: 'testGetOwnerById', status: 'PASSED', duration: '0.073s' },
                { name: 'testCreateOwner', status: 'PASSED', duration: '0.115s' },
                { name: 'testUpdateOwner', status: 'PASSED', duration: '0.089s' },
                { name: 'testDeleteOwner', status: 'PASSED', duration: '0.067s' }
            ]
        },
        {
            name: 'PetServiceTest',
            package: 'com.petpals.service',
            tests: [
                { name: 'testFindAllPets', status: 'PASSED', duration: '0.043s' },
                { name: 'testFindPetById', status: 'PASSED', duration: '0.028s' },
                { name: 'testSavePet', status: 'PASSED', duration: '0.075s' },
                { name: 'testUpdatePet', status: 'PASSED', duration: '0.064s' },
                { name: 'testDeletePet', status: 'PASSED', duration: '0.032s' },
                { name: 'testDeletePetCascade', status: 'FAILED', duration: '0.057s', error: 'Expected no exception, but got: javax.persistence.EntityNotFoundException' }
            ]
        },
        {
            name: 'HealthRecordServiceTest',
            package: 'com.petpals.service',
            tests: [
                { name: 'testFindHealthRecordsByPetId', status: 'PASSED', duration: '0.065s' },
                { name: 'testSaveHealthRecord', status: 'PASSED', duration: '0.094s' },
                { name: 'testUpdateHealthRecord', status: 'PASSED', duration: '0.087s' },
                { name: 'testDeleteHealthRecord', status: 'PASSED', duration: '0.041s' },
                { name: 'testFindRecentHealthRecords', status: 'SKIPPED', duration: '0.000s', message: 'Feature not yet implemented' }
            ]
        }
    ]
};

// Deployment environments
const deploymentEnvironments = [
    {
        name: 'Development',
        url: 'dev.petpals.com',
        status: 'Active',
        version: '1.1.0-SNAPSHOT',
        lastDeployment: '2024-03-10T14:35:00Z',
        resources: {
            instances: 1,
            cpu: '1 vCPU',
            memory: '2 GB',
            storage: '20 GB'
        }
    },
    {
        name: 'Staging',
        url: 'staging.petpals.com',
        status: 'Active',
        version: '1.1.0-RC1',
        lastDeployment: '2024-03-09T10:15:00Z',
        resources: {
            instances: 2,
            cpu: '2 vCPU',
            memory: '4 GB',
            storage: '50 GB'
        }
    },
    {
        name: 'Production',
        url: 'petpals.com',
        status: 'Active',
        version: '1.0.0',
        lastDeployment: '2024-02-28T16:45:00Z',
        resources: {
            instances: 3,
            cpu: '4 vCPU',
            memory: '8 GB',
            storage: '100 GB'
        }
    }
];

/**
 * Initialize Build Tools Mode
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function initBuildTools(terminal, editorArea) {
    buildToolsActive = true;

    // Create welcome message in terminal
    const welcomeOutput = document.createElement('div');
    welcomeOutput.className = 'terminal-output';
    welcomeOutput.innerHTML = `
        <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h3>Total Tests: ${testResults.summary.total}</h3>
                <p>Execution Time: ${testResults.summary.duration}</p>
            </div>
            <div style="background-color: #2b2b2b; padding: 10px 20px; border-radius: 5px; text-align: center;">
                <h3 style="margin: 0;">Code Coverage</h3>
                <p style="font-size: 1.5em; margin: 5px 0; color: ${getCoverageColor(testResults.summary.coverage)};">${testResults.summary.coverage}</p>
                <a href="#" onclick="window.terminalProcessCommand('coverage'); return false;">View Coverage Details</a>
            </div>
        </div>

        <h2>Test Classes</h2>
        ${testResults.testClasses.map(testClass => `
            <div style="margin-bottom: 25px;">
                <h3>${testClass.name}</h3>
                <p style="color: #808080; margin-top: -10px;">${testClass.package}</p>

                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Test Method</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Status</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Duration</th>
                    </tr>
                    ${testClass.tests.map(test => {
                        let statusColor;
                        let statusIcon;

                        if (test.status === 'PASSED') {
                            statusColor = '#6a8759';
                            statusIcon = '✓';
                        } else if (test.status === 'FAILED') {
                            statusColor = '#cc0000';
                            statusIcon = '✗';
                        } else {
                            statusColor = '#808080';
                            statusIcon = '○';
                        }

                        return `
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #444;">
                                    ${test.name}
                                    ${test.error ? `<div style="color: #cc0000; font-size: 0.8em; margin-top: 3px;">${test.error}</div>` : ''}
                                    ${test.message ? `<div style="color: #808080; font-size: 0.8em; margin-top: 3px;">${test.message}</div>` : ''}
                                </td>
                                <td style="padding: 8px; border-bottom: 1px solid #444;">
                                    <span style="color: ${statusColor};">${statusIcon} ${test.status}</span>
                                </td>
                                <td style="padding: 8px; border-bottom: 1px solid #444;">${test.duration}</td>
                            </tr>
                        `;
                    }).join('')}
                </table>
            </div>
        `).join('')}="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Build & CI/CD Pipeline Explorer</div>
        <div>This interactive tool allows you to explore the build and deployment process for the PetPals application.</div>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">config</span>: Show build configuration</div>
        <div>- <span style="color: #cc7832">pom</span>: View Maven POM file</div>
        <div>- <span style="color: #cc7832">dependencies</span>: List project dependencies</div>
        <div>- <span style="color: #cc7832">pipeline</span>: Show CI/CD pipeline</div>
        <div>- <span style="color: #cc7832">workflow</span>: View GitHub workflow file</div>
        <div>- <span style="color: #cc7832">tests</span>: Show test results</div>
        <div>- <span style="color: #cc7832">coverage</span>: Show test coverage</div>
        <div>- <span style="color: #cc7832">environments</span>: List deployment environments</div>
        <div>- <span style="color: #cc7832">deploy {env}</span>: Show deployment details for an environment</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit build tools mode</div>
        <div style="margin-top: 10px; color: #808080;">Type 'config' to begin exploring the build configuration</div>
    `;

    // Update prompt style for build tools mode
    updateBuildToolsPrompt(terminal);

    // Insert welcome message before the prompt
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(welcomeOutput, lastPrompt);

    // Create build tools tab in editor area if it doesn't exist
    createBuildToolsTab(editorArea);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Update the terminal prompt to build tools mode style
 * @param {Object} terminal - The terminal DOM element
 */
function updateBuildToolsPrompt(terminal) {
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        // Change prompt style for build tools mode
        const userSpan = lastPrompt.querySelector('.terminal-user');
        if (userSpan) userSpan.textContent = 'maven';

        const machineSpan = lastPrompt.querySelector('.terminal-machine');
        if (machineSpan) machineSpan.textContent = 'build';

        const directorySpan = lastPrompt.querySelector('.terminal-directory');
        if (directorySpan) directorySpan.textContent = 'petpals';

        const symbolSpan = lastPrompt.querySelector('.terminal-symbol');
        if (symbolSpan) symbolSpan.textContent = '>';
    }
}

/**
 * Create build tools tab in editor area
 * @param {Object} editorArea - The editor area DOM element
 */
function createBuildToolsTab(editorArea) {
    // Check if tab already exists
    if (document.getElementById('buildToolsTab')) {
        // Just activate it
        activateBuildToolsTab();
        return;
    }

    // Create new tab
    const tabsContainer = editorArea.querySelector('.editor-tabs');
    const buildToolsTab = document.createElement('div');
    buildToolsTab.className = 'editor-tab';
    buildToolsTab.id = 'buildToolsTab';
    buildToolsTab.innerHTML = `
        <i class="fas fa-cogs"></i>
        <span class="tab-title">petpals-build</span>
        <i class="fas fa-times close-tab"></i>
    `;

    // Create content
    const contentContainer = editorArea.querySelector('.editor-content');
    const buildToolsContent = document.createElement('div');
    buildToolsContent.className = 'code-content markdown-content build-tools-code';
    buildToolsContent.id = 'buildToolsContent';
    buildToolsContent.innerHTML = `
        <div class="markdown-container">
            <h1>PetPals Build System</h1>
            <p>Explore the build configuration, CI/CD pipeline, and deployment process for the PetPals application.</p>

            <div id="buildToolsDetails">
                <h2>Build System Overview</h2>
                <p>Use terminal commands to explore the build system:</p>
                <ul>
                    <li>Type <code>config</code> to see build configuration</li>
                    <li>Type <code>pipeline</code> to view CI/CD pipeline</li>
                    <li>Type <code>tests</code> to see test results</li>
                </ul>
            </div>
        </div>
    `;

    // Add tab and content to DOM
    tabsContainer.appendChild(buildToolsTab);
    contentContainer.appendChild(buildToolsContent);

    // Add event listener to tab
    buildToolsTab.addEventListener('click', activateBuildToolsTab);

    // Add event listener to close button
    const closeBtn = buildToolsTab.querySelector('.close-tab');
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        buildToolsTab.style.display = 'none';
        if (buildToolsTab.classList.contains('active')) {
            // Show about tab if build tools tab is closed
            const aboutTab = document.getElementById('aboutTab');
            if (aboutTab) {
                aboutTab.click();
            }
        }
    });

    // Activate the tab
    activateBuildToolsTab();
}

/**
 * Activate the build tools tab
 */
function activateBuildToolsTab() {
    // Deactivate all tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all content
    document.querySelectorAll('.code-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activate build tools tab and content
    const buildToolsTab = document.getElementById('buildToolsTab');
    const buildToolsContent = document.getElementById('buildToolsContent');

    if (buildToolsTab && buildToolsContent) {
        buildToolsTab.classList.add('active');
        buildToolsTab.style.display = 'flex';
        buildToolsContent.classList.add('active');
    }
}

/**
 * Process build tools commands
 * @param {string} command - Command to process
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 * @returns {boolean} - Whether to continue in build tools mode
 */
function processBuildToolsCommand(command, terminal, editorArea) {
    const cmd = command.trim().toLowerCase();

    // Check for exit command
    if (cmd === 'exit') {
        const exitMsg = document.createElement('div');
        exitMsg.className = 'terminal-output';
        exitMsg.textContent = 'Exiting build tools mode...';

        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        terminal.insertBefore(exitMsg, lastPrompt);

        // Reset terminal style
        buildToolsActive = false;
        return false;
    }

    // Handle config command
    if (cmd === 'config') {
        showBuildConfig(terminal, editorArea);
        return true;
    }

    // Handle pom command
    if (cmd === 'pom') {
        showPomFile(terminal, editorArea);
        return true;
    }

    // Handle dependencies command
    if (cmd === 'dependencies') {
        showDependencies(terminal, editorArea);
        return true;
    }

    // Handle pipeline command
    if (cmd === 'pipeline') {
        showPipeline(terminal, editorArea);
        return true;
    }

    // Handle workflow command
    if (cmd === 'workflow') {
        showWorkflow(terminal, editorArea);
        return true;
    }

    // Handle tests command
    if (cmd === 'tests') {
        showTestResults(terminal, editorArea);
        return true;
    }

    // Handle coverage command
    if (cmd === 'coverage') {
        showCoverage(terminal, editorArea);
        return true;
    }

    // Handle environments command
    if (cmd === 'environments') {
        showEnvironments(terminal, editorArea);
        return true;
    }

    // Handle deploy command
    if (cmd.startsWith('deploy ')) {
        const env = cmd.substring(7).trim();
        showDeployment(env, terminal, editorArea);
        return true;
    }

    // Handle unknown command
    const unknownMsg = document.createElement('div');
    unknownMsg.className = 'terminal-output';
    unknownMsg.innerHTML = `
        <span style="color: #cc0000;">Unknown command: ${command}</span>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">config</span>: Show build configuration</div>
        <div>- <span style="color: #cc7832">pom</span>: View Maven POM file</div>
        <div>- <span style="color: #cc7832">dependencies</span>: List project dependencies</div>
        <div>- <span style="color: #cc7832">pipeline</span>: Show CI/CD pipeline</div>
        <div>- <span style="color: #cc7832">workflow</span>: View GitHub workflow file</div>
        <div>- <span style="color: #cc7832">tests</span>: Show test results</div>
        <div>- <span style="color: #cc7832">coverage</span>: Show test coverage</div>
        <div>- <span style="color: #cc7832">environments</span>: List deployment environments</div>
        <div>- <span style="color: #cc7832">deploy {env}</span>: Show deployment details for an environment</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit build tools mode</div>
    `;