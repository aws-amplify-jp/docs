---
title: "リソースのタグ付け"
section: "build-a-backend/add-aws-services"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2024-10-11T16:03:58.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/add-aws-services/tagging-resources/"
---

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

タグはAWSリソースに適用されるキーと値のペアで、メタデータを保持します。タグは多くの場合、課金またはビューイングのためにリソースを分類するのに役立つメタデータでリソースを装飾するために使用されます。タグの詳細については、[AWSドキュメントのタグ付けのベストプラクティス](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/what-are-tags.html)をご覧ください。

Amplifyはデフォルトで以下のタグを適用します：

| デプロイメントタイプ | タグキー                  | タグ値                      |
|-----------------|---------------------------|--------------------------|
| sandbox         | `created-by`              | `amplify`                |
| sandbox         | `amplify:deployment-type` | `sandbox`                |
| branch          | `created-by`              | `amplify`                |
| branch          | `amplify:deployment-type` | `branch`                 |
| branch          | `amplify:app-id`          | `<your-amplify-app-id>`  |
| branch          | `amplify:branch-name`     | `<your-git-branch-name>` |

Amplifyバックエンドでは、[AWS Cloud Development Kit (CDK)](https://docs.aws.amazon.com/cdk/latest/guide/home.html)の[`Tags`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Tags.html)クラスを使用してルートレベルでタグを適用でき、これが子リソースにカスケードされます。

```ts title="amplify/backend.ts"
import { Tags } from 'aws-cdk-lib';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data
});

const tags = Tags.of(backend.stack);
// add a new tag
tags.add('my-key', 'my-value');
// remove tags
tags.remove('my-key');
```
