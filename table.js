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

// initialize set of cells that have been highlighted
let selected = new Set();

// initialize cell of original click
let firstClicked;

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
        if (!selected.has(ev.target)) {
            // activate cell
            ev.target.style.backgroundColor = 'green';
            selected.add(ev.target);
        }

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
        ev.target.style.backgroundColor = 'green';
        selected.add(ev.target);
    }
}

/**
 * Handles user lifting mouse over tile. Modifies state to mouse up
 * 
 * @param {Event} ev 
 */
function onMouseUp(ev) {
    mouseDown = false;
}

/**
 * Handles user moving mouse out of calendar area. Modified state to mouse up
 * 
 * @param {Event} ev 
 */
function onMouseTableExit(ev) {
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
cellList.sort((el1, el2) => {
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
})

cellList.forEach(el => {
    console.log(el.dataset.datetime);
})

// add mouse up function to table
table.addEventListener('mouseup', onMouseUp);

// add mouse exit function to table
table.addEventListener('mouseleave', onMouseTableExit);