const BASE_ENDPOINT = 'https://www.googleapis.com/calendar/v3';
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

fetch('https://accounts.google.com/o/oauth2/v2/auth')
    .then(response => response.json())
    .then(data => console.log(data));

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
        'client_id': CLIENT_ID,
        'redirect_uri': 'http://127.0.0.1:5500/index.html',
        'response_type': 'token',
        'scope': SCOPES,
        'include_granted_scopes': 'true',
        'state': 'pass-through value'
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}

// oauthSignIn();
const authBtn = document.getElementById('auth');
authBtn.addEventListener('click', (el, ev) => {
    oauthSignIn();
});

function getFreeBusy() {
    const endpoint = BASE_ENDPOINT + '/freeBusy';

    const from = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', endpoint);

    // const params = {
    //     'timeMin': 
    // }
}