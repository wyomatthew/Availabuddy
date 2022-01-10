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

const signInStatus = document.getElementById('signInStatus');

function handleClientLoad() {
    // Load the API client and auth2 library
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: discoveryDocs,
        clientId: clientId,
        scope: scopes
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        signedIn = true;
        signInStatus.innerText = "Signed in!"
        // authorizeButton.style.display = 'none';
        // signoutButton.style.display = 'block';
        makeApiCall();
        listUpcomingEvents(start, new Date(start.valueOf() + (MS_IN_WEEK)));
    } else {
        // authorizeButton.style.display = 'block';
        // signoutButton.style.display = 'none';
        signInStatus.innerHTML = "Not signed in :("
        signedIn = false;
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

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
    gapi.client.people.people.get({
        'resourceName': 'people/me',
        'requestMask.includeField': 'person.names'
    }).then(function (resp) {
        var p = document.createElement('p');
        var name = resp.result.names[0].givenName;
        p.appendChild(document.createTextNode('Hello, ' + name + '!'));
        document.getElementById('content').appendChild(p);
    });
}

function addText(message) {
    var label = document.getElementById('eventsList');
    var textContent = document.createTextNode(message + '\n');
    label.appendChild(textContent);
}

/**
 * Configures passed in element to be occupied
 * 
 * @param {HTMLElement} elt
 */
function markAsOccupied(elt) {
    elt.style.backgroundColor = 'gray';
    elt.style.borderTopWidth = '0px';
    elt.style.borderBottomWidth = '0px';
}

/**
 * 
 * Sets the background color to gray for events in your calendar.
 * 
 * @param {Integer} start 
 * @param {Integer} end 
 */
function setCalendarBusy(start, end) {
    // while (start < end) {
    //     var elt = document.querySelector("[data-datetime = '" + start + "']");
    //     if (elt != null) {
    //         elt.style.backgroundColor = 'gray';
    //         elt.style.borderTopWidth = '0px';
    //         elt.style.borderBottomWidth = '0px';
    //     }

    //     start = start + 3600000;
    // }

    // iterate over all cells
    cellList.forEach(el => {
        // check if cell start time falls within window
        const startTime = parseInt(el.dataset.datetime);
        console.log(startTime);
        if (startTime >= start && startTime <= end) {
            markAsOccupied(el);
        }
    })
}

function listUpcomingEvents(startDate, endDate) {
    gapi.client.calendar.calendarList.list({
        // No parameters yay
    }).then(response => {
        // get calendar list
        const calendarList = response.result.items;
        calendarList.forEach(currCal => {
            gapi.client.calendar.events.list({
                'calendarId': currCal.id,
                'timeMin': (startDate).toISOString(),
                'timeMax': (endDate).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
            }).then(function (response) {
                var events = response.result.items;
                // addText('Upcoming events:');

                if (events.length > 0) {
                    for (i = 0; i < events.length; i++) {
                        var event = events[i];
                        var when = event.start.dateTime;
                        if (!when) {
                            when = event.start.date;
                            // var date = new Date(when).toLocaleString('en-US', {
                            //     timeZone: 'UTC',
                            //     day: 'numeric',
                            //     month: 'numeric',
                            //     year: 'numeric'
                            // });

                            // addText(event.summary + ' (' + date + ')');
                        } else {
                            // var startDate = new Date(when).toLocaleString('en-US', {
                            //     day: 'numeric',
                            //     month: 'numeric',
                            //     year: 'numeric',
                            //     hour: 'numeric',
                            //     minute: 'numeric',
                            //     hour12: true
                            // });

                            var msStart = new Date(event.start.dateTime).getTime();
                            var msEnd = new Date(event.end.dateTime).getTime();
                            setCalendarBusy(msStart, msEnd);

                            // var endDate = new Date(event.end.dateTime).toLocaleString('en-US', {
                            //     hour: 'numeric',
                            //     minute: 'numeric',
                            //     hour12: true
                            // });

                            // addText(event.summary + ' (' + startDate + ' to ' + endDate + ')');
                        }
                    }
                } else {
                    // addText('No upcoming events found.');
                }
            });
        })
    })

}