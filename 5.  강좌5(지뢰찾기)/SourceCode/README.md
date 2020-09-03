# 강좌5

  - [지뢰찾기와 복습](#지뢰찾기와-복습)
  - [Context API 타이핑](#Context-API-타이핑)





## 지뢰찾기와-복습
[위로올라가기](#강좌5)

#### MineSearch.tsx
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

const initalState: ReducerState = {
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
const reducer = (state = initalState, action: ReducerActions): ReducerState => {
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

#### MineSearch.tsx
```js
import * as React from 'react';
import { useEffect, useReducer, useMemo, Dispatch, createContext } from 'react';

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

interface Context {
  tableData: number[][],
  halted: boolean,
  dispatch: Dispatch<ReducerActions>,
}

export const TableContext = createContext<Context>({
  tableData: [],
  halted: true,
  dispatch: () => {},
});

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