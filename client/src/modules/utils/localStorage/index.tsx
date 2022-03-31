/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

function storeStateLocally(storageKey: string, value: any) {
  localStorage.setItem(storageKey, JSON.stringify(value));
}

function clearStateLocally(storageKey: string) {
  localStorage.removeItem(storageKey);
}

function getStateLocally(storageKey: string) {
  const value = localStorage.getItem(storageKey);

  if (value === null) {
    return null;
  }

  return JSON.parse(value);
}

export {storeStateLocally, clearStateLocally, getStateLocally};
