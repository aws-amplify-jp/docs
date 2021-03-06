AWS Mobile SDK for Android では、Amazon CognitoなどのAWSサービス向けに簡素化されたAPIを提供することで、モバイルアプリを構築することができます。 Amazon S3、AWS AppSyncなど。

<inline-fragment src="~/sdk/fragments/library-callout.md"></inline-fragment>

## よくある質問

### AWS Mobile SDK for Android と Amplifyライブラリの違いは?

Amplifyライブラリは、Amplifyフレームワークの一部であり、ライブラリの独自のセットです。 UIコンポーネントとCLIツールチェーンは、モバイルおよびWeb開発者がアプリケーションを構築するために使用できます。 サービスの実装に焦点を当てるのではなく、アプリケーションで使用するユースケースに焦点を当てた「カテゴリ」ベースのデザインがあります。 カテゴリには宣言型の API があり、開発者はアプリケーション設計やビジネスユースケースに集中することができます。

Amplifyは良識的なデフォルトでベストプラクティスを構築することを目指しています。 アプリケーションがバックエンドサービスとどのように相互作用するかを制御するためには、低レベルのインターフェイスが必要な場合があります。 このような状況で、Amplifyは「脱出ハッチ」を提供します。 認証カテゴリからの資格情報など、特定のカテゴリをエスケープハッチで使用して、下位レベルのインターフェイスを使用してサービスと直接やり取りできます。

「ライブラリ」という用語は、これらのカテゴリベースのユースケースで作成されたプログラミングインターフェースを指します。 「SDK」を使用して、バックエンドサービスインターフェイスから自動生成され、実装固有の下位レベルのプログラミングインターフェイスを参照します。 既存のAWS Mobile SDKには、ヘルパークラス、ユーティリティ、およびAWSサービスインターフェースで定義されたコード生成の実装固有のAPIのセットが含まれています。 低レベルのコントロールが必要な場合は、脱出ハッチを介してアプリで使用できます。

このガイドでは、AWS Mobile SDK for Android と Amplify CLI ツールチェーンを使用してアプリをビルドする方法を説明します。 新しい開発者エクスペリエンスを利用するには、 [Amplify Library for Android guide](~/lib/lib.md) を参照してください。

### AmplifyライブラリまたはAWS Mobile SDKを使用する必要がありますか?

Amplifyライブラリは、すべての新しいアプリケーションに使用する必要があります。

既存のアプリケーションでは、Amplifyライブラリへの移行を評価することをお勧めします。 AWS Mobile SDKは引き続きバグ修正とセキュリティアップデートにより維持されます。