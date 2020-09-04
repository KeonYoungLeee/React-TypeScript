# 강좌6

  - [리액트 라우터 타이핑 준비하기](#리액트-라우터-타이핑-준비하기)
  - [match와 location, history](#match와-location,-history)
  - [withRouter](#withRouter)
  - [react router hooks](#react-router-hooks)





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
import GameMatcherClass from './GameMatcherClass';

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
          <Route exact path="/" render={(props) => <GameMatcherClass {...props} />} />
          <Route path="/game/:name" render={(props) => <GameMatcherClass {...props} />} />
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
class GameMatcherClass extends Component<RouteChildrenProps<{ name: string }>> { 
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

export default GameMatcherClass;
```

#### Games.tsx
```js
import * as React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import GameMatcherClass from './GameMatcherClass';

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
          <Route exact path="/" render={(props) => <GameMatcherClass {...props} />} />
          <Route path="/game/:name" render={(props) => <GameMatcherClass {...props} />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Games;
```
> querystring을 처리할 수 있는 부분이 `let urlSearchParams = new URLSearchParams(this.props.location.search.slice(1));`가 있다. <br>
> querystring 부분을 보기 위해서는 `console.log(urlSearchParams.get('page'));`를 사용한다. <br>



## withRouter
[위로올라가기](#강좌6)

```js
import * as React from 'react';
import { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom'; // RouteComponentProps 추가
import NumberBaseball from '../2.  강좌2(숫자야구, 반응속도체크)/BaseBallGame/NumberBaseBall';
import RSP from '../3.  강좌3(가위바위보, 로또추첨기)/RSP/RSP';
import Lotto from '../3.  강좌3(가위바위보, 로또추첨기)/Lotto/Lotto';
import { RouteChildrenProps } from 'react-router-dom';

class GameMatcher extends Component<RouteComponentProps><{ name: string }>> { // RouteComponentProps를 대신 넣어준다.
  render() {
    if (!this.props.match) {
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

export default withRouter(GameMatcher); // withRouter를 사용하면 RouteComponentProps도 추가해줘야한다.
```

> ***Router보다 바깥에 있는 컴포넌트들은 withRouter로 감싸 match, history, loaction를 props으로 넣어준다.*** <br>
> 타입스크립트 설명이기떄문에 자세한 내용을 듣고싶으면 리액트 강좌를 들으면 된다. <br>


## react router hooks
[위로올라가기](#강좌6)

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
          // hooks에서는 props로 넘겨 줄 필요가 없다.
          <Route path="/game/:name" render={() => <GameMatcher />} />
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


### Class인 겨우
> 주로 props로 받는다.  <br>
> class에서 match, location, history는 props로 받는다.<br>
>> match에서는 null값이 존재 할 수도 있으니까 if문으로 감싸준다. <br>
>> location, history는 History타입핑을 사용하고 있다. <br>

> withRouter는 props로 넘겨주지 못한 상황에서 주로 사용한다. <br>
> withRouter가 복잡하다고 생각하면 hooks 사용하면 된다. <br

### hooks인 경우
> props로 넘겨주지 않아도 된다. 코드 량이 적어진다. <br>