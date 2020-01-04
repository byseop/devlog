---
title: 리액트와 리덕스 그리고 리덕스 사가, 타입스크립트 - Redux series(3)
subTitle: React, Redux, Middleware Redux-Saga, Typescript
cover: redux.png
category: "React"
---
  
![redux](redux.png)  
  
저번 포스팅에선 리액트와 타입스크립트 환경에서 리덕스를 실제로 사용하는 방법을 알아보았습니다. 이번 포스팅에선 리덕스 미들웨어에 대해서 알아보겠습니다.  
  
## 리덕스 미들웨어란? 🤔  
```js
const middleware = (store) => {
  return (next) => {
    return (action) => {
      if (action.type === 'ACTION_TYPE') {
        // 미들웨어가 액션을 판단해서 실행된다
        // ...
      }
    }
  }
}
```
미들웨어의 형태는 이렇게 생겼습니다. 미들웨어 내에 사용되는 파라미터는 클로저로 넣어줍니다.  
그렇다면 도대체 미들웨어를 왜 사용할까요?  
  
### 미들웨어의 등장  
기본적으로 리덕스의 규칙중 리덕스의 리듀서는 순수 함수이어야 합니다. 이는 즉 **부수적인 효과 작업이 불가능하다** 입니다. 따라서 비동기 작업 등 이러한 부수적인 작업을 처리하기 위해서는 미들웨어가 필요하게 되었습니다.  
리덕스의 미들웨어 종류에는 대표적으로 Redux-Thunk와 Redux-Saga 두가지가 있습니다. 이번 포스팅에선 제가 주로 사용하는 타입스크립트 환경에서의 리덕스 사가를 알아보도록 하겠습니다.  
  
## 리덕스 사가 🛰  
리덕스 사가는 리액트 리덕스의 사이드이펙트만을 담당하는 미들웨어중 하나입니다. 리덕스 사가는 우리의 앱에서 액션들을 받아 처리하고, 멈추고, 취소할 수 있게 만들어주고 리덕스 상태에 접근하여 액션을 디스패치 할 수 있습니다.  
  
리덕스 사가는 비동기흐름을 쉽게 읽고 쓰고 테스트 할 수있는 ES6의 문법인 Generator를 이용합니다. 리덕스 사가를 알아보기전에 Generator 함수에 대해 잘 모르신다면 [이 곳](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/function*)에서 먼저 확인해보세요.  
  
### 키워드  
리덕스 사가를 사용하기 전에 알아두면 좋은 헬퍼함수를 알아보겠습니다. 이 헬퍼함수들은 <code>redux-saga/effects</code> 패키지에 포함되어있습니다.
  
- <code>put</code>  
리듀서에게 액션을 디스패치합니다.  
```js
// put example
put(ActionCreateFunction)
```  
  
- <code>take</code>  
특정 문자열이 들어오기를 기다립니다.  
```js
// take example
yield take('String!')
```
  
- <code>delay</code>  
실행중이던 함수를 잠깐 멈춥니다. **함수를 동기적으로 사용할 수 있습니다.**  
```js
// delay example
delay(1000)
```
  
- <code>call</code>  
비동기적인 처리를 할 때 사용하며 특정함수를 호출하고 결과물이 반환될 때 까지 기다립니다.
```js
// call exmaple
call(api.getSomething)
```
  
우선은 이정도만 알아보고 추가로 필요한 키워드가 있으면 그때그때 알아보도록 하겠습니다.  
  
## 리덕스 사가 사용해보기 🎩  
먼저 기본적인 사가를 만들어 보겠습니다.  
  
### 카운터사가 프로젝트 생성  
```
npx create-react-app counter-saga --typescript
cd counter-saga
yarn add redux react-redux @types/react-redux react-saga @types/redux-saga
```
먼저 늘 하던 새로운 타입스크립트 기반의 CRA 프로젝트를 생성해주고, 사용할 패키지들을 설치합니다.  
  
### 카운터 리덕스 모듈 작성
이번에는 전 포스팅과 조금 다른 Ducks 패턴이 아닌 모듈별로 새로운 폴더를 만들고 그 안에 <code>index.ts</code>, <code>actions.ts</code>, <code>reducer.ts</code>, <code>sagas.ts</code> 등으로 분리하는 패턴으로 작성을 해보겠습니다.  
  
```typescript
// src/modules/counter/actions.ts

// 액션
export const INCREASE = 'counter/INCREASE' as const;
export const DECREASE = 'counter/DECREASE' as const;

// 액션 생성함수
export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });

// 액션객체 타입
export type CounterActionType =
  | ReturnType<typeof increase>
  | ReturnType<typeof decrease>;

```
먼저 <code>src/modules/counter</code> 경로대로 새로운 디렉토리를 생성하고 <code>actions.ts</code> 파일을 만들어 보겠습니다. <code>actions.ts</code> 파일에는 액션, 액션생성함수, 액션객체 타입등을 작성하겠습니다. 액션들은 이전 포스팅과 마찬가지로 나중에 작성할 리듀서에서 에러를 방지하기 위해 타입단언을 이용합니다.  
  
```typescript
// src/modules/counter/reducer.ts

import { INCREASE, DECREASE, CounterActionType } from './actions';

const initialState = 0;

const counter = (
  state: number = initialState,
  action: CounterActionType // (1)
): number => { // (2)
  switch (action.type) {
    case INCREASE:
      return state + 1;
    case DECREASE:
      return state - 1;
    default:
      return state;
  }
};

export default counter;

```
그리고 리듀서를 만들어줍니다. (1) 라인의 아까 타입단언을 이용하여 지정해둔 액션타입을 가져와 지정해줌으로써 리듀서 내부의 액션타입 추론이 정확하게 이루어집니다. 이 내용이 헷갈리신다면 이전 포스팅을 참고해보세요.  
  
(2) 라인의 리듀서함수의 리턴타입을 미리 <code>number</code>로 지정함으로써 추후에 발생할 에러나 실수를 방지합니다.  
  
```typescript
// src/modules/counter/sagas.ts

import { put } from 'redux-saga/effects';
import { INCREASE, DECREASE, increase, decrease } from './actions';

export function* increaseSaga() {
  yield put(increase());
}

export function* decreaseSaga() {
  yield put(decrease());
}

```
다음의 작성 파일은 <code>sagas.ts</code> 입니다. 사실 지금 하고있는 카운터 예제는 사이드이펙트가 없어 사가를 이용하는것이 무의미 하다고 할 수 있지만 사가를 이용한 카운터를 만들기 위한 예제이니 만들어 주어야겠죠.  
  
먼저 <code>put</code> 키워드를 보시면 위에서 설명한것과 같이 리듀서에게 액션을 디스패치한다는 의미입니다.  

<code>yield put(increase());</code> 코드를 좀 더 자세히 보면 <code>increase()</code> 는 <code>actions.ts</code> 에서 작성한 액션생성 함수이며 <code>{ type: 'counter/INCREASE' }</code> 를 반환하게됩니다. 그래서 저 코드라인은 <code>put({ type: 'counter/INCREASE' })</code> 과 같은 맥락이며 리듀서에게 이러한 타입의 액션을 발생시킴을 의미합니다.  
  
```typescript
// src/modules/counter/index.ts

export { default } from './reducer';
export * from './actions';
export * from './sagas';

```
그리고 카운터모듈 디렉토리의 <code>index.ts</code> 파일을 생성하여 다른파일에서 사용할수 있도록 <code>export</code> 해줍니다. 혹시 추후에 파일에서 너무 많은 타입들이 이용된다면 <code>types.ts</code> 같은 파일을 만들거나 API를 이용한다면 <code>api.ts</code> 같은 파일을 생성하여 이용할 수 있습니다. 이러한 디렉토리 구조는 개발자의 자유입니다.  
  
```typescript
// src/modules/index.ts

import { combineReducers } from 'redux';
import counter, { increaseSaga, decreaseSaga } from './counter';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({
  counter
});

export function* rootSaga() {
  yield all([increaseSaga(), decreaseSaga()]);
}

export type RootReducerType = ReturnType<typeof rootReducer>; // (1)

export default rootReducer;

```
우리가 만들었던 모듈들 지금은 하나의 카운터 모듈만 가지고 있지만, 이 모듈들을 하나의 파일에서 묶어줍니다.  
  
<code>all</code> 키워드는 배열안의 사가들을 동시에 실행시킵니다. 이 헬퍼함수를 이용하여 여러개의 사가를 동시에 이용할 수 있게 됩니다.  
  
(1) 라인의 루트리듀서의 타입을 미리 선언하는 이유는 추후에 작성할 컴포넌트에서 우리가 가진 리듀서모듈을 쉽게 조회하고 타입을 추론하기 위해서입니다.  
  
### 루트리듀서 적용하기  
```tsx
// index.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { rootSaga } from './modules';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

```
우리가 만든 리듀서모듈을 <code>index.tsx</code>에 <code>Provider</code>를 이용하여 적용합니다. 리덕스에 미들웨어를 적용하기 위해서 <code>applyMiddleware</code> 를 이용합니다. 렌더부분 위쪽에선 <code>run</code>을 이용하여 루트사가를 실행시킵니다.  
  
### 카운터 컴포넌트 작성  
```tsx
// src/components/Counter.tsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootReducerType } from '../modules';
import { increase, decrease } from '../modules/counter';

const Counter = () => {
  const state = useSelector((state: RootReducerType) => state.counter); // (1)
  const dispatch = useDispatch();

  const handleIncrease = () => {
    dispatch(increase());
  }

  const handleDecrease = () => {
    dispatch(decrease());
  }

  return (
    <>
      <div>{state}</div>
      <button onClick={handleIncrease}>up</button>
      <button onClick={handleDecrease}>down</button>
    </>
  );
};

export default Counter;

```
이제 우리가 만든 리듀서모듈을 이용할 컴포넌트인 <code>Counter</code> 컴포넌트를 만들고 적용시켜보겠습니다.  
  
(1) 라인의 <code>state</code> 에 아까 작성해두었던 루트리듀서 타입을 미리 지정해두면 쉽게 타입추론이 가능합니다. 그리고 각 액션생성 함수를 <code>dispatch</code> 안에서 실행시키면 우리가 만들어두었던 사가를 통해 리듀서에 도착합니다. 이렇게 중간에 사가를 거치면서 순수함수인 리듀서에서 컨트롤할수 없는 사이드이펙트(예를 들어 비동기처리)들을 처리할 수 있게 됩니다.  
  
## 마무리 🎓  
사실 이번 포스팅에서 사용한 예제는 사이드이펙트가 없기때문에 사가를 이용하지 않아도 충분합니다. 이 포스팅에서 사용된 튜토리얼은 미들웨어와 사가의 전체적인 동작을 알아보기 위함이고 다음 포스팅에서 사이드이펙트를 컨트롤하는 튜토리얼을 이용해 보겠습니다.  
  
## Reference  
* [Redux](https://redux.js.org/)
* [Reudx-Saga](https://redux-saga.js.org/)