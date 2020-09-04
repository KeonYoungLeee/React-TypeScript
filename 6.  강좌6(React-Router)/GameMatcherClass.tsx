import * as React from 'react';
import { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import NumberBaseball from '../2.  강좌2(숫자야구, 반응속도체크)/BaseBallGame/NumberBaseBall';
import RSP from '../3.  강좌3(가위바위보, 로또추첨기)/RSP/RSP';
import Lotto from '../3.  강좌3(가위바위보, 로또추첨기)/Lotto/Lotto';
import { RouteChildrenProps } from 'react-router-dom';

class GameMatcher extends Component<RouteComponentProps<{ name: string }>> {
    render() {
        if (!this.props.match) {
            return (
                <div>
                    일치하는 게임이 없습니다.
                </div>
            );
        }
        let urlSearchParams = new URLSearchParams(this.props.location.search.slice(1));
        console.log(urlSearchParams.get('page'));
        if (this.props.match.params.name === 'number-baseball') {
            return <NumberBaseball />
        } else if (this.props.match.params.name === 'rock-scissors-paper') {
            return <RSP />
        } else if (this.props.match.params.name === 'lotto-generator') {
            return <Lotto />
        } else {
            return (
                <div>
                    일치하는 게임이 없습니다.
                </div>
            );
        }
    }
}

export default withRouter(GameMatcher);