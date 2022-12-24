/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* eslint-disable import/extensions */
import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const NOTIFY_MESSAGE = 'NOTIFY_MESSAGE';
export interface AppActionUpdatePage extends Action<'UPDATE_PAGE'> {
  page: string;
}
export interface AppActionUpdateOffline extends Action<'UPDATE_OFFLINE'> {
  offline: boolean;
}
export interface AppActionUpdateDrawerState
  extends Action<'UPDATE_DRAWER_STATE'> {
  opened: boolean;
}
export interface AppActionOpenSnackbar extends Action<'OPEN_SNACKBAR'> {}
export interface AppActionCloseSnackbar extends Action<'CLOSE_SNACKBAR'> {}
export interface AppActionNotifyMessages extends Action<'NOTIFY_MESSAGE'> {
  message: string;
}
export type AppAction =
  | AppActionUpdatePage
  | AppActionUpdateOffline
  | AppActionUpdateDrawerState
  | AppActionOpenSnackbar
  | AppActionCloseSnackbar
  | AppActionNotifyMessages;

type ThunkResult = ThunkAction<void, RootState, undefined, AppAction>;

const updatePage: ActionCreator<AppActionUpdatePage> = (page: string) => ({
  type: UPDATE_PAGE,
  page,
});

export const updateDrawerState: ActionCreator<AppActionUpdateDrawerState> = (
  opened: boolean
) => ({
  type: UPDATE_DRAWER_STATE,
  opened,
});

const loadPage: ActionCreator<ThunkResult> = (page: string) => dispatch => {
  switch (page) {
    case 'home':
      import('../components/home-page');
      break;

    case 'welcome':
      import('../components/welcome-page').then(() => {
        // Put code in here that you want to run every time when
        // navigating to view1 after my-view1 is loaded.
      });
      break;

    case 'userLogin':
      import('../components/user-login');
      break;

    default:
      // eslint-disable-next-line no-param-reassign
      page = 'view404';
      import('../components/my-view404');
  }

  dispatch(updatePage(page));
};

export const navigate: ActionCreator<ThunkResult> =
  (path: string) => dispatch => {
    // Extract the page name from path.
    const parts = path.split('#');
    const page = parts.length === 1 ? 'welcome' : parts[1];

    // Any other info you might want to extract from the path (like page type),
    // you can do here
    dispatch(loadPage(page));

    // Close the drawer - in case the *path* change came from a link in the drawer.
    if (window.matchMedia('(max-width: 700px)').matches) {
      dispatch(updateDrawerState(false));
    }
  };

let snackbarTimer: number;

export const showSnackbar: ActionCreator<ThunkResult> = () => dispatch => {
  dispatch({
    type: OPEN_SNACKBAR,
  });
  window.clearTimeout(snackbarTimer);
  snackbarTimer = window.setTimeout(
    () => dispatch({ type: CLOSE_SNACKBAR }),
    3000
  );
};

export const notifyMessage: ActionCreator<ThunkResult> =
  (message: string) => dispatch => {
    dispatch(showSnackbar());
    dispatch({
      type: NOTIFY_MESSAGE,
      message,
    });
  };

export const updateOffline: ActionCreator<ThunkResult> =
  (offline: boolean) => (dispatch, getState) => {
    // Show the snackbar only if offline status changes.
    if (offline !== getState().app!.offline) {
      dispatch(showSnackbar());
    }
    const message: string = `You are now ${offline ? 'offline' : 'online'}`;

    dispatch({
      type: NOTIFY_MESSAGE,
      message,
    });
  };
