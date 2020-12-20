## オプションの進行状況ハンドラとオプションの使用

Sumerian シーンの外観と動作を設定するには、メソッド呼び出しで `sceneOptions` パラメーターを使用します。

```javascript
async loadAndStartScene() {
    const progressCallback = (progress) => {
        console.log(`Sumerian scene load progress: ${progress * 100}%`);
    }

    const sceneOptions = {
        progressCallback
    }

    await XR.loadScene("scene1", "sumerian-scene-dom-id", sceneOptions);
    XR.start("scene1");
}
```

## シーン情報の取得

You can check the loading status of the scene with *isSceneLoaded* method. Also, you can use *isMuted* method to retrieve audio information about the loaded scene:

```javascript
if (XR.isSceneLoaded('scene1')) {

    if (XR.isMuted('scene1')) {
        // シーンはミュートされています
        XR.setMuted('scene1', false) // ミュート解除
    }

}
```

## VR モードに入っています

互換性のあるデバイスでは、シーンの VR モードを有効にできます。 ユーザがコントローラを取り付けてVRモードに入ると、VRコントローラコンポーネントは3D空間でその位置を追跡します。

<amplify-callout> VRを入力するには、ユーザーの入力、すなわちボタンを押したり、同様にする必要があります。 </amplify-callout>

```javascript
if (XR.isSceneLoaded('scene1')) {

    if (XR.isVRCapable('scene1')) {
        XR.enterVR('scene1')
    }

}
```

## オーディオイベントのキャプチャ

XR Category's scene controller emits audio-related events during scene playback. You can subscribe to those events with `XR.onSceneEvent` and provide audio controls in your app, e.g.: providing a *volume on* button when the browser audio is disabled.

```javascript

XR.onSceneEvent('scene1', 'AudioEnabled', () => console.log('Audio is enabled') );
XR.onSceneEvent('scene1', 'AudioDisabled', () => console.log('Audio is disabled') ));

```

## オーディオの有効化

一部のブラウザでは、ユーザーが入力するまでオーディオの再生が無効になります。 シーンでオーディオを確実に有効にするには、マウスクリックやスクリーンタッチなど、ユーザーが最初に入力するまでお待ちください。 そして、 `enableAudio()` メソッドをシーン名で呼び出します。

<amplify-callout> ブラウザが自動再生をブロックしている場合 ユーザーの入力が与えられていない場合、シーンが初めてオーディオを再生しようとしたときに、オーディオ無効化イベントがスローされます </amplify-callout>

```javascript
XR.enableAudio('scene1')
```

