import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/state/store';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <Provider store={store}>
      <RootNavigator isSignedIn={isSignedIn} />
    </Provider>
  );
}