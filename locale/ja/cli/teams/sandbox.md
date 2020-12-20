---
title: サンドボックス環境
description: Amplifyプロジェクトでサンドボックス環境を有効にする方法については、こちらをご覧ください。
---

これで、クラウドに2つの独立した環境 (マスター & dev) があり、Gitのバックエンドインフラストラクチャコードを増幅して対応するgit ブランチがあります。 チームメンバーが同じAmplifyプロジェクトで作業したいとします。 それにいくつかの機能を追加し、変更を開発環境にプッシュして変更をテストします。 それらは次の手順を行います:

```
$ git clone <git-repo>
$ cd <project-dir>
$ git checkout -b mysandbox
$ amplify env add
? Do you want to use an existing environment? No
? Enter a name for the environment mysandbox
// Rest of init steps
// Add/update any backend configurations using amplify add/update <category>
$ amplify push
$ git push -u origin mysandbox
```

次に、チームメンバーがこれらの変更を dev と master environments/branch に移行したいとします。

```
$ git checkout dev
$ amplify env checkout dev
$ git merge mysandbox
$ amplify push
$ git push -u origin dev
```

開発段階ですべてがうまく動作することをテストした後、masterのgit ブランチに開発者をマージできるようになりました。

```
$ git checkout master
$ amplify env checkout master
$ git merge dev
$ amplify push
$ git push -u origin master
```

このアプローチで git ブランチ(dev & master)を真実のソースとして考えることができ、すべてのチームメンバーはブランチから離れ、ワークスペースを同期させる必要があります。