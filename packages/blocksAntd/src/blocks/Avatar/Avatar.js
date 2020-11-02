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
import { type, serializer } from '@lowdefy/helpers';
import { Avatar } from 'antd';
import Icon from '../Icon/Icon';

const AvatarBlock = ({ actions, blockId, methods, onClick, properties }) => {
  let propertiesIcon = serializer.copy(properties.icon);
  if (type.isString(propertiesIcon)) {
    propertiesIcon = { name: propertiesIcon };
  }
  return (
    <Avatar
      alt={properties.alt}
      id={blockId}
      gap={properties.gap}
      shape={properties.shape}
      size={properties.size}
      src={properties.src}
      onClick={
        onClick ||
        (() => methods.callAction({ action: 'onClick', hideLoading: properties.hideActionLoading }))
      }
      className={methods.makeCssClass([
        {
          backgroundColor:
            !properties.src &&
            (properties.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`),
          cursor: (onClick || actions.onClick) && 'pointer',
        },
        properties.style,
      ])}
      icon={
        propertiesIcon && (
          <Icon properties={{ size: properties.size, ...propertiesIcon }} methods={methods} />
        )
      }
    >
      {properties.content}
    </Avatar>
  );
};

AvatarBlock.defaultProps = blockDefaultProps;

export default AvatarBlock;
