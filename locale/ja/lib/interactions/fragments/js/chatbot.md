## ボットにメッセージを送信する

`send()` コマンドを使用してテキストメッセージをchatbotバックエンドに送信できます。メソッドはchatbotの応答を含むpromiseを返します。

```javascript
import { Interactions } from 'aws-amplify';

let userInput = "I want to reserve a hotel for tonight";

// Provide a bot name and user input
const response = await Interactions.send("BookTrip", userInput);

// Log chatbot response
console.log(response.message);
```

## チャットメッセージの終了を表示

`onComplete()` メソッドを使用して、セッションが正常に終了したときにエラーやチャットボットの確認をキャッチする関数を登録できます。

```javascript

const handleComplete = function (err, confirmation) {
    if (err) {
        alert('bot conversation failed');
        return;
    }
    alert('done: ' + JSON.stringify(confirmation, null, 2));

    return 'Trip booked. Thank you! What would you like to do next?';
}

Interactions.onComplete(botName, handleComplete );
```