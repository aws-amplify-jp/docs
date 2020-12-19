指定されたパスの下のリストキーと、 `lastModified` タイムスタンプです。

## 公開レベルリスト

```javascript
Storage.list('photos/') // 接頭辞なしですべてのファイルを一覧表示するには、 '' instead
    .then(result => console.log(result))
    .catch(err => console.log(err));
```

Note the trailing slash `/` - if we had requested `Storage.list('photos')` it would also match against files like `photos123.jpg` alongside `photos/123.jpg`.

結果の形式は次のようになります。

```js
[
  {
    eTag: ""30074401292215403a42b0739f3b5262"",
    key: "123.png",
    lastModified: "Thu Oct 08 2020 23:59:31 GMT+0800 (Singapore Standard Time)",
    size: 138256
  },
  // ...
]
```

Manually created folders will show up as files with a `size` of 0, but you can also match keys against a regex like `file.key.match(/\.[0-9a-z]+$/i)` to distinguish files vs folders. Since "folders" are a virtual concept in S3, any file may declare any depth of folder just by having a `/` in its name. If you need to list all the folders, you'll have to parse them accordingly to get an authoritative list of files and folders:

```js
  function processStorageList(result) {
    let files = []
    let folders = new Set()
    result.forEach(res => {
      if (res.size) {
        files.push(res)
        // sometimes files declare a folder with a / within then
        let possibleFolder = res.key.split('/').slice(0,-1).join('/')
        if (possibleFolder) folders.add(possibleFolder)
      } else {
        folders.add(res.key)
      }
    })
    return {files, folders}
  }
```

代わりにネストされたオブジェクトの点でファイルとフォルダが必要な場合（例えば、 エクスプローラUIを構築するには、再帰的に解析することができます。

```js
  function processStorageList(results) {
    const filesystem = {}
    // https://stackoverflow.com/questions/44759750/how-can-i-create-a-nested-object-representation-of-a-folder-structure
    const add = (source, target, item) => {
      const elements = source.split("/");
      const element = elements.shift();
      if (!element) return // blank
      target[element] = target[element] || {__data: item}// element;
      if (elements.length) {
        target[element] = typeof target[element] === "object" ? target[element] : {};
        add(elements.join("/"), target[element], item);
      }
    };
    results.forEach(item => add(item.key, filesystem, item));
    return filesystem
  }
```

これにより、各アイテムのデータは特別な `__data` キーの中に配置されます。

## 保護されたレベル リスト

現在のユーザーのオブジェクトを一覧表示するには:

```javascript
Storage.list('photos/', { level: 'protected' })
    .then(result => console.log(result))
    .catch(err => console.log(err));
```

他のユーザーのオブジェクトを取得するには:

```javascript
保管庫。 ist('photos/', { 
    level: 'protected', 
 identityId: 'xxxxxxx' // そのユーザの identityId 
    })
})
. hen(result => console.log(result))
.catch(err => console.log(err));
```

## プライベートレベルリスト

```javascript
Storage.list('photos/', { level: 'private' })
    .then(result => console.log(result))
    .catch(err => console.log(err));
```
