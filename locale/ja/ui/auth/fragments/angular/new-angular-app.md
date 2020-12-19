新しいAngularアプリを起動するには、 [Angular CLI](https://github.com/angular/angular-cli) を使用してください。

```bash
npm install -g @angular/cli
ng new myAmplifyProject
cd myAmplifyProject
```

### Angular 6+ Support

現在、Angular(6+)の最新バージョンでは、以前のバージョンで提供されていた「global」または「プロセス」のシムは含まれていません。 以下を `polyfills.ts` ファイルに追加して再作成します。

```javascript
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
};
``` 