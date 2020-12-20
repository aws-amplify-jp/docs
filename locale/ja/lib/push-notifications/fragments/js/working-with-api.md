`onNotification`, `onRegister` と `onNotificationOpen` イベントハンドラーを使用して、アプリ内のプッシュ通知を操作できます:

```javascript
// get the notification data when notification is received
PushNotification.onNotification((notification) => {
  // Note that the notification object structure is different from Android and IOS
  console.log('in app notification', notification);

  // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/push-notification-ios#finish)
  notification.finish(PushNotificationIOS.FetchResult.NoData);
});

// get the registration token
// This will only be triggered when the token is generated or updated.
PushNotification.onRegister((token) => {
  console.log('in app registration', token);
});

// get the notification data when notification is opened
PushNotification.onNotificationOpened((notification) => {
    console.log('the notification is opened', notification);
});
```

<amplify-callout>

`onRegister` ハンドラは、トークンがプッシュプロバイダー i によって生成または更新されたときにのみトリガーされます。 をクリックします。

</amplify-callout>

iOSのプッシュ通知の権限を自動的に要求しないようにアプリケーションを設定している場合は、 明示的に要求するには `requestIOSPermissions` メソッドを使用できます。

```javascript
// request iOS push notification permissions
PushNotification.requestIOSPermissions();

// request a subset of iOS push notification permissions
PushNotification.requestIOSPermissions({
  alert: true,
  badge: true,
  sound: false,
});
```