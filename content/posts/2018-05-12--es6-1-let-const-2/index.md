---
title: ECMAScript 6 - 1. const와 let -2-
subTitle: ES6 - const와 let의 블록 레벨 스코프
cover: es6.jpg
category: "Javascript"
---

이 포스팅은 내용이 많아 1, 2편으로 나눠져 있습니다.  
  



ES5에서 변수를 선언할 수 있는 유일한 방법은 var 키워드를 사용하는 것이었다.  
ES6에서는 변수선언에서 어떤 키워드가 추가되고, 어떤 다른 특징이 있을까
  
  
## 2.const

<br>

const는 상수(변하지 않는 값)를 위해 사용한다. 하지만 반드시 상수만을 위해 사용하지는 않는다. const의 특징은 let과 대부분 동일하므로 let과 다른점만 살펴보자.  
<br>
<br>

### 2.1 선언과 초기화  
  
let은 재할당이 자유로우나 const는 재할당이 금지된다.
~~~javascript
const FOO = 123;
FOO = 456; // TypeError: Assignment to constant variable.
~~~
주의할 점은 const는 반드시 선언과 동시에 할당이 이루어져야 한다는 것이다. 그렇지 않으면 다음처럼 문법 에러(SyntaxError)가 발생한다.
~~~javascript
const FOO; // SyntaxError: Missing initializer in const declaration.
~~~
또한, const는 let과 마찬가지로 블록 레벨 스코프를 갖는다.
~~~javascript
{
    const FOO = 10;
    console.log(FOO); // 10
}
console.log(FOO); // ReferenceError: FOO is not defined.
~~~
<br>

### 2.2 상수  
  
상수는 가독성과 유지보수의 편의를 위해 적극적으로 사용해야 한다. 예를 들면  
~~~javascript
// 10의 의미를 알기 어렵기 때문에 가독성이 좋지 않다.
if (rows > 10){
}

// 값의 의미를 명확히 기술하여 가독성이 향상되었다.
const MAXROWS = 10;
if (rows > MAXROWS){
}
~~~
조건문 내의 10은 어떤 의미로 사용하였는지 파악하기가 곤란하다. 하지만 네이밍이 적절한 상수로 선언되면 가독성과 유지보수성이 대폭 향상된다.  
const는 객체에도 사용할 수 있다. 물론 이 때도 재할당은 금지된다.  
~~~javascript
const obj = { foo: 123 };
obj = { bar: 456 }; // TypeError: Assignment to constant variable.
~~~  
<br>

### 2.3 const와 객체  
  
const는 재할당이 금지된다. 이는 const 변수의 값이 객체인 경우, 객체에 대한 참조를 변경하지 못한다는 것을 의미한다. 하지만 이때 **객체의 프로퍼티는 보호되지 않는다.**
 다시 말하자면 재할당은 불가능하지만 할당된 객체의 내용(프로퍼티의 추가, 삭제, 프로퍼티 값의 변경)은 변경할 수 있다.
~~~javascript
const user = { name: 'Lee' };

// const 변수는 재할당이 금지된다.
// user = {}; // TypeError: Assignment to constant variable.

// 하지만 객체의 내용은 변경할 수 있다.
user.name = 'Kim';

console.log(user); // { name: 'Kim' }
~~~
객체의 내용이 변경되더라도 객체 타입 변수에 할당된 주소값은 변경되지 않는다. 따라서 **객체 타입 변수 선언에는 const를 사용하는 것이 좋다.**
 만약에 명시적으로 객체 타입 변수의 주소값을 변경(재할당)하여야 한다면 let을 사용한다.  
<br>

## 3. var vs. let vs. const  

<br>

var와 let, 그리고 const는 다음처럼 사용하는 것을 추천한다.  
  
* ES6를 사용한다면 var키워드는 사용하지 않는다.  
* 재할당이 필요한 변수에는 let을 사용한다.  
* 변경이 발생하지 않는(재할당이 필요 없는) 기본형 변수와 객체형 변수에는 const를 사용한다.  

<br>
<br>

## Reference  

* [ECMAScript 6](http://www.ecma-international.org/ecma-262/6.0/ECMA-262.pdf)
* [ECMAScript 6 New Features: Overview & Comparison](http://es6-features.org/#Constants)
* [ES6 compat table](https://kangax.github.io/compat-table/es6/)
* [Temporal dead zone and errors with let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone_and_errors_with_let)
* [Are variables declared with let or const not hoisted in ES6?](https://stackoverflow.com/questions/31219420/are-variables-declared-with-let-or-const-not-hoisted-in-es6)