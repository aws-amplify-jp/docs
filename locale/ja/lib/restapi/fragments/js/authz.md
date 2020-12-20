## 要求ヘッダー

REST エンドポイントを使用する場合、権限目的でリクエストヘッダーを設定する必要がある場合があります。 これは、 `custom_header` 関数を設定に渡すことで行います。

```javascript
Amplify.configure({
  API: {
    endpoints: [
      {
        name: "sampleCloudApi",
        endpoint: "https://xyz.execute-api.us-east-1.amazonaws.com/Development",
        custom_header: async () => { 
          return { Authorization : 'token' } 
          // Alternatively, with Cognito User Pools use this:
          // return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
          // return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
        }
      }
    ]
  }
});
```

## アクセストークンまたはIDトークンの使用に関する注意

IDトークンには、名前、電子メール、電話番号などの認証済みユーザーの身元に関する主張が含まれています。 たとえば、 [Amplify CLI](https://docs.amplify.aws/cli/usage/lambda-triggers#override-id-token-claims)を使用するなど、カスタムクレームも含まれる可能性があります。 Amplify認証カテゴリでは、以下を使用してIDトークンを取得できます。

```javascript
(await Auth.currentSession()).getIdToken().getJwtToken();
```

アクセストークンにはスコープとグループが含まれており、許可されたリソースへのアクセスを許可するために使用されます。 [これはカスタムスコープを有効にするためのチュートリアルです。](https://aws.amazon.com/premiumsupport/knowledge-center/cognito-custom-scopes-api-gateway/). アクセストークンを取得するには

```javascript
(await Auth.currentSession()).getAccessToken().getJwtToken();
```

## HTTP リクエストヘッダーのカスタマイズ

HTTP リクエストでカスタムヘッダーを使用するには、まず Amazon API Gateway に追加する必要があります。 ヘッダーの設定についての詳細は、 [Amazon API Gateway Developer Guide](http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html) をご覧ください。

Amplify CLI を使用して API を作成した場合、上記の手順でカスタムヘッダーを有効にできます。

1. [Amazon API Gateway console](https://aws.amazon.com/api-gateway/) を参照してください。
3. Amazon API Gateway コンソールで、設定したいパスをクリックします (例 /{proxy+})
4. *アクション* のドロップダウンメニューをクリックし、 **CORS を有効にする** を選択します。
5. 「Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,my-custom-header」のように、テキストフィールドAccess-Control-Allow-Headersにカスタムヘッダーを追加します。
6. 「CORSを有効にし、既存のCORSヘッダーを置き換え」をクリックして確認します。
7. Finally, similar to step 3, click the Actions drop-down menu and then select **Deploy API**. Select **Development** on deployment stage and then **Deploy**. (Deployment could take a couple of minutes).

## 未認証リクエスト

API カテゴリを使用して、認証を必要としないAPI Gateway エンドポイントにアクセスできます。 この場合、Amazon Cognito Identity Pool設定で認証されていないIDを許可する必要があります。 詳細については、 [Amazon Cognito Developer Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html#enable-or-disable-unauthenticated-identities) をご覧ください。


## Cognito User Pools Authorization

認証APIによって提供されるJWTトークンを使用して、 <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html" target="_blank">カスタムオーサライザ</a>を使用してAPI Gatewayに対して直接認証することができます。

```javascript
async function postData() { 
    const apiName = 'MyApiName';
    const path = '/path';
    const myInit = { 
      headers: { 
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
    };

    return await API.post(apiName, path, myInit);
}

postData();
```

> 上記の例「Authorization」のヘッダ名は、API Gatewayの設定時に選択したものに依存することに注意してください。
