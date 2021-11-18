// Google Search Console

const SC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const SC_API_URL = "https://content.googleapis.com/discovery/v1/apis/searchconsole/v1/rest";

gapi.load("client:auth2", function () {
  gapi.auth2.init({ client_id: CLIENT_ID }).then(() => document.dispatchEvent(new Event('gapi-loaded')));
});

function signIn(scope = SC_SCOPE) {
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

function loadClient(apiPath = SC_API_URL) {
  return gapi.client.load(apiPath);
}

function executeQuery(siteUrl, query, cb = function (res) { console.log(res); }, err = function (err) { console.error(err); }) {
  return loadClient().then(() => gapi.client.webmasters.searchanalytics
    .query({ siteUrl, resource: query })
    .then(cb, err));
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