/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { gql } from '@apollo/client';

const GET_LOGOUT = gql`
  query openIdLogoutUrl($openIdLogoutUrlInput: OpenIdLogoutUrlInput!) {
    openIdLogoutUrl(openIdLogoutUrlInput: $openIdLogoutUrlInput)
  }
`;

function createLogout(lowdefy) {
  async function logout() {
    try {
      lowdefy.user = {};
      lowdefy.localStorage.setItem(`idToken`, '');
      const { data } = await lowdefy.client.query({
        query: GET_LOGOUT,
        fetchPolicy: 'network-only',
        variables: {
          openIdLogoutUrlInput: {
            idToken: '',
          },
        },
      });
      // TODO: should we call link??
      lowdefy.window.location.href = data.openIdLogoutUrl || lowdefy.window.location.origin;
    } catch (error) {
      throw new Error(error);
    }
  }

  return logout;
}

export default createLogout;
