/*
  Copyright 2020 Lowdefy, Inc

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

import React from 'react';
import { blockDefaultProps } from '@lowdefy/block-tools';
import { mergeObjects } from '@lowdefy/helpers';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Content from '../Content/Content';
import Layout from '../Layout/Layout';

const PageHCF = ({ blockId, content, properties, methods }) => (
  <Layout
    blockId={blockId}
    methods={methods}
    properties={{ style: mergeObjects([{ minHeight: '100vh' }, properties.style]) }}
    content={{
      content: () => (
        <>
          {content.header && (
            <Header
              properties={properties.header}
              methods={methods}
              content={{
                content: () => content.header(),
              }}
            />
          )}
          {content.content && (
            <Content
              properties={properties.content}
              methods={methods}
              content={{
                content: () => content.content(),
              }}
            />
          )}
          {content.footer && (
            <Footer
              properties={properties.footer}
              methods={methods}
              content={{
                content: () => content.footer(),
              }}
            />
          )}
        </>
      ),
    }}
  />
);

PageHCF.defaultProps = blockDefaultProps;

export default PageHCF;
