# 강좌7

  - [리덕스 구조 잡기](#리덕스-구조-잡기)





## 리덕스 구조 잡기
[위로올라가기](#강좌7)


<pre><code>npm i redux
npm i react-redux @types/react-redux</code></pre>

> reudx 안에는 index.d.ts파일이 있어서, @types/redux는 없다. <br>
> 일단 타이핑을 할건데, 자바스크립트로 먼저 만든 다음에 타입스크립트 적용할 것이다. <br>

#### clint.tsx(기본 세팅)
```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux'; // Provider 생성
import store from './store'; // store 생성
import App from './App';

const Hot = hot(App);

ReactDOM.render(
  <Provider store={store}> // Provider로 Hot을 감싸줘야한다.
    <Hot />
  </Provider>
  , document.querySelector('#root')
);
```
> Provider 아래에 있는 모든 곳에서 데이터를 가져올 수가 있다. <br>

#### App.tsx(기본 세팅)
```js
import * as React from 'react';
import { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div>

      </div>
    )
  }
}

export default App;
```

#### App.tsx(기능 미완성임)
```js
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

class App extends Component {

  onClick = () => {
    this.props.dispatchLogIn({
      id: 'LeeKY',
      password: 'password',
    });
  }

  onLogout = () => {
    this.props.dispatchLogOut();
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        {user.isLoggingIn
          ? <div>로그인 중</div>
            : user.data
              ? <div>{user.data.nickname}</div>
              : '로그인 해주세요.'}
        {!user.data
          ? <button onClick={this.onClick}>로그인</button>
          : <button onClick={this.onLogout}>로그아웃</button>}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  posts: state.posts,
})

const mapDispatchToProps = (dispatch) => ({
  dispatchLogIn: (data: {id, password}) => dispatch(logIn(data)),
  dispatchLogOut: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```
> 이렇게 만들면 에러가 걸리는데, 또 store에서 타이핑을 할 것이다. <br>

#### reducers\index.ts
```js
import { combineReducers } from 'redux';
import userReducer from './user';
import postReducer from './post';


const reudcer = combineReducers({ // reudcer를 연결해주는 역할
  user: userReducer,
  posts: postReducer,
})

export default reudcer;

```

#### reducers\post.ts
```js
const initialState = [];

const postReducer = (prevState, action) => {
  switch (action.type) {
    default :
      return prevState;
  }
}

export default postReducer;

```

#### reducers\user.ts
```js
const initialState = {
  isLoogingIn: false,
  data: null,
};

const userReducer = (prevState, action) => {
  switch (action.type) {
    default:
      return prevState;
  }
}

export default userReducer;
```

#### store.ts (저장소 역할)
```js
import { createStore } from 'redux';

import reducer from './reducers';

const initialState = {
  user: {
    isLoggingIn: false,
    data: null,
  },
  posts: [],
}

const store = createStore(reducer, initialState); // createStore에다가 reducer를 넣어준다.
// reducer는 reducers파일에 있는 모든 것들

export default store;
```

> 이제부터 `App.tsx`에 있는 `logIn, logout` 의 액션을 만들 것이다. <br>
> `logIn, logout`의 액션을 만들기 위해서, *actions 폴더를 생성*해준다. <br>

#### actions\post.ts
```js
export const ADD_POST = 'ADD_POST';

export const addPost = (data) => {
  return {
    type: ADD_POST,
    data,
  }
}
```

#### actions\user.ts
```js
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_OUT = 'LOG_OUT';

export const logIn = () => {
  
}

export const logOut = () => {
  return {
    type: LOG_OUT,
  }
}
```

#### App.tsx
```js
// 생략
import { logIn, logOut } from './actions/user'; // import해준다.

class App extends Component {
  // 생략
  // 생략
  // 생략
}

const mapStateToProps = (state) => ({
  user: state.user,
  posts: state.posts,
})

const mapDispatchToProps = (dispatch) => ({
  dispatchLogIn: (data: {id, password}) => dispatch(logIn(data)), // action폴더의 user.ts에서 logIn 가져오기
  dispatchLogOut: () => dispatch(logOut()), // action폴더의 user.ts에서 logOut 가져오기
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

```

> 타입스크립트가 아직 미완성이라서 아직 에러가 나올 것이다. <br

### Reudx VS ContextAPI
> ***redux VS ConextAPI*** 둘 중에 어느거 사용할까?  <br>
> redux는 **useReducer**, **createContext(ContextAPI)** 에 더불어서 **미들웨어**까지 추가해진 것이다. <br>
>> (useReducer + createContext + 미들웨어) <br>

> 미들웨어 기능이 redux만 가지고 있다는 것을 생각해서 미들웨어를 사용한다면 redux사용, 미들웨어를 사용하지 않는다면 ContextAPI 사용한다. <br>
> 이렇게 구분하면 쉽게 생각할 수 있을 것이다. <br>
> 그러면 둘중에 비교할려면 미들웨어를 사용할 것인가를 비교하면 된다. <br><br>

> 참고1) Redux 사용할 때 thunk, saga를 사용안하면 reudx 사용하는 의미가 없다. <br>
> 참고2) ContextAPI로 reudx를 대체할 수 없다. <br>


### 미들웨어의 설명
> 리덕스에서 미들웨어는 주로 비동기 작업을 처리 할 때 사용한다. 예로 리액트에서 API를 사용할 때 쓰여진다. <br>
> 리덕스 미들웨어는 만들어서 사용할 수 있지만, 주로 라이브러리를 설치하여 사용한다.  <br>
>> 관련된 미들웨어 라이브러리에는 `redux-thunk, redux-saga, redux-observable, redux-promise-middleware`등이 있습니다. <br>
>> 주로 많이 사용하는게 **redux-thunk, redux-saga** 이다. <br>



