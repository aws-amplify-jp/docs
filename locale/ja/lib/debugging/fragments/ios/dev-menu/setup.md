プロジェクトで、ファイル `./amplify/.config/local-env-info.json` を Xcode にドラッグ&ドロップします。 このファイルには開発者メニューに表示される環境情報が含まれています。

<amplify-callout warning>

`増幅` ディレクトリが表示されない場合は、 [プロジェクト設定の手順](https://docs.amplify.aws/lib/project-setup/prereq/q/platform/ios)に従ってください。

</amplify-callout>

To be able to activate the developer menu when running a debug build of your app, add the following line of code before calling `Amplify.configure()`:

```
Amplify.enableDevMenu(contextProvider: obj1)
```

where `obj1` is a object that implements `DevMenuPresentationContextProvider`.