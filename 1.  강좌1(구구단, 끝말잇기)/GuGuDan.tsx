import * as React from 'react';
import { useState, useRef } from 'react';

const GuGuDan = () => {

  const [first, setFirst] = useState(Math.ceil(Math.random() * 9));
  const [second, setSecond] = useState(Math.ceil(Math.random() * 9));
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const input =  inputRef.current;
    if(parseInt(value) === first * second) {
      setResult('정답');
      setFirst(Math.ceil(Math.random() * 9));
      setSecond(Math.ceil(Math.random() * 9));
      setValue('');
      if (input) {
        input.focus();
      }
    } else {
      setResult('떙');
      setValue('');
      if (input) {
        input.focus();
      }
    }
  }

  return (
    <>
      <div>{first} 곱하기 {second}는 ?</div>
      <form onSubmit={onSubmitForm}>
        <input
          ref={inputRef}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
      <div>{result}</div>
    </>
  );
};

export default GuGuDan;