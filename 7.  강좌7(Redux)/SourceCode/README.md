# 강좌7

  - [리덕스 구조 잡기](#리덕스-구조-잡기)
  - [action, reducer 타이핑](#action,-reducer-타이핑)





## 리덕스 구조 잡기
[위로올라가기](#강좌7)



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

#### App.tsx
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

#### clint.tsx
```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import store from './store'
import App from './App';

const Hot = hot(App);

ReactDOM.render(
  <Provider store={store}>
    <Hot />
  </Provider>
  , document.querySelector('#root')
);
```



## action, reducer 타이핑
[위로올라가기](#강좌7)


#### actions\post.ts
```js
export const ADD_POST = 'ADD_POST' as const;

export interface AddPostAction {
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

#### actions\user.ts
```js
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST' as const;
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS' as const;
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE' as const;
export const LOG_OUT = 'LOG_OUT';

export interface LogInRequestAction {
  type: typeof LOG_IN_REQUEST
  data: { id: string, password: string},
}
export interface LogInSuccessAction {
  type: typeof LOG_IN_SUCCESS,
  data: { userId: string, nickname: string},
}
export interface LogInFailureAction {
  type: typeof LOG_IN_FAILURE,
  error: Error,
}
export const logIn = (data: { id: string, password: string}) => {
  
}


export interface LogOutAction {
  type: typeof LOG_OUT,

}

export const logOut = () => {
  return {
    type: LOG_OUT,
  }
}
```

#### reducers\post.ts
```js
import { ADD_POST, AddPostAction } from '../actions/post'

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

#### reducers\user.ts
```js
import { 
  LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, LOG_OUT,
  LogInRequestAction, LogInSuccessAction, LogInFailureAction, LogOutAction
} from '../actions/user';

export interface UserState {
  isLoggingIn: boolean,
  data: {
    nickname: string,
  } | null,
}

const initialState: UserState = {
  isLoggingIn: false,
  data: null,
};

type UserReducerActions = LogInRequestAction | LogInSuccessAction | LogInFailureAction | LogOutAction;
const userReducer = (prevState = initialState , action: UserReducerActions) => {
  switch (action.type) {
    case LOG_IN_REQUEST:
    case LOG_IN_SUCCESS:
    case LOG_IN_FAILURE:
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


