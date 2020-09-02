import * as React from 'react';
import { Dispatch, FunctionComponent, useMemo, useRef, useEffect, memo } from 'react';
import Td from './Td';

interface Props {
  key: number,
  dispatch: Dispatch<any>,
  rowIndex: number,
  rowData: string[],
}

const Tr: FunctionComponent<Props> = memo<React.PropsWithChildren<Props>>(({ key ,dispatch, rowIndex ,rowData }) => {
  
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
});

export default Tr;
