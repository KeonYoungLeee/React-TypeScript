# 강좌4

  - [useReducer 타이핑](#useReducer-타이핑)
  - [Dispatch, children](#Dispatch,-children)
  - [Reducer 타이핑](#Reducer-타이핑)
  - [React JSX 부분 타이핑 및 ReactNode ReactElement 설명](#React-JSX-부분-타이핑-및-ReactNode-ReactElement-설명)
  - [질문 (2차원 배열, tslint, tsconfig)](#질문-(2차원-배열,-tslint,-tsconfig))





## useReducer 타이핑
[위로올라가기](#강좌4)


#### TicTacToe.tsx(initialState에다가 타입정의 해주기)
```js
import * as React from 'react';
import { useEffect, useCallback, useReducer, Reducer } from 'react';

interface ReducerState { // 타입을 정확하기 위해서 ReducerState라는 인터페이스를 만들어주었다.
  winner: 'O' | 'X' | '',
  turn: 'O' | 'X',
  tableData: string[][],
  recentCell: [number, number],
}

const initialState: ReducerState = {
  winner: '',
  turn: 'O',
  tableData: [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ],
  recentCell: [-1, -1],
};


const TicTacToe = () => {
  return (
    <>
      <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch} />
      {winner && <div>{winner}님의 승리</div>}
    </>
  );
};

export default TicTacToe;

```
> initialState도 타입정의를 해주기위해서 interface를 만들어줘야한다. <br>
>> initialState에 초기화를 해주고, initialState의 interface에는 타입들을 선언해준다. <br>
>> initialState의 interface 이름은 임의로 지어도 상관없다. <br>


#### TicTacToe.tsx(Action 타입정의하기)
```js
import * as React from 'react';
import { useEffect, useCallback, useReducer, Reducer } from 'react';

...생략

// 액션들을 만들어주기
export const SET_WINNER = 'SET_WINNER' as const;
export const CLICK_CELL = 'CLICK_CELL' as const;
export const CHANGE_TURN = 'CHANGE_TURN' as const;
export const RESET_GAME = 'RESET_GAME' as const;

// 액션들의 타입을 정의해주었다. 
interface SetWinnerAction {
  type: typeof SET_WINNER;
  winner: 'O' | 'X';
}

// 이 부분에서 액션을 만들어주었다. 여기에서 변하는 값들이 있기때문에 액션을 만들어주었다.
const setWinner = (winner: 'O' | 'X'): SetWinnerAction => {
  return { type: SET_WINNER, winner };
};

// 액션들의 타입을 정의해주었다.
interface ClickCellAction {
  type: typeof CLICK_CELL;
  row: number;
  cell: number;
}
// 이 부분에서 액션을 만들어주었다. 여기에서 변하는 값들이 있기때문에 액션을 만들어주었다.
const clickCell = (row: number, cell: number): ClickCellAction => {
  return { type: CLICK_CELL, row, cell };
};

// 여기에서는 변하는 값들이 없기 때문에 액션 그 자체이기 떄문에 그대로 사용하였다.
interface ChangeTurnAction {
  type: typeof CHANGE_TURN;
}

interface ResetGameAction {
  type: typeof RESET_GAME;
}

const TicTacToe = () => {
  return (
    <>
      <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch} />
      {winner && <div>{winner}님의 승리</div>}
    </>
  );
};

export default TicTacToe;

```
> 여기서 액션을 만들어주는데 값이 변화는 값이랑 변하지 않는 값이 있다. <br>
> 값이 변하는 것은 `createAction`을 해준다 (액션을 만들어준다.) <br>
> 값이 변하지 않는 것은 그대로 사용해도 된다. (확인은 소스코드에서 가능하다.) <br>

#### TicTacToe.tsx(reducer정의 하기)
```js
...생략
...생략

// 바꾸기 전
// const reducer = (state: ReducerState, action: SetWinnerAction | ClickCellAction | ChangeTurnAction | ResetGameAction): ReducerState => {};

// 바꾸기 후
// 이렇게 타입정의하면 기니까 짦게 정의를 한다.
type ReducerActions = SetWinnerAction | ClickCellAction | ChangeTurnAction | ResetGameAction;
const reducer = (state: ReducerState, action: ReducerActions): ReducerState => {
  switch (action.type) {
    case SET_WINNER:
      // state.winner = action.winner; 이렇게 하면 안됨.
      return {
        ...state,
        winner: action.winner,
      };
    case CLICK_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]]; // immer라는 라이브러리로 가독성 해결
      tableData[action.row][action.cell] = state.turn;
      return {
        ...state,
        tableData,
        recentCell: [action.row, action.cell],
      };
    }
    case CHANGE_TURN: {
      return {
        ...state,
        turn: state.turn === 'O' ? 'X' : 'O',
      };
    }
    case RESET_GAME: {
      return {
        ...state,
        turn: 'O',
        tableData: [
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
        ],
        recentCell: [-1, -1],
      };
    }
    default:
      return state;
  }
};

const TicTacToe = () => {

  return (
    <>
      <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch} />
      {winner && <div>{winner}님의 승리</div>}
    </>
  )
};

export default TicTacToe;
```

#### TicTacToe.tsx(reducer 사용하기 및 props 전달하기)
```js
...생략
...생략

const TicTacToe = () => {
  const [state, dispatch] = useReducer(reducer, initialState); // useReducer 사용하기
  const { tableData, turn, winner, recentCell } = state; // 구조분해하기

  const onClickTable = useCallback(() => {
    dispatch(setWinner('O'));
  }, []);

  return (
    <>
      <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch} />
      {winner && <div>{winner}님의 승리</div>}
    </>
  )
};
```

> Table컴포넌트는 다음시간에 만들 것이다. <br>



## Dispatch, children
[위로올라가기](#강좌4)

#### Table.tsx (props 전달하기)
```js
import * as React from 'react';
import { useMemo, FunctionComponent, Dispatch } from 'react';

interface Props {
  tableData: string[][];
  dispatch: Dispatch<any>
  onClick: () => void;
}

const Table: FunctionComponent<Props> = ({ tableData, dispatch }) => {

  // 기능은 나중에 구현, 일단 타입정의랑 props정의만 하였음

  return (
    <table>
      {Array(tableData.length).fill(null).map((tr, i) => (
        useMemo(
          () => <Tr key={i} dispatch={dispatch} rowIndex={i} rowData={tableData[i]} />,
          [tableData[i]],
        )
      ))}
    </table>
  )
}

export default Table;

```

#### Tr.tsx (props 전달하기)
```js
import * as React from 'react';
import { Dispatch, FunctionComponent, useMemo, useRef, useEffect } from 'react';
import Td from './Td';

interface Props {
  key: number,
  dispatch: Dispatch<any>,
  rowIndex: number,
  rowData: string[],
}

const Tr: FunctionComponent<Props> = ({ key ,dispatch, rowIndex ,rowData }) => {
  
  // 기능은 나중에 구현, 일단 타입정의랑 props정의만 하였음

  return (
    <tr>
      {Array(rowData.length).fill(null).map((td, i) => (
        useMemo(
          () => <Td key={i} dispatch={dispatch} rowIndex={rowIndex} cellIndex={i} cellData={rowData[i]}>{''}</Td>,
          [rowData[i]],
        )
      ))}
    </tr>
  );
};

export default Tr;

```
> `{''}`(빈 배열) 이 부분은 컴포넌트와 컴포넌트 사이에 들어있는 children이다. <br>

#### Td.tsx (props 전달받기)
```js
import * as React from 'react';
import { useCallback, useEffect, useRef, memo, Dispatch, FunctionComponent } from 'react';
import { CLICK_CELL } from './TicTacToe';

interface Props {
  rowIndex: number;
  cellIndex: number;
  dispatch: Dispatch<any>;
  cellData: string;
  children: string; // 위에서 사용했던(children) `{''}` 이 부분을 가져온 것이다.
}

const Td: FunctionComponent<Props> = ({ rowIndex, cellIndex, dispatch, cellData }) => {

  const onClickTd = useCallback(() => {
    console.log(rowIndex, cellIndex);
    if (cellData) {
      return;
    }
    dispatch({ type: CLICK_CELL, row: rowIndex, cell: cellIndex });
  }, [cellData]);

  return (
    <td onClick={onClickTd}>{cellData}</td>
  )
};

export default Td;
```

> context-api는 타입선언은 나중에 하겠다. <br>

#### TicTacToe.tsx (게임 승리, 무승부 조건 만들기)
```js
import * as React from 'react';
import { useEffect, useReducer, useCallback, Reducer } from 'react';
import Table from './Table';

...생략
...생략

const TicTacToe = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, turn, winner, recentCell } = state;

  useEffect(() => { // 승자 가리는 effect
    const [row, cell] = recentCell; // 가장 최근에 누른 칸
    if (row < 0) {
      return;
    }
    let win = false;
    if (tableData[row][0] === turn && tableData[row][1] === turn && tableData[row][2] === turn) {
      win = true;
    }
    if (tableData[0][cell] === turn && tableData[1][cell] === turn && tableData[2][cell] === turn) {
      win = true;
    }
    if (tableData[0][0] === turn && tableData[1][1] === turn && tableData[2][2] === turn) {
      win = true;
    }
    if (tableData[0][2] === turn && tableData[1][1] === turn && tableData[2][0] === turn) {
      win = true;
    }
    if (win) { // 승리했을 때
      dispatch({ type: SET_WINNER, winner: turn });
      dispatch({ type: RESET_GAME });
    } else { // 무승부인지 알아내기
      let all = true; // all이 true면 무승부
      tableData.forEach((row) => { // 무승부 검사
        row.forEach((cell) => {
          if (!cell) { // 빈칸이 있으면 all을 false로 한다.
            all = false; 
          }
        });
      });
      if (all) { // all이 true라서 무승부라면
        dispatch({ type: RESET_GAME }); // 게임 리셋
      } else {
        dispatch({ type: CHANGE_TURN }); // 턴을 넘기기
      }

    }
  }, [recentCell]);

  const onClickTable = useCallback(() => {
    dispatch(setWinner('O'));
  }, []);

  return (
    <>
      <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch} />
      {winner && <div>{winner}님의 승리</div>}
    </>
  )
};

export default TicTacToe;
```


## Reducer 타이핑
[위로올라가기](#강좌4)

#### Reducer 타입추론
```js
// 1)
const [state, dispatch] = useReducer(reducer, initialState);

// 2) 2번은 3번이 어떻게 만들어지는 보여주기위해서 적어 놓은 것이다. 2번처럼해놓으면 에러가나서 결국에는 3번처럼 해야한다.
const [state, dispatch] = useReducer<React.Reducer>(reducer, initialState);
// type React.Reducer<S, A> = (prevState: S, action: A) => S 형태를 보면 이와같이 되어있다. 
// React.Reducer에 state와 action이 있는 것을 확인 할 수가 있다.

// 3)
const [state, dispatch] = useReducer<React.Reducer<ReducerState, ReducerActions>>(reducer, initialState);
// 4)
const [state, dispatch] = useReducer<(state: ReducerState, action: ReducerActions) => ReducerState>(reducer, initialState);
```
> useReducer도 정확하게 타이핑을 할 수가 있다. <br>
> 원래는 1번과 같이 해주는데, 타입추론이 안 될경우에는 3번처럼 해줘야한다. <br>
> 3번과 4번은 의미가 같은 것이다. 3번은 4번을 더 축소해줄 수 있는 것을 보여주기 위한 것이다. <br>


#### React.memo 타입추론하기
```js
import * as React from 'react';
import { Dispatch, FunctionComponent, useMemo, useRef, useEffect, memo } from 'react'; // memo 추가하기
import Td from './Td';

...생략

// memo 타입추론 적용하기
const Tr: FunctionComponent<Props> = memo<React.PropsWithChildren<Props>>(({ key ,dispatch, rowIndex ,rowData }) => { 
  
  return (
    <tr>
      ...생략
      ...생략
    </tr>
  );
});

export default Tr;

```


## React JSX 부분 타이핑 및 ReactNode ReactElement 설명
[위로올라가기](#강좌4)

### React.Node VS React.Element

#### React.Node
> ***`React.Node`***에 보면 *type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;*가 정의되어져있다.
```js
<div>{}</div> // {}
```
> `{}` 안에 `컴포넌트, 문자, 숫자, boolean, null`등이 jsx칸에 넣을 수가 있다. (**ReactFragment**는 `<></>`) <br>
> 이런 것들을 전부 ***`React.Node`*** 라고 한다. 
> **React.Child**에는 **ReactElement**, **ReactText(string, number)**가 있다. <br>
> **ReactText**를 보면 string, number가 있는데, `{1}`, `{'문자열'}, <div>Text</div>`등과 같이 숫자, 문자열을 표현 할 수가 있다. <br>

#### React.Element
```js
// ReactElement의 타입
interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
}

// ReactElement의 타입예시
// 예로 들어서 tr.tsx에 코드소스를 보면
<Td key={i} dispatch={dispatch} rowIndex={rowIndex} cellIndex={i} cellData={rowData[i]}>{''}</Td> 
```
> 위에 타입에도 type, props, key가 있는 듯이 Td에도 key, type, props가 있는 것을 확인 할 수가 있다. <br>
> 즉, Td가 ***React.Element***라고 보면된다. <br>

>> 범위 : ReactNode > ReactChild, ReactChild > ReactElement, ReactText, ReactNumber (꼭 옆에처럼 되어있는 것이 아니다. 예로들기 위한 예시이다.) <br>


## 질문 (2차원 배열, tslint, tsconfig)
[위로올라가기](#강좌4)


### 2차원 배열 타입 설정
```js
interface xyz {
  a: boolean,
  z: number,
}
type aaa = string[]; // 1차원 배열 선언
type bbb = Array<string>; // 1차원 배열 선언
type CCC = Array<xyz>; // 1차원 배열 선언

interface ReducerState {
  tableDataArray1: string[][], // 2차원 배열 설정
  tableDataArray2: aaa[], // 2차원 배열 설정
  tableDataArray3: bbb[], // 2차원 배열 설정
  tableDataArray3: CCC[], // 2차원 배열 설정
}

```
> 배열의 배열을 만들면 2차원 배열이 된다. <br>


> 이차원 배열에서, 배열 안에 object, string, number 랜덤으로 들어오는 애들의 타입설정은? <br>
>> `type abc = (string | number | object)[];` <br>
>> 타입이 너무 많다 싶으면 `type abc = any[]` <br>
```js
type abc = ( string | number | object)[]; // 1차원 배열 선언
type xxx = any[]; // 1차원 배열 선언
interface ReducerState {
  tableDataArray2: aaa[], // 2차원 배열 설정
  any2Array: xxx[], // any 2차원 배열
}
```

### tslint에 대한 질문 (tslint를 하지말고 eslint 사용하기)
> 원래 tslint가 있었는데 eslint랑 통합되어있어서 **eslint를 추천**한다. <br>
> **typescript-eslint**를 하면 더 업격해진다. <br> 

### tsconfig 실무에서 사용하기(예시)

extendsion, 각각 프로젝트에 떄라서 다르다. <br>
예전에 사용했던 tsconfig.json을 사용하는 경우가 많다. <br>

9분10초에 참고하기. <br>


