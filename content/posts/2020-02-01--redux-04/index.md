---
title: 리액트와 리덕스 그리고 리덕스 사가 비동기처리 - Redux series(4)
subTitle: React, Redux, Middleware Redux-Saga, Typescript
cover: redux.png
category: "React"
---
  
![redux](redux.png)  
  
저번 포스팅에선 리액트와 타입스크립트 환경에서 리덕스 사가를 사용해봤습니다.  
  
## 리덕스 사가에서의 비동기처리 방법  
우리가 사용하는 리덕스의 리듀서모듈은 순수함수로 작성됨이 원칙이므로 실제로 비동기 처리를 하기 쉽지 않습니다. 이를 위해서 리덕스 미들웨어를 사용하고 저번 포스팅에서는 리덕스 사가를 이용해 보았습니다. 이번 포스팅에서는 리덕스 사가를 이용한 비동기처리 예제를 확인해보겠습니다.  
  
사용할 코드는 바로 이전 포스팅에서 사용하던 코드를 수정하는 방식으로 해보겠습니다.  
  
```typescript
// src/modules/counter/actions.ts  

// 액션
export const INCREASE = 'counter/INCREASE' as const;
export const DECREASE = 'counter/DECREASE' as const;
export const INCREASE_ASYNC = 'counter/INCREASE_ASYNC' as const;
export const DECREASE_ASYNC = 'counter/DECREASE_ASYNC' as const;

// 액션 생성함수
export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });
export const increaseAsync = () => ({ type: INCREASE_ASYNC });
export const decreaseAsync = () => ({ type: DECREASE_ASYNC });

// 액션객체 타입
export type CounterActionType =
  | ReturnType<typeof increase>
  | ReturnType<typeof decrease>
  | ReturnType<typeof increaseAsync>
  | ReturnType<typeof decreaseAsync>;

```
수정한 부분은 ASYNC 액션과 액션생성함수를 추가하고 액션객체타입을 추가해주었습니다.  
  
```typescript
// src/modules/counter/sagas.ts

import { put, takeEvery, delay, takeLatest } from 'redux-saga/effects';
import { increase, decrease, INCREASE_ASYNC, DECREASE_ASYNC } from './actions';

export function* increaseSaga() {
  yield put(increase());
}

export function* decreaseSaga() {
  yield put(decrease());
}

export function* increaseAsyncSaga() {
  yield delay(1000);
  yield put(increase());
}

export function* decreaseAsyncSaga() {
  yield delay(1000);
  yield put(decrease());
}

export function* counterSaga() {
  yield takeEvery(INCREASE_ASYNC, increaseAsyncSaga);
  yield takeLatest(DECREASE_ASYNC, decreaseAsyncSaga);
}

```
<code>sagas.ts</code> 파일에 새로운 <code>increaseAsyncSaga</code>, <code>decreaseAsyncSaga</code> 함수를 추가했습니다. 이 함수들은 새로 만든 _ASYNC 액션들이 발생했을때 각각 <code>increaseAsyncSaga</code>, <code>decreaseAsyncSaga</code> 를 통해 1000ms 의 딜레이 이후 <code>INCREASE</code>, <code>DECREASE</code> 를 발생시켜 실제 리듀서에서 각 <code>state + 1</code>, <code>state - 1</code> 를 반환합니다.  
  
<code>counterSaga()</code>라는 새로운 사가로 새로 만들었던 사가들을 합쳐줍니다.
  
그리고 <code>takeEvery</code>는 딜레이중 발생시킨 액션갯수에 상관없이 모두 처리한다는 의미입니다. 1초에 5번을 누르면 1초뒤에 5번의 <code>INCREASE</code> 액션이 발생하여 <code>state + 1</code>이 5번 발생합니다.  
반대로 <code>takeLatest</code>는 딜레이중 발생시킨 액션갯수에 상관없이 가장 마지막의 액션만 처리합니다. 1초에 5번을 누르면 1초뒤에 단 1개의 <code>DECREASE</code>만 발생합니다.  
  
```typescript
// src/modules/counter/index.ts

import { combineReducers } from 'redux';
import counter, { counterSaga } from './counter';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({
  counter
});

export function* rootSaga() {
  yield all([counterSaga()]);
}

export type RootReducerType = ReturnType<typeof rootReducer>;

export default rootReducer;

```
마지막으로 <code>index.ts</code> 파일에서 우리가 이용할 사가를 변경해줍니다.  
  
```tsx
// src/components/Counter.tsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootReducerType } from '../modules';
import { increaseAsync, decreaseAsync } from '../modules/counter';

const Counter = () => {
  const state = useSelector((state: RootReducerType) => state.counter);
  const dispatch = useDispatch();

  const handleIncrease = () => {
    dispatch(increaseAsync());
  }

  const handleDecrease = () => {
    dispatch(decreaseAsync());
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
<code>Counter</code> 컴포넌트에서 디스패치 할 액션을 변경하신 뒤에 이벤트를 발생시켜보세요. 우리가 만든 카운터가 1초뒤에 잘 작동하나요? 그렇다면 마구마구 버스팅도 해보세요. <code>up</code> 버튼을 눌렀을때는 클릭횟수에 상관없이 모든 액션이 발생합니다. 하지만 <code>down</code> 버튼의 경우 클릭횟수에 상관없이 단 한번의 액션만 발생합니다. 이렇게 순수리듀서에서 처리하기 힘든 사이드이펙트를 사가를 이용하면 손쉽게 처리할 수 있습니다.  
  
## 실제 API를 이용한 비동기 처리  
이제 실제 API를 이용하여 비동기처리를 해보겠습니다. 사용할 API는 유저들의 정보를 가져와 표시해주는 것입니다. 기존 프로젝트 <code>moduels</code> 폴더에 <code>users</code> 폴더를 생성해주세요. 그리고 차례대로 파일을 작성해보겠습니다.  
  
```typescript
// src/modules/users/types.ts

// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

export type UsersType = {
  id:       number;
  name:     string;
  username: string;
  email:    string;
  address:  Address;
  phone:    string;
  website:  string;
  company:  Company;
}

export type Address = {
  street:  string;
  suite:   string;
  city:    string;
  zipcode: string;
  geo:     Geo;
}

export type Geo = {
  lat: string;
  lng: string;
}

export type Company = {
  name:        string;
  catchPhrase: string;
  bs:          string;
}

```
먼저 우리가 사용할 데이터의 <code>types</code>를 지정해주겠습니다.  

```text
yarn add axios redux-devtools-extension
```
우리가 사용할 패키지들입니다. <code>axios</code> 는 API를 <code>fetch</code> 하는 기능을 합니다. <code>redux-devtools-extension</code> 은 우리의 리덕스가 어떻게 동작하는지 쉽게 디버깅할 수 있게 도와줍니다.
  
```typescript
// src/modules/users/actions.ts

import { AxiosError } from 'axios';
import { UsersType } from './types';

export const GET_USERS_START = 'users/GET_USERS_START' as const;
export const GET_USERS_SUCCESS = 'users/GET_USERS_SUCCESS' as const;
export const GET_USERS_ERROR = 'users/GET_USERS_ERROR' as const;

export const getUsersStart = () => ({ type: GET_USERS_START });
export const getUsersSuccess = (users: UsersType[]) => ({
  type: GET_USERS_SUCCESS,
  payload: users
});
export const getUsersError = (error: AxiosError) => ({
  type: GET_USERS_ERROR,
  payload: error
});

export type GetUsersActionsType =
  | ReturnType<typeof getUsersStart>
  | ReturnType<typeof getUsersSuccess>
  | ReturnType<typeof getUsersError>;

```
그 다음은 액션과 액션함수, 액션함수타입을 지정합니다. 에러타입에 미리 <code>AxiosError</code> 타입을 지정하겠습니다. 그리고 <code>users</code>의 타입 또한 미리 선언해두었던 <code>UserType[]</code>으로 지정합니다. 각각 <code>payload</code>로 파라미터를 넘겨주었습니다.  
  
```typescript
// src/modules/users/reducer.ts

import {
  GetUsersActionsType,
  GET_USERS_START,
  GET_USERS_SUCCESS,
  GET_USERS_ERROR
} from './actions';
import { UsersType } from './types';
import { AxiosError } from 'axios';

type State = {
  loading: boolean;
  data: UsersType[] | null;
  error: AxiosError | null;
};

const initiaState = {
  loading: false,
  data: null,
  error: null
};

export default function users(
  state: State = initiaState,
  action: GetUsersActionsType
): State {
  switch (action.type) {
    case GET_USERS_START:
      return {
        ...state,
        loading: true
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    case GET_USERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    default:
      return state;
  }
}

```
그 다음은 리듀서 작성입니다. 리듀서의 기본 <code>state</code> 타입과 <code>action</code> 타입을 미리 지정하고 리듀서함수 반환 타입도 미리 지정해두시면 실수도 방지하고 더 편합니다.  
  
```typescript
// src/modules/users/sagas.ts

import { put, call, takeEvery } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import { getUsersSuccess, getUsersError, GET_USERS_START } from './actions';

function* getUsers () {
  const users: AxiosResponse = yield call(() => axios.get('http://jsonplaceholder.typicode.com/users'));
  try {
    yield put(getUsersSuccess(users.data));
  } catch(e) {
    yield put(getUsersError(e));
  }
}

export function* getUsersSaga() {
  yield takeEvery(GET_USERS_START, getUsers)
}
```
그 다음은 <code>sagas.ts</code> 파일입니다. 이전에 사용해보지 않았던 <code>call</code> 헬퍼함수는 해당 함수가 반환될 때까지 기다려줍니다. 이렇게 사가에서 미리 비동기처리를 해주고 리듀서에서는 반환된 값만을 가지고 상태값을 변경시킬 수 있습니다.  
  
```typescript
// src/modules/users/index.ts

import { combineReducers } from 'redux';
import counter, { counterSaga } from './counter';
import users, { getUsersSaga } from './users';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({
  counter,
  users
});

export function* rootSaga() {
  yield all([counterSaga(), getUsersSaga()]);
}

export type RootReducerType = ReturnType<typeof rootReducer>;

export default rootReducer;

```
<code>index.ts</code> 파일도 우리가 바꾼 구조에 맞게 변경해줍니다.  
  
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
import { composeWithDevTools } from 'redux-devtools-extension';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

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
가장 상위의 <code>index.tsx</code>를 위와같이 변경합니다 아까 설치한 디버깅익스텐션을 사용하기 위함입니다.  
  
```tsx
// src/components/Users.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootReducerType } from '../modules';
import { getUsersStart } from '../modules/users';

const Users = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootReducerType) => state.users);
  console.log(state);

  useEffect(() => {
    dispatch(getUsersStart());
  }, [dispatch]);

  const { loading, data } = state;

  if (loading) {
    // (1)
    return <div>Loading...</div>;
  }

  return (
    // (2)
    <div>
      {data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

export default Users;


```
이제 <code>Users</code> 컴포넌트에서 <code>dispatch</code> 함수를 이용하여 함수를 바인딩합니다. 그리고 지금같은 경우에는 의존성 배열이 없는 <code>useEffect</code> 안쪽에서 사용하였기 때문에 컴포넌트가 마운트 된 후 바로 <code>dispatch(getUserStart())</code> 가 실행됩니다.  
  
화면에 잠시 <code>Loading...</code> 표시가 떴다가 유저 정보가 잘 표시되나요? 어떻게 이런 조건부 렌더링이 가능한지 살펴보면 중간의 <code>loading</code> 의 상태가 <code>true</code> 일땐 <code>Loading...</code> 을 렌더링 하기로 (1)의 if문 으로 처리했습니다. 우리 리듀서 모듈의 초깃값을 생각해보세요. <code>loading: false</code> 지만 컴포넌트가 마운트 된 이후 직후 바로 디스패치를 시작하기 때문에 <code>loading: true</code> 로 변경됩니다.  
  
그리고 아래쪽 (2)의 <code>return</code> 을 보시면 <code>data?.map(...)</code> 의 문법이 있습니다. 이 문법은 타입스크립트 3.7 버전 이상부터 도입된 [Optional Chaining](https://devblogs.microsoft.com/typescript/announcing-typescript-3-7-rc/#optional-chaining) 문법입니다. 이 문법은 <code>data</code> 가 <code>null</code> 혹은 <code>undefined</code> 인지 확인하는 것 입니다. 그렇다면 <code>&&</code> 연산자와 무엇이 다를까요? 바로 <code>&&</code> 연산자는 <code>falsy</code> 값 즉 <code>false</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>, <code>''</code>, <code>0</code> 들을 체크하지만 <code>?.</code> 문법은 <code>null</code>과 <code>undefined</code>만을 체크합니다. 이렇게 우리의 <code>data</code> 가 정상적인 값 일때만 유저를 렌더링하도록 코드를 작성하였습니다.  
  
## 마무리 🎓  
이번 포스팅에서는 리덕스 사가를 이용한 비동기 처리와 실제 API를 이용한 비동기 처리를 해보았습니다. 물론 아주 간단한 비동기 처리이지만 정확하게 코드를 작성하지 않으면 프로덕션에서 쉽게 이슈가 생기는 부분이 바로 비동기 처리입니다.  
  
이렇게 리덕스의 대부분을 알아보았습니다. 아직 배울것이 많지만 리덕스 시리즈는 여기서 마무리를 하겠습니다.
  
## Reference  
* [Redux](https://redux.js.org/)
* [Reudx-Saga](https://redux-saga.js.org/)