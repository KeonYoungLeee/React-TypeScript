import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';

// import NumberBaseBall from './BaseBallGame/NumberBaseBall';
import ResponseCheck from './ResponseCheck/ResponseCheck';

const Hot = hot(ResponseCheck);

ReactDOM.render(<Hot />, document.querySelector('#root'));
