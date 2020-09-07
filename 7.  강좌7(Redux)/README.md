# 강좌7

  - [리덕스 구조 잡기](#리덕스-구조-잡기)
  - [action, reducer 타이핑](#action,-reducer-타이핑)
  - [리덕스 컴포넌트 타이핑](#리덕스-컴포넌트-타이핑)





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



## action, reducer 타이핑
[위로올라가기](#강좌7)

> 여기서부터 타이핑이 시작될 것이다. <br>
> 참고로, 타이핑하는데 에러가 없으면 타입 안 붙여도 된다. <br>


#### actions\post.ts (수정 전)
```js
export const ADD_POST = 'ADD_POST';

export const addPost = (data) => {
  return {
    type: ADD_POST,
    data,
  }
}
```

#### actions\post.ts (수정 후)
```js
export const ADD_POST = 'ADD_POST' as const; // 불변을 위해서 as const 를 적어주었다.

// 여기에는 타입들을 선언해준다.
export interface AddPostAction { // interface 재 사용할 수도 있으니까 export를 해줬다.
  type: typeof ADD_POST,
  data: string
}

export const addPost = (data: string): AddPostAction => {
  return {
    type: ADD_POST,
    data,
  }
}
```
#### reducers\post.ts (수정 전)
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

#### reducers\post.ts (수정 후)
```js
import { ADD_POST, AddPostAction } from '../actions/post';

const initialState: string[] = [];

const postReducer = (prevState = initialState, action: AddPostAction): string[] => {
  switch (action.type) {
    case ADD_POST:
      return [...prevState, action.data]
    default :
      return prevState;
  }
}

export default postReducer;
```



#### actions\user.ts (수정 전)
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


#### actions\user.ts (수정 후)
```js
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST' as const;
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS' as const;
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE' as const;
export const LOG_OUT = 'LOG_OUT';


export interface LogInRequestAction { // 여기에는 타입들을 선언해준다.
  type: typeof LOG_IN_REQUEST
  data: { id: string, password: string},
}
export interface LogInSuccessAction { // 여기에는 타입들을 선언해준다.
  type: typeof LOG_IN_SUCCESS,
  data: { userId: string, nickname: string},
}
export interface LogInFailureAction { // 여기에는 타입들을 선언해준다.
  type: typeof LOG_IN_FAILURE,
  error: Error,
}
export const logIn = (data: { id: string, password: string}) => { // data 안에는 id와 비밀번호가 있다.
  
}


export interface LogOutAction { // 여기에는 타입들을 선언해준다.
  type: typeof LOG_OUT,
}

export const logOut = () => {
  return {
    type: LOG_OUT,
  }
}
```
> 실제 구현은 안했지만, 인터페이스를 미리 만들었다. <br>
> export라서 다 가져가서 import로 사용하면 된다. (reducers에서 사용할 것이다.) <br>

#### reducers\user.ts (수정 전)
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


#### reducers\user.ts (수정 후)
```js
import { 
  LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, LOG_OUT,
  LogInRequestAction, LogInSuccessAction, LogInFailureAction, LogOutAction
} from '../actions/user';

export interface UserState {
  isLoggingIn: boolean,
  data: {
    nickname: string,
  } | null, // data가 null이 있으니까 null도 적어줘야한다.
}

const initialState: UserState = {
  isLoggingIn: false,
  data: null,
};

type UserReducerActions = LogInRequestAction | LogInSuccessAction | LogInFailureAction | LogOutAction;
const userReducer = (prevState = initialState , action: UserReducerActions) => {
  switch (action.type) {
    case LOG_IN_REQUEST: // 이 부분은 나중에 타이핑 할 것이다.
    case LOG_IN_SUCCESS: // 이 부분은 나중에 타이핑 할 것이다.
    case LOG_IN_FAILURE: // 이 부분은 나중에 타이핑 할 것이다.
    case LOG_OUT:
      return {
        ...prevState,
        data: null,
      };
    default:
      return prevState;
  }
}

export default userReducer;
```

#### reducers\index.ts
```js
import { combineReducers } from 'redux';
import userReducer from './user';
import postReducer from './post';


const reudcer = combineReducers({
  user: userReducer,
  posts: postReducer,
})

export default reudcer;

//  확인 결과
// const reudcer: Reducer<CombinedState<{
//     user: UserState;
//     posts: string[];
// }>, LogInRequestAction | LogInSuccessAction | LogInFailureAction | LogOutAction | AddPostAction>

// (alias) combineReducers<{
//   user: (prevState: UserState | undefined, action: UserReducerActions) => UserState;
//   posts: (prevState: string[] | undefined, action: AddPostAction) => string[];
// }>(
```
> `reducers\index.ts`의 **reudcer**랑 **combineReducers**를 보면 타입추론이 되어진 것을 확인할 수 있다. <br>



## 리덕스 컴포넌트 타이핑
[위로올라가기](#강좌7)

#### App.tsx (수정 전)
```js
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { logIn, logOut } from './actions/user';

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
  dispatchLogOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

```


#### App.tsx (수정 후)
```js
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { logIn, logOut } from './actions/user';
import { Dispatch } from 'redux'; // redux의 Dispatch를 가져와야한다.
import { RootState } from './reducers'; // 추가
import { UserState } from './reducers/user'; // 추가

interface StateProps { // state의 타입
  user: UserState,
}
interface DisaptchProps {  // dispatch의 타입
  dispatchLogIn: ({ id, password }: { id: string, password: string}) => void,
  dispatchLogOut: () => void,
}

class App extends Component<StateProps & DisaptchProps> { // 타입설정

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

// 밑에 코드를 참조할 것..
const mapStateToProps = (state: RootState) => ({ // reducers의 폴더의 reducer를 불러와야한다.
  user: state.user,
  posts: state.posts,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({ // redux의 Dispatch이다.
  dispatchLogIn: (data: {id: string, password: string}) => dispatch(logIn(data)), // 아직 에러로 표시되는데, 나중에 코드 타이핑을 할 것이이다.
  dispatchLogOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

```

#### reducers\index.ts (수정 후)
```js
import { combineReducers } from 'redux';
import userReducer from './user';
import postReducer from './post';


const reducer = combineReducers({
  user: userReducer,
  posts: postReducer,
});

// export type RootState2 = typeof reducer;
// type RootState2 = (state: CombinedState<{
//   user: UserState;
//   posts: string[];
// }> | undefined, action: LogInRequestAction | LogInSuccessAction | LogInFailureAction | LogOutAction | AddPostAction) => CombinedState<...>

export type RootState = ReturnType<typeof reducer>;
// type RootState = {
//   readonly [$CombinedState]?: undefined;
// } & {
//   user: UserState;
//   posts: string[];
// }
// 여기에서 & 이전에는 상관없고, & 이후에 타입 정의가 되어진 것을 확인할 수 있다.

export default reducer;
```
> ***ReturnType***은 타입스크립트 유틸리티이다. 함수의 리턴을 가져온다. <br>
> 타입하는게 어려우면 위에 경우처럼 하나씩 접근하는게 좋다. <br>


