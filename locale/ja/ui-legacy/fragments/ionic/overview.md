## Ionic 4 コンポーネント
The Angular components included in this library can optionally be presented with Ionic-specific styling.  To do so, simply include the `AmplifyIonicModule` alongside the `AmplifyAngularModule`.  Then, pass in `framework="Ionic"` into the component.

例

```html
  ...
  <amplify-authenticator framework="Ionic"></amplify-authenticator>
  ...
```

This will cause a `ComponentFactoryResolver` to display an Ionic version of the desired component.  You can also bypass the `ComponentFactoryResolver` by using the vanilla Angular or Ionic components directly using the `-core` or `-ionic` suffix.

例

```html
  ...
  <amplify-authenticator-ionic></amplify-authenticator-ionic>
  ...
```