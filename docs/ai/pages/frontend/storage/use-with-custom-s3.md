---
title: "任意の S3 バケットで Amplify Storage を使用する"
section: "frontend/storage"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/storage/use-with-custom-s3/"
---

Amplify Storage API を使用すると、Amplify が作成したバケットではなく、独自の S3 バケットを使用できます。

<Callout>
**重要:** Amplify の外部の S3 バケットでストレージ API を使用するには、プロジェクトで Amplify Auth が設定されている必要があります。
</Callout>

## Amplify バックエンドでストレージリソースを使用する

### S3 バケットに必要な権限を追加する

これらの API で使用する特定の Amazon S3 バケットについて、関連する IAM ロールがそのバケットに対してデータを読み書きするための必要な権限を持っていることを確認する必要があります。

これを行うには、**Amazon S3 コンソール** > **S3 バケットを選択** > **権限** > **編集** バケットポリシーに移動します。

![Amplify コンソールにストレージタブが選択されていることを示す](/images/gen2/storage/s3-console-permissions.png)

ポリシーは以下のようになります：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Statement1",
      "Principal": { 
        "AWS": "arn:aws:iam::<AWS-account-ID>:role/<role-name>" 
      },
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::<bucket-name>",
        "arn:aws:s3:::<bucket-name>/*"
      ]
    }
  ]
}
```

`<AWS-account-ID>` を AWS アカウント ID に、`<role-name>` を Amplify Auth セットアップに関連付けられた IAM ロールに置き換えます。`<bucket-name>` を S3 バケット名に置き換えます。

バケットへのアクセスをカスタマイズする詳細については、[Amazon S3 のポリシーと権限に関するドキュメント](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-policy-language-overview.html)を参照できます。

> **Warning:** アプリケーションから手動で設定した S3 バケットに呼び出しを行うには、そのバケット用に [CORS ポリシー](/[platform]/build-a-backend/storage/extend-s3-resources/#for-manually-configured-s3-resources) も設定する必要があります。

### Amplify のバックエンドコンフィグで S3 バケットを指定する

次に、バックエンド定義オブジェクトから `addOutput` メソッドを使用して、`amplify/backend.ts` ファイルでバケットの名前とリージョンを指定して、カスタム S3 バケットを定義します。また、バックエンドに接続する適切なリソースと IAM ポリシーを設定する必要があります。

<Callout>
**重要:** このメソッドを使用して、Amplify で設定されたストレージバックエンドとカスタム S3 バケットを同時に使用できます。ただし、Amplify で設定されたストレージは**デフォルトバケット**として使用され、カスタム S3 バケットは追加のバケットとしてのみ使用されます。
</Callout>

#### S3 バケットを設定する

カスタム S3 バケットを定義するようにバックエンドを設定する例をいくつか以下に示します：

#### [ゲストユーザー]
元のバックエンドオブジェクトを拡張して、すべてのゲスト（つまり、サインインしていない）ユーザーに `public/` 下のファイルに対する読み取りアクセス権を付与する例：

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { auth } from "./auth/resource";

const backend = defineBackend({
  auth,
});
// highlight-start
const customBucketStack = backend.createStack("custom-bucket-stack");

// Import existing bucket
const customBucket = Bucket.fromBucketAttributes(customBucketStack, "MyCustomBucket", {
  bucketArn: "arn:aws:s3:::<bucket-name>",
  region: "<region>"
});

backend.addOutput({
  storage: {
    aws_region: customBucket.env.region,
    bucket_name: customBucket.bucketName,
    // optional: `buckets` can be used when setting up more than one existing bucket
    buckets: [
      {
        aws_region: customBucket.env.region,
        bucket_name: customBucket.bucketName,
        name: customBucket.bucketName,
        /*
          optional: `paths` can be used to set up access to specific 
          bucket prefixes and configure user access types to them
        */ 
        paths: {
          "public/*": {
            // "write" and "delete" can also be added depending on your use case
            guest: ["get", "list"], 
          },
        },
      }
    ]
  },
});

/*
  Define an inline policy to attach to Amplify's unauth role
  This policy defines how unauthenticated/guest users can access your existing bucket
*/ 
const unauthPolicy = new Policy(backend.stack, "customBucketUnauthPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:GetObject"],
      resources: [`${customBucket.bucketArn}/public/*`],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [
        `${customBucket.bucketArn}`,
        `${customBucket.bucketArn}/*`
      ],
      conditions: {
        StringLike: {
          "s3:prefix": ["public/", "public/*"],
        },
      },
    }),
  ],
});

// Add the policies to the unauthenticated user role
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
  unauthPolicy,
);
// highlight-end
```

#### [認証済みユーザー]
元のバックエンドオブジェクトを拡張して、すべての認証済み（つまり、サインイン済み）ユーザーに `public/` 下のファイルへのフルアクセスを付与する例：

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { auth } from "./auth/resource";

const backend = defineBackend({
  auth,
});

const customBucketStack = backend.createStack("custom-bucket-stack");

// Import existing bucket
const customBucket = Bucket.fromBucketAttributes(customBucketStack, "MyCustomBucket", {
  bucketArn: "arn:aws:s3:::<bucket-name>",
  region: "<region>"
});

backend.addOutput({
  storage: {
    aws_region: customBucket.env.region,
    bucket_name: customBucket.bucketName,
    buckets: [
      {
        aws_region: customBucket.env.region,
        bucket_name: customBucket.bucketName,
        name: customBucket.bucketName,
        paths: {
          "public/*": {
            guest: ["get", "list"],
            // highlight-start
            authenticated: ["get", "list", "write", "delete"],
            // highlight-end
          },
        },
      }
    ]
  },
});

// ... Unauthenticated/guest user policies and role attachments go here ...
// highlight-start
/*
  Define an inline policy to attach to Amplify's auth role
  This policy defines how authenticated users can access your existing bucket
*/ 
const authPolicy = new Policy(backend.stack, "customBucketAuthPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "s3:GetObject",
        "s3:PutObject", 
        "s3:DeleteObject"
      ],
      resources: [`${customBucket.bucketArn}/public/*`,],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [
        `${customBucket.bucketArn}`,
        `${customBucket.bucketArn}/*`
        ],
      conditions: {
        StringLike: {
          "s3:prefix": ["public/*", "public/"],
        },
      },
    }),
  ],
});

// Add the policies to the authenticated user role
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(authPolicy);
// highlight-end
```

#### [ユーザーグループ]
以下は、ユーザーグループの権限を使用してオリジナルバックエンドオブジェクトを拡張する例です。ここでは、すべての認証済みユーザーが `admin/` および `public/` から読み取ることができ、「admin」ユーザーグループに属する認証済みユーザーのみが `admin/` を管理できます：

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { auth } from "./auth/resource";

const backend = defineBackend({
  auth,
});

const customBucketStack = backend.createStack("custom-bucket-stack");

// Import existing bucket
const customBucket = Bucket.fromBucketAttributes(customBucketStack, "MyCustomBucket", {
  bucketArn: "arn:aws:s3:::<bucket-name>",
  region: "<region>"
});

backend.addOutput({
  storage: {
    aws_region: customBucket.env.region,
    bucket_name: customBucket.bucketName,
    buckets: [
      {
        aws_region: customBucket.env.region,
        bucket_name: customBucket.bucketName,
        name: customBucket.bucketName,
        /*
          @ts-expect-error: Amplify backend type issue
          https://github.com/aws-amplify/amplify-backend/issues/2569
        */ 
        paths: {
          "public/*": {
            authenticated: ["get", "list", "write", "delete"],
          },
          // highlight-start
          "admin/*": {
            authenticated: ["get", "list"],
            groupsadmin: ["get", "list", "write", "delete"],
          },
          // highlight-end
        },
      }
    ]
  },
});

// ... Authenticated user policy and role attachment goes here ...
// highlight-start
/*
  Define an inline policy to attach to "admin" user group role
  This policy defines how authenticated users with 
  "admin" user group role can access your existing bucket
*/ 
const adminPolicy = new Policy(backend.stack, "customBucketAdminPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "s3:GetObject",
        "s3:PutObject", 
        "s3:DeleteObject"
      ],
      resources: [ `${customBucket.bucketArn}/admin/*`],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [
        `${customBucket.bucketArn}`
        `${customBucket.bucketArn}/*`
      ],
      conditions: {
        StringLike: {
          "s3:prefix": ["admin/*", "admin/"],
        },
      },
    }),
  ],
});

// Add the policies to the "admin" user group role
backend.auth.resources.groups["admin"].role.attachInlinePolicy(adminPolicy);
// highlight-end
```

#### [オーナー]
Amplify では、ユーザーの ID を使用して個別のユーザーへのファイルアクセスをスコープできます。ユーザーの ID を指定するには、トークン `${cognito-identity.amazonaws.com:sub}` を使用できます。

以下は、元のバックエンドオブジェクトを拡張して、ゲストが `public/` フォルダーに読み取りアクセスを定義し、`protected/` フォルダーを定義する例です。誰でもアップロードされたファイルを表示できますが、ファイルオーナーのみがそれらを変更/削除できます：

```ts title="amplify/backend.ts"
import { defineBackend } from "@aws-amplify/backend";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { auth } from "./auth/resource";

const backend = defineBackend({
  auth,
});

const customBucketStack = backend.createStack("custom-bucket-stack");

// Import existing bucket
const customBucket = Bucket.fromBucketAttributes(customBucketStack, "MyCustomBucket", {
  bucketArn: "arn:aws:s3:::<bucket-name>",
  region: "<region>"
});

backend.addOutput({
  storage: {
    aws_region: customBucket.env.region,
    bucket_name: customBucket.bucketName,
    buckets: [
      {
        aws_region: customBucket.env.region,
        bucket_name: customBucket.bucketName,
        name: customBucket.bucketName,
        /*
          @ts-expect-error: Amplify backend type issue
          https://github.com/aws-amplify/amplify-backend/issues/2569
        */ 
        paths: {
          "public/*": {
            guest: ["get", "list"],
            authenticated: ["get", "list", "write", "delete"],
          },
          // highlight-start
          // allow all users to view all folders/files within `protected/`
          "protected/*": {
            guest: ["get", "list"],
            authenticated: ["get", "list"],
          },
          // allow owners to read, write and delete their own files in assigned subfolder
          "protected/${cognito-identity.amazonaws.com:sub}/*": {
            entityidentity: ["get", "list", "write", "delete"]
          }
          // highlight-end
        },
      }
    ]
  },
});
// highlight-start
/*
  Define an inline policy to attach to Amplify's unauth role
  This policy defines how unauthenticated users/guests 
  can access your existing bucket
*/ 
const unauthPolicy = new Policy(backend.stack, "customBucketUnauthPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:GetObject"],
      resources: [
        `${customBucket.bucketArn}/public/*`
        `${customBucket.bucketArn}/protected/*`
      ],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [
        `${customBucket.bucketArn}`
        `${customBucket.bucketArn}/*`
      ],
      conditions: {
        StringLike: {
          "s3:prefix": [
            "public/",
            "public/*",
            "protected/",
            "protected/*"
          ],
        },
      },
    }),
  ],
});

/*
  Define an inline policy to attach to Amplify's auth role
  This policy defines how authenticated users can access your 
  existing bucket and customizes owner access to their individual folder
*/
const authPolicy = new Policy(backend.stack, "customBucketAuthPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:GetObject"],
      resources: [
        `${customBucket.bucketArn}/public/*`
        `${customBucket.bucketArn}/protected/*`
      ],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [
        `${customBucket.bucketArn}`
        `${customBucket.bucketArn}/*`
      ],
      conditions: {
        StringLike: {
          "s3:prefix": [
            "public/",
            "public/*",
            "protected/",
            "protected/*"
          ],
        },
      },
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:PutObject"],
      resources: [
        `${customBucket.bucketArn}/public/*`
        `${customBucket.bucketArn}/protected/${cognito-identity.amazonaws.com:sub}/*`
      ],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:DeleteObject"],
      resources: [
        `${customBucket.bucketArn}/protected/${cognito-identity.amazonaws.com:sub}/*`
      ],
    }),
  ],
});

// Add the policies to the unauthenticated user role
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
  unauthPolicy,
);

// Add the policies to the authenticated user role
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(authPolicy);
// highlight-end
```

<Callout>
例で定義されたカスタム認可ルールは組み合わせることができ、Amplify で定義されたストレージと同じルールに従います。詳細については、[認可ルールのカスタマイズ](/[platform]/build-a-backend/storage/authorization/)に関するドキュメントを参照してください。
</Callout>

<!-- Platform: javascript, nextjs, react, angular, vue, react-native, android, swift -->
### 最新の `amplify_outputs.json` ファイルをインポートする

ローカルの `amplify_outputs.json` ファイルが最新であることを確認するには、[`npx ampx generate outputs` コマンド](/[platform]/reference/cli-commands/#npx-ampx-generate-outputs)を実行するか、以下に示すように Amplify コンソールから最新の `amplify_outputs.json` をダウンロードできます。

![](/images/gen2/getting-started/react/amplify-outputs-download.png)
<!-- /Platform -->

<!-- Platform: flutter -->
### 最新の `amplify_outputs.dart` ファイルをインポートする

ローカルの `amplify_outputs.dart` ファイルが最新であることを確認するには、[`npx ampx generate outputs` コマンド](/[platform]/reference/cli-commands/#npx-ampx-generate-outputs)を実行します。
<!-- /Platform -->

必要な権限を設定したので、選択した S3 バケットでストレージ API を使用開始できます。

<!-- Platform: react, angular, javascript, vue, nextjs, react-native -->
## Amplify バックエンドなしでストレージリソースを使用する

Amplify バックエンドの使用が最も簡単な方法ですが、既存のストレージリソースも Amplify Storage と統合できます。

ストレージオプションを手動で設定することに加えて、プロジェクトで Amplify Auth が適切に設定されていることと、関連する IAM ロールが既存のバケットと相互作用するための必要な権限を持っていることを確認する必要があります。[Amplify バックエンドなしで既存の認証リソースを使用する](/[platform]/build-a-backend/auth/use-existing-cognito-resources/#use-auth-resources-without-an-amplify-backend)について詳しく読んでください。

### `Amplify.configure` を使用する

既存のストレージリソースのセットアップは、リソースメタデータを `Amplify.configure` に渡すことで実現できます。これにより、Amplify Storage クライアントライブラリが追加のリソースと相互作用するように設定されます。Amplify 設定ステップをアプリケーションのライフサイクルの早期、理想的にはルートエントリポイントで追加することが推奨されます。

```ts
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    // add your auth configuration
  },
  Storage: {
    S3: {
      bucket: "<your-default-bucket-name>",
      region: "<your-default-bucket-region>",
      // default bucket metadata should be duplicated below with any additional buckets
      buckets: {
        "<your-default-bucket-friendly-name>": {
          bucketName: "<your-default-bucket-name>",
          region: "<your-default-bucket-region>",
          paths: {
            "public/*": {
              guest: ["get", "list"],
              authenticated: ["get", "list", "write", "delete"],
              groupsadmin: ["get", "list", "write", "delete"]
            },
            "protected/*": {
              guest: ["get", "list"],
              authenticated: ["get", "list"],
              groupsadmin: ["get", "list", "write", "delete"]
            }
            "protected/${cognito-identity.amazonaws.com:sub}/*": {
              entityidentity: ["get", "list", "write", "delete"]
            },
            "admin/*": {
              authenticated: ["get", "list"],
              groupsadmin: ["get", "list", "write", "delete"],
            },
          }
        },
        "<your-additional-bucket-friendly-name>": {
          bucketName: "<your-additional-bucket-name>",
          region: "<your-additional-bucket-region>",
          paths: {
            // ...
          }
        }
      }
    }
  }
});
```

### `amplify_outputs.json` を使用する

別の方法として、既存のストレージリソースは `amplify_outputs.json` ファイルを直接作成または変更することで使用できます。

```ts title="amplify_outputs.json"
{
  "auth": {
    // add your auth configuration
  },
  "storage": {
    "aws_region": "<your-default-bucket-region>", 
    "bucket_name": "<your-default-bucket-name>",
    // default bucket metadata should be duplicated below with any additional buckets
    "buckets": [
      {
        "name": "<your-default-bucket-friendly-name>", 
        "bucket_name": "<your-default-bucket-name>", 
        "aws_region": "<your-default-bucket-region>",
        "paths": {
          "public/*": {
            "guest": [
              "get",
              "list"
            ],
            "authenticated": [
              "get",
              "list",
              "write",
              "delete"
            ],
            "groupsadmin": [
              "get",
              "list",
              "write",
              "delete"
            ]
          },
          "protected/*": {
            "guest": [
              "get",
              "list"
            ],
            "authenticated": [
              "get",
              "list"
            ],
            "groupsadmin": [
              "get",
              "list",
              "write",
              "delete"
            ]
          },
          "protected/${cognito-identity.amazonaws.com:sub}/*": {
            "entityidentity": [
              "get",
              "list",
              "write",
              "delete"
            ]
          },
          "admin/*": {
            "authenticated": [
              "get",
              "list"
            ],
            "groupsadmin": [
              "get",
              "list",
              "write",
              "delete"
            ]
          }
        }
      },
      {
        "name": "<your-additional-bucket-friendly-name>",
        "bucket_name": "<your-additional-bucket-name>",
        "aws_region": "<your-additional-bucket-region>",
        "paths": {
          // add more paths for the bucket
        }
      }
    ]
  }
}
```

<!-- /Platform -->
