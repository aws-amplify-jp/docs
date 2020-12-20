 ストレージカテゴリを追加する際、認証済みのアクセスレベルを設定し、ゲストユーザーがS3バケットに必要なレベルを設定します。 また、Storageカテゴリを使用してファイルをアップロードする場合は、そのファイルのアクセスレベルをゲスト(公開)、保護、またはプライベートのいずれかに指定できます。

- **ゲスト** すべてのユーザーがアクセス可能
- **Protected** すべてのユーザーが読み込むことができますが、作成ユーザーによってのみ書き込み可能です
- **Private** 読みやすく、書き込み可能なのは作成ユーザーのみです

保護されたプライベートアクセスの場合、プレフィックスの `user_id` は、作成ユーザーの一意の ID に対応します。

<amplify-callout>

ストレージカテゴリのデフォルトのアクセスレベルは **ゲスト**です。 指定しない限り、アップロードされたすべてのファイルはすべてのユーザーが公開されます。

</amplify-callout>

## 保護されたアクセス

他のユーザーがオブジェクトを読み取ることができるように、保護されたアクセスレベルを指定した options オブジェクトを作成します。

```dart
try {
  // use a file selection mechanism of your choice
  File file = await FilePicker.getFile(type: FileType.image);
  final key = new DateTime.now().toString();
  final local = file.absolute.path;
  S3UploadFileOptions options = S3UploadFileOptions(
    accessLevel: StorageAccessLevel.protected
  );
  UploadFileResult result = await Amplify.Storage.uploadFile(
    key: key,
    local: local,
    options: options
  );
} catch (e) {
  print(e.toString());
}
```

他のユーザーがファイルを読み込むには、渡されたオプションで作成ユーザーのユーザー ID を指定する必要があります。

```dart
try {
  S3DownloadFileOptions options = S3DownloadFileOptions(
    targetIdentityId: "userId",
    accessLevel: StorageAccessLevel.protected
  );
  DownloadFileResult result = await Amplify.Storage.downloadFile(
    key: key,
    local: new File('$path/download.png')
    options: options
  );
} catch (e) {
  print(e.toString());
}
```

## プライベートアクセス

作成ユーザーがアクセスできるオブジェクトのみを許可するプライベートアクセスレベルを指定したoptionsオブジェクトを作成します

```dart
try {
  // use a file selection mechanism of your choice
  File file = await FilePicker.getFile(type: FileType.image);
  final key = new DateTime.now().toString();
  final local = file.absolute.path;
  S3UploadFileOptions options = S3UploadFileOptions(accessLevel: StorageAccessLevel.private);
  UploadFileResult result = await Amplify.Storage.uploadFile(
    key: key,
    local: local,
    options: options
  );
} catch (e) {
  print(e.toString());
}
```

ユーザーがファイルを読み込むには、渡されたオプションで作成ユーザーのユーザー ID を指定する必要があります。

```dart try { S3DownloadFileOptions options = S3DownloadFileOptions( targetIdentityId: "userId", accessLevel: StorageAccessLevel.private ); DownloadFileResult result = await Amplify.Storage.downloadFile( key: key, local: new File('$path/download.png') options: options ); } catch (e) { print(e.toString()); }
