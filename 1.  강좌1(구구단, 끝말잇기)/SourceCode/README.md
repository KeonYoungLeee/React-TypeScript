# 강좌1

  - [강좌 소개](#강좌-소개)
  - [기본 타입스크립트 세팅하기](#기본-타입스크립트-세팅하기)





## 강좌 소개
[위로올라가기](#강좌1)

#### package.json
```js
{
  "name": "lecture01",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack"
  },
  "author": "LEEKY",
  "license": "MIT",
  "dependencies": {
    "@types/react": "^16.9.48",
    "@types/react-dom": "^16.9.8",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "typescript": "^3.9.7"
  },
  "devDependencies": {
    "awesome-typescript-loader": "^5.2.1",
    "webpack": "^4.44.1",
    "webpack-cli": "^3.3.12"
  }
}
```


## 기본 타입스크립트 세팅하기
[위로올라가기](#강좌1)

#### clint.tsx
```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import GuGuDan from './GuGuDan';

ReactDOM.render(<GuGuDan />, document.querySelector('#root'));
```

#### GuGuDan.tsx
```js
export default GuGuDan;
```

#### index.html
```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>typescript-react 강좌</title>
</head>
<body>
  <div id="root"></div>
  <script src="./dist/app.js"></script>
</body>
</html>
```

#### tsconfig.json
```js
{
  "compilerOptions": {
    "strict": true,
    "lib": ["ES5", "ES2015", "ES2016", "ES2017", "DOM"],
    "jsx": "react",
  },
  "exclude": []
}
```

#### webpack.config.js
```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'eval',
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts']
  },
  entry: {
    app: './clint'
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader'
    }]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  }
}
```