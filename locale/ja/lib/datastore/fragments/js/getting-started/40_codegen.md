When using `npx amplify-app` a NPM script named `amplify-modelgen` should be added to you `package.json`. You can **generate model code** with the following command.

```console
npm run amplify-modelgen
```

次のファイルが生成されます。

```
src/
|_ models/
   |_ index.dts
   |_ index.js
   |_ schema.dts
   |_ schema.js
```

<amplify-callout>

`.d.ts` は [TypeScript 宣言ファイル](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)です。 あなたのプロジェクトが TypeScript を使用していない場合は、心配しないでください。それらのファイルは、大部分のエディタに開発者エクスペリエンスを提供することができます。 より正確なオートコンプリートとリアルタイムの型チェックを行うことができます。 最悪の場合のシナリオでは、彼らはただ無視されます。

</amplify-callout>
