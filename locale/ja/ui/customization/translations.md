---
title: 翻訳
description: 国際化とカスタムテキスト
---

テキストのカスタマイズと言語翻訳の追加は、 `I18n` モジュールで行うことができます。

```js
import { I18n } from "aws-amplify";
import { Translations } from "@aws-amplify/ui-components";

I18n.putVocabulariesForLanguage("en-US", {
  [Translations.SIGN_IN_HEADER_TEXT]: "Custom Sign In Header Text",
  [Translations.SIGN_IN_ACTION]: "Custom Click Here to Sign In"
});
```

すべての翻訳可能な文字列の完全なリストは [`Translations.ts`](https://github.com/aws-amplify/amplify-js/blob/main/packages/amplify-ui-components/src/common/Translations.ts) にあります。
