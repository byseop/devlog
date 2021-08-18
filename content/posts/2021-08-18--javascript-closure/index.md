---
title: Javascript 클로저 (Closure)
subTitle: Javascript closure
cover: closure.png
category: "Javascript"
---

> You don't know JS 스코프와 클로저 -  
> 클로저는 렉시컬 스코프에 의존하여 코드를 작성한 결과로 그냥 발생하는것이다.  
> 모든 코드에서 클로저는 발생하고 사용되고 있다.

## 클로저란?

클로저를 한문장으로 정의한다면  
**클로저는 렉시컬스코프를 기억하며 함수가 렉시컬스코프 밖에서 실행될 때에도 이 스코프에 접근할 수 있게 하는 기능** 이라고 정의할 수 있습니다.

정의를 이해하기 쉽게 코드를 보면서 알아보겠습니다.

```javascript
function foo() {
  var a = 2;
  function bar() {
    console.log(a);
  }
  return bar();
}

var baz = foo();
baz(); // -> 2
```

함수 <code>bar</code>는 함수 <code>foo</code> 렉시컬스코프에 접근 할 수 있고. 함수 <code>foo</code>는 함수 <code>bar</code> 객체 그대로를 반환합니다. <code>foo</code> 를 실행하여 반환 된 값(함수 <code>bar</code>)은 변수 <code>baz</code>에 대입되고 실제로는 함수 <code>baz()</code>를 호출했습니다. 이것은 당연히 <code>bar()</code>를 호출한 것과 같습니다. 하지만 이 경우에 <code>baz()</code>는 렉시컬스코프 밖에서 호출되었습니다.

일반적으로 함수 <code>foo()</code>가 호출 된 후에는 자바스크립트 엔진의 가비지콜렉터가 내부 스코프를 해제한다고 생각 할 수 있지만 이 경우에 <code>foo()</code>의 내부 스코프는 해제되지 않고 계속 사용됩니다. 그렇다면 누가 이 스코프를 계속 사용할까요? <code>bar()</code>가 이 내부스코프를 계속 사용하고 있습니다. <code>bar()</code>가 선언된 위치때문에 <code>foo()</code>의 렉시컬스코프 클로저를 가지고 <code>foo()</code>는 <code>bar()</code>가 이후에 참조 될 수 있도록 스코프를 살려두고 있습니다. **즉 <code>bar()</code>는 해당 스코프에 참조를 가지게 되는데 이 참조를 바로 '클로저' 라고 부릅니다**

아직은 이해하기 어려우니 조금 더 흥미로운 MDN 의 예제를 보겠습니다.

```javascript
function makeAdder(x) {
  var y = 1;
  return function(z) {
    y = 100;
    return x + y + z;
  };
}

var add5 = makeAdder(5);
var add10 = makeAdder(10);
//클로저에 x와 y의 환경이 저장됨

console.log(add5(2)); // 107 (x:5 + y:100 + z:2)
console.log(add10(2)); // 112 (x:10 + y:100 + z:2)
//함수 실행 시 클로저에 저장된 x, y값에 접근하여 값을 계산
```

위 코드에서 <code>add5</code>와 <code>add10</code>에는 이미 <code>x</code>와 <code>y</code>값이 저장되어 함수로 반환된 값이 대입됩니다.
각 리턴된 <code>add5</code>와 <code>add10</code>에서는 초기 <code>y</code>값이 1 에서 내부함수에 정의된 100 으로 변경 되는것을 볼 수 있습니다. 이것은 클로저가 리턴된 이후에도 외부함수에서 클로저 내부 변수에 접근이 가능함을 보여줍니다.

## 반복문과 클로저

클로저를 설명하는 가장 흔하고 표준적인 사례는 for 반복문 입니다.  
먼저 0 부터 4 까지의 수를 1 초에 한번씩 출력하는 예제를 만들어 보려고 합니다.

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, i * 1000);
}
```

위 코드를 실행보면 1 초 뒤에 5 만 5 번 출력됩니다. <code>for-loop</code> 안에 있는 <code>setTimeout</code> 함수는 반복문이 끝난뒤에 <code>i === 5</code> 상태일때 실행됩니다. 위 코드의 <code>for-loop</code>은 총 5 개의 <code>setTimeout</code> 함수가 정의되었음에도 불구하고 글로벌 스코프의 클로저를 공유하여 해당 스코프 안에는 한개의 <code>i</code>만 존재합니다. 따라서 모든 <code>setTimeout</code>은 같은 <code>i</code>에 대한 참조를 공유합니다.

그렇다면 애초에 기대한 결과를 얻기 위해 어떠한 수정을 해야할까요?  
그것은 각각의 반복마다 <code>i</code>의 복제본을 잡아두는것 입니다. 더 구체적으로 말하면 하나의 반복마다 닫힌 스코프와 그 스코프에 맞는 변수가 필요합니다. 우리는 IIFE(즉시실행함수)가 하나의 스코프를 만드는것을 알고 있습니다.

```javascript
for (var i = 0; i < 5; i++) {
  (function() {
    setTimeout(function() {
      console.log(i);
    }, i * 1000);
  })();
}
```

위 코드를 실행해도 결과는 같습니다. 왜일까요? 비어있는 스코프는 의미가 없습니다. 비어있는 스코프안에 <code>i</code>가 없으므로 상위 스코프로 <code>i</code>를 찾아가기 때문에 아래와 같이 변경해야 합니다.

```javascript
for (var i = 0; i < 5; i++) {
  (function() {
    var j = i;
    setTimeout(function() {
      console.log(j);
    }, j * 1000);
  })();
}
```

같은 방법으로 아래와 같은 코드도 있습니다.

```javascript
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j);
    }, j * 1000);
  })(i);
}
```

### 블록스코프를 이용해보자

실제로 우리가 필요했던 것은 반복별 블록스코프였습니다.  
<code>let</code> 키워드로 생성하는 변수는 블록스코프를 가지는것을 알고 있으므로 위 코드를 더 간단하고 쉽게 변경할 수 있습니다.

```javascript
for (let i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, i * 1000);
}
```

<code>let</code> 키워드는 하나의 블록스코프를 가지고, 하나의 반복문마다 새로운 <code>i</code>를 선언하게 됩니다.  
블록스코프와 클로저를 이용하여 문제를 해결하였습니다.

## 클로저의 활용한 모듈화

클로저를 활용하는 가장 강력한 패턴인 모듈에 대해서 알아보겠습니다.

```javascript
function CoolModule() {
  var something = "cool";
  var another = [1, 2, 3];

  function doSomething() {
    console.log(something);
  }
  function doAnother() {
    console.log(another.join("!"));
  }

  return {
    doSomething,
    doAnother
  };
}

var foo = CoolModule();
foo.doSomething(); // cool
foo.doAnother(); // 1!2!3

var baz = CoolModule();
baz.doSomething(); // cool
baz.doAnother(); // 1!2!3
```

이러한 코드와 같은 패턴을 모듈이라고 합니다. 몇가지 특징을 보겠습니다.  
첫번째로 <code>CoolModule()</code>은 단순히 함수이고, 호출시 모듈인스턴스를 생성합니다. 다시말해 최외각 함수가 실행 되면(<code>CoolModule()</code>) 내부 스코프와 클로저가 생성됩니다.  
두번째로 <code>CoolModule</code>은 객체를 반환합니다. 해당 객체는 내부 함수를 참조하지만, 내부 변수에 대한 참조는 없습니다. 내장 변수는 이렇게 비공개로 숨길 수 있습니다.

이 모듈패턴을 사용하려면 두가지 조건이 있습니다.

1.  하나의 최외각 함수가 존재하며, 이 함수가 실행되어야 합니다. (함수가 호출될 때마다 하나의 인스턴스를 생성합니다)
2.  최외각 함수는 하나 이상의 내부함수를 반환해야 합니다. 그렇게 해야 내부 함수가 비공개 스코프에 대한 클로저를 가지고 비공개 상태에 대한 정보에 접근할 수 있습니다. 최외각 함수의 의해 반환된 객체에 한개 이상의 닫힌함수가 없다면 모듈이라고 할 수 없습니다.

이 패턴에서 약간 변형된, 하나의 인스턴스만을 생성하는 '싱글톤' 패턴도 있습니다.

```javascript
var foo = (function CoolModule() {
  var something = "cool";
  var another = [1, 2, 3];

  function doSomething() {
    console.log(something);
  }
  function doAnother() {
    console.log(another.join("!"));
  }

  return {
    doSomething,
    doAnother
  };
})();

foo.doSomething(); // cool
foo.doAnother(); // 1!2!3
```

앞의 코드에서 <code>CoolModule</code> 함수를 IIFE 로 변경하고 즉시 실행시켜 반환되는 객체를 <code>foo</code>에 곧바로 대입시켰습니다.

## 마치며

클로저는 자바스크립트에서 대부분 어려움의 부분이라고 생각하지만 실제로 많은곳에서 사용하고 있습니다. 클로저는 함수를 렉시컬스코프 밖에서 호출하더라도 함수 자신의 렉시컬스코프를 기억하고 접근할 수 있는 방법이라고 생각하면 편할 것 같습니다.

## Reference

- [Closure - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [You don't know JS 스코프와 클로저 ](https://www.hanbit.co.kr/store/books/look.php?p_code=B8227329776)
