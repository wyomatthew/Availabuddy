// create a row for each 
const table = document.getElementById('calendarTable');
const oneHourNode = document.createElement('tr');
const numToWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const timeZones = [
    { "label": "(GMT-12:00) International Date Line West", "value": "Etc/GMT+12" },
    { "label": "(GMT-11:00) Midway Island, Samoa", "value": "Pacific/Midway" },
    { "label": "(GMT-10:00) Hawaii", "value": "Pacific/Honolulu" },
    { "label": "(GMT-09:00) Alaska", "value": "US/Alaska" },
    { "label": "(GMT-08:00) Pacific Time (US & Canada)", "value": "America/Los_Angeles" },
    { "label": "(GMT-08:00) Tijuana, Baja California", "value": "America/Tijuana" },
    { "label": "(GMT-07:00) Arizona", "value": "US/Arizona" },
    { "label": "(GMT-07:00) Chihuahua, La Paz, Mazatlan", "value": "America/Chihuahua" },
    { "label": "(GMT-07:00) Mountain Time (US & Canada)", "value": "US/Mountain" },
    { "label": "(GMT-06:00) Central America", "value": "America/Managua" },
    { "label": "(GMT-06:00) Central Time (US & Canada)", "value": "US/Central" },
    { "label": "(GMT-06:00) Guadalajara, Mexico City, Monterrey", "value": "America/Mexico_City" },
    { "label": "(GMT-06:00) Saskatchewan", "value": "Canada/Saskatchewan" },
    { "label": "(GMT-05:00) Bogota, Lima, Quito, Rio Branco", "value": "America/Bogota" },
    { "label": "(GMT-05:00) Eastern Time (US & Canada)", "value": "US/Eastern" },
    { "label": "(GMT-05:00) Indiana (East)", "value": "US/East-Indiana" },
    { "label": "(GMT-04:00) Atlantic Time (Canada)", "value": "Canada/Atlantic" },
    { "label": "(GMT-04:00) Caracas, La Paz", "value": "America/Caracas" },
    { "label": "(GMT-04:00) Manaus", "value": "America/Manaus" },
    { "label": "(GMT-04:00) Santiago", "value": "America/Santiago" },
    { "label": "(GMT-03:30) Newfoundland", "value": "Canada/Newfoundland" },
    { "label": "(GMT-03:00) Brasilia", "value": "America/Sao_Paulo" },
    { "label": "(GMT-03:00) Buenos Aires, Georgetown", "value": "America/Argentina/Buenos_Aires" },
    { "label": "(GMT-03:00) Greenland", "value": "America/Godthab" },
    { "label": "(GMT-03:00) Montevideo", "value": "America/Montevideo" },
    { "label": "(GMT-02:00) Mid-Atlantic", "value": "America/Noronha" },
    { "label": "(GMT-01:00) Cape Verde Is.", "value": "Atlantic/Cape_Verde" },
    { "label": "(GMT-01:00) Azores", "value": "Atlantic/Azores" },
    { "label": "(GMT+00:00) Casablanca, Monrovia, Reykjavik", "value": "Africa/Casablanca" },
    { "label": "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London", "value": "Etc/Greenwich" },
    { "label": "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna", "value": "Europe/Amsterdam" },
    { "label": "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague", "value": "Europe/Belgrade" },
    { "label": "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris", "value": "Europe/Brussels" },
    { "label": "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb", "value": "Europe/Sarajevo" },
    { "label": "(GMT+01:00) West Central Africa", "value": "Africa/Lagos" },
    { "label": "(GMT+02:00) Amman", "value": "Asia/Amman" },
    { "label": "(GMT+02:00) Athens, Bucharest, Istanbul", "value": "Europe/Athens" },
    { "label": "(GMT+02:00) Beirut", "value": "Asia/Beirut" },
    { "label": "(GMT+02:00) Cairo", "value": "Africa/Cairo" },
    { "label": "(GMT+02:00) Harare, Pretoria", "value": "Africa/Harare" },
    { "label": "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius", "value": "Europe/Helsinki" },
    { "label": "(GMT+02:00) Jerusalem", "value": "Asia/Jerusalem" },
    { "label": "(GMT+02:00) Minsk", "value": "Europe/Minsk" },
    { "label": "(GMT+02:00) Windhoek", "value": "Africa/Windhoek" },
    { "label": "(GMT+03:00) Kuwait, Riyadh, Baghdad", "value": "Asia/Kuwait" },
    { "label": "(GMT+03:00) Moscow, St. Petersburg, Volgograd", "value": "Europe/Moscow" },
    { "label": "(GMT+03:00) Nairobi", "value": "Africa/Nairobi" },
    { "label": "(GMT+03:00) Tbilisi", "value": "Asia/Tbilisi" },
    { "label": "(GMT+03:30) Tehran", "value": "Asia/Tehran" },
    { "label": "(GMT+04:00) Abu Dhabi, Muscat", "value": "Asia/Muscat" },
    { "label": "(GMT+04:00) Baku", "value": "Asia/Baku" },
    { "label": "(GMT+04:00) Yerevan", "value": "Asia/Yerevan" },
    { "label": "(GMT+04:30) Kabul", "value": "Asia/Kabul" },
    { "label": "(GMT+05:00) Yekaterinburg", "value": "Asia/Yekaterinburg" },
    { "label": "(GMT+05:00) Islamabad, Karachi, Tashkent", "value": "Asia/Karachi" },
    { "label": "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi", "value": "Asia/Calcutta" },
    { "label": "(GMT+05:30) Sri Jayawardenapura", "value": "Asia/Calcutta" },
    { "label": "(GMT+05:45) Kathmandu", "value": "Asia/Katmandu" },
    { "label": "(GMT+06:00) Almaty, Novosibirsk", "value": "Asia/Almaty" },
    { "label": "(GMT+06:00) Astana, Dhaka", "value": "Asia/Dhaka" },
    { "label": "(GMT+06:30) Yangon (Rangoon)", "value": "Asia/Rangoon" },
    { "label": "(GMT+07:00) Bangkok, Hanoi, Jakarta", "value": "Asia/Bangkok" },
    { "label": "(GMT+07:00) Krasnoyarsk", "value": "Asia/Krasnoyarsk" },
    { "label": "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi", "value": "Asia/Hong_Kong" },
    { "label": "(GMT+08:00) Kuala Lumpur, Singapore", "value": "Asia/Kuala_Lumpur" },
    { "label": "(GMT+08:00) Irkutsk, Ulaan Bataar", "value": "Asia/Irkutsk" },
    { "label": "(GMT+08:00) Perth", "value": "Australia/Perth" },
    { "label": "(GMT+08:00) Taipei", "value": "Asia/Taipei" },
    { "label": "(GMT+09:00) Osaka, Sapporo, Tokyo", "value": "Asia/Tokyo" },
    { "label": "(GMT+09:00) Seoul", "value": "Asia/Seoul" },
    { "label": "(GMT+09:00) Yakutsk", "value": "Asia/Yakutsk" },
    { "label": "(GMT+09:30) Adelaide", "value": "Australia/Adelaide" },
    { "label": "(GMT+09:30) Darwin", "value": "Australia/Darwin" },
    { "label": "(GMT+10:00) Brisbane", "value": "Australia/Brisbane" },
    { "label": "(GMT+10:00) Canberra, Melbourne, Sydney", "value": "Australia/Canberra" },
    { "label": "(GMT+10:00) Hobart", "value": "Australia/Hobart" },
    { "label": "(GMT+10:00) Guam, Port Moresby", "value": "Pacific/Guam" },
    { "label": "(GMT+10:00) Vladivostok", "value": "Asia/Vladivostok" },
    { "label": "(GMT+11:00) Magadan, Solomon Is., New Caledonia", "value": "Asia/Magadan" },
    { "label": "(GMT+12:00) Auckland, Wellington", "value": "Pacific/Auckland" },
    { "label": "(GMT+12:00) Fiji, Kamchatka, Marshall Is.", "value": "Pacific/Fiji" },
    { "label": "(GMT+13:00) Nuku'alofa", "value": "Pacific/Tongatapu" }
]

availableCells = new Array(); // 2d array where index represents week index and elements are HTMLElements

function markAvailableWeek(index) {
    if (availableCells[index] != null) {
        availableCells[index].forEach(element => {
            var startTime = parseInt(element.dataset.datetime); 
            document.querySelector("[data-datetime='" + startTime + "']").setAttribute('data-available', true); 
        });
    }
}


// initialize timezone select
const timeZoneSelect = document.getElementById('timeZoneSelect');
// create an option for each time zone object
for (const tzObj of timeZones) {
    // add option
    const tzEl = document.createElement('option');

    // populate element with fields
    tzEl.setAttribute('value', tzObj.value);
    tzEl.appendChild(document.createTextNode(tzObj.label));

    timeZoneSelect.appendChild(tzEl);
}

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
 * @param {boolean} isUTC
 * @return {Date} date of input string
 */
function convertRFCToDate(rfcStr, isUTC) {
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

    // get offset hour and offset minutes
    const offsetHour = parseInt(rfcStr.substring(21, 23));
    const offsetMinute = parseInt(rfcStr.substring(24, 26));

    // case on offset sign
    if (rfcStr.length > 26 && !isUTC) {
        if (rfcStr.charAt(20) === '-') {
            ret = new Date(ret.valueOf() - (offsetHour * MS_IN_HOUR) - (offsetMinute * MS_IN_HOUR / 60));
        } else {
            ret = new Date(ret.valueOf() + (offsetHour * MS_IN_HOUR) + (offsetMinute * MS_IN_HOUR / 60));
        }
    }

    return ret;
}

// initialize variable to store user state
let mouseDown = false;

// initialize grand set and current set of cells that have been highlighted
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

function flipState(el) {
    if (el.dataset.available == "true") {
        el.setAttribute('data-available', false);
    } else {
        el.setAttribute('data-available', true);
    }
}

/**
 * Activates element as selected by coloring it, deleting its border, and adding
 * it to the current selected set
 * 
 * @param {HTMLElement} el 
 */
function addToCurrent(el) {
    // if the element is not already in destination set, add it to selection
    if (el.dataset.available != selectToAdd.toString()) {
        flipState(el);
        el.setAttribute('data-selected', true);
    }
}

/**
 * Deactivates element by making it white, re-adding border, and removing it
 * from the current selected set
 * 
 * @param {HTMLElement} el 
 */
function removeFromCurrent(el) {
    // remove element from set and revert if it was in selection
    if (el.dataset.selected) {
        flipState(el)
        el.setAttribute('data-selected', false);
    }
}

/**
 * Clears all currently selected cells as selected
 */
function clearAllCurrSelected() {
    document.querySelectorAll('td[data-selected="true"]').forEach(el => {
        el.setAttribute('data-selected', false);
    });
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
        // case on whether or not current element is toggled as available for selection type
        selectToAdd = ev.target.dataset.available == 'false';

        // active cell if it is not already activated
        clearAllCurrSelected();
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
        // revert all currently selected cells and recalculate
        document.querySelectorAll('td[data-selected="true"]').forEach(el => {
            // revert to original state
            flipState(el);
        })
        clearAllCurrSelected();

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
    // document.querySelectorAll('td[data-selected="true"]').forEach(currCell => {
    //     // case on selection type to remove or add current element
    //     if (selectToAdd) {
    //         currCell.setAttribute('data-available', true);
    //     } else {
    //         currCell.setAttribute('data-available', false);
    //     }
    // });
    // release all selected
    clearAllCurrSelected();

    mouseDown = false;

    // fill in out box
    fillOutBox(document.querySelectorAll('td[data-available="true"]'));
}

/**
 * 
 * Formats the date to make it more readable. 
 * 
 * @param {Date} date 
 * @param {boolean} isStart 
 * @returns String
 */
function formatDate(date, isStart, useTimezone = false) {
    // case on whether or not we need to specify timezone
    if (useTimezone && timeZoneSelect.value !== 'default') {
        if (!isStart) {
            return date.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: timeZoneSelect.value
            });
        } else {
            return date.toLocaleString('en-US', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: timeZoneSelect.value
            });
        }
    } else {
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
    // monthLabelHeader.appendChild(document.createTextNode('Month'));
    var endDate = new Date(startDate.getTime() + (6 * MS_IN_DAY));
    if (endDate.getMonth() != startDate.getMonth()) {
        // monthLabelHeader.setAttribute('id', startDate.getMonth() + '/' + endDate.getMonth());
        monthLabelHeader.appendChild(document.createTextNode(monthNames[startDate.getMonth()] + ' - ' + monthNames[endDate.getMonth()]));
    } else {
        // monthLabelHeader.setAttribute('id', startDate.getMonth());
        monthLabelHeader.appendChild(document.createTextNode(monthNames[startDate.getMonth()]));
    }

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

        // set class to today if it matches
        if (startDate.getMonth() === (new Date()).getMonth() &&
            startDate.getDate() + i === (new Date()).getDate()) {
            currHead.setAttribute('class', 'today');
        }

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
        currHead.setAttribute('class', 'dateNum');

        // set class to today if it matches
        if (startDate.getMonth() === (new Date()).getMonth() &&
            startDate.getDate() + i === (new Date()).getDate()) {
            currHead.setAttribute('class', currHead.getAttribute('class') + " today");
        }

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

            // get datetime of current cell and set duration
            currCell.setAttribute('data-datetime', startDate.getTime() + (j * MS_IN_DAY) + (i * MS_IN_HOUR));
            currCell.setAttribute('data-duration', DURATION);
            currCell.setAttribute('data-selected', false);
            currCell.setAttribute('data-available', false);
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
    const dataCells = document.querySelectorAll('tr');
    for (let i = 0; i < labelCells.length; i++) {
        // add padding to label
        labelCells[i].style.bottom = `${dataCells[i].offsetHeight / 2}px`;
    }

    markAvailableWeek(weekIndex); 
}

var startingHour = MS_IN_HOUR * startVal;
var endingHour = MS_IN_HOUR * endVal;

drawTable(startWeek, startingHour, endingHour);

// add mouse up function to table
table.addEventListener('mouseup', onMouseUp);

// add mouse exit function to table
document.getElementById('calendarContainer').addEventListener('mouseleave', onMouseUp);

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

        /**
         * 
         * @param {number} startTime start time of event in ms
         * @returns whether or not input time is contained by this block
         */
        contains(startTime) {
            return startTime >= this.start && startTime < this.end;
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
            return formatDate(startDate, true, true) + ' to ' + formatDate(endDate, false, true);
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
    // add all selected cells to list
    availableCells[weekIndex] = Array();
    document.querySelectorAll('td[data-available="true"]').forEach(el => {
        availableCells[weekIndex].push(el);
    });

    startWeek = new Date(firstSunday.valueOf() + (week * MS_IN_WEEK));

    weekIndex = week;

    function afterEventLoad() {
        const interval = 5;
        const step = 0.05;

        // fade out calendar
        const calendarContainer = document.getElementById('calendarContainer');
        fadeOut(calendarContainer, interval, step);

        // disable left button if we are at first week
        console.log(`Week index is ${weekIndex}`);
        document.querySelectorAll('#movementButtons button').forEach(el => { el.disabled = false; });
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