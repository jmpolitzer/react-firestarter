# react-firestarter

> Firebase Components for React

[![NPM](https://img.shields.io/npm/v/react-firestarter.svg)](https://www.npmjs.com/package/react-firestarter) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-firestarter
```

## Usage

```jsx
import React from 'react'

import { AuthProvider, Authenticator } from 'react-firestarter'

function Auth() {
  return () {
    <AuthProvider fireauth={firebase.auth()}>
      <Authenticator onSuccess={onSuccess} onError={onError}>
        {({ isAuthenticated, signup, login, logout }) => {
          if (isAuthenticated) {
            return <div onClick={logout}>Logout</div>;
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
  }
}

...
```

## License

MIT © [jmpolitzer](https://github.com/jmpolitzer)
