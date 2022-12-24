/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Action, ActionCreator } from 'redux';

export const USER_LOGGED_IN = 'USER_LOGGED_IN';

/* name – identifier for the district
id – numeric number for the district
streets – array of streets the district is responsible for
rounds – array of rounds the district is responsible for
notes – notes about the district
contact_details – name, phone number, email address….. */

export interface UsersState {
  _loggedIn: boolean;
  _blank: string;
}

export interface UserLoggedIn extends Action<'USER_LOGGED_IN'> {
  _loggedIn: boolean;
}

export type UsersAction = UserLoggedIn;

export const userDataSelectUser: ActionCreator<UserLoggedIn> = _loggedIn => ({
  type: USER_LOGGED_IN,
  _loggedIn,
});
