---
title: "レスポンスコンポーネント"
section: "frontend/ai/conversation"
platforms: ["nextjs", "react"]
gen: 2
last-updated: "2026-03-25T17:40:00.000Z"
url: "https://docs.amplify.aws/react/frontend/ai/conversation/response-components/"
---

レスポンスコンポーネントは、AIアシスタントが応答できるカスタムUIコンポーネントです。レスポンスコンポーネントを使用すると、テキスト入力と出力だけでなく、より豊かな会話インターフェースを構築できます。

## 動作の仕組み

`AIConversation`コンポーネントはレスポンスコンポーネントを受け取り、それらを[ツール](/[platform]/frontend/ai/conversation/tools)設定に変換してLLMに送信します。ツール設定は、ユーザーメッセージがバックエンドに送信されるときに送信され、バックエンド Lambda がクライアントから来るツールと任意の[スキーマツール](/[platform]/frontend/ai/conversation/tools)をマージします。LLM は特定の入力/プロップを持つUIコンポーネント「ツール」を呼び出せることを認識します。LLM がレスポンスコンポーネントツールの使用を選択すると、レスポンスコンポーネント名とプロップを含むメッセージがクライアントに送信されます。その後、`AIConversation`コンポーネントは、LLM が送信するプロップを使用して提供された React コンポーネントをレンダリングしようとします。

重要なのは、LLM はブラウザに送信されて評価される生コードを書いていないということです。

## 構造

`AIConversation`コンポーネントの`responseComponents`プロップは、キーがコンポーネント名で値がコンポーネント定義である名前付きオブジェクトを受け取ります。

レスポンスコンポーネントには以下があります：

* `description`: コンポーネントの説明。より詳細な説明ほど、より使いやすくなります
* `component`: レンダリングする React コンポーネント。コンポーネントのプロップはプロップと一致する必要があります
* `props`: React コンポーネントの[JSONSchema形式](https://json-schema.org/understanding-json-schema/reference)のプロップ

```tsx
<AIConversation
  // highlight-start
  responseComponents={{
    WeatherCard: {
      description: "Used to display the weather to the user",
      component: ({ city }) => {
        return (
          <div>{city}</div>
        )
      },
      props: {
        city: {
          type: "string",
          required: true,
          description: "The name of the city to display the weather for",
        },
      },
    },
  }}
  // highlight-end
/>
```

## アシスタントへのコンテキストの返却

ユーザーがクライアントから AI アシスタントにメッセージを送信するときに、オプションでメッセージとともに`aiContext`を送信できます。`aiContext`は、AI アシスタントがより良く応答するのに役立つクライアントアプリケーションの現在の状態に関する情報です。`aiContext`は、ユーザーの名前や、現在いるページなどのアプリケーションの現在の状態などのことが考えられます。AI コンテキストは、次のユーザーメッセージとともに AI アシスタントに文字列化されて送信されるプレーンオブジェクトです。

`aiContext`を使用して、レスポンスコンポーネントにレンダリングされた内容を AI アシスタントに知らせ、より適切に応答できるようにコンテキストを提供できます。

会話を続けて、次のメッセージに対して会話にコンテキストを追加することは、UI コンポーネントがプロップに含まれていない状態とデータも持つことができるため、役立つことができます。

```tsx
// Create a context to share state across components
// highlight-start
const DataContext = React.createContext<{
  data: any;
  setData: (value: React.SetStateAction<any>) => void;
}>({ data: {}, setData: () => {} });

function WeatherCard({ city }: { city: string }) {
  const { setData } = React.useContext(DataContext);

  React.useEffect(() => {
    // fetch some weather data
    // set the data context
    setData({ 
      city,
      // weather info
    })
  },[city])

  return (
    <div>{city}</div>
  )
}
// highlight-start

function Chat() {
  const { data } = React.useContext(DataContext);
  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation('chat');

  return (
    <AIConversation
      messages={messages}
      isLoading={isLoading}
      handleSendMessage={sendMessage}
      responseComponents={{
        WeatherCard: {
          component: WeatherCard,
          description: "Used to display the weather to the user",
          props: {
            city: {
              type: "string",
              required: true,
              description: "The name of the city to display the weather for",
            },
          },
        }
      }}
      // highlight-start
      aiContext={() => {
        return {
          ...data,
        };
      }}
      // highlight-end
    />
  );
}

export default function Example() {
  const [data, setData] = React.useState({});
  return (
    <Authenticator>
      <DataContext.Provider value={{ data, setData }}>
        <Chat />
      </DataContext.Provider>
    </Authenticator>
  )
}
```

## フォールバック

レスポンスコンポーネントは React コード内で実行時に定義されていますが、会話履歴はデータベースに保存されているため、もう存在しないレスポンスコンポーネントを持つメッセージが会話履歴に含まれる場合があります。これらの状況に対処するために、`FallbackResponseComponent`プロップを使用できます。

```tsx
<AIConversation
  // highlight-start
  FallBackResponseComponent={(props) => {
    return <>{JSON.stringify(props)}</>
  }}
  // highlight-end
/>
```
