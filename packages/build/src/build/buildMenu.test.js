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

import buildMenu from './buildMenu';
import testContext from '../test/testContext';

const mockLogWarn = jest.fn();

const logger = {
  warn: mockLogWarn,
};

const context = testContext({ logger });

beforeEach(() => {
  mockLogWarn.mockReset();
});

test('buildMenu menus exist', async () => {
  const components = {
    menus: [
      {
        id: 'my_menu',
        links: [
          {
            id: 'menu_page_1',
            properties: {
              title: 'Page 1',
            },
            type: 'MenuLink',
            pageId: 'page_1',
          },
          {
            id: 'menu_page_2',
            properties: {
              title: 'Page 2',
            },
            type: 'MenuLink',
            pageId: 'page_2',
          },
          {
            id: 'menu_external',
            properties: {
              title: 'External',
            },
            type: 'MenuLink',
            url: 'www.lowdefy.com',
          },
        ],
      },
    ],
    pages: [
      {
        id: 'page:page_1',
        pageId: 'page_1',
        auth: { public: true },
      },
      {
        id: 'page:page_2',
        pageId: 'page_2',
        auth: { public: false },
      },
    ],
  };
  const res = await buildMenu({ components, context });
  expect(res).toEqual({
    menus: [
      {
        id: 'menu:my_menu',
        menuId: 'my_menu',
        links: [
          {
            id: 'menuitem:my_menu:menu_page_1',
            menuItemId: 'menu_page_1',
            properties: {
              title: 'Page 1',
            },
            type: 'MenuLink',
            pageId: 'page_1',
            auth: { public: true },
          },
          {
            id: 'menuitem:my_menu:menu_page_2',
            menuItemId: 'menu_page_2',
            properties: {
              title: 'Page 2',
            },
            type: 'MenuLink',
            pageId: 'page_2',
            auth: { public: false },
          },
          {
            id: 'menuitem:my_menu:menu_external',
            menuItemId: 'menu_external',
            properties: {
              title: 'External',
            },
            type: 'MenuLink',
            url: 'www.lowdefy.com',
            auth: { public: true },
          },
        ],
      },
    ],
    pages: [
      {
        id: 'page:page_1',
        pageId: 'page_1',
        auth: { public: true },
      },
      {
        id: 'page:page_2',
        pageId: 'page_2',
        auth: { public: false },
      },
    ],
  });
});

test('buildMenu nested menus', async () => {
  const components = {
    menus: [
      {
        id: 'my_menu',
        links: [
          {
            id: 'group',
            type: 'MenuGroup',
            links: [
              {
                id: 'menu_page_1',
                properties: {
                  title: 'Page 1',
                },
                type: 'MenuLink',
                pageId: 'page_1',
              },
            ],
          },
        ],
      },
    ],
    pages: [
      {
        id: 'page:page_1',
        pageId: 'page_1',
        auth: { public: true },
      },
    ],
  };
  const res = await buildMenu({ components, context });
  expect(res).toEqual({
    menus: [
      {
        id: 'menu:my_menu',
        menuId: 'my_menu',
        links: [
          {
            id: 'menuitem:my_menu:group',
            menuItemId: 'group',
            type: 'MenuGroup',
            auth: { public: true },
            links: [
              {
                id: 'menuitem:my_menu:menu_page_1',
                menuItemId: 'menu_page_1',
                properties: {
                  title: 'Page 1',
                },
                type: 'MenuLink',
                pageId: 'page_1',
                auth: { public: true },
              },
            ],
          },
        ],
      },
    ],
    pages: [
      {
        id: 'page:page_1',
        pageId: 'page_1',
        auth: { public: true },
      },
    ],
  });
});

test('buildMenu default menu', async () => {
  const components = {
    pages: [
      {
        id: 'page:page_1',
        pageId: 'page_1',
        auth: { public: true },
      },
      {
        id: 'page:page_2',
        pageId: 'page_2',
        auth: { public: true },
      },
      {
        id: 'page:page_3',
        pageId: 'page_3',
        auth: { public: true },
      },
    ],
  };
  const res = await buildMenu({ components, context });
  expect(res).toEqual({
    menus: [
      {
        id: 'menu:default',
        menuId: 'default',
        links: [
          {
            id: 'menuitem:default:0',
            menuItemId: '0',
            type: 'MenuLink',
            pageId: 'page_1',
            auth: { public: true },
          },
          {
            id: 'menuitem:default:1',
            menuItemId: '1',
            type: 'MenuLink',
            pageId: 'page_2',
            auth: { public: true },
          },
          {
            id: 'menuitem:default:2',
            menuItemId: '2',
            type: 'MenuLink',
            pageId: 'page_3',
            auth: { public: true },
          },
        ],
      },
    ],
    pages: [
      {
        id: 'page:page_1',
        pageId: 'page_1',
        auth: { public: true },
      },
      {
        id: 'page:page_2',
        pageId: 'page_2',
        auth: { public: true },
      },
      {
        id: 'page:page_3',
        pageId: 'page_3',
        auth: { public: true },
      },
    ],
  });
});

test('buildMenu no menu or pages exist', async () => {
  const components = {};
  const res = await buildMenu({ components, context });
  expect(res).toEqual({
    menus: [
      {
        id: 'menu:default',
        menuId: 'default',
        links: [],
      },
    ],
  });
});

test('buildMenu page does not exist', async () => {
  const components = {
    menus: [
      {
        id: 'my_menu',
        links: [
          {
            id: 'menu_page_1',
            type: 'MenuLink',
            pageId: 'page_1',
          },
        ],
      },
    ],
    pages: [],
  };
  const res = await buildMenu({ components, context });
  expect(res).toEqual({
    menus: [
      {
        id: 'menu:my_menu',
        menuId: 'my_menu',
        links: [],
      },
    ],
    pages: [],
  });
  expect(mockLogWarn.mock.calls).toEqual([
    ['Page "page_1" referenced in menu link "menu_page_1" not found.'],
  ]);
});

test('buildMenu page does not exist, nested', async () => {
  const components = {
    menus: [
      {
        id: 'my_menu',
        links: [
          {
            id: 'MenuGroup1',
            type: 'MenuGroup',
            links: [
              {
                id: 'menu_page_1',
                type: 'MenuLink',
                pageId: 'page_1',
              },
            ],
          },
          {
            id: 'MenuGroup2',
            type: 'MenuGroup',
            links: [
              {
                id: 'MenuGroup3',
                type: 'MenuGroup',
                links: [
                  {
                    id: 'menu_page_2',
                    type: 'MenuLink',
                    pageId: 'page_2',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    pages: [],
  };
  const res = await buildMenu({ components, context });
  expect(res).toEqual({
    menus: [
      {
        id: 'menu:my_menu',
        menuId: 'my_menu',
        links: [
          {
            id: 'menuitem:my_menu:MenuGroup1',
            menuItemId: 'MenuGroup1',
            type: 'MenuGroup',
            auth: { public: true },
            links: [],
          },
          {
            id: 'menuitem:my_menu:MenuGroup2',
            menuItemId: 'MenuGroup2',
            type: 'MenuGroup',
            auth: { public: true },
            links: [
              {
                id: 'menuitem:my_menu:MenuGroup3',
                menuItemId: 'MenuGroup3',
                type: 'MenuGroup',
                auth: { public: true },
                links: [],
              },
            ],
          },
        ],
      },
    ],
    pages: [],
  });
  expect(mockLogWarn.mock.calls).toEqual([
    ['Page "page_1" referenced in menu link "menu_page_1" not found.'],
    ['Page "page_2" referenced in menu link "menu_page_2" not found.'],
  ]);
});

test('buildMenu pages not array, menu exists', async () => {
  const components = {
    menus: [
      {
        id: 'my_menu',
        links: [
          {
            id: 'menu_external',
            properties: {
              title: 'Page 1',
            },
            type: 'MenuLink',
            url: 'www.lowdefy.com',
          },
        ],
      },
    ],
    pages: 'pages',
  };
  const res = await buildMenu({ components, context });
  expect(res).toEqual({
    menus: [
      {
        id: 'menu:my_menu',
        menuId: 'my_menu',
        links: [
          {
            id: 'menuitem:my_menu:menu_external',
            menuItemId: 'menu_external',
            properties: {
              title: 'Page 1',
            },
            type: 'MenuLink',
            url: 'www.lowdefy.com',
            auth: { public: true },
          },
        ],
      },
    ],
    pages: 'pages',
  });
});

test('buildMenu pages not array, no menu', async () => {
  const components = {
    pages: 'pages',
  };
  const res = await buildMenu({ components, context });
  expect(res).toEqual({
    menus: [
      {
        id: 'menu:default',
        menuId: 'default',
        links: [],
      },
    ],
    pages: 'pages',
  });
});
