# 강좌2

  - [숫자야구 타이핑](#숫자야구-타이핑)
  - [Props 타이핑](#Props-타이핑)
  - [setTimeout, useRef 타이핑](#setTimeout,-useRef-타이핑)





## 숫자야구 타이핑
[위로올라가기](#강좌2)

#### NumberBaseBall.tsx
```js
import * as React from 'react';
import { useRef, useState, useCallback } from 'react';

const getNumbers = () => {
  const candidates = [1,2,3,4,5,6,7,8,9];
  const array = [];
  for ( let i:number = 0; i < 4; i ++ ) {
    const chosen = candidates.splice(Math.floor(Math.random() * (9 -i)), 1)[0];
    array.push(chosen);
  }
  return array;
}

interface TryInfo {
  try: string,
  result: string,
}

const NumberBaseBall = () => {

  const [answer, setAnswer] = useState(getNumbers());
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [tries, setTries] = useState<TryInfo[]>([]);
  const inputEl = useRef<HTMLInputElement>(null);

  const onSubmitForm = useCallback<(e: React.FormEvent) => void>((e) => {
    e.preventDefault();
    const input = inputEl.current;
    if (value === answer.join('')) {
      setTries((t) => ([
        ...t,
        {
          try: value,
          result: '홈런!',
        },
      ]));
      setResult('홈런!');
      alert('게임을 다시 실행합니다.');
      setValue('');
      setAnswer(getNumbers());
      setTries([]);
      if (input) {
        input.focus();
      }
    } else {
      const answerArray = value.split('').map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;
      if (tries.length >= 9) {
        setResult(`10번 넘게 틀려서 실패! 답은 ${answer.join(',')}였습니다!`); // state set은 비동기
        alert('게임을 다시 시작합니다.');
        setValue('');
        setAnswer(getNumbers());
        setTries([]);
        if (input) {
          input.focus();
        }
      } else {
        console.log('답은', answer.join(''));
        for (let i = 0; i < 4; i += 1) {
          if (answerArray[i] === answer[i]) {
            console.log('strike', answerArray[i], answer[i]);
            strike += 1;
          } else if (answer.includes(answerArray[i])) {
            console.log('ball', answerArray[i], answer.indexOf(answerArray[i]));
            ball += 1;
          }
        }
        setTries(t => ([
          ...t,
          {
            try: value,
            result: `${strike} 스트라이크, ${ball} 볼입니다.`,
          },
        ]));
        setValue('');
        if (input) {
          input.focus();
        }
      }
    }
  }, [])

  return (
    <>
      <h1>{result}</h1>
      <form onSubmit={onSubmitForm} >
        <input
          ref={inputEl}
          maxLength={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button>입력!</button>
      </form>
      <div>시도: {tries.length}</div>
      <ul>
        {tries.map((v, i) => {
          <Try key={`${i+1}차 시도 : ${v.try}`} tryInfo={v} />
        })}
      </ul>
    </>
  )
}

export default NumberBaseBall;
```

## Props 타이핑
[위로올라가기](#강좌2)

#### NumberBaseBall.tsx
```js
import * as React from 'react';
import Try from './Try';
import { useRef, useState, useCallback } from 'react';
import { TryInfo } from './types';

const getNumbers = () => {
  const candidates = [1,2,3,4,5,6,7,8,9];
  const array = [];
  for ( let i:number = 0; i < 4; i ++ ) {
    const chosen = candidates.splice(Math.floor(Math.random() * (9 -i)), 1)[0];
    array.push(chosen);
  }
  return array;
}

const NumberBaseBall = () => {

  const [answer, setAnswer] = useState(getNumbers());
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [tries, setTries] = useState<TryInfo[]>([]);
  const inputEl = useRef<HTMLInputElement>(null);

  const onSubmitForm = useCallback<(e: React.FormEvent) => void>((e) => {
    e.preventDefault();
    const input = inputEl.current;
    if (value === answer.join('')) {
      setTries((t) => ([
        ...t,
        {
          try: value,
          result: '홈런!',
        },
      ]));
      setResult('홈런!');
      alert('게임을 다시 실행합니다.');
      setValue('');
      setAnswer(getNumbers());
      setTries([]);
      if (input) {
        input.focus();
      }
    } else {
      const answerArray = value.split('').map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;
      if (tries.length >= 9) {
        setResult(`10번 넘게 틀려서 실패! 답은 ${answer.join(',')}였습니다!`); // state set은 비동기
        alert('게임을 다시 시작합니다.');
        setValue('');
        setAnswer(getNumbers());
        setTries([]);
        if (input) {
          input.focus();
        }
      } else {
        console.log('답은', answer.join(''));
        for (let i = 0; i < 4; i += 1) {
          if (answerArray[i] === answer[i]) {
            console.log('strike', answerArray[i], answer[i]);
            strike += 1;
          } else if (answer.includes(answerArray[i])) {
            console.log('ball', answerArray[i], answer.indexOf(answerArray[i]));
            ball += 1;
          }
        }
        setTries(t => ([
          ...t,
          {
            try: value,
            result: `${strike} 스트라이크, ${ball} 볼입니다.`,
          },
        ]));
        setValue('');
        if (input) {
          input.focus();
        }
      }
    }
  }, [value, answer])

  return (
    <>
      <h1>{result}</h1>
      <form onSubmit={onSubmitForm} >
        <input
          ref={inputEl}
          maxLength={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button>입력!</button>
      </form>
      <div>시도: {tries.length}</div>
      <ul>
        {tries.map((v, i) => (
          <Try key={`${i + 1}차 시도 : ${v.try}`} tryInfo={v} />
        ))}
      </ul>
    </>
  )
}

export default NumberBaseBall;
```

#### Try.tsx
```js
import * as React from 'react';
import { FunctionComponent } from 'react';
import { TryInfo } from './types';

const Try: FunctionComponent<{ tryInfo: TryInfo }> = ({ tryInfo }) => {
  return (
    <li>
      <div>{tryInfo.try}</div>
      <div>{tryInfo.result}</div>
    </li>
  );
};

export default Try;

```

#### types.ts
```js
export interface TryInfo {
  try: string,
  result: string,
}
```

#### NumberBasllClass.tsx
```js
import * as React from 'react';
import Try from './Tryclass';
import { TryInfo } from './types';
import { Component, createRef } from 'react';

function getNumbers() { // 숫자 네 개를 겹치지 않고 랜덤하게 뽑는 함수
  const candidate = [1,2,3,4,5,6,7,8,9];
  const array = [];
  for (let i = 0; i < 4; i += 1) {
    const chosen = candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    array.push(chosen);
  }
  return array;
}

interface State {
  result: string;
  value: string;
  answer: number[];
  tries: TryInfo[];
}

class NumberBaseball extends Component<{}, State> {
  state = {
    result: '',
    value: '',
    answer: getNumbers(), // ex: [1,3,5,7]
    tries: [], // push 쓰면 안 돼요
  };

  onSubmitForm = (e: React.FormEvent) => {
    const { value, tries, answer } = this.state;
    e.preventDefault();
    const input = this.inputRef.current;
    if (value === answer.join('')) {
      this.setState((prevState) => {
        return {
          result: '홈런!',
          tries: [...prevState.tries, { try: value, result: '홈런!' }],
        }
      });
      alert('게임을 다시 시작합니다!');
      this.setState({
        value: '',
        answer: getNumbers(),
        tries: [],
      });
      if (input) {
        input.focus();
      }
    } else { // 답 틀렸으면
      const answerArray = value.split('').map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;
      if (tries.length >= 9) { // 10번 이상 틀렸을 때
        this.setState({
          result: `10번 넘게 틀려서 실패! 답은 ${answer.join(',')}였습니다!`,
        });
        alert('게임을 다시 시작합니다!');
        this.setState({
          value: '',
          answer: getNumbers(),
          tries: [],
        });
        if (input) {
          input.focus();
        }
      } else {
        for (let i = 0; i < 4; i += 1) {
          if (answerArray[i] === answer[i]) {
            strike += 1;
          } else if (answer.includes(answerArray[i])) {
            ball += 1;
          }
        }
        this.setState((prevState) => {
          return {
            tries: [...prevState.tries, { try: value, result: `${strike} 스트라이크, ${ball} 볼입니다`}],
            value: '',
          };
        });
        if (input) {
          input.focus();
        }
      }
    }
  };

  onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(this.state.answer);
    this.setState({
      value: e.target.value,
    });
  };

  inputRef = createRef<HTMLInputElement>(); // this.inputRef

  render() {
    const { result, value, tries } = this.state;
    return (
      <>
        <h1>{result}</h1>
        <form onSubmit={this.onSubmitForm}>
          <input ref={this.inputRef} maxLength={4} value={value} onChange={this.onChangeInput} />
        </form>
        <div>시도: {tries.length}</div>
        <ul>
          {tries.map((v, i) => {
            return (
              <Try key={`${i + 1}차 시도 :`} tryInfo={v} />
            );
          })}
        </ul>
      </>
    );
  }
}

export default NumberBaseball; // import NumberBaseball;
```

#### TryClass.tsx
```js
import * as React from 'react';
import { Component } from 'react';
import { TryInfo } from './types';

class Try extends Component<{ tryInfo: TryInfo }> {
  render() {
    const { tryInfo } = this.props;
    return (
      <li>
        <div>{tryInfo.try}</div>
        <div>{tryInfo.result}</div>
      </li>
    );
  }
}

export default Try;

```

#### package.json
```js
{
  "name": "lecture02",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server --hot"
  },
  "author": "LEEKY",
  "license": "MIT",
  "dependencies": {
    "@types/react": "^16.9.48",
    "@types/react-dom": "^16.9.8",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-hot-loader": "^4.12.21",
    "typescript": "^3.9.7"
  },
  "devDependencies": {
    "awesome-typescript-loader": "^5.2.1",
    "webpack": "^4.44.1",
    "webpack-cli": "^3.3.12",
    "webpack-dev-server": "^3.11.0"
  }
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
    publicPath: '/dist',
  }
}

```

## setTimeout, useRef 타이핑
[위로올라가기](#강좌2)

#### ResponseCheck\ResponseCheck.tsx
```js
import * as React from 'react';
import { useState, useRef } from 'react';

const ResponseCheck = () => {
  const [state, setState] = useState('waiting');
  const [message, setMessage] = useState('클릭해서 시작하세요.');
  const [result, setResult] = useState<number[]>([]);
  const timeout = useRef<number | null>(null);
  const startTime = useRef(0);
  const endTime = useRef(0);

  const onClickScreen = () => {
    if (state === 'waiting') {
      timeout.current = window.setTimeout(() => {
        setState('now');
        setMessage('지금 클릭');
        startTime.current = new Date().getTime();
      }, Math.floor(Math.random() * 1000) + 2000); // 2초~3초 랜덤
      setState('ready');
      setMessage('초록색이 되면 클릭하세요.');
    } else if (state === 'ready') { // 성급하게 클릭
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      setState('waiting');
      setMessage('너무 성급하시군요! 초록색이 된 후에 클릭하세요.');
    } else if (state === 'now') { // 반응속도 체크
      endTime.current = new Date().getTime();
      setState('waiting');
      setMessage('클릭해서 시작하세요.');
      setResult((prevResult) => {
        return [...prevResult, endTime.current - startTime.current];
      });
    }
  };
  const onReset = () => {
    setResult([]);
  };

  const renderAverage = () => {
    return result.length === 0
      ? null
      : <>
        <div>평균 시간: {result.reduce((a, c) => a + c) / result.length}ms</div>
        <button onClick={onReset}>리셋</button>
      </>
  };

  return (
    <>
      <div
        id="screen"
        className={state}
        onClick={onClickScreen}
      >
        {message}
      </div>
      {renderAverage()}
    </>
  );
};

export default ResponseCheck;
```