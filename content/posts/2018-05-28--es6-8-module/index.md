---
title: ECMAScript 6 - 8. Module
subTitle: ES6 - 모듈
cover: es6.jpg
category: "Javascript"
---

모듈이란 애플리케이션을 구성하는 개별적 요소로서 재사용 가능한 코드 조각을 말한다.  
모듈은 세부 사항을 캡슐화하고 공개가 필요한 API만을 외부에 노출한다.  
  


## 1. Introduction  
  
일반적으로 모듈은 파일 단위로 분리되어 있으며 애플리케이션은 필요에 따라 명시적으로 모듈을 로드하여 재사용한다. 즉, 모듈은 애플리케이션에 분리되어 개별적으로 존재하다가 애플리케이션의 로드에 의해 비로소 애플리케이션의 일원이 된다. 모듈은 기능별로 분리되어 작성되므로 코드의 단위를 명확히 분리하여 애플리케이션을 구성할 수 있으며 재사용성이 좋아서 개발 효율성과 유지보수성을 높일 수 있다.  
  
자바스크립트는 웹페이지의 보조적인 기능을 수행하기  위해 한정적인 용도로 만들어진 태생적 한계로 다른언어에 비해 부족한(나쁜) 부분이 있는 것이 사실이다. 그대표적인 것이 모듈 기능이 없는 것이다.  
  
C언어는 #include, Java는 import등 대부분의 언어는 모듈 기능을 가지고 있다. 하지만 클라이언트 사이드 자바스크립트는 script 태그를 사용하여 외부의 스크립트 파일을 가져올 수는 있지만, 파일마다 독립적인 파일 스코프를 갖지 않고 하나의 전역 객체(Global Object)에 바인딩되기 때문에 전역 변수가 중복되는 등의 문제가 발생할 수 있다. 이것으로는 모듈화를 구현할 수 없다.  
  
자바스크립트를 클라이언트 사이드에 국한하지 않고 범용적으로 사용하고자 하는 움직임이 생기면서 모듈 기능은 반드시 해결해야 하는 핵심 과제가 되었고 이런 상황에서 제안된 것이 CommonJS와 AMD(Asynchronous Module Definition)이다.  
  
결국 자바스크립트의 모듈화는 크게 CommonJS 진영과 AMD 진영으로 나뉘게 되었고 브라우저에서 모듈을 사용하기 위해서는 CommonJS 또는 AMD를 구현한 모듈 로더 라이브러리를 사용해야 하는 상황이 되었다.  
  
서버 사이드 자바스크립트인 Node.js는 사실상 모듈 시스템의 표준 (de facto standard)인 CommonJS를 채택하였고 현재는 독자적인 진화를 거쳐 CommonJS 사양과 100% 동일하지는 않지만 기본적으로 CommonJS 방식을 따르고 있다.  
  
이런 상황에서 ES6에서는 클라이언트 사이드 자바스크립트에서도 동작하는 모듈을 추가하였다. 단, 현재 대부분의 브라우저가 ES6의 모듈을 지원하지 않고 있으므로 현재의 브라우저에서 ES6의 모듈을 사용하려면 SystemJS, RequireJS 등의 모듈 로더 또는 Webpack 등의 모듈 번들러를 사용하여야 한다.  
  
ES6의 모듈을 단 두개의 키워드 <code>export</code> 와 <code>import</code>를 제공한다.  

<br>
<br>

## 2. export
모듈은 독립적인 파일 스코프를 갖기 때문에 모듈 안에 선언한 모든 것들은 기본적으로 해당 모듈 내부에서만 참조할 수 있다. 만약 모듈 안에 선언한 항목을 외부에 공개하여 다른 모듈들이 사용할 수 있게 하고 싶다면 export해야 한다. 선언된 변수, 함수, 클래스 모두 export할 수 있다.

모듈을 공개하려면 선언문 앞에 export 키워드를 사용한다. 여러 개를 export할 수있는데 이때 각각의 export는 이름으로 구별할 수 있다.  
>지금부터 살펴볼 예제는 현재 대부분의 브라우저가 ES6의 모듈을 지원하지 않고 있으므로 동작하지 않는다. 현재 브라우저는 모듈뿐만 아니라 ES6를 완전하게 지원하지 않는다. ES6를 사용하여 프로젝트를 진행하려면 ES6로 작성된 코드를 IE를 포함한 모든 브라우저에서 문제없이 동작시키기 위한 개발환경을 구축하는 것이 필요하다. 이문제에 대해서는 Babel 6와 Webpack 4를 이용한 ES6 개발환경 구축에서 따로 알아볼 것이다. 여기서는 ES6 모듈의 기본 문법에 대해서만 살펴보자.  
  

~~~javascript
// lib.js
// 변수의 공개
export const pi = Math.PI;

// 함수의 공개
export function square(x) {
    return x * x;
}

// 클래스의 공개
export class Person {
    constructor(name) {
        this.name = name;
    }
}
~~~
선언문 앞에 매번 export 키워드를 붙이는 것이 싫다면 export 대상을 모아 하나의 객체로 구성하여 한번에 export 할 수도 있다.
~~~javascript
// lib.js
const pi = Math.PI;

function square(x) {
    return x * x;
}

class Person {
    constructor(name) {
        this.name = name;
    }
}

// 변수, 함수 클래스를 하나의 객체로 구성하여 공개
export { pi, square, Person };
~~~

<br>
<br>

## 3. import  
  
export한 모듈을 로드하려면 export한 이름으로 import한다.  
~~~javascript
// main.js
// 같은 폴더 내의 lib.js 모듈을 로드. 확장자 js는 생략 가능.
import { pi, square, Person } from './lib';

console.log(pi); // 3.141592...
console.log(square) // 100
console.log(new Person('Lee')); // Person { name: 'Lee' }
~~~
각각의 이름을 지정하지 않고 하나의 이름으로 한꺼번에 import할 수도 있다. 이때 import되는 항목은 as 뒤에 지정한 이름의 변수에 할당된다
~~~javascript
// main.js
// lib라는 이름으로 import
import * as lib from './lib';

console.log(pi); // 3.141592...
console.log(square) // 100
console.log(new Person('Lee')); // Person { name: 'Lee' }
~~~
이름을 변경하여 import할 수도 있다.
~~~javascript
// main.js
import { pi as PI, square as sq, Person as P } from './lib';

console.log(pi); // 3.141592...
console.log(square) // 100
console.log(new Person('Lee')); // Person { name: 'Lee' }
~~~
모듈에서 하나만을 export할 때는 default 키워드를 사용할 수 있다. 다만, default를 사용하는 경우, var, let, const는 사용할 수 없다.
~~~javascript
// lib.js
function (x) {
    return x * x;
}

export default;
~~~
위 코드를 아래와 같이 축약 표현할 수 있다.
~~~javascript
// lib.js
export default function (x) {
    return x * x;
}
~~~
default 키워드와 함께 export한 모듈은 {} 없이 임의의 이름으로 import한다.
~~~javascript
// main.js
import square from './lib';

console.log (square(3)); // 9
~~~

<br>
<br>

## Reference
* [ECMAScript 6](http://www.ecma-international.org/ecma-262/6.0/ECMA-262.pdf)
* [ECMAScript 6 New Features: Overview & Comparison](http://es6-features.org/#Constants)
* [ES6 compat table](https://kangax.github.io/compat-table/es6/)