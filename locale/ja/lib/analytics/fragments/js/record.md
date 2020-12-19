## カスタムイベントの記録

カスタムイベントを記録するには、 `レコード` メソッドを呼び出します。

```javascript
Analytics.record({ name: 'albumVisit' });
```

## 属性を持つカスタムイベントを記録

The `record` method lets you add additional attributes to an event. For example, to record *artist* information with an *albumVisit* event:

```javascript
Analytics.record({
    name: 'albumVisit', 
    // 属性値は文字列でなければなりません
    属性: { genre: '', artist: '' }
});
```

属性値は `String` 型または文字列の配列でなければなりません。

## レコードエンゲージメントメトリック

イベントにデータを追加することもできます。

```javascript
Analytics.record({
    name: 'albumVisit', 
    attributes: {}, 
    metrics: { minutesListened: 30 }
});
```

メトリック値は、float や integer のような `数値` 型でなければなりません。

## 分析を無効にする

解析の無効化または再度有効化することもできます。
```javascript
// to disable Analytics
Analytics.disable();

// to enable Analytics
Analytics.enable();
```