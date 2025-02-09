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

// eslint-disable-next-line no-unused-vars
import { gql } from 'apollo-server';
import runTestQuery from '../../../test/runTestQuery';
import { Issuer } from 'openid-client';

import openIdLogoutUrl from './openIdLogoutUrl';

jest.mock('openid-client');

// Controller mocks
const mockLogoutUrl = jest.fn(({ idToken }) => idToken);
const getController = jest.fn((name) => {
  if (name === 'openId') {
    return {
      logoutUrl: mockLogoutUrl,
    };
  }
});

// OpenID mocks
const mockEndSessionUrl = jest.fn(
  ({ id_token_hint, post_logout_redirect_uri }) => `${id_token_hint}:${post_logout_redirect_uri}`
);

const mockClient = jest.fn(() => ({
  endSessionUrl: mockEndSessionUrl,
}));

Issuer.discover = jest.fn(() => ({
  Client: mockClient,
}));

const secrets = {
  OPENID_CLIENT_ID: 'OPENID_CLIENT_ID',
  OPENID_CLIENT_SECRET: 'OPENID_CLIENT_SECRET',
  OPENID_DOMAIN: 'OPENID_DOMAIN',
  JWT_SECRET: 'JWT_SECRET',
};

const mockLoadComponent = jest.fn(() => ({
  auth: {
    openId: {
      logoutFromProvider: true,
      logoutRedirectUri: 'logoutRedirectUri',
    },
  },
}));
const loaders = {
  component: {
    load: mockLoadComponent,
  },
};
const getSecrets = jest.fn(() => secrets);
const setHeader = jest.fn();

beforeEach(() => {
  setHeader.mockReset();
});

test('openIdLogoutUrl resolver', async () => {
  const res = await openIdLogoutUrl(
    null,
    { openIdLogoutUrlInput: { idToken: 'idToken' } },
    { getController }
  );
  expect(res).toEqual('idToken');
});

test('openIdLogoutUrl graphql', async () => {
  const GET_LOGOUT = gql`
    query openIdLogoutUrl($openIdLogoutUrlInput: OpenIdLogoutUrlInput!) {
      openIdLogoutUrl(openIdLogoutUrlInput: $openIdLogoutUrlInput)
    }
  `;
  const res = await runTestQuery({
    gqlQuery: GET_LOGOUT,
    variables: { openIdLogoutUrlInput: { idToken: 'idToken' } },
    loaders,
    getSecrets,
    setHeader,
  });
  expect(res.errors).toBe(undefined);
  expect(res.data).toEqual({
    openIdLogoutUrl: 'idToken:logoutRedirectUri',
  });
  expect(setHeader.mock.calls).toEqual([
    ['Set-Cookie', 'authorization=; Max-Age=0; Path=/api/graphql; HttpOnly; Secure; SameSite=Lax'],
  ]);
});
