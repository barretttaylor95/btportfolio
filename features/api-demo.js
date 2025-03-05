/**
 * Spring Boot API Demonstration Module
 *
 * Provides an interactive API demonstration experience that simulates
 * a Spring Boot REST API with documentation and testing capabilities.
 */

// Track if API demo mode is active
let apiDemoActive = false;

// Demo API endpoints data structure
const apiEndpoints = [
    {
        id: 'getAllPets',
        path: '/api/pets',
        method: 'GET',
        description: 'Get all pets in the system',
        parameters: [],
        responses: {
            '200': {
                description: 'List of all pets',
                schema: {
                    type: 'array',
                    items: {
                        $ref: '#/definitions/Pet'
                    }
                },
                example: [
                    {
                        id: 1,
                        name: 'Max',
                        type: 'Dog',
                        breed: 'Golden Retriever',
                        age: 3,
                        owner: {
                            id: 1,
                            name: 'John Smith',
                            email: 'john@example.com'
                        }
                    },
                    {
                        id: 2,
                        name: 'Whiskers',
                        type: 'Cat',
                        breed: 'Siamese',
                        age: 2,
                        owner: {
                            id: 2,
                            name: 'Jane Doe',
                            email: 'jane@example.com'
                        }
                    }
                ]
            }
        },
        controllerCode: `@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    @Autowired
    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public ResponseEntity<List<Pet>> getAllPets() {
        return ResponseEntity.ok(petService.findAllPets());
    }
}

/**
 * Exported methods to interface with the main terminal system
 */
export default {
    /**
     * Start API demo mode
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     */
    start: function(terminal, editorArea) {
        initApiDemo(terminal, editorArea);
    },

    /**
     * Process API demo input
     * @param {string} command - The entered command
     * @param {Object} terminal - The terminal DOM element
     * @param {Object} editorArea - The editor area DOM element
     * @returns {boolean} - Whether to stay in API demo mode
     */
    processInput: function(command, terminal, editorArea) {
        return processApiCommand(command, terminal, editorArea);
    },

    /**
     * Check if API demo mode is active
     * @returns {boolean} - API demo mode status
     */
    isActive: function() {
        return apiDemoActive;
    }
};`
    },
    {
        id: 'getPetById',
        path: '/api/pets/{id}',
        method: 'GET',
        description: 'Get a pet by its ID',
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                type: 'integer',
                description: 'ID of the pet to retrieve'
            }
        ],
        responses: {
            '200': {
                description: 'Pet details',
                schema: {
                    $ref: '#/definitions/Pet'
                },
                example: {
                    id: 1,
                    name: 'Max',
                    type: 'Dog',
                    breed: 'Golden Retriever',
                    age: 3,
                    owner: {
                        id: 1,
                        name: 'John Smith',
                        email: 'john@example.com'
                    }
                }
            },
            '404': {
                description: 'Pet not found',
                example: {
                    timestamp: '2025-03-01T12:00:00.000+00:00',
                    status: 404,
                    error: 'Not Found',
                    message: 'Pet with ID 999 not found',
                    path: '/api/pets/999'
                }
            }
        },
        controllerCode: `@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    @Autowired
    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        return petService.findPetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}`
    },
    {
        id: 'createPet',
        path: '/api/pets',
        method: 'POST',
        description: 'Create a new pet',
        parameters: [
            {
                name: 'pet',
                in: 'body',
                required: true,
                schema: {
                    $ref: '#/definitions/Pet'
                },
                description: 'Pet object to be added'
            }
        ],
        requestExample: {
            name: 'Buddy',
            type: 'Dog',
            breed: 'Labrador',
            age: 1,
            ownerId: 3
        },
        responses: {
            '201': {
                description: 'Pet created successfully',
                schema: {
                    $ref: '#/definitions/Pet'
                },
                example: {
                    id: 3,
                    name: 'Buddy',
                    type: 'Dog',
                    breed: 'Labrador',
                    age: 1,
                    owner: {
                        id: 3,
                        name: 'Mike Johnson',
                        email: 'mike@example.com'
                    }
                }
            },
            '400': {
                description: 'Invalid request',
                example: {
                    timestamp: '2025-03-01T12:00:00.000+00:00',
                    status: 400,
                    error: 'Bad Request',
                    message: 'Validation failed: Pet name cannot be empty',
                    path: '/api/pets'
                }
            }
        },
        controllerCode: `@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    @Autowired
    public PetController(PetService petService) {
        this.petService = petService;
    }

    @PostMapping
    public ResponseEntity<Pet> createPet(@Valid @RequestBody Pet pet) {
        Pet savedPet = petService.savePet(pet);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(savedPet.getId())
            .toUri();
        return ResponseEntity.created(location).body(savedPet);
    }
}`
    },
    {
        id: 'updatePet',
        path: '/api/pets/{id}',
        method: 'PUT',
        description: 'Update an existing pet',
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                type: 'integer',
                description: 'ID of the pet to update'
            },
            {
                name: 'pet',
                in: 'body',
                required: true,
                schema: {
                    $ref: '#/definitions/Pet'
                },
                description: 'Updated pet object'
            }
        ],
        requestExample: {
            id: 1,
            name: 'Max',
            type: 'Dog',
            breed: 'Golden Retriever',
            age: 4,
            ownerId: 1
        },
        responses: {
            '200': {
                description: 'Pet updated successfully',
                schema: {
                    $ref: '#/definitions/Pet'
                },
                example: {
                    id: 1,
                    name: 'Max',
                    type: 'Dog',
                    breed: 'Golden Retriever',
                    age: 4,
                    owner: {
                        id: 1,
                        name: 'John Smith',
                        email: 'john@example.com'
                    }
                }
            },
            '404': {
                description: 'Pet not found',
                example: {
                    timestamp: '2025-03-01T12:00:00.000+00:00',
                    status: 404,
                    error: 'Not Found',
                    message: 'Pet with ID 999 not found',
                    path: '/api/pets/999'
                }
            }
        },
        controllerCode: `@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    @Autowired
    public PetController(PetService petService) {
        this.petService = petService;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable Long id, @Valid @RequestBody Pet pet) {
        if (!petService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        pet.setId(id);
        return ResponseEntity.ok(petService.updatePet(pet));
    }
}`
    },
    {
        id: 'deletePet',
        path: '/api/pets/{id}',
        method: 'DELETE',
        description: 'Delete a pet',
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                type: 'integer',
                description: 'ID of the pet to delete'
            }
        ],
        responses: {
            '204': {
                description: 'Pet deleted successfully'
            },
            '404': {
                description: 'Pet not found',
                example: {
                    timestamp: '2025-03-01T12:00:00.000+00:00',
                    status: 404,
                    error: 'Not Found',
                    message: 'Pet with ID 999 not found',
                    path: '/api/pets/999'
                }
            }
        },
        controllerCode: `@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    @Autowired
    public PetController(PetService petService) {
        this.petService = petService;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        if (!petService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        petService.deletePet(id);
        return ResponseEntity.noContent().build();
    }
}`
    },
    {
        id: 'getOwners',
        path: '/api/owners',
        method: 'GET',
        description: 'Get all pet owners',
        parameters: [],
        responses: {
            '200': {
                description: 'List of all pet owners',
                schema: {
                    type: 'array',
                    items: {
                        $ref: '#/definitions/Owner'
                    }
                },
                example: [
                    {
                        id: 1,
                        name: 'John Smith',
                        email: 'john@example.com',
                        phone: '555-123-4567',
                        address: '123 Main St'
                    },
                    {
                        id: 2,
                        name: 'Jane Doe',
                        email: 'jane@example.com',
                        phone: '555-987-6543',
                        address: '456 Oak Ave'
                    }
                ]
            }
        },
        controllerCode: `@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    private final OwnerService ownerService;

    @Autowired
    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @GetMapping
    public ResponseEntity<List<Owner>> getAllOwners() {
        return ResponseEntity.ok(ownerService.findAllOwners());
    }
}`
    },
    {
        id: 'getPetsByOwner',
        path: '/api/owners/{id}/pets',
        method: 'GET',
        description: 'Get all pets for a specific owner',
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                type: 'integer',
                description: 'ID of the owner'
            }
        ],
        responses: {
            '200': {
                description: 'List of pets for the specified owner',
                schema: {
                    type: 'array',
                    items: {
                        $ref: '#/definitions/Pet'
                    }
                },
                example: [
                    {
                        id: 1,
                        name: 'Max',
                        type: 'Dog',
                        breed: 'Golden Retriever',
                        age: 3
                    },
                    {
                        id: 4,
                        name: 'Rocky',
                        type: 'Dog',
                        breed: 'German Shepherd',
                        age: 2
                    }
                ]
            },
            '404': {
                description: 'Owner not found',
                example: {
                    timestamp: '2025-03-01T12:00:00.000+00:00',
                    status: 404,
                    error: 'Not Found',
                    message: 'Owner with ID 999 not found',
                    path: '/api/owners/999/pets'
                }
            }
        },
        controllerCode: `@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    private final OwnerService ownerService;
    private final PetService petService;

    @Autowired
    public OwnerController(OwnerService ownerService, PetService petService) {
        this.ownerService = ownerService;
        this.petService = petService;
    }

    @GetMapping("/{id}/pets")
    public ResponseEntity<List<Pet>> getPetsByOwner(@PathVariable Long id) {
        if (!ownerService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(petService.findPetsByOwnerId(id));
    }
}`
    },
    {
        id: 'getHealthRecords',
        path: '/api/pets/{id}/health-records',
        method: 'GET',
        description: 'Get health records for a specific pet',
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                type: 'integer',
                description: 'ID of the pet'
            }
        ],
        responses: {
            '200': {
                description: 'List of health records for the specified pet',
                schema: {
                    type: 'array',
                    items: {
                        $ref: '#/definitions/HealthRecord'
                    }
                },
                example: [
                    {
                        id: 1,
                        petId: 1,
                        checkupDate: '2024-01-15',
                        weight: 65.4,
                        temperature: 101.3,
                        heartRate: 72,
                        vetNotes: 'Annual checkup. Overall health excellent.'
                    },
                    {
                        id: 2,
                        petId: 1,
                        checkupDate: '2024-02-28',
                        weight: 66.1,
                        temperature: 101.5,
                        heartRate: 75,
                        vetNotes: 'Follow-up for ear infection. Responding well to treatment.'
                    }
                ]
            },
            '404': {
                description: 'Pet not found',
                example: {
                    timestamp: '2025-03-01T12:00:00.000+00:00',
                    status: 404,
                    error: 'Not Found',
                    message: 'Pet with ID 999 not found',
                    path: '/api/pets/999/health-records'
                }
            }
        },
        controllerCode: `@RestController
@RequestMapping("/api/pets")
public class HealthRecordController {

    private final PetService petService;
    private final HealthRecordService healthRecordService;

    @Autowired
    public HealthRecordController(PetService petService, HealthRecordService healthRecordService) {
        this.petService = petService;
        this.healthRecordService = healthRecordService;
    }

    @GetMapping("/{id}/health-records")
    public ResponseEntity<List<HealthRecord>> getHealthRecordsForPet(@PathVariable Long id) {
        if (!petService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(healthRecordService.findHealthRecordsByPetId(id));
    }
}`
    }
];

// Schemas for API models
const apiSchemas = {
    Pet: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Unique identifier for the pet'
            },
            name: {
                type: 'string',
                description: 'Name of the pet'
            },
            type: {
                type: 'string',
                description: 'Type of animal (e.g., Dog, Cat)'
            },
            breed: {
                type: 'string',
                description: 'Breed of the pet'
            },
            age: {
                type: 'integer',
                description: 'Age of the pet in years'
            },
            owner: {
                $ref: '#/definitions/Owner',
                description: 'Owner of the pet'
            }
        },
        required: ['name', 'type']
    },
    Owner: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Unique identifier for the owner'
            },
            name: {
                type: 'string',
                description: 'Name of the owner'
            },
            email: {
                type: 'string',
                description: 'Email address of the owner'
            },
            phone: {
                type: 'string',
                description: 'Phone number of the owner'
            },
            address: {
                type: 'string',
                description: 'Address of the owner'
            }
        },
        required: ['name', 'email']
    },
    HealthRecord: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Unique identifier for the health record'
            },
            petId: {
                type: 'integer',
                description: 'ID of the pet this record belongs to'
            },
            checkupDate: {
                type: 'string',
                format: 'date',
                description: 'Date of the checkup'
            },
            weight: {
                type: 'number',
                description: 'Weight of the pet in pounds'
            },
            temperature: {
                type: 'number',
                description: 'Body temperature of the pet in Fahrenheit'
            },
            heartRate: {
                type: 'integer',
                description: 'Heart rate of the pet in BPM'
            },
            vetNotes: {
                type: 'string',
                description: 'Notes from the veterinarian'
            }
        },
        required: ['petId', 'checkupDate']
    }
};

/**
 * Initialize API Demo Mode
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function initApiDemo(terminal, editorArea) {
    apiDemoActive = true;

    // Create welcome message in terminal
    const welcomeOutput = document.createElement('div');
    welcomeOutput.className = 'terminal-output';
    welcomeOutput.innerHTML = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Spring Boot API Demo</div>
        <div>This interactive demo showcases a Spring Boot REST API for PetPals application.</div>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">list</span>: Show all available endpoints</div>
        <div>- <span style="color: #cc7832">show {endpointId}</span>: Show details for a specific endpoint</div>
        <div>- <span style="color: #cc7832">test {endpointId}</span>: Test a specific endpoint</div>
        <div>- <span style="color: #cc7832">models</span>: Show API models/schemas</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit API demo mode</div>
        <div style="margin-top: 10px; color: #808080;">Type 'list' to begin exploring the API</div>
    `;

    // Update prompt style for API mode
    updateApiPrompt(terminal);

    // Insert welcome message before the prompt
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(welcomeOutput, lastPrompt);

    // Create API docs tab in editor area if it doesn't exist
    createApiDocsTab(editorArea);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Show details of a specific API endpoint
 * @param {string} endpointId - ID of the endpoint to show
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showEndpointDetails(endpointId, terminal, editorArea) {
    // Find endpoint by ID
    const endpoint = apiEndpoints.find(ep => ep.id.toLowerCase() === endpointId.toLowerCase());

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!endpoint) {
        // Endpoint not found
        output.innerHTML = `<span style="color: #cc0000;">Endpoint '${endpointId}' not found. Type 'list' to see available endpoints.</span>`;
    } else {
        // Get method color
        const methodColor = getMethodColor(endpoint.method);

        // Build endpoint details HTML
        let detailsHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Endpoint: ${endpoint.id}</div>
            <div><span style="color: ${methodColor}; font-weight: bold;">${endpoint.method}</span> <code>${endpoint.path}</code></div>
            <div style="margin: 5px 0 10px 0;">${endpoint.description}</div>
        `;

        // Parameters
        if (endpoint.parameters && endpoint.parameters.length > 0) {
            detailsHtml += `
                <div style="font-weight: bold; margin-top: 10px;">Parameters:</div>
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Name</th>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">In</th>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Type</th>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Required</th>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Description</th>
                    </tr>
            `;

            // Add each parameter to the table
            endpoint.parameters.forEach(param => {
                detailsHtml += `
                    <tr>
                        <td style="padding: 5px; border-bottom: 1px solid #444;"><code>${param.name}</code></td>
                        <td style="padding: 5px; border-bottom: 1px solid #444;">${param.in}</td>
                        <td style="padding: 5px; border-bottom: 1px solid #444;">${param.type || (param.schema ? 'object' : '')}</td>
                        <td style="padding: 5px; border-bottom: 1px solid #444;">${param.required ? 'Yes' : 'No'}</td>
                        <td style="padding: 5px; border-bottom: 1px solid #444;">${param.description}</td>
                    </tr>
                `;
            });

            detailsHtml += `</table>`;
        }

        // Request Example
        if (endpoint.requestExample) {
            detailsHtml += `
                <div style="font-weight: bold; margin-top: 10px;">Request Example:</div>
                <pre style="background-color: #2b2b2b; padding: 10px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(endpoint.requestExample, null, 2)}</pre>
            `;
        }

        // Responses
        if (endpoint.responses) {
            detailsHtml += `
                <div style="font-weight: bold; margin-top: 10px;">Responses:</div>
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Code</th>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Description</th>
                    </tr>
            `;

            // Add each response to the table
            Object.entries(endpoint.responses).forEach(([code, response]) => {
                detailsHtml += `
                    <tr>
                        <td style="padding: 5px; border-bottom: 1px solid #444;"><code>${code}</code></td>
                        <td style="padding: 5px; border-bottom: 1px solid #444;">${response.description}</td>
                    </tr>
                `;
            });

            detailsHtml += `</table>`;

            // Response Example
            const successResponse = endpoint.responses['200'] || endpoint.responses['201'] || endpoint.responses['204'];
            if (successResponse && successResponse.example) {
                detailsHtml += `
                    <div style="font-weight: bold; margin-top: 10px;">Success Response Example:</div>
                    <pre style="background-color: #2b2b2b; padding: 10px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(successResponse.example, null, 2)}</pre>
                `;
            }

            // Error Response Example
            const errorResponse = endpoint.responses['400'] || endpoint.responses['404'] || endpoint.responses['500'];
            if (errorResponse && errorResponse.example) {
                detailsHtml += `
                    <div style="font-weight: bold; margin-top: 10px;">Error Response Example:</div>
                    <pre style="background-color: #2b2b2b; padding: 10px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(errorResponse.example, null, 2)}</pre>
                `;
            }
        }

        // Controller Code
        if (endpoint.controllerCode) {
            detailsHtml += `
                <div style="font-weight: bold; margin-top: 10px;">Controller Implementation:</div>
                <pre style="background-color: #2b2b2b; padding: 10px; border-radius: 5px; overflow-x: auto;"><code>${endpoint.controllerCode}</code></pre>
            `;
        }

        // Add test command hint
        detailsHtml += `
            <div style="margin-top: 10px;">Type <code>test ${endpoint.id}</code> to simulate calling this endpoint</div>
        `;

        // Set output HTML
        output.innerHTML = detailsHtml;

        // Update API docs tab with endpoint details
        updateApiDocsContent(`
            <h1>${endpoint.method} ${endpoint.path}</h1>
            <p>${endpoint.description}</p>

            ${endpoint.parameters && endpoint.parameters.length > 0 ? `
                <h2>Parameters</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Name</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">In</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Type</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Required</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Description</th>
                    </tr>
                    ${endpoint.parameters.map(param => `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #444;"><code>${param.name}</code></td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${param.in}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${param.type || (param.schema ? 'object' : '')}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${param.required ? 'Yes' : 'No'}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${param.description}</td>
                        </tr>
                    `).join('')}
                </table>
            ` : ''}

            ${endpoint.requestExample ? `
                <h2>Request Example</h2>
                <pre style="background-color: #2b2b2b; padding: 16px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(endpoint.requestExample, null, 2)}</pre>
            ` : ''}

            <h2>Responses</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Code</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Description</th>
                </tr>
                ${Object.entries(endpoint.responses).map(([code, response]) => `
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #444;"><code>${code}</code></td>
                        <td style="padding: 8px; border-bottom: 1px solid #444;">${response.description}</td>
                    </tr>
                `).join('')}
            </table>

            ${endpoint.responses['200'] || endpoint.responses['201'] || endpoint.responses['204'] ? `
                <h2>Success Response Example</h2>
                <pre style="background-color: #2b2b2b; padding: 16px; border-radius: 5px; overflow-x: auto;">${JSON.stringify((endpoint.responses['200'] || endpoint.responses['201'] || endpoint.responses['204']).example, null, 2)}</pre>
            ` : ''}

            ${endpoint.controllerCode ? `
                <h2>Controller Implementation</h2>
                <pre style="background-color: #2b2b2b; padding: 16px; border-radius: 5px; overflow-x: auto;">${endpoint.controllerCode}</pre>
            ` : ''}

            <div style="margin-top: 20px; padding: 10px; background-color: #3c3f41; border-radius: 5px;">
                <strong>Try it:</strong> Type <code>test ${endpoint.id}</code> in the terminal to simulate calling this endpoint
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
 * Show API models/schemas
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showApiModels(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build models HTML
    let modelsHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">API Models</div>
    `;

    // Add each model
    Object.entries(apiSchemas).forEach(([modelName, schema]) => {
        modelsHtml += `
            <div style="font-weight: bold; margin-top: 10px;">${modelName}</div>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Property</th>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Type</th>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Required</th>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Description</th>
                </tr>
        `;

        // Add each property to the table
        Object.entries(schema.properties).forEach(([propName, propSchema]) => {
            const isRequired = schema.required && schema.required.includes(propName);
            const propType = propSchema.$ref
                ? propSchema.$ref.replace('#/definitions/', '')
                : propSchema.type;

            modelsHtml += `
                <tr>
                    <td style="padding: 5px; border-bottom: 1px solid #444;"><code>${propName}</code></td>
                    <td style="padding: 5px; border-bottom: 1px solid #444;">${propType}</td>
                    <td style="padding: 5px; border-bottom: 1px solid #444;">${isRequired ? 'Yes' : 'No'}</td>
                    <td style="padding: 5px; border-bottom: 1px solid #444;">${propSchema.description || ''}</td>
                </tr>
            `;
        });

        modelsHtml += `</table>`;
    });

    // Set output HTML
    output.innerHTML = modelsHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update API docs tab with models
    updateApiDocsContent(`
        <h1>PetPals API Models</h1>
        <p>Below are the data models used in the PetPals API.</p>

        ${Object.entries(apiSchemas).map(([modelName, schema]) => `
            <h2 id="model-${modelName.toLowerCase()}">${modelName}</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Property</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Type</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Required</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Description</th>
                </tr>
                ${Object.entries(schema.properties).map(([propName, propSchema]) => {
                    const isRequired = schema.required && schema.required.includes(propName);
                    const propType = propSchema.$ref
                        ? propSchema.$ref.replace('#/definitions/', '')
                        : propSchema.type;

                    return `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #444;"><code>${propName}</code></td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${propType}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${isRequired ? 'Yes' : 'No'}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #444;">${propSchema.description || ''}</td>
                        </tr>
                    `;
                }).join('')}
            </table>
        `).join('')}
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Test an API endpoint
 * @param {string} endpointId - ID of the endpoint to test
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function testEndpoint(endpointId, terminal, editorArea) {
    // Find endpoint by ID
    const endpoint = apiEndpoints.find(ep => ep.id.toLowerCase() === endpointId.toLowerCase());

    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    if (!endpoint) {
        // Endpoint not found
        output.innerHTML = `<span style="color: #cc0000;">Endpoint '${endpointId}' not found. Type 'list' to see available endpoints.</span>`;
    } else {
        // Get method color
        const methodColor = getMethodColor(endpoint.method);

        // Build test HTML
        let testHtml = `
            <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Testing Endpoint: ${endpoint.id}</div>
            <div><span style="color: ${methodColor}; font-weight: bold;">${endpoint.method}</span> <code>${endpoint.path}</code></div>
            <div style="margin: 5px 0 10px 0;">${endpoint.description}</div>
        `;

        // Request details
        testHtml += `
            <div style="font-weight: bold; margin-top: 10px;">Request:</div>
            <pre style="background-color: #2b2b2b; padding: 10px; border-radius: 5px; overflow-x: auto; margin: 10px 0;">curl -X ${endpoint.method} \\
  http://api.petpals.com${replacePlaceholders(endpoint.path)} \\
  -H 'Content-Type: application/json' ${endpoint.method !== 'GET' && endpoint.method !== 'DELETE' && endpoint.requestExample ? `\\
  -d '${JSON.stringify(endpoint.requestExample)}'` : ''}</pre>
        `;

        // Add animation
        testHtml += `
            <div style="margin: 10px 0;">
                <span style="display: inline-block; animation: blink 1s infinite;"><i class="fas fa-circle-notch fa-spin"></i></span>
                <span>Sending request...</span>
            </div>
        `;

        // Set initial output HTML
        output.innerHTML = testHtml;

        // Add output to terminal
        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        terminal.insertBefore(output, lastPrompt);

        // Simulate API request delay
        setTimeout(() => {
            // Response after delay

            // Success or error response based on endpoint
            const successResponse = endpoint.responses['200'] || endpoint.responses['201'] || endpoint.responses['204'];

            // Build response HTML
            const responseHtml = `
                <div style="font-weight: bold; margin-top: 10px;">Response:</div>
                <div style="margin: 5px 0;">Status: <span style="color: #6a8759;">200 OK</span></div>
                <div style="margin: 5px 0;">Time: <span>125 ms</span></div>
                <pre style="background-color: #2b2b2b; padding: 10px; border-radius: 5px; overflow-x: auto; margin: 10px 0;">${JSON.stringify(successResponse?.example || { message: 'Success' }, null, 2)}</pre>
            `;

            // Replace loading animation with response
            const loadingDiv = output.querySelector('div:has(.fa-spin)');
            if (loadingDiv) {
                loadingDiv.insertAdjacentHTML('afterend', responseHtml);
                loadingDiv.remove();
            } else {
                // Fallback if loading div is not found
                output.insertAdjacentHTML('beforeend', responseHtml);
            }

            // Scroll terminal to bottom
            terminal.scrollTop = terminal.scrollHeight;
        }, 1500); // 1.5 second delay
    }

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Replace path placeholders with sample values
 * @param {string} path - Path with placeholders
 * @returns {string} - Path with placeholders replaced
 */
function replacePlaceholders(path) {
    return path.replace(/{(\w+)}/g, (match, placeholder) => {
        // Replace with sample values
        switch (placeholder.toLowerCase()) {
            case 'id':
                return '1';
            case 'petid':
                return '1';
            case 'ownerid':
                return '1';
            default:
                return '123';
        }
    });
}

/**
 * Update API docs tab content
 * @param {string} html - HTML content to update
 */
function updateApiDocsContent(html) {
    const apiDocsDetails = document.getElementById('apiDocsDetails');
    if (apiDocsDetails) {
        apiDocsDetails.innerHTML = html;
    }
}

/**
 * Get color for HTTP method
 * @param {string} method - HTTP method
 * @returns {string} - Color code
 */
function getMethodColor(method) {
    switch (method.toUpperCase()) {
        case 'GET':
            return '#6a8759'; // Green
        case 'POST':
            return '#cc7832'; // Orange
        case 'PUT':
            return '#9876aa'; // Purple
        case 'DELETE':
            return '#cc0000'; // Red
        case 'PATCH':
            return '#ffc66d'; // Yellow
        default:
            return '#a9b7c6'; // Light gray
    }
}

/**
 * Update the terminal prompt to API demo style
 * @param {Object} terminal - The terminal DOM element
 */
function updateApiPrompt(terminal) {
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    if (lastPrompt) {
        // Change prompt style for API mode
        const userSpan = lastPrompt.querySelector('.terminal-user');
        if (userSpan) userSpan.textContent = 'api';

        const machineSpan = lastPrompt.querySelector('.terminal-machine');
        if (machineSpan) machineSpan.textContent = 'spring-boot';

        const directorySpan = lastPrompt.querySelector('.terminal-directory');
        if (directorySpan) directorySpan.textContent = 'petpals';

        const symbolSpan = lastPrompt.querySelector('.terminal-symbol');
        if (symbolSpan) symbolSpan.textContent = '>';
    }
}

/**
 * Create API documentation tab in editor area
 * @param {Object} editorArea - The editor area DOM element
 */
function createApiDocsTab(editorArea) {
    // Check if tab already exists
    if (document.getElementById('apiDocsTab')) {
        // Just activate it
        activateApiDocsTab();
        return;
    }

    // Create new tab
    const tabsContainer = editorArea.querySelector('.editor-tabs');
    const apiDocsTab = document.createElement('div');
    apiDocsTab.className = 'editor-tab';
    apiDocsTab.id = 'apiDocsTab';
    apiDocsTab.innerHTML = `
        <i class="fas fa-file-code"></i>
        <span class="tab-title">api-docs.json</span>
        <i class="fas fa-times close-tab"></i>
    `;

    // Create content
    const contentContainer = editorArea.querySelector('.editor-content');
    const apiDocsContent = document.createElement('div');
    apiDocsContent.className = 'code-content markdown-content api-docs-code';
    apiDocsContent.id = 'apiDocsContent';
    apiDocsContent.innerHTML = `
        <div class="markdown-container">
            <h1>PetPals API Documentation</h1>
            <p>This is the interactive API documentation for the PetPals application. Use the terminal commands to explore endpoints and test API functionality.</p>

            <div id="apiDocsDetails">
                <h2>Getting Started</h2>
                <p>Type <code>list</code> in the terminal to see all available endpoints.</p>
                <p>To view details of a specific endpoint, type <code>show {endpointId}</code>.</p>
                <p>To test an endpoint, type <code>test {endpointId}</code>.</p>
            </div>
        </div>
    `;

    // Add tab and content to DOM
    tabsContainer.appendChild(apiDocsTab);
    contentContainer.appendChild(apiDocsContent);

    // Add event listener to tab
    apiDocsTab.addEventListener('click', activateApiDocsTab);

    // Add event listener to close button
    const closeBtn = apiDocsTab.querySelector('.close-tab');
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        apiDocsTab.style.display = 'none';
        if (apiDocsTab.classList.contains('active')) {
            // Show about tab if API docs tab is closed
            const aboutTab = document.getElementById('aboutTab');
            if (aboutTab) {
                aboutTab.click();
            }
        }
    });

    // Activate the tab
    activateApiDocsTab();
}

/**
 * Activate the API documentation tab
 */
function activateApiDocsTab() {
    // Deactivate all tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all content
    document.querySelectorAll('.code-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activate API docs tab and content
    const apiDocsTab = document.getElementById('apiDocsTab');
    const apiDocsContent = document.getElementById('apiDocsContent');

    if (apiDocsTab && apiDocsContent) {
        apiDocsTab.classList.add('active');
        apiDocsTab.style.display = 'flex';
        apiDocsContent.classList.add('active');
    }
}

/**
 * Process API demo commands
 * @param {string} command - Command to process
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 * @returns {boolean} - Whether to continue in API demo mode
 */
function processApiCommand(command, terminal, editorArea) {
    const cmd = command.trim().toLowerCase();

    // Check for exit command
    if (cmd === 'exit') {
        const exitMsg = document.createElement('div');
        exitMsg.className = 'terminal-output';
        exitMsg.textContent = 'Exiting API demo mode...';

        const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
        terminal.insertBefore(exitMsg, lastPrompt);

        // Reset terminal style
        apiDemoActive = false;
        return false;
    }

    // Handle list command
    if (cmd === 'list') {
        showEndpointList(terminal, editorArea);
        return true;
    }

    // Handle models command
    if (cmd === 'models') {
        showApiModels(terminal, editorArea);
        return true;
    }

    // Handle show command
    if (cmd.startsWith('show ')) {
        const endpointId = cmd.substring(5).trim();
        showEndpointDetails(endpointId, terminal, editorArea);
        return true;
    }

    // Handle test command
    if (cmd.startsWith('test ')) {
        const endpointId = cmd.substring(5).trim();
        testEndpoint(endpointId, terminal, editorArea);
        return true;
    }

    // Handle unknown command
    const unknownMsg = document.createElement('div');
    unknownMsg.className = 'terminal-output';
    unknownMsg.innerHTML = `
        <span style="color: #cc0000;">Unknown command: ${command}</span>
        <div>Available commands:</div>
        <div>- <span style="color: #cc7832">list</span>: Show all available endpoints</div>
        <div>- <span style="color: #cc7832">show {endpointId}</span>: Show details for a specific endpoint</div>
        <div>- <span style="color: #cc7832">test {endpointId}</span>: Test a specific endpoint</div>
        <div>- <span style="color: #cc7832">models</span>: Show API models/schemas</div>
        <div>- <span style="color: #cc7832">exit</span>: Exit API demo mode</div>
    `;

    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(unknownMsg, lastPrompt);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;

    return true;
}

/**
 * Show the list of available API endpoints
 * @param {Object} terminal - Terminal DOM element
 * @param {Object} editorArea - Editor area DOM element
 */
function showEndpointList(terminal, editorArea) {
    // Create output element
    const output = document.createElement('div');
    output.className = 'terminal-output';

    // Build endpoint list HTML
    let endpointsHtml = `
        <div style="color: #6a8759; font-weight: bold; margin-bottom: 10px;">Available API Endpoints</div>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">ID</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Method</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Path</th>
                <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Description</th>
            </tr>
    `;

    // Add each endpoint to the table
    apiEndpoints.forEach(endpoint => {
        const methodColor = getMethodColor(endpoint.method);
        endpointsHtml += `
            <tr>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${endpoint.id}</td>
                <td style="padding: 5px; border-bottom: 1px solid #444;"><span style="color: ${methodColor}; font-weight: bold;">${endpoint.method}</span></td>
                <td style="padding: 5px; border-bottom: 1px solid #444;"><code>${endpoint.path}</code></td>
                <td style="padding: 5px; border-bottom: 1px solid #444;">${endpoint.description}</td>
            </tr>
        `;
    });

    endpointsHtml += `</table>
        <div style="margin-top: 10px;">Type <code>show {endpointId}</code> to view details for a specific endpoint</div>
    `;

    // Set output HTML
    output.innerHTML = endpointsHtml;

    // Add output to terminal
    const lastPrompt = terminal.querySelector('.terminal-prompt:last-child');
    terminal.insertBefore(output, lastPrompt);

    // Update API docs tab content
    updateApiDocsContent(`
        <h1>PetPals API Endpoints</h1>
        <p>Below is a list of all available endpoints in the PetPals API.</p>

        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Method</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Path</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #555;">Description</th>
            </tr>
            ${apiEndpoints.map(endpoint => {
                const methodColor = getMethodColor(endpoint.method);
                return `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><span style="color: ${methodColor}; font-weight: bold;">${endpoint.method}</span></td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;"><code>${endpoint.path}</code></td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">${endpoint.description}</td>
                </tr>
                `;
            }).join('')}
        </table>

        <h2 style="margin-top: 24px;">Using the API</h2>
        <p>Use the terminal to interact with the API:</p>
        <ul>
            <li>Type <code>show {endpointId}</code> to view details for a specific endpoint</li>
            <li>Type <code>test {endpointId}</code> to simulate calling an endpoint</li>
            <li>Type <code>models</code> to see the data models used by the API</li>
        </ul>
    `);

    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
}