You can use the device related features of Amazon Cognito User Pools by enabling the **Devices** features. Navigate to the Cognito User Pools console, click on **Devices** in Left Navigation Menu and chose one of **User Opt In** or **Always**.

**Always** を選択した場合、アプリケーションユーザーが使用するすべてのデバイスが記憶されます。

デバイス機能の詳細については、以下の [ブログ](https://aws.amazon.com/blogs/mobile/tracking-and-remembering-devices-using-amazon-cognito-your-user-pools/) をご覧ください。

## 用語

* *追跡*

デバイスが追跡されると、鍵と秘密鍵のペアからなる一連のデバイス資格情報が各デバイスに割り当てられます。 特定のユーザーの追跡されたすべてのデバイスは、Amazon Cognitoコンソールデバイスブラウザから表示できます。 これは、format@@0パネルからユーザーを選択して表示できます。 加えて、いくつかのメタデータを見ることができます(それが記憶されているかどうか、それが追跡され始めた時間、最後の認証時間など)。 関連付けられています


* *記憶されている*

記憶されたデバイスも追跡されます。 ユーザー認証中 記憶されたデバイスに割り当てられたキーとシークレットのペアは、以前にアプリケーションにサインインしたユーザーと同じデバイスであることを確認するためにデバイスを認証するために使用されます。 また、Amazon Cognitoコンソールから記憶されたデバイスを見ることもできます。


* *記憶されていません*

記憶されていないデバイスは、デバイスがまだ追跡されているにもかかわらず、記憶されることの裏側です。 デバイスは、ユーザー認証フロー中に使用されなかったかのように扱われます。 これは、デバイスの資格情報がデバイスの認証に使用されないことを意味します。 AWS Mobile SDK の新しい API では、これらのデバイスは公開されませんが、Amazon Cognito コンソールで確認できます。

## デバイスを記憶する

このオプションはトラッキングされたデバイスを `記憶`としてマークします

```swift
AWSMobileClient.default().deviceOperations.updateStatus(remembered: true) { (result, error) in
    // ...
}
```

## デバイスを更新

このオプションは、トラッキングされたデバイスを `記憶されていない`とマークします。

```swift
AWSMobileClient.default().deviceOperations.updateStatus(remembered: false) { (result, error) in
    // ...
}
```

## デバイスを忘れた

このオプションはデバイスの追跡を完全に停止します。

```swift
AWSMobileClient.default().deviceOperations.forg({ (error) in
    // ...
})
```

> 注: ``を呼び出したら、同じ認証セッションでデバイスのステータスを更新できます。 エンドユーザーは、デバイスを覚えるために再度サインインする必要があります。

## 端末の詳細を取得する

```swift
AWSMobileClient.default().deviceOperations.get { (device, error) in
    guard error == nil else {
        print(error!.localizedDescription)
        return
    }

    print(device!.createDate!)
    print(device!.deviceKey!)

}
```

## デバイス一覧

```swift
AWSMobileClient.default().deviceOperations.list(limit: 60) { (result, error) in
    guard error == nil else {
        print(error!.localizedDescription)
        return
    }
    // Number of devices that are remembered
    print(result!.devices!.count)

}
```