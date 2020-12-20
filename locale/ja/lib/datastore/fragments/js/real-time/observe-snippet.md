```js
const subscription = DataStore.observe(Post).subscribe(msg => {
  console.log(msg.model, msg.opType, msg.element);
});
```

単一のアイテムの変更を ID で観察しています。

```js
const id = '69ddcb63-7e4a-4325-b84d-8592e6dac07b';

const subscription = DataStore.observice(Post, id).subscribe(msg => {
  console.log(msg.model, msg.opType, msg.element);
});
```

サブスクリプションを終了中

```js
const subscription = DataStore.observe(Post, id).subscribe(msg => {
  console.log(msg.model, msg.opType, msg.element);
});

// サブスクリプションを終了するためにコール解除
subscribe.unsubscribe();
```

<amplify-callout>

The `observe` function is asynchronous; however, you should not use `await` like the other DataStore API methods since it is a long running task and you should make it non-blocking (i.e. code after the `DataStore.observe()` call should not wait for its execution to finish).

</amplify-callout>
