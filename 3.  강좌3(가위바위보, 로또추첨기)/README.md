# 강좌3

  - [가위바위보 타이핑하기](#가위바위보-타이핑하기)





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

