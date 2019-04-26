// Set shifts object with all needed data, make final output (selectedShifts) global
const shifts = {
    days: ['Δευ','Τρι','Τετ','Πεμ','Παρ','Σαβ','Κυρ'],
    daysFull: ['Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο','Κυριακή'],
    time: ['πρωί', 'βράδυ']
};
let selectedShifts;

// Start building DOM, main components to place app content
const appContent = document.querySelector('.app-content');
const daysDiv = document.createElement('div');
daysDiv.className = 'row days';
appContent.appendChild(daysDiv);
const morningDiv = document.createElement('div'); 
morningDiv.className = 'row morning';
appContent.appendChild(morningDiv);
const nightDiv = document.createElement('div'); 
nightDiv.className = 'row night';
appContent.appendChild(nightDiv);

// Loop through days and create/place our elements, use index as part of the id to help with sorting and "translating" later
shifts.days.forEach(function(day, i) {

    // Days span
    const span = document.createElement('span');
    span.id = `day-${i}`;
    let dayText = document.createTextNode(day);
    span.appendChild(dayText);
    daysDiv.appendChild(span);

    // Sun/morning icon checkbox for each day
    const inputMorning = document.createElement('input');
    inputMorning.setAttribute('type', 'checkbox');
    inputMorning.id = `morning-${i}`;
    inputMorning.name = `morning-${i}`;
    const labelMorning = document.createElement('label');
    labelMorning.htmlFor = inputMorning.id;
    morningDiv.appendChild(inputMorning);
    morningDiv.appendChild(labelMorning);

    // Moon/night icon checkbox for each day
    const inputNight = document.createElement('input');
    inputNight.setAttribute('type', 'checkbox');
    inputNight.id = `night-${i}`;
    inputNight.name = `night-${i}`;
    const labelNight = document.createElement('label');
    labelNight.htmlFor = inputNight.id;
    nightDiv.appendChild(inputNight);
    nightDiv.appendChild(labelNight);
})

// Create and place submit button
const button = document.createElement('input');
button.setAttribute('type', 'submit');
button.id = 'submit';
button.name = 'submit';
button.className = 'button submit';
button.setAttribute('value', 'ΑΠΟΣΤΟΛΗ');
const app = document.querySelector('.app');
appContent.appendChild(button);

// Event listeners to get selected checkboxes and submit data on click
button.addEventListener('click', getAndSubmit);

function getSelected() {
    // Declare array to store selected shifts
    let userSelection = [];

    // Get all checked checkboxes
    const checked = document.querySelectorAll('input[type=checkbox]:checked');

     // Convert nodelist to array
    checkedArray = Array.from(checked);

    if (!checkedArray || !checkedArray.length) { // If array or array.length are falsy
            showError('Παρακαλώ επίλεξε τις βάρδιες που προτιμάς!') // Show error message

    } else { // Otherwise execute rest of the code

        // Sort array by day, by comparing id's last char (which is the loop index used above)
        const checkedSorted = checkedArray.sort((a,b) => {
            return a.id[a.id.length-1] - b.id[b.id.length-1];
        });
    
        // Loop through sorted array and push Greek, complete words to our final array
        checkedSorted.forEach(function(check) {
            translatedShift = check.id; // Get id
            shifts.daysFull.forEach(function(day, i) {
                translatedShift = translatedShift.replace(i, day); // Replace last char (index) with corresponding day
            })
            translatedShift = translatedShift.replace('morning', shifts.time[0]); // "Translate" morning and night
            translatedShift = translatedShift.replace('night', shifts.time[1]); 
            userSelection.push(translatedShift); // Push to array
        })

        // Reverse words (day first), remove dash, for even easier reading
        selectedShifts = userSelection
                    .map(function (item) {
                        return item.split('-').reverse().join(' ');
                    });

        return selectedShifts;
    }
}

// Show error
function showError(error) {
    if (document.querySelectorAll('.alert').length < 1) { // prevent alert from showing multiple times

        // Create a div and add class
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert';

        // Get elements
        const header = document.querySelector('.app-header');
        const headerP = document.querySelector('.app-header p');

        // Create text node and append to div
        errorDiv.appendChild(document.createTextNode(error));

        // Insert error above content
        header.insertBefore(errorDiv, headerP);

        // Clear error after 2 seconds
        setTimeout(clearError, 2000);
    }
}

// Clear error
function clearError () {
    document.querySelector('.alert').remove();
}
    
/* Submit data as json string  */
async function submitData() {
    const url = 'http://requestbin.fullcontact.com/17p4mbs1';
    const data = selectedShifts;

    if (data && data.length) { // Check and execute only if data contains something

        const response = await fetch(url, {
            method: 'POST',
            header: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        return resData;
    }
}

// Get and submit data in a single function
function getAndSubmit() {
    getSelected();
    submitData();
}
