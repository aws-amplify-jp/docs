---
title: "サンドボックスシード"
section: "deploy-and-host/sandbox-environments"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/seed/"
---

Sandbox Seed 機能を使用すると、Amplify サンドボックス環境に初期データを設定でき、現実的なデータを使用してアプリケーションをより簡単にテストおよび開発できます。

## シードスクリプトのセットアップ

まず、`@aws-amplify/seed` パッケージをインストールします。

```bash title="Terminal" showLineNumbers={false}
npm install @aws-amplify/seed --save-dev
```

次に、シードスクリプトを作成する必要があります。このスクリプトはサンドボックス環境をデプロイするときと `ampx sandbox seed` コマンドを実行するときに実行されます。

1. `amplify` ディレクトリの下に `seed` という名前のフォルダを作成します
2. `seed` フォルダ内に `seed.ts` というファイルを作成します

```bash title="Folders" showLineNumbers={false}
amplify/
  └── seed/
      └── seed.ts
```

## 必要な権限のセットアップ

サンドボックス環境をシードするには、AWS プロファイルユーザーまたは実行ロールに必要な権限を追加する必要があります。Amplify は必要な権限を生成します。これを `AmplifyBackendDeployFullAccess` を含む権限セットまたはロールに付与できます。

1. アクティブなサンドボックス環境がデプロイされていること。`npx ampx sandbox` を使用してサンドボックス環境をデプロイできます。
2. 必要な権限ポリシーテンプレートを生成します

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox seed generate-policy > seed-policy.json
```

3. このポリシーをロールに付与します (AWS CLI を使用した例):

```bash title="Terminal" showLineNumbers={false}
aws iam put-role-policy --role-name <your-role-name> --policy-name <policy-name> --policy-document file://seed-policy.json
```

## シードスクリプトの作成

権限のセットアップが完了したら、シードスクリプトを作成できます。`@aws-amplify/seed` パッケージは、サンドボックス環境をシードするのに役立つ API のセットを提供します。

### 認証

例えば、認証をユーザーでシードして、ユーザーを `admin` グループに追加したい場合は、まず認証リソースを作成することから始めましょう:

```typescript title="amplify/auth/resource.ts" 
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    locale: {
      required: false,
      mutable: true,
    },
  },
  groups: ["admin"],
});
```

`npx ampx sandbox secret set` を使用して 2 つのシークレットを作成します

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox secret set username
npx ampx sandbox secret set password
```

次に、ユーザーを作成して `admin` グループに追加するために、以下のスクリプトを作成できます:

```typescript title="amplify/seed/seed.ts" 
import { readFile } from "node:fs/promises";
import {
  addToUserGroup,
  createAndSignUpUser,
  getSecret,
} from "@aws-amplify/seed";
import { Amplify } from "aws-amplify";

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: "utf8" }));
Amplify.configure(outputs);

const username = await getSecret("username");
const password = await getSecret("password");

const user = await createAndSignUpUser({
  username: username,
  password: password,
  signInAfterCreation: false,
  signInFlow: "Password",
  userAttributes: {
    locale: "en",
  },
});

await addToUserGroup(user, "admin");
```

シードスクリプトを実行します

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox seed
```

これにより、提供されたユーザー名とパスワードを使用してユーザーが作成され、`admin` グループに追加されます。

`getSecret` 関数は `npx ampx sandbox secret set` を使用して作成したシークレットを取得します。これにより、認証情報をコードにハードコードすることを回避できます。または、ユーザー名とパスワードを `createAndSignUpUser` 関数の `string` として直接設定することもできますが、リポジトリで機密情報を公開することを避けるために、`getSecret` を使用することを強くお勧めします。

### 多要素認証 (MFA)

Amplify シードは、TOTP (時間ベースのワンタイムパスワード)、メール、SMS など、複数のタイプの MFA をサポートします。以下は、シードスクリプトで MFA を実装する方法の例です。

### TOTP MFA を使用した認証

例えば、TOTP MFA が有効になっているユーザーで認証をシードしたい場合は、まず認証リソースを構成することから始めましょう:

```typescript title="amplify/auth/resource.ts"
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },

  multifactor: {
    mode: "REQUIRED",
    totp: true,
  },
});
```

TOTP MFA が有効になっているユーザーを作成してサインインするには、以下のスクリプトを作成できます:
この例では、`otpauth` ライブラリを使用して TOTP コードを生成します。

```bash title="Terminal" showLineNumbers={false}
npm install otpauth
```

```typescript title="amplify/seed/seed.ts"
import type { ChallengeResponse } from "@aws-amplify/seed";
import { readFile } from "node:fs/promises";
import {
  createAndSignUpUser,
  getSecret,
} from "@aws-amplify/seed";
import { Amplify } from "aws-amplify";
import * as auth from "aws-amplify/auth";
import * as otpauth from "otpauth";

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: "utf8" }));
Amplify.configure(outputs);

const username = await getSecret("username");
const password = await getSecret("password");
let totpSecret: string;

const createTOTP = (secret: string) => {
  return new otpauth.TOTP({
    secret,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  });
};

const generateTOTPCode = (secret: string): string => {
  const totp = createTOTP(secret);
  return totp.generate();
};

const challengeWithTOTP = async (
  totpSetup: auth.SetUpTOTPOutput
): Promise<ChallengeResponse> => {
  totpSecret = totpSetup.sharedSecret;
  const answer = generateTOTPCode(totpSetup.sharedSecret);
  return { challengeResponse: answer };
};

const user = await createAndSignUpUser({
  username,
  password,
  signInAfterCreation: false,
  signInFlow: "MFA",
  mfaPreference: "TOTP",
  totpSignUpChallenge: async (totpSetup) => {
    return await challengeWithTOTP(totpSetup);
  },
});

console.log(`User ${user.username} was created`);

// Wait for a moment to get a fresh TOTP code
await new Promise((resolve) => setTimeout(resolve, 35000));

const signIn = await signInUser({
  username,
  password,
  signInFlow: "MFA",
  signInChallenge: async () => {
    const answer = generateTOTPCode(totpSecret);
    return { challengeResponse: answer };
  },
});

console.log(`User was signed in: ${signIn}`);

auth.signOut();
```

これにより、TOTP MFA が有効になっているユーザー名とパスワードを使用してユーザーが作成されます。TOTP コードは `otpauth` ライブラリを使用して生成されます。その後、ユーザーがサインインし、TOTP コードが生成されます。
タイムアウトにより、ユーザーの作成と認証の両方に同じ TOTP コードが使用される場合に発生する可能性のある競合を防ぐために、前の TOTP コードが有効期限切れになってからサインイン用の新しいコードを生成します。

シードスクリプトを実行します

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox seed
```

### メール MFA を使用した認証

例えば、メール MFA が有効になっているユーザーで認証をシードしたい場合:

```typescript title="amplify/seed/seed.ts"
import { readFile } from "node:fs/promises";
import {
  createAndSignUpUser,
  getSecret,
  signInUser
} from "@aws-amplify/seed";
import { Amplify } from "aws-amplify";
import * as auth from "aws-amplify/auth";

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: "utf8" }));
Amplify.configure(outputs);

const username = await getSecret("username");
const password = await getSecret("password");

// Set mfaPreference to EMAIL when using email-only MFA
const user = await createAndSignUpUser({
  username: username,
  password: password,
  signInAfterCreation: false,
  signInFlow: "MFA",
  mfaPreference: "EMAIL",
});

// Sign in will prompt for MFA code in command line
await signInUser({
  username: username,
  password: password,
  signInFlow: "MFA",
});

auth.signOut();
```

これにより、メール MFA が有効になっているユーザー名とパスワードを使用してユーザーが作成されます。その後、ユーザーがサインインし、コマンドラインで MFA コードを入力するよう求められます。

シードスクリプトを実行します

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox seed
```

SMS MFA はメール MFA と同じパターンに従い、検証にはコマンドラインプロンプトを使用します。設定で `mfaPreference: "EMAIL"` を `mfaPreference: "SMS"` に置き換えるだけです。コマンドラインの操作は同じで、メールコードの代わりに SMS コードを入力するよう求められます。

### データ

例えば、Data API をシードしたい場合は、まず認可モードが `userPool` に設定された `Todo` モデルを使用して GraphQL API を作成することから始めましょう:

```typescript title="amplify/data/resource.ts"
import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  name: "TodoApi",
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
```

次に、todo テーブルを todo でシードするために、以下のスクリプトを作成できます:

```typescript title="amplify/seed/seed.ts"
import type { Schema } from "../data/resource";
import { readFile } from "node:fs/promises";
import { getSecret, signInUser } from "@aws-amplify/seed";
import { Amplify } from "aws-amplify";
import * as auth from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: 'utf8' }));

Amplify.configure(outputs);

const dataClient = generateClient<Schema>();

const username = await getSecret("username");
const password = await getSecret("password");

await signInUser({
  username: username,
  password: password,
  signInFlow: "Password",
});

const response = await dataClient.models.Todo.create(
  {
    content: `My first todo`,
    isDone: false,
  },
  {
    authMode: "userPool",
  }
);
if (response.errors && response.errors.length > 0) {
  throw response.errors;
}

auth.signOut();
```

スクリプトは Amplify Data API クライアントを使用して API テーブルと対話し、`signInUser` 関数を使用して認証されたユーザーにサインインします。

シードスクリプトを実行します

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox seed
```

これにより、認証されたユーザーを使用して `My first todo` というコンテンツを含む todo が作成され、`isDone` フィールドが `false` に設定されます。

### ストレージ

```typescript title="amplify/storage/resource.ts"
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "myStorage",
  isDefault: true,
  access: (allow) => ({
    "pictures/*": [allow.authenticated.to(["write", "list"])],
  }),
});
```

次に、ストレージに画像をシードするために、以下のスクリプトを作成できます:

```typescript title="amplify/seed/seed.ts"
import { getSecret, signInUser } from "@aws-amplify/seed";
import { Amplify } from "aws-amplify";
import * as auth from "aws-amplify/auth";
import * as storage from "aws-amplify/storage";
import { readFile } from 'node:fs/promises';

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: 'utf8' }));
Amplify.configure(outputs);

const username = await getSecret("username");
const password = await getSecret("password");

await signInUser({
  username: username,
  password: password,
  signInFlow: "Password",
});

const uploadTask = storage.uploadData({
  data: `My first content created by ${username}`,
  path: `pictures/${Math.random().toString()}`,
});

await uploadTask.result;

const s3Items = await storage.list({
  path: "pictures/",
  options: {
    pageSize: 1000,
  },
});

console.log(s3Items.items);

auth.signOut();
```

シードスクリプトを実行します

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox seed
```

これにより、`My first content created by ${username}` というコンテンツを含む画像が作成され、ストレージの `pictures` フォルダに保存されます。

## ベストプラクティス

### 安全な認証情報

シードスクリプトでユーザー名とパスワードを使用する場合、Amplify サンドボックスシークレットを使用して認証情報を安全に保存します:

1. CLI を使用してシークレットを設定します:

```bash title="Terminal" showLineNumbers={false}
npx ampx sandbox secret set username
npx ampx sandbox secret set password
```

2. シードスクリプトでシークレットを取得します:

```typescript title="amplify/seed/seed.ts"
import { getSecret } from '@aws-amplify/seed';
   
const username = await getSecret('username');
const password = await getSecret('password');
```

### ユーザーセッション管理

操作が終わったら、常にユーザーをサインアウトします。これにより、ユーザーセッションに関する潜在的な問題を回避できます: 

```typescript title="amplify/seed/seed.ts"
import * as auth from "aws-amplify/auth";

auth.signOut();
```

`createAndSignUpUser` でユーザーを作成する場合、`signInAfterCreation` パラメータは、ユーザーが作成された後に自動的にサインインするかどうかを制御します。このパラメータはユーザーセッション管理に重要な影響を与えます:

```typescript title="amplify/seed/seed.ts"
// Create and sign in first user
const user1 = await createAndSignUpUser({
    username: 'user1@example.com',
    password: 'Password123!',
    signInAfterCreation: true
});
// At this point, user1 is signed in

// Create second user
const user2 = await createAndSignUpUser({
    username: 'user2@example.com',
    password: 'Password123!',
    signInAfterCreation: true
});
// Now user2 is signed in, and user1 has been signed out

// Create third user without auto sign-in
const user3 = await createAndSignUpUser({
    username: 'user3@example.com',
    password: 'Password123!',
    signInAfterCreation: false
});
// No user is signed in, as user2 was signed out during user3's creation
// and user3 wasn't automatically signed in
```

**注意する重要な動作:**
- `signInAfterCreation: true` を設定すると、新しく作成されたユーザーが自動的にサインインし、以前にサインインしたユーザーがサインアウトされます。
- `signInAfterCreation: false` の場合、ユーザーは作成後にサインインされません
- 同時にサインインできるユーザーは 1 人のみです

この動作は、複数のユーザーをアプリケーションにシードする場合に特に重要です。シードプロセスの最後でどのユーザーをサインアウトすべきかを慎重に管理する必要があります。

### 複数回のシード実行間でのユーザー管理

シードは、実行するたびに `createAndSignUpUser` の各インスタンスに対して新しいユーザーを作成しようとします。
複数回のシード実行で同じユーザーを使用したい場合は、`createAndSignUpUser` が重複したユーザーを作成しようとすることによって生じる可能性のあるエラーを回避するため、以下を使用します:

```typescript title="amplify/seed/seed.ts"
const username = await getSecret('username');
const password = await getSecret('password');

try {
  const user = await createAndSignUpUser({
    username: username,
    password: password,
    signInFlow: 'Password',
    signInAfterCreation: true
  });
} catch (err) {
  const error = err as Error;
  if (error.name === 'UsernameExistsError') {
    await signInUser({
      username: username,
      password: password,
      signInFlow: 'Password'
    });
  } else {
    throw err;
  }
}
```

### MFA チャレンジ処理

- サインアップチャレンジの場合、各 MFA タイプは独自の特定のチャレンジコールバックを持っています:
  - TOTP: `totpSignUpChallenge`
  - メール: `emailSignUpChallenge`
  - SMS: `smsSignUpChallenge`

- サインインの場合、すべての MFA タイプ (TOTP、メール、または SMS) で機能する単一の普遍的な `signInChallenge` コールバックがあります

重要な動作:
- コマンドラインプロンプトは、サインイン中のすべての MFA タイプで機能します
- サインアップ中、コマンドラインはメール MFA と SMS MFA でプロンプトを表示しますが、TOTP MFA では表示しません
- MFA がユーザープールで「オプション」に設定されている場合、ユーザーはパスワードフローを通じて送信されます

### TOTP に関する考慮事項

TOTP MFA を使用する場合、これらの動作に注意してください:

- 異なる TOTP インスタンスに同じ TOTP セットアップシークレットを複数回使用すると、エラーが発生します
- サインアップとサインイン (有効期限切れ前) に同じ 6 桁のパスコードを使用すると、エラーが発生します
- TOTP を使用して複数のユーザーを作成したり複数のサインインを実行したりする場合:
  - 前のパスコードが有効期限切れになるまで待機してから、新しいパスコードを生成します
  - 例にはこれを処理するためのタイムアウトが含まれています: `await new Promise((resolve) => setTimeout(resolve, 35000));`

## シード API

`@aws-amplify/seed` パッケージは、サンドボックス環境をシードするのに役立つ Amplify JS Auth API と互換性のある一連の API を提供します。

### シークレット API

シークレット API は AWS Parameter Store を使用し、`ampx sandbox secret` コマンドと互換性があります。

- **getSecret** - シークレットの名前を取得して、そのシークレットの値を返します
  ```typescript
  const secretValue = await getSecret('secretName');
  ```

- **setSecret** - シークレットの名前とその値を取得して、シークレットの名前を返します
  ```typescript
  const secretName = await setSecret('secretName', 'secretValue');
  ```

### 認証 API

認証 API を使用すると、サンドボックス環境でユーザーを作成および管理でき、Amplify JS Auth API と互換性があります。

- **createAndSignUpUser** - 渡されたプロパティに基づいてユーザーを作成します
  ```typescript
  const user = await createAndSignUpUser({
    username: 'username',
    password: 'password',
    signInAfterCreation: true,
    signInFlow: 'Password',
    userAttributes?: StandardUserAttributes // Optional user attributes
  });
  ```

- **signInUser** - ユーザー名、パスワード、サインインフローを使用してユーザーにサインインします
  ```typescript
  await signInUser({
    username: 'username',
    password: 'password',
    signInFlow: 'Password' | 'MFA',
    signInChallenge?: () => Promise<ChallengeResponse> // Optional for MFA
  });
  ```

- **addToUserGroup** - 既存のユーザーグループにユーザーを追加します
  ```typescript
  await addToUserGroup({
    username: 'username' // User to add to group
  }, 'GroupName');
  ```

### その他の型

`@aws-amplify/seed` パッケージは、これらの重要な型を提供します:

- `AuthSignUp` - ユーザーサインアップ構成の型
- `AuthUser` - ユーザーサインインの型
- `ChallengeResponse` - MFA チャレンジレスポンスの型
- `StandardUserAttributes` - サインアップ中のユーザー属性管理の型
- `AuthOutputs` - ユーザーサインアップ出力の型

MFA チャレンジコールバック型:
- `emailSignUpChallenge` - サインアップ中のメール MFA を処理します
- `smsSignUpChallenge` - サインアップ中の SMS MFA を処理します
- `totpSignUpChallenge` - サインアップ中の TOTP MFA を処理します
- `signInChallenge` - サインイン中のすべての MFA タイプの普遍的なハンドラー

これらの API の使用方法の詳細については、[Amplify JS Auth API ドキュメント](/[platform]/frontend/auth/)を参照してください。
