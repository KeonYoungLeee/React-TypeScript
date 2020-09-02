import * as React from 'react';
import { useCallback, useEffect, useRef, memo, Dispatch, FunctionComponent } from 'react';
import { clickcell } from './TicTacToe';

interface Props {
  rowIndex: number;
  cellIndex: number;
  dispatch: Dispatch<any>;
  cellData: string;
  children: string;
}

const Td: FunctionComponent<Props> = ({ rowIndex, cellIndex, dispatch, cellData }) => {
  

  const onClickTd = useCallback(() => {
    console.log(rowIndex, cellIndex);
    if (cellData) {
      return;
    }
    dispatch(clickcell(rowIndex, cellIndex));
  }, [cellData]);

  return (
    <td onClick={onClickTd}>{cellData}</td>
  )
};

export default Td;
