---
title: "特別な入力を設定する"
section: "build-ui/formbuilder"
platforms: ["javascript", "react", "nextjs"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/build-ui/formbuilder/special-inputs/"
---

## ファイルアップローダー

[**ファイルアップローダー**](https://ui.docs.amplify.aws/react/connected-components/storage/fileuploader)フィールドにより、フォームはファイルアップロードを受け入れることができます。ファイルはAmplifyアプリに接続されているAmazon S3バケットに保存されます。アップロード後、ファイルのS3キーがデータモデルに保存され、[Amplify JSライブラリ](/[platform]/frontend/storage/download-files/)を使用した体系的な取得が可能になります。

### 前提条件

ファイルアップローダーフィールドを使用するには、Amplifyアプリで[認証](/[platform]/build-a-backend/auth/set-up-auth/)と[ストレージ](/[platform]/build-a-backend/storage/set-up-storage/)が有効になっている必要があります。

### 仕組み

ファイルアップローダー入力により、ユーザーはローカルデバイスからファイルを選択し、S3バケットにアップロードできます。ファイルアップローダーはAmplifyストレージの一部として追加されたS3バケットに自動的に接続されます。

ファイルは選択直後にアップロードされ、S3キーが生成されます。デフォルトでは、ファイルアップローダーはアップロードされたファイルに基づいて[ユニークなS3キー](#unique-s3-keys)を生成します。フォーム送信時に、ファイルアップローダーはアップロードされたファイルのS3キーを`String`として返します。

### フォームに追加する

自動生成されたフォームでFileUploadedコンポーネントを使用するには、まず文字列または文字列の配列のいずれかの属性を持つデータモデルが必要です(**amplify/data/resource.ts**の`a.string().array()`)。その後、データモデルを更新した後に`npx ampx generate forms`を実行してください。

次に、FileUploaderを使用する生成されたフォームJSXファイルに移動します。例えば:**ui-components/TodoCreateForm.jsx**。属性が文字列の配列の場合は、`<ArrayField>`を`items={images}`で探します(属性名が「images」の場合)。そのコンポーネント全体を削除し、FileUploaderコンポーネントで置き換えます:

```jsx title="ui-components/TodoCreateForm.jsx"
// imports
import { FileUploader } from "@aws-amplify/ui-react-storage";
// import the processFile helper function which will create unique filenames based on the file contents
import { processFile } from "./utils";

//...
<FileUploader
  accessLevel="public"
  maxFileCount={10}
  acceptedFileTypes={['image/*']}
  processFile={processFile}
  onUploadSuccess={({key}) => {
    // assuming you have an attribute called 'images' on your data model that is an array of strings
    setImages(prevImages => [...prevImages, key])
  }}
  onFileRemove={({key}) => {
    setImages(prevImages => prevImages.filter(img => img !== key))
  }}
/>
```

複数の画像ではなく1つの画像だけでデータモデルを持つようにしたい場合は、`<TextField>`コンポーネントを`value={image}`で探して、FileUploaderコンポーネントで置き換えます:

```jsx title="ui-components/TodoCreateForm.jsx"
// imports
import { FileUploader } from "@aws-amplify/ui-react-storage";
// import the processFile helper function which will create unique filenames based on the file contents
import { processFile } from "./utils";

//...
<FileUploader
  accessLevel="public"
  maxFileCount={1}
  acceptedFileTypes={['image/*']}
  processFile={processFile}
  onUploadSuccess={({key}) => {
    // assuming you have an attribute called 'images' on your data model that is an array of strings
    setImage(key)
  }}
  onFileRemove={({key}) => {
    setImage(undefined)
  }}
/>
```

すべての設定オプションについては、[FileUploader](https://ui.docs.amplify.aws/react/connected-components/storage/fileuploader)のドキュメントを参照してください。

### ユニークなS3キー

S3キーが同一のファイルが同じパスにアップロードされると、S3はそれらのファイルを上書きします。ファイルの意図しない上書きを防ぐため、ファイルアップローダーはファイルの内容をハッシュすることでユニークなS3キーを生成します。同じ名前でも異なるファイルをアップロードすると、元のファイルは上書きされません。

ただし、フォーム送信者が同じパスに2つの同一ファイルをアップロードする場合(異なるファイル名でも)、ファイルアップローダーはS3バケットのファイル重複を防止します。

> **Warning:** ファイルの上書きは同じパス内で同一のS3キーに対してのみ発生します。ファイルアップローダーの**ファイルレベルアクセス**が`private`または`protected`に設定されている場合、異なるユーザーがアップロードした同一ファイルは別々に保存されます。
> 
> <br />
> **ファイルレベルアクセス**が`public`に設定されている場合、同一ファイルは相互に上書きされます。
