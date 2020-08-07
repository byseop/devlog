---
title: 리덕스란? 리덕스 기초 개념 - Redux series(1)
subTitle: Redux basic
cover: redux.png
category: "React"
---
  
![redux](redux.png)  

## 🤔 Redux란?  
리액트를 이용한 프론트엔드 개발을 해보셨거나 공부하셨다면 Redux나 Mobx 같은 상태관리 라이브러리를 많이 들어보셨을것 같습니다. 그렇다면 Redux란 무엇일까요?  
> Redux is a predictable state container for JavaScript apps.  
    
리덕스는 '자바스크립트 앱을 예측 가능한 상태 컨테이너' 라고 공식 Repo에서 말하고 있습니다.  
말 그대로 리액트 뿐 아니라 순수 자바스크립트의 상태관리에도 리덕스를 이용할 수 있습니다. 리덕스가 리액트와의 조합이 좋은 이유는 리덕스가 리액트의 작동원리중 하나인 상태변화를 쉽게 예측할 수 있도록 도와주기 때문입니다.  
  
## 🚀 모티브  
모던 자바스크립트 싱글페이지 어플리케이션(Single Page Application)의 관리해야 할 상태들이 더 많아지고 복잡해지고 있습니다. 이 상태들에는 서버와의 통신 뿐만 아니라 로컬환경에서 생성되는 상태들 또한 포함됩니다. 그리고 최근에는 UI를 관리하는 상태들의 복잡성이 크게 증가했습니다. 예를들어 라우터나 탭구조 그리고 페이지네이션 컨트롤 및 스피너 등등...  
  
이렇게 끊임없이 변화하는 상태들을 완벽하게 관리하기는 너무나도 어렵습니다. 나중에 다뤄볼 MVC아키텍처의 모델이 또 다른 모델의 상태를 변화시킬수 있다면, 뷰에서 모델을 업데이트 했을 때 이 모델이 또 다른 모델을 업데이트 할 수 있게 되며, 이는 또 다른 뷰를 업데이트 하게 됩니다. 결국 우리가 원하지 않는 뷰로 업데이트 되게 됩니다. 우리는 이렇게 상태변화에 대한 통제력을 쉽게 잃어버리기 때문에 어느 순간이 되면 우리는 더 이상 우리의 앱의 상태를 예측할수 없게 됩니다.  
  
이러한 복잡성은 변화와 비동기성 두가지 개념의 조합을 이해하기 힘들기 때문에 발생합니다. 리액트와 같은 프론트엔드 라이브러리나 프레임워크는 비동기 및 직접 DOM 조작을 모두 제거하여 뷰 레이어에서 이 문제를 해결하려고 합니다. 하지만 상태를 관리하고 데이터를 조작하는 것은 여전히 개발자들의 몫입니다. 여기서 리덕스가 유용합니다.  
  
## 👀 세 가지 원칙  
리덕스는 세 가지의 기본 원칙으로 설명할 수 있습니다.  
  
### Single source of truth  
우리의 앱 전체상태는 단일스토어로 관리합니다.  
단일스토어는 앱 전체를 쉽게 관리할 수 있는 범용성을 가지고, 또한 디버깅이나 개발자도구를 쉽게 사용할 수 있게 합니다.  
  
### State is read-only  
상태는 '읽기 전용' 이며, 상태를 변경할 수 있는 유일한 방법은 '액션 객체'를 이용하여 '액션'을 발생시키는 것입니다.
  
### Changes are made with pure functions  
리덕스의 리듀서는 순수 함수이어야 합니다. 여기서 순수함수란 어떤 함수에 동일한 파라미터를 주었을때 항상 같은 값을 리턴하고, 외부의 상태를 변경하지 않는 함수입니다. 리듀서는 이전의 상태와 액션을 받아서 다음 상태를 반환하는 순수한 함수입니다. 한개의 리듀서부터 시작해서 여러개의 리듀서들까지 한개의 상태트리에서 관리하게 됩니다.  
  
## 👈 개념정리  
리덕스의 튜토리얼을 하기 전 몇가지 알아야 할 개념들이 있습니다.  
  
### 액션 (Actions)  
위의 세 가지 원칙에서 설명했듯 상태변화를 일으키기 위해선 액션을 발생시켜야 합니다. 그 액션을 발생시키기 위해서는 '액션 객체'가 필요합니다. '액션 객체'는 다음과 같이 작성합니다.
```javascript
const ADD_TODO = 'ADD_TODO';
{ type: ADD_TODO, text: 'Build my first Redux app' }
```
액션은 객체의 형태를 하고있고, <code>type</code> 을 필수로 가져야 합니다. 그 외의 상태를 변화시킬 <code>text</code> 같은 값은 개발자의 자유입니다.  
  
혹은 '액션 생성함수(Action Creators)'를 이용하여 간단하게 파라미터를 받아와 액션을 미리 정의해 줄 수 있습니다.  
```javascript
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}

dispatch(addTodo('Build my first Redux app'));
```
  
### 리듀서 (Reducers)  
리듀서는 이전 상태와 액션을 받아서 다음 상태를 반환합니다. 여기서 액션은 어떤 일이 일어날지만 설명하는 객체이고, 리덕스 상태가 어떻게 변하는지 보여줄 수 없습니다. 이것은 리듀서가 순수 함수이기 때문입니다.  
```javascript
function reducer(state, action) {
  switch (action.type) {
    // ... 상태업데이트 로직이 존재합니다.
  }
}
```
리듀서는 이러한 형식으로 작성되고 이전의 상태와 액션을 받아 액션타입으로 미리 정의되어 있는 동작을 합니다.  
  
### 스토어 (Store)  
리덕스 한개의 애플리케이션에 하나의 스토어가 존재합니다. 스토어 내부에는 현재의 상태, 리듀서 그리고 몇가지 내장함수가 있습니다. 내장함수는 다음 모듈작성편에서 다루어 보겠습니다.
  
## 👍 NEXT?  
리덕스와 Mobx를 둘다 배워보고 사용해본 입장으로 확실히 리덕스가 러닝커브가 있는것 같습니다. 하지만 액션과 리듀서, 디스패치와 같은 중요 개념만 확실하게 익히게 된다면, 좋은 디버깅 경험이나 개발환경 그리고 큰 커뮤니티까지 가지고 있는 리덕스의 장점이 충분히 배울만 한 가치가 있는것 같습니다.  
  
다음 포스팅에선 리덕스 모듈작성을 몇가지 예시를 들어 작성해보도록 하겠습니다.  
  
## Reference  
* [Redux](https://redux.js.org/)