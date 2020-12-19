**Android Studio を開きます。** **+ Flutter プロジェクトを新規作成**

![](~/images/lib/getting-started/flutter/set-up-android-studio-welcome.png)

 **プロジェクトテンプレート**を選択し、 **Flutter Application**を選択します。 **次へ** を押します。

次に、プロジェクトを構成します。

1. *名前* フィールドに **MyAmplifyApp** を入力してください
2. Flutter SDK パスがマシンにインストールされている場所に正しく設定されていることを確認してください
3. 次の ****を押します。次の画面で、 **完了** を押します。

  ![](~/images/lib/getting-started/flutter/set-up-android-studio-configure-your-project.png)

Android Studioは *main.dart*のタブを開いてプロジェクトを開きます。

CocoaPods を使用している場合は、iOS プラットフォーム 11.0 以上の対象に変更します。 プロジェクト内で `ios/Podfile` を開き、2 行目を `platform :ios, '11.0' に変更します。

```bash
sudo gem install cocoapods

# 必ずあなたが ios フォルダーにいることを確認してください
pod init
```

XCode では、プロジェクト ナビゲーターでプロジェクトを選択し、format@@0 タブを選択します。Deployment Target を少なくとも 11.0 に設定します。

  ![](~/images/lib/getting-started/flutter/set-up-xcode-deployment-target.png)

空のFlutterプロジェクトがあり、次のステップでAmplifyを追加します。
