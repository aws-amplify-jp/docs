UI コンポーネントのテーマは、CSS 変数を使用することで達成できます。 以下のCSS変数をオーバーライドすることで、アプリでテーマを有効にできます。 これを行うには、root css ファイルに次のコードを追加します。

```
:root {
  --amplify-primary-color: #ff6347;
  --amplify-primary-tint: #ff7359;
  --amplify-primary-shade: #e0573;
}
```

## サポートされている CSS カスタム プロパティ

### タイポグラフィ用

| カスタムプロパティ               | デフォルト値                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `--amplify-font-family` | 'Amazon Ember', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif' |
| `--amplify-text-xxs`    | 0.75rem                                                                                      |
| `--amplify-text-xs`     | 0.81rem                                                                                      |
| `--anplify-text-sm`     | 0.875rem                                                                                     |
| `--amplify-text-md`     | 1rem                                                                                         |
| `--amplify-text-lg`     | 1.5rem                                                                                       |
| `--amplify-text-xl`     | 2rem                                                                                         |
| `--amplify-text-xxl`    | 2.5rem                                                                                       |

### 色用

| カスタムプロパティ                      | デフォルト値               |
| ------------------------------ | -------------------- |
| `--amplify-primary-color`      | #ff9900              |
| `--amplify-primary-consist`    | var(--amplify-white) |
| `--amplify-primary-tint`       | #ffac31              |
| `--amplify-primary-shade`      | #e88b01              |
| `--anplify-secondary-color`    | #152939              |
| `--anplify-secondary-compross` | var(--amplify-white) |
| `--anplify-secondary-tint`     | #31465f              |
| `--anplify-secondary-shade`    | #1F2A37              |
| `--anplify-tertiar-color`      | #5d8aff              |
| `--anplify-tertiar-direction`  | var(--amplify-white) |
| `--anplify-tertiary-tint`      | #7da1ff              |
| `--anplify-tertiary-shade-`    | #537BE5              |
| `--amplify-grey`               | #828282              |
| `--amplify-light-grey`         | #c4c4c4              |
| `--amplify-white`              | #ffffff              |
| `--amplify-red`                | #dd3f5b              |
