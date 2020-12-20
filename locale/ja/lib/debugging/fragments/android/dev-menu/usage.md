デバイスを振ると、アプリのデバッグビルド中に開発者メニューにアクセスできます。 エミュレータは、エミュレータの横にあるより多くのオプション(3つのドットで示されています)を選択し、「仮想センサー」タブに移動することで振動させることができます。 「移動」ボタンをクリックし、「仮想センサー」タブ内に表示されるエミュレーターを数回移動します。

![シェイクアンドロイドエミュレーター](~/images/debugging/shakeAndroidEmulator.gif)

開発者メニューは、アプリケーションのデバッグビルドを実行しているときにのみ表示されます。 ただし、デバッグビルドでもメニューを無効にしたい場合は、Amplifyを構成するときにカスタム構成を渡すことができます。

<amplify-block-switcher> <amplify-block name="Java">

```java
AmplifyConfiguration config = AmplifyConfiguration.builder(getApplicationContext())
        .devMenuEnabled(false)
        .build();
Amplify.configure(config, getApplicationContext());
```

</amplify-block> <amplify-block name="Kotlin">

```kotlin
val config = AmplifyConfiguration.builder(applicationContext)
    .devMenuEnabled(false)
    .build()
Amplify.configure(config, applicationContext)
```

</amplify-block> </amplify-block-switcher>
