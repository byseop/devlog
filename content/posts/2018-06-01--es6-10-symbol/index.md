---
title: ECMAScript 6 - 10. Symbol
subTitle: ES6 - 심볼
cover: es6.jpg
category: "Javascript"
---

1997년 자바스크립트가 ECMAScript로 처음 표준화된 이래로, 자바스크립트는 6개의 타입(자료형)을 가지고 있었다  
7번째 타입 심볼에 대해 알아본다.
  


## 1. Symbol 이란?
  
1997년 자바스크립트가 ECMAScript로 처음 표준화된 이래로, 자바스크립트는 6개의 타입(자료형을) 가지고 있었다.  
* 기본 자료형(primitive data type)  
  * Boolean
  * null
  * undefined
  * Number
  * String  

<br>

* 객체형(Object type)  
  * Object  

<br>

Symbol은 ES6에서 새롭게 추가된 7번째 타입이다. Symbol은 애플리케이션 전체에서 유일하며 변경 불가능한(immutable) 기본 자료형(primitive) 값이다. 주로 객체의 프로퍼티 키(property key)로 사용한다.  

<br>
<br>

## 2. Symbol의 생성  
  
Symbol은 Symbol() 함수로 생성한다. 이때 생성된 Symbol은 객체가 아니라 값(value)이다.
~~~javascript
let mySymbol = Symbol();

console.log(mySymbol); // Symbol()
console.log(typeof mySymbol); // symbol
~~~
Symbol() 함수는 String(), Number(), Boolean()과 같이 래퍼 객체를 생성하는 생성자 함수와는 달리 new 연산자를 사용하지 않는다. 
~~~javascript
new Symbol(); // TypeError: Symbol is not a constructor
~~~
Symbol은 변경 불가능한(immutable) 기본 자료형(primitive)이다.
~~~javascript
let mySymbol = Symbol();

console.log(mySymbol + 's'); // TypeError: Cannot convert a Symbol value to a string
~~~
Symbol() 함수는 인자로 문자열을 전달할 수 있다. 이 문자열은 Symbol 생성에 어떠한 영향을 주지 않는다. 다만 생성된 Symbol에 대한 설명(description)으로 디버깅 용도로만 사용된다.
~~~javascript
let symbolWithDesc = Symbol('youngseop');

console.log(symbolWithDesc); // Symbol(youngseop)
console.log(typeof symbolWithDesc); // symbol
~~~
Symbol() 함수가 생성한 Symbol 값은 애플리케이션 전체에서 유일하다.
~~~javascript
let mySymbol = Symbol('youngseop');

console.log(mySymbol === Symbol('youngseop')); // false
~~~
Symbol 값도 객체의 프로퍼티 키로 사용할 수 있다. Symbol 값은 애플리케이션 전체에서 유일한 값이므로 **Symbol 값을 키로 갖는 프로퍼티는 다른 어떠한 프로퍼티와도 충돌하지 않는다.**
~~~javascript
const obj = {};

const mySymbol = Symbol('mySymbol');
obj[mySymbol] = 123;

console.log(obj); // { [Symbol(mySymbol)]: 123 }
console.log(obj[mySymbol]); // 123
~~~

<br>
<br>

## 4. Symbol 객체  
  
Symbol() 함수로 Symbol 값을 생성할 수 있었다. 이것은 Symbol이 함수 객체라는 의미이다. 브라우저 콘솔에서 Symbol을 참조하여 보자.  
  
![symbol01](./symbol01.png)

<br>

위 참조 결과에서 알 수 있듯이 Symbol 객체는 프로퍼티와 메소드를 가지고 있다. Symbol 객체의 프로퍼티 중에 length와 prototype을 제외한 프로퍼티를 <code>Well-Known Symbol</code>이라 부른다.  
  
### 4.1 Symbol.iterator  
  
Well-Known Symbol은 자바스크립트 엔진에 상수로 존재하며 자바스클비트 엔진은 Well-Known Symbol을 참조하여 일정한 처리를 한다. 예를 들어 어떤 객체가 Symbol.iterator를 프로퍼티 key로 사용한 메소드를 가지고 있으면 자바스크립트 엔진은 이 객체가 이터레이션 프로토콜을 따르는 것으로 간주하고 이터레이터로 동작하도록 한다.  
  
Symbol.iterator를 프로퍼티 key로 사용하여 메소드를 구현하고 있는 빌트인 객체(빌트인 이터러블)는 아래와 같다. 아래의 객체들은 이터레이션 프로토콜을 준수하고 있으며 이터레이터를 반환한다.  
  
>Array  
Array.prototype[Symbol.iterator]  
  
>String  
String.prototype[Symbol.iterator]  
  
>Map  
Map.prototype[Symbol.iterator]  
  
>Set  
Set.prototype[Symbol.iterator]  
  
>DOM data structures  
NodeList.prototype[Symbol.iterator] HTMLCollection.prototype[Symbol.iterator]  
  
>arguments  
arguments[Symbol.iterator]  
  
~~~javascript
// 이터러블
// Symbol.iterator를 프로퍼티 key로 사용한 메소드를 구현하여야 한다.
// 배열에는 Array.prototype[Symbol.iterator] 메소드가 구현되어 있다.
const iterable = ['a', 'b', 'c'];

// 이터레이터
// 이터러블의 Symbol.iterator를 프로퍼티 key로 사용한 메소드는 이터레이터를 반환한다.
const iterator = iterable[Symbol.iterator]();

// 이터레이터는 순회 가능한 자료 구조인 이터러블의 요소를 탐색하기 위한 포인터로서
// value, done 프로퍼티를 갖는 객체를 반환하는 next() 함수를 메소드로 갖는 객체이다.
// 이터레이터의 next() 메소드를 통해 이터러블 객체를 순회할 수 있다.
console.log(iterator.next()); // { value: 'a', done: false }
console.log(iterator.next()); // { value: 'b', done: false }
console.log(iterator.next()); // { value: 'c', done: false }
console.log(iterator.next()); // { value: 'undefined', done: true }
~~~

<br>

### 4.2 Symbol.for
  
Symbol.for 메소드는 인자로 전달받은 프로퍼티 키를 통해 Symbol 레지스트리(Symbol registry.Symbol들의 리스트)에 존재하는 Symbol을 검색한다. 검색에 성공하면 Symbol을 반환하고, 검색에 실패하면 새로운 Symbol을 생성한다.
~~~javascript
// 새로운 전역 Symbol 생성
const s1 = Symbol.for('foo');
// Symbol 레지스트리에서 이미 만들어진 Symbol을 검색
const s2 = Symbol.for('foo');

console.log(s1 === s2); // true
~~~
Symbol() 함수는 매번 다른 Symbol 값을 생성하는 것에 반해, Symbol.for은 단 하나의 Symbol을 생성하여 여러 모듈이 공유한다.

<br>
<br>

## Reference
* [MDN: Symbol](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
* [ES6 In Depth: 심볼 (Symbol)](http://hacks.mozilla.or.kr/2015/09/es6-in-depth-symbols/)