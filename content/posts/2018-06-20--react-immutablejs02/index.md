---
title: React - 리액트의 불변성과 Immutable.js 사용하기 -2-
subTitle: Immutable.js 사용해보기
cover: react.png
category: "React"
---

지난 포스트에서 리액트에서 불변성을 지키는 이유와 Immutable을 간단하게 설명했다.  
이 포스트에서는 Immutable을 사용법을 알아보자.  
  
<br>

이 포스트는 이어지는 튜토리얼입니다! [1편](https://byseop.github.io/2018/06/20/react-immutablejs01.html) 을 먼저 확인해주세요!

<br>
<br>

## Immutable.js 시작하기  
  
프로젝트에서 Immutable을 사용하려면 패키지 설치가 필요하다.  
```text
yarn add immutable
```
Immutable 을 사용할때는 몇가지 지켜야 할 규칙이 있다.  
  
1. 객체는 -> Map  
2. 배열은 -> List
3. 설정할때는 -> Set
4. 읽어올때는 -> Get
5. 읽어온 후 설정 할땐 -> update
6. 내부에 있는걸 ~할땐 -> In 을 붙인다. ex) setIn, getIn, updateIn ...
7. 일반 자바스크립트 객체로 변환 -> toJS()
8. List 에는 내장함수와 비슷한 함수들이 있다 ex) push, slice, filter, sort, concat ... 전부 불변함을 유지한다
9. 특정 key 를 지울때 혹은 List 에서 원소를 지울때 -> delete  
  
지난번 사용하던 프로젝트에 이어서 index.js에 연습용 코드를 작성해보자  
먼저 Immutable 을 import하고 Map과 List를 사용해보자.  
코드를 직접 써보고 이해하는것이 좋다!  
  
```jsx

// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Map, List } from 'immutable';

// 1. 객체는 Map
const obj = Map({
    foo: 1,
    inner: Map({
        bar: 10
    })
});

console.log(obj.toJS());


// 2. 배열은 List
const arr = List([
    Map({ foo: 1 }),
    Map({ bar: 2 }),
]);

console.log(arr.toJS());

// 3. 설정할때는 set
let nextObj = obj.set('foo', 5);
console.log(nextObj.toJS());
console.log(nextObj !== obj); // true


// 4. 값을 읽을때는 get
console.log(obj.get('foo'));
console.log(arr.get(0)); // List에는 index를 설정하여 읽음


// 5. 읽은다음 설정 할 때는 update
// 두번째 파라미터로 updater 함수가 들어감
nextObj = nextObj.update('foo', value => value + 1);
console.log(nextObj.toJS());


// 6. 내부에 있는것을 ~할때는 In을 붙인다
nextObj = obj.setIn(['inner', 'bar'], 20);
console.log((nextObj.getIn(['inner', 'bar'])));

let nextArr = arr.setIn([0, 'foo'], 10);
console.log(nextArr.getIn([0, 'foo']));


// 7. 일반 자바스크립트 객체로 변환할때는 toJS


// 8. List 내장함수는 배열과 비슷하다
nextArr = arr.push(Map({ qaz: 3 }));
console.log(nextArr.toJS());

nextArr = arr.filter(item => item.get('foo') === 1);
console.log(nextArr.toJS());


// 9. delete 로 key를 지울 수 있다
nextObj = nextObj.delete('foo');
console.log(nextObj.toJS());

nextArr = nextArr.delete(0);
console.log(nextArr.toJS());


ReactDOM.render(<App />, document.getElementById('root'));

```
처음보는 코드에 당황할 수 있지만 이런것들이 있다는것을 알아두고 Immutable을 사용하면서 적응해야한다.  
이 포스트에서 나온 부분은 Immutable 의 극히 일부분이지만 주로 사용되는것은 위의 9가지 기능이다.  
이제 기존의 index.js를 따로 저장하거나 지워준다.  
  
<br>

## 리액트 컴포넌트에서 Immutable 사용하기  
  
이제부터 본격적으로 리액트에서 Immutable 을 사용해보자! 우선 Immutable은 페이스북에서 만들었기 때문에 React와 어느정도 호환이 가능하다! 하지만 state 자체를 Immutable 데이터로 사용하는것 까지는 지원하지 않는다. 따라서 state 내부에 Immutable 객체를 만들어두고 상태관리를 모두 이 객체를 통해 진행해야한다.  
우선 state부터 변경해 보자.  
```jsx
// App.js

state = {
    data: Map({
        input: '',
        users: List([
            Map({
                id: 1,
                username: 'byseop'
            }),
            Map({
                id: 2,
                username: 'baeyoungseop'
            })
        ])
    })
}
```
위에서 말했던 규칙을 따라 차근차근 보면 data라는 객체를 Map으로 만들고, 그 내부에 있는 users 라는 배열을 List로 만들었다. 그리고 그 안에 또 객체들이 Map으로 만들어져 있다. 이렇게 수정하고 나면 몇가지 오류메세지가 나타난다. 이제 하나하나 고쳐주어야 한다.  
이제 setState를 하게 될 때도 코드를 조금씩 수정해야한다 onChange 부분도 다음과 같이 수정하자.  
```jsx
// App.js

onChange = (e) => {
    const { value } = e.target;
    const { data } = this.state;

    this.setState({
        data: data.set('input', value)
    });
}
```
아직 많이 복잡하진 않다. 이어서 onButtonClick 도 수정하자.
```jsx
// App.js

onButtonClick = () => {
    const { data } = this.state;

    this.setState({
        data: data.set('input', '')
            .update('users', users => users.push(Map({
                id: this.id++,
                username: data.get('input')
            })))
    })
}
```
이 부분은 전보다 코드가 복잡해졌다. 차근차근 해석해보면 onButtonClick을 눌렀을때 input이 공백으로 초기화 되어야 한다 따라서 data를 set으로 공백으로 만들었다. 
그후에 jQuery의 메서드체이닝처럼 여러개의 작업을 중첩할때는 data.set(...).update(...) 처럼 사용할 수 있다.  
update의 내용은 users에 push로 새로운 배열을 추가한다. 아까 언급한 List의 내장함수와 비슷한 역할을 하는 push는 불변함을 유지한다.  
  
상태 업데이트 로직이 완성되고 나면 render 함수도 변경해주어야 한다. Map객체 혹은 List배열의 값을 읽을때는 data.users 이런식으로 읽지 못하고 data.get('users') 이런식으로 읽을 수 있다.
```jsx
// App.js

render() {
    const { onChange, onButtonClick } = this;
    const { data } = this.state;
    const input = data.get('input');
    const users = data.get('users');

    return (
        <div>
            <div>
                <input onChange={onChange} value={input} />
                <button onClick={onButtonClick}>추가</button>
            </div>
            <h1>사용자 목록</h1>
            <div>
                <UserList users={users} />
            </div>
        </div>
    );
}
```
UserList와 User에서도 마찬가지로 값을 읽어올 때 get을 사용해야 한다.
```jsx
// UserList.js

import React, { Component } form 'react';
import User from './User';

class UserList extends Component {

    shouldCompnentUpdate(prevProps, prevState) {
        return prevProps.users !== this.props.users;
    }

    renderUsers = () => {
        const { users } = this.props;
        return users.map((user) => (
            <User key={user.get('id)} user={user} />
        ))
    }

    render ( {
        console.log('UserList 가 렌더링되고 있어요!')
        const { renderUsers } = this;
        return (
            <div>
                {renderUsers()}
            </div>
        );
    });
}

export default UserList;
```
```jsx
// User.js

import React, { Component } from 'react';

class User extends Component {

    shouldComponentUpdate(prevProps, prevState) {
        return this.props.user !== prevProps.user;
    }

    render() {
        const { username } = this.props.user.toJS();
        console.log('%s 가 렌더링 되고있어요!!!', username);
    }

    return(
        <div>
            {username}
        </div>
    );
}

export default User;
```

User 컴포넌트에서는 username을 보여주기 위해 <code>const username = this.props.user.get('username')</code> 을 해도 좋다. 하지만 위의 방식으로 toJS()를 한 결과를 비구조화 할당하는 방법도 있다  
여기까지 하면 Immutable을 사용하여 상태관리 하는것이 완성된다.  