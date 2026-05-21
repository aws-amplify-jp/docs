---
title: "生成"
section: "frontend/ai"
platforms: ["javascript", "react-native", "angular", "nextjs", "react", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/ai/generation/"
---

AI生成ルートは、AIモデルから構造化された出力を生成するために使用されるリクエスト・レスポンスAPIです。生成ルートの例には、以下が含まれます：
- 非構造化入力から生成された構造化データ
- 要約

<Callout type="info">
サポートされているAIモデルのリストについては、[サポートされているプロバイダーとモデル](/[platform]/ai/concepts/models/#supported-providers-and-models)を参照してください。
</Callout>

内部的には、生成ルートはAWSAppSyncクエリであり、AIモデルがルート用に定義されたレスポンスタイプで応答することを保証します。

## 型指定されたオブジェクトの生成

```ts title="Schema Definition"
const schema = a.schema({
  generateRecipe: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant that generates recipes.',
  })
    .arguments({ description: a.string() })
    .returns(
      a.customType({
        name: a.string(),
        ingredients: a.string().array(),
        instructions: a.string(),
      })
    )
    .authorization((allow) => allow.authenticated())
});
```

<!-- Platform: javascript,angular,vue -->
```ts title="Data Client Request"
const description = 'I would like to bake a birthday cake for my friend. She has celiac disease and loves chocolate.'
const { data, errors } = await client.generations
  .generateRecipe({ description })

/**
Example response:
{
  "name": "Gluten-Free Chocolate Birthday Cake",
  "ingredients": [
    "gluten-free all-purpose flour",
    "cocoa powder",
    "granulated sugar",
    "baking powder",
    "baking soda",
    "salt",
    "eggs",
    "milk",
    "vegetable oil",
    "vanilla extract"
  ],
  "instructions": "1. Preheat oven to 350°F. Grease and flour two 9-inch round baking pans.\n2. In a medium bowl, whisk together the gluten-free flour, cocoa powder, sugar, baking powder, baking soda and salt.\n3. In a separate bowl, beat the eggs. Then add the milk, oil and vanilla and mix well.\n4. Gradually add the wet ingredients to the dry ingredients and mix until just combined. Do not over mix.\n5. Divide the batter evenly between the prepared pans.\n6. Bake for 30-35 minutes, until a toothpick inserted in the center comes out clean.\n7. Allow cakes to cool in pans for 10 minutes, then transfer to a wire rack to cool completely.\n8. Frost with your favorite gluten-free chocolate frosting."
}
*/
```
<!-- /Platform -->

<!-- Platform: react,react-native,next-js -->
```tsx
import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIGeneration } = createAIHooks(client);

export default function Example() {
  // data is React state and will be populated when the generation is returned
  const [{ data, isLoading }, generateRecipe] =
    useAIGeneration("generateRecipe");

  const generateSummary = async () => {
    generateRecipe({
      description: 'I would like to bake a birthday cake for my friend. She has celiac disease and loves chocolate.',
    });
  };
}
```
<!-- /Platform -->

## スカラー型の生成

```ts title="Schema Definition"
const schema = ({
  summarize: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'Provide an accurate, clear, and concise summary of the input provided'
  })
  .arguments({ input: a.string() })
  .returns(a.string())
  .authorization((allow) => allow.guest()),
});
```

```ts title="Data Client Request"
const { data: summary, errors } = await client.generations
  .summarize({ input })
```

## 推論パラメータの設定

AIモデルの推論パラメータを設定することで、レスポンス生成に影響を与えることができます。
レスポンスのランダム性と多様性を制御するこの機能は、ニーズに合わせたレスポンスを生成するのに役立ちます。

[推論パラメータの詳細情報](/[platform]/ai/concepts/inference-configuration)。

```ts title="Inference Parameters"
const schema = a.schema({
  generateHaiku: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant that generates haikus.',
    // highlight-start
    inferenceConfiguration: {
      maxTokens: 1000,
      temperature: 0.5,
      topP: 0.9,
    }
    // highlight-end
  }),
});
```

## 制限事項

### 1. 生成ルートはモデルの参照をサポートしていません

たとえば、以下のスキーマは`Recipe`モデルを定義していますが、このモデルを生成ルートの戻り値の型として使用することはできません。

```ts title="Invalid Model Reference"
const schema = a.schema({
  Recipe: a.model({
    name: a.string(),
    ingredients: a.string().array(),
    instructions: a.string(),
  }),
  generateRecipe: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant that generates recipes.',
  })
    .arguments({ description: a.string() })
    .returns(a.ref('Recipe')) // ❌ Invalid
    .authorization((allow) => allow.authenticated()),
});
```

ただし、カスタム型は参照できます。生成ルートの戻り値の型として使用できるカスタム型の例を次に示します。

```ts title="Valid Custom Type Reference"
const schema = a.schema({
  Recipe: a.customType({
    name: a.string(),
    ingredients: a.string().array(),
    instructions: a.string(),
  }),
  generateRecipe: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant that generates recipes.',
  })
    .arguments({ description: a.string() })
    .returns(a.ref('Recipe')) // ✅ Valid
    .authorization((allow) => allow.authenticated()),
});
```

### 2. 生成ルートは一部の必須型をサポートしていません。

以下のAppSyncスカラー型は、レスポンス型の**必須**フィールドとしてサポートされていません：
- `AWSEmail`
- `AWSDate`
- `AWSTime`
- `AWSDateTime`
- `AWSTimestamp`
- `AWSPhone`
- `AWSURL`
- `AWSIPAddress`

```ts title="Unsupported Required Type"
const schema = a.schema({
  generateUser: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant that generates users.',
  })
    .arguments({ description: a.string() })
    .returns(
      a.customType({
        name: a.string(),
        email: a.email().required(), // ❌ Required field with unsupported type
        dateOfBirth: a.date().required(), // ❌ Required field with unsupported type
      })
    )
    .authorization((allow) => allow.authenticated()),
});
```
