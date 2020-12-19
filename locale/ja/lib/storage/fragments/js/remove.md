ストレージバケットから保存されたデータを削除します。

## パブリックレベルの削除

```javascript
Storage.remove('test.txt')
    .then(result => console.log(result))
    .catch(err => console.log(err));
```

## 保護されたレベル削除

```javascript
Storage.remove('test.txt', { level: 'protected' })
    .then(result => console.log(result))
    .catch(err => console.log(err));
```

## プライベートレベル削除

```javascript
Storage.remove('test.txt', { level: 'private' })
    .then(result => console.log(result))
    .catch(err => console.log(err));
```