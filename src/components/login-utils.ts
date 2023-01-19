import { navigate, notifyMessage } from '../actions/app';
import { userDataSelectUser } from '../actions/user';
import { fetchHgData } from '../reducers/hg-data';
import { store } from '../store';

export interface Credentials {
  localAddress: string;
  serverName: string;
  authString: string;
  useLocalIP: boolean;
  loggedIn: boolean;
}

// Test the username and password
let credentials: Credentials = {
  localAddress: '',
  serverName: '',
  authString: '',
  useLocalIP: true,
  loggedIn: false,
};

let dataTimer: number | any | undefined;

function getData() {
  if (credentials.loggedIn) {
    fetchHgData(credentials);
  }
}

export function LogError(text: string, err: any) {
  // eslint-disable-next-line no-console
  console.error(`${text}: ${err}`);
}

function signInEnd() {
  localStorage.setItem('loggedIn', 'true');
  dataTimer = setInterval(() => getData(), 10 * 1000);
  store.dispatch(
    userDataSelectUser(true, credentials.serverName, credentials.authString)
  );
  fetchHgData(credentials);
  const newLocation = `/#home`;
  window.history.pushState({}, '', newLocation);
  store.dispatch(navigate(decodeURIComponent(newLocation)));
}

export async function signIn(authString: string) {
  const url = 'https://hub.geniushub.co.uk/checkin';
  let results: any = {};
  try {
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authString,
      },
    });

    if (result.status === 200) {
      results = await result.json();
      // Remember the serve name as this tends to change.
      const serverName = `https://${results.data.tunnel.server_name}/v3/zones`;
      // Remember the serve name as this tends to change.
      // this.serverName = `http://${localaddress}:1223/v3/zones`;

      credentials.loggedIn = true;
      credentials.authString = authString;
      credentials.serverName = serverName;
      credentials.localAddress = results.data.internal_ip;
      localStorage.setItem('credentials', btoa(JSON.stringify(credentials)));
      store.dispatch(notifyMessage('Successfully logged in'));
      signInEnd();
    }
  } catch (err) {
    // Check-in has failed - if we have previously logged in we can try to carry on with local IP address.
    store.dispatch(notifyMessage('Failed login - will try with stale data'));
    if (credentials.loggedIn) signInEnd();
    LogError(JSON.stringify(err), err);
  }
}

export function logUserIn() {
  const credentialsText = localStorage.getItem('credentials');
  if (credentialsText !== null && credentialsText !== '') {
    credentials = JSON.parse(atob(credentialsText));
    signIn(credentials.authString);
  }
}

export function logUserOut() {
  if (dataTimer) clearInterval(dataTimer);
}
