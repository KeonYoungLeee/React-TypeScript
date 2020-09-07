# 강좌7

  - [리덕스 구조 잡기](#리덕스-구조-잡기)
  - [action, reducer 타이핑](#action,-reducer-타이핑)
  - [리덕스 컴포넌트 타이핑](#리덕스-컴포넌트-타이핑)
  - [redux thunk 타이핑](#redux-thunk-타이핑)





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


## 리덕스 컴포넌트 타이핑
[위로올라가기](#강좌7)

#### reducers\index.ts
```js
import { combineReducers } from 'redux';
import userReducer from './user';
import postReducer from './post';


const reducer = combineReducers({
  user: userReducer,
  posts: postReducer,
});
export type RootState = ReturnType<typeof reducer>;

export default reducer;
```

#### reducers\index.ts
```js
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { logIn, logOut } from './actions/user';
import { Dispatch } from 'redux';
import { RootState } from './reducers';
import { UserState } from './reducers/user';

interface StateProps {
  user: UserState,
}
interface DisaptchProps {
  dispatchLogIn: ({ id, password }: { id: string, password: string}) => void,
  dispatchLogOut: () => void,
}

class App extends Component<StateProps & DisaptchProps> {

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

const mapStateToProps = (state: RootState) => ({
  user: state.user,
  posts: state.posts,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchLogIn: (data: {id: string, password: string}) => dispatch(logIn(data)),
  dispatchLogOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```


## redux thunk 타이핑
[위로올라가기](#강좌7)

#### actions\user.ts
```js
import { addPost } from "./post";

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST' as const;
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS' as const;
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE' as const;
export const LOG_OUT = 'LOG_OUT';

export interface LogInRequestAction {
  type: typeof LOG_IN_REQUEST,
  data: {
    id: string,
    password: string,
  }
}
export const logInRequest = (data: { id: string, password: string }): LogInRequestAction => {
  return {
    type: LOG_IN_REQUEST,
    data,
  }
};

export interface LogInSuccessAction {
  type: typeof LOG_IN_SUCCESS,
  data: {
    userId: string,
    nickname: string,
  },
}
export const logInSuccess = (data: { nickname: string, userId: string }): LogInSuccessAction => {
  return {
    type: LOG_IN_SUCCESS,
    data,
  }
};

export interface LogInFailureAction {
  type: typeof LOG_IN_FAILURE,
  error: Error,
}
export const logInFailure = (error: Error): LogInFailureAction => {
  return {
    type: LOG_IN_FAILURE,
    error,
  }
};

interface ThunkDispatch {
  (thunkAction: ThunkAction): void,
  <A>(action: A): A,
  <TAction>(action: TAction | ThunkAction): TAction,
}

type ThunkAction = (dispatch: ThunkDispatch) => void;
export const logIn = (data: { id: string, password: string}): ThunkAction => { 
  return (dispatch) => {
    dispatch(logInRequest(data));
    try {
      setTimeout(() => {
        dispatch(logInSuccess({
            userId: '1',
            nickname: 'LEEKY'
        }));
        dispatch(addPost(''));
      }, 1000);
    } catch (error) {
      dispatch(logInFailure(error));
    }
  }
};

export interface LogOutAction {
  type: typeof LOG_OUT,

}

export const logOut = () => {
  return {
    type: LOG_OUT,
  }
}
```


#### store.ts
```js
import { createStore, MiddlewareAPI, Dispatch, AnyAction, compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';

const initialState = {
  user: {
    isLoggingIn: false,
    data: null,
  },
  posts: [],
}

const firstMiddleware = (stroe: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  console.log('로깅', action);
  next(action);
}

const thunkMiddleware = (store: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: any) => {
  if ( typeof action == "function") {
    return action(store.dispatch, store.getState); 
  };
  return next(action);
}

const enhancer = process.env.NODE_ENV === 'production'
  ? compose(applyMiddleware(firstMiddleware))
  : composeWithDevTools(
    applyMiddleware(firstMiddleware, thunkMiddleware)
  )

const store = createStore(reducer, initialState, enhancer);

export default store;
```


