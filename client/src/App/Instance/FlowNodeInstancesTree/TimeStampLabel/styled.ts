/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

import styled, {css} from 'styled-components';

type TimeStampProps = {
  isSelected?: boolean;
};

const TimeStamp = styled.span<TimeStampProps>`
  ${({theme, isSelected}) => {
    const colors = theme.colors.flowNodeInstancesTree.timeStampLabel;

    return css`
      margin-left: 14px;
      padding: 2px 4px;
      color: ${theme.colors.text02};
      background: ${isSelected ? colors.backgroundColor : theme.colors.label};
      font-size: 11px;
      border-radius: 2px;
    `;
  }}
`;

export {TimeStamp};
