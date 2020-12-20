キー `ExampleKey`を使用してデータをアップロードした場合、 `Amplify.Storage.downloadFile` を使用してデータを取得できます。

```dart
try {
  DownloadFileResult result = await Amplify.Storage.downloadFile(
    key: 'ExampleKey',
    local: new File('$path/download.png')
  );
} catch (e) {
  print(e.toString());
}
```

### ダウンロード URL を生成する

また、ストレージ内のオブジェクトの URL を取得することもできます。

```dart

try {
  GetUrlResult result =
    await Amplify.Storage.getUrl(key: "myKey");
  print(result.url); 
} catch (e) {
  print(e.toString());
}

```

