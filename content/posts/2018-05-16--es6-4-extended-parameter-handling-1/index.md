---
title: ECMAScript 6 - 4. Extended Parameter Handling -1-
subTitle: ES6 - 파라미터 기본값, Rest파라미터
cover: es6.jpg
category: "Javascript"
---

이 포스팅은 내용이 많아 1, 2편으로 나눠져 있습니다.  
  


ES5에서는 파라미터에 기본값을 설정할 수 없다. 따라서 적절한 인수가 전달되었는지 함수 내부에서 확인할 필요가 있다.  
ES6의 파라미터에 대해서 알아본다.  
  

## 1. 파라미터 기본값 (Default Prameter value)  
ES5에서는 파라미터에 기본값을 설정할 수 없다. 따라서 적절한 인수가 전달되었는지 함수 내부에서 확인할 필요가 있다.
~~~javascript
// ES5
function plus(x, y) {
    x = x || 0; // 매개변수 x에 인수를 할당하지 않은 경우, 기본값 0을 할당한다.
    y = y || 0; // 매개변수 y에 인수를 할당하지 않은 경우, 기본값 0을 할당한다.

    return x + y;
}

console.log(plus()); // 0
console.log(plus(1, 2)); // 3
~~~
ES6에서는 파라미터에 기본값을 설정하여 함수 내에서 수행하던 파라미터 체크 및 초기화를 간소화할 수 있다.
~~~javascript
// ES6
function plus(x = 0, y = 0) {
    // 파라미터 x, y에 인수를 할당하지 않은 경우, 기본값 0을 할당한다.
    return x + y;
}

console.log(plus()); // 0
console.log(plus(1, 2)); // 3
~~~

<br>
<br>

## 2. Rest 파라미터  

<br>

### 2.1 기본문법  
Rest 파라미터(Rest Parameter)는 Spread 연산자(...)를 사용하여 파라미터를 정의한 것을 의미한다. Rest 파라미터를 사용하면 인수를 함수 내부에서 배열로 전달받을 수 있다.
~~~javascript
function foo(...rest) {
    console.log(Array.isArray(rest)); // true
    console.log(rest); // [1, 2, 3, 4, 5]
}

foo (1, 2, 3, 4, 5);
~~~
인수는 순차적으로 파라미터와 Rest 파라미터에 할당된다.
~~~ javascript
function foo(param, ...rest) {
    console.log(param); // 1
    console.log(rest); // [2, 3, 4, 5]
}

foo(1, 2, 3, 4, 5);

function bar(param1, param2, ...rest){
    console.log(param1); // 1
    console.log(param2); // 2
    console.log(rest); // [3, 4, 5]
}

bar (1, 2, 3, 4, 5);
~~~
Rest 파라미터는 반드시 마지막 파라미터이어야 한다.
~~~javascript
function foo( ...rest, param1, param2) { }

foo(1, 2, 3, 4, 5); // SyntaxError: Rest parameter must be last formal parameter
~~~

<br>

### 2.2 arguments와 rest 파라미터  
ES5에서는 인자의 개수를 사전에 알 수 없는 가변 인자 함수의 경우, arguments 객체를 통해 인자값을 확인한다. arguments 객체는 함수 호출 시 전달되는 인수(arguments)들의 정보를 담고 있는 순회가능한(iterable) 유사 배열 객체(array-like object)이다. 함수 객체의 arguments 프로퍼티는 arguments 객체를 값으로 가지며 함수 내부에서 지역 변수처럼 사용된다.
~~~javascript
// ES5
var foo = function () {
    console.log(arguments);
};

foo(1, 2); // { '0': 1, '1': 2 }
~~~
가변 인자 함수는 파라미터를 통해 인수를 전달받는 것이 불가능하므로 arguments 객체를 활용하여 인수를 전달받는다. 하지만 arguments 객체는 유사 배열객체이므로 배열 메소드를 사용하려면 Function.porototype.call 을 사용해야 하는 번거로움이 있다.
~~~javascript
// ES5
function sum() {
    /*
    가변 인자 함수는 arguments 객체를 통해 인수를 전달받는다.
    유사 배열 객체인 arguments 객체를 배열로 변환한다.
    */
    var array = Array.prototype.slice.call(arguments);
    return array.reduce(function (pre, cur) {
        return pre + cur;
    });
}

console.log(sum(1, 2, 3, 4, 5));
~~~
ES6에서는 rest 파라미터를 사용하여 가변 인자를 함수 내부에 배열로 전달할 수 있다. 이렇게 하면 유사 배열인 arguments 객체를 배열로 변환하는 등의 번거로움을 피할 수 있다.
~~~javascript
// ES6
function sum(...args) {
    console.log(arguments); // (5) [1, 2, 3, 4, 5, callee: (...), Symbol(symbol.iterator): function]
    console.log(Array.isArray(args)); // true
    return args.reduce((pre, cur) => pre + cur);
}

console.log(sum(1, 2, 3, 4, 5)); //15
~~~
하지만 ES6의 화살표 함수에는 함수 객체의 arguments 프로퍼티가 없다. 따라서 화살표 함수로 가변 인자 함수를 구현해야 할 때는 반드시 rest 파라미터를 사용해야 한다.
~~~javascript
var normalFunc = function () {};
console.log(normalFunc.hasOwnProperty('arguments')); // true

var arrowFunc = () => {};
console.log(arrowFunc.hasOwnProperty('arguments')); // false
~~~

<br><br>


  
  
이 포스팅은 내용이 많아 1, 2편으로 나눠져 있습니다.

## Reference
* [ECMAScript 6](http://www.ecma-international.org/ecma-262/6.0/ECMA-262.pdf)
* [Rest parameter](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/rest_parameters)
* [Spread operator](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_operator)
* [Javascript Array](https://poiemaweb.com/js-array)