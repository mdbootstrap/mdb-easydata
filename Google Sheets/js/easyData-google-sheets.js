// Google Sheets

const GS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const GS_API_URL = "https://sheets.googleapis.com/$discovery/rest?version=v4";

function initOAuthClient(credentials = null) {

  if (credentials && credentials.clientId !== null && typeof credentials.clientId === 'string') {
    gapi.load("client:auth2", function () {
      gapi.auth2.init({ client_id: credentials.clientId }).then(() => document.dispatchEvent(new Event('gapi-loaded')));
    });
  } else if (credentials && credentials.apiKey !== null && typeof credentials.apiKey === 'string') {
    gapi.load("client", () => {
      gapi.client.setApiKey(credentials.apiKey);
      document.dispatchEvent(new Event('gapi-loaded'))
    });
  } else console.error('clientId or apiKey not defined');
}

function signIn(scope = GS_SCOPE) {
  return gapi.auth2.getAuthInstance().signIn({ scope }).then(() => {
    setCookie('guser-loggedin', 'true', 1);
    location.reload();
  }, (e) => console.error(e));
}

function signOut() {
  return gapi.auth2.getAuthInstance().signOut().then(() => {
    setCookie('guser-loggedin', 'true', -1);
    location.reload();
  }, (e) => console.error(e));
}

function loadClient(apiPath = GS_API_URL) {
  return gapi.client.load(apiPath);
}

function getValues(query, cb = function (res) { console.log(res); }, err = function (err) { console.error(err); }) {
  return loadClient().then(() => gapi.client.sheets.spreadsheets.values.get(query).then(cb, err));
}

function getPublicValues(query, cb = function (res) { console.log(res); }, err = function (err) { console.error(err); }) {
  return loadClient().then(() => gapi.client.sheets.spreadsheets.values.get(query).then(cb, err));
}

function isSignedIn() {
  if (getCookie('guser-loggedin') === 'true') return true;
  return false;
}

function setCookie(cname = 'guser-loggedin', cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}