---
title: ユーザーグループ
description: Cognitoユーザープールに論理グループを作成し、Amplifyカテゴリにアクセスする権限をAmplifyに割り当てます。
---

You can create logical groups in Cognito User Pools and assign permissions to access resources in Amplify categories with the CLI, as well as define the relative precedence of one group to another. This can be useful for defining which users should be part of "Admins" vs "Editors", and if the users in a Group should be able to just write or write & read to a resource (AppSync, API Gateway, S3 bucket, etc). [You can also use these with `@auth` Static Groups in the GraphQL Transformer](~/cli/graphql-transformer/auth.md#static-group-authorization). Precedence helps remove any ambiguity on permissions if a user is in multiple Groups.

## ユーザーグループを作成

```bash
増幅して認証を追加
```

```console
❯ Manual configuration

Do you want to add User Pool Groups? (Use arrow keys)
❯ Yes

? Provide a name for your user pool group: Admins
? Do you want to add another User Pool Group Yes
? Provide a name for your user pool group: Editors
? Do you want to add another User Pool Group No
? Sort the user pool groups in order of preference …  (Use <shift>+<right/left> to change the order)
  Admins
  Editors
```

When asked as in the example above, you can press `Shift` on your keyboard along with the **LEFT** and **RIGHT** arrows to move a Group higher or lower in precedence. Once complete you can open `./amplify/backend/auth/userPoolGroups/user-pool-group-precedence.json` to manually set the precedence.

## グループアクセスコントロール

特定のAmplifyカテゴリについては、CRUD(Create, Read, Update)でアクセスを制限できます。 アクセス権限、認証済みユーザーに対する異なるアクセス制御を設定する (例: ゲスト) 認証済みのユーザーは、ゲストが読み取ることができる間、 & S3バケットに書き込むことができます)。 これをさらに制限して、ログイン中のユーザーが特定のユーザープールグループの一部である場合に応じて、条件付きで異なる権限を適用することができます。

```bash
増幅してストレージを追加 # コンテンツを選択
```

```console
? Restrict access by? (Use arrow keys)
  Auth/Guest Users
  Individual Groups
❯ Both
  Learn more

Who should have access?
❯ Auth and guest users

What kind of access do you want for Authenticated users?
❯ create/update, read

What kind of access do you want for Guest users?
❯ read

Select groups:
❯ Admins

What kind of access do you want for Admins users?
❯ create/update, read, delete
```

The above example uses a combination of permissions where users in the "Admins" Group have full access, Guest users can only read, and users whom are not a member of any specific Group are part of the "Authenticated" users whom have create, update, and read access. Amplify will configure the corresponding IAM policy on your behalf. Advanced users can additionally set permissions by adding a `customPolicies` key to `./amplify/backend/auth/userPoolGroups/user-pool-group-precedence.json` with custom IAM policy for a Group. This will attach an inline policy on the IAM role associated to this Group during deployment. **Note**  this is an advanced feature and only suitable if you have an understanding of AWS resources. For instance perhaps you wanted users in the "Admins" group to have the ability to Create an S3 bucket:

```json
[
    {
        "groupName": "Admins",
        "precedence": 1,
        "customPolicies": [{
          "PolicyName": "admin-group-policy",
            "PolicyDocument": {
            "Version":"2012-10-17",
            "Statement":[
                {
                  "Sid":"statement1",
                  "Effect":"Allow",
                  "Action":[
                      "s3:CreateBucket"
                  ],
                  "Resource":[
                      "arn:aws:s3:::*"
                  ]
                }
             ]
            }
        }]
    },
    {
        "groupName": "Editors",
        "precedence": 2
    }
]
```
