```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent],
  imports: [AmplifyUIAngularModule, BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

*app.component.ts* 内のコンテンツを以下に置き換えます:
```js
import { Component, ChangeDetectorRef } from '@angular/core';
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'amplify-angular-auth';
  user: CognitoUserInterface | undefined;
  authState: AuthState;
  formFields: FormFieldTypes;

  constructor(private ref: ChangeDetectorRef) {
    this.formFields = [
      { type: "username" },
      { type: "password" },
      { type: "email" }
    ];
  }

  ngOnInit() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;
      this.ref.detectChanges();
    })
  }

  ngOnDestroy() {
    return onAuthUIStateChange;
  }
}
```

*app.component.html* 内のコンテンツを以下に置き換えます:
```html
<amplify-authenticator 
    *ngIf="authState !== 'signedin'" 
    [formFields]="formFields">
</amplify-authenticator>

<div *ngIf="authState === 'signedin' && user" class="App">
    <amplify-sign-out></amplify-sign-out>
    <div>Hello, {{user.username}}</div>
    <!-- This is where you application template code goes -->  
</div>
```