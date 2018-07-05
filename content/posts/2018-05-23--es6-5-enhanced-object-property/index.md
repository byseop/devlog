---
title: ECMAScript 6 - 5. Enhanced Object property
subTitle: ES6 - 객체 리터럴 프로퍼티 기능 확장
cover: es6.jpg
category: "Javascript"
---

ES6에서는 객체 리터럴 프로퍼티 기능을 확장하여 더욱 간편하고 동적인 객체 생성 기능을 제공한다.  
ES6의 객체 리터럴 프로퍼티에 대해 알아본다.  
  

## 1. 프로퍼티 축약 표현  
ES5에서 객체 리터럴의 프로퍼티는 프로퍼티 이름과 프로퍼티 값으로 구성된다. 프로퍼티의 값은 변수에 할당된 값일 수도 있다.
~~~javascript
// ES5
var x = 1, y = 2;
var obj = {
    x: x,
    y: y
};

console.log(obj); // {x: 1, y: 2}
~~~
ES6에서는 프로퍼티값으로 변수를 사용하는 경우, 프로퍼티 이름을 생략(Property shorthand)할 수 있다. 이때 프로퍼티 이름은 변수의 이름으로 자동 생성된다.
~~~javascript
// ES6
let x = 1, y = 2;

const obj = { x, y };

console.log(obj); // {x: 1, y: 2}
~~~

<br>

## 2. 프로퍼티 이름 조합  
ES5에서 객체 리터럴의 프로퍼티 이름을 문자열 또는 변수를 조합하여 동적으로 생성하고 싶을 때, 객체 리터럴 외부에서 프로퍼티 이름을 생성하고 객체에 할당해야 한다.
~~~javascript
// ES5
var i = 0;
var propNamePrefix = 'prop_';

var obj = [];

obj[propNamePrefix + ++i] = i;
obj[propNamePrefix + ++i] = i;
obj[propNamePrefix + ++i] = i;

console.log(obj); // { prop_1: 1, prop_2: 2, prop_3: 3 }
~~~
ES6에서는 객체 리터럴 내부에서 프로퍼티 이름을 동적으로 생성(Computed property name)할 수 있다.
~~~javascript
// ES6
let i = 0;
const propNamePreifx = 'prop_';

const obj = {
    [propNamePrefix + ++i]: i,
    [propNamePrefix + ++i]: i,
    [propNamePrefix + ++i]: i
};

console.log(obj); // { prop_1: 1, prop_2: 2, prop_3: 3 }
~~~

<br>

## 3. 메소드 축약 표현  
ES5에서 메소드를 선언하려면 프로퍼티의 값으로 함수 선언식을 사용한다.
~~~javascript
// ES5
var obj = {
    name: 'Lee',
    sayHi: function(){
        console.log('Hi! ' + this.name);
    }
};

obj.sayHi(); // Hi! Lee
~~~
ES6에서는 메소드를 선언할 때, function 키워드를 생략한 축약 표현을 사용할 수 있다.
~~~javascript
// ES6
const obj = {
    name: 'Lee',
    // 메소드 축약 표현
    sayHi() {
        console.log('Hi! ' + this.name);
    }
};
~~~

<br>

## 4. __proto__프로퍼티에 의한 상속  
ES5에서 객체 리터럴을 상속하기 위해서는 Object.create() 함수를 사용한다. 이를 프로토타입 패턴 상속이라 한다.
~~~javascript
// ES5
var parent = {
    name: 'parent',
    sayHi: function() {
        console.log('Hi !' + this.name);
    }
};

// 프로토타입 패턴 상속
var child = Object.create(parent);
child.name = 'child';

parent.sayHi(); // Hi! parent
child.sayHi(); // Hi! child
~~~
ES6에서는 객체 리터럴 내부에서 __proto__ 프로퍼티를 직접 설정할 수 있다. 이것은 객체 리터럴에 의해 생성된 객체의 __proto__ 프로퍼티에 다른 객체를 직접 바인딩하여 상속을 표현할 수 있음을 의미한다.
~~~javascript
// ES6
const parent = {
    name: 'parent',
    sayHi() {
        console.log('Hi! ' + this.name);
    }
};

const child = {
    // child 객체의 프로토타입 객체에 parent 객체를 바인딩하여 상속을 구현한다.
    __proto__: parent,
    name: 'child'
};

parent.sayHi(); // Hi! parent
child.sayHi(); // Hi! child
~~~

<br>
<br>

## Reference
* [ECMAScript 6](http://www.ecma-international.org/ecma-262/6.0/ECMA-262.pdf)
* [Javascript Prototype](https://poiemaweb.com/js-prototype)
* [Javascript OOP - 상속 (Inheritance)](https://poiemaweb.com/js-object-oriented-programming#5-%EC%83%81%EC%86%8D-inheritance)