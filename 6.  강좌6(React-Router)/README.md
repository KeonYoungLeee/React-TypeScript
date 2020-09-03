# 강좌6

  - [리액트 라우터 타이핑 준비하기](#리액트-라우터-타이핑-준비하기)
  - [match와 location, history](#match와-location,-history)





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

## match와 location, history
[위로올라가기](#강좌6)

#### GameMatcherClass.tsx
```js
import * as React from 'react';
import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import NumberBaseball from '../2.  강좌2(숫자야구, 반응속도체크)/BaseBallGame/NumberBaseBall';
import RSP from '../3.  강좌3(가위바위보, 로또추첨기)/RSP/RSP';
import Lotto from '../3.  강좌3(가위바위보, 로또추첨기)/Lotto/Lotto';
import { RouteChildrenProps } from 'react-router-dom';

// RouteChildrenProps로 타입추론한다. name: string도 적어준다.
class GameMatcher extends Component<RouteChildrenProps<{ name: string }>> { 
  render() {
    if (!this.props.match) { // 여기에다가 props.match가 없는 상황도 적어준다.
      return (
        <div>
          일치하는 게임이 없습니다.
        </div>
      );
    }
    let urlSearchParams = new URLSearchParams(this.props.location.search.slice(1));
    console.log(urlSearchParams.get('page'));
    if (this.props.match.params.name === 'number-baseball') {
      return <NumberBaseball />
    } else if (this.props.match.params.name === 'rock-scissors-paper') {
      return <RSP />
    } else if (this.props.match.params.name === 'lotto-generator') {
      return <Lotto />
    } else {
      return (
        <div>
          일치하는 게임이 없습니다.
        </div>
      );
    }
  }
}

export default GameMatcher;
```

#### Games.tsx
```js
import * as React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import GameMatcher from './GameMatcher';

const Games: React.FunctionComponent = () => {
  return (
    <BrowserRouter>
      <div>
        // 간혹 홈페이지를 보면 주소 뒤에 querystring 붙을 수가 있다.
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
> querystring을 처리할 수 있는 부분이 `let urlSearchParams = new URLSearchParams(this.props.location.search.slice(1));`가 있다. <br>
> querystring 부분을 보기 위해서는 `console.log(urlSearchParams.get('page'));`를 사용한다. <br>


