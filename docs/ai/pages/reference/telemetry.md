---
title: "テレメトリー"
section: "reference"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-05-16T15:59:30.000Z"
url: "https://docs.amplify.aws/react/reference/telemetry/"
---

Amplify Gen 2 は CLI の一般的な使用に関する匿名のテレメトリー データを収集します。参加はオプションであり、`ampx configure telemetry disable` を使用することで [オプトアウト](#how-do-i-opt-out) できます。

オプトアウトの決定はユーザーに対して保存されます。つまり、そのコンピューター上で作業しているすべての Amplify アプリがテレメトリー データを送信しなくなります。

## オプトアウトする方法

Amplify アプリのルートから `configure telemetry disable` コマンドを使用してオプトアウトできます:

```bash title="Terminal" showLineNumbers={false}
npx ampx configure telemetry disable
```

Amplify アプリのルートから以下を実行することで、プログラムに再度オプトインできます:

```bash title="Terminal" showLineNumbers={false}
npx ampx configure telemetry enable
```

1 回限りの基準でテレメトリーを無効にしたい場合は、環境変数を定義することでオプトアウトできます:

```bash title="Terminal" showLineNumbers={false}
export AMPLIFY_DISABLE_TELEMETRY=1
```
