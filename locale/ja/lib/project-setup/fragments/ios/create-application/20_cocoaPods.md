このステップを開始する前に、 **Xcode を閉じてください。**

**Open a terminal** and **change directories to your project**.  For example, if you created your project in the folder `~/Developer`, you can:
```bash
cd ~/Developer/MyAmplifyApp
```

CocoaPods パッケージマネージャでプロジェクトを初期化するには、 **コマンド** を実行します。
```bash
pod init
```

これを行うと、 `Podfile`という名前の新しく作成されたファイルが表示されます。 このファイルは、プロジェクトがどのパッケージに依存するかを記述するために使用されます。

**ファイル** を更新して、 `Amplify` ポッドを含めます:
```
ターゲット 'MyAmplifyApp' do
  use_frameworks!
  pod 'Amplify'
end
```

プロジェクトに Amplify ポッドをダウンロードしてインストールするには、 **コマンド** を実行します。
```bash
pod install --repo-update
```

After doing this, you should now see file called `MyAmplifyApp.xcworkspace`.  You are required to use this file from now on instead of the .xcodeproj file.  To open your workspace, **execute the command**:
```bash
xed .
```
これにより、新しく生成された MyAmplifyApp.xcworkspace を Xcode で開きます。