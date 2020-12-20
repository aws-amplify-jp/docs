## カスタムGraphQL変換 & ディレクティブのオーサリング

このセクションでは、カスタム GraphQL 変圧器を記述するプロセスを概説します。 `graphql-transform` パッケージは、GraphQL SDLドキュメントの入力として取り込む軽量フレームワークとして機能し、 **GraphQL Transformer** のリストを提供し、入力スキーマによって定義されたデータモデルを完全に実装するクラウドフォーメーションドキュメントを返します。 GraphQL 変換器は、コンテキストを操作するディレクティブと関数のセットを定義し、入力スキーマでそのディレクティブが見つかるたびに呼び出されるクラスです。

たとえば、AWS Amplify CLI は GraphQL Transform を次のように呼び出します。

```js
import GraphQLTransform from 'graphql-transformer-core'
import DynamoDBModelTransformer from 'graphql-dynamodb-transformer'
import ModelConnectionTransformer from 'graphql-connection-transformer'
import ModelAuthTransformer from 'graphql-auth-transformer'
import AppSyncTransformer from 'graphql-appsync-transformer'
import VersionedModelTransformer from 'graphql-versioned-transformer'

// Note: This is not exact as we are omitting the @searchable transformer.
const transformer = new GraphQLTransform({
    transformers: [
        new AppSyncTransformer(),
        new DynamoDBModelTransformer(),
        new ModelAuthTransformer(),
        new ModelConnectionTransformer(),
        new VersionedModelTransformer()
    ]
})
const schema = `
type Post @model {
    id: ID!
    title: String!
    comments: [Comment] @connection(name: "PostComments")
}
type Comment @model {
    id: ID!
    content: String!
    post: Post @connection(name: "PostComments")
}
`
const cfdoc = transformer.transform(schema);
const out = await createStack(cfdoc, name, region)
console.log('Application creation successfully started. It may take a few minutes to finish.')
```

`GraphQLTransform` クラスの上に示すように、トランスのリストを取得し、後で GraphQL SDLドキュメントをCloudFormationドキュメントに変換することができます。

### トランスフォームのライフサイクル

At a high level the `GraphQLTransform` takes the input SDL, parses it, and validates the schema is complete and satisfies the directive definitions. It then iterates through the list of transformers passed to the transform when it was created and calls `.before()` if it exists. It then walks the parsed AST and calls the relevant transformer methods (e.g. `object()`, `field()`, `interface()` etc) as directive matches are found. In reverse order it then calls each transformer's `.after()` method if it exists, and finally returns the context's finished template.

ここでは、 `const cfdoc = transformer.transform(schema);` がどのように動作するかの擬似コードを示します。

```js
function transform(schema: string): Template {

    // ...

    for (const transformer of this.transformers) {
        // Run the before function one time per transformer.
        if (isFunction(transformer.before)) {
            transformer.before(context)
        }
        // Transform each definition in the input document.
        for (const def of context.inputDocument.definitions as TypeDefinitionNode[]) {
            switch (def.kind) {
                case 'ObjectTypeDefinition':
                    this.transformObject(transformer, def, context)
                    // Walk the fields and call field transformers.
                    break
                case 'InterfaceTypeDefinition':
                    this.transformInterface(transformer, def, context)
                    // Walk the fields and call field transformers.
                    break;
                case 'ScalarTypeDefinition':
                    this.transformScalar(transformer, def, context)
                    break;
                case 'UnionTypeDefinition':
                    this.transformUnion(transformer, def, context)
                    break;
                case 'EnumTypeDefinition':
                    this.transformEnum(transformer, def, context)
                    break;
                case 'InputObjectTypeDefinition':
                    this.transformInputObject(transformer, def, context)
                    break;
                // Note: Extension and operation definition nodes are not supported.
                default:
                    continue
            }
        }
    }
    // After is called in the reverse order as if they were popping off a stack.
    let reverseThroughTransformers = this.transformers.length - 1;
    while (reverseThroughTransformers >= 0) {
        const transformer = this.transformers[reverseThroughTransformers]
        if (isFunction(transformer.after)) {
            transformer.after(context)
        }
        reverseThroughTransformers -= 1
    }
    // Return the template.
    // In the future there will likely be a formatter concept here.
    return context.template
}
```

### トランスフォーマーのコンテキスト

トランスコンテキストは、トランスによって操作されるアキュムレータのように機能します。コードを参照して、どのようなメソッドが利用可能か を確認してください。

[https://github.com/aws-amplify/amplify-cli/blob/7f0cb11915fa945ad9d518e8f9a8f74378fef5de/packages/graphql-transformer-core/src/TransformerContext.ts](https://github.com/aws-amplify/amplify-cli/blob/7f0cb11915fa945ad9d518e8f9a8f74378fef5de/packages/graphql-transformer-core/src/TransformerContext.ts)

> 今のところ、この変換はクラウドフォーメーションのみをサポートし、 `cloudform` というライブラリを使用して、コード内のクラウドフォーメーションリソースを作成します。 今後はterraformのような代替展開メカニズムを支援していきたいと考えています。

### 例

例として、@versioned 変換器の実装方法を説明しましょう。まず最初に、変換器のディレクティブを定義します。

```js
const VERSINED_DIRECTIVE = `
    ディレクティブ @versioned(versionField: String = "version", versionInput: String = "expectedVersionVersion") on OBJECT
`
```

`@versioned` ディレクティブは `OBJECT` 型の定義に適用でき、API の変更にオブジェクトのバージョン管理と競合の検出を自動的に追加します。 例えば、

```graphql
# Any mutations that deal with the Post type will ask for an `expectedVersion`
# input that will be checked using DynamoDB condition expressions.
type Post @model @versioned {
    id: ID!
    title: String!
    version: Int!
}
```

> Note: @versioned depends on @model so we must pass `new DynamoDBModelTransformer()` before `new VersionedModelTransformer()`. Also note that `new AppSyncTransformer()` must go first for now. In the future we can add a dependency mechanism and topologically sort it ourselves.

The next step after defining the directive is to implement the transformer's business logic. The `graphql-transformer-core` package makes this a little easier by exporting a common class through which we may define transformers. Users extend the `Transformer` class and implement the required functions.

```js
export class Transformer {
    before?: (acc: TransformerContext) => void
    after?: (acc: TransformerContext) => void
    object?: (definition: ObjectTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void
    interface?: (definition: InterfaceTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void
    field?: (
        parent: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode,
        definition: FieldDefinitionNode,
        directive: DirectiveNode,
        acc: TransformerContext) => void
    argument?: (definition: InputValueDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void
    union?: (definition: UnionTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void
    enum?: (definition: EnumTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void
    enumValue?: (definition: EnumValueDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void
    scalar?: (definition: ScalarTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void
    input?: (definition: InputObjectTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void
    inputValue?: (definition: InputValueDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => void
}
```

Since our `VERSIONED_DIRECTIVE` only specifies `OBJECT` in its **on** condition, we only **NEED* to implement the `object` function. You may also implement the `before` and `after` functions which will be called once at the beginning and end respectively of the transformation process.

```js
/**
 * Users extend the Transformer class and implement the relevant functions.
 */
export class VersionedModelTransformer extends Transformer {

    constructor() {
        super(
            'VersionedModelTransformer',
            VERSIONED_DIRECTIVE
        )
    }

    /**
     * When a type is annotated with @versioned enable conflict resolution for the type.
     *
     * Usage:
     *
     * type Post @model @versioned(versionField: "version", versionInput: "expectedVersion") {
     *   id: ID!
     *   title: String
     *   version: Int!
     * }
     *
     * Enabling conflict resolution automatically manages a "version" attribute in
     * the @model type's DynamoDB table and injects a conditional expression into
     * the types mutations that actually perform the conflict resolutions by
     * checking the "version" attribute in the table with the "expectedVersion" passed
     * by the user.
     */
    public object = (def: ObjectTypeDefinitionNode, directive: DirectiveNode, ctx: TransformerContext): void => {
        // @versioned may only be used on types that are also @model
        const modelDirective = def.directives.find((dir) => dir.name.value === 'model')
        if (!modelDirective) {
            throw new InvalidDirectiveError('Types annotated with @versioned must also be annotated with @model.')
        }

        const isArg = (s: string) => (arg: ArgumentNode) => arg.name.value === s
        const getArg = (arg: string, dflt?: any) => {
            const argument = directive.arguments.find(isArg(arg))
            return argument ? valueFromASTUntyped(argument.value) : dflt
        }

        const versionField = getArg('versionField', "version")
        const versionInput = getArg('versionInput', "expectedVersion")
        const typeName = def.name.value

        // Make the necessary changes to the context
        this.augmentCreateMutation(ctx, typeName, versionField, versionInput)
        this.augmentUpdateMutation(ctx, typeName, versionField, versionInput)
        this.augmentDeleteMutation(ctx, typeName, versionField, versionInput)
        this.stripCreateInputVersionedField(ctx, typeName, versionField)
        this.addVersionedInputToDeleteInput(ctx, typeName, versionInput)
        this.addVersionedInputToUpdateInput(ctx, typeName, versionInput)
        this.enforceVersionedFieldOnType(ctx, typeName, versionField)
    }

    // ... Implement the functions that do the real work by calling the context methods.
}
```
## VS コード拡張

コードスニペットを取得し、Amplify APIのコード補完を自動的に行うには、 [VSCODE拡張](https://marketplace.visualstudio.com/items?itemName=aws-amplify.aws-amplify-vscode) を追加します。 
