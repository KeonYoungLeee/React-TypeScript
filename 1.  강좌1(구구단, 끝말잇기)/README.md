# 강좌1

  - [강좌 소개](#강좌-소개)





## 강좌 소개
[위로올라가기](#강좌1)


<pre><code>npm i typescript react react-dom
npm i awesome-typescript-loader webpack webpack-cli -D
npm i @types/react @types/react-dom</code></pre>

> **typescript** : 타입스크립트 설치 <br>
> **react** : 기본적인 리액트 사용하기 위해서 react 설치 <br>
> **react-dom** : 웹 환경에서 react-dom사용, 앱 환경에서는 react-native를 사용 <br>
> **webpack, webpack-cli** : 리액트를 사용할 때에는 최신문법, js문법을 사용하기 때문에 webpack을 사용한다. <br>
>> react에서는 babel을 사용했다. 왜? babel을 사용하지 않냐? <br>
>> 타입스크립트는 자체적으로 바벨처럼 es5, es3까지도 지원하기 떄문에, 바벨은 따로 필요없다. <br>
>> 가끔씩 타입스크립트도 바벨 사용하긴 한다. <br>
> 웹팩과 타입스크립트를 이어주기 위한 **ts-loader, awesome-typescript-loader**가 있다. 2개가 가장 유명 <br>
>> 여기에서는 awesome-typescript-loader를 사용하겠다. <br>
> **@types/react @types/react-dom** : `DefinitelyTyped`에서 react, react-dom의 타입들을 정의해놓았기 때문에 설치를 한다.

### 실행 명령어
<pre><code>npm run dev 
npx webpack</code></pre>

> 타입스크립트에서는 npx tsc 실행했는데 <br>
> 웹팩과 타입스크립트 연결했개 때문에 npx webpack을 사용한다. <br>

#### package.json
```js
{
  ...생략
  "dependencies": {
    "@types/react": "^16.9.48",
    "@types/react-dom": "^16.9.8",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "typescript": "^3.9.7"
  },
  "devDependencies": {
    "awesome-typescript-loader": "^5.2.1",
    "webpack": "^4.44.1",
    "webpack-cli": "^3.3.12"
  }
}
```