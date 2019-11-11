---
title: 자바스크립트 this 란?
subTitle: this?
cover: js.png
category: "Javascript"
---
  
![js](js.png)  
  

## Javascript의 this  
자바스크립트의  **this** 키워드는 다른언어와 조금 다르게 동작합니다.  
  
대부분의 경우 **this** 의 값은 함수를 호출한 방법이 결정합니다. ES5에서는 함수를 어떤식으로 호출했는지 상관없이 **this**값을 설정할 수 있는 **bind** 메서드를 추가했고, ES6에서는 스스로의 **this** 바인딩을 제공하지 않는 **[Arrow Funtion, 화살표 함수](../es6-3-arrow-function/)**를 추가했습니다.  
  
먼저 **this**가 어떤 값인지 알아보려면 크롬브라우저에서 F12를 눌러 개발자도구의 Console 탭으로 이동하여 직접 입력해보겠습니다.
```javascript
console.log(this)
// Window { ... }

console.log(this === window)
// true
```
위의 결과에서 알수있듯 자바스크립트의 **this**는 기본적으로 window 입니다. 하지만 **this**가 window가 아닌 경우가 있기 때문에 이 부분을 확인해 보아야 합니다.  
  
## 전역 스코프  
전역스코프에서의 **this**는 strict 모드와 관계없이 항상 전역객체를 참조합니다.
```javascript
this.a = 'byseop';
console.log(window.b); // 'byseop'
console.log(b); // 'byseop'
```
  
## 함수 스코프
함수스코프의 **this**는 함수를 호출한 방법에 의해 결정됩니다.  
  
### 단순 함수에서의 호출   
```javascript
function a() {
    return this;
}
a() === window; // true

function b() {
    "use strict"
    return this;
}
b() === undefined; // true
```  
위의 a함수와 b함수의 차이점은 <code>"use strict"</code> 엄격모드의 차이입니다. 일반적인 함수의 **this**는 window 이지만, 엄격모드일때 함수의 **this**는 undefined 가 됩니다.  
  
함수의 **this**가 함수 자신을 가르키게 하려면 <code>call()</code> 혹은 <code>apply</code> 를 이용합니다.  
```javascript
var obj = {a: 'Custom'};

var a = 'Global';

function whatsThis() {
    return this.a;
}

whatsThis(); // 'Global'
whatsThis.call(obj); // 'Custom'
whatsThis.apply(obj); // 'Custom'
```  
그리고 ES5 에서부터 도입된 <code>Function.prototype.bind()</code> 가 있습니다.
```javascript
this.x = 9;
var module = {
    x: 81,
    getX: function() { return this.x; }
};

module.getX(); // 81

var retrieveX = module.getX;
retrieveX(); // 9, 함수가 전역스코프에서 호출됨

var boundGetX = retrieve.bind(module);
boundGetX(); // 81, module과 바인딩 된 this 가 있는 함수 생성
```
이런식으로 객체와 바인딩 된 함수를 생성할 수 있다.  
  
그리고 ES6 에서 도입된 [화살표 함수](../es6-3-arrow-function/) 를 이용하는 방법도 있습니다. 화살표 함수의 경우 사용해서는 안되는 경우도 몇가지 있기때문에 링크에서 확인해보아야 합니다. (메서드, 프로토타입, 생성자함수, 이벤트리스너의 콜백함수)  
```javascript
var globalObject = this;
var foo = () => this;

console.log(globalObject === foo()); // true
```
화살표함수도 전역스코프에서 **this**를 조회하면 일반함수와 마찬가지로 window를 가르킵니다.  
다음 예제를 확인해보세요  
```javascript
var obj = {
    bar: function() { // (익명함수 A)
        var x = () => this; // (익명함수 B)
        return x;
    }
}

var fn = obj.bar();
console.log(fn() === obj); // true, 화살표 함수를 이용하면 obj를 바인딩한다.

var fn2 = obj.bar; // fn과 차이점은 obj를 참조하기만 한 것이다.
console.log(fn2()()); // Window { ... }
```
<code>fn</code> 경우 <code>obj.bar</code>에 할당된 함수(익명함수 A)는 화살표 함수로 생성된 또다른 함수(익명함수 B)를 반환합니다. 그 결과 함수 B의 **this**는 <code>obj.bar</code>(함수 A)의 **this**로 영구적으로 설정됩니다.  
  
하지만 <code>fn2</code>의 경우 함수 A 자체를 참조하여 전역스코프에서의 화살표함수처럼 **this**가 window를 가르키게 됩니다.
  
### 객체의 메서드에서의 호출  
함수를 어떤 객체의 메서드로 호출하면 **this**는 그 객체를 가르킵니다.  
```javascript
var o = {
    prop: 37,
    f: function() {
        return this.prop; // 여기서 this는 객체를 가르킴
    }
};

console.log(o.f()); // 37
```  
위의 **this**는 객체를 가르키게 됩니다. <code>o.f()</code>를 실행할 때 <code>o</code> 객체가 함수 내부의 **this**와 바인딩됩니다.  
이와 같이 객체의 메서드의 **this**는 객체를 가르키게 됩니다. 그런데 이 메서드의 **this**는 정의 방법이나 순서에 영향을 받지 않습니다. 다시말하면 객체를 미리 선언하고 이후에 메서드를 추가해도 상관이 없습니다.  
```javascript
function independent() {
    return this.prop;
}

o.f = independent;

console.log(o.f()); // 37
```  
함수스코프의 **this**는 호출 방법에 따라 결정된 다는 말이 기억나시나요? 위의 예제처럼 정의 방법이나 순서에 상관없이 객체 <code>o</code>의 메서드 <code>f</code>에서의 **this**는 그 객체 <code>o</code>를 가르키게 됩니다. 그럼 다음 예제를 볼까요?  
```javascript
o.b = {
    g: independent,
    prop: 42
}

console.log(o.b.g()); // 42
console.log(o);
// o: {
//     f: independent,
//     prop: 37,
//     b: {
//         g: independent,
//         prop: 42
//     }
// }
```
마찬가지로, <code>o.b.g()</code>의 **this**는 자기 자신 <code>o.b</code>의 객체를 가르킵니다. <code>b</code>가 <code>o</code> 객체의 값이라는 것은 중요하지 않습니다. <code>o.b.g()</code> 가 실행 될 때 **this**는 <code>o.b</code>를 가르키게 됩니다.  
  
### 생성자에서의 호출  
함수를 <code>new</code> 키워드와 함께 생성자로 사용하면 **this**를 새로 생긴 객체에 바인딩합니다.  
```javascript
function C() {
    this.a = 37;
}

var o = new C();
console.log(o.a); // 37

function C2() {
    this.a = 37;
    return {a: 38};
}
o = new C2();
console.log(o.a); // 38
```  
이렇게 함수를 생성자함수로 생성하게 되면 **this**가 자동으로 그 객체에 바인딩 됩니다.  
  
### DOM 이벤트리스너에서의 호출  
```javascript
document.body.onclick = function() {
    console.log(this); // <body></body>
}
```
```javascript
document.querySelector('body').addEventListener('click', function() {
    console.log(this); // <body></body>
}, false)
```
이벤트리스너의 **this**는 이벤트가 적용된 엘리먼트를 가르킵니다.  
  
### 인라인 이벤트 핸들러에서의 호출  
```html
<button onclick="alert(this.tagName.toLowerCase());">
  this 확인
</button>
```
위의 alert는 <code>button</code>을 보여줍니다. 코드를 인라인 이벤트핸들러로 사용하게되면, **this**는 이벤트핸들러가 연결된 DOM을 가르킵니다.  
  
  
## 마무리
javascript의 헷갈리는 **this**는 호출방법에 따라 달라진다는 것을 유의하면 실수를 줄일수 있을것 같습니다.
  

## Reference
* [this - MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/this)
* [Function.protype.bind() - MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
* [자바스크립트의 this는 무엇인가? - ZeroCho](https://www.zerocho.com/category/JavaScript/post/5b0645cc7e3e36001bf676eb)
* [Arrow functions](http://exploringjs.com/es6/ch_arrow-functions.html)