このコールは、ユーザーについて指定した情報を Amazon Pinpoint に送信します。認証されていないユーザーまたは認証されたユーザーの場合があります。

Amplify Authカテゴリから現在のユーザーのIDを取得できます。 Authカテゴリのドキュメントに追加およびセットアップが追加されていることを確認してください。

位置情報へのアクセスを求め、許可を受け取った場合は、 `AnalyticsUserProfileLocation` にも提供できます。


```dart

AnalyticsUserProfileLocation location = new AnalyticsUserProfileLocation();
    location.latitude = 47.606209;
    location.longitude = -122.332069;
    location.postalCode = "98122";
    location.city = "Seattle";
    location.region = "WA";
    location.country = "USA";

AnalyticsProperties properties = new AnalyticsProperties();
    properties.addStringProperty("phoneNumber", "+11234567890"); 
    properties.addIntProperty("age", 25); 

AnalyticsUserProfile userProfile = new AnalyticsUserProfile();
    userProfile.name = username;
    userProfile.email = "name@example.com";
    userProfile.location = location; 

Amplify.Analytics.identifyUser(userId: userId, userProfile: profile);
```