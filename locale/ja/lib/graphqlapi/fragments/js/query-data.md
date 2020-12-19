## Using Amplify GraphQL Client

The API category provides a GraphQL client for working with queries, mutations, and subscriptions.

### Query Declarations

The Amplify CLI codegen automatically generates all possible GraphQL statements (queries, mutations and subscriptions) and for JavaScript applications saves it in `src/graphql` folder

```javascript
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';
```

### Simple Query

Running a GraphQL query is simple. Import the generated query and execute it with `API.graphql`:

```javascript
import { API } from 'aws-amplify';
import * as queries from './graphql/queries';

// Simple query
const allTodos = await API.graphql({ query: queries.listTodos });
console.log(allTodos); // result: { "data": { "listTodos": { "items": [/* ..... */] } } }

// Query using a parameter
const oneTodo = await API.graphql({ query: queries.getTodo, variables: { id: 'some id' }});
```

The TypeScript signature of API.graphql returns a `Promise | Observable`. [For now](https://github.com/aws-amplify/amplify-js/issues/6369), you need to assert the type before `await`ing:

```typescript
const allTodos = await (API.graphql({ query: queries.listTodos }) as Promise<ListTodoResult>);
```

You can optionally import the `graphqlOperation` helper function to help you construct this argument object:

```javascript
import { API, graphqlOperation } from 'aws-amplify';

const oneTodo = await API.graphql(graphqlOperation(queries.getTodo, { id: 'some id' }));
// equivalent to 
// const oneTodo = await API.graphql({ query: queries.getTodo, variables: { id: 'some id' }}));
```

### Custom authorization mode

By default, each AppSync API will be set with a default authorization mode when you configure your app. If you would like to override the default authorization mode, you can do so by passing in an `authMode` property. For example, this is useful when you have public reads via API Key auth and authenticated reads via IAM auth.

#### Query with custom authorization mode

```js
import { API } from 'aws-amplify';
import * as queries from './graphql/queries';

const todos = await API.graphql({
  query: queries.listTodos,
  authMode: 'AWS_IAM'
});
```

## Filtered and Paginated Queries

As your data grows, you will want to do pagination and filtering at the AppSync level instead of on the client. Fortunately, this is already built in to `API.graphql`, but you need to understand the schema of these queries. [This is explained in the AppSync docs](https://docs.aws.amazon.com/appsync/latest/devguide/using-your-api.html), but here we will translate them to the `API.graphql` equivalent.

You can find the input schemas in the Docs pane of the GraphQL explorer or inside your autogenerated `/graphql` folder. They look like this:

```graphql
listProducts(
  filter: ModelTodoFilterInput
  limit: Int
  nextToken: String): ModelTodoConnection

input ModelTodoFilterInput {
    id: ModelIDInput
    priority: ModelIntInput
    # ... all your other Todo fields here
    and: [ModelTodoFilterInput]
    or: [ModelTodoFilterInput]
    not: ModelTodoFilterInput
}
```

### Filtering Queries

Those input types in your schema indicate what kinds of filtering you can perform on them. For example, an integer field like `ModelIntInput` has this schema:

```graphql
input ModelIntInput {
    ne: Int # "not equal to"
    eq: Int # "equal to"
    le: Int # "less than or equal to"
    lt: Int # "less than"
    ge: Int # "greater than or equal to"
    gt: Int # "greater than"
    between: [Int]
    attributeExists: Boolean
    attributeType: ModelAttributeTypes
}
```

These vary based on the type of the field, but are linked to corresponding [DynamoDB queries](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Condition.html).

```js
// Query with filters, limits, and pagination
let filter = {
    priority: {
        eq: 1 // filter priority = 1
    }
};
await API.graphql({ query: listProducts, variables: { filter: filter}}));
```

### Compound Filters

You can combine filters with `and`, `or`, and `not` boolean logic. Observe, in the autogenerated schema above, that `ModelTodoFilterInput` is recursive in respect to those fields. So if, for example, you wanted to filter for `priority` values of 1 OR 2, you would do this:

```js
let filter = {
      or: [{ priority: {eq:1} },
           { priority: {eq:2} }]
  };
await API.graphql({ query: listProducts, variables: { filter: filter}}));
```

Note that querying for `priority` of 1 AND 2 would return no results, because this is boolean logic instead of natural language.

### Paginating Queries

Pagination in AppSync is done by making a request with a `limit`, and getting back a `nextToken` in order to get a cursor for the next page in your query:

```js
// page 1 of query
const { data: { listProducts: { items: itemsPage1, nextToken } } } = await API.graphql({ query: listProducts, variables: { limit: 20, /* add filter as needed */ }}));
// // we are assuming that `listProducts` includes a query for `nextToken`, which is the case for autogenerated GraphQL query strings.

// page 2 of query
const { data: { listProducts: { items: itemsPage2 } } } = await API.graphql({ query: listProducts, variables: { limit: 20, nextToken }}));
```

A `nextToken` is a very long string that looks like `"eyJ2ZXJzaW9uejE1a2RPanZPQzFCMlFTdGNxdUFBQUJxekNDQWFjR0NTcUdTSWIzRFFFSEJxQ0NBWmd3Z2dHVUFnRUFNSUlCalFZSktvWklodmNOQVFjQk1CNEdDV0NHU0FGbEF3UUJMakFSQkF5eEtWQjUvTlJxS2o5ZHBYc0NBUkNBZ2dGZUZFNW1MbTRkb25BOUg0U0FpOGhSZ1lucmRndmQz"` which represents the cursor to the starting item of the next query made with these filters.

### Frequently Asked Questions

- There is no API to get a total page count at this time. Note that scanning all items is a [potentially expensive operation](https://github.com/aws-amplify/amplify-js/issues/2901).
- Sorting is [available in DataStore](https://docs.amplify.aws/lib/datastore/data-access/q/platform/js#predicates) but not in AppSync.
- AppSync schemas do not follow the edges/nodes of the [Relay spec](https://relay.dev/docs/en/graphql-server-specification.html) but are spiritually similar.
- You [cannot query by `page` number](https://github.com/aws-amplify/amplify-cli/issues/5086), you have to query by `nextToken`.

## Using AWS AppSync SDK

The following documentation outlines how to use the Apollo client with AWS AppSync and important client APIs to understand. For sample code to use in your JavaScript framework such as React, Vue, etc. or to open issues with the SDK please see the [AppSync Apollo client SDK GitHub repository](https://github.com/awslabs/aws-mobile-appsync-sdk-js/).

**Configuration**

The AWS SDKs support configuration through a centralized file called `aws-exports.js` that defines your AWS regions and service endpoints. You obtain this file in one of two ways, depending on whether you are creating your AppSync API in the AppSync console or using the Amplify CLI.

* If you are creating your API in the console, navigate to the `Getting Started` page, and follow the steps in the `Integrate with your app` section. The `aws-exports.js` file you download is already populated for your specific API. Place the file in the `src` directory of your JavaScript project.

* If you are creating your API with the Amplify CLI (using `amplify add api`), the `aws-exports.js` file is automatically downloaded and updated each time you run `amplify push` to update your cloud resources. The file is placed in the `src` directory that you choose when setting up your JavaScript project.

**Code Generation**

To execute GraphQL operations in JavaScript you need to have GraphQL statements (for example, queries, mutations, or subscriptions) to send over the network to the server. You can optionally run a code generation process to do this for you. The Amplify CLI toolchain makes this easy by automatically pulling down your schema and generating default GraphQL queries, mutations, and subscriptions. If your client requirements change, you can alter these GraphQL statements and your JavaScript project will automatically pick them up. You can also generate TypeScript definitions with the CLI and regenerate your types.

**AppSync APIs Created in the Console**

After installing the Amplify CLI open a terminal, go to your JavaScript project root, and then run the following:

```bash
amplify init
amplify add codegen --apiId XXXXXX
```

The `XXXXXX` is the unique AppSync API identifier that you can find in the console in the root of your API's integration page. When you run this command you can accept the defaults, which create a `./src/graphql` folder structure with your statements.

**AppSync APIs Created Using the CLI**

Navigate in your terminal to a JavaScript project directory and run the following:

```bash
amplify init     ## Select JavaScript as your platform
amplify add api  ## Select GraphQL, API key, "Single object with fields Todo application"
```

Select *GraphQL* when prompted for service type:

```console
? Please select from one of the below mentioned services (Use arrow keys)
❯ GraphQL
  REST
```

The `add api` flow above will ask you some questions, such as if you already have an annotated GraphQL schema. If this is your first time using the CLI select **No** and let it guide you through the default project **"Single object with fields (e.g., “Todo” with ID, name, description)"** as it will be used in the code examples below. Later on, you can always change it.

Name your GraphQL endpoint and select authorization type:

```console
? Please select from one of the below mentioned services GraphQL
? Provide API name: myTodosApi
? Choose an authorization type for the API (Use arrow keys)
❯ API key
  Amazon Cognito User Pool
```

<amplify-callout> AWS AppSync API keys expire seven days after creation, and using API KEY authentication is only suggested for development. To change AWS AppSync authorization type after the initial configuration, use the `$ amplify update api` command and select `GraphQL`. </amplify-callout>

When you update your backend with *push* command, you can go to [AWS AppSync Console](http://console.aws.amazon.com/appsync/home) and see that a new API is added under *APIs* menu item:

```bash
amplify push
```

The `amplify push` process will prompt you to enter the codegen process and walk through configuration options. Accept the defaults and it will create a `./src/graphql` folder structure with your documents. You also will have an `aws-exports.js` file that the AppSync client will use for initialization. At any time you can open the AWS console for your new API directly by running the following command:

```bash
amplify console api
```

When prompted, select **GraphQL**. This will open the AWS AppSync console for you to run Queries, Mutations, or Subscriptions at the server and see the changes in your client app.

#### Dependencies

To use AppSync in your JavaScript project, add in the following dependencies:

```bash
npm install aws-appsync graphql-tag
```

Or, if you're using Yarn:

```bash
yarn add aws-appsync graphql-tag
```

#### Client Initialization

In your app's entry point, import the AWS AppSync Client and instantiate it.

```javascript
import gql from 'graphql-tag';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from './aws-exports';

const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY, // or type: awsconfig.aws_appsync_authenticationType,
    apiKey: awsconfig.aws_appsync_apiKey,
  }
});
```

#### Run a Query

Now that the client is configured, you can run a GraphQL query. The syntax is `client.query({ query: QUERY})` which returns a `Promise` you can optionally `await` on. The `QUERY` is a GraphQL document you can write yourself or use the statements which `amplify codegen` created automatically. For example, if you have a `ListTodos` query, your code will look like the following:

```javascript
import { listTodos } from './graphql/queries';

client.query({
  query: gql(listTodos)
}).then(({ data: { listTodos } }) => {
  console.log(listTodos.items);
});
```

If you want to change the `fetchPolicy` to something like `cache-only` and not retrieve data over the network, you need to wait for the cache to be hydrated (instantiate an in-memory object from storage for the Apollo cache to use).

```javascript
import { listTodos } from './graphql/queries';

(async () => { 
  await client.hydrated();

  const result = await client.query({
    query: gql(listTodos),
    fetchPolicy: 'cache-only',
  });
  console.log(result.data.listTodos.items);
})();
```

We recommend leaving the default of `fetchPolicy: 'cache-and-network` for usage with AppSync.
