/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

import styled, {css} from 'styled-components';

const Copyright = styled.div`
  ${({theme}) => {
    const opacity = theme.opacity.modules.copyright;

    return css`
      color: ${theme.colors.text02};
      opacity: ${opacity};
      font-size: 12px;
    `;
  }}
`;

export {Copyright};
