# 강좌5

  - [지뢰찾기와 복습](#지뢰찾기와-복습)
  - [Context API 타이핑](#Context-API-타이핑)
  - [useContext 타이핑](#useContext-타이핑)





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
> dispatch 이런 함수를 한방에 내려보내기 위해서 **React.ContextAPI**를 사용하겠다. <br>
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


## useContext 타이핑
[위로올라가기](#강좌5)

> `Form`, `Table` 컴포넌트를 구현하겠다. <br>
> Form은 초기에 시작할 떄 가로 줄, 세로 줄, 지뢰 수 정하는 컴포넌트이다. <br>

#### Form.tsx(useContext 적용하기)
```js
import * as React from 'react';
import { START_GAME, startGame, TableContext } from './MineSearch';
import { useState, useCallback, useContext, memo } from 'react'; // useContext 사용

const Form = () => {
  const [row, setRow] = useState(10);
  const [cell, setCell] = useState(10);
  const [mine, setMine] = useState(20);
  const { dispatch } = useContext(TableContext); // TableContext를 여기에다가 사용한다.
  // 위에 선언된 TableContext를 넣어준다음, dispatch를 적어준다.

  const onChangeRow = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRow(Number(e.target.value));
  }, []);

  const onChangeCell = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCell(Number(e.target.value));
  }, []);

  const onChangeMine = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMine(Number(e.target.value));
  }, []);

  const onClickBtn = useCallback(() => {
    dispatch(startGame(row, cell, mine));
  }, [row, cell, mine]);

  return (
    <div>
      <input type="number" placeholder="세로" value={row} onChange={onChangeRow} />
      <input type="number" placeholder="가로" value={cell} onChange={onChangeCell} />
      <input type="number" placeholder="지뢰" value={mine} onChange={onChangeMine} />
      <button onClick={onClickBtn}>시작</button>
    </div>
  );
}

export default memo(Form);
```

#### action.ts (타입분리)
```js
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

export type ReducerActions = StartGameAction | OpenCellAction | ClickMineAction | FlagMineAction | QuestionCellAction | NormalizeCellAction | IncrementTimerAction;
```
> `MineSearch.tsx`의 코드 양이 많아서 전부 분리를 하겠다. <br>
> `ReducerActions`도 export 해준다. <br>

#### MineSearch.tsx (import 해주기)
```js
...생략
...생략
import {
  ReducerActions, START_GAME, OPEN_CELL, INCREMENT_TIMER, NORMALIZE_CELL,
  QUESTION_CELL, FLAG_CELL, CLICK_MINE,
} from './action'; // action을 import해주기
...생략

```
> 마지막으로 import를 해주는 거 잊어버리지 말기 <br>

#### MineSearch.tsx (OPEN_CELL 완성시키기)
> 여기서 OPEN_CELL미완성인데, 코드 작성해주었다. 내용설명은 생략하고 타입만 보겠다. <br>
> 내용설명은 리액트 강좌에 있을테니 리액트 강좌 참고 <br>
```js
// ...생략
// ...생략

const reducer = (state = initialState, action: ReducerActions): ReducerState => {
  switch (action.type) {
    // ...생략
    // ...생략
      case OPEN_CELL: {
        const tableData = [...state.tableData];
        tableData.forEach((row, i) => {
          tableData[i] = [...row];
        });
        const checked: string[] = [];
        let openedCount = 0;
        const checkAround = (row: number, cell: number) => {
        console.log(row, cell);
        if (row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) {
          return;
        }
        if (([CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION]).includes(tableData[row][cell])) { // *************includes Error****************
          return;
        }
        if (checked.includes(row + '/' + cell)) {
          return;
        } else {
          checked.push(row + '/' + cell);
        }
        let around = [
          tableData[row][cell - 1], tableData[row][cell + 1],
        ];
        if (tableData[row - 1]) {
          around = around.concat([tableData[row - 1][cell - 1], tableData[row - 1][cell], tableData[row - 1][cell + 1]]);
        }
        if (tableData[row + 1]) {
          around = around.concat([tableData[row + 1][cell - 1], tableData[row + 1][cell], tableData[row + 1][cell + 1]]);
        }
        const count = around.filter(function (v) {
          return ([CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE]).includes(v); // *************includes Error****************
        }).length;
        if (count === 0) {
          if (row > -1) {
            const near = [];
            if (row - 1 > -1) {
              near.push([row - 1, cell - 1]);        
              near.push([row - 1, cell]);        
              near.push([row - 1, cell + 1]);        
            }        
            near.push([row, cell - 1]);        
            near.push([row, cell + 1]);        
            if (row + 1 < tableData.length) {        
              near.push([row + 1, cell - 1]);        
              near.push([row + 1, cell]);        
              near.push([row + 1, cell + 1]);        
            }      
            near.forEach((n) => {        
              if (tableData[n[0]][n[1]] !== CODE.OPENED) {        
                checkAround(n[0], n[1]);        
              }        
            })        
          }        
        }        
        if (tableData[row][cell] === CODE.NORMAL) {   
          openedCount += 1;        
        }        
        tableData[row][cell] = count;
      };           
      checkAround(action.row, action.cell);     
      let halted = false;     
      let result = '';     
      console.log(state.data.row * state.data.cell - state.data.mine, state.openedCount, openedCount);    
      if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) { // 승리    
        halted = true;  
        result = `${state.timer}초만에 승리하셨습니다`;    
      }    
      return {
        ...state,
        tableData,
        openedCount: state.openedCount + openedCount,
        halted,
        result,
      };
    }
    // ...생략
    // ...생략
  }
}

const MineSearch = () => {
  // ...생략
  // ...생략
}

export default MineSearch;
```

#### MineSearch.tsx (타입 설정해주기)
```js
interface ReducerState {
  tableData: (-7 | -1 | -2 | -3 | -4 | -5 | -6 | 0 )[][], // 수정 전
  // tableData: (typeof CODE[keyof typeof CODE])[][], // 수정 후
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

  tableData: (-7 | -1 | -2 | -3 | -4 | -5 | -6 | 0 )[][], // 수정 전
  // tableData: (typeof CODE[keyof typeof CODE])[][], // 수정 후
  halted: boolean,
  dispatch: Dispatch<ReducerActions>,
}

...생략
...생략
}
```

> 실제로 tableData는 타입을 좁게하기 위해서 위와 같이 적어줘야한다. <br>
> 하지만 위와 같은 식으로하면 *하드코딩*이 되기떄문에 다른 방법으로 바꿔줘야한다. <br>
> `tableData: (-7 | -1 | -2 | -3 | -4 | -5 | -6 | 0 )[][],` → `tableData: (typeof CODE[keyof typeof CODE])[][],` <br>
>> ***value 부부만 가져오는 방법 : `typeof 객체이름[keyof typeof 객체이름]`*** <br>

> 위와 같이 `tableData: (typeof CODE[keyof typeof CODE])[][],`로 교체해주면 에러가 나온다.

### Minsearch.tsx(수정후)
```js
// const plantMine = (row: number, cell: number, mine: number) => { // 수정 전
const plantMine = (row: number, cell: number, mine: number): (typeof CODE[keyof typeof CODE])[][] => { // 수정 후
  console.log(row, cell, mine);
  const candidate = Array(row * cell).fill(undefined).map((arr, i) => {
    return i;
  });
  const shuffle = [];
  while (candidate.length > row * cell - mine) {
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }
  const data = [] // error: 수정 전
  const data: (typeof CODE[keyof typeof CODE])[][] = []; // 수정 후
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
```
> `(typeof CODE[keyof typeof CODE])[][]`이 중복이 되어서 따로 새로운 `type alias`로 생성해줄 것이다. <br>
>> `type Codes = (typeof CODE[keyof typeof CODE]);` 타입을 만들어줄 것이다. <br>

#### MineSearch.tsx(type alias를 적용(type Codes))
```js
type Codes = (typeof CODE[keyof typeof CODE]);
interface ReducerState {
  tableData: Codes[][], // 타입적용
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
  tableData: Codes[][], // 타입적용
  halted: boolean,
  dispatch: Dispatch<ReducerActions>,
}

...생략

const plantMine = (row: number, cell: number, mine: number): Codes[][] => { // 타입적용
  console.log(row, cell, mine);
  const candidate = Array(row * cell).fill(undefined).map((arr, i) => {
    return i;
  });
  const shuffle = [];
  while (candidate.length > row * cell - mine) {
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }
  const data: Codes[][] = []; // 타입적용
  for (let i = 0; i < row; i++) {
    const rowData: Codes[] = []; // 타입적용
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
```

#### MineSearch.tsx(타입 형 변환)

> 타입 형 변환을 안 시켜주면 범위 오차가 있어서 에러가 나온다. <br>
>> 따라서, 타입 형 변환을 시켜준다. <br>
```js
// ...생략
// ...생략

case OPEN_CELL: {
    const tableData = [...state.tableData];
    tableData.forEach((row, i) => {
      tableData[i] = [...row];
    });
    const checked: string[] = [];
    let openedCount = 0;
    const checkAround = (row: number, cell: number) => {
    console.log(row, cell);
    if (row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) {
      return;
    } 

    // 타입 형변환 시켜주기
    if (([CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION] as Codes[]).includes(tableData[row][cell])) { 
      return;
    } 
    // 생략
    // 생략
    
    // 수정 전
    // const count = around.filter(function (v) { 
    //   // 타입이 더 깐깐해지기 떄문에 타입 형변환을 해줘도 괜찮다. 
    // // includes동작하기 위해서는 절차가 복잡하다.
    //   return ([CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE] ).includes(v);
    // }).length;

    // // 수정 후 : 타입 형변화 시켜주기
    const count = around.filter(function (v) {
      return ([CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE] as Codes[]).includes(v);
    }).length as Codes;


    if (count === 0) {
      if (row > -1) {
        const near = [];
        if (row - 1 > -1) {
          near.push([row - 1, cell - 1]);        
          near.push([row - 1, cell]);        
          near.push([row - 1, cell + 1]);        
        }        
        near.push([row, cell - 1]);        
        near.push([row, cell + 1]);        
        if (row + 1 < tableData.length) {        
          near.push([row + 1, cell - 1]);        
          near.push([row + 1, cell]);        
          near.push([row + 1, cell + 1]);        
        }      
        near.forEach((n) => {        
          if (tableData[n[0]][n[1]] !== CODE.OPENED) {        
            checkAround(n[0], n[1]);        
          }        
        })        
      }        
    }        
    if (tableData[row][cell] === CODE.NORMAL) {
      openedCount += 1;        
    }        
    tableData[row][cell] = count;
  };           
  // ....생략  
  return {
    ...state,
    tableData,
    openedCount: state.openedCount + openedCount,
    halted,
    result,
  };
}
// ...생략
// ...생략
```
> 타입이 더 깐깐해지기 떄문에 타입 형변환을 해줘도 괜찮다. <br>
> includes동작하기 위해서는 절차가 복잡하다. <br>



