/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { property, customElement, query } from 'lit/decorators.js';

import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import { connect } from 'pwa-helpers/connect-mixin';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import { installOfflineWatcher } from 'pwa-helpers/network';
import { installRouter } from 'pwa-helpers/router';

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the actions needed by this element.
import { navigate, updateOffline, updateDrawerState } from '../actions/app';
import userData, { userDataSelector } from '../reducers/user';
import hgData, { hgDataSelector } from '../reducers/hg-data';

// These are the elements needed by this element.
import '@material/mwc-top-app-bar';
import '@material/mwc-drawer';
import '@material/mwc-button';
import { logUserIn, logUserOut } from './login-utils';
import './zone-menu';
import { menuIcon, arrowBackIcon, logOutIcon } from './my-icons';
import './snack-bar';
import { ZoneData } from '../actions/hg-data';

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

function _BackButtonClicked() {
  window.history.back();
}

function getTitle(page: string) {
  let title = '';

  switch (page) {
    case 'home':
      title = 'Heating zones';
      break;

    case 'welcome':
      title = 'Welcome Page';
      break;

    case 'userLogin':
      title = 'Login';
      break;

    case 'timers':
      title = 'Heating schedule';
      break;

    default:
      title = 'Default page ERROR';
      break;
  }
  return title;
}
@customElement('main-app')
export class MainApp extends connect(store)(LitElement) {
  @query('#track')
  private track: any;

  @property({ type: String })
  appTitle = '';

  @property({ type: String })
  private _page = '';

  @property({ type: String })
  private _subPage = '';

  @property({ type: Boolean })
  private _drawerOpened = false;

  @property({ type: Boolean })
  private _snackbarOpened = false;

  @property({ type: String })
  private _message: string = '';

  @property({ type: String })
  private _serverName: string = '';

  @property({ type: String })
  private _authString: string = '';

  @property({ type: Boolean })
  private _loggedIn: boolean = true;

  @property({ type: Array<ZoneData> })
  private _zones: Array<ZoneData> = [];

  private startX: number = 0;

  private startY: number = 0;

  static get styles() {
    return [
      css`
        :host {
          display: block;
          --mdc-theme-primary: #4285f4;
        }

        mwc-drawer[open] mwc-top-app-bar {
          --mdc-top-app-bar-width: calc(100% - var(--mdc-drawer-width));
        }

        .parent {
          display: grid;
          grid-template-rows: 1fr auto;
        }

        .content {
          display: grid;
          grid-template-columns: minmax(0px, 0%) 1fr;
        }

        [main-title] {
          font-family: 'Pacifico';
          text-transform: lowercase;
          font-size: 30px;
          /* In the narrow layout, the toolbar is offset by the width of the
          drawer button, and the text looks not centered. Add a padding to
          match that button */
          padding-right: 44px;
        }

        .toolbar-list > a {
          display: grid;
          grid-template-rows: auto;
          text-decoration: none;
          font-size: 22px;
          font-weight: bold;
          padding: 8px;
        }

        .toolbar-list > a[selected] {
          background-color: #4285f4;
        }

        .toolbar-list > a:hover {
          background-color: #7413dc0c;
        }
        .menu-btn,
        .btn {
          background: none;
          border: none;
          fill: white;
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
          margin-top: 0px;
          margin-bottom: 0px;
          padding: 0px;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        .img-menu {
          display: block;
          max-width: 200px;
          max-height: 20px;
          width: auto;
          height: auto;
        }

        .img-welcome {
          display: inline;
          max-width: 200px;
          max-height: 30px;
        }

        @media print {
          .main-content {
            padding-top: 20px;
          }

          app-header {
            display: none;
          }

          app-header {
            position: relative;
          }

          footer {
            position: relative;
          }

          .photo {
            position: relative;
          }

          .username {
            position: relative;
          }

          aside {
            width: 0px;
          }

          mwc-top-app-bar,
          snack-bar,
          .toolbar-list,
          .menu-btn,
          .login {
            display: none !important;
          }
        }

        @page {
          size: A4;
          margin-top: 1cm;
          margin-bottom: 0cm;
        }
      `,
    ];
  }

  protected render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <mwc-drawer hasHeader type="dismissible" .open="${this._drawerOpened}">
        <span slot="title">Menu</span>
        <div>
          <nav class="toolbar-list">
            <a ?selected="${this._page === 'home'}" href="/#home">Home</a>
            <a ?selected="${this._page === 'welcome'}" href="/#welcome"
              >Welcome</a
            >
            <a ?selected="${this._page === 'timer'}" href="/#timers#-1"
              >All zones</a
            >
            ${this._zones.map((item, index) =>
              item.id === 0
                ? html``
                : html`<a
                    ?selected="${this._page === 'timers' &&
                    this._subPage === index.toString()}"
                    href="/#timers#${index}"
                    >${item.name}</a
                  >`
            )}
          </nav>
        </div>
        <!-- Header -->
        <div slot="appContent">
          <mwc-top-app-bar centerTitle>
            <div slot="title">${this.appTitle}</div>
            <mwc-button
              title="Menu"
              class="btn"
              slot="navigationIcon"
              @click="${this._menuButtonClicked}"
              >${menuIcon}</mwc-button
            >

            <div slot="actionItems">
              <mwc-button
                class="btn"
                title="Logout"
                slot="actionItems"
                @click=${this._logout}
                >${logOutIcon}</mwc-button
              >
              <mwc-button
                class="btn"
                title="Back"
                slot="actionItems"
                @click="${_BackButtonClicked}"
                >${arrowBackIcon}</mwc-button
              >
            </div>
          </mwc-top-app-bar>
          <div>
            <main id="track" role="main">
              <home-page
                class="page"
                ?active="${this._page === 'home'}"
                .zones="${this._zones}"
                .authString="${this._authString}"
                .serverName="${this._serverName}"
              ></home-page>
              <welcome-page
                class="page"
                ?active="${this._page === 'welcome'}"
              ></welcome-page>
              <timer-card
                class="page"
                ?active="${this._page === 'timers'}"
                .zones="${this._zones}"
                .zoneIndex="${this._subPage}"
                .allZones="${this._subPage === '-1'}"
                .authString="${this._authString}"
                .serverName="${this._serverName}"
              ></timer-card>
              <my-view404
                class="page"
                ?active="${this._page === 'view404'}"
              ></my-view404>

              <user-login
                class="page"
                ?active="${this._page === 'userLogin'}"
                .loggedIn="${this._loggedIn}"
              ></user-login>
            </main>
          </div>
        </div>
      </mwc-drawer>
      <snack-bar ?active="${this._snackbarOpened}">
        ${this._message}.
      </snack-bar>
      <pwa-install></pwa-install>
      <pwa-update offlineToastDuration="0" swpath="sw.js"></pwa-update>
    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  protected firstUpdated() {
    logUserIn();
    installRouter(location =>
      store.dispatch(navigate(decodeURIComponent(location.href)))
    );
    installOfflineWatcher(offline => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`, () =>
      store.dispatch(updateDrawerState(false))
    );
    this.track.addEventListener('touchstart', this.handleStart, false);
    this.track.addEventListener('touchend', this.handleEnd, false);
  }

  private _menuButtonClicked() {
    store.dispatch(updateDrawerState(!this._drawerOpened));
  }

  stateChanged(state: RootState) {
    this._page = state.app!.page;
    this._subPage = state.app!.subPage;
    this._message = state.app!.message;

    const usersState = userDataSelector(state);
    this._loggedIn = usersState!._loggedIn;
    this._authString = usersState!._authString;
    this._serverName = usersState!._serverName;

    if (this._loggedIn === false) {
      const newLocation = `/#userLogin`;
      window.history.pushState({}, '', newLocation);
      store.dispatch(navigate(decodeURIComponent(newLocation)));
    }

    this._snackbarOpened = state.app!.snackbarOpened;
    this._drawerOpened = state.app!.drawerOpened;
    this.appTitle = getTitle(this._page);

    const hgState = hgDataSelector(state);
    if (hgState?._data !== undefined) {
      this._zones = hgState._zones;
    }
  }

  handleStart(e: TouchEvent) {
    this.startX = e.changedTouches[0].pageX;
    this.startY = e.changedTouches[0].pageY;

    return true;
  }

  handleEnd(e: TouchEvent) {
    const deltaX = e.changedTouches[0].pageX - this.startX;
    const deltaY = Math.abs(e.changedTouches[0].pageY - this.startY);
    if (deltaX > 100 && deltaY < 100) {
      window.history.back();
    } else if (deltaX < -100 && deltaY < 100) {
      window.history.forward();
    }
  }

  _logout() {
    this._loggedIn = false;
    logUserOut();
    const newLocation = `/#userLogin`;
    window.history.pushState({}, '', newLocation);
    store.dispatch(navigate(decodeURIComponent(newLocation)));
  }
}
