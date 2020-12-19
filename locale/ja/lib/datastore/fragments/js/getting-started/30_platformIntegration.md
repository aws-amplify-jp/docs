最も早い方法は、 `amplify-app` npx スクリプトを使用することです。 <iframe src="https://www.youtube-nocookie.com/embed/wH-UnQy1ltM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen mark="crwd-mark"></iframe>
<br/>

<amplify-block-switcher> <amplify-block name="React">

[Create React app](https://create-react-app.dev) から開始

```bash
npx create-react-app amplify-datastore --use-npm
cd anplify-datastore
npx anplify-app@latest
```

</amplify-block> <amplify-block name="React Native">

[React Native CLI](https://reactnative.dev/docs/getting-started) から開始

```bash
npx react-native init AmplifyDatastoreRN
cd AmplifyDatastoreRN
npx anplify-app@latest
npm install @react-native-community/netinfo
```

また、iOS 用の pod 依存関係をインストールする必要があります。

```sh
npx pod-install
```
</amplify-block> </amplify-block-switcher>
