---
title: "フィールドレベルの検証"
section: "build-a-backend/data"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-03-17T16:14:03.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/field-level-validation/"
---

モデルスキーマでフィールドレベルの検証を有効にするには、フィールドに `validate` 関数をチェーンします。

## 例

```ts title="amplify/data/resource.ts"
const schema = a.schema({
  Todo: a.model({
    content: a.string().validate(v => 
      v
        .minLength(1, 'Content must be at least 1 character long')
        .maxLength(100, 'Content must be less than 100 characters')
        .matches('^[a-zA-Z0-9\\\\s]+$', 'Content must contain only letters, numbers, and spaces')
    )
  })
  .authorization(allow => [allow.publicApiKey()])
});
```

## サポートされているバリデータ

### 文字列バリデータ
`string` フィールドの場合:

| バリデータ | 説明 | パラメータ | 例 |
| --- | --- | --- | --- |
| `minLength` | 文字列フィールドが指定された長さ以上であることを検証します | • `length`: 必要な最小長<br/>• `errorMessage`: オプションのカスタムエラーメッセージ | `a.string().validate(v => v.minLength(5, 'String must be at least 5 characters'))` |
| `maxLength` | 文字列フィールドが指定された長さを超えないことを検証します | • `length`: 許可される最大長<br/>• `errorMessage`: オプションのカスタムエラーメッセージ | `a.string().validate(v => v.maxLength(100, 'String must be at most 100 characters'))` |
| `startsWith` | 文字列フィールドが指定されたプレフィックスで始まることを検証します | • `prefix`: 文字列が始まる必要があるプレフィックス<br/>• `errorMessage`: オプションのカスタムエラーメッセージ | `a.string().validate(v => v.startsWith("prefix-", 'String must start with prefix-'))` |
| `endsWith` | 文字列フィールドが指定されたサフィックスで終わることを検証します | • `suffix`: 文字列が終わる必要があるサフィックス<br/>• `errorMessage`: オプションのカスタムエラーメッセージ | `a.string().validate(v => v.endsWith("-suffix", 'String must end with -suffix'))` |
| `matches` | 文字列フィールドが **Java正規表現エンジン** を使用して指定された正規表現パターンにマッチすることを検証します。以下の注釈を参照してください。 | • `pattern`: 文字列がマッチする必要がある正規表現パターン<br/>• `errorMessage`: オプションのカスタムエラーメッセージ | `a.string().validate(v => v.matches("^[a-zA-Z0-9]+$", 'String must match the pattern'))` |

<Callout>

**注釈:** スキーマトランスフォーマーの内部ではJava正規表現エンジンを使用しています。TypeScriptが文字列リテラルを処理する方法のため、スキーマ内で特殊な正規表現文字を4重にエスケープする必要があります。TypeScriptの文字列リテラルでは、`\\\\s` と書くと文字列 `\\s` が生成され、これはJava正規表現エンジンの正しい形式です。`\\s` と書くと `\s` が生成され、これは無効です。したがって、`matches` バリデータについては、4重エスケープを使用してください。例えば:
`a.string().validate(v => v.matches("^[a-zA-Z0-9\\\\s]+$", 'Content must contain only letters, numbers, and spaces'))`

</Callout>

### 数値バリデータ
`integer` および `float` フィールドの場合:

| バリデータ | 説明 | パラメータ | 例 |
| --- | --- | --- | --- |
| `gt` | 数値フィールドが指定された値より大きいことを検証します | • `value`: フィールドが大きい必要がある値<br/>• `errorMessage`: オプションのカスタムエラーメッセージ | `a.integer().validate(v => v.gt(10, 'Must be greater than 10'))` |
| `gte` | 数値フィールドが指定された値以上であることを検証します | • `value`: フィールドが以上である必要がある値<br/>• `errorMessage`: オプションのカスタムエラーメッセージ | `a.integer().validate(v => v.gte(10, 'Must be at least 10'))` |
| `lt` | 数値フィールドが指定された値より小さいことを検証します | • `value`: フィールドが小さい必要がある値<br/>• `errorMessage`: オプションのカスタムエラーメッセージ | `a.integer().validate(v => v.lt(10, 'Must be less than 10'))` |
| `lte` | 数値フィールドが指定された値以下であることを検証します | • `value`: フィールドが以下である必要がある値<br/>• `errorMessage`: オプションのカスタムエラーメッセージ | `a.integer().validate(v => v.lte(10, 'Must be at most 10'))` |
| `positive` | 数値フィールドが正の値であることを検証します | • `errorMessage`: オプションのカスタムエラーメッセージ | `a.integer().validate(v => v.positive('Must be positive'))` |
| `negative` | 数値フィールドが負の値であることを検証します | • `errorMessage`: オプションのカスタムエラーメッセージ | `a.integer().validate(v => v.negative('Must be negative'))` |

<Callout>

**注釈:** 現在、`string`、`integer`、`float` 型の **配列以外の** フィールドの検証のみサポートしています。

</Callout>
