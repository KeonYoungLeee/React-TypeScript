# 강좌6

  - [리액트 라우터 타이핑 준비하기](#리액트-라우터-타이핑-준비하기)





## 리액트 라우터 타이핑 준비하기
[위로올라가기](#강좌6)


<pre><code>npm i react-router
npm i @types/react-router</code></pre>

> react-router를 설치하고 `react-router-dom`도 같이 설치해줘야한다. <br>

<pre><code>npm i react-router-dom
npm i @types/react-router-dom</code></pre>

#### Games.tsx
```js
import * as React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import GameMatcher from './GameMatcher';

const Games: React.FunctionComponent = () => {
  return (
    <BrowserRouter>
      <div>
        <Link to="/game/number-baseball">숫자야구</Link>
        &nbsp;
        <Link to="/game/rock-scissors-paper">가위바위보</Link>
        &nbsp;
        <Link to="/game/lotto-generator">로또생성기</Link>
        &nbsp;
        <Link to="/game/index">게임 매쳐</Link>
      </div>
      <div>
        <Switch>
          <Route exact path="/" component={GameMatcher} />
          <Route path="/game/:name" render={(props) => <GameMatcher {...props} />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Games;
```

#### GameMatcher.tsx
```js
import * as React from 'react';
import NumberBaseball from '../2.  강좌2(숫자야구, 반응속도체크)/BaseBallGame/NumberBaseBall';
import RSP from '../3.  강좌3(가위바위보, 로또추첨기)/RSP/RSP';
import Lotto from '../3.  강좌3(가위바위보, 로또추첨기)/Lotto/Lotto';
import { useRouteMatch, useLocation, useHistory } from 'react-router';

const GameMatcher = () => {
  const match = useRouteMatch<{ name: string }>();
  const location = useLocation();
  const history = useHistory();
  if (!match) {
    return (
      <div>
        일치하는 게임이 없습니다.
      </div>
    );
  }
  let urlSearchParams = new URLSearchParams(location.search.slice(1));
  console.log(urlSearchParams.get('page'));
  if (match.params.name === 'number-baseball') {
    return <NumberBaseball />
  } else if (match.params.name === 'rock-scissors-paper') {
    return <RSP />
  } else if (match.params.name === 'lotto-generator') {
    return <Lotto />
  } else {
    return (
      <div>
        일치하는 게임이 없습니다.
      </div>
    );
  }
}

export default GameMatcher;
```


