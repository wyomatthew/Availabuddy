const PROJECT_NUMBER = '282170708765';
const API_KEY = 'AIzaSyA3ec3t_lNdoGv_aqqqBNJCyZSfj1umBw4';
const WEB_CLIENT_KEY = '282170708765-m4s4vcfvqpkt4a5ean74q5q51jg05sa9.apps.googleusercontent.com';
const DESKTOP_CLIENT_KEY = '282170708765-m4s4vcfvqpkt4a5ean74q5q51jg05sa9.apps.googleusercontent.com';
const BASE_ENDPOINT = 'https://www.googleapis.com/calendar/v3';
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials
var apiKey = 'AIzaSyA3ec3t_lNdoGv_aqqqBNJCyZSfj1umBw4';

// Enter the API Discovery Docs that describes the APIs you want to
// access. In this example, we are accessing the People API, so we load
// Discovery Doc found here: https://developers.google.com/people/api/rest/
var discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1", "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Enter a client ID for a web application from the Google API Console:
//   https://console.developers.google.com/apis/credentials?project=_
// In your API Console project, add a JavaScript origin that corresponds
//   to the domain where you will be running the script.
var clientId = '282170708765-m4s4vcfvqpkt4a5ean74q5q51jg05sa9.apps.googleusercontent.com';

// Enter one or more authorization scopes. Refer to the documentation for
// the API or https://developers.google.com/people/v1/how-tos/authorizing
// for details.
var scopes = 'profile';

var authorizeButton = document.getElementById('auth');
var signoutButton = document.getElementById('signout');

let signedIn = false;

// define week date boundaries
// initialize strating date information on Sunday
let startWeek = new Date();
let weekIndex = 0;

// get current day of the week
const dayOfWeek = startWeek.getDay();

// subtract commensurate number of miliseconds from start
const MS_IN_DAY = 86400000;
const MS_IN_HOUR = MS_IN_DAY / 24;
const MS_IN_WEEK = MS_IN_DAY * 7;
startWeek = new Date(startWeek.valueOf() - MS_IN_DAY * (dayOfWeek));

const firstSunday = startWeek;

/**
 * 
 * @param {number} weekIndex 
 * @returns {Date} date of sunday corresponding to week index
 */
function getSundayOfWeekIndex(weekIndex) {
    return new Date(firstSunday.valueOf() + (MS_IN_WEEK * weekIndex));
}

// get year month and day of sunday
let year = startWeek.getFullYear();
let month = startWeek.getMonth() + 1;
let day = startWeek.getDate();

startWeek.setFullYear(year, month - 1, day);
startWeek.setHours(0, 0, 0, 0);
let endWeek = new Date(startWeek.valueOf() + (MS_IN_WEEK));

const signInStatus = document.getElementById('signInStatus');
let userCalendars = new Array();
let userColors;

// define class to handle each calendar
class Calendar {
    constructor(id, summary, colorId) {
        this.id = id;
        this.summary = summary;
        this.colorId = colorId;
        this.events = new Array();
    }

    /**
     * Pushes an array of events onto the calendar
     * 
     * @param {Array<CalendarEvent} eventList 
     */
    addEvents(eventList) {
        this.events.push(eventList);
    }

    /**
     * 
     * @param {number} weekIndex 
     * @returns {Array<CalendarEvent>}
     */
    getEvents(weekIndex) {
        return this.events[weekIndex];
    }

    /**
     * Iterates over all events in this calendar and performs passed in function
     * 
     * @param {(ev: CalendarEvent) => void} onEvent 
     */
    iterateOverEvents(onEvent, weekIndex = null) {
        if (!weekIndex) {
            // iterate through all events on this calendar
            for (let i = 0; i < this.events.length; i++) {
                // get current list of events
                const currEventList = this.getEvents(i);

                // iterate through all events
                currEventList.forEach(onEvent);
            }
        } else {
            // iterate over all events in selected week
            this.getEvents(weekIndex).forEach(onEvent);
        }

    }

    /**
    * Removes all event boxes on the table relating to the current calendar
    * 
    */
    removeEvents() {
        this.iterateOverEvents(ev => {
            // get current event box
            const evBox = document.getElementById(ev.id);
            if (evBox) {
                document.getElementById('calendarContainer').removeChild(evBox);
            }
        })
    }

    /**
     * Draws all event boxes on the table relating to passed in calendar and week
     * 
     * @param {number} weekIndex 
     */
    drawEvents(weekIndex = 0) {
        this.iterateOverEvents(ev => {
            generateEventBox(ev, this);
        }, weekIndex);
    }

    /**
     * 
     * @returns {HTMLElement} checkbox corresponding tot his calendar
     */
    getCheckbox() {
        return document.getElementById(this.id);
    }

    toString() {
        return `ID: ${this.id}, Summary: ${this.summary}, Events: ${this.events.toString()}`;
    }
}

function handleClientLoad() {
    // Load the API client and auth2 library
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: discoveryDocs,
        clientId: clientId,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

/**
 * Uses binary search to identify the cell containing the start time of an event
 * 
 * @param {number} startTime 
 * @returns {HTMLElement} parent cell
 */
function identifyParentCell(startTime) {
    function searchForElement(lo, hi) {
        // check that we have not run out of cells
        if (lo >= hi) {
            throw (`startTime ${startTime} is not contained in any cells in the table`);
        }

        // identify midpoint of bounds
        const mid = Math.floor((lo + hi) / 2);

        // compare starttime of midpoint to input start time
        const midStartTime = parseInt(cellList[mid].dataset.datetime);
        const midEndTime = midStartTime + parseInt(cellList[mid].dataset.duration);
        if (midStartTime <= startTime && midEndTime > startTime) {
            // we found cell, return it
            return cellList[mid];
        } else if (midStartTime > startTime) {
            // look in lower half
            return searchForElement(lo, mid);
        } else {
            // look in upper half
            return searchForElement(mid + 1, hi);
        }
    }

    // search in entire table
    return searchForElement(0, cellList.length);
}

/**
 * Refreshes 
 * 
 * @param {number} weekIndex 
 */
function refreshEvents(weekIndex = 0) {
    // iterate over all calendars
    userCalendars.forEach(cal => {
        // remove all events from current calendar
        cal.removeEvents();

        // draw events if the box is ticked for this calendar
        if (cal.getCheckbox().checked) {
            // redraw all events
            cal.drawEvents(weekIndex);
        }
    })
}

/**
 * Given an input calendar event, creates element for event and places it on
 * the calendar
 * 
 * @param {CalendarEvent} calEvent 
 * @param {Calendar} cal
 */
function generateEventBox(calEvent, cal) {
    // get duration of cell in ms
    const startDate = new Date(calEvent.start.dateTime);
    var msStart = startDate.getTime();
    var msEnd = new Date(calEvent.end.dateTime).getTime();

    // find cell where it should start
    let startCell;
    try {
        startCell = identifyParentCell(msStart);
    } catch (e) {
        return;
    }

    // compute offset from top
    const timeOffset = msStart - parseInt(startCell.dataset.datetime);

    // compute number of pixels offset represents
    const pixelOffset = timeOffset / MS_PER_PIXEL;

    // create box element
    const eventBox = document.createElement('div');
    eventBox.setAttribute('class', 'eventBox');
    eventBox.setAttribute('id', calEvent.id);

    // case on whether or not event has color
    if (!calEvent.colorId) {
        // get calendar's color id
        eventBox.style.backgroundColor = userColors.calendar[parseInt(cal.colorId)].background;
    } else {
        eventBox.style.backgroundColor = userColors.event[parseInt(calEvent.colorId)].background;
    }

    // append information
    const boldText = document.createElement('b');
    boldText.appendChild(document.createTextNode(calEvent.summary));
    eventBox.appendChild(boldText);
    eventBox.appendChild(document.createElement('br'));
    eventBox.appendChild(document.createTextNode(formatDate(new Date(msStart)) + ' - ' + formatDate(new Date(msEnd))));

    // assign padding
    const EVENT_BOX_PADDING = 4;

    eventBox.style.padding = `${EVENT_BOX_PADDING}px`;
    eventBox.style.top = `${parseInt(startCell.offsetTop) + pixelOffset}px`;
    eventBox.style.left = `${parseInt(startCell.offsetLeft)}px`;
    eventBox.style.width = `${parseInt((startCell.offsetWidth * 0.9) - (EVENT_BOX_PADDING * 2))}px`;
    eventBox.style.height = `${(((msEnd - msStart) / MS_PER_PIXEL) * 0.9) - (EVENT_BOX_PADDING * 2)}px`;

    // add enter and leave changes
    eventBox.addEventListener('mouseenter', (ev) => {
        // expand to full content
        console.log(`Setting height to${Math.max(ev.target.scrollHeight, ev.target.offsetHeight)}`);
        ev.target.style.height = `${Math.max(ev.target.scrollHeight, ev.target.offsetHeight)}px`;
        ev.target.style.zIndex = '5';
    });
    eventBox.addEventListener('mouseleave', (ev) => {
        ev.target.style.height = `${(((msEnd - msStart) / MS_PER_PIXEL) * 0.9) - (EVENT_BOX_PADDING * 2)}px`;
        ev.target.style.zIndex = '1';
    })

    document.getElementById('calendarContainer').appendChild(eventBox);
}

/**
 * Reacts to user checking or unchecking a text box
 * 
 * @param {Event} ev 
 */
function onBoxTick(ev) {
    // // get corresponding calendar
    // const cal = userCalendars.find(cal => {
    //     return cal.id == ev.target.id;
    // })

    // // case on whether or not box is ticked
    // if (ev.target.checked) {
    //     // create all boxes
    //     cal.events.forEach(ev => {
    //         generateEventBox(ev, cal);
    //     });
    // } else {
    //     // delete all boxes
    //     cal.events.forEach(ev => {
    //         // delete current box
    //         try {
    //             const currBox = document.getElementById(ev.id);
    //             document.getElementById('calendarContainer').removeChild(currBox);
    //         } catch (e) {
    //             // no event there!
    //         }

    //     });
    // }
    refreshEvents();

}

/**
 * Takes passed in list of calendars and creates checkbox for each calendar
 * 
 * @param {Array<Calendar>} calendarList 
 */
function drawCheckBoxes(calendarList) {
    // identify checkbox container
    const container = document.getElementById('rightOut');

    // iterate over list
    calendarList.forEach(currCal => {
        // create checkbox and wrapper for current calendar
        const wrapper = document.createElement('div');
        const checkBox = document.createElement('input');
        checkBox.setAttribute('type', 'checkbox');
        checkBox.setAttribute('id', currCal.id);
        checkBox.addEventListener('change', onBoxTick);
        wrapper.appendChild(checkBox);
        wrapper.appendChild(document.createTextNode(' ' + currCal.summary));

        container.appendChild(wrapper);
    });


}

function deleteCheckboxes() {
    var container = document.getElementById('rightOut');
    while (container.firstChild) {
        var wrapper = container.firstChild;
        container.removeChild(wrapper);
    }

    userCalendars = new Array();
}


/**
 * 
 * @param {Array<Calendar>} calList 
 * @param {number} weekNum 
 * @return {Array<Promise<CalendarEvemt>>}
 */
function getWeeksEvents(calList, weekNum = weekIndex) {
    // create array of promises of events for each calendar
    let eventPromises = new Array();

    // iterate over all calendars and add promise
    calList.forEach(cal => {
        eventPromises.push(getEvents(cal.id, getSundayOfWeekIndex(weekNum), getSundayOfWeekIndex(weekNum + 1)));
    });

    return eventPromises;
}

/**
 * Body of methods to call upon a user being signed in
 */
function onSignIn() {
    // get all user calendars
    getCalendars().then(calendarList => {
        // iterate over all calendars
        calendarList.forEach(currCal => {
            // create calendar object
            userCalendars.push(new Calendar(currCal.id, currCal.summary, currCal.colorId));

            // create a promise for each calendar
            // eventPromises.push(getEvents(currCal.id, startWeek, endWeek));
        });
        return getWeeksEvents(userCalendars, 0);
    }).then((eventPromises) => {
        Promise.allSettled(eventPromises).then(resultArrays => {
            // iterate over result arrays
            for (let i = 0; i < resultArrays.length; i++) {
                // get current calendar and its events
                const cal = userCalendars[i];
                const events = resultArrays[i].value;

                // add all events to calendar
                cal.addEvents(events);
            }

            // return result
            return userCalendars;
        }).then(calendarList => {
            drawCheckBoxes(calendarList);
        });
    });

    gapi.client.calendar.colors.get({}).then(response => {
        userColors = response.result;
    });
}


function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        signedIn = true;
        signInStatus.innerText = "Signed in!"
        onSignIn();
    } else {
        signInStatus.innerHTML = "Not signed in :("
        signedIn = false;
        deleteCheckboxes();
    }
}

function handleAuthClick(event) {
    if (!signedIn) {
        gapi.auth2.getAuthInstance().signIn();
    }
}

function handleSignoutClick(event) {
    if (signedIn) {
        gapi.auth2.getAuthInstance().signOut();
    }

}

/**
 * @returns list of calendar objects in user's list
 */
function getCalendars() {
    return new Promise((resolve, reject) => {
        // get list of calendars
        gapi.client.calendar.calendarList.list({}).then(response => {
            resolve(response.result.items);
        });
    });
}

/**
 * 
 * @param {string} calendarId 
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @param {number} maxResults 
 * @returns {Promise} promise containing all events within parameters contained
 *                    in the input calendar
 */
function getEvents(calendarId, startDate, endDate, maxResults = 50) {
    return new Promise((resolve, reject) => {
        gapi.client.calendar.events.list({
            'calendarId': calendarId,
            'timeMin': (startDate).toISOString(),
            'timeMax': (endDate).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': maxResults,
            'orderBy': 'startTime'
        }).then(response => {
            resolve(response.result.items);
        })
    })

}

function onResize() {
    refreshEvents();
}

window.addEventListener('resize', (ev) => {
    onResize();
})