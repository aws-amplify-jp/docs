---
title: "モデル関係の構築"
section: "build-a-backend/data/data-modeling"
platforms: ["android", "angular", "flutter", "javascript", "nextjs", "react", "react-native", "swift", "vue"]
gen: 2
last-updated: "2025-01-10T00:17:11.000Z"
url: "https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/"
---

アプリケーションデータをモデル化する際、異なるデータモデル間の関係を確立する必要があることがよくあります。Amplify Data では、データスキーマに 1 対多、1 対 1、および多対多の関係を作成できます。クライアント側では、Amplify Data により関連データの遅延読み込みまたは事前読み込みが可能です。

<ProtectedRedactionGen2Message />

 ## 関係のタイプ

|関係|コード|説明|例|
|-|-|-|-|
|1 対多|`a.hasMany(...)` & `a.belongsTo(...)`|2 つのモデル間に 1 対多の関係を作成します。|**Team** は複数の **Members** を持ちます。**Member** は **Team** に属しています。|
|1 対 1|`a.hasOne(...)` & `a.belongsTo(...)`|2 つのモデル間に 1 対 1 の関係を作成します。|**Customer** は 1 つの **Cart** を持ちます。**Cart** は 1 つの **Customer** に属しています。|
|多対多| 結合テーブル上の 2 つの `a.hasMany(...)` & `a.belongsTo(...)`|結合テーブルで関連モデル間に 2 つの 1 対多の関係を作成します。|**Post** は複数の **Tags** を持ちます。**Tag** は複数の **Posts** を持ちます。|

## 1 対多のモデル関係を構築する

`hasMany()` メソッドと `belongsTo()` メソッドを使用して、2 つのモデル間に 1 対多の関係を作成します。以下の例では、Team は複数の Members を持ち、Member はちょうど 1 つの Team に属しています。

1. **Member** モデルで `teamId` という**参照フィールド**を作成します。この参照フィールドの型は **Team** の識別子の型と一致する**必要があります**。この場合、自動生成される `id: a.id().required()` フィールドです。
2. `teamId` フィールドを参照する `team` という**関係フィールド**を追加します。これにより、**Member** モデルからチーム情報を照会できます。
3. **Member** モデルの `teamId` フィールドを参照する `members` という**関係フィールド**を追加します。

```typescript
const schema = a.schema({
  Member: a.model({
    name: a.string().required(),
    // 1. Create a reference field
    teamId: a.id(),
    // 2. Create a belongsTo relationship with the reference field
    team: a.belongsTo('Team', 'teamId'),
  }),

  Team: a.model({
    mantra: a.string().required(),
    // 3. Create a hasMany relationship with the reference field
    //    from the `Member`s model.
    members: a.hasMany('Member', 'teamId'),
  }),
}).authorization((allow) => allow.publicApiKey());
```

### 「Has Many」関係をレコード間で作成する

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const { data: team } = await client.models.Team.create({
  mantra: 'Go Frontend!',
});

const { data: member } = await client.models.Member.create({
  name: "Tim",
  teamId: team.id,
});
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
val team = Team.builder()
    .mantra("Go Frontend!")
    .build()

Amplify.API.mutate(ModelMutation.create(team),
    {
        Log.i("MyAmplifyApp", "Added team with id: ${it.data.id}")
        val member = Member.builder()
            .name("Tim")
            .team(it.data)
            .build()

        Amplify.API.mutate(ModelMutation.create(member),
            { Log.i("MyAmplifyApp", "Added Member with id: ${it.data.id}")},
            { Log.e("MyAmplifyApp", "Create failed", it)},
        )
    }, {
        Log.e("MyAmplifyApp", "Create failed", it)
    })
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
do {
    let team = Team(mantra: "Go Frontend!")
    let createdTeam = try await Amplify.API.mutate(request: .create(team)).get()

    let member = Member(
        name: "Tim",
        team: createdTeam) // Directly pass in the team instance
    let createdMember = try await Amplify.API.mutate(request: .create(member))
} catch {
    print("Create team or member failed", error)
}
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final team = Team(mantra: "Go Frontend!");
final teamRequest = ModelMutations.create(team);
final teamResponse = await Amplify.API.mutate(request: teamRequest).response;

final member = Member(name: "Tim", team: teamResponse.data);
final memberRequest = ModelMutations.create(member);
final memberResponse = await Amplify.API.mutate(request: memberRequest).response;
```
<!-- /Platform -->

### 「Has Many」関係をレコード間で更新する

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const { data: newTeam } = await client.models.Team.create({
  mantra: 'Go Fullstack',
});

await client.models.Member.update({
  id: "MY_MEMBER_ID",
  teamId: newTeam.id,
});
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
val newTeam = Team.builder()
    .mantra("Go Fullstack!")
    .build()

Amplify.API.mutate(ModelMutation.create(newTeam),
    {
        Log.i("MyAmplifyApp", "Added team with id: ${it.data.id}")

        val updatingMember = existingMember.copyOfBuilder().team(it.data).build()

        Amplify.API.mutate(ModelMutation.update(updatingMember),
            { Log.i("MyAmplifyApp", "Updated Member with id: ${it.data.id}")},
            { Log.e("MyAmplifyApp", "Create failed", it)},
        )
    }, {
        Log.e("MyAmplifyApp", "Create failed", it)
    })
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
do {
    let newTeam = Team(mantra: "Go Fullstack!")
    let createdNewTeam = try await Amplify.API.mutate(request: .create(newTeam)).get()

    existingMember.setTeam(createdNewTeam)
    let updatedMember = try await Amplify.API.mutate(request: .update(existingMember)).get()
} catch {
    print("Create team or update member failed", error)
}
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final newTeam = Team(mantra: "Go Fullstack!");
final newTeamRequest = ModelMutations.create(team);
final newTeamResponse = await Amplify.API.mutate(request: teamRequest).response;

final memberWithUpdatedTeam = existingMember.copyWith(team: newTeamResponse.data);
final memberUpdateRequest = ModelMutations.update(memberWithUpdatedTeam);
final memberUpdateResponse = await Amplify.API.mutate(request: memberUpdateRequest).response;
```
<!-- /Platform -->

### 「Has Many」関係をレコード間で削除する

参照フィールドが必須でない場合、関係値を `null` に設定することで、1 対多の関係を「削除」できます。

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
await client.models.Member.update({
  id: "MY_MEMBER_ID",
  teamId: null,
});
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
val memberWithRemovedTeam = existingMember.copyOfBuilder().team(null).build()

Amplify.API.mutate(ModelMutation.update(memberWithRemovedTeam),
    { Log.i("MyAmplifyApp", "Updated Member with id: ${it.data.id}")},
    { Log.e("MyAmplifyApp", "Create failed", it)},
)
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
do {
    existingMember.setTeam(nil)
    let memberRemovedTeam = try await Amplify.API.mutate(request: .update(existingMember)).get()
} catch {
    print("Failed to remove team from member", error)
}
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final memberWithRemovedTeam = existingMember.copyWith(team: null);
final memberRemoveRequest = ModelMutations.update(memberWithRemovedTeam);
final memberRemoveResponse = await Amplify.API.mutate(request: memberRemoveRequest).response;
```
<!-- /Platform -->

<!-- Platform: flutter -->
### 「Has Many」関係で関連データを読み込む

```dart
// Fetch the team with the team id.
final teamRequest = ModelQueries.get<Team>(
    Team.classType, TeamModelIdentifier(id: "YOUR_TEAM_ID"));
final teamResult = await Amplify.API.query(request: teamRequest).response;
final team = teamResult.data!;

// Define a limit for your pagination
const limit = 100;

// Do the initial call to get the initial items
final firstRequest = ModelQueries.list<Member>(Member.classType,
    limit: limit, where: Member.TEAMID.eq(team.id));
final firstResult = await Amplify.API.query(request: firstRequest).response;
final firstPageData = firstResult.data;

// If there are more than 100 items you can reiterate the following code to get next pages.
if (firstPageData?.hasNextResult ?? false) {
  final secondRequest = firstPageData!.requestForNextResult;
  final secondResult =
      await Amplify.API.query(request: secondRequest!).response;
  return secondResult.data?.items ?? <Member?>[];
} else {
  // You can return the page data by calling items property.
  return firstPageData?.items ?? <Member?>[];
}
```
<!-- /Platform -->

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, swift, android -->
### 「Has Many」関係を遅延読み込みする

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const { data: team } = await client.models.Team.get({ id: "MY_TEAM_ID"});

const { data: members } = await team.members();

members.forEach(member => console.log(member.id));
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
Amplify.API.query(
    ModelQuery.get(Team::class.java, Team.TeamIdentifier("YOUR_TEAM_ID")),
    {
        suspend {
            try {
                val members =
                    when (val membersModelList = it.data.members) {
                        is LoadedModelList -> {
                            // Eager loading loads the 1st page only.
                            membersModelList.items
                        }

                        is LazyModelList -> {
                            var page = membersModelList.fetchPage()
                            var loadedMembers =
                                mutableListOf(page.items) // initial page of members
                            // loop through all pages to fetch the full list of members
                            while (page.hasNextPage) {
                                val nextToken = page.nextToken
                                page =
                                    membersModelList.fetchPage(nextToken)
                                // add the page of members to the members variable
                                loadedMembers += page.items
                            }
                            loadedMembers
                        }
                    }
                Log.i("MyAmplifyApp", "members: $members")
            } catch (error: ApiException) {
                Log.e("MyAmplifyApp", "Failed to fetch members", error)
            }
        }
    },
    { Log.e("MyAmplifyApp", "Failed to fetch team")})
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
do {
    let queriedTeam = try await Amplify.API.query(
        request: .get(
            Team.self,
            byIdentifier: team.identifier)).get()

    guard let queriedTeam, let members = queriedTeam.members else {
        print("Missing team or members")
        return
    }
    try await members.fetch()
    print("Number of members: \(members.count)")
} catch {
    print("Failed to fetch team or members", error)
}
```
<!-- /Platform -->

### 「Has Many」関係を事前読み込みする

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const { data: teamWithMembers } = await client.models.Team.get(
  { id: "MY_TEAM_ID" },
  { selectionSet: ["id", "members.*"] },
);

teamWithMembers.members.forEach(member => console.log(member.id));
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
Amplify.API.query(
    ModelQuery.get<Team, TeamPath>(
        Team::class.java,
        Team.TeamIdentifier("YOUR_TEAM_ID")
    ) { teamPath -> includes(teamPath.members) },
    {
        val members = (it.data.members as? LoadedModelList<Member>)?.items
    },
    { Log.e("MyAmplifyApp", "Failed to fetch team")}
)
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
do {
    let queriedTeamWithMembers = try await Amplify.API.query(
        request: .get(
            Team.self,
            byIdentifier: team.identifier,
            includes: { team in [team.members]}))
        .get()
    guard let queriedTeamWithMembers, let members = queriedTeamWithMembers.members else {
        print("Missing team or members")
        return
    }
    print("Number of members: \(members.count)")
} catch {
    print("Failed to fetch team with members", error)
}
```
<!-- /Platform -->
<!-- /Platform -->

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
### 「Has Many」関係で親レコード削除時の孤立した外部キーを処理する

```ts
// Get the IDs of the related members.
const { data: teamWithMembers } = await client.models.Team.get(
  { id: teamId },
  { selectionSet: ["id", "members.*"] },
);

// Delete Team
await client.models.Team.delete({ id: teamWithMembers.id });

// Delete all members in parallel
await Promise.all(
  teamWithMembers.members.map(member => 
  client.models.Member.delete({ id: member.id }) 
));
```
<!-- /Platform -->

## 「1 対 1」関係をモデル化する

`hasOne()` メソッドと `belongsTo()` メソッドを使用して、2 つのモデル間に 1 対 1 の関係を作成します。以下の例では、**Customer** は **Cart** を持ち、**Cart** は **Customer** に属しています。

1. **Cart** モデルで `customerId` という**参照フィールド**を作成します。この参照フィールドの型は **Customer** の識別子の型と一致する**必要があります**。この場合、自動生成される `id: a.id().required()` フィールドです。
2. `customerId` フィールドを参照する `customer` という**関係フィールド**を追加します。これにより、**Cart** モデルから顧客情報を照会できます。
3. **Cart** モデルの `customerId` フィールドを参照する `activeCart` という**関係フィールド**を追加します。

```typescript
const schema = a.schema({
  Cart: a.model({
    items: a.string().required().array(),
    // 1. Create reference field
    customerId: a.id(),
    // 2. Create relationship field with the reference field
    customer: a.belongsTo('Customer', 'customerId'),
  }),
  Customer: a.model({
    name: a.string(),
    // 3. Create relationship field with the reference field
    //    from the Cart model
    activeCart: a.hasOne('Cart', 'customerId')
  }),
}).authorization((allow) => allow.publicApiKey());
```

### 「Has One」関係をレコード間で作成する

「has one」関係をレコード間で作成するには、最初に親アイテムを作成し、次に子アイテムを作成して親を割り当てます。

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const { data: customer, errors } = await client.models.Customer.create({
  name: "Rene",
});

const { data: cart } = await client.models.Cart.create({
  items: ["Tomato", "Ice", "Mint"],
  customerId: customer?.id,
});
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
val customer = Customer.builder()
    .name("Rene")
    .build()

Amplify.API.mutate(ModelMutation.create(customer),
    {
        Log.i("MyAmplifyApp", "Added customer with id: ${it.data.id}")
        val cart = Cart.builder()
            .items(listOf("Tomato", "Ice", "Mint"))
            .customer(customer)
            .build()

        Amplify.API.mutate(ModelMutation.create(cart),
            { Log.i("MyAmplifyApp", "Added Cart with id: ${it.data.id}")},
            { Log.e("MyAmplifyApp", "Create failed", it)},
        )
    }, {
        Log.e("MyAmplifyApp", "Create failed", it)
    })
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
do {
    let customer = Customer(name: "Rene")
    let createdCustomer = try await Amplify.API.mutate(request: .create(customer)).get()

    let cart = Cart(
        items: ["Tomato", "Ice", "Mint"],
        customer: createdCustomer)
    let createdCart = try await Amplify.API.mutate(request: .create(cart)).get()
} catch {
    print("Create customer or cart failed", error)
}
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final customer = Customer(name: "Rene");
final customerRequest = ModelMutations.create(customer);
final customerResponse = await Amplify.API.mutate(request: customerRequest).response;

final cart = Cart(items: ["Tomato", "Ice", "Mint"], customer: teamResponse.customer);
final cartRequest = ModelMutations.create(cart);
final cartResponse = await Amplify.API.mutate(request: cartRequest).response;
```
<!-- /Platform -->

### 「Has One」関係をレコード間で更新する

「Has One」関係をレコード間で更新するには、最初に子アイテムを取得し、次に親への参照を別の親に更新します。たとえば、Cart を別の Customer に再割り当てするには：

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const { data: newCustomer } = await client.models.Customer.create({
  name: 'Ian',
});

await client.models.Cart.update({
  id: cart.id,
  customerId: newCustomer?.id,
});
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
val newCustomer = Customer.builder()
    .mantra("Ian")
    .build()

Amplify.API.mutate(ModelMutation.create(newCustomer),
    {
        Log.i("MyAmplifyApp", "Added customer with id: ${it.data.id}")

        val updatingCart = existingCart.copyOfBuilder().customer(it.data).build()

        Amplify.API.mutate(ModelMutation.update(updatingCart),
            { Log.i("MyAmplifyApp", "Updated cart with id: ${it.data.id}")},
            { Log.e("MyAmplifyApp", "Create failed", it)},
        )
    }, {
        Log.e("MyAmplifyApp", "Create failed", it)
    })
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
do {
    let newCustomer = Customer(name: "Rene")
    let newCustomerCreated = try await Amplify.API.mutate(request: .create(newCustomer)).get()
    existingCart.setCustomer(newCustomerCreated)
    let updatedCart = try await Amplify.API.mutate(request: .update(existingCart)).get()
} catch {
    print("Create customer or cart failed", error)
}
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final newCustomer = Customer(name: "Ian");
final newCustomerRequest = ModelMutations.create(newCustomer);
final newCustomerResponse = await Amplify.API.mutate(request: newCustomerRequest).response;

final cartWithUpdatedCustomer = existingCart.copyWith(customer: newCustomerResponse.data);
final cartUpdateRequest = ModelMutations.update(cartWithUpdatedCustomer);
final cartUpdateResponse = await Amplify.API.mutate(request: cartUpdateRequest).response;
```
<!-- /Platform -->

### 「Has One」関係をレコード間で削除する

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
関係フィールドを `null` に設定して、レコード間の「Has One」関係を削除できます。

```ts
await client.models.Cart.update({
  id: project.id,
  customerId: null,
});
```
<!-- /Platform -->

<!-- Platform: android -->
関係フィールドを `null` に設定して、レコード間の「Has One」関係を削除できます。

```kt
val cartWithRemovedCustomer = existingCart.copyOfBuilder().customer(null).build()

Amplify.API.mutate(ModelMutation.update(cartWithRemovedCustomer),
    { Log.i("MyAmplifyApp", "Updated cart with id: ${it.data.id}")},
    { Log.e("MyAmplifyApp", "Create failed", it)},
)
```
<!-- /Platform -->

<!-- Platform: swift -->
関係フィールドを `nil` に設定して、レコード間の「Has One」関係を削除できます。

```swift
do {
    existingCart.setCustomer(nil)
    let cartWithCustomerRemoved = try await Amplify.API.mutate(request: .update(existingCart)).get()
} catch {
    print("Failed to remove customer from cart", error)
}
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
final cartWithRemovedCustomer = existingCart.copyWith(customer: null);
final cartRemoveRequest = ModelMutations.update(cartWithRemovedCustomer);
final cartRemoveResponse = await Amplify.API.mutate(request: cartRemoveRequest).response;
```
<!-- /Platform -->

<!-- Platform: swift, flutter -->
### 「Has One」関係で関連データを読み込む

<!-- Platform: swift -->
```swift
do {
    guard let queriedCart = try await Amplify.API.query(
        request: .get(
            Cart.self,
            byIdentifier: existingCart.identifier)).get() else {
        print("Missing cart")
        return
    }

    let customer = try await queriedCart.customer
} catch {
    print("Failed to fetch cart or customer", error)
}
```
<!-- /Platform -->

<!-- Platform: flutter -->
```dart
// Fetch the cart with the cart id.
final cartRequest = ModelQueries.get<Cart>(
    Cart.classType, CartModelIdentifier(id: "MY_CART_ID"));
final cartResult = await Amplify.API.query(request: cartRequest).response;
final cart = cartResult.data!;

// Do the customer call to with the id from cart
if (cart.customerId != null) {
  final customerRequest = ModelQueries.get<Customer>(
      Customer.classType, CustomerModelIdentifier(id: cart.customerId!));
  final customerResult =
      await Amplify.API.query(request: customerRequest).response;
  final customer = customerResult.data!;
}
```
<!-- /Platform -->
<!-- /Platform -->

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android -->
### 「Has One」関係を遅延読み込みする

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const { data: cart } = await client.models.Cart.get({ id: "MY_CART_ID"});
const { data: customer } = await cart.customer();
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
Amplify.API.query(
  ModelQuery.get(Team::class.java, Team.TeamIdentifier("YOUR_TEAM_ID")),
      {
          suspend {
              try {
                  val customer = when (val customerReference = cart.customer) {
                      is LoadedModelReference -> {
                          customerReference.value
                      }

                      is LazyModelReference -> {
                          customerReference.fetchModel()
                      }
                  }
                  Log.i("MyAmplifyApp", "customer: $customer")
              } catch (error: ApiException) {
                  Log.e("MyAmplifyApp", "Failed to fetch customer", error)
              }
          }
      },
      { Log.e("MyAmplifyApp", "Failed to get team")}
)
```
<!-- /Platform -->

### 「Has One」関係を事前読み込みする

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
```ts
const { data: cart } = await client.models.Cart.get(
  { id: "MY_CART_ID" },
  { selectionSet: ['id', 'customer.*'] },
);

console.log(cart.customer.id)
```
<!-- /Platform -->

<!-- Platform: android -->
```kt
val cart = Amplify.API.query(
    ModelQuery.get<Cart, CartPath>(
        Cart::class.java,
        Cart.CartIdentifier("YOUR_CART_ID")
    ) { cartPath ->
        includes(cartPath.customer)
    },
{ val customer = (cart.customer as? LoadedModelReference)?.value },
{ Log.e("MyAmplifyApp", "Failed to fetch cart", it) })
```
<!-- /Platform -->
<!-- /Platform -->

<!-- Platform: javascript, angular, react-native, react, nextjs, vue -->
### 「Has One」関係で親レコード削除時の孤立した外部キーを処理する

```ts
// Get the customer with their associated cart
const { data: customerWithCart } = await client.models.Customer.get(
  { id: customerId },
  { selectionSet: ["id", "activeCart.*"] },
);

// Delete Cart if exists
await client.models.Cart.delete({ id: customerWithCart.activeCart.id });

// Delete the customer
await client.models.Customer.delete({ id: customerWithCart.id });
```
<!-- /Platform -->

## 「多対多」関係をモデル化する

2 つのモデル間に多対多の関係を作成するには、「結合テーブル」として機能するモデルを作成する必要があります。この「結合テーブル」は、2 つの関連エンティティ間に 2 つの 1 対多の関係を含む必要があります。たとえば、**Post** が多くの **Tags** を持ち、**Tag** が多くの **Posts** を持つという関係をモデル化するには、これら 2 つのエンティティ間の関係を表す新しい **PostTag** モデルを作成する必要があります。

```typescript
const schema = a.schema({
  PostTag: a.model({
    // 1. Create reference fields to both ends of
    //    the many-to-many relationship
    // highlight-start
    postId: a.id().required(),
    tagId: a.id().required(),
    // highlight-end
    // 2. Create relationship fields to both ends of
    //    the many-to-many relationship using their
    //    respective reference fields
    // highlight-start
    post: a.belongsTo('Post', 'postId'),
    tag: a.belongsTo('Tag', 'tagId'),
    // highlight-end
  }),
  Post: a.model({
    title: a.string(),
    content: a.string(),
    // 3. Add relationship field to the join model
    //    with the reference of `postId`
    // highlight-next-line
    tags: a.hasMany('PostTag', 'postId'),
  }),
  Tag: a.model({
    name: a.string(),
    // 4. Add relationship field to the join model
    //    with the reference of `tagId`
    // highlight-next-line
    posts: a.hasMany('PostTag', 'tagId'),
  }),
}).authorization((allow) => allow.publicApiKey());
```

## 2 つのモデル間の複数の関係をモデル化する

関係は参照フィールドによって一意に定義されます。たとえば、Post は Person モデルとの `author` と `editor` の個別の関係を持つことができます。

```typescript
const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    content: a.string().required(),
    // highlight-start
    authorId: a.id(),
    author: a.belongsTo('Person', 'authorId'),
    editorId: a.id(),
    editor: a.belongsTo('Person', 'editorId'),
    // highlight-end
  }),
  Person: a.model({
    name: a.string(),
    // highlight-start
    editedPosts: a.hasMany('Post', 'editorId'),
    authoredPosts: a.hasMany('Post', 'authorId'),
    // highlight-end
  }),
}).authorization((allow) => allow.publicApiKey());
```

クライアント側では、次のコードで関連データを取得できます：

<!-- Platform: javascript, angular, react-native, react, nextjs, vue, android, flutter -->
```ts
const client = generateClient<Schema>();

const { data: post } = await client.models.Post.get({ id: "SOME_POST_ID" });

const { data: author } = await post?.author();
const { data: editor } = await post?.editor();
```
<!-- /Platform -->

<!-- Platform: swift -->
```swift
 do {
    guard let queriedPost = try await Amplify.API.query(
        request: .get(
            Post.self,
            byIdentifier: post.identifier)).get() else {
        print("Missing post")
        return
    }

    let loadedAuthor = try await queriedPost.author
    let loadedEditor = try await queriedPost.editor
} catch {
    print("Failed to fetch post, author, or editor", error)
}
```
<!-- /Platform -->

## 識別子でソートキーを持つモデルのモデル関係

データモデルが識別子でソートキーを使用する場合、関連データモデルにも参照フィールドを追加し、ソートキーフィールドを保存する必要があります：

```ts
const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    content: a.string().required(),
    // Reference fields must correspond to identifier fields.
    // highlight-start
    authorName: a.string(),
    authorDoB: a.date(),
    // Must pass references in the same order as identifiers.
    author: a.belongsTo('Person', ['authorName', 'authorDoB']),
    // highlight-end
  }),
  Person: a.model({
    name: a.string().required(),
    dateOfBirth: a.date().required(),
    // Must reference all reference fields corresponding to the
    // identifier of this model.
    authoredPosts: a.hasMany('Post', ['authorName', 'authorDoB']),
    // highlight-next-line
  }).identifier(['name', 'dateOfBirth']),
}).authorization((allow) => allow.publicApiKey());
```

## 関係を必須または任意にする

Amplify Data の関係は参照フィールドを使用して、関係が必須か任意かを判断します。参照フィールドを必須としてマークした場合、2 つのモデル間の関係を「削除」することはできません。代わりに、関連レコード全体を削除する必要があります。

```ts
const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    content: a.string().required(),
    // You must supply an author when creating the post
    // Author can't be set to `null`.
    // highlight-next-line
    authorId: a.id().required(),
    author: a.belongsTo('Person', 'authorId'),
    // You can optionally supply an editor when creating the post.
    // Editor can also be set to `null`.
    // highlight-next-line
    editorId: a.id(),
    editor: a.belongsTo('Person', 'editorId'),
  }),
  Person: a.model({
    name: a.string(),
    // highlight-start
    editedPosts: a.hasMany('Post', 'editorId'),
    authoredPosts: a.hasMany('Post', 'authorId'),
    // highlight-end
  }),
}).authorization((allow) => allow.publicApiKey());
```
