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
import { computeHash } from './sha256';
import { signIn, LogError } from './login-utils';

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
