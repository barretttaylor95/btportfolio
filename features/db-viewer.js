<div style="margin-top: 20px; padding: 10px; background-color: #3c3f41; border-radius: 5px;">
            <strong>Interactive Commands:</strong> Use the terminal to explore the database in detail:
            <ul>
                <li>Type <code>table {tableName}</code> to view details of a specific table</li>
                <li>Type <code>entity {tableName}</code> to see the JPA entity class</li>
                <li>Type <code>queries</code> to explore sample queries</li>
                <li>Type <code>diagram</code> to visualize the database structure</li>
            </ul>
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show details of a specific table
 * @param {string} tableName - The name of the table to show
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showTableDetails(tableName, terminal, editorArea) {
    // Find table by name
    const table = databaseSchema.tables.find(tbl => tbl.name.toLowerCase() === tableName.toLowerCase());

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!table) {
        // Table not found
        output.innerHTML = `<span style="color: #cc0000;">Table '${tableName}' not found. Type 'schema' to see available tables.</span>`;
    } else {
        // Build table details HTML
        let tableHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Table: ${table.name}</div>
            <div style="font-weight: bold; margin-bottom: 5px;">Columns:</div>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Name</th>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Type</th>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Nullable</th>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Key</th>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Default</th>
                </tr>
        `;

        // Add each column to the table
        table.columns.forEach(column => {
            let keyInfo = '';
            if (column.isPrimary) {
                keyInfo = 'PK';
            } else if (column.foreignKey) {
                keyInfo = `FK → ${column.foreignKey.table}(${column.foreignKey.column})`;
            }

            tableHtml += `
                <tr>
                    <td style="padding: 5px; border-bottom: 1px solid #444;"><code>${column.name}</code></td>
                    <td style="padding: 5px; border-bottom: 1px solid #444;">${column.type}</td>
                    <td style="padding: 5px; border-bottom: 1px solid #444;">${column.nullable ? 'YES' : 'NO'}</td>
                    <td style="padding: 5px; border-bottom: 1px solid #444;">${keyInfo}</td>
                    <td style="padding: 5px; border-bottom: 1px solid #444;">${column.defaultValue || ''}</td>
                </tr>
            `;
        });

        tableHtml += `</table>`;

        // Add indices if they exist
        if (table.indices && table.indices.length > 0) {
            tableHtml += `
                <div style="font-weight: bold; margin: 10px 0 5px 0;">Indices:</div>
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Name</th>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Columns</th>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Unique</th>
                    </tr>
            `;

            // Add each index to the table
            table.indices.forEach(index => {
                tableHtml += `
                    <tr>
                        <td style="padding: 5px; border-bottom: 1px solid #444;"><code>${index.name}</code></td>
                        <td style="padding: 5px; border-bottom: 1px solid #444;"><code>${index.columns.join(', ')}</code></td>
                        <td style="padding: 5px; border-bottom: 1px solid #444;">${index.isUnique ? 'YES' : 'NO'}</td>
                    </tr>
                `;
            });

            tableHtml += `</table>`;
        }

        // Add links to view entity class
        tableHtml += `
            <div style="margin-top: 10px;">Type <code>entity ${table.name}</code> to view JPA entity class</div>
        `;

        // Find related tables
        const relatedTables = getRelatedTables(table.name);
        if (relatedTables.length > 0) {
            tableHtml += `
                <div style="font-weight: bold; margin: 10px 0 5px 0;">Related Tables:</div>
                <ul>
            `;

            relatedTables.forEach(rel => {
                tableHtml += `<li><code>${rel.tableName}</code> (${rel.relationship})</li>`;
            });

            tableHtml += `</ul>`;
        }

        // Set output HTML
        output.innerHTML = tableHtml;

        // Update database tab content with table details
        updateDatabaseContent(`
            <h1>Table: ${table.name}</h1>
            <p>${getTableDescription(table.name)}</p>

            <h2>Columns</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Name</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Type</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Nullable</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Key</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Description</th>
                </tr>
                ${table.columns.map(column => {
                    let keyInfo = '';
                    if (column.isPrimary) {
                        keyInfo = '<span style="color: #cc7832;">PK</span>';
                    } else if (column.foreignKey) {
                        keyInfo = `<span style="color: #6a8759;">FK</span> → <a href="#" onclick="window.terminalProcessCommand('table ${column.foreignKey.table}'); return false;">${column.foreignKey.table}</a>(${column.foreignKey.column})`;
                    }

                    return `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #444;"><code>${column.name}</code></td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${column.type}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${column.nullable ? 'YES' : 'NO'}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${keyInfo}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${column.description}</td>
                        </tr>
                    `;
                }).join('')}
            </table>

            ${table.indices && table.indices.length > 0 ? `
                <h2>Indices</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Name</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Columns</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Unique</th>
                    </tr>
                    ${table.indices.map(index => `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #444;"><code>${index.name}</code></td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;"><code>${index.columns.join(', ')}</code></td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${index.isUnique ? 'YES' : 'NO'}</td>
                        </tr>
                    `).join('')}
                </table>
            ` : ''}

            ${getRelatedTables(table.name).length > 0 ? `
                <h2>Related Tables</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Table</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Relationship</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Via Columns</th>
                    </tr>
                    ${getRelatedTables(table.name).map(rel => `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #444;"><a href="#" onclick="window.terminalProcessCommand('table ${rel.tableName}'); return false;">${rel.tableName}</a></td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${rel.relationship}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;"><code>${rel.columns}</code></td>
                        </tr>
                    `).join('')}
                </table>
            ` : ''}

            <h2>JPA Entity</h2>
            <p>Type <code>entity ${table.name}</code> in the terminal to view the full JPA entity class.</p>
            <pre style="background-color: #2b2b2b; padding: 16px; border-radius: 5px; max-height: 300px; overflow-y: auto;">@Entity
@Table(name = "${table.name}")
public class ${getClassName(table.name)} {
    // See full entity definition with 'entity ${table.name}' command
}</pre>

            <div style="margin-top: 20px; padding: 10px; background-color: #3c3f41; border-radius: 5px;">
                <strong>Next Steps:</strong>
                <ul>
                    <li>Type <code>entity ${table.name}</code> to see the full entity class</li>
                    <li>Type <code>schema</code> to go back to all tables</li>
                    <li>Type <code>diagram</code> to see visual ER diagram</li>
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
 * Show JPA entity class for a table
 * @param {string} tableName - The name of the table
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showEntityClass(tableName, terminal, editorArea) {
    // Find table by name
    const table = databaseSchema.tables.find(tbl => tbl.name.toLowerCase() === tableName.toLowerCase());

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!table) {
        // Table not found
        output.innerHTML = `<span style="color: #cc0000;">Table '${tableName}' not found. Type 'schema' to see available tables.</span>`;
    } else if (!table.entityClass) {
        // Entity class not found
        output.innerHTML = `<span style="color: #cc0000;">Entity class for '${tableName}' not found.</span>`;
    } else {
        // Build entity class HTML
        let entityHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">JPA Entity for: ${table.name}</div>
            <pre style="background-color: #2b2b2b; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap;">${table.entityClass}</pre>
        `;

        // Set output HTML
        output.innerHTML = entityHtml;

        // Update database tab content
        updateDatabaseContent(`
            <h1>JPA Entity: ${getClassName(table.name)}</h1>
            <p>This is the Java Persistence API (JPA) entity class for the <code>${table.name}</code> table.</p>

            <pre style="background-color: #2b2b2b; padding: 16px; border-radius: 5px; overflow-x: auto; font-size: 0.9em; line-height: 1.4em;">${table.entityClass}</pre>

            <div style="margin-top: 20px;">
                <a href="#" onclick="window.terminalProcessCommand('table ${table.name}'); return false;">← Back to Table Details</a> |
                <a href="#" onclick="window.terminalProcessCommand('schema'); return false;">View All Tables</a>
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
 * List all available sample queries
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function listSampleQueries(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build queries list HTML
    let queriesHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Sample Database Queries</div>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">#</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Name</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Description</th>
            </tr>
    `;

    // Add each query to the list
    sampleQueries.forEach((query, index) => {
        queriesHtml += `
            <tr>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${index + 1}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${query.name}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${query.description}</td>
            </tr>
        `;
    });

    queriesHtml += `</table>
        <div style="margin-top: 10px;">Type <code>query {number}</code> to view a specific query</div>
    `;

    // Set output HTML
    output.innerHTML = queriesHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update database tab content
    updateDatabaseContent(`
        <h1>Sample Database Queries</h1>
        <p>Below are sample SQL queries and their JPA equivalents for common operations on the PetPals database.</p>

        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">#</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Query</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Description</th>
            </tr>
            ${sampleQueries.map((query, index) => `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${index + 1}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><a href="#" onclick="window.terminalProcessCommand('query ${index + 1}'); return false;">${query.name}</a></td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${query.description}</td>
                </tr>
            `).join('')}
        </table>

        <div style="margin-top: 20px; padding: 10px; background-color: #3c3f41; border-radius: 5px;">
            <strong>View Query Details:</strong> Type <code>query {number}</code> in the terminal to see the SQL and JPA code for each query.
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show a specific sample query
 * @param {number} queryNumber - The number of the query to show (1-based index)
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showSampleQuery(queryNumber, terminal, editorArea) {
    // Adjust for 0-based index
    const index = queryNumber - 1;

    // Check if query exists
    if (index < 0 || index >= sampleQueries.length) {
        // Query not found
        const errorMsg = document.createElement('div');
        errorMsg.className = 'terminal-output';
        errorMsg.innerHTML = `<span style="color: #cc0000;">Query ${queryNumber} not found. Type 'queries' to see available queries.</span>`;

        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        terminal.insertBefore(errorMsg, lastPrompt);

        // Scroll terminal to bottom
        terminal.scrollTop = terminal.scrollHeight;
        return;
    }

    // Get the query
    const query = sampleQueries[index];

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build query details HTML
    let queryHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Query ${queryNumber}: ${query.name}</div>
        <div style="margin-bottom: 10px;">${query.description}</div>

        <div style="font-weight: bold; margin-top: 10px;">SQL:</div>
        <pre style="background-color: #2b2b2b; padding: 10px; border-radius: 5px; overflow-x: auto;">${query.sql}</pre>

        <div style="font-weight: bold; margin-top: 10px;">JPA Code:</div>
        <pre style="background-color: #2b2b2b; padding: 10px; border-radius: 5px; overflow-x: auto;">${query.jpaCode}</pre>

        <div style="margin-top: 10px;">Type <code>queries</code> to view all queries</div>
    `;

    // Set output HTML
    output.innerHTML = queryHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update database tab content
    updateDatabaseContent(`
        <h1>Query ${queryNumber}: ${query.name}</h1>
        <p>${query.description}</p>

        <h2>SQL</h2>
        <pre style="background-color: #2b2b2b; padding: 16px; border-radius: 5px; overflow-x: auto;">${query.sql}</pre>

        <h2>JPA Implementation</h2>
        <pre style="background-color: #2b2b2b; padding: 16px; border-radius: 5px; overflow-x: auto;">${query.jpaCode}</pre>

        <h2>Tables Involved</h2>
        <ul>
            ${getTablesFromQuery(query.sql).map(tableName =>
                `<li><a href="#" onclick="window.terminalProcessCommand('table ${tableName}'); return false;">${tableName}</a></li>`
            ).join('')}
        </ul>

        <div style="margin-top: 20px;">
            <a href="#" onclick="window.terminalProcessCommand('queries'); return false;">← Back to All Queries</a>
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show ER diagram
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showErDiagram(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build ER diagram HTML (terminal version is simplified)
    let diagramHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">ER Diagram Generated</div>
        <div>Entity-Relationship diagram has been generated in the editor panel.</div>
        <div>Tables: ${databaseSchema.tables.length}, Relationships: ${databaseSchema.relationships.length}</div>
    `;

    // Set output HTML
    output.innerHTML = diagramHtml;

    // Generate full ER diagram in Mermaid syntax
    const mermaidDiagram = generateMermaidErDiagram();

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update database tab content
    updateDatabaseContent(`
        <h1>PetPals Database ER Diagram</h1>
        <p>Visual representation of the ${databaseSchema.name} database structure and relationships.</p>

        <div class="mermaid-diagram">
            ${mermaidDiagram}
        </div>

        <h2>Legend</h2>
        <ul>
            <li><span style="color: #cc7832">PK</span> - Primary Key</li>
            <li><span style="color: #6a8759">FK</span> - Foreign Key</li>
            <li>One-to-many relationship: <code>||--o{</code></li>
            <li>One-to-one relationship: <code>||--||</code></li>
            <li>Many-to-many relationship: <code>}o--o{</code></li>
        </ul>

        <div style="margin-top: 20px; padding: 10px; background-color: #3c3f41; border-radius: 5px;">
            <strong>Explore Tables:</strong> Type <code>table {tableName}</code> in the terminal to see detailed structure of any table.
        </div>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Generate Mermaid syntax for ER diagram
 * @returns {string} - Mermaid ER diagram syntax
 */
function generateMermaidErDiagram() {
    let diagram = `erDiagram\n`;

    // Add entities (tables)
    databaseSchema.tables.forEach(table => {
        diagram += `    ${table.name} {\n`;

        // Add columns
        table.columns.forEach(column => {
            let columnType = column.type.replace(/\(.*\)/, ''); // Simplify type by removing size/precision
            let keyIndicator = column.isPrimary ? 'PK' : (column.foreignKey ? 'FK' : '');
            diagram += `        ${columnType} ${column.name} ${keyIndicator}\n`;
        });

        diagram += `    }\n`;
    });

    // Add relationships
    databaseSchema.relationships.forEach(rel => {
        let relSymbol;

        switch (rel.type) {
            case 'one-to-one':
                relSymbol = '||--||';
                break;
            case 'one-to-many':
                relSymbol = '||--o{';
                break;
            case 'many-to-one':
                relSymbol = '}o--||';
                break;
            case 'many-to-many':
                relSymbol = '}o--o{';
                break;
            default:
                relSymbol = '||--o{'; // Default to one-to-many
        }

        diagram += `    ${rel.from.table} ${relSymbol} ${rel.to.table} : "${rel.from.column}"\n`;
    });

    return diagram;
}

/**
 * Get description for a table
 * @param {string} tableName - Table name
 * @returns {string} - Table description
 */
function getTableDescription(tableName) {
    switch(tableName.toLowerCase()) {
        case 'pet':
            return 'Stores information about pets, including their basic details and owner';
        case 'owner':
            return 'Contains pet owner contact information and identification';
        case 'health_record':
            return 'Tracks health checkups and medical information for pets';
        case 'medication':
            return 'Catalog of medications with dosage instructions';
        case 'pet_medication':
            return 'Junction table linking pets to their prescribed medications';
        default:
            return 'Database table';
    }
}

/**
 * Get class name from table name (convert snake_case to PascalCase)
 * @param {string} tableName - Table name in snake_case
 * @returns {string} - Class name in PascalCase
 */
function getClassName(tableName) {
    return tableName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

/**
 * Get related tables for a specific table
 * @param {string} tableName - Table name
 * @returns {Array} - Array of related table info
 */
function getRelatedTables(tableName) {
    const relatedTables = [];

    // Find relationships from this table to others
    databaseSchema.relationships.forEach(rel => {
        if (rel.from.table === tableName) {
            relatedTables.push({
                tableName: rel.to.table,
                relationship: getRelationshipLabel(rel.type, false),
                columns: `${rel.from.column} → ${rel.to.table}.${rel.to.column}`
            });
        } else if (rel.to.table === tableName) {
            relatedTables.push({
                tableName: rel.from.table,
                relationship: getRelationshipLabel(rel.type, true),
                columns: `${rel.from.table}.${rel.from.column} → ${rel.to.column}`
            });
        }
    });

    return relatedTables;
}

/**
 * Get human-readable relationship label
 * @param {string} type - Relationship type
 * @param {boolean} isInverse - Whether viewing from target end
 * @returns {string} - Human-readable relationship label
 */
function getRelationshipLabel(type, isInverse) {
    if (isInverse) {
        switch (type) {
            case 'one-to-one': return 'One-to-One';
            case 'one-to-many': return 'Many-to-One';
            case 'many-to-one': return 'One-to-Many';
            case 'many-to-many': return 'Many-to-Many';
            default: return type;
        }
    } else {
        return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
    }
}

/**
 * Extract table names from an SQL query
 * @param {string} sql - SQL query
 * @returns {Array} - Array of table names
 */
function getTablesFromQuery(sql) {
    // Simple regex-based extraction, not perfect but good enough for demo
    const fromMatches = sql.match(/FROM\s+([a-z_]+)/gi) || [];
    const joinMatches = sql.match(/JOIN\s+([a-z_]+)/gi) || [];

    // Extract table names
    const fromTables = fromMatches.map(match => match.replace(/FROM\s+/i, '').trim());
    const joinTables = joinMatches.map(match => match.replace(/JOIN\s+/i, '').trim());

    // Combine and deduplicate
    return [...new Set([...fromTables, ...joinTables])];
}

/**
 * Update database tab content
 * @param {string} html - HTML content to update
 */
function updateDatabaseContent(html) {
    const databaseDetails = document.getElementById('databaseDetails');
    if (databaseDetails) {
        databaseDetails.innerHTML = html;
    }
}

/**
 * Exported methods to interface with the main terminal system
 */
export default {
    /**
     * Start database viewer mode
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     */
    start: function(terminal, editorArea) {
        initDatabaseViewer(terminal, editorArea);
    },

    /**
     * Process database viewer input
     * @param {string} command - The entered command
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     * @returns {boolean} - Whether to stay in database viewer mode
     */
    processInput: function(command, terminal, editorArea) {
        return processDatabaseCommand(command, terminal, editorArea);
    },

    /**
     * Check if database viewer mode is active
     * @returns {boolean} - Database viewer mode status
     */
    isActive: function() {
        return dbViewerActive;
    }
};/**
 * Database Schema Visualization Module
 *
 * Provides interactive database schema diagrams and exploration for PetPals MySQL database
 */

// Track if DB viewer mode is active
let dbViewerActive = false;

// Database schema data
const databaseSchema = {
    name: 'petpals_db',
    tables: [
        {
            name: 'pet',
            columns: [
                { name: 'id', type: 'BIGINT', isPrimary: true, isAutoIncrement: true, nullable: false, description: 'Unique identifier for the pet' },
                { name: 'name', type: 'VARCHAR(100)', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'Name of the pet' },
                { name: 'type', type: 'VARCHAR(50)', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'Type of animal (e.g., Dog, Cat)' },
                { name: 'breed', type: 'VARCHAR(100)', isPrimary: false, isAutoIncrement: false, nullable: true, description: 'Breed of the pet' },
                { name: 'age', type: 'INT', isPrimary: false, isAutoIncrement: false, nullable: true, description: 'Age of the pet in years' },
                { name: 'owner_id', type: 'BIGINT', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'ID of the owner', foreignKey: { table: 'owner', column: 'id' } },
                { name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'When the record was created', defaultValue: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'When the record was last updated', defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
            ],
            indices: [
                { name: 'PRIMARY', columns: ['id'], isUnique: true },
                { name: 'fk_pet_owner_idx', columns: ['owner_id'], isUnique: false }
            ],
            entityClass: `@Entity
@Table(name = "pet")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String type;

    private String breed;

    private Integer age;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Getters and Setters
}`
        },
        {
            name: 'owner',
            columns: [
                { name: 'id', type: 'BIGINT', isPrimary: true, isAutoIncrement: true, nullable: false, description: 'Unique identifier for the owner' },
                { name: 'name', type: 'VARCHAR(100)', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'Name of the owner' },
                { name: 'email', type: 'VARCHAR(100)', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'Email address of the owner' },
                { name: 'phone', type: 'VARCHAR(20)', isPrimary: false, isAutoIncrement: false, nullable: true, description: 'Phone number of the owner' },
                { name: 'address', type: 'VARCHAR(255)', isPrimary: false, isAutoIncrement: false, nullable: true, description: 'Address of the owner' },
                { name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'When the record was created', defaultValue: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'When the record was last updated', defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
            ],
            indices: [
                { name: 'PRIMARY', columns: ['id'], isUnique: true },
                { name: 'email_UNIQUE', columns: ['email'], isUnique: true }
            ],
            entityClass: `@Entity
@Table(name = "owner")
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

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Pet> pets = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Getters and Setters
}`
        },
        {
            name: 'health_record',
            columns: [
                { name: 'id', type: 'BIGINT', isPrimary: true, isAutoIncrement: true, nullable: false, description: 'Unique identifier for the health record' },
                { name: 'pet_id', type: 'BIGINT', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'ID of the pet', foreignKey: { table: 'pet', column: 'id' } },
                { name: 'checkup_date', type: 'DATE', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'Date of the checkup' },
                { name: 'weight', type: 'DECIMAL(5,2)', isPrimary: false, isAutoIncrement: false, nullable: true, description: 'Weight of the pet in pounds' },
                { name: 'temperature', type: 'DECIMAL(4,1)', isPrimary: false, isAutoIncrement: false, nullable: true, description: 'Body temperature of the pet in Fahrenheit' },
                { name: 'heart_rate', type: 'INT', isPrimary: false, isAutoIncrement: false, nullable: true, description: 'Heart rate of the pet in BPM' },
                { name: 'vet_notes', type: 'TEXT', isPrimary: false, isAutoIncrement: false, nullable: true, description: 'Notes from the veterinarian' },
                { name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'When the record was created', defaultValue: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'When the record was last updated', defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
            ],
            indices: [
                { name: 'PRIMARY', columns: ['id'], isUnique: true },
                { name: 'fk_health_record_pet_idx', columns: ['pet_id'], isUnique: false }
            ],
            entityClass: `@Entity
@Table(name = "health_record")
public class HealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @NotNull
    @Column(name = "checkup_date", nullable = false)
    private LocalDate checkupDate;

    @Column(precision = 5, scale = 2)
    private BigDecimal weight;

    @Column(precision = 4, scale = 1)
    private BigDecimal temperature;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "vet_notes", columnDefinition = "TEXT")
    private String vetNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Getters and Setters
}`
        },
        {
            name: 'medication',
            columns: [
                { name: 'id', type: 'BIGINT', isPrimary: true, isAutoIncrement: true, nullable: false, description: 'Unique identifier for the medication' },
                { name: 'name', type: 'VARCHAR(100)', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'Name of the medication' },
                { name: 'description', type: 'TEXT', isPrimary: false, isAutoIncrement: false, nullable: true, description: 'Description of the medication' },
                { name: 'dosage_instructions', type: 'TEXT', isPrimary: false, isAutoIncrement: false, nullable: true, description: 'Instructions for administering the medication' },
                { name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'When the record was created', defaultValue: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'When the record was last updated', defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
            ],
            indices: [
                { name: 'PRIMARY', columns: ['id'], isUnique: true }
            ],
            entityClass: `@Entity
@Table(name = "medication")
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "dosage_instructions", columnDefinition = "TEXT")
    private String dosageInstructions;

    @OneToMany(mappedBy = "medication")
    private List<PetMedication> petMedications = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Getters and Setters
}`
        },
        {
            name: 'pet_medication',
            columns: [
                { name: 'id', type: 'BIGINT', isPrimary: true, isAutoIncrement: true, nullable: false, description: 'Unique identifier for the pet medication' },
                { name: 'pet_id', type: 'BIGINT', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'ID of the pet', foreignKey: { table: 'pet', column: 'id' } },
                { name: 'medication_id', type: 'BIGINT', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'ID of the medication', foreignKey: { table: 'medication', column: 'id' } },
                { name: 'start_date', type: 'DATE', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'Start date for the medication' },
                { name: 'end_date', type: 'DATE', isPrimary: false, isAutoIncrement: false, nullable: true, description: 'End date for the medication' },
                { name: 'custom_dosage', type: 'VARCHAR(255)', isPrimary: false, isAutoIncrement: false, nullable: true, description: 'Custom dosage instructions for this pet' },
                { name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'When the record was created', defaultValue: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, description: 'When the record was last updated', defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
            ],
            indices: [
                { name: 'PRIMARY', columns: ['id'], isUnique: true },
                { name: 'fk_pet_medication_pet_idx', columns: ['pet_id'], isUnique: false },
                { name: 'fk_pet_medication_medication_idx', columns: ['medication_id'], isUnique: false }
            ],
            entityClass: `@Entity
@Table(name = "pet_medication")
public class PetMedication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "medication_id", nullable = false)
    private Medication medication;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "custom_dosage")
    private String customDosage;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Getters and Setters
}`
        }
    ],
    relationships: [
        { from: { table: 'pet', column: 'owner_id' }, to: { table: 'owner', column: 'id' }, type: 'many-to-one' },
        { from: { table: 'health_record', column: 'pet_id' }, to: { table: 'pet', column: 'id' }, type: 'many-to-one' },
        { from: { table: 'pet_medication', column: 'pet_id' }, to: { table: 'pet', column: 'id' }, type: 'many-to-one' },
        { from: { table: 'pet_medication', column: 'medication_id' }, to: { table: 'medication', column: 'id' }, type: 'many-to-one' }
    ]
};

// Sample queries that match the schema
const sampleQueries = [
    {
        name: 'Find all pets with their owners',
        description: 'Retrieves all pets with owner information',
        sql: `SELECT p.id, p.name, p.type, p.breed, p.age, o.name as owner_name, o.email as owner_email
FROM pet p
JOIN owner o ON p.owner_id = o.id
ORDER BY p.name;`,
        jpaCode: `// Using Spring Data JPA repository method
List<Pet> findAllPets() {
    return petRepository.findAll();
}

// Or with custom JPQL query
@Query("SELECT p FROM Pet p JOIN FETCH p.owner ORDER BY p.name")
List<Pet> findAllPetsWithOwners();`
    },
    {
        name: 'Find pets by type with health records',
        description: 'Retrieves all pets of a specific type along with their health records',
        sql: `SELECT p.id, p.name, p.breed, p.age, h.checkup_date, h.weight, h.temperature, h.heart_rate, h.vet_notes
FROM pet p
LEFT JOIN health_record h ON p.id = h.pet_id
WHERE p.type = :type
ORDER BY p.name, h.checkup_date DESC;`,
        jpaCode: `// Using Spring Data JPA repository method
List<Pet> findByType(String type);

// With custom query to fetch health records
@Query("SELECT p FROM Pet p LEFT JOIN FETCH p.healthRecords WHERE p.type = :type ORDER BY p.name")
List<Pet> findPetsByTypeWithHealthRecords(@Param("type") String type);`
    },
    {
        name: 'Find pets with current medications',
        description: 'Retrieves all pets with their current medications',
        sql: `SELECT p.id, p.name, p.type, m.name as medication_name,
       pm.start_date, pm.end_date, COALESCE(pm.custom_dosage, m.dosage_instructions) as dosage
FROM pet p
JOIN pet_medication pm ON p.id = pm.pet_id
JOIN medication m ON pm.medication_id = m.id
WHERE pm.end_date IS NULL OR pm.end_date >= CURRENT_DATE
ORDER BY p.name, m.name;`,
        jpaCode: `// Custom JPA query
@Query("SELECT p FROM Pet p " +
       "JOIN FETCH p.petMedications pm " +
       "JOIN FETCH pm.medication m " +
       "WHERE pm.endDate IS NULL OR pm.endDate >= CURRENT_DATE " +
       "ORDER BY p.name, m.name")
List<Pet> findPetsWithCurrentMedications();`
    },
    {
        name: 'Find health records by date range',
        description: 'Retrieves health records within a specific date range',
        sql: `SELECT p.name as pet_name, p.type, o.name as owner_name,
       h.checkup_date, h.weight, h.temperature, h.heart_rate, h.vet_notes
FROM health_record h
JOIN pet p ON h.pet_id = p.id
JOIN owner o ON p.owner_id = o.id
WHERE h.checkup_date BETWEEN :startDate AND :endDate
ORDER BY h.checkup_date DESC, p.name;`,
        jpaCode: `@Query("SELECT h FROM HealthRecord h " +
       "JOIN FETCH h.pet p " +
       "JOIN FETCH p.owner " +
       "WHERE h.checkupDate BETWEEN :startDate AND :endDate " +
       "ORDER BY h.checkupDate DESC, p.name")
List<HealthRecord> findHealthRecordsByDateRange(
    @Param("startDate") LocalDate startDate,
    @Param("endDate") LocalDate endDate);`
    }
];

/**
 * Initialize Database Viewer Mode
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function initDatabaseViewer(terminal, editorArea) {
    dbViewerActive = true;

    // Create welcome message in terminal
    const welcomeOutput = document.createElement('div');
    welcomeOutput.className = 'terminal-output';
    welcomeOutput.innerHTML = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Database Schema Explorer</div>
        <div>This interactive tool allows you to explore the PetPals database schema.</div>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">schema</span>: Show database schema overview</div>
        <div>- <span style="color: #cc7832">table {tableName}</span>: Show details for a specific table</div>
        <div>- <span style="color: #cc7832">entity {tableName}</span>: Show JPA entity class for a table</div>
        <div>- <span style="color: #cc7832">query {queryNumber}</span>: Show a sample query</div>
        <div>- <span style="color: #cc7832">queries</span>: List all sample queries</div>
        <div>- <span style="color: #cc7832">diagram</span>: Display ER diagram</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit database viewer mode</div>
        <div style="margin-top: 10px; color: #808080;">Type 'schema' to begin exploring the database structure</div>
    `;

    // Update prompt style for database mode
    updateDatabasePrompt(terminal);

    // Insert welcome message before the prompt
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(welcomeOutput, lastPrompt);

    // Create database tab in editor area if it doesn't exist
    createDatabaseTab(editorArea);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Update the terminal prompt to database mode style
 * @param {Object} terminal - The terminal DOM element
 */
function updateDatabasePrompt(terminal) {
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        // Change prompt style for database mode
        const userSpan = lastPrompt.querySelector('.terminal-user');
        if (userSpan) userSpan.textContent = 'db';

        const machineSpan = lastPrompt.querySelector('.terminal-machine');
        if (machineSpan) machineSpan.textContent = 'mysql';

        const directorySpan = lastPrompt.querySelector('.terminal-directory');
        if (directorySpan) directorySpan.textContent = 'petpals_db';

        const symbolSpan = lastPrompt.querySelector('.terminal-symbol');
        if (symbolSpan) symbolSpan.textContent = '>';
    }
}

/**
 * Create database tab in editor area
 * @param {Object} editorArea - The editor area DOM element
 */
function createDatabaseTab(editorArea) {
    // Check if tab already exists
    if (document.getElementById('databaseTab')) {
        // Just activate it
        activateDatabaseTab();
        return;
    }

    // Create new tab
    const tabsContainer = editorArea.querySelector('.editor-tabs');
    const databaseTab = document.createElement('div');
    databaseTab.className = 'editor-tab';
    databaseTab.id = 'databaseTab';
    databaseTab.innerHTML = `
        <i class="fas fa-database"></i>
        <span class="tab-title">petpals_db.sql</span>
        <i class="fas fa-times close-tab"></i>
    `;

    // Create content
    const contentContainer = editorArea.querySelector('.editor-content');
    const databaseContent = document.createElement('div');
    databaseContent.className = 'code-content markdown-content database-code';
    databaseContent.id = 'databaseContent';
    databaseContent.innerHTML = `
        <div class="markdown-container">
            <h1>PetPals Database Schema</h1>
            <p>This database manages pet health records, owner information, and medication tracking for the PetPals application.</p>

            <div id="databaseDetails">
                <h2>Database Overview</h2>
                <p>Use terminal commands to explore the database structure and sample queries.</p>
                <ul>
                    <li>Type <code>schema</code> to see all tables</li>
                    <li>Type <code>table {tableName}</code> to view table structure</li>
                    <li>Type <code>diagram</code> to view ER diagram</li>
                </ul>
            </div>
        </div>
    `;

    // Add tab and content to DOM
    tabsContainer.appendChild(databaseTab);
    contentContainer.appendChild(databaseContent);

    // Add event listener to tab
    databaseTab.addEventListener('click', activateDatabaseTab);

    // Add event listener to close button
    const closeBtn = databaseTab.querySelector('.close-tab');
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        databaseTab.style.display = 'none';
        if (databaseTab.classList.contains('active')) {
            // Show about tab if database tab is closed
            const aboutTab = document.getElementById('aboutTab');
            if (aboutTab) {
                aboutTab.click();
            }
        }
    });

    // Activate the tab
    activateDatabaseTab();
}

/**
 * Activate the database tab
 */
function activateDatabaseTab() {
    // Deactivate all tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all content
    document.querySelectorAll('.code-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activate database tab and content
    const databaseTab = document.getElementById('databaseTab');
    const databaseContent = document.getElementById('databaseContent');

    if (databaseTab && databaseContent) {
        databaseTab.classList.add('active');
        databaseTab.style.display = 'flex';
        databaseContent.classList.add('active');
    }
}

/**
 * Process database viewer commands
 * @param {string} command - Command to process
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 * @returns {boolean} - Whether to continue in database viewer mode
 */
function processDatabaseCommand(command, terminal, editorArea) {
    const cmd = command.trim().toLowerCase();

    // Check for exit command
    if (cmd === 'exit') {
        const exitMsg = document.createElement('div');
        exitMsg.className = 'terminal-output';
        exitMsg.textContent = 'Exiting database viewer mode...';

        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        terminal.insertBefore(exitMsg, lastPrompt);

        // Reset terminal style
        dbViewerActive = false;
        return false;
    }

    // Handle schema command
    if (cmd === 'schema') {
        showDatabaseSchema(terminal, editorArea);
        return true;
    }

    // Handle diagram command
    if (cmd === 'diagram') {
        showErDiagram(terminal, editorArea);
        return true;
    }

    // Handle table command
    if (cmd.startsWith('table ')) {
        const tableName = cmd.substring(6).trim();
        showTableDetails(tableName, terminal, editorArea);
        return true;
    }

    // Handle entity command
    if (cmd.startsWith('entity ')) {
        const tableName = cmd.substring(7).trim();
        showEntityClass(tableName, terminal, editorArea);
        return true;
    }

    // Handle queries command
    if (cmd === 'queries') {
        listSampleQueries(terminal, editorArea);
        return true;
    }

    // Handle query command
    if (cmd.startsWith('query ')) {
        const queryNumber = parseInt(cmd.substring(6).trim());
        showSampleQuery(queryNumber, terminal, editorArea);
        return true;
    }

    // Handle unknown command
    const unknownMsg = document.createElement('div');
    unknownMsg.className = 'terminal-output';
    unknownMsg.innerHTML = `
        <span style="color: #cc0000;">Unknown command: ${command}</span>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">schema</span>: Show database schema overview</div>
        <div>- <span style="color: #cc7832">table {tableName}</span>: Show details for a specific table</div>
        <div>- <span style="color: #cc7832">entity {tableName}</span>: Show JPA entity class for a table</div>
        <div>- <span style="color: #cc7832">query {queryNumber}</span>: Show a sample query</div>
        <div>- <span style="color: #cc7832">queries</span>: List all sample queries</div>
        <div>- <span style="color: #cc7832">diagram</span>: Display ER diagram</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit database viewer mode</div>
    `;

    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(unknownMsg, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;

    return true;
}

/**
 * Show database schema overview
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showDatabaseSchema(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build schema HTML
    let schemaHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Database: ${databaseSchema.name}</div>
        <div style="font-weight: bold; margin-bottom: 5px;">Tables:</div>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Table Name</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Columns</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Primary Key</th>
            </tr>
    `;

    // Add each table to the schema list
    databaseSchema.tables.forEach(table => {
        const primaryKey = table.columns.find(col => col.isPrimary)?.name || 'None';
        schemaHtml += `
            <tr>
                <td style="padding: 5px; border-bottom: 1px solid #444;"><code>${table.name}</code></td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${table.columns.length}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;"><code>${primaryKey}</code></td>
            </tr>
        `;
    });

    schemaHtml += `</table>
        <div style="margin-top: 10px;">Type <code>table {tableName}</code> to view table structure</div>
        <div>Type <code>diagram</code> to view ER diagram</div>
    `;

    // Set output HTML
    output.innerHTML = schemaHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update database tab content
    updateDatabaseContent(`
        <h1>PetPals Database Schema</h1>
        <p>Below is an overview of the ${databaseSchema.name} database structure.</p>

        <h2>Tables</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Table Name</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Description</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Columns</th>
            </tr>
            ${databaseSchema.tables.map(table => `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><a href="#" onclick="window.terminalProcessCommand('table ${table.name}'); return false;"><code>${table.name}</code></a></td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${getTableDescription(table.name)}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${table.columns.length}</td>
                </tr>
            `).join('')}
        </table>

        <h2>Relationships</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Source Table</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Target Table</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Type</th>
            </tr>
            ${databaseSchema.relationships.map(rel => `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><code>${rel.from.table}.${rel.from.column}</code></td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><code>${rel.to.table}.${rel.to.column}</code></td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${rel.type}</td>
                </tr>
            `).join('')}
        </table>

        <div style="margin-top