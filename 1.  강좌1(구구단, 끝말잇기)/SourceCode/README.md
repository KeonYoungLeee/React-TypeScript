# 강좌1

  - [강좌 소개](#강좌-소개)
  - [기본 타입스크립트 세팅하기](#기본-타입스크립트-세팅하기)
  - [이벤트 헨들러, useRef 타이핑](#이벤트-헨들러,-useRef-타이핑)
  - [Class State 타이핑](#Class-State-타이핑)
  - [useCallback 타이핑](#useCallback-타이핑)





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


## 이벤트 헨들러, useRef 타이핑
[위로올라가기](#강좌1)

#### GuGuDan.tsx (hooks 문법)
```js
import * as React from 'react';
import { useState, useRef } from 'react';

const GuGuDan = () => {

  const [first, setFirst] = useState(Math.ceil(Math.random() * 9));
  const [second, setSecond] = useState(Math.ceil(Math.random() * 9));
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const input =  inputRef.current;
    if(parseInt(value) === first * second) {
      setResult('정답');
      setFirst(Math.ceil(Math.random() * 9));
      setSecond(Math.ceil(Math.random() * 9));
      setValue('');
      if (input) {
        input.focus();
      }
    } else {
      setResult('떙');
      setValue('');
      if (input) {
        input.focus();
      }
    }
  }

  return (
    <>
      <div>{first} 곱하기 {second}는 ?</div>
      <form onSubmit={onSubmitForm}>
        <input
          ref={inputRef}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
      <div>{result}</div>
    </>
  );
};

export default GuGuDan;
```

## Class State 타이핑
[위로올라가기](#강좌1)

#### GuGuDanClass.tsx (class 문법)
```js
import * as React from 'react';
import { Component } from 'react';

interface IState {
  first: number,
  second: number,
  value: string,
  result: string,
}

class GuGuDanClass extends Component<{}, IState> { 
  state = {
    first: Math.ceil(Math.random() * 9),
    second: Math.ceil(Math.random() * 9),
    value: '',
    result: '',
  }

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (parseInt(this.state.value) === this.state.first * this.state.second) {
      this.setState((prevState) => {
        return {
          result: '정답: ' + prevState.value,
          first: Math.ceil(Math.random() * 9),
          second: Math.ceil(Math.random() * 9),
          value: '',
        };
      });
      if ( this.input ) {
        this.input.focus();
      }
    } else {
      this.setState({
        result: '땡',
        value: '',
      });
      if ( this.input ) {
        this.input.focus();
      }
    }
  };

  onChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };

  input: HTMLInputElement | null = null;

  onRefInput = (c: HTMLInputElement) => { this.input = c; };

  render() {
    return (
      <>
        <div>{this.state.first} 곱하기 {this.state.second}는?</div>
        <form onSubmit={this.onSubmit}>
          <input ref={this.onRefInput} type="number" value={this.state.value} onChange={this.onChange}/>
          <button>입력!</button>
        </form>
        <div>{this.state.result}</div>
      </>
    );
  }
}

export default GuGuDanClass;
```

## useCallback 타이핑
[위로올라가기](#강좌1)

#### WordRelay.tsx
```js
import * as React from 'react';
import { useState, useCallback, useRef } from 'react';

const WordRelay = () => {

  const [word, setWord] = useState('사과');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmitForm = useCallback<(e: React.FormEvent) => void>((e) => {
    e.preventDefault();
    const input = inputRef.current;
    if (word[word.length - 1] === value[0]) {
      setResult('딩동댕');
      setWord(value);
      setValue('');
      if (input) {
        input.focus();
      }
    } else {
      setResult('땡');
      setValue('');
      if (input) {
        input.focus();
      }
    }
  }, [word, value]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value) 
  }, []);

  return (
    <>
      <div>{word}</div>
      <form onSubmit={onSubmitForm}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>
      <div>{result}</div>
    </>
  )
}

export default WordRelay;

```


