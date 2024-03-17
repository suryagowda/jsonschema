// Function to initialize Ace editor with custom placeholder behavior
function initAceEditor(id, placeholderText) {
    var editor = ace.edit(id);
    editor.setTheme('ace/theme/dracula');
    editor.session.setMode("ace/mode/json");

    // Add custom placeholder behavior
    editor.on("input", function() {
        var isEmpty = editor.getSession().getValue().trim() === "";
        var placeholderEl = document.querySelector(`#${id} .ace_placeholder`);

        if (isEmpty) {
            if (!placeholderEl) {
                placeholderEl = document.createElement("div");
                placeholderEl.textContent = placeholderText;
                placeholderEl.classList.add("ace_placeholder");
                editor.renderer.scroller.appendChild(placeholderEl);
            }
        } else {
            if (placeholderEl) {
                placeholderEl.remove();
            }
        }
    });

    // Initially show placeholder if editor is empty
    if (editor.getSession().getValue().trim() === "") {
        var placeholderEl = document.createElement("div");
        placeholderEl.textContent = placeholderText;
        placeholderEl.classList.add("ace_placeholder");
        editor.renderer.scroller.appendChild(placeholderEl);
    }

    return editor;
}

// Initialize Ace Editors
var schemaEditor = initAceEditor("schemaEditor", "JSON Schema goes here...");
var instanceEditor = initAceEditor("instanceEditor", "JSON data to validate against Schema goes here...");
var schemaEditor2 = initAceEditor("schemaEditor2", "JSON Schema goes here...");
var instanceEditor2 = initAceEditor("instanceEditor2", "JSON data to validate against Schema goes here...");



document.getElementById('startbtn').addEventListener('click', function () {
    document.querySelector('.step1').classList.remove('hidden');
    document.querySelector('.container').classList.add('hidden');
    
});

document.getElementById('validateSchemaBtn').addEventListener('click', function () {
    const schemaInput = getCodeFromEditor('schemaEditor');
    const isValid = validateSchema(schemaInput);
    const resultElement = document.getElementById('step1Result');

    if (isValid) {
        // Display custom alert box with next step button
        displayError("");
        displayCustomAlert("JSON Schema is valid for Draft 2020-12", "step2", true);
    } else {
        // Display custom alert box without next step button
        displayCustomAlert("JSON Schema is not valid for Draft 2020-12", null, false);
    }
});

// Event listener for validating array schema in Step 2
document.getElementById('validateArraySchemaBtn').addEventListener('click', function () {
    const arraySchemaInput = getCodeFromEditor('schemaEditor2');
    const isValidArraySchema = validateArraySchema(arraySchemaInput);
    const resultElement = document.getElementById('step2Result');

    if (isValidArraySchema) {
        //resultElement.textContent = "JSON Schema with array of numbers is valid";
        displayError2("");
        displayCustomAlertStep2("JSON Schema with array of numbers is valid", true);
        //document.querySelector('.step2 .result').classList.remove('hidden');
    } else {
        //resultElement.textContent = "JSON Schema does not define an array with items of type number";
        // Display custom alert box for Step 2 with error message
        displayCustomAlertStep2("JSON Schema does not define an array with items of type number", false);
    }
});


// Function to display custom alert box
function displayCustomAlert(message, nextStepId, isValid) {
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;

    const customAlertContent = document.getElementById('customAlertContent');
    // Set background color of the modal content area based on validation result
    customAlertContent.style.background = isValid ? 'rgb(10,233,15)' : 'linear-gradient(90deg, #eb0707, #f60028, #fe0040, #ff0058, #ff006f, #ff0086, #ff009d, #ff23b4)';

    const customAlert = document.getElementById('customAlert');
    customAlert.style.display = 'block';

    const nextStepBtn = document.getElementById('nextStepBtn');
    if (nextStepId) {
        // If next step ID is provided, show next step button and attach next step functionality
        nextStepBtn.style.display = 'block';
        nextStepBtn.onclick = function () {
            nextStep(nextStepId);
        };
    } else {
        // If next step ID is not provided, hide next step button
        nextStepBtn.style.display = 'none';
    }

    // Get the <span> element that closes the modal
    const closeBtn = document.querySelector("#customAlert .close");

    // When the user clicks on <span> (x), close the modal
    closeBtn.onclick = function () {
        customAlert.style.display = "none";
    }
}


// Function to handle next step button click
function nextStep(nextStepId) {
    document.getElementById('customAlert').style.display = 'none'; // Hide the custom alert box
    document.querySelector('.step1').classList.add('hidden');
    document.querySelector('.step2').classList.remove('hidden');
    
}


// Function to display custom alert box for Step 2
function displayCustomAlertStep2(message, isValidArraySchema) {
    const modalMessageStep2 = document.getElementById('modalMessageStep2');
    modalMessageStep2.textContent = message;

    const customAlertContent = document.getElementById('customAlertContentStep2');
    // Set background color of the modal content area based on validation result
    customAlertContent.style.background = isValidArraySchema ? 'linear-gradient(90deg, #105c04, #157109, #1a8710, #1e9e17, #20b51e, #22cd27, #23e62f, #21ff38)' : 'linear-gradient(90deg, #eb0707, #f60028, #fe0040, #ff0058, #ff006f, #ff0086, #ff009d, #ff23b4)';

    const customAlertStep2 = document.getElementById('customAlertStep2');
    customAlertStep2.style.display = 'block';

    // Get the <span> element that closes the modal
    const closeBtn = document.querySelector("#customAlertStep2 .close");

    // When the user clicks on <span> (x), close the modal
    closeBtn.onclick = function () {
        customAlertStep2.style.display = "none";
    }
}





function getCodeFromEditor(elementId) {
    var editor = ace.edit(elementId);
    return editor.getValue();
}



//const Ajv = window.ajv2020
//const ajv = new Ajv()


// Function to validate the JSON schema
function validateSchema(schema) {
    try {
        const parsedSchema = JSON.parse(schema);
        // Validate the schema against the meta schema
        const isValid = ajv.validateSchema(parsedSchema);
        console.log(isValid);
        
        return isValid;
    } catch (error) {

        displayError(">> " + error.message)
        return false;
    }
}


// Function to display errors in the error area
function displayError(message) {
    const errorArea = document.getElementById('errorArea');
    errorArea.textContent = message;
}

// Function to display errors in the error area
function displayError2(message) {
    const errorArea = document.getElementById('errorArea2');
    errorArea.textContent = message;
}




const Ajv = window.ajv2020;
const ajv = new Ajv();

// Function to validate the JSON schema
function validateSchema(schema) {
    try {
        const parsedSchema = JSON.parse(schema);
        // Validate the schema against the meta schema
        const isValid = ajv.validateSchema(parsedSchema);
        return isValid;
    } catch (error) {
        displayError(">> " + error.message);
        return false;
    }
}

// Function to validate the JSON instance against the schema
function validateInstance(schemaText, instanceText) {
    try {
        var schema = JSON.parse(schemaText);
        var instance = JSON.parse(instanceText);

        var validate = ajv.compile(schema);
        var valid = validate(instance);

        if (valid) {
            displayResult2("Json data Validation passed!", "green");
        } else {
            displayResult2("Json Data Validation failed!", "red");
        }
    } catch (error) {
        displayResult2("Error: " + error.message, "red");
    }
}

// Function to validate schema and instance
function validate() {
    var schemaText = schemaEditor.getValue();
    var instanceText = instanceEditor.getValue();

    var schemaIsValid = validateSchema(schemaText);
    displayError("")
    if (!schemaIsValid) {
        
        displayError("Invalid JSON Schema");
        return;
    }

    if (instanceText.trim() !== "") {
        validateInstance(schemaText, instanceText);
    } else {
        displayResult("JSON Schema is valid.", "green");
    }
}

// Helper function to display validation result
function displayResult(message, color) {
    var resultDiv = document.getElementById(".step1 result");
    var errorDiv = document.getElementById("error");

    // Clear error message if present
    if (errorDiv) {
        errorDiv.innerText = "";
    }

    if (resultDiv) {
        resultDiv.innerText = message;
        resultDiv.style.color = color;
    } else {
        console.error("Result container not found in the HTML.");
    }
}



// Helper function to display validation result
function displayResult2(message, color) {
    var resultDiv = document.getElementById("result2");
    var errorDiv = document.getElementById("error2");

    // Clear error message if present
    if (errorDiv) {
        errorDiv.innerText = "";
    }

    if (resultDiv) {
        resultDiv.innerText = message;
        resultDiv.style.color = color;
    } else {
        console.error("Result container not found in the HTML.");
    }
}

// Helper function to display error message
function displayError(message) {
    var errorDiv = document.getElementById("error");
    var resultDiv = document.getElementById("result");

    // Clear previous result message if present
    if (resultDiv) {
        resultDiv.innerText = "";
    }

    if (errorDiv) {
        errorDiv.innerText = message;
    } else {
        console.error("Error container not found in the HTML.");
    }
}


// Helper function to display error message
function displayError2(message) {
    var errorDiv = document.getElementById("error2");
    var resultDiv = document.getElementById("result2");

    // Clear previous result message if present
    if (resultDiv) {
        resultDiv.innerText = "";
    }

    if (errorDiv) {
        errorDiv.innerText = message;
    } else {
        console.error("Error container not found in the HTML.");
    }
}




function validateArraySchema(schema) {
    try {
        const parsedSchema = JSON.parse(schema);

        // Validate the schema against the meta schema
        const isValidSchema = ajv.validateSchema(parsedSchema);
        if (!isValidSchema) {
            // Return false if the overall schema is not valid
            return false;
        }

        // Check if the schema defines an array with items of type number
        if (parsedSchema.type === 'array' && parsedSchema.items && parsedSchema.items.type === 'number') {
            return true;
        }
        return false;
    } catch (error) {
        // Handle JSON parsing errors
        displayError2(">> " + error.message)
        return false;
    }
}





