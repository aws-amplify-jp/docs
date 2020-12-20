---
title: 管理者アクション
description: Cognitoユーザープールの管理アクションをエンドユーザーアプリケーションに公開する方法を学びます。
---

一部のシナリオでは、エンドユーザーアプリケーションに管理アクションを公開したい場合があります。 例えば、 Cognitoユーザープール内のすべてのユーザーを一覧表示する機能は、ログインしたユーザーが特定のグループ「管理者」のメンバーである場合に、アプリの管理パネルに役立ちます。

> これは、基盤となるアーキテクチャを理解しなければ推奨されない高度な機能です。 作成された関連するインフラストラクチャは、特定のビジネスニーズに合わせてカスタマイズできるように設計されたベースです。 アプリが必要としない機能を削除することをお勧めします。

Amplify CLI は、アプリケーションでこれらの機能を使用したい場合は、ユーザープールへのアクセス権限が制限されて実行されている Lambda 関数へのセキュアなアクセスで REST エンドポイントを設定できます。 また、有効なアカウントを持つすべてのユーザーにアクションを公開するか、特定のユーザープールグループに制限するかを選択できます。

## 管理者クエリを有効にする

```bash
増幅して認証を追加
```

```console
? Do you want to add an admin queries API? Yes
? Do you want to restrict access to a specific Group Yes
? Select the group to restrict access with: (Use arrow keys)
❯ Admins 
  Editors 
  Enter a custom group 
```

This will configure an API Gateway endpoint with a Cognito Authorizer that accepts an Access Token, which is used by a Lambda function to perform actions against the User Pool. The function is example code which you can use to remove, add, or alter functionality based on your business case by editing it in the `./amplify/backend/function/AdminQueriesXXX/src` directory and running an `amplify push` to deploy your changes. If you choose to restrict actions to a specific Group, custom middleware in the function will prevent any actions unless the user is a member of that Group.

## 管理者クエリAPI

デフォルトのルートとそれらの関数、HTTPメソッド、および期待されるパラメータは以下です。
- `addUserToGroup`: ユーザーを特定のグループに追加します。POST ボディで `username` と `groupname` を期待します。
- `removeUserFromGroup`: 特定のグループからユーザーを削除します。POST ボディで `username` と `groupname` を期待します。
- `confirm UserSignUp`: ユーザーのサインアップを確認します。POST ボディで `username` を期待します。
- `disableUser`: ユーザを無効にします。POST ボディの `username` を期待します。
- `enableUser`: ユーザを有効にします。POST ボディの `username` を期待します。
- `getUser`: 特定のユーザー情報を取得します。 `ユーザー名` を GET クエリ文字列として期待します。
- `listUsers`: Lists all users in the current Cognito User Pool. You can provide an OPTIONAL `limit` as a GET query string, which returns a `NextToken` that can be provided as a `token` query string for pagination.
- `listGroups`: Lists all groups in the current Cognito User Pool. You can provide an OPTIONAL `limit` as a GET query string, which returns a `NextToken` that can be provided as a `token` query string for pagination.
- `listGroupsForUser`: Lists groups to which current user belongs to. Expects `username` as a GET query string. You can provide an OPTIONAL `limit` as a GET query string, which returns a `NextToken` that can be provided as a `token` query string for pagination.
- `listUsersInGroup`: Lists users that belong to a specific group. Expects `groupname` as a GET query string. You can provide an OPTIONAL `limit` as a GET query string, which returns a `NextToken` that can be provided as a `token` query string for pagination.
- `signUserOut`: Signs a user out from User Pools, but only if the call is originating from that user. Expects `username` in the POST body.

## 例

To leverage this functionality in your app you would call the appropriate route in your [JavaScript](~/lib/restapi/authz.md#cognito-user-pools-authorization), [iOS, or Android](~/sdk/api/rest.md#cognito-user-pools-authorization) application after signing in. For example to add a user "richard" to the Editors Group and then list all members of the Editors Group with a pagination limit of 10 you could use the following React code below:

```js
import React from 'react'
import Amplify, { Auth, API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

async function addToGroup() { 
  let apiName = 'AdminQueries';
  let path = '/addUserToGroup';
  let myInit = {
      body: {
        "username" : "richard",
        "groupname": "Editors"
      }, 
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      } 
  }
  return await API.post(apiName, path, myInit);
}


let nextToken;

async function listEditors(limit){
  let apiName = 'AdminQueries';
  let path = '/listUsersInGroup';
  let myInit = { 
      queryStringParameters: {
        "groupname": "Editors",
        "limit": limit,
        "token": nextToken
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
  }
  const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
  nextToken = NextToken;
  return rest;
}

function App() {
  return (
    <div className="App">
      <button onClick={addToGroup}>Add to Group</button>
      <button onClick={() => listEditors(10)}>List Editors</button>
    </div>
  );
}

export default withAuthenticator(App, true);
```
