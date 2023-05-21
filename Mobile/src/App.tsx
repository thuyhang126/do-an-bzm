import React, {useEffect} from 'react';
import {Text, TextInput} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import {store, persistor} from './redux/store';
import Main from './screens/Main';

enableScreens();

interface TextWithDefaultProps extends Text {
  defaultProps?: {allowFontScaling?: boolean; autoCorrect?: boolean};
}

const App = () => {
  (Text as unknown as TextWithDefaultProps).defaultProps = {
    ...((Text as unknown as TextWithDefaultProps).defaultProps || {}),
    allowFontScaling: false,
  };
  (TextInput as unknown as TextWithDefaultProps).defaultProps = {
    ...((TextInput as unknown as TextWithDefaultProps).defaultProps || {}),
    allowFontScaling: false,
    autoCorrect: false,
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <Main />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
