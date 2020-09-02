# 강좌4

  - [useReducer 타이핑](#useReducer-타이핑)





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

#### TicTacToe.tsx(reducer 사용하기)
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


