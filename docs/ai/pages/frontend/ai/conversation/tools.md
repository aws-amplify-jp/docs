---
title: "ツール"
section: "frontend/ai/conversation"
platforms: ["javascript", "react-native", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/ai/conversation/tools/"
---

ツールにより、LLMは情報をクエリして、現在の関連情報で応答できます。これらは、ユーザーのメッセージとツールの説明に基づいてLLMが使用をリクエストした場合にのみ呼び出されます。

Amplify AIキットでLLMツールを定義する方法はいくつかあります。

1. モデルツール
2. クエリツール
3. Lambdaツール

会話ルートのツールを定義する最も簡単な方法は、データスキーマ内のデータモデルとカスタムクエリに対して`a.ai.dataTool()`を使用することです。会話ルートのツールを定義すると、Amplifyが重い処理を担当します。

* **LLMへのツール説明：** 各ツール定義は、スキーマで定義されたAmplifyモデルクエリまたはカスタムクエリです。Amplifyはそのツールに必要な入力パラメータを認識し、LLMにそれらを説明します。
* **適切なパラメータでのツール呼び出し：** LLMが必要な入力パラメータを使用してツールを使用するようリクエストした後、会話ハンドラーLambda関数がツールを呼び出し、結果をLLMに返して、会話を続行します。
* **呼び出し者のアイデンティティと認可の維持：** ツールを通じて、LLMはアプリケーションユーザーがアクセスできるデータのみにアクセスできます。LLMがツールを呼び出すようリクエストすると、ユーザーのアイデンティティで呼び出されます。たとえば、LLMがTodosをリストするクエリを呼び出したい場合、そのユーザーがアクセスできるTodoのみが返されます。

## モデルツール

データスキーマ内のモデルへの参照を含む`a.ai.dataTool()`で参照することにより、LLMにデータモデルへのアクセス権を付与できます。これには、モデルが次の認可戦略の少なくとも1つを使用する必要があります。

**[ユーザーごとのデータアクセス](/[platform]/build-a-backend/data/customize-authz/per-user-per-owner-data-access/)**
- `owner()`
- `ownerDefinedIn()`
- `ownersDefinedIn()`

**[サインインしているユーザーのデータアクセス](/[platform]/build-a-backend/data/customize-authz/signed-in-user-data-access/)**
- `authenticated()`

**[ユーザーグループごとのデータアクセス](/[platform]/build-a-backend/data/customize-authz/user-group-based-data-access/)**
- `group()`
- `groupsDefinedIn()`
- `groups()`
- `groupsDefinedIn()`

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.model({
    title: a.string(),
    body: a.string(),
  })
  .authorization(allow => allow.owner()),

  chat: a.conversation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'Hello, world!',
    tools: [
      a.ai.dataTool({
        // The name of the tool as it will be referenced in the message to the LLM
        name: 'PostQuery',
        // The description of the tool provided to the LLM.
        // Use this to help the LLM understand when to use the tool.
        description: 'Searches for Post records',
        // A reference to the `a.model()` that the tool will use
        model: a.ref('Post'),
        // The operation to perform on the model
        modelOperation: 'list',
      }),
    ],
  }),
})
```

これにより、LLMは`Post`レコードをリストおよびフィルタリングできるようになります。データスキーマには`Post`レコードの形状に関するすべての情報があるため、データツールはその情報をLLMに提供し、手動で指定する必要はありません。また、Amplify AIキットは呼び出し元のアイデンティティに基づいてツール使用リクエストを認可します。つまり、オーナーベースのモデルがある場合、LLMはユーザーのレコードのみをクエリできます。

<Callout type="info">

サポートされている唯一のモデル操作は`'list'`です。

</Callout>

## クエリツール

また、データスキーマで定義されたカスタムクエリへのアクセスをLLMに付与することもできます。そうするには、[関数またはカスタムハンドラー](/[platform]/build-a-backend/data/custom-business-logic/)を使用してカスタムクエリを定義し、そのカスタムクエリをツールとして参照します。これには、カスタムクエリが`allow.authenticated()`認可戦略を使用する必要があります。

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData, defineFunction } from "@aws-amplify/backend";

export const getWeather = defineFunction({
  name: 'getWeather',
  entry: './getWeather.ts',
  environment: {
    API_ENDPOINT: 'MY_API_ENDPOINT',
    API_KEY: secret('MY_API_KEY'),
  },
});

const schema = a.schema({
  getWeather: a.query()
    .arguments({ city: a.string() })
    .returns(a.customType({
      value: a.integer(),
      unit: a.string()
    }))
    .handler(a.handler.function(getWeather))
    .authorization((allow) => allow.authenticated()),

  chat: a.conversation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant',
    tools: [
      a.ai.dataTool({
        // The name of the tool as it will be referenced in the LLM prompt
        name: 'get_weather',
        // The description of the tool provided to the LLM.
        // Use this to help the LLM understand when to use the tool.
        description: 'Gets the weather for a given city',
        // A reference to the `a.query()` that the tool will invoke.
        query: a.ref('getWeather'),
      }),
    ]
  })
    .authorization((allow) => allow.owner()),
});
```

Amplifyデータツールは、クエリ定義に基づいてLLMに必要な入力パラメータの指定を処理します。

以下は、`getWeather`クエリのLambda関数ハンドラーの例示的な例です。

```ts title="amplify/data/getWeather.ts"
import { env } from "$amplify/env/getWeather";
import type { Schema } from "./resource";

export const handler: Schema["getWeather"]["functionHandler"] = async (
  event
) => {
  const { city } = event.arguments;
  if (!city) {
    throw new Error('City is required');
  }

  const url = `${env.API_ENDPOINT}?city=${encodeURIComponent(city)}`;
  const request = new Request(url, {
    headers: {
      Authorization: `Bearer ${env.API_KEY}`
    }
  });

  const response = await fetch(request);
  const weather = await response.json();
  return weather;
}
```

最後に、新しく定義した`getWeather`関数を含めるように**`amplify/backend.ts`**ファイルを更新する必要があります。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data, getWeather } from './data/resource';

const backend = defineBackend({
  auth,
  data,
  getWeather
});
```

### AWS サービスへの接続

カスタムクエリを定義し、関数ハンドラーでそのサービスを呼び出すことにより、任意のAWSサービスに接続できます。カスタムクエリ関数がAWSサービスを呼び出すための適切な認可を行うには、Lambdaに適切な権限を提供する必要があります。

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { getWeather } from "./functions/getWeather/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
  storage,
  getWeather
});

backend.getWeather.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    resources: ["[resource arn]",],
    actions: ["[action]"],
  }),
)
```

## カスタム Lambda ツール

会話ハンドラーAWS Lambda関数で実行されるツールを定義することもできます。これは、データスキーマに関連しないツールを定義したい場合や、Lambda関数ランタイム内で簡単なタスクを実行したい場合に便利です。

まず`@aws-amplify/backend-ai`パッケージをインストールします。

```bash title="Terminal"
npm install @aws-amplify/backend-ai
```

データスキーマでカスタム会話ハンドラー関数を定義し、`a.conversation()`定義の`handler`プロパティで関数を参照します。

```ts title="amplify/data/resource.ts"
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { defineConversationHandlerFunction } from '@aws-amplify/backend-ai/conversation';

export const chatHandler = defineConversationHandlerFunction({
  entry: './chatHandler.ts',
  name: 'customChatHandler',
  models: [
    { modelId: a.ai.model("Claude 3.5 Haiku") }
  ]
});

const schema = a.schema({
  chat: a.conversation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: "You are a helpful assistant",
    handler: chatHandler,
  })
    .authorization((allow) => allow.owner()),
})
```

実行可能なツールとハンドラーを定義します。以下は、`calculator`ツールを定義するカスタム会話ハンドラー関数の例示的な例です。

```ts title="amplify/data/chatHandler.ts"
import {
  ConversationTurnEvent,
  createExecutableTool,
  handleConversationTurnEvent
} from '@aws-amplify/backend-ai/conversation/runtime';

const jsonSchema = {
  json: {
    type: 'object',
    properties: {
      'operator': {
        'type': 'string',
        'enum': ['+', '-', '*', '/'],
        'description': 'The arithmetic operator to use'
      },
      'operands': {
        'type': 'array',
        'items': {
          'type': 'number'
        },
        'minItems': 2,
        'maxItems': 2,
        'description': 'Two numbers to perform the operation on'
      }
    },
    required: ['operator', 'operands']
  }
} as const;
// declare as const to allow the input type to be derived from the JSON schema in the tool handler definition.

const calculator = createExecutableTool(
  'calculator',
  'Returns the result of a simple calculation',
  jsonSchema,
  // input type is derived from the JSON schema
  (input) => {
    const [a, b] = input.operands;
    switch (input.operator) {
      case '+': return Promise.resolve({ text: (a + b).toString() });
      case '-': return Promise.resolve({ text: (a - b).toString() });
      case '*': return Promise.resolve({ text: (a * b).toString() });
      case '/':
        if (b === 0) throw new Error('Division by zero');
        return Promise.resolve({ text: (a / b).toString() });
      default:
        throw new Error('Invalid operator');
    }
  },
);

export const handler = async (event: ConversationTurnEvent) => {
  await handleConversationTurnEvent(event, {
    tools: [calculator],
  });
};
```

上記の`calculator`ツール例では、入力が無効な場合はエラーをスローしています。このエラーは会話ハンドラー関数によってLLMにサーフェスされます。エラーメッセージに応じて、LLMは異なる入力でツールを再度使用したり、ユーザーのテキスト応答を完了したりする場合があります。

最後に、バックエンド定義を更新して、新しく定義した`chatHandler`関数を含めます。

```ts title="amplify/backend.ts"
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data, chatHandler } from './data/resource';

defineBackend({
  auth,
  data,
  chatHandler,
});
```

### ベストプラクティス

- LLMからの入力を検証およびサニタイズしてから、アプリケーションで使用してください（例：データベースクエリで直接使用したり、`eval()`を使用して実行したりしないでください）。
- エラーを適切に処理し、意味のあるエラーメッセージを提供してください。
- ツール使用をログに記録し、監視して、潜在的な悪用や問題を検出してください。
