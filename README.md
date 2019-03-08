# react-firestarter

> Firebase Components for React

[![NPM](https://img.shields.io/npm/v/react-firestarter.svg)](https://www.npmjs.com/package/react-firestarter) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.com/jmpolitzer/react-firestarter.svg?branch=master)](https://travis-ci.com/jmpolitzer/react-firestarter)
[![Coverage Status](https://coveralls.io/repos/github/jmpolitzer/react-firestarter/badge.svg?branch=master)](https://coveralls.io/github/jmpolitzer/react-firestarter?branch=master)

## Install

```bash
npm install --save react-firestarter
```

## Usage

### Authentication

```jsx
import React from 'react'

import { AuthProvider, Authenticator } from 'react-firestarter'

function Auth() {
  return (
    <AuthProvider fireauth={firebase.auth()}>
      <Authenticator onSuccess={onSuccess} onError={onError}>
        {({ isAuthenticated, signup, login, logout }) => {
          if (isAuthenticated) {
            return <button onClick={logout}>Logout</button>;
          } else {
            return (
              <>
                <button onClick={signup}>Signup</button>
                <button onClick={login}>Login</button>
              <>
            );
          }
        }}
      </Authenticator>
    </AuthProvider>
  );
}
```

### Firestore

```jsx
import React from 'react';

import { FirestoreProvider, Collection, Document } from 'react-firestarter';

function Firestore() {
  return (
    <FirestoreProvider firestore={firebase.firestore()}>
      <Collection name="todos">
        {({ isLoading, todos })} => {
          if (isLoading) {
            return <div>Loading</div>;
          } else {
            (
              todos.map(todo => {
                const { id, text } = todo;

                return (
                  <Document key={id} id={id} collection="todos">
                    {({ remove })} => {
                      <div>
                        <span>{text}</span>
                        <span>
                          <button onClick={remove}>X</button>
                        </span>
                      </div>
                    }
                  </Document>
                );
              });
            )
          }
        }
      </Collection>
    </FirestoreProvider>
  );
}
```

## Render Methods and Props

### AuthProvider

| Name          |  Type  | Default  | Description                                                                           |
| ------------- | :----: | :------: | ------------------------------------------------------------------------------------- |
| fireauth      | object | required | your own initialized firebase authentication module                                   |
| verifyByEmail |  bool  |   true   | if true, users will be required to verify their identity through an email upon signup |

### Authenticator

| Name      | Type | Default | Description                                      |
| --------- | :--: | :-----: | ------------------------------------------------ |
| onSuccess | func |         | function to call upon successful login or signup |
| onError   | func |         | function to call upon failed login or signup     |

An instantiated `Authenticator` will receive the following:

| Name               | Type | Description                                                                                              |
| ------------------ | :--: | -------------------------------------------------------------------------------------------------------- |
| isAuthenticated    | bool | lets us know if we have an authenticated user                                                            |
| isAuthenticating   | bool | lets us know if a user is in the process of authenticating                                               |
| redirectToReferrer | bool | useful for redirecting an authenticated user to original route they landed upon                          |
| getCurrentUser     | func | returns our authenticated user                                                                           |
| signup             | func | signs a user up; will send a verification email unless `verifyByEmail` is set to false in `AuthProvider` |
| login              | func | logs a user in; will not succeed if the user has not and should verify their identity via email          |
| logout             | func | logs a user out                                                                                          |

### FirestoreProvider

| Name      |  Type  | Default  | Description                                    |
| --------- | :----: | :------: | ---------------------------------------------- |
| firestore | object | required | your own initialized firebase firestore module |

### Collection

| Name     |  Type  | Default  | Description                                                                                     |
| -------- | :----: | :------: | ----------------------------------------------------------------------------------------------- |
| name     | string | required | name of the firestore collection                                                                |
| onError  |  func  |          | function to call upon successful get of collection; only required if `realtime` is set to false |
| realtime |  bool  |   true   | listen for realtime snapshot updates                                                            |

An instantiated `Collection` will receive the following:

| Name               | Type  | Description                                                                                                                                   |
| ------------------ | :---: | --------------------------------------------------------------------------------------------------------------------------------------------- |
| isLoading          | bool  | lets us know if our document collection is in the process of loading                                                                          |
| `[collectionName]` | array | collection of documents; contains an id and the result of `doc.data()`; the prop name is the same as the `name` prop passed into `Collection` |

### Document

| Name       |  Type  | Default  | Description                                                                               |
| ---------- | :----: | :------: | ----------------------------------------------------------------------------------------- |
| collection | string | required | name of the firestore collection the document belongs to                                  |
| id         |  any   |          | id of the document; required for all methods except `add`                                 |
| onSuccess  |  func  |          | function to call upon successful execution of `add`, `remove`, `update`                   |
| onError    |  func  |          | function to call upon failed execution of `add`, `remove`, `update`, and non-realtime get |
| realtime   |  bool  |  false   | listen for realtime snapshot updates                                                      |
| fetch      |  bool  |  false   | get a document or listen for realtime snapshot updates                                    |

An instantiated `Document` will receive the following:

| Name      |  Type  | Description                                                   |
| --------- | :----: | ------------------------------------------------------------- |
| add       |  func  | adds a document                                               |
| remove    |  func  | removes a document                                            |
| update    |  func  | updates a document                                            |
| doc       | object | a single document object; contains the result of `doc.data()` |
| isLoading |  bool  | lets us know if our document is in the process of loading     |

## License

MIT © [jmpolitzer](https://github.com/jmpolitzer)
