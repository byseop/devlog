---
title: ECMAScript 6 - 4. Extended Parameter Handling -2-
subTitle: ES6 - Spread 연산자
cover: es6.jpg
category: "Javascript"
---

이 포스팅은 내용이 많아 1, 2편으로 나눠져 있습니다.  
  


ES5에서는 파라미터에 기본값을 설정할 수 없다. 따라서 적절한 인수가 전달되었는지 함수 내부에서 확인할 필요가 있다.  
ES6의 파라미터에 대해서 알아본다.  
    
  
## 3. Spread 연산자  
Spread 연산자(Spread Operator, ...)는 연산자의 대상 또는 배열 또는 이터러블을 개별 요소로 분리한다.
~~~javascript
// ...[1, 2, 3]는 [1, 2, 3]을 개별 요소로 분리한다(-> 1, 2, 3)
console.log(...[1, 2, 3]) // 1, 2, 3

// 문자열은 이터러블이다.
console.log(...'Hello'); // H e l l o

// Map과 Set은 이터러블이다.
console.log(...new Map([['a', '1'], ['b', '2']]));
~~~

<br>

### 3.1 함수의 인자로 사용하는 경우  
배열을 함수의 인자로 사용하고, 배열의 각 요소를 개별적인 파라미터로 전달하고 싶은 경우, Function.prototype.apply를 사용하는 것이 일반적이다.
~~~javascript
// ES5
function foo(x, y, z) {
    console.log(x); // 1
    console.log(y); // 2
    console.log(z); // 3
}

// 배열을 foo 함수의 인자로 전달하려고 한다.
const arr = [1, 2, 3];

// apply 함수의 2번째 인자(배열)는 호출하려는 함수(foo)의 개별 인자로 전달된다.
foo.apply(null, arr);
// foo.call(null, 1, 2, 3);
~~~
ES6의 Spread 연산자(...)를 사용한 배열을 함수의 인수로 사용하면 배열의 요소를 개별적으로 분리하여 순차적으로 파라미터에 할당한다.
~~~javascript
// ES6
function foo (x, y, z) {
    console.log(x); // 1
    console.log(y); // 2
    console.log(z); // 3
}

// 배열을 foo 함수의 인자로 전달하려고 한다.
const arr = [1, 2, 3];

// ...[1, 2, 3]은  [1, 2, 3]을 개별 요소로 분리한다(-> 1, 2, 3)
// spread 연산자에 의해 분리된 배열의 요소는 개별적인 인자로서 각각의 매개변수에 전달된다.
foo(...arr);
~~~
앞에서 살펴본 Rest 파라미터는 Spread 연산자를 사용하여 파라미터를 정의한 것을 의미한다. 형태가 동일하여 혼동할 수 있으니 주의가 필요하다.
~~~javascript
// Spread 연산자를 사용한 매개변수 정의 (= Rest 파라미터)
// ...rest 는 분리된 요소들을 함수 내부에 배열로 전달한다
function foo(param, ...rest) {
    console.log(param); // 1
    console.log(rest); // [2, 3]
}
foo(1, 2, 3);

// Spread 연산자를 사용한 인수
// 배열 인수는 분리되어 순차적으로 매개변수에 할당
function bar(x, y, z) {
    console.log(x); // 1
    console.log(y); // 2
    console.log(z); // 3
}

// ...[1, 2, 3]은 [1, 2, 3]을 개별 요소로 분리한다(-> 1, 2, 3)
// spread 연산자에 의해 분리된 배열의 요소는 개별적인 인자로서 각각의 매개변수에 전달된다.
bar(...[1, 2, 3]);
~~~
Rest 파라미터는 반드시 마지막 파라미터이어야 하지만 Spread 연산자를 사용한 인수는 자유롭게 사용할 수 있다.
~~~javascript
// ES6
function foo(v, w, x, y, z) {
    console.log(v); // 1
    console.log(w); // 2
    console.log(x); // 3
    console.log(y); // 4
    console.log(z); // 5
}

// ...[2, 3]은 [2, 3]을 개별 요소로 분리한다(-> 2, 3)
// spread 연산자에 의해 분리된 배열의 요소는 개별적인 인자로서 각각의 매개변수에 전달된다.
foo(1, ...[2, 3], 4, ...[5]);
~~~
<br>

### 3.2 배열에서 사용하는 경우
Spread 연산자를 배열에서 사용하면 보다 간결하고 가독성 좋게 표현할 수 있다. ES5에서 사용하던 방식과 비교하여 살펴보자.  

<br>

#### 3.2.1 concat  
ES5에서 기존 배열의 요소를 새로운 배열 요소의 일부로 만들고 싶은 경우, 배열 리터럴 만으로 해결할 수 없고 concat 메소드를 사용해야한다.
~~~javascript
// ES5
var arr = [1, 2, 3];
console.log(arr.concat([4, 5, 6])); // [1, 2, 3, 4, 5, 6]
~~~
Spread 연산자를 사용하면 배열 리터럴 만으로 기존 배열의 요소를 새로운 배열 요소의 일부로 만들 수 있다.
~~~javascript
// ES6
const arr = [1, 2, 3];
// ...arr은 [1, 2, 3]을 개별 요소로 분리한다
console.log([...arr, 4, 5, 6]); // [1, 2, 3, 4, 5, 6]
~~~

<br>

#### 3.2.2 push  
ES5에서 기존 배열에 다른 배열의 개별 요소를 각각 push하려면 아래와 같은 방법을 사용한다.
~~~javascript
//ES5
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];

// apply 메소드의 2번째 인자는 배열. 이것은 개별 인자로 push 메소드에 전달된다.
Array.prototype.push.apply(arr1, arr2);

console.log(arr1); // [1, 2, 3, 4, 5, 6]
~~~
Spread 연산자를 사용하면 아래와 같이 보다 간편하게 표현할 수 있다.
~~~javascript
// ES6
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// ...arr2는 [4, 5, 6]을 개별 요소로 분리한다
arr1.push(...arr2); // == arr1.push(4, 5, 6);

console.log(arr1); // [1, 2, 3, 4, 5, 6]
~~~

<br>

#### 3.2.3 splice  
ES5에서 기존 배열에 다른 배열의 개별 요소를 삽입하려면 아래와 같은 방법을 사용한다.
~~~javascript
var arr1 = [1, 2, 3, 6];
var arr2 = [4, 5];

// apply 메소드의 2번째 인자는 배열. 이것은 개별 인자로 push 메소드에 전달된다.
// [3, 0].concat(arr2) => [3, 0, 4, 5]
// arr1.splice(3, 0, 4, 5) => arr1[3] 부터 0개의 요소를 제거하고 그자리 (arr[3])에 새로운 요소(4, 5)를 추가한다.
Array.prototype.splice.apply(arr1, [3,0].concat(arr2));

console.log(arr1); // [1, 2, 3, 4, 5, 6]
~~~
Spread 연산자를 사용하면 아래와 같이 보다 간편하게 표현할 수 있다.
~~~javascript
// ES6
const arr1 = [1, 2, 3, 6];
const arr2 = [4, 5];

// ...arr2는 [4, 5]을 개별 요소로 분리한다.
arr1.splice(3, 0, ...arr2); // == arr1.splice(3, 0, 4, 5);

console.log(arr1); // [1, 2, 3, 4, 5, 6]
~~~

<br>

#### 3.2.4 copy  
ES5에서 기존 배열을 복사하기 위해서는 slice 메소드를 사용한다.
~~~javascript
// ES5
var arr = [1, 2, 3];
var copy = arr.slice();

console.log(copy); // [1, 2, 3]

// copy를 변경한다.
copy.push(4);

console.log(copy); // [1, 2, 3 ,4]
// arr은 변경되지 않는다.
console.log(arr); // [1, 2, 3]
~~~
Spread 연산자를 사용하면 보다 간결하게 배열을 복사할 수 있다.
~~~javascript
// ES6
const arr = [1, 2, 3];
// ...arr은 [1, 2, 3]을 개별 요소로 분리한다
const copy = [...arr];

console.log(copy); // [1, 2, 3]

//copy를 변경한다.
copy.push(4);

console.log(copy); // [1, 2, 3, 4]
// arr은 변경되지 않는다.
console.log(arr); // [1, 2, 3]
~~~

<br>

### 3.3 객체에서 사용하는 경우
Spread 연산자를 사용하면 객체를 손쉽게 병합 또는 변경할 수 있다.
~~~javascript
// 객체의 병합
const merged = { ...{ x: 1, y: 2 }, ...{ y: 10, z: 3 } };
console.log(merged); // { x: 1, y: 10, z: 3 }

// 특정 프로퍼티 변경
const changed = { ...{ x: 1, y: 2 }, y: 100 };
//changed = { ...{ x: 1, y: 2 }, ...{ y: 100 } }
console.log(changed); // { x: 1, y: 100 }

// 프로퍼티 추가
const added = { ...{ x: 1, y: 2 }, z: 0 };
// added = { ...{ x: 1, y: 2 }, ...{ z: 0 } }
console.log(added); // { x: 1, y: 2, z: 0 }
~~~
Object.assign 메소드를 사용해도 동일한 작업을 할 수 있다.
~~~javascript
// 객체의 병합
const merged = Object.assign({}, { x: 1, y: 2 }, { y: 10, z: 3 });
console.log(merged); // { x: 1, y: 10, z: 3 }

// 특정 프로퍼티 변경
const changed = Object.assign({}, { x: 1, y: 2 }, { y: 100 });
console.log(changed); // { x: 1, y: 100 }

// 프로퍼티 추가
const added = Object.assign({}, { x: 1, y: 2 }, { z: 0 });
console.log(added); // { x: 1, y: 2, z: 0 }
~~~
Spread 연산자를 사용하면 유사 배열 객체(Array-like Object)를 배열로 손쉽게 변환할 수 있다.
~~~javascript
const htmlCollection = document.getElementsByTageName('li');

// 유사 배열인 HTMLCollection을 배열로 변환한다.
const newArray = [...htmlCollection]; // Spread 연산자

// ES6의 Array.from 메소드를 사용할 수도 있다.
// const newArray = Array.from(htmlCollection);
~~~

<br>
<br>

## Reference
* [ECMAScript 6](http://www.ecma-international.org/ecma-262/6.0/ECMA-262.pdf)
* [Rest parameter](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/rest_parameters)
* [Spread operator](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_operator)
* [Javascript Array](https://poiemaweb.com/js-array)