---
title: CSS のカスタマイズ
description: コンポーネントのレイアウトとスタイルの管理
---

CSSを使用して最上位のコンポーネントを直接制御できます。 例えば、 `amplify-authenticator`のレイアウトを制御するには、セレクタ内でプロパティを直接指定することができます。

```css
amplify-authenticator {
  background: tomatomato;
  padding: 5px;
}
```

最上位レベルのコントロールは、次のコンポーネントで使用できます。 _**注意:**_ この CSS の更新を有効にするには、コンポーネントをクライアントに展開する必要があります。

- `anplify-signin`
- `anplify-confirm sign-in`
- `anplify-signup`
- `anplify-confirm-sign-up`
- `anplify-forgott-password`
- `anplify-require-new-password`
- `anplify-verify-contact`
- `anplify-totp-setup`
