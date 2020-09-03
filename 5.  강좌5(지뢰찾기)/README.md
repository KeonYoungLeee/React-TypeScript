# 강좌5

  - [지뢰찾기와 복습](#지뢰찾기와-복습)
  - [Context API 타이핑](#Context-API-타이핑)





## 지뢰찾기와-복습
[위로올라가기](#강좌5)

#### MineSearch.tsx(초기 설정)
```js
import * as React from 'react';
import { useEffect, useReducer, useMemo, Dispatch } from 'react';

export const CODE = {
  MINE: -7,
  NORMAL: -1,
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4,
  FLAG_MINE: -5,
  CLICKED_MINE: -6,
  OPENED: 0, // 0 이상이면 다 opened
} as const;


interface ReducerState {
  tableData: number[][],
  data: {
    row: number,
    cell: number,
    mine: number,
  },
  timer: number,
  result: string,
  halted: boolean,
  openedCount: number,
}

const initialState: ReducerState = {
  tableData: [],
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: '',
  halted: true,
  openedCount: 0,
}
```

#### MineSearch.tsx(지뢰 랜덤으로 넣기, 액션 타입 정의 및 인터페이스 구현)
```js
...생략
...생략

const plantMine = (row: number, cell: number, mine: number) => {
  console.log(row, cell, mine);
  const candidate = Array(row * cell).fill(undefined).map((arr, i) => {
    return i;
  });
  const shuffle = [];
  while (candidate.length > row * cell - mine) {
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }
  const data = [];
  for (let i = 0; i < row; i++) {
    const rowData: number[] = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }

  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
  }

  console.log(data);
  return data;
};

export const START_GAME = 'START_GAME' as const;
export const OPEN_CELL = 'OPEN_CELL' as const;
export const CLICK_MINE = 'CLICK_MINE' as const;
export const FLAG_CELL = 'FLAG_CELL' as const;
export const QUESTION_CELL = 'QUESTION_CELL' as const;
export const NORMALIZE_CELL = 'NORMALIZE_CELL' as const;
export const INCREMENT_TIMER = 'INCREMENT_TIMER' as const;

interface StartGameAction {
  type: typeof START_GAME,
  row: number,
  cell: number,
  mine: number,
}

export const startGame = (row: number, cell: number, mine: number): StartGameAction => {
    return {
        type: START_GAME, row, cell, mine,
    };
};

interface OpenCellAction {
  type: typeof OPEN_CELL,
  row: number,
  cell: number,
}

export const openCell = (row: number, cell: number): OpenCellAction => {
    return {
        type: OPEN_CELL, row, cell,
    };
};

interface ClickMineAction {
  type: typeof CLICK_MINE,
  row: number,
  cell: number,
}

export const clickMine = (row: number, cell: number): ClickMineAction => {
    return {
        type: CLICK_MINE, row, cell,
    };
};

interface FlagMineAction {
  type: typeof FLAG_CELL,
  row: number,
  cell: number,
}

export const flagMine = (row: number, cell: number): FlagMineAction => {
    return {
        type: FLAG_CELL, row, cell,
    };
};

interface QuestionCellAction {
  type: typeof QUESTION_CELL,
  row: number,
  cell: number,
}

export const questionCell = (row: number, cell: number): QuestionCellAction => {
    return {
        type: QUESTION_CELL, row, cell,
    };
};

interface NormalizeCellAction {
  type: typeof NORMALIZE_CELL,
  row: number,
  cell: number,
}

export const normalizeCell = (row: number, cell: number): NormalizeCellAction => {
    return {
        type: NORMALIZE_CELL, row, cell,
    };
};

interface IncrementTimerAction {
  type: typeof INCREMENT_TIMER,
}

export const incrementTimer = (): IncrementTimerAction => {
    return {
        type: INCREMENT_TIMER,
    };
};

type ReducerActions = StartGameAction | OpenCellAction | ClickMineAction | FlagMineAction | QuestionCellAction | NormalizeCellAction | IncrementTimerAction;
// 마지막으로 ReducerActions에다가 모아준다.
```
> 인터페이스들은 다른 파일로 분리를 하고 import로 가져온다. 


#### MineSearch.tsx(Reducer구현)
```js
...생략
...생략

type ReducerActions = StartGameAction | OpenCellAction | ClickMineAction | FlagMineAction | QuestionCellAction | NormalizeCellAction | IncrementTimerAction;
const reducer = (state = initialState, action: ReducerActions): ReducerState => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        data: {
          row: action.row,
          cell: action.cell,
          mine: action.mine,
        },
        openedCount: 0,
        tableData: plantMine(action.row, action.cell, action.mine),
        halted: false,
        timer: 0,
      };
    case OPEN_CELL: // 나중에 적어주겠다.
    case CLICK_MINE: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] = CODE.CLICKED_MINE;
      return {
        ...state,
        tableData,
        halted: true,
      };
    }
    case FLAG_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.MINE) {
          tableData[action.row][action.cell] = CODE.FLAG_MINE;
      } else {
          tableData[action.row][action.cell] = CODE.FLAG;
      }
      return {
          ...state,
          tableData,
      };
  }
    case QUESTION_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.FLAG_MINE) {
        tableData[action.row][action.cell] = CODE.QUESTION_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.QUESTION;
      }
      return {
        ...state,
        tableData,
      };
    }
    case NORMALIZE_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.QUESTION_MINE) {
        tableData[action.row][action.cell] = CODE.MINE;
      } else {
        tableData[action.row][action.cell] = CODE.NORMAL;
      }
      return {
        ...state,
        tableData,
      };
    }
    case INCREMENT_TIMER: {
      return {
        ...state,
        timer: state.timer + 1,
      }
    }
    default:
      return state;
  }
}

```


## Context API 타이핑
[위로올라가기](#강좌5)


#### MineSearch.tsx(실제 컴포넌트 구현, ContextAPI 구현)
```js
import * as React from 'react';
// contextAPI를 사용하기 위해서 createContext를 사용해야한다.
import { useEffect, useReducer, useMemo, Dispatch, createContext } from 'react';

...생략
...생략

interface Context {
  tableData: number[][],
  halted: boolean,
  dispatch: Dispatch<ReducerActions> 
  // 또는
  // dispatch: Dispatch<any> // action가 많으면 any넣어도 상관은 없다. 
}

export const TableContext = createContext<Context>({ // 여기에서도 직접 타이핑을 해줘야한다.
  tableData: [],
  halted: true,
  dispatch: () => {},
});

...생략
...생략

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, halted, timer, result } = state;

  // value는 useMemo로 사용한다.
  // dispatch를 넣지 않는 이유는 값이 바뀌지 않기떄문에 안 넣어줬다.
  const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted]);

  return (
    // ContextAPI를 사용할려면 Provider로 감싸줘야한다. 그리고 value로 감싸줘야한다.
    <TableContext.Provider value={value}>
      <Form />
      <div>{timer}</div>
      <Table />
      <div>{result}</div>
    </TableContext.Provider>
);
}

export default MineSearch;
```
> dispatch 이런 함수를 한방에 내려보내기 위해서 ***React.ContextAPI**를 사용하겠다. <br>
> 나중에 interface는 재사용 할 수도 있기떄문에, `types파일`을 만들어 따로 관리하는게 좋다. <br>


#### MineSearch.tsx(게임구현)
```js

...생략
...생략

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, halted, timer, result } = state;

  const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted]);

  useEffect(() => {
    let timer: number;
    if (halted === false) {
      timer = window.setInterval(() => {
        dispatch({ type: INCREMENT_TIMER });
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    }
  }, [halted]);

  return (
    <TableContext.Provider value={value}>
      <Form />
      <div>{timer}</div>
      <Table />
      <div>{result}</div>
    </TableContext.Provider>
);
}

export default MineSearch;
```


