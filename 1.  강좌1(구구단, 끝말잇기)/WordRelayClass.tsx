import * as React from 'react';
import { Component, createRef } from 'react';

interface IState {
  word: string,
  value: string,
  result: string,
}

class WordRelayClass extends Component<{}, IState>{
  
  state = {
    word: '제로초',
    value: '',
    result: '',
  };

  onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const input = this.input;
    const input2 = this.onRefInput2.current; // craeteRef 사용 방법
    if (this.state.word[this.state.word.length - 1] === this.state.value[0]) {
      this.setState({
        result: '딩동댕',
        word: this.state.value,
        value: '',
      });
      if (input2) {
        input2.focus();
      }
    } else {
      this.setState({
        result: '땡',
        value: '',
      });
      if (input2) {
        input2.focus();
      }
    }
  };

  onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.currentTarget.value });
  };

  // creataeRef가 아닌 일방적인 input을 사용 할 경우
  input: HTMLInputElement | null = null; 
  onRefInput = (c: HTMLInputElement) => {
    this.input = c;
  };

  // craeteRef 사용 방법 
  onRefInput2 = createRef<HTMLInputElement>(); // 타입추론

  render() {
    return (
      <>
        <div>{this.state.word}</div>
        <form onSubmit={this.onSubmitForm}>
          <input 
            // ref={this.onRefInput}
            ref={this.onRefInput2} // craeteRef 사용 방법
            value={this.state.value} 
            onChange={this.onChangeInput} />
          <button>클릭!!!</button>
        </form>
        <div>{this.state.result}</div>
      </>
    );
  }
}

export default WordRelayClass;
