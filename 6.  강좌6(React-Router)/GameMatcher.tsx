import * as React from 'react';
import NumberBaseball from '../2.  강좌2(숫자야구, 반응속도체크)/BaseBallGame/NumberBaseBall';
import RSP from '../3.  강좌3(가위바위보, 로또추첨기)/RSP/RSP';
import Lotto from '../3.  강좌3(가위바위보, 로또추첨기)/Lotto/Lotto';
import { useRouteMatch, useLocation, useHistory } from 'react-router';

const GameMatcher = () => {
    const match = useRouteMatch<{ name: string }>();
    const location = useLocation();
    const history = useHistory();
    if (!match) {
        return (
          <div>
            일치하는 게임이 없습니다.
          </div>
        );
    }
    let urlSearchParams = new URLSearchParams(location.search.slice(1));
    console.log(urlSearchParams.get('page'));
    if (match.params.name === 'number-baseball') {
        return <NumberBaseball />
    } else if (match.params.name === 'rock-scissors-paper') {
        return <RSP />
    } else if (match.params.name === 'lotto-generator') {
        return <Lotto />
    } else {
        return (
            <div>
                일치하는 게임이 없습니다.
            </div>
        );
    }
}

export default GameMatcher;