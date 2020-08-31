import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';

// import RSP from './RSP/RSP';
import Lotto from './Lotto/Lotto';

const Hot = hot(Lotto);

ReactDOM.render(<Hot />, document.querySelector('#root'));
