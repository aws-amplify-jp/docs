ただし、必要に応じて資格情報に直接アクセスすることができます:

```dart
  void _fetchSession() async {
    try {
      CognitoAuthSession res = await Amplify.Auth.fetchAuthSession(
        options: CognitoSessionOptions(getAWSCredentials: true)
      );    } on AuthError catch (e) {
      print(e);
    }
  }
```

If the `getAWSCredentials` option is true, the result will contain AWS credentials and tokens.  If it is set to false, the result will contain a simple `isSignedIn` flag. 
