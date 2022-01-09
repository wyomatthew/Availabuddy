// create a row for each 
const table = document.getElementById('calendarTable');
const oneHourNode = document.createElement('tr');
const numToWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// initialize function to convert integer values to RFC dates
function convertDateToRFC(year = 1970, month = 1, day = 1, hour = 0, minute = 0, second = 0) {
    return year.toString() + '-' +
        month.toString().padStart(2, '0') + '-' +
        day.toString().padStart(2, '0') + 'T' +
        hour.toString().padStart(2, '0') + ':' +
        minute.toString().padStart(2, '0') + ':' +
        second.toString().padStart(2, '0');
}

/**
 * 
 * @param {String} rfcStr 
 */
function convertRFCToDate(rfcStr) {
    const ret = new Date();
    ret.setFullYear(
        parseInt(rfcStr.substring(0, 4)),
        parseInt(rfcStr.substring(5, 7)) - 1,
        parseInt(rfcStr.substring(8, 10))
    );
    ret.setHours(
        parseInt(rfcStr.substring(11, 13)),
        parseInt(rfcStr.substring(14, 16)),
        parseInt(rfcStr.substring(17, 19))
    );
    return ret;
}

// initialize strating date information on Sunday
let start = new Date();

// get current day of the week
const dayOfWeek = start.getDay();

// subtract commensurate number of miliseconds from start
const MS_IN_DAY = 86400000;
const MS_IN_HOUR = MS_IN_DAY / 24;
start = new Date(start.valueOf() - MS_IN_DAY * (dayOfWeek));

// get year month and day of sunday
let year = start.getFullYear();
let month = start.getMonth() + 1;
let day = start.getDate();

start.setFullYear(year, month - 1, day);
start.setHours(0, 0, 0, 0);

// initialize variable to store user state
let mouseDown = false;

// initialize grand set and current set of cells that have been highlighted
let selected = new Set();
let currSelected = new Set();

// array of datetimes for currSelected cells
var times = []; 

// initialize cell of original click
let firstClicked;

// text stored in the text area
var freeText = 'Available Times: \n'; 

/**
 * 
 * @param {HTMLElement} el1 
 * @param {HTMLElement} el2 
 * @returns -1 if el1 is before el2, 0 if they're the same, 1 if el1 is after el2
 */
function compareElements(el1, el2) {
    // get ms of both
    const ms1 = parseInt(el1.dataset.datetime);
    const ms2 = parseInt(el2.dataset.datetime);
    if (ms1 < ms2) {
        return -1;
    } else if (ms1 === ms2) {
        return 0;
    } else {
        return 1;
    }
}

/**
 * Activates element as selected by coloring it, deleting its border, and adding
 * it to the current selected set
 * 
 * @param {HTMLElement} el 
 */
function activateElement(el) {
    el.style.backgroundColor = 'green';
    el.style.borderTopWidth = '0px';
    el.style.borderBottomWidth = '0px';
    currSelected.add(el);
}

/**
 * Deactivates element by making it white, re-adding border, and removing it
 * from the current selected set
 * 
 * @param {HTMLElement} el 
 */
function deactivateElement(el) {
    el.style.backgroundColor = 'white';
    el.style.borderTopWidth = '1px';
    el.style.borderBottomWidth = '1px';
    currSelected.delete(el);
}

/**
 * Handles the action of user clicking mouse down on a tile. The clicked
 * tile is highlighted, added to selected, and the user is put into mouseDown 
 * state
 * 
 * @param {Event} ev 
 */
function onMouseDown(ev) {
    // if mouse is not already down, record click
    if (!mouseDown) {
        // active cell if it is not already activated
        currSelected.clear();
        activateElement(ev.target);

        // configure clicked cell as first clicked
        firstClicked = ev.target;

        // change state
        mouseDown = true;
    }
}

/**
 * Handles user hovering over a tile with the mouse. If the user is in mouseDown
 * mode, then the tile should be highlighted and added to selected
 * 
 * @param {Event} ev 
 */
function onMouseHover(ev) {
    // activate tile if we are in mouse down mode
    if (mouseDown) {
        // wipe curr selected and color all white
        currSelected.clear();
        for (let currCell of cellList) {
            if (!selected.has(currCell)) {
                deactivateElement(currCell);
            }
        }

        // identify target and case on if it comes before first
        const target = ev.target;

        // get indices of target and first clicked elemnts
        const firstIndex = cellList.indexOf(firstClicked);
        const targetIndex = cellList.indexOf(target);

        // case on which comes first for iterative indices
        let lo;
        let hi;
        if (firstIndex < targetIndex) {
            lo = firstIndex;
            hi = targetIndex;
        } else if (firstIndex > targetIndex) {
            lo = targetIndex;
            hi = firstIndex;
        } else {
            // only element should be first
            lo = firstIndex;
            hi = firstIndex;
        }

        // activate all elements in range
        currSelected.clear();
        for (let i = lo; i <= hi; i++) {
            // activate current element
            activateElement(cellList[i]);
        }
    }
}

/**
 * Handles user lifting mouse over tile. Modifies state to mouse up
 * 
 * @param {Event} ev 
 */
function onMouseUp(ev) {
    // add current set to total selected
    currSelected.forEach(currCell => {
        selected.add(currCell);
        times.push(parseInt(currCell.getAttribute('data-datetime')));
    });

    addToTextArea(); 

    mouseDown = false;
}

/**
 * Adds available times to the text area. 
 */
function addToTextArea() {
    var textArea = document.getElementById('out');
    if (times.length > 0) {
        times.sort((a, b) => a - b);
        var endTime = times.length - 1;
        freeText = freeText + formatDate(new Date(times[0]), true) + ' to ' + formatDate(new Date(times[endTime]), false) + '\n';
        times = []; 
    }

    textArea.value = freeText; 
}

/**
 * 
 * Formats the date to make it more readable. 
 * 
 * @param {Date} date 
 * @param {boolean} isStart 
 * @returns String
 */
function formatDate(date, isStart) {
    if (!isStart) {
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    } else {
        return date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }
}

/**
 * Handles user moving mouse out of calendar area. Modified state to mouse up
 * 
 * @param {Event} ev 
 */
function onMouseTableExit(ev) {
    // add current set to total selected
    currSelected.forEach(currCell => {
        selected.add(currCell);
    });

    mouseDown = false;
}

// get table of number elements
const numElements = Array(7);
for (let i = 0; i < numElements.length; i++) {
    numElements[i] = document.getElementById(numToWeek[i] + 'Num');
}

// initialize numbers for numElements
let dayNum = 0;
numElements.forEach(el => {
    // compute current offset from start date
    el.innerHTML = (new Date(start.valueOf() + (dayNum * MS_IN_DAY))).getDate();
    dayNum++;
})

// build date table
let cellList = new Array();
for (let i = 0; i < 24; i++) {
    const currRow = oneHourNode.cloneNode(false);
    currRow.setAttribute('id', `${i}`);
    table.appendChild(currRow);

    // append 7 cells to the row
    const cellNode = document.createElement('td');
    for (let j = 0; j < 7; j++) {
        // create current node and add to current row
        const currCell = cellNode.cloneNode(false);
        currCell.setAttribute('headers', numToWeek[j]);

        // get datetime of current cell
        const currDate = new Date(start.valueOf() + (j * MS_IN_DAY) + (i * MS_IN_HOUR));
        currCell.setAttribute('data-datetime', currDate.valueOf());
        currRow.appendChild(currCell);

        // add to cell list
        cellList.push(currCell);

        // add mouse events
        currCell.addEventListener('mousedown', onMouseDown);
        currCell.addEventListener('mouseenter', onMouseHover);
    }
}

// sort cell list based on time order
cellList.sort(compareElements);

// add mouse up function to table
table.addEventListener('mouseup', onMouseUp);

// add mouse exit function to table
table.addEventListener('mouseleave', onMouseTableExit);