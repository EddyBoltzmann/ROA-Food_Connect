import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@store/index';
import AppNavigator from '@navigation/AppNavigator';
import { LoadingSpinner } from '@components';
import { lightTheme } from '@utils/theme';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner theme={lightTheme} text="Loading..." />} persistor={persistor}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;