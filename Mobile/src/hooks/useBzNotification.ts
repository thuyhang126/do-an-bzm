import notifee from '@notifee/react-native';

const useBzNotification = () => {
  async function displayNotification(title: string, body: string) {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.requestPermission();

    const notificationId = notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });

    return notificationId;
  }

  return {
    displayNotification,
  };
};

export default useBzNotification;
