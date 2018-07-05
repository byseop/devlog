---
title: ECMAScript 6 - 6. Destructuring
subTitle: ES6 - 디스트럭처링
cover: es6.jpg
category: "Javascript"
---

디스트럭처링(Destructuring)은 구조화된 배열 또는 객체를 Destructuring(비구조화, 파괴)하여 개별적인 변수에 할당하는 것이다.  
배열 또는 객체 리터럴에서 필요한 값만 추출하여 변수에 할당하거나 반환할 때 유용하다.  
  

## 1. 배열 디스트럭처링(Array destructuring)  
ES5에서 배열의 각 요소를 배열로부터 디스트럭처링하여 변수에 할당하기 위한 방법은 아래와 같다.
~~~javascript
// ES5
var arr = [1, 2, 3];

var one   = arr[0];
var two   = arr[1];
var three = arr[2];

console.log(one, two, three); // 1 2 3
~~~
ES6의 배열 디스트럭처링은 배열의 각 요소를 배열로부터 추출하여 변수 리스트에 할당한다. 이때 추출/할당 기준은 **배열의 인덱스**이다.
~~~javascript
// ES6 Destructuring
const arr = [1, 2, 3];

// 배열의 인덱스를 기준으로 배열로부터 요소를 추출하여 변수에 할당
const [one, two, three] = arr;

console.log(one, two, three); // 1 2 3
~~~
배열 디스트럭처링을 위해서는 할당 연산자 왼쪽에 배열 형태의 변수 리스트가 필요하다.
~~~javascript
let x, y, z;
[x, y, z] = [1, 2, 3];

//위의 구문과 동치이다.
let [x, y, z] = [1, 2, 3];
~~~
왼쪽의 변수 리스트와 오른쪽의 배열은 배열의 인덱스를 기준으로 할당된다.
~~~javascript
let x, y, z;

[x, y] = [1, 2];
console.log(x, y); // 1 2

[x, y] = [1];
console.log(x, y); // 1 undefined

[x, y] = [1, 2, 3];
console.log(x, y); // 1 2

[x, y] = [1, 2, 3];
console.log(x, z); // 1 3

// 기본값
[x, y, z = 3] = [1, 2];
console.log(x, y, z); // 1 2 3

[x, y = 10, z = 3] = [1, 2];
console.log(x, y, z); // 1 2 3

[x, ...y] = [1, 2, 3];
console.log(x, y); // 1 [ 2, 3 ]
~~~
ES6의 배열 디스트럭처링은 배열에서 필요한 요소만 추출하여 변수에 할당하고 싶은 경우에 유용하다. 아래의 코드는 Date 객체에서 년도, 월, 일을 추출하는 예제이다.
~~~javascript
const today = new Date();
const formattedDate = today.toISOString().substring(0, 10);
const [year, month, day] = formattedDate.split('-');
console.log([year, month, day]); // [ '2018', '05', '23' ]
~~~
ES6의 객체 디스트럭처링은 객체의 각 프로퍼티를 객체로부터 추출하여 변수 리스트에 할당한다. 이때 할당 기준은 **프로퍼티 이름(키)**이다.
~~~javascript
// ES6 Destructuring
const obj = { firstName: 'Youngseop', lastName: 'Bae' };
const { firstName, lastName } = obj;
console.log(firstName, lastName); // Youngseop Bae
~~~
객체 디스트럭처링을 위해서는 할당 연산자 왼쪽에 객체 형태의 변수 리스트가 필요하다.
~~~javascript
const { prop1: p1, prop2: p2 } = { prop1: 'a', prop2: 'b' };
console.log(p1, p2); // 'a' 'b'
console.log({ prop1: p1, prop2: p2 }); // { prop1: 'a', prop2: 'b' }

// 아래는 위의 축약형이다
const { prop1, prop2 } = { prop1: 'a', prop2: 'b' };
console.log({ prop1, prop2 }); // { prop1: 'a', prop2: 'b' }

//default value
const { prop1, prop2, prop3 = 'c' } = { prop1: 'a', prop2: 'b' };
console.log({ prop1, prop2, prop3 }); // { prop1: 'a', prop2: 'b', prop3: 'c' }
~~~
객체 디스트럭처링은 객체에서 프로퍼티 이름(키)으로 필요한 프로퍼티 값만을 추출할 수 있다. 아래의 코드를 보자.
~~~javascript
const todos = [
    { id: 1, content: 'HTML', completed: true },
    { id: 2, content: 'CSS', completed: false },
    { id: 3, content: 'JS', completed: false }
];

// todos 배열의 요소인 객체로부터 completed 프로퍼티만 추출한다.
const completedTodos = todos.filter(({ completed }) => completed);
console.log(completedTodos); // [ { id: 1, content: 'HTML', completed: true } ]
~~~
Array.prototype.filter 메소드의 콜백함수는 대상 배열(todos)을 순회하며 첫 번째 인자로 대상 배열의 요소를 받는다. 이때 필요한 프로퍼티(completed 프로퍼티)만을 추출할 수 있다.  
  
중첩객체의 경우는 아래와 같이 사용한다.
~~~javascript
const person ={
    name: 'Lee',
    address: {
        zipCode: '03068',
        city: 'Seoul'
    }
};

const { address: { city } } = person;
console.log(city); // 'Seoul'
~~~

<br>
<br>

## Reference
* [ECMAScript 6](http://www.ecma-international.org/ecma-262/6.0/ECMA-262.pdf)
* [ES6 In Depth: 디스트럭처링(Destructuring)](http://hacks.mozilla.or.kr/2015/09/es6-in-depth-destructuring/)