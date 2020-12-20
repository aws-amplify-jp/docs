<amplify-block-switcher>

<amplify-block name="Listener (iOS 11+)">

```swift
func resetPassword(username: String) {
    Amplify.Auth.resetPassword(for: username) { result in
        do {
            let resetResult = try result.get()
            switch resetResult.nextStep {
            case .confirmResetPasswordWithCode(let deliveryDetails, let info):
                print("Confirm reset password with code send to - \(deliveryDetails) \(info)")
            case .done:
                print("Reset completed")
            }
        } catch {
            print("Reset password failed with error \(error)")
        }
    }
}
```

</amplify-block>

<amplify-block name="Combine (iOS 13+)">

```swift
func resetPassword(username: String) -> AnyCancellable {
    Amplify.Auth.resetPassword(for: username)
        .resultPublisher
        .sink {
            if case let .failure(authError) = $0 {
                print("Reset password failed with error \(authError)")
            }
        }
        receiveValue: { resetResult in
            switch resetResult.nextStep {
            case .confirmResetPasswordWithCode(let deliveryDetails, let info):
                print("Confirm reset password with code send to - \(deliveryDetails) \(info)")
            case .done:
                print("Reset completed")
            }
        }
}
```

</amplify-block>

</amplify-block-switcher>

通常、パスワードをリセットするには、パスワードをリセットしようとした実際のユーザーであることを確認する必要があります。 上記の次のステップは `.confirmResetPasswordWithCode` になります。