AWS Android SDK for Pinpoint を使用して、使用状況のデータやイベントを Amazon Pinpoint に報告できます。 セッション時間、ユーザーの購買行動、サインインの試行、必要なカスタムイベントタイプなどの情報を取得するためにイベントを報告できます。

アプリケーションがイベントを報告した後、Amazon Pinpoint コンソールで分析を表示できます。 format@@0 ページのチャートには、ユーザーの行動のさまざまな側面のメトリックが表示されます。 詳細については、「Amazon Pinpoint User Guide」の「Amazon Pinpoint Analyticsのグラフ参照」を参照してください。

Amazon Pinpoint以外でイベントデータを分析して保存するには、Amazon Pinpointを設定して、Amazon Kinesisにデータをストリーミングすることができます。 詳細については、次を参照してください: Kinesis に Amazon Pinpoint イベントをストリーミングする.

AWS Android SDK for Pinpoint で `PinpointManager` を使用します。 Amazon Pinpoint APIを呼び出して、次の種類のイベントを報告できます。

## セッションイベント

ユーザーがいつ、どのくらいの頻度でアプリを開いて閉じるかを示します。

アプリケーションがセッション イベントを報告した後、Amazon Pinpoint コンソールの Analytics ページを使用して、セッションのチャートを表示します。 毎日のアクティブエンドポイント、7日間の保持率など。

<div id="java" class="tab-content current">

```java
import com.amazonaws.mobileconnectors.pinpoint.analytics.SessionClient;

/**
 * Call this method to start and stop a session and submit events recorded
 * in the current session.
 */
public void logSession() {
    SessionClient sessionClient = pinpointManager.getSessionClient();
    sessionClient.startSession();
    sessionClient.stopSession();
    pinpointManager.getAnalyticsClient().submitEvents();
}
```
</div>

## カスタムイベント

カスタムイベントタイプを割り当てることで定義する非標準イベントです。カスタム属性とメトリックをカスタムイベントに追加できます。

コンソールの Analytics ページで、format@@0 タブには、アプリケーションによって報告されるすべてのカスタムイベントのメトリックが表示されます。 Amazon Pinpoint コンソールでカスタム使用イベントデータのグラフを使用します。 Amazon Pinpoint Funnel Analyticsを使用して設計したモデルとユーザの行動がどのように連携するかを視覚化したり、データをストリーミングして詳細な分析を行ったりします。

Amazon Pinpoint カスタム分析をアプリに実装するには、次の手順を実行します。

```java
import com.amazonaws.mobileconnectors.pinpoint.analytics.AnalyticsEvent;

/**
* Call this method to log a custom event to the analytics client.
*/
public void logEvent() {
   final AnalyticsEvent event =
       pinpointManager.getAnalyticsClient().createEvent("EventName")
           .withAttribute("DemoAttribute1", "DemoAttributeValue1")
           .withAttribute("DemoAttribute2", "DemoAttributeValue2")
           .withMetric("DemoMetric1", Math.random());
   pinpointManager.getAnalyticsClient().recordEvent(event);
   pinpointManager.getAnalyticsClient().submitEvents();
}
```

Build, run, and use your app. Then, view your custom events on the Events tab of the Amazon Pinpoint console (choose Analytics>Events). Look for the name of your event in the Events menu.


## 収益化イベント

アプリケーションによって生成された収益とユーザーによって購入されたアイテム数を報告します。

format@@0ページに、format@@1タブに、収益、支払いユーザー、売却ユニットなどのチャートが表示されます。

以下の手順を使用して、アプリケーションの Amazon Pinpoint 収益化分析を実装します。

```java
import com.amazonaws.mobileconnectors.pinpoint.analytics.monetization.AmazonMonetizationEventBuilder;

/**
* Call this method to log a monetized event to the analytics client.
*/
public void logMonetizationEvent() {
    final AnalyticsEvent event =
       AmazonMonetizationEventBuilder.create(pinpointManager.getAnalyticsClient())
           .withCurrency("USD")
           .withItemPrice(10.00)
           .withProductId("DEMO_PRODUCT_ID")
           .withQuantity(1.0)
           .withProductId("DEMO_TRANSACTION_ID").build();
    pinpointManager.getAnalyticsClient().recordEvent(event);
    pinpointManager.getAnalyticsClient().submitEvents();
}
```


## 認証イベント
ユーザーがアプリケーションでどのくらいの頻度で認証するかを示します。

format@@0ページでは、format@@1タブにサインイン、サインアップ、および認証失敗のチャートが表示されます。

ユーザーがアプリケーションでどのくらい頻繁に認証するかを知るには、アプリケーションコードを更新して、Amazon Pinpointが次の標準イベントタイプを認証するようにします。

* `_userauth.sign_in`
* `_userauth.sign_up`
* `_userauth.auth_fail`

次のいずれかを実行することで認証イベントを報告できます:

**Amazon Cognitoのユーザープールでのユーザー登録とサインインの管理**

Amazon Cognito user pools are user directories that make it easier to add sign-up and sign-in to your app. As users authenticate with your app, Amazon Cognito reports authentication events to Amazon Pinpoint. For more information, see [Using Amazon Pinpoint Analytics with Amazon Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-pinpoint-integration.html) in the _Amazon Cognito Developer Guide_. Also update awsconfiguration.json by adding the `pinpoint appid` under CognitoUserPool.
```json
    "CognitoUserPool": {
        "Default": {
            "PoolId": "<poolid>",
            "AppClientId": "<appclientid>",
            "Region": "<region>",
            "PinpointAppId": "<pinpointappid>"
        }
    }
```

**AWS Mobile SDK for Android が提供する Amazon Pinpoint クライアントを使用して認証イベントを報告します。**

Amazon Cognitoユーザープールを使用したくない場合は、 次の例に示すように、Amazon Pinpoint クライアントを使用して認証イベントを記録および送信できます。 これらの例では、イベントタイプは `_userauth.sign_in`に設定されていますが、任意の認証イベントタイプを置き換えることができます。


```java
import com.amazonaws.mobileconnectors.pinpoint.analytics.AnalyticsEvent;

/**
* Call this method to log an authentication event to the analytics client.
*/
public void logAuthenticationEvent() {
   final AnalyticsEvent event =
       pinpointManager.getAnalyticsClient().createEvent("_userauth.sign_in");
   pinpointManager.getAnalyticsClient().recordEvent(event);
   pinpointManager.getAnalyticsClient().submitEvents();
}
```

## カスタム App イベント

Instrument your code to capture app usage event information, including attributes you define.  Use graphs of your custom usage event data  in the Amazon Pinpoint console. Visualize how your users' behavior aligns with a model you design using [Amazon Pinpoint Funnel Analytics](https://docs.aws.amazon.com/pinpoint/latest/userguide/analytics-funnels.html), or use [stream the data](https://docs.aws.amazon.com/pinpoint/latest/userguide/analytics-streaming.html) for deeper analysis.

Amazon Pinpoint カスタム分析をアプリに実装するには、次の手順を実行します。

```java
import com.amazonaws.mobileconnectors.pinpoint.analytics.AnalyticsEvent;

/**
* Call this method to log a custom event to the analytics client.
*/
public void logEvent() {
   final AnalyticsEvent event =
       pinpointManager.getAnalyticsClient().createEvent("EventName")
           .withAttribute("DemoAttribute1", "DemoAttributeValue1")
           .withAttribute("DemoAttribute2", "DemoAttributeValue2")
           .withMetric("DemoMetric1", Math.random());

   pinpointManager.getAnalyticsClient().recordEvent(event);
}
```

Build, run, and use your app. Then, view your custom events on the `Events` tab of the Amazon Pinpoint console (choose `Analytics`>`Events`). Look for the name of your event in the `Events` menu.

## 収益分析を有効にする

Amazon Pinpointは収益化イベントデータの収集をサポートしています。次の手順を使用して、アプリを通じて購入に関する やデザイン分析を行ってください。

```java
import com.amazonaws.mobileconnectors.pinpoint.analytics.monetization.AmazonMonetizationEventBuilder;

/**
* Call this method to log a monetized event to the analytics client.
*/
public void logMonetizationEvent() {
    final AnalyticsEvent event =
       AmazonMonetizationEventBuilder.create(pinpointManager.getAnalyticsClient())
           .withCurrency("USD")
           .withItemPrice(10.00)
           .withProductId("DEMO_PRODUCT_ID")
           .withQuantity(1.0)
           .withProductId("DEMO_TRANSACTION_ID").build();
    pinpointManager.getAnalyticsClient().recordEvent(event);
}
```


## イベントの摂取制限

AWS Android SDK for Pinpoint と Amazon Pinpoint イベント API を使用したイベントの取り込みに適用される制限は [こちら](https://docs.aws.amazon.com/pinpoint/latest/developerguide/limits.html#limits-events) にあります。

## アプリケーションでセッションを管理する

ユーザーがアプリを使用すると、アプリセッションに関する情報が Amazon Pinpoint に報告されます。 セッション開始時間、セッション終了時間、セッション中に発生するイベントなど。 Android アプリケーションからこの情報を報告する アプリがフォアグラウンドに入り、ユーザーの Android デバイスの背景にイベントを処理するメソッドを含める必要があります。

### ライフサイクルマネージャーの例

The following example class, `AbstractApplicationLifeCycleHelper`, implements the `Application.ActivityLifecycleCallbacks` interface to track when the application enters the foreground or background, among other states. Add this class to your app, or use it as an example for how to update your code:

```java
package com.amazonaws.mobile.util;

import android.app.Activity;
import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;

import java.util.WeakHashMap;

/**
 * Aids in determining when your application has entered or left the foreground.
 * The constructor registers to receive Activity lifecycle events and also registers a
 * broadcast receiver to handle the screen being turned off.  Abstract methods are
 * provided to handle when the application enters the background or foreground.
 * Any activity lifecycle callbacks can easily be overridden if additional handling
 * is needed. Just be sure to call through to the super method so that this class
 * will still behave as intended.
 **/
public abstract class AbstractApplicationLifeCycleHelper implements Application.ActivityLifecycleCallbacks {
    private static final String LOG_TAG = AbstractApplicationLifeCycleHelper.class.getSimpleName();
    private static final String ACTION_SCREEN_OFF = "android.intent.action.SCREEN_OFF";
    private boolean inForeground = false;
    /** Tracks the lifecycle of activities that have not stopped (including those restarted). */
    private WeakHashMap<Activity, String> activityLifecycleStateMap = new WeakHashMap<>();

    /**
     * Constructor. Registers to receive activity lifecycle events.
     * @param application The Android Application class.
     */
    public AbstractApplicationLifeCycleHelper(final Application application) {
        application.registerActivityLifecycleCallbacks(this);
        final ScreenOffReceiver screenOffReceiver = new ScreenOffReceiver();
        application.registerReceiver(screenOffReceiver, new IntentFilter(ACTION_SCREEN_OFF));
    }

    @Override
    public void onActivityCreated(final Activity activity, final Bundle bundle) {
        Log.d(LOG_TAG, "onActivityCreated " + activity.getLocalClassName());
        handleOnCreateOrOnStartToHandleApplicationEnteredForeground();
        activityLifecycleStateMap.put(activity, "created");
    }

    @Override
    public void onActivityStarted(final Activity activity) {
        Log.d(LOG_TAG, "onActivityStarted " + activity.getLocalClassName());
        handleOnCreateOrOnStartToHandleApplicationEnteredForeground();
        activityLifecycleStateMap.put(activity, "started");
    }

    @Override
    public void onActivityResumed(final Activity activity) {
        Log.d(LOG_TAG, "onActivityResumed " + activity.getLocalClassName());
        activityLifecycleStateMap.put(activity, "resumed");
    }

    @Override
    public void onActivityPaused(final Activity activity) {
        Log.d(LOG_TAG, "onActivityPaused " + activity.getLocalClassName());
        activityLifecycleStateMap.put(activity, "paused");
    }

    @Override
    public void onActivityStopped(final Activity activity) {
        Log.d(LOG_TAG, "onActivityStopped " + activity.getLocalClassName());
        // When the activity is stopped, we remove it from the lifecycle state map since we
        // no longer consider it keeping a session alive.
        activityLifecycleStateMap.remove(activity);
    }

    @Override
    public void onActivitySaveInstanceState(final Activity activity, final Bundle outState) {
        Log.d(LOG_TAG, "onActivitySaveInstanceState " + activity.getLocalClassName());
    }

    @Override
    public void onActivityDestroyed(final Activity activity) {
        Log.d(LOG_TAG, "onActivityDestroyed " + activity.getLocalClassName());
        // Activity should not be in the activityLifecycleStateMap any longer.
        if (activityLifecycleStateMap.containsKey(activity)) {
            Log.wtf(LOG_TAG, "Destroyed activity present in activityLifecycleMap!?");
            activityLifecycleStateMap.remove(activity);
        }
    }

    /**
     * Call this method when your Application trims memory.
     * @param level the level passed through from Application.onTrimMemory().
     */
    public void handleOnTrimMemory(final int level) {
        Log.d(LOG_TAG, "onTrimMemory " + level);
        // If no activities are running and the app has gone into the background.
        if (level >= Application.TRIM_MEMORY_UI_HIDDEN) {
            checkForApplicationEnteredBackground();
        }
    }

    class ScreenOffReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            checkForApplicationEnteredBackground();
        }
    }

    /**
     * Called back when your application enters the Foreground.
     */
    protected abstract void applicationEnteredForeground();

    /**
     * Called back when your application enters the Background.
     */
    protected abstract void applicationEnteredBackground();

    /**
     * Called from onActivityCreated and onActivityStarted to handle when the application enters
     * the foreground.
     */
    private void handleOnCreateOrOnStartToHandleApplicationEnteredForeground() {
        // if nothing is in the activity lifecycle map indicating that we are likely in the background, and the flag
        // indicates we are indeed in the background.
        if (activityLifecycleStateMap.size() == 0 && !inForeground) {
            inForeground = true;
            // Since this is called when an activity has started, we now know the app has entered the foreground.
            applicationEnteredForeground();
        }
    }

    private void checkForApplicationEnteredBackground() {
        ThreadUtils.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                // If the App is in the foreground and there are no longer any activities that have not been stopped.
                if ((activityLifecycleStateMap.size() == 0) && inForeground) {
                    inForeground = false;
                    applicationEnteredBackground();
                }
            }
        });
    }
}
```

### セッションイベントの報告

After you include the `AbstractApplicationLifeCycleHelper` class, implement the two abstract methods, `applicationEnteredForeground` and `applicationEnteredBackground`, in the `Application` class. These methods enable your app to report the following information to Amazon Pinpoint:

1. セッション開始時刻(アプリがフォアグラウンドに入ったとき)。

2. セッション終了時刻(アプリがバックグラウンドに入ったとき)。

3. アプリセッション中に発生するイベント (収益化イベントなど) この情報はアプリがバックグラウンドに入ったときに通知されます。

The following example shows how to implement `applicationEnteredForeground` and `applicationEnteredBackground`. It also shows how to call `handleOnTrimMemory` from inside the `onTrimMemory` function of the `Application` class: 

<div id="java" class="tab-content current">

```java
import com.amazonaws.mobileconnectors.pinpoint.PinpointConfiguration;
import com.amazonaws.mobileconnectors.pinpoint.PinpointManager;

public class Application extends MultiDexApplication {
    public static PinpointManager pinpointManager;
    private AbstractApplicationLifeCycleHelper applicationLifeCycleHelper;

    @Override
    public void onCreate() {
        super.onCreate();

        // . . .
           
        // The Helper registers itself to receive application lifecycle events when it is constructed.
        // A reference is kept here in order to pass through the onTrimMemory() call from
        // the Application class to properly track when the application enters the background.
        applicationLifeCycleHelper = new AbstractApplicationLifeCycleHelper(this) {
            @Override
            protected void applicationEnteredForeground() {
                Application.pinpointManager.getSessionClient().startSession();
                // handle any events that should occur when your app has come to the foreground...
            }

            @Override
            protected void applicationEnteredBackground() {
                Log.d(LOG_TAG, "Detected application has entered the background.");
                Application.pinpointManager.getSessionClient().stopSession();
                Application.pinpointManager.getAnalyticsClient().submitEvents();
                // handle any events that should occur when your app has gone into the background...
            }
        };
    }

    private void updateGCMToken() {
        try {
            final String gcmToken = InstanceID.getInstance(this).getToken(
                    "YOUR_SENDER_ID",
                    GoogleCloudMessaging.INSTANCE_ID_SCOPE
            );
            Application.pinpointManager.getNotificationClient().registerGCMDeviceToken(gcmToken);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onTrimMemory(final int level) {
        Log.d(LOG_TAG, "onTrimMemory " + level);
        applicationLifeCycleHelper.handleOnTrimMemory(level);
        super.onTrimMemory(level);
    }

}
```
</div>

セッション情報を報告するためにAndroidアプリを更新しました。 ユーザーがアプリを開いたり閉じたりすると、Amazon Pinpoint コンソールでセッションメトリックが表示されるようになりました。 *セッション* および *セッションヒートマップ* チャートで表示されるものを含む。 
