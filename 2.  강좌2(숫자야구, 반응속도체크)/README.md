# 강좌2

  - [숫자야구 타이핑](#숫자야구-타이핑)
  - [Props 타이핑](#Props-타이핑)





## 숫자야구 타이핑
[위로올라가기](#강좌2)

#### NumberBaseBall.tsx (기본적인 타이핑)
```js
import * as React from 'react';
import { useRef, useState, useCallback } from 'react';

const getNumbers = () => { // 숫자 랜덤 4개 뽑기
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
  const [tries, setTries] = useState([]);
  const inputEl = useRef<HTMLInputElement>(null); // input 타입추론

  const onSubmitForm = useCallback<(e: React.FormEvent) => void>((e) => { // 제네릭을 사용하여 타입추론
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
        // 이 부분 아직 props를 생성하지 않았다.
        // 다음 시간에 props를 생성할 것이다.
        {tries.map((v, i) => (
          <Try key={`${i + 1}차 시도 : ${v.try}`} tryInfo={v} />
        ))}
      </ul>
    </>
  )
}

export default NumberBaseBall;
```

#### NumberBaseBall.tsx (setTries 에러원인)
```js
import * as React from 'react';
import { useRef, useState, useCallback } from 'react';

...생략
...생략

const NumberBaseBall = () => {
  ...생략
  ...생략
  // 시도 횟수
  const [tries, setTries] = useState([]);


  const inputEl = useRef<HTMLInputElement>(null);

  const onSubmitForm = useCallback<(e: React.FormEvent) => void>((e) => {
    e.preventDefault();
    const input = inputEl.current;
    if (value === answer.join('')) {
      setTries((t) => ([ // setTries에 erorr
        ...t,
        {
          try: value,
          result: '홈런!',
        },
      ]));
      ...생략
    } else {
      ...생략
      } else {
        ...생략
        ...생략
        setTries(t => ([ // setTries에 erorr
          ...t,
          {
            try: value,
            result: `${strike} 스트라이크, ${ball} 볼입니다.`,
          },
        ]));
        ...생략
        ...생략
      }
    }
  }, [])

  return (
    <>
    // ...생략
    // ...생략
    </>
  )
}

export default NumberBaseBall;
```
> `Argument of type '(t: never[]) => { try: string; result: string; }[]' is not assignable to parameter of type 'SetStateAction<never[]>'.` <br>
> `Type '(t: never[]) => { try: string; result: string; }[]' is not assignable to type '(prevState: never[]) => never[]'.` <br>
> `Type '{ try: string; result: string; }[]' is not assignable to type 'never[]'.` <br>
> `Type '{ try: string; result: string; }' is not assignable to type 'never'.ts(2345)` <br>
> 위에 보면 setTries에 해당하는 에러가 나온다. <br>
>> 또한, useState의 tries를 자세히 보면 `never[]`로 되어있다. <br>
>> 즉, ***useState에서 빈 배열을 사용할 경우에는 타이핑 문제를 일으킨다.*** <br>

#### NumberBaseBall.tsx (setTries 에러해결 - 정확한 타이핑)
```js
// ...생략
// ...생략

interface TryInfo { 
  // setTries에 보면 try, result가 있다.
  // 정확한 타이핑을 해줘야한다.
  try: string,
  result: string,
}

const NumberBaseBall = () => {

  // ...생략
  // ...생략

  // never가 되지 않도록 정확한 타이핑을 해줘야한다.
  const [tries, setTries] = useState<TryInfo[]>([]); // never문제 해결해야한다.


  const inputEl = useRef<HTMLInputElement>(null);

  const onSubmitForm = useCallback<(e: React.FormEvent) => void>((e) => {
    e.preventDefault();
    const input = inputEl.current;
    if (value === answer.join('')) {


      // *******************
      setTries((t) => ([ 
        ...t,
        {
          try: value,
          result: '홈런!',
        },
      ]));
      // *******************

      // ...생략
      // ...생략
    } else {
      // ...생략
      // ...생략
      if (tries.length >= 9) {
        // ...생략
        // ...생략
      } else {
        // ...생략
        // ...생략

        // *******************
        setTries(t => ([
          ...t,
          {
            try: value,
            result: `${strike} 스트라이크, ${ball} 볼입니다.`,
          },
        ]));
        // *******************


        setValue('');
        if (input) {
          input.focus();
        }
      }
    }
  }, [])

  return (
    <>
      // ...생략
      // ...생략
    </>
  )
}

export default NumberBaseBall;
```
> 결국에는 빈 배열에 하는 경우에는 정확한 타이핑을 해줘야한다. <br>


## Props 타이핑
[위로올라가기](#강좌2)

#### NumberBaseBall.tsx
```js
...생략

export interface TryInfo {
  try: string,
  result: string,
}

...생략
```
> interface에서 export를 사용해줘야한다. <br>


#### Try.tsx
```js
import * as React from 'react';

const Try = ({ tryInfo }) => {
  return (
    <li>
      <div>{tryInfo.try}</div>
      <div>{tryInfo.result}</div>
    </li>
  );
};

export default Try;
```
> tryInfo를 props에 넘겨주는데 props타입을 정해줘야한다.


```js
import * as React from 'react';
import { FunctionComponent } from 'react';
import { TryInfo } from './NumberBaseBall';

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

> 첫 번째 인수는 props <br>
> 두 번쨰 인수는 state인데 필요가 없다. <br>
>> 그 이유는 ***state는 useState가 대체해서 제네릭에서는 타이핑이 없다.*** <br>

<br>

> interface랑 실제코드를 같은 코드자리에 넣는 것은 별로 안 좋은 습관이다. <br>

#### types.ts
```js
export interface TryInfo {
  try: string,
  result: string,
}
```
> interface와 같은 실제코드가 아닌 것은 별도의 파일로 관리하는게 좋다. <br>

* * *

**Class컴포넌트에서는 props를 어떻게 사용하는지 알아볼 것이다.**

#### NumberBasllClass.tsx
```js
...생략
...생략

interface State {
  result: string;
  value: string;
  answer: number[];
  tries: TryInfo[];
}

class NumberBaseballClass extends Component<{}, State> { // 여기에 state를 안넣으면 타이핑 에러나온다.
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
          {tries.map((v, i) => (
            <Try key={`${i + 1}차 시도 : ${v.try}`} tryInfo={v} />
          ))}
        </ul>
      </>
    );
  }
}

export default NumberBaseballClass; // import NumberBaseball;
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
> props에서 기본타이핑이 빈 객체이다. <br>
> `Component<P = {}, S = {}, SS = any>` P를 보면 빈 객체임을 확인 할 수가 있다. <br>
>> 이와 같이 `Component<{ tryInfo: TryInfo }>` 타입추론을 해줘야한다.


> 매번 **npx webpack**을 타이핑하는게 귀찮을 것이다. <br>
<pre><code>npm i -D webpack-dev-server</code></pre>

#### package.json
```js
{
  // ...생략
  // ...생략
  "scripts": {
    "dev": "webpack-dev-server --hot" // 이렇게 수정을 해줘야한다.
  },
  // ...생략
  "dependencies": {
    // ...생략
  },
  "devDependencies": {
    // ...생략
    "webpack-dev-server": "^3.11.0" // 추가되었음을 확인 가능
  }
}

```
> 코드를 수정할 때마다 ***webpack-dev-server**에서 빌드를 다시 해준다. <br>
>> npm run dev로 빌드실행한다. <br>
>> 빌드가 성공적으로 되지가 않을 것이다. <br>

#### webpack.config.js (에러 해결방법)
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
    publicPath: '/dist', // webpack-dev-server를 사용할려면 이 부분을 추가해주고, dist파일을 삭제해줘야한다.
  }
}
```
>  webpack-dev-server를 사용할려면 publicPath를 넣어줘야한다. <br>

