# 강좌3

  - [useCallback과 keyof typeof](#useCallback과-keyof-typeof)
  - [가위바위보 타이핑하기](#가위바위보-타이핑하기)
  - [로또 추첨기와 FC, useMemo](#로또-추첨기와-FC,-useMemo)
  - [Class 라이프사이클 타이핑](#Class-라이프사이클-타이핑)





## useCallback과 keyof typeof
[위로올라가기](#강좌3)

#### \RSP\RSP.tsx ( 변경 하기 전)
```js
// 좌표
const rspCoords = {
  바위: '0',
  가위: '-142px',
  보: '-284px',
};

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
};

// 컴퓨터 선택
const computerChoice = (imgCoords) => {
  return Object.keys(rspCoords).find((k) => {
    return rspCoords[k] === imgCoords;
  })!;
};

const RSP = () => {
  const [result, setResult] = useState("");
  const [imgCoord, setImgCoord] = useState(rspCoords.바위);
  const [score, setScore] = useState(0);
  const interval = useRef<number>();

  useEffect(() => {
    // componentDidMount, componentDidUpdate 역할(1대1 대응은 아님)
    console.log('다시 실행');
    interval.current = setInterval(changeHand, 100);
    return () => {
      // componentWillUnmount 역할
      console.log('종료');
      clearInterval(interval.current);
    };
  }, [imgCoord]);

  const changeHand = () => {
    if (imgCoord === rspCoords.바위) {
      setImgCoord(rspCoords.가위);
    } else if (imgCoord === rspCoords.가위) {
      setImgCoord(rspCoords.보);
    } else if (imgCoord === rspCoords.보) {
      setImgCoord(rspCoords.바위);
    }
  };

  const onClickBtn = () => () => {
    clearInterval(interval.current);
    const myScore = scores[choice];
    const cpuScore = scores[computerChoice(imgCoord)];
    const diff = myScore - cpuScore;
    if (diff === 0) {
      setResult('비겼습니다!');
    } else if ([-1, 2].includes(diff)) {
      setResult('이겼습니다!');
      setScore((prevScore) => prevScore + 1);
    } else {
      setResult('졌습니다!');
      setScore((prevScore) => prevScore - 1);
    }
    setTimeout(() => {
      interval.current = setInterval(changeHand, 100);
    }, 1000);
  };

  return (
    <>
      <div
        id="computer"
        style={{
          background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0`,
        }}
      />
      <div>
        <button id="rock" className="btn" onClick={onClickBtn("바위")}>
          바위
        </button>
        <button id="scissor" className="btn" onClick={onClickBtn("가위")}>
          가위
        </button>
        <button id="paper" className="btn" onClick={onClickBtn("보")}>
          보
        </button>
      </div>
      <div>{result}</div>
      <div>현재 {score}점</div>
    </>
  );
};


export default RSP;
```

#### const로 값 변환 막아주기, 타입 추론하기
```js
const rspCoords = {
  바위: '0',
  가위: '-142px',
  보: '-284px',
} as const; // 이 부분은 고정이기 때문에 const 값을 고정시켜준다.

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
} as const; // 이 부분은 고정이기 때문에 const 값을 고정시켜준다.


// **********************************************

// type imgCoords의 형식을 순차적으로 만들 것이다. a -> b -> c
type a = typeof rspCoords;
// type a는 이하와 같이 표시가 된다.
// type a = {
//   readonly 바위: "0";
//   readonly 가위: "-142px";
//   readonly 보: "-284px";
// }

// **********************************************

type b = keyof typeof rspCoords;
// type b는 이하와 같이 표시가 된다.
// type b = "바위" | "가위" | "보"

// **********************************************

// 우리가 원하는 것은 '0' | '-142px' | '-284px'; 이다.
type c = typeof rspCoords[keyof typeof rspCoords];
// type c = "0" | "-142px" | "-284px" // 결과적으로 type imgCoords랑 같다.

type imgCoords = '0' | '-142px' | '-284px';
```
> `type imgCoords`의 결과처럼 (`'0' | '-142px' | '-284px'`)를 만들어주기 위해서 순차적으로 타입추론을 할 것이다. ( a -> b -> c순으로 보면서 이해하기 ) <br>
> `type a`, `type b`, `type c`형태로 타입추론이 되는 것을 확인 할 수가 있다. <br>
> 결론적으로, `type c`랑 `imgCoords`의 결과는 같다. <br>
>> `type c`처럼 하는편이 좋지만 못하겠으면 `imgcoords`로 해도된다. <br>
>> 하지만, `imgCoords`는 하드코딩, 중복, 여러 번 수정이 될 수가 있기떄문에, 되도록 `type c`형태로 하는게 추천한다. <br>

#### computerChoice 변경 하기 전
```js
type ImgCoords = typeof rspCoords[keyof typeof rspCoords];
const computerChoice = (imgCoords) => {
  return Object.keys(rspCoords).find((k) => {
    return rspCoords[k] === imgCoords;
  });
};
```

> `No index signature with a parameter of type 'string' was found on type '`<br>`{ readonly 바위: "0"; readonly 가위: "-142px"; readonly 보: "-284px"; }'.ts(7053)`
>> Object.keys할 떄에는 keys 리턴 값이 string[]으로 되어있다. <br>
>> Object.keys의 타입을 확인해보면, `keys(o: object): string[];`로 되어있다. <br>
>> ***즉, string[]으로 타입정의 해줘야 한다.*** <br>

#### 강제로 형변환 시켜주기 (string[]으로 형변환)
> 바꾸기에 앞서서 `rspCoords`를 자세히보면 객체형식으로 되어있다. <br>
>> `readonly 바위: "0";` <br>
>> `readonly 가위: "-142px";` <br>
>> `readonly 보: "-284px";` <br>
```js
type ImgCoords = typeof rspCoords[keyof typeof rspCoords];
const computerChoice = (imgCoords: ImgCoords) => {
  return (Object.keys(rspCoords) as ["바위", "가위", "보"]).find((k) => {
    return rspCoords[k] === imgCoords;
  });
};
```
> 객체형식을 **string[]**로 하기위해서 강제 형변환을 시켜주었다. <br>
> as를 사용해서 `["바위", "가위", "보"]`를 넣어주었다.(**string[] 형변환**) <br>

#### computerChoice의 undefined 해결 방법 1 (! 붙이기)
```js

type ImgCoords = typeof rspCoords[keyof typeof rspCoords];
const computerChoice = (imgCoords: ImgCoords) => {
  return (Object.keys(rspCoords) as ["바위", "가위", "보"]).find((k) => {
    return rspCoords[k] === imgCoords;
  })!;
};
```
> 여기서 또 computerChoice를 보면 <br>
> `computerChoice`의 형태를 보면 `const computerChoice: (imgCoords: ImgCoords) => "바위" | "가위" | "보" | undefined`로 정의 되어있는 것을 확인 할 수가 있다. <br>
> **undefined**를 없애주는기 위해서  ***`!(느낌표)`*** 를 넣어줘서 undefined가 없다는 것을 확신시켜 줄 수가 있다.. <br>


#### computerChoice의 undefined 해결 방법 2 (예외처리 throw new Error)
```js
type ImgCoords = typeof rspCoords[keyof typeof rspCoords];
const computerChoice = (imgCoords: ImgCoords) => {
  if (imgCoords === undefined) {
    throw new Error;
  }
  return (Object.keys(rspCoords) as ["바위", "가위", "보"]).find((k) => {
    return rspCoords[k] === imgCoords;
  });
};
```
> 하지만, computerChoice를 보면 undefined가 있지만, **예외처리**를 해주는 경우도 있다. <br>

## 가위바위보 타이핑하기
[위로올라가기](#강좌3)

#### RSP\RSP.tsx
```js
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';

const rspCoords = {
  바위: '0',
  가위: '-142px',
  보: '-284px'
} as const;

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
} as const;

const computerChoice = (imgCoords: ImgCoords) => {
  return (Object.keys(rspCoords) as ['바위', '가위', '보']).find((k) => {
      return rspCoords[k] === imgCoords;
  })!
}

const RSP = () => {
  const [result, setResult] = useState('');
  const [imgCoord, setImgCoord] = useState(rspCoords.바위);
  const [score, setScore] = useState(0);
  const interval = useRef<number>();

  useEffect(() => { // componentDidMount, componentDidUpdate 역할(1대1 대응은 아님)
    console.log('다시 실행');
    interval.current = setInterval(changeHand, 100); // 1) error
    return () => { // componentWillUnmount 역할
      console.log('종료');
      clearInterval(interval.current);
    }
  }, [imgCoord]);

  const changeHand = () => {
    if (imgCoord === rspCoords.바위) {
      setImgCoord(rspCoords.가위); // 2) error
    } else if (imgCoord === rspCoords.가위) {
      setImgCoord(rspCoords.보); // 2) error
    } else if (imgCoord === rspCoords.보) {
      setImgCoord(rspCoords.바위);
    }
  };

  const onClickBtn = (chocie) => () => {
    clearInterval(interval.current);
    const myScore = scores[choice]; // 3) error
    const cpuScore = scores[computerChoice(imgCoord)];
    const diff = myScore - cpuScore;
    if (diff === 0) {
      setResult('비겼습니다!');
    } else if ([-1, 2].includes(diff)) {
      setResult('이겼습니다!');
      setScore((prevScore) => prevScore + 1);
    } else {
      setResult('졌습니다!');
      setScore((prevScore) => prevScore - 1);
    }
    setTimeout(() => {
      interval.current = setInterval(changeHand, 100); // 1) error
    }, 1000);
  }

    return (
    <>
      <div id="computer" style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }} />
      <div>
        <button id="rock" className="btn" onClick={onClickBtn('바위')}>바위</button>
        <button id="scissor" className="btn" onClick={onClickBtn('가위')}>가위</button>
        <button id="paper" className="btn" onClick={onClickBtn('보')}>보</button>
      </div>
      <div>{result}</div>
      <div>현재 {score}점</div>
    </>
  );
}

export default RSP;
```

> 1) `setInterval` ➡ `window.setInterval` <br>
> 2) error : Argument of type '"-142px"' is not assignable to parameter of type 'SetStateAction<"0">'.ts(2345) <br>
>> `type ImgCoords = typeof rspCoords[keyof typeof rspCoords];` ImgCoords의 타입추가해주기(중복을 막아주기 위해서 type설정하였다.) <br>
>> `useState(rspCoords.바위);` ➡ `seState<ImgCoords>(rspCoords.바위);` <br>

> 3) error : Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{ readonly 가위: 1; readonly 바위: 0; readonly 보: -1; }'. <br>
>> `onClickBtn`가 고차함수이다. 매개변수는 타이핑을 해줘야한다. <br>
>> `const onClickBtn = (choice) => () => {}` ➡ `const onClickBtn = (choice: keyof typeof rspCoords) => () => {}` <br>

Tip) 배열의 includes 사용할려면 es2016을 추가해야한다. <br>

> useEffect는 타이핑 할게 별로없다. <br>
> 여기에서는 `type ImgCoords = typeof rspCoords[keyof typeof rspCoords];`과 `choice: keyof typeof rspCoords`이 부분을 주의해서 보기(타입스크립트 기초강좌에 나옴) <br>

#### RSP\RSPClass.tsx
```js
import * as React from "react";
import { Component } from "react";

const rspCoords = {
  바위: "0",
  가위: "-142px",
  보: "-284px",
} as const;

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
} as const;

const computerChoice = (imgCoords: ImgCoords) => {
  return (Object.keys(rspCoords) as ["바위", "가위", "보"]).find((k) => {
    return rspCoords[k] === imgCoords;
  })!;
};

type ImgCoords = typeof rspCoords[keyof typeof rspCoords];

interface State {
  result: string;
  imgCoords: ImgCoords;
  score: number;
}
class RSP extends Component<{}, State> {
  state: State = {
    result: "",
    imgCoords: rspCoords.바위,
    score: 0,
  };
  interval: number | null = null;

  componentDidMount() {
    this.interval = setInterval(this.changeHand, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval!);
  }

  changeHand = () => {
    const { imgCoords } = this.state;
    if (imgCoords === rspCoords.바위) {
      this.setState({
        imgCoords: rspCoords.가위,
      });
    } else if (imgCoords === rspCoords.가위) {
      this.setState({
        imgCoords: rspCoords.보,
      });
    } else if (imgCoords === rspCoords.보) {
      this.setState({
        imgCoords: rspCoords.바위,
      });
    }
  };

  onClickBtn = (choice: keyof typeof rspCoords) => () => { // 1) error
    const { imgCoords } = this.state;
    clearInterval(this.interval!);
    const myScore = scores[choice];
    const cpuScore = scores[computerChoice(imgCoords)!];
    const diff = myScore - cpuScore;
    if (diff === 0) {
      this.setState({
        result: "비겼습니다!",
      });
    } else if ([-1, 2].includes(diff)) {
      this.setState((prevState) => {
        return {
          result: "이겼습니다!",
          score: prevState.score + 1,
        };
      });
    } else {
      this.setState((prevState) => {
        return {
          result: "졌습니다!",
          score: prevState.score - 1,
        };
      });
    }
    setTimeout(() => {
      this.interval = window.setInterval(this.changeHand, 100);
    }, 1000);
  };

  render() {
    const { result, score, imgCoords } = this.state;
    return (
      <>
        <div
          id="computer"
          style={{
            background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoords} 0`,
          }}
        />
        <div>
          <button id="rock" className="btn" onClick={this.onClickBtn("바위")}>
            바위
          </button>
          <button
            id="scissor"
            className="btn"
            onClick={this.onClickBtn("가위")}
          >
            가위
          </button>
          <button id="paper" className="btn" onClick={this.onClickBtn("보")}>
            보
          </button>
        </div>
        <div>{result}</div>
        <div>현재 {score}점</div>
      </>
    );
  }
}
```


> 1) error : `onClickBtn = (choice) => () => {}` ➡ `onClickBtn = (choice: keyof typeof rspCoords) => () => {}` <br>
> 2) `setInterval` ➡ `window.setInterval` <br>
> Hooks랑 수정할게 비슷하다 <br>


## 로또 추첨기와 FC, useMemo
[위로올라가기](#강좌3)

#### D:\_Study\InflearnVideoLecture\React-TypeScript\3.  강좌3(가위바위보, 로또추첨기)\Lotto\Lotto.tsx
```js
import * as React from 'react';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

function getWinNumbers() {
  console.log('getWinNumbers');
  const candidate = Array(45).fill(null).map((v, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0) {
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  return [...winNumbers, bonusNumber];
}

const Lotto = () => {
  const lottoNumbers = useMemo(() => getWinNumbers(), []);
  const [winNumbers, setWinNumbers] = useState(lottoNumbers);
  const [winBalls, setWinBalls] = useState<number[]>([]); // 1)
  const [bonus, setBonus] = useState<number | null>(null); // 4)
  const [redo, setRedo] = useState(false);
  const timeouts = useRef<number[]>([]); // 2)

  useEffect(() => {
    console.log('useEffect');
    for (let i = 0; i < winNumbers.length - 1; i++) {
      timeouts.current[i] = window.setTimeout(() => {
        setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]);
      }, (i + 1) * 1000);
    }
    timeouts.current[6] = window.setTimeout(() => {
      setBonus(winNumbers[6]);
      setRedo(true);
    }, 7000);
    return () => { // 3)
      timeouts.current.forEach((v) => {
        clearTimeout(v);
      });
    };
  }, [timeouts.current]); 
  
  useEffect(() => {
    console.log('로또 숫자를 생성합니다.');
  }, [winNumbers]);

  const onClickRedo = useCallback(() => {
    console.log('onClickRedo');
    console.log(winNumbers);
    setWinNumbers(getWinNumbers());
    setWinBalls([]);
    setBonus(null);
    setRedo(false);
    timeouts.current = [];
  }, [winNumbers]);

  return (
    <>
      <div>당첨 숫자</div>
      <div id="결과창">
        {winBalls.map((v) => <Ball key={v} number={v} />)}
      </div>
      <div>보너스!</div>
      {bonus && <Ball number={bonus} />}
      {redo && <button onClick={onClickRedo}>한 번 더!</button>}
    </>
  );
};

export default Lotto;

```

> 1. `const [winBalls, setWinBalls] = useState<number[]>([]);` <br>
>> 빈 배열 조심 <br>
> 2. `const timeouts = useRef<number[]>([]);` <br>
>> 빈 배열 조심 <br>
> 3. useEffect 사용할 떄 마지막 return에서 clearTimeout로 정리해준다. <br>
> 4. null로 초기화하고 있으니까 타입에도 null을 추가해준다. <br>


#### Lotto/Ball.tsx (props 복습)
```js
import * as React from 'react';
import { FunctionComponent, FC } from 'react';
// FC 사용 할 경우
// const Ball: FC<{ number: number }> = ({ number }) => { }

// FunctionComponent 사용 할 경우
const Ball: FunctionComponent<{ number: number }> = ({ number }) => { 
  let background;
  if (number <= 10) {
    background = 'red';
  } else if (number <= 20) {
    background = 'orange';
  } else if (number <= 30) {
    background = 'yellow';
  } else if (number <= 40) {
    background = 'blue';
  } else {
    background = 'green';
  }

  return (
    <div className="ball" style={{ background }}>{number}</div>
  )
};

export default Ball;
```
> porps에서는 `FunctionComponent` 또는 `FC` 적어준다. <br>
> 이번 시간에는 `useMemo`를 배웠는데, 타입 추론이 안되면 제네릭을 사용해서 타입추론 해준다. <br>


## Class 라이프사이클 타이핑
[위로올라가기](#강좌3)


#### Lotto\BallClass.tsx
```js
import * as React from 'react';
import { Component } from 'react'; // 여기에 Componet를 넣어준다. 


class BallClass extends Component<{number: number}> { // <> 안에 porps를 받아온다.
  render() {
    const { number } = this.props;
    let background;
    if (number <= 10) {
      background = 'red';
    } else if (number <= 20) {
      background = 'orange';
    } else if (number <= 30) {
      background = 'yellow';
    } else if (number <= 40) {
      background = 'blue';
    } else {
      background = 'green';
    }
    return (
      <div className="ball" style={{ background }}>{number}</div>
    );
  };
};

export default BallClass;

```

#### Lotto\LottoClass.tsx
```js
import * as React from 'react';
import { Component } from 'react';
import Ball from './Ball';
import BallClass from './BallClass';

function getWinNumbers() {
  console.log('getWinNumbers');
  const candidate = Array(45).fill(null).map((v, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0) {
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  return [...winNumbers, bonusNumber];
}

interface State {
  winNumbers: number[];
  winBalls: number[];
  bonus: number | null;
  redo: boolean;
}

class LottoClass extends Component<{}, State> {
  state: State = {
    winNumbers: getWinNumbers(),
    winBalls: [],
    bonus: null,
    redo: false,
  };
  timeouts: number[] = [];

  runTimeouts = () => {
    console.log('runTimeouts');
    const { winNumbers } = this.state;
    for (let i = 0; i < winNumbers.length - 1; i++) {
      this.timeouts[i] = window.setTimeout(() => {
        this.setState((prevState) => {
          return {
            winBalls: [...prevState.winBalls, winNumbers[i]],
          };
        });
      }, (i + 1) * 1000);
    }
    this.timeouts[6] = window.setTimeout(() => {
      this.setState({
        bonus: winNumbers[6],
        redo: true,
      });
    }, 7000);
  };

  componentDidMount() {
    console.log('didMount');
    this.runTimeouts();
    console.log('로또 숫자를 생성합니다.');
  }

  componentDidUpdate(prevProps, prevState) { // 1) prevProps -> error, 2) prevState -> error
    console.log('didUpdate');
    if (this.state.winBalls.length === 0) {
      this.runTimeouts();
    }
    if (prevState.winNumbers !== this.state.winNumbers) {
      console.log('로또 숫자를 생성합니다.');
    }
  }

  componentWillUnmount() {
    this.timeouts.forEach((v) => {
      clearTimeout(v);
    });
  }

  onClickRedo = () => {
    console.log('onClickRedo');
    this.setState({
      winNumbers: getWinNumbers(), // 당첨 숫자들
      winBalls: [],
      bonus: null, // 보너스 공
      redo: false,
    });
    this.timeouts = [];
  };

  render() {
    const { winBalls, bonus, redo } = this.state;
    return (
      <>
        <div>당첨 숫자</div>
        <div id="결과창">
          {winBalls.map((v) => <Ball key={v} number={v} />)}
        </div>
        <div>보너스!</div>
        {bonus && <Ball number={bonus} />}
        {redo && <button onClick={this.onClickRedo}>한 번 더!</button>}
      </>
    );
  }
};

export default LottoClass;

```

> prevProps의 에러 : `Parameter 'prevProps' implicitly has an 'any' type.ts(7006)` <br>
>> Typing가 any가 나온다. componentDidUpdate에서 인식을 잘 하지 못한다. <br>
>> 직접 작성해줘야한다. (타입스크립트의 한계) <br>

> prevState의 에러 : `Cannot find name 'prevState'.ts(2304)` <br>
>> prevState도 직접 작성해준다. (이것도 타입스크립트의 한계) <br>

> `componentDidUpdate(prevProps, prevState) {}` ➡ `componentDidUpdate(prevProps: {}, prevState: State) {}` <br>