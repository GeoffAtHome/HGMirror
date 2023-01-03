/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from 'lit';
// eslint-disable-next-line import/extensions
import { property, customElement, query } from 'lit/decorators.js';

// These are the actions needed by this element.
import '@vaadin/login';
import fetch from 'unfetch';
import { computeHash } from './sha256';
import { store } from '../store';
import { navigate, notifyMessage } from '../actions/app';

import { userDataSelectUser } from '../actions/user';
import userData, { userDataSelector } from '../reducers/user';
import { hgDataSetData } from '../actions/hg-data';
import hgData, { fetchHgData, hgDataSelector } from '../reducers/hg-data';

// We are lazy loading its reducer.
if (userDataSelector(store.getState()) === undefined) {
  store.addReducers({
    userData,
  });
}

if (hgDataSelector(store.getState()) === undefined) {
  store.addReducers({
    hgData,
  });
}

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
function LogError(text: string, err: any) {
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

async function signIn(authString: string) {
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

@customElement('user-login')
export class UserLogin extends LitElement {
  @query('#loginForm')
  private loginForm: any;

  @property({ type: Boolean })
  private loggedIn: boolean = false;

  protected render() {
    return html`
      <vaadin-login-overlay
        id="loginForm"
        title="Genius Mirror"
        description="Login to the Genius Hub"
        no-forgot-password
        opened
        @login="${this.loginEvent}"
      >
        <h1>What is this</h1>
      </vaadin-login-overlay>
    `;
  }

  updated() {
    if (!this.loggedIn) this.loginForm.opened = true;
  }

  private loginEvent(e: CustomEvent<{ username: string; password: string }>) {
    const authString = `Basic ${btoa(
      `${e.detail.username}:${computeHash(
        e.detail.username + e.detail.password
      )}`
    )}`;

    try {
      this.loginForm.opened = false;
      signIn(authString);
    } catch (err: any) {
      LogError('loginButton', err);
      this.loginForm.opened = true;
      this.loginForm.error = true;
    }
  }
}
