---
title: 上書き & リゾルバのカスタマイズ
description: GraphQLリゾルバは型のスキーマ内のフィールドをデータソースに接続します。 リゾルバは要求が満たされるメカニズムです。Amplifyでカスタムリゾルバを上書きまたは追加する方法を学びます。
---

## リゾルバを上書きする

単純な *schema.graphql* があるとします。

```graphql
type Todo @model {
  id: ID!
  name: String!
  description: String
}
```

and you want to change the behavior of request mapping template for the *Query.getTodo* resolver that will be generated when the project compiles. To do this you would create a file named `Query.getTodo.req.vtl` in the *resolvers* directory of your API project. The next time you run `amplify push` or `amplify api gql-compile`, your resolver template will be used instead of the auto-generated template. You may similarly create a `Query.getTodo.res.vtl` file to change the behavior of the resolver's response mapping template.

## カスタムリゾルバ

### @modelからDynamoDBテーブルをターゲットとするカスタムリゾルバを追加します

This is useful if you want to write a more specific query against a DynamoDB table that was created by *@model*. For example, assume you had this schema with two *@model* types and a pair of *@connection* directives.

```graphql
type Todo @model {
  id: ID!
  name: String!
  description: String
  comments: [Comment] @connection(name: "TodoComments")
}
type Comment @model {
  id: ID!
  content: String
  todo: Todo @connection(name: "TodoComments")
}
```

This schema will generate resolvers for *Query.getTodo*, *Query.listTodos*, *Query.getComment*, and *Query.listComments* at the top level as well as for *Todo.comments*, and *Comment.todo* to implement the *@connection*. Under the hood, the transform will create a global secondary index on the Comment table in DynamoDB but it will not generate a top level query field that queries the GSI because you can fetch the comments for a given todo object via the *Query.getTodo.comments* query path. If you want to fetch all comments for a todo object via a top level query field i.e. *Query.commentsForTodo* then do the following:

* 希望するフィールドを *schema.graphql* に追加します。

```graphql
// ... Todo and Comment types from above

type CommentConnection {
  items: [Comment]
  nextToken: String
}
type Query {
  commentsForTodo(todoId: ID!, limit: Int, nextToken: String): CommentConnection
}
```

* Add a resolver resource to a stack in the *stacks/* directory. The `DataSourceName` is auto-generated. In most cases, it'll look like `{MODEL_NAME}Table`. To confirm the data source name, you can verify it from within the **AppSync Console** (`amplify console api`) and clicking on the **Data Sources** tab.

```
{
  // ... The rest of the template
  "Resources": {
    "QueryCommentsForTodoResolver": {
      "Type": "AWS::AppSync::Resolver",
      "Properties": {
        "ApiId": {
          "Ref": "AppSyncApiId"
        },
        "DataSourceName": "CommentTable",
        "TypeName": "Query",
        "FieldName": "commentsForTodo",
        "RequestMappingTemplateS3Location": {
          "Fn::Sub": [
            "s3://${S3DeploymentBucket}/${S3DeploymentRootKey}/resolvers/Query.commentsForTodo.req.vtl",
            {
              "S3DeploymentBucket": {
                "Ref": "S3DeploymentBucket"
              },
              "S3DeploymentRootKey": {
                "Ref": "S3DeploymentRootKey"
              }
            }
          ]
        },
        "ResponseMappingTemplateS3Location": {
          "Fn::Sub": [
            "s3://${S3DeploymentBucket}/${S3DeploymentRootKey}/resolvers/Query.commentsForTodo.res.vtl",
            {
              "S3DeploymentBucket": {
                "Ref": "S3DeploymentBucket"
              },
              "S3DeploymentRootKey": {
                "Ref": "S3DeploymentRootKey"
              }
            }
          ]
        }
      }
    }
  }
}
```

* リゾルバテンプレートを書き込みます。

```
## Query.commentsForTodo.req.vtl **

#set( $limit = $util.defaultIfNull($context.args.limit, 10) )
{
  "version": "2017-02-28",
  "operation": "Query",
  "query": {
    "expression": "#connectionAttribute = :connectionAttribute",
    "expressionNames": {
        "#connectionAttribute": "commentTodoId"
    },
    "expressionValues": {
        ":connectionAttribute": {
            "S": "$context.args.todoId"
        }
    }
  },
  "scanIndexForward": true,
  "limit": $limit,
  "nextToken": #if( $context.args.nextToken ) "$context.args.nextToken" #else null #end,
  "index": "gsi-TodoComments"
}
```

```
## Query.commentsForTodo.res.vtl **

$util.toJson($ctx.result)
```

### AWS Lambda関数をターゲットとするカスタムリゾルバを追加する

速度は高速として便利です 安全な環境で任意のコードを実行できますが、複雑なビジネスロジックを書く場合は、AWSのラムダ関数を呼び出すのと同じように簡単に呼び出すことができます。 方法は次のとおりです。

* First create a function by running `amplify add function`. The rest of the example assumes you created a function named "echofunction" via the `amplify add function` command. If you already have a function then you may skip this step.

* AWS Lambda 関数を呼び出すフィールドを schema.graphql に追加します。

```graphql
type Query {
  echo(msg: String): String
}
```

* スタックの *リソース* ブロックに、関数を AppSync データソースとして追加します。

```
"EchoLambdaDataSource": {
  "Type": "AWS::AppSync::DataSource",
  "Properties": {
    "ApiId": {
      "Ref": "AppSyncApiId"
    },
    "Name": "EchoFunction",
    "Type": "AWS_LAMBDA",
    "ServiceRoleArn": {
      "Fn::GetAtt": [
        "EchoLambdaDataSourceRole",
        "Arn"
      ]
    },
    "LambdaConfig": {
      "LambdaFunctionArn": {
        "Fn::Sub": [
          "arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:echofunction-${env}",
          { "env": { "Ref": "env" } }
        ]
      }
    }
  }
}
```

* スタックの *リソース* ブロックに代わってラムダ関数を呼び出すことを可能にするAWS IAMロールを作成します。

```
"EchoLambdaDataSourceRole": {
  "Type": "AWS::IAM::Role",
  "Properties": {
    "RoleName": {
      "Fn::Sub": [
        "EchoLambdaDataSourceRole-${env}",
        { "env": { "Ref": "env" } }
      ]
    },
    "AssumeRolePolicyDocument": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "Service": "appsync.amazonaws.com"
          },
          "Action": "sts:AssumeRole"
        }
      ]
    },
    "Policies": [
      {
        "PolicyName": "InvokeLambdaFunction",
        "PolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Effect": "Allow",
              "Action": [
                "lambda:invokeFunction"
              ],
              "Resource": [
                {
                  "Fn::Sub": [
                    "arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:echofunction-${env}",
                    { "env": { "Ref": "env" } }
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```

* スタックの *リソース* ブロックに AppSync リゾルバを作成します。

```
"QueryEchoResolver": {
  "Type": "AWS::AppSync::Resolver",
  "Properties": {
    "ApiId": {
      "Ref": "AppSyncApiId"
    },
    "DataSourceName": {
      "Fn::GetAtt": [
        "EchoLambdaDataSource",
        "Name"
      ]
    },
    "TypeName": "Query",
    "FieldName": "echo",
    "RequestMappingTemplateS3Location": {
      "Fn::Sub": [
        "s3://${S3DeploymentBucket}/${S3DeploymentRootKey}/resolvers/Query.echo.req.vtl",
        {
          "S3DeploymentBucket": {
            "Ref": "S3DeploymentBucket"
          },
          "S3DeploymentRootKey": {
            "Ref": "S3DeploymentRootKey"
          }
        }
      ]
    },
    "ResponseMappingTemplateS3Location": {
      "Fn::Sub": [
        "s3://${S3DeploymentBucket}/${S3DeploymentRootKey}/resolvers/Query.echo.res.vtl",
        {
          "S3DeploymentBucket": {
            "Ref": "S3DeploymentBucket"
          },
          "S3DeploymentRootKey": {
            "Ref": "S3DeploymentRootKey"
          }
        }
      ]
    }
  }
}
```

* プロジェクトの *リゾルバ* ディレクトリにリゾルバテンプレートを作成します。

**resolvers/Query.echo.req.vtl**

```
{
    "version": "2017-02-28",
    "operation": "Invoke",
    "payload": {
        "type": "Query",
        "field": "echo",
        "arguments": $utils.toJson($context.arguments),
        "identity": $utils.toJson($context.identity),
        "source": $utils.toJson($context.source)
    }
}
```

**resolvers/Query.echo.res.vtl**

```
$util.toJson($ctx.result)
```

`amplify` を実行した後、AppSyncコンソールを `amplify apiコンソール` で開き、この簡単なクエリでAPIをテストします。

```
query {
  echo(msg:"Hello, world!")
}
```

### @searchable によって作成された Elasticsearch ドメインをターゲットとするカスタム地理位置情報検索リゾルバを追加します。

位置情報検索機能を API に追加するには、 *@searchable* ディレクティブを *@model* 型に追加します。

```graphql
type Todo @model @searchable {
  id: ID!
  name: String!
  description: String
  comments: [Comment] @connection(name: "TodoComments")
}
```

The next time you run `amplify push`, an Amazon Elasticsearch domain will be created and configured such that data automatically streams from DynamoDB into Elasticsearch. The *@searchable* directive on the Todo type will generate a *Query.searchTodos* query field and resolver but it is not uncommon to want more specific search capabilities. You can write a custom search resolver by following these steps:

* 関連するロケーションと検索フィールドをスキーマに追加します。

```graphql
type Comment  @model {
  id: ID!
  content: String
  todoID: ID!
}
type Location {
  lat: Float
  lon: Float
}
type Todo @model @searchable {
  id: ID!
  name: String!
  description: String
  comments: [Comment] @connection(name: "TodoComments")
  location: Location
}
type TodoConnection {
  items: [Todo]
  nextToken: String
}
input LocationInput {
  lat: Float
  lon: Float
}
type Query {
  nearbyTodos(location: LocationInput!, km: Int): TodoConnection
}
```

* スタックの *リソース* ブロックにリゾルバレコードを作成します。

```
"QueryNearbyTodos": {
    "Type": "AWS::AppSync::Resolver",
    "Properties": {
        "ApiId": {
            "Ref": "AppSyncApiId"
        },
        "DataSourceName": "ElasticSearchDomain",
        "TypeName": "Query",
        "FieldName": "nearbyTodos",
        "RequestMappingTemplateS3Location": {
            "Fn::Sub": [
                "s3://${S3DeploymentBucket}/${S3DeploymentRootKey}/resolvers/Query.nearbyTodos.req.vtl",
                {
                    "S3DeploymentBucket": {
                        "Ref": "S3DeploymentBucket"
                    },
                    "S3DeploymentRootKey": {
                        "Ref": "S3DeploymentRootKey"
                    }
                }
            ]
        },
        "ResponseMappingTemplateS3Location": {
            "Fn::Sub": [
                "s3://${S3DeploymentBucket}/${S3DeploymentRootKey}/resolvers/Query.nearbyTodos.res.vtl",
                {
                    "S3DeploymentBucket": {
                        "Ref": "S3DeploymentBucket"
                    },
                    "S3DeploymentRootKey": {
                        "Ref": "S3DeploymentRootKey"
                    }
                }
            ]
        }
    }
}
```

* リゾルバテンプレートを書き込みます。

```
## Query.nearbyTodos.req.vtl
## Objects of type Todo will be stored in the /todo index

#set( $indexPath = "/todo/doc/_search" )
#set( $distance = $util.defaultIfNull($ctx.args.km, 200) )
{
    "version": "2017-02-28",
    "operation": "GET",
    "path": "$indexPath.toLowerCase()",
    "params": {
        "body": {
            "query": {
                "bool" : {
                    "must" : {
                        "match_all" : {}
                    },
                    "filter" : {
                        "geo_distance" : {
                            "distance" : "${distance}km",
                            "location" : $util.toJson($ctx.args.location)
                        }
                    }
                }
            }
        }
    }
}
```

```
## Query.nearbyTodos.res.vtl

#set( $items = [] )
#foreach( $entry in $context.result.hits.hits )
  #if( !$foreach.hasNext )
    #set( $nextToken = "$entry.sort.get(0)" )
  #end
  $util.qr($items.add($entry.get("_source")))
#end
$util.toJson({
  "items": $items,
  "total": $ctx.result.hits.total,
  "nextToken": $nextToken
})
```

* `amplify push` を実行する

Amazon Elasticsearchドメインのデプロイには時間がかかる場合があります。 Elasticsearchで解除しようとしている機能を確認するには、この時間をお読みください。

[Elasticsearch 入門](https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html)

* アップデートが完了したら、オブジェクトを作成する前に、Elasticsearch インデックス マッピングを更新します。

An index mapping tells Elasticsearch how it should treat the data that you are trying to store. By default, if we create an object with field `"location": { "lat": 40, "lon": -40 }`, Elasticsearch will treat that data as an *object* type when in reality we want it to be treated as a *geo_point*. You use the mapping APIs to tell Elasticsearch how to do this.

Make sure you tell Elasticsearch that your location field is a *geo_point* before creating objects in the index because otherwise you will need delete the index and try again. Go to the [Amazon Elasticsearch Console](https://console.aws.amazon.com/es/home) and find the Elasticsearch domain that contains this environment's GraphQL API ID. Click on it and open the kibana link. To get kibana to show up you need to install a browser extension such as [AWS Agent](https://addons.mozilla.org/en-US/firefox/addon/aws-agent/) and configure it with your AWS profile's public key and secret so the browser can sign your requests to kibana for security reasons. Once you have kibana open, click the "Dev Tools" tab on the left and run the commands below using the in browser console.

```
# 存在しない場合は /todo インデックスを作成する
PUT /todo

# 位置フィールドが geo_point であることを Elasticsearch に伝える
PUT /todo/_mapping/doc
{
    "properties": {
        "location": {
            "type": "geo_point"
        }
    }
}
```

* API を使用してオブジェクトを作成し、すぐにそれらを検索します。

Elasticsearch インデックス マッピングを更新した後、 `api コンソール` を増幅する AWS AppSync コンソールを開き、これらのクエリを試してみてください。

```graphql
mutation CreateTodo {
  createTodo(input:{
    name: "Todo 1",
    description: "The first thing to do",
    location: {
      lat:43.476446,
      lon:-110.767786
    }
  }) {
    id
    name
    location {
      lat
      lon
    }
    description
  }
}

query NearbyTodos {
  nearbyTodos(location: {
    lat: 43.476546,
    lon: -110.768786
  }, km: 200) {
    items {
      id
      name
      location {
        lat
        lon
      }
    }
  }
}
```

When you run *Mutation.createTodo*, the data will automatically be streamed via AWS Lambda into Elasticsearch such that it nearly immediately available via *Query.nearbyTodos*.
