/**
 * @format
 */

import {AppRegistry} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import App from './src/App';
import {name as appName} from './app.json';

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification} = detail;

  if (type === EventType.ACTION_PRESS) {
    await notifee.cancelNotification(notification.id);
  }
});

AppRegistry.registerComponent(appName, () => App);
