# 강좌1

  - [강좌 소개](#강좌-소개)
  - [기본 타입스크립트 세팅하기](#기본-타입스크립트-세팅하기)
  - [이벤트 헨들러, useRef 타이핑](#이벤트-헨들러,-useRef-타이핑)
  - [Class State 타이핑](#Class-State-타이핑)
  - [useCallback 타이핑](#useCallback-타이핑)
  - [끝말잇기 class 타이핑과 질문](#끝말잇기-class-타이핑과-질문)





## 강좌 소개
[위로올라가기](#강좌1)


<pre><code>npm i typescript react react-dom
npm i awesome-typescript-loader webpack webpack-cli -D
npm i @types/react @types/react-dom</code></pre>

> **typescript** : 타입스크립트 설치 <br>
> **react** : 기본적인 리액트 사용하기 위해서 react 설치 <br>
> **react-dom** : 웹 환경에서 react-dom사용, 앱 환경에서는 react-native를 사용 <br>
> **webpack, webpack-cli** : 리액트를 사용할 때에는 최신문법, js문법을 사용하기 때문에 webpack을 사용한다. <br>
>> react에서는 babel을 사용했다. 왜? babel을 사용하지 않냐? <br>
>> 타입스크립트는 자체적으로 바벨처럼 es5, es3까지도 지원하기 떄문에, 바벨은 따로 필요없다. <br>
>> 가끔씩 타입스크립트도 바벨 사용하긴 한다. <br>

> **awesome-typescript-loader** : 웹팩과 타입스크립트를 이어주기 위한 **ts-loader, awesome-typescript-loader**가 있다. 2개가 가장 유명 <br>
>> 여기에서는 awesome-typescript-loader를 사용하겠다. <br>

> **@types/react @types/react-dom** : `DefinitelyTyped`에서 react, react-dom의 타입들을 정의해놓았기 때문에 설치를 한다.

### 실행 명령어
<pre><code>npm run dev 
npx webpack</code></pre>

> 타입스크립트에서는 npx tsc 실행했는데 <br>
> 웹팩과 타입스크립트 연결했개 때문에 npx webpack을 사용한다. <br>

#### package.json
```js
{
  ...생략
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

#### tsconfig.json
```js
{
  "compilerOptions": {
    "strict": true,
    // 기본적으로 lib에 내가 사용할 버전을 다 적어주는게 좋다
    "lib": ["ES5", "ES2015", "ES2016", "ES2017", "DOM"], 
    "jsx": "react", // react 사용하기 위해서
  }
}
```

#### webpack.config.js
```js
// 이전에는 babel을 사용했는데 이번에는 wepback을 사용한다
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development', // 배포용으로할 떄에는 production으로 한다.
  devtool: 'eval', // 배포용으로할 떄에는 hidden-source-mode으로 한다.
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts']
  },
 
  entry: {
    app: './clint' // clint파일이 메인페이지가 된다.
  },

  module: {
    rules: [{
      test: /\.tsx?$/, // awesome-typescript-loader를 통해서 옛날 문법으로 ts, tsx파일을 변환하겠다.
      loader: 'awesome-typescript-loader' // awesome-typescript-loader는 바벨과 함께 사용 가능
    }]
  },

  // plugins: {}, // 이거 없어졌으니 플로그인 넣지 않는다.
  
  output: { //module, plugins을 적용해서 최종적으로 output을 한다.
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  }
}
```
> 웹팩에서는 크게 설정 4개가 있다. <br>
>> **entry, module, plugins, output** <br>

> `npx webpack` 커맨드에 실행하면 문제없이 dist파일가 생기는 것을 확인 할 수가 있다. <br>

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

> 코딩은 clint.jsx에서 하고, 실행은 dist/app.js에서 한다. <br>

#### clint.tsx
```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import GuGuDan from './GuGuDan';

ReactDOM.render(<GuGuDan />, document.querySelector('#root'));
```
> `import React from 'react';` 이 방식으로 하면 에러가 나온다.
>> `This module is declared with using 'export =', and can only be used with a default import when using the `***`'esModuleInterop' flag.`***
>> 해결하기 위해서는 tsconfig.json에서 ``"esModuleInterop": true`` 하면 에러가 사라지는데 ***비추천***한다. 
>> *왜냐하면, 모듈 시스템을 이해하지 못한 증거이기 때문이다.*

> `GuGuDan`에서 보면 `*`가 없다. <br>
>> 이유는, GuGuDan.tsx파일에서 ***`export default`***를 선언해주었기 때문이다. <br>

#### GuGuDan.tsx
```js
export default GuGuDan;
```


## 이벤트 헨들러, useRef 타이핑
[위로올라가기](#강좌1)

#### GuGuDan.tsx (hooks 문법) - 수정 전
```js
import * as React from 'react';
import { useState, useRef } from 'react';

const GuGuDan = () => {

  const [first, setFirst] = useState(Math.ceil(Math.random() * 9));
  const [second, setSecond] = useState(Math.ceil(Math.random() * 9));
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const inputRef = useRef(null);

  const onSubmitForm = (e) => { // error: Parameter 'e' implicitly has an 'any' type.ts(7006).
    e.preventDefault();
    const input =  inputRef.current;
    if(parseInt(value) === first * second) {
      setResult('정답');
      setFirst(Math.ceil(Math.random() * 9));
      setSecond(Math.ceil(Math.random() * 9));
      setValue('');
      input.focus(); // error
    } else {
      setResult('떙');
      setValue('');
      input.focus(); // error: Object is possibly 'null'.ts(2531)
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
> `const onSubmitForm = (e) => {` ➡ `const onSubmitForm = (e: React.FormEvent) => {` : 타입 추론을 해줘야한다. <br>

> `input.focus();`에서 `inputRef.current;`의 current가 `inputRef`에 등록이 된다. <br>
>> ***useRef에 제네릭을 헤서 타입추론을 사용해줘야한다.*** <br>
>> `const inputRef = useRef(null);` ➡ `const inputRef = useRef<HTMLInputElement>(null);` : 타입추론 적용 <br>

> 하지만, 에러가 사라지지는 않을 것이다. <br>
> input은 HTML라서 null 가능성이 있기때문에, if문을 사용해서 input이 존재할 때만 사용하겠다는 의미를 보내줘야한다. <br>
>> `input.focus();` ➡ `if (input) { input.focus(); }` <br>

`npx webpack`으로 실행해준다. <br>

## Class State 타이핑
[위로올라가기](#강좌1)

#### GuGuDanClass.tsx (class 문법) - 수정 전

```js
import * as React from 'react';
import { Component } from 'react';

class GuGuDanClass extends Component {
  state = {
    first: Math.ceil(Math.random() * 9),
    second: Math.ceil(Math.random() * 9),
    value: '',
    result: '',
  }

  onSubmit = (e) => { // error
    e.preventDefault();
    if (parseInt(this.state.value) === this.state.first * this.state.second) {
      this.setState((prevState) => {
        return {
          result: '정답: ' + prevState.value, // error
          first: Math.ceil(Math.random() * 9),
          second: Math.ceil(Math.random() * 9),
          value: '',
        };
      });
      this.input.focus();
    } else {
      this.setState({
        result: '땡',
        value: '',
      });
      this.input.focus();
    }
  };

  onChange = (e) => { // error
    this.setState({ value: e.target.value });
  };

  input; // error

  onRefInput = (c) => { this.input = c; }; // error

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

> `onSubmit = (e) => {` ➡ `onSubmit = (e: React.FormEvent<HTMLFormElement>) => {` : 타입추론해주기 <br>
> `onChange = (e) => {` ➡ `onChange = (e:  React.ChangeEvent<HTMLInputElement>) => {` : 타입추론해주기 <br>
> `input;` ➡ `input: HTMLInputElement;` 을 했지만, 에러가 나온다. <br>
>> 값이 없으니까 처음에는 null을 넣어줘야한다. 그리고 타입도 맞춰줘야 한다.(union사용) ➡ `input: HTMLInputElement | null = null;` <br>
>> `this.input.focus();`도 에러가 나온다. `if ( this.input ) { this.input.focus(); }` 수정을 해준다. <br>

> `prevState.value,` ***타입 추론 불가능*** ➡ ***interface***를 사용한다. <br>
```js
...생략

interface IState { // 인터페이스 사용
  first: number,
  second: number,
  value: string,
  result: string,
}

class GuGuDanClass extends Component<{}, IState> { // Componet가 제네릭이다.
  // 첫번째 인수는 props, 두번째 인수는 state이다.
  // props는 다음 시간에 사용한다.
  state = {
    first: Math.ceil(Math.random() * 9),
    second: Math.ceil(Math.random() * 9),
    value: '',
    result: '',
  }
  ...생략
  ...생략
}
```
> Component는 제네릭으로 되어있다. <br>
> Component의 ***첫 번째 인수는 props***(아직 사용안하기 때문에 빈 객체), ***두 번쨰 인수는 props***이다. <br>
> `Component<{}, IState>`의 **IState**는 `interface`의 **IState**이름이 같아야한다. <br>
>> 위와 같이 설정하면 `prevState.value`의 에러는 사라진다. <br>



## useCallback 타이핑
[위로올라가기](#강좌1)

<pre><code>npm i react-hot-loader</code></pre>

> ***react-hot-loader*** : 저장할 때마다 새로고침을 자동으로 안되서 새로고침을 자동으로 하기위해서 설치해주었다.  <br>
>> **webpack-dev-server**도 설정해줘야한다. <br>

#### clint.tsx
```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root'; // 추가, 객체형식으로 inpmort하였음.

import Component-name from './Component-name';

const Hot = hot(Component-name); // 사용할 컴포넌트를 감싸준다.

ReactDOM.render(<Hot />, document.querySelector('#root'));
```

#### WordRelay.tsx
```js
import * as React from 'react';
import { useState, useCallback, useRef } from 'react';

const WordRelay = () => {

  const [word, setWord] = useState('사과');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmitForm = useCallback((e) => {
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

  const onChange = useCallback((e) => {
      setValue(e.currentTarget.value) 
  }, []);

  return (
    <>
      <div>{word}</div>
      <form onSubmit={onSubmitForm}>
        <input
          ref={inputRef}
          type="number"
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
> useCallback을 타입추론을 하였다. 위에 보면 2가지 방법의 타입추론 사용했다. <br>
> `const onSubmitForm = useCallback((e) => {}` => `const onSubmitForm = useCallback<(e: React.FormEvent) => void>((e) => {}` <br>
>> 1. useCallback에 제네릭을 사용해서 타입추론 <br>

> `const onChange = useCallback((e) => {}` => `const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {}` <br>
>> 2. `e`의 부분에다가 타입추론 (뭐든 사용하든 상관은 없는데 타입추론은 해줘야한다.) <br>


## 끝말잇기 class 타이핑과 질문
[위로올라가기](#강좌1)

#### WordRelayClass.tsx
```js
import * as React from 'react';
import { Component, createRef } from 'react';

interface IState {
  word: string,
  value: string,
  result: string,
}

class WordRelayClass extends Component<{}, IState>{
  
  state = {
    word: '제로초',
    value: '',
    result: '',
  };

  onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const input = this.input;
    const input2 = this.onRefInput2.current; // craeteRef 사용 방법
    if (this.state.word[this.state.word.length - 1] === this.state.value[0]) {
      this.setState({
        result: '딩동댕',
        word: this.state.value,
        value: '',
      });
      if (input2) {
        input2.focus();
      }
    } else {
      this.setState({
        result: '땡',
        value: '',
      });
      if (input2) {
        input2.focus();
      }
    }
  };

  onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.currentTarget.value });
  };

  // creataeRef가 아닌 일방적인 input을 사용 할 경우
  input: HTMLInputElement | null = null; 
  onRefInput = (c: HTMLInputElement) => {
    this.input = c;
  };

  // craeteRef 사용 방법 
  onRefInput2 = createRef<HTMLInputElement>(); // 타입추론

  render() {
    return (
      <>
        <div>{this.state.word}</div>
        <form onSubmit={this.onSubmitForm}>
          <input 
            // ref={this.onRefInput}
            ref={this.onRefInput2} // craeteRef 사용 방법
            value={this.state.value} 
            onChange={this.onChangeInput} />
          <button>클릭!!!</button>
        </form>
        <div>{this.state.result}</div>
      </>
    );
  }
}

export default WordRelayClass;
```
> 타입스크립트 강의할 때에는 제네릭을 왜 사용하는지 몰랐는데 <br>
> 남의 라이브러리 사용할 때 제네릭이 엄청 많이 사용된다. <br>
> 제네릭은 주로 타입추론을 해서 정확성하게 코딩을 해주는 것이다. <br>
