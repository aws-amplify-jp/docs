前述の `増幅アプリ` はiOSで、プロジェクトにAmplify固有のファイルを自動的に追加するXcode統合を提供します。

1. **コマンド** を実行:
    ```
    コードジェネレーションモデルを増幅 && 増幅アプリ
    ```

1. コマンドが終了すると、 `AmplifyModel` という名前の新しいグループがプロジェクトに追加され、次のファイルが含まれているはずです。

  - `AmplifyModels/`
    - `AmplifyModels.swift`
    - `Post.swift`
    - `Post+Schema.swift`
    - `PostStatus.swift`

1. **プロジェクトをビルドする (`Cmd+b`)**.
