# 강좌2

  - [숫자야구 타이핑](#숫자야구-타이핑)





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
        {tries.map((v, i) => { 
          <Try key={`${i+1}차 시도 : ${v.try}`} tryInfo={v} />
        })}
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
>> 또한, useState의 tries를 자세히 보면 ***`never[]`***로 되어있다. <br>
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


