// create a row for each 
const table = document.getElementById('calendarTable');
const oneHourNode = document.createElement('tr');
const numToWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// configure cell width and height
const TIME_LABEL_WIDTH = 50;
// const CELL_HEIGHT = 5;

// configure cell duration in ms
const DURATION = 3600000;


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

// initialize variable to store user state
let mouseDown = false;

// initialize grand set and current set of cells that have been highlighted
let selected = new Set();
let currSelected = new Set();
let selectToAdd = true;

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
 * Marks an element as activated by coloring it and removing borders
 * 
 * @param {HTMLElement} el 
 */
function activateElement(el) {
    el.style.backgroundColor = '#77DD77';
    el.style.borderTopWidth = '0px';
    el.style.borderBottomWidth = '0px';
}

/**
 * Marks an element as deactivated by whiting it out and adding borders
 * 
 * @param {HTMLElement} el 
 */
function deactivateElement(el) {
    el.style.backgroundColor = '#F6F6F6';
    el.style.borderTopWidth = '1px';
    el.style.borderBottomWidth = '1px';
}

/**
 * Activates element as selected by coloring it, deleting its border, and adding
 * it to the current selected set
 * 
 * @param {HTMLElement} el 
 */
function addToCurrent(el) {
    // case on selection type
    if (selectToAdd) {
        // activate the element
        activateElement(el);
    } else {
        // deactivate the element
        deactivateElement(el);
    }
    currSelected.add(el);
}

/**
 * Deactivates element by making it white, re-adding border, and removing it
 * from the current selected set
 * 
 * @param {HTMLElement} el 
 */
function removeFromCurrent(el) {
    if (selectToAdd) {
        // deactivate the element
        deactivateElement(el);
    } else {
        activateElement(el);
    }
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
        // case on whether or not current element is selected for selection type
        selectToAdd = !selected.has(ev.target);

        // active cell if it is not already activated
        currSelected.clear();
        addToCurrent(ev.target);

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
        // revert all members of currSelected and recalculate
        currSelected.forEach(el => {
            // case on selection type
            if (selectToAdd) {
                // deactivate element if it is not already selected
                if (!selected.has(el)) {
                    deactivateElement(el);
                }
            } else {
                // activate element if it is a part of selected
                if (selected.has(el)) {
                    activateElement(el);
                }
            }
        })
        currSelected.clear();

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

        // add all relevant elements in range to working set
        for (let i = lo; i <= hi; i++) {
            // activate current element
            addToCurrent(cellList[i]);
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
        // case on selection type to remove or add current element
        if (selectToAdd) {
            selected.add(currCell);
        } else {
            selected.delete(currCell);
        }
    });

    mouseDown = false;

    // fill in out box
    fillOutBox(selected);
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
        // case on selection type to remove or add current element
        if (selectToAdd) {
            selected.add(currCell);
        } else {
            selected.delete(currCell);
        }
    });

    mouseDown = false;

    // fill in out box
    fillOutBox(selected);
}

// build date table
let cellList = new Array();
let MS_PER_PIXEL;

function hourIndexToTime(hourIndex) {
    if (hourIndex === 0) {
        return '12 AM';
    } else if (hourIndex === 12) {
        return '12 PM';
    } else {
        const isAm = Math.floor(hourIndex / 12) === 0;
        const hour = hourIndex % 12;
        if (isAm) {
            return `${hour} AM`;
        } else {
            return `${hour} PM`;
        }

    }
}

/**
 * Draws main calendar interface as table on document. First clears all table
 * contents and then draws the day headers, day numbers, and then all hour cells
 * as well as their hour labels
 * 
 * @param {Date} startDate date of Sunday
 * @param {number} startTime start time of first cell of day in ms relative to start of day
 * @param {number} endTime end time of last cell of day in ms relative to end of day
 */
function drawTable(startDate = startWeek, startTime = 0, endTime = MS_IN_DAY) {
    // empty table
    let currChild = table.lastElementChild;
    while (currChild) {
        table.removeChild(currChild);
        currChild = table.lastElementChild;
    }

    // add month label
    const monthLabelRow = document.createElement('tr');
    // add time label header
    const timeLabelMonth = document.createElement('th');
    timeLabelMonth.setAttribute('class', 'labelCell');
    monthLabelRow.appendChild(timeLabelMonth);

    // add month
    const monthLabelHeader = document.createElement('th');
    monthLabelHeader.setAttribute('id', 'monthCell');
    monthLabelHeader.setAttribute('colspan', '7');
    monthLabelHeader.appendChild(document.createTextNode('Month'));
    monthLabelRow.appendChild(monthLabelHeader);

    // append row
    table.appendChild(monthLabelRow);

    // add day labels
    const dayLabelRow = document.createElement('tr');

    // add time label header
    const timeLabel = document.createElement('th');
    timeLabel.setAttribute('class', 'labelCell');
    dayLabelRow.appendChild(timeLabel);

    // iterate through days of week
    for (let i = 0; i < numToWeek.length; i++) {
        // create current node
        const currHead = document.createElement('th');
        currHead.setAttribute('id', numToWeek[i]);

        // set text content
        let content = numToWeek[i];
        content = content.charAt(0).toUpperCase() + content.slice(1, content.length);
        currHead.appendChild(document.createTextNode(content));

        // append node to row
        dayLabelRow.appendChild(currHead);
    }
    table.appendChild(dayLabelRow);

    // add day number labels
    const dayLabelNumRow = document.createElement('tr');

    // add time label header
    const timeLabelNum = document.createElement('th');
    timeLabelNum.setAttribute('class', 'labelCell');
    dayLabelNumRow.appendChild(timeLabelNum);

    // iterate through days of week
    for (let i = 0; i < numToWeek.length; i++) {
        // create current node
        const currHead = document.createElement('th');
        currHead.setAttribute('id', numToWeek[i] + 'Num');

        // assign text content
        // compute current offset from start date
        currHead.innerHTML = (new Date(startDate.valueOf() + (i * MS_IN_DAY))).getDate();
        dayLabelNumRow.appendChild(currHead);
    }
    table.appendChild(dayLabelNumRow);

    // empty cell list
    cellList = new Array();

    // create all cell rows
    const firstHour = startTime / DURATION;
    const cellsPerColumn = (endTime - startTime) / DURATION;
    const endHour = endTime / DURATION;
    // check that cellsPerColumn computes to whole number
    if (cellsPerColumn !== parseInt(cellsPerColumn)) {
        throw `Cells per column ${cellsPerColumn} must compute to whole number`;
    }
    let i;
    for (i = firstHour; i < endHour; i++) {
        const currRow = oneHourNode.cloneNode(false);
        currRow.setAttribute('id', `${i}`);
        table.appendChild(currRow);

        // append label cell
        const rowLabel = document.createElement('td');
        rowLabel.setAttribute('headers', 'label');
        rowLabel.setAttribute('class', 'labelCell');

        // append time
        rowLabel.appendChild(document.createTextNode(hourIndexToTime(i)));
        currRow.appendChild(rowLabel);

        // append 7 cells to the row
        const cellNode = document.createElement('td');
        for (let j = 0; j < 7; j++) {
            // create current node and add to current row
            const currCell = cellNode.cloneNode(false);
            currCell.setAttribute('headers', numToWeek[j]);
            currCell.setAttribute('class', 'timeCell');

            // get datetime of current cell and set duration
            currCell.setAttribute('data-datetime', startDate.valueOf() + (j * MS_IN_DAY) + (i * MS_IN_HOUR));
            currCell.setAttribute('data-duration', DURATION);
            currRow.appendChild(currCell);

            // add to cell list
            cellList.push(currCell);

            // add mouse events
            currCell.addEventListener('mousedown', onMouseDown);
            currCell.addEventListener('mouseenter', onMouseHover);
        }
    }

    // append final time label
    const finalRow = document.createElement('tr');

    // append label cell
    const rowLabel = document.createElement('td');
    rowLabel.setAttribute('headers', 'label');
    rowLabel.setAttribute('class', 'labelCell');
    rowLabel.appendChild(document.createTextNode(hourIndexToTime(i % 24)));
    finalRow.appendChild(rowLabel);
    table.appendChild(finalRow);

    // sort cell list based on time order
    cellList.sort(compareElements);
    MS_PER_PIXEL = DURATION / document.querySelector('td').offsetHeight;

    // offset labels
    const labelCells = document.querySelectorAll('.labelCell');
    const adjustmentPerCell = document.querySelector('td').offsetHeight / 2;
    for (let i = 0; i < labelCells.length; i++) {
        // add padding to label
        labelCells[i].style.bottom = `${adjustmentPerCell}px`;
    }
}

var startingHour = MS_IN_HOUR * startVal;
var endingHour = MS_IN_HOUR * endVal;

drawTable(startWeek, startingHour, endingHour);

// add mouse up function to table
table.addEventListener('mouseup', onMouseUp);

// add mouse exit function to table
table.addEventListener('mouseleave', onMouseTableExit);

const outBox = document.getElementById('out');

// implement function to fill text area with info from selected cells

/**
 * Takes input set of selected cell elements, cosolidates adjacent cells
 * into blocks, and prints the consolidated blocks to the out box
 * 
 * @param {Set<HTMLElement>} selectedCellSet 
 */
function fillOutBox(selectedCellSet) {
    // wipe out box
    outBox.innerHTML = '';
    outBox.innerHTML = freeText;

    // add all selected cells to a sorted list
    const selectedList = new Array();
    selectedCellSet.forEach(el => {
        selectedList.push(el);
    });
    selectedList.sort(compareElements);

    // consolidate adjacent durations
    class Block {
        constructor(start = 0, end = 0) {
            this.start = parseInt(start);
            this.end = parseInt(end);
        }

        setStart(start) {
            this.start = start;
        }

        setEnd(end) {
            this.end = end;
        }

        extendEnd(duration) {
            this.end = this.end + parseInt(duration);
        }

        toString() {
            // create start and end dates
            const startDate = new Date(this.start);
            const endDate = new Date(this.end);
            return formatDate(startDate, true) + ' to ' + formatDate(endDate, false);
        }
    }

    // iterate through cells and build blocks
    const blockList = new Array();
    let cellIndex = 0;
    while (cellIndex < selectedList.length) {
        // get current selected cell and its end time
        const currCell = selectedList[cellIndex];
        let lastEnd = parseInt(currCell.dataset.datetime) + parseInt(currCell.dataset.duration);
        cellIndex++;

        // build current block
        const currBlock = new Block(currCell.dataset.datetime, lastEnd);

        // iterate until last end does not match next cell's start time
        while (cellIndex < selectedList.length &&
            parseInt(selectedList[cellIndex].dataset.datetime) === lastEnd) {

            // add current block
            currBlock.extendEnd(selectedList[cellIndex].dataset.duration);

            // go to next and configure last end
            lastEnd = parseInt(currBlock.end);
            cellIndex++;
        }

        // add block to list of blocks
        blockList.push(currBlock);
    }

    // output blocks to textarea
    for (const currBlock of blockList) {
        outBox.innerHTML += currBlock.toString() + '\n';
    }
}

/**
 * Moves page to input week while properly maintaining all global variables
 * 
 * @param {number} week week index to go to
 */
function goToWeek(week) {
    startWeek = new Date(firstSunday.valueOf() + (week * MS_IN_WEEK));
    weekIndex = week;

    function afterEventLoad() {
        const interval = 5;
        const step = 0.05;

        // fade out calendar
        const calendarContainer = document.getElementById('calendarContainer');
        fadeOut(calendarContainer, interval, step);

        // disable left button if we are at first week
        if (weekIndex < 1) {
            document.getElementById('goLeft').disabled = true;
        }

        drawTable(startWeek, startVal * MS_IN_HOUR, endVal * MS_IN_HOUR);
        refreshEvents();

        fadeIn(calendarContainer, interval, step);
    }

    // populate events for week if not already populated
    if (!isPopulated(week)) {
        // disable buttons
        document.querySelectorAll('#movementButtons button').forEach(el => { el.disabled = true; });
        populateWeeksEvents(userCalendars, week).then((updatedCalendars) => {
            // re-enable buttons
            document.querySelectorAll('#movementButtons button').forEach(el => { el.disabled = false; });

            afterEventLoad();
        })
    } else {
        afterEventLoad();
    }
}

document.getElementById('goRight').addEventListener('click', (ev) => {
    goToWeek(weekIndex + 1);
})

document.getElementById('goLeft').addEventListener('click', (ev) => {
    goToWeek(weekIndex - 1);
})