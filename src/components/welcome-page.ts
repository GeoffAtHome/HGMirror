/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { property, customElement } from 'lit/decorators.js';

import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../store';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

@customElement('welcome-page')
export class WelcomePage extends connect(store)(PageViewElement) {
  @property({ type: Boolean })
  private admin: boolean = false;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: block;
          padding: 10px;
        }
      `,
    ];
  }

  protected render() {
    return html`
      <section>
        <h2>Welcome Page</h2>
        <p>Skeleton starting point</p>

        <p>Change as necessary</p>

        <p>This app - this application requires authentication.</p>
      </section>
    `;
  }
}