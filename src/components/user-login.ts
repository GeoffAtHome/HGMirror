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
import { navigate } from '../actions/app';

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

// Test the username and password
let credentials = {
  password: '',
  username: '',
  localAddress: '',
  serverName: '',
  authString: '',
  useLocalIP: true,
  loggedIn: false,
};

function LogError(text: string, err: any) {
  // eslint-disable-next-line no-console
  console.error(`${text}: ${err}`);
}

async function signIn(
  username: string,
  password: string,
  localaddress: string,
  useLocalIP: boolean
) {
  const authString = `Basic ${btoa(
    `${username}:${computeHash(username + password)}`
  )}`;

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
      localStorage.setItem('credentials', btoa(JSON.stringify(credentials)));
      localStorage.setItem('loggedIn', 'true');

      store.dispatch(
        userDataSelectUser(true, serverName, credentials, authString)
      );
      fetchHgData(serverName, authString);
      const newLocation = `/#home`;
      window.history.pushState({}, '', newLocation);
      store.dispatch(navigate(decodeURIComponent(newLocation)));
    }
  } catch (err) {
    LogError(JSON.stringify(err), err);
  }
}

function getData() {
  if (credentials.loggedIn) {
    fetchHgData(credentials.serverName, credentials.authString);
  }
}

const dataTimer = setInterval(() => getData(), 10 * 1000);

export function logUserIn() {
  const credentialsText = localStorage.getItem('credentials');
  if (credentialsText !== null && credentialsText !== '') {
    credentials = JSON.parse(atob(credentialsText));
    signIn(
      credentials.username,
      credentials.password,
      credentials.localAddress,
      credentials.useLocalIP
    );
  }
}

@customElement('user-login')
export class UserLogin extends LitElement {
  @query('#loginForm')
  private loginForm: any;

  @property({ type: String })
  private userName: string = '';

  @property({ type: String })
  private passwordPassword: string = '';

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

  private async loginButton() {
    try {
      this.loginForm.opened = false;
      signIn(this.userName, this.passwordPassword, '192.168.15.225', true);
    } catch (err: any) {
      LogError('loginButton', err);
      this.loginForm.opened = true;
      this.loginForm.error = true;
    }
  }

  private loginEvent(e: CustomEvent<{ username: string; password: string }>) {
    this.userName = e.detail.username;
    this.passwordPassword = e.detail.password;
    this.loginButton();
  }
}
