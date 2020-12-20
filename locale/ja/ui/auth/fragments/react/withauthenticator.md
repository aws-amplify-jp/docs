The `withAuthenticator` is a higher-order component (HoC) that wraps `AmplifyAuthenticator`. You'll also notice the `AmplifySignOut` component. This is an optional component if you'd like to render a sign out button.

**使用法**
```jsx
import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

const App = () => (
  <div>
    <AmplifySignOut />
    My App
  </div>
);

export default withAuthenticator(App);
```