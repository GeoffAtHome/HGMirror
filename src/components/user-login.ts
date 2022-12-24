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

import userData, { userDataSelector } from '../reducers/user';
import { userDataSelectUser } from '../actions/user';
// We are lazy loading its reducer.
if (userDataSelector(store.getState()) === undefined) {
  store.addReducers({
    userData,
  });
}

function LogError(text: string, err: any) {
  // eslint-disable-next-line no-console
  console.error(`${text}: ${err}`);
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

  @property({ type: String })
  private serverName: string = '';

  @property({ type: Boolean })
  private inProgress: boolean = true;

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
      ${this.inProgress} ${this.serverName}
    `;
  }

  updated() {
    if (!this.loggedIn) this.loginForm.opened = true;
  }

  private loginEvent(e: CustomEvent<{ username: string; password: string }>) {
    this.userName = e.detail.username;
    this.passwordPassword = e.detail.password;
    this.loginButton();
  }

  private async loginButton() {
    try {
      this.loginForm.opened = false;
      this.signIn(this.userName, this.passwordPassword, '192.168.15.225', true);
    } catch (err: any) {
      LogError('loginButton', err);
    }
  }

  private async signIn(
    username: string,
    password: string,
    localaddress: string,
    useLocalIP: boolean
  ) {
    this.inProgress = true;
    const authString = `Basic ${btoa(
      `${username}:${computeHash(username + password)}`
    )}`;

    const url = 'https://hub.geniushub.co.uk/checkin';

    try {
      const result = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authString,
        },
      });

      if (result.status === 200) {
        delete this.loginForm.opened;
        const res = await result.json();
      } else {
        this.loginForm.opened = true;
        this.loginForm.error = true;
      }
    } catch (err) {
      LogError(JSON.stringify(err), err);
      this.loginForm.opened = true;
    }

    // Test the username and password
    const credentials = {
      password,
      username,
      localaddress,
      useLocalIP,
    };
    localStorage.setItem('remember', 'on');
    localStorage.setItem('credentials', btoa(JSON.stringify(credentials)));
    localStorage.setItem('loggedIn', 'true');
    // Remember the serve name as this tends to change.
    // this.serverName = `https://${req.response.data.tunnel.server_name}/v3/zones`;
    this.inProgress = false;
    this.loggedIn = !this.loggedIn;
    // Remember the serve name as this tends to change.
    this.serverName = `http://${localaddress}:1223/v3/zones`;
    this.inProgress = false;
    this.loggedIn = !this.loggedIn;

    store.dispatch(userDataSelectUser(true));
    const newLocation = `/#userLogin`;
    window.history.pushState({}, '', newLocation);
    store.dispatch(navigate(decodeURIComponent(newLocation)));
  }
}
