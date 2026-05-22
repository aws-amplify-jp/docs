---
title: "フォーム入力のカスタマイズ"
section: "build-ui/formbuilder"
platforms: ["javascript", "react", "nextjs"]
gen: 2
last-updated: "2024-07-30T16:49:23.000Z"
url: "https://docs.amplify.aws/react/build-ui/formbuilder/customize/"
---

このガイドでは、`npx ampx generate forms` を実行して生成された接続フォームをカスタマイズする方法を学びます。始める前に以下が必要です:

- クラウドサンドボックスと Amplify Data リソースが稼働している状態 (npx ampx sandbox)
- [生成された接続フォーム](/[platform]/build-ui/formbuilder/)を持つフロントエンドアプリケーション

すべての Amplify フォームは [Amplify UI ライブラリ](https://ui.docs.amplify.aws/) で構築されています。生成されたフォームは、[TextField](https://ui.docs.amplify.aws/react/components/textfield)、[TextAreaField](https://ui.docs.amplify.aws/react/components/textareafield)、[SelectField](https://ui.docs.amplify.aws/react/components/selectfield) などの各入力コンポーネントのプロパティをオーバーライドするメカニズムを提供します。フォームコンポーネント上の `overrides` プロップを使用して、これらのコンポーネントのプロップをオーバーライドできます。たとえば、TodoCreateForm の `content` フィールドのバリエーションとラベルを変更したい場合:

```jsx
import TodoCreateForm from '@/ui-components/TodoCreateForm'

<TodoCreateForm
  // highlight-start
  overrides={{
    content: {
      variation: 'quiet',
      label: 'Todo'
    }
  }}
  // highlight-end
/>
```

<Callout>

注: 生成されたフォームで既に設定されているプロパティをオーバーライドすることはお勧めしません。これはランタイム中に予期しない動作につながる可能性があります。src/ui-components/[your-form-component].jsx ファイル内のコンポーネントに移動して、設定されたプロパティを確認してください。

</Callout>

生成されたフォームのコードを直接更新する必要があります。フォームをカスタマイズする方法は以下の通りです。

## フォーム入力フィールドを手動で追加

データモデルに接続されたフォーム入力を生成されたフォームに手動で追加できます。たとえば、データモデルに `priority` フィールドを追加したとします。生成されたフォームに対して次の編集を行います:

```jsx title="src/ui-components/TodoCreateForm.js"
  // 1. initialValues を設定
  const initialValues = {
    content: "",
    // highlight-next-line
    priority: "" // priority の初期値
  };

  // 2. 状態設定
  const [priority, setPriority] = React.useState(initialValues.priority);

  // 3. resetValues を更新
  const resetStateValues = () => {
    .. // 前のフィールド
    // highlight-next-line
    setPriority(initialValues.priority)
    setErrors({});
  };

  // 4. 検証設定
  const validations = {
    content: [],
    // highlight-next-line
    priority: [] // 今のところ特別な検証はないと仮定
  };

  // 5. フォーム送信を更新
   onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          ..,
          // highlight-next-line
          priority
        };

  // 6. TextField を追加
  <TextField
     label="Priority"
     isRequired={false}
     isReadOnly={false}
     value={priority}
     onChange={(e) => {
       let { value } = e.target;
       if (onChange) {
         const modelFields = {
           priority: value,
         };
         const result = onChange(modelFields);
         value = result?.priority ?? value;
       }
       if (errors.priority?.hasError) {
         runValidationTasks("priority", value);
       }
       setPriority(value);
     }}
     onBlur={() => runValidationTasks("priority", priority)}
     errorMessage={errors.priority?.errorMessage}
     hasError={errors.priority?.hasError}
     {...getOverrideProps(overrides, "priority")}
   />

```

## オプションフィールドを手動で追加

[Select Fields](https://ui.docs.amplify.aws/react/components/selectfield)、[Radio Group Fields](https://ui.docs.amplify.aws/react/components/radiogroupfield)、[Autocomplete Fields](https://ui.docs.amplify.aws/react/components/autocomplete) は、ユーザーが選択できるオプションのセットが必要です。たとえば、「Status」入力は「未開始」、「進行中」、「完了」のオプションのみを持つことができます。これは上記の 6 ステップと同じですが、ステップ 6 で `<TextField>` を `<SelectField>` に置き換えます。

```js title="src/ui-components/TodoCreateForm.js"
  // 6. <SelectField> コンポーネントをインポートしてフォーム戻り値に追加
  <SelectField
    label="Label" 
    placeholder="Please select an option" 
    value={status} 
    onChange={(e) => {
      let { value } = e.target;
      if (onChange) {
          const modelFields = {
              status: value
          };
          const result = onChange(modelFields);
          value = result?.status ?? value;
      }
      if (errors.status?.hasError) {
          runValidationTasks("status", value);
      }
      setStatus(value);
      }} 
      onBlur={() => runValidationTasks("status", status)}
      errorMessage={errors.status?.errorMessage} 
      hasError={errors.status?.hasError} 
      {...getOverrideProps(overrides, "status")}
    >
      <option children="Not started" value="Not started" {...getOverrideProps(overrides, "statusOption0")}></option>
      <option children="In progress" value="In progress" {...getOverrideProps(overrides, "statusOption1")}></option>
      <option children="Done" value="Done" {...getOverrideProps(overrides, "statusOption2")}></option>
  </SelectField>
```

## フォームの間隔 (パディングとギャップ) を設定

フォームと入力間に間隔を追加します。間隔値は CSS 長さ値 (`px`、`rem`、`em`、`%`) またはテーマオブジェクトの間隔値への参照 (`xss`、`medium`、`large`) のいずれかです。

```js
import TodoCreateForm from '@/ui-components/TodoCreateForm'

<TodoCreateForm overrides={{
  // highlight-start
  TodoCreateForm: {
    rowGap: 'xl',    // 入力間の水平ギャップ
    columnGap: 'xs', // 入力間の垂直ギャップ
    padding: 'xl',   // フォーム周囲のパディング
  },
  // highlight-end
}} />
```

## 送信ボタンと クリアボタンのラベルをカスタマイズ

アクションボタンのラベルをカスタマイズして、フォームのユースケースをより適切に説明できます。たとえば、`Submit` を `Create Todo` に変更します。

```js
import TodoCreateForm from '@/ui-components/TodoCreateForm'

<TodoCreateForm overrides={{
  // highlight-start
  ClearButton: {
    children: 'Close'
  },
  SubmitButton: {
    children: 'Save todo'
  }
  // highlight-end
}} />
```

## 送信ボタンとクリアボタンの表示を切り替え

アクションボタンの表示をカスタマイズして、フォームのユースケースをより適切に対応できます。

```js
import TodoCreateForm from '@/ui-components/TodoCreateForm'

<TodoCreateForm overrides={{
  // highlight-start
  ClearButton: {
    display: 'none'
  },
  SubmitButton: {
    display: 'none'
  }
  // highlight-end
}} />
```

すべてのフォームアクションボタンを非表示にした場合でも、[`onChange` イベントハンドラ](/gen1/[platform]/build-ui/formbuilder/lifecycle/#get-form-data-as-your-user-inputs-data---onchange)を活用してフォームライフサイクルを自己管理できます。これは、明示的なユーザー確認なしにリアルタイムでデータを更新するフォームに役立ちます。

```jsx
import TodoCreateForm from '@/ui-components/TodoCreateForm'

<TodoCreateForm
  // highlight-start
  onChange={(fields) => {
    console.log({ fields })
    // フィールドを必ず返してください!
    return fields
  }}
  // highlight-end
/>
```
