---
title: ECMAScript 6 - 9. Promise
subTitle: ES6 - 프로미스
cover: es6.jpg
category: "Javascript"
---

자바스크립트는 비동기 처리를 위한 하나의 패턴으로 콜백함수를 사용한다.  
하지만 전통적인 콜백함수는 가독성이 나쁘고 비동기 처리중 발생한 에러의 예외처리가 곤란하다.
  


## 1. 프로미스란?
  
자바스크립트는 비동기 처리를 위한 하나의 패턴으로 콜백함수를 사용한다. 하지만 전통적인 콜백 패턴은 가독성이 나쁘고 비동기 처리중 발생한 에러의 예외 처리가 곤란하며 어러개의 비동기 처리 로직을 한꺼번에 처리하는 것도 한계가 있다. ES6에서 비동기 처리를 위한 또 다른 패턴으로 프로미스(Promise)를 도입하였다. Promise는 전통적인 콜백 패턴이 가진 단점을 보완하며 비동기 처리 시점을 명확하게 표현한다.  

<br>
<br>

## 2. 콜백 패턴의 단점
  
### 2.1 콜백 헬  
먼저 동기식 처리 모델과 비동기식 처리모델에 대해 간단히 살펴보면,  
  
동기식 처리모델(Synchronous processing model)은 직렬적으로 태스크(task)를 수행한다. 즉 태스크는 순차적으로 실행되며 어떤 작업이 수행중이면 다음 태스크는 대기하게 된다. 예를 들어 서버에서 데이터를 가져와서 화면에 표시하는 태스크를 수행할 때, 서버에서 데이터를 요청하고 데이터가 응답될 때까지 이후의 태스크들은 블로킹된다.  
  
![promise01](.\promise01.png)

<br>

비동기식 처리모델(Asynchronous processing model 또는 Non-Blocking processing model)은 병렬적으로 태스크를 수행한다. 즉, 태스크가 종료되지 않은 상태라 하더라도 대기하지 않고 즉시 다음 태스크를 실행한다. 예를 들어 서버에서 데이터를 가져와서 화면에 표시하는 태스크를 수행할 때, 서버에서 데이터를 요청한 이후 서버로부터 데이터가 응답될 때까지 대기하지 않고(Non-Blocking) 즉시 다음 태스크를 수행한다. 이후 서버로부터 데이터가 응답되면 이벤트가 발생하고 이벤트 핸들러가 데이터를 가지고 수행할 태스크를 계속해 수행한다. 자바스크립트의 대부분의 DOM 이벤트와 Timer함수(setTimeout, setInterval), Ajax 요청은 비동기식 처리 모델로 동작한다.  
  
![promise02](.\promise02.png)

<br>

자바스크립트에서 빈번하게 사용되는 비동기식 처리 모델은 요청을 병렬로 처리하여 다른 요청이 블로킹(blocking, 작업중단)되지 않는 장점이 있다.  
  
하지만 비동기 처리를 위해 콜백패턴을 사용하면 처리순서를 보장하기 위해 여러개의 콜백 함수가 네스팅(nesting, 중첩)되어 복잡도가 높아지는 **콜백 헬(Callback Hell)**이 발생하는 단점이 있다. 콜백 헬은 가독성을 나쁘게 하며 실수를 유발하는 원인이 된다. 아래는 콜백 헬이 발생하는 전형적인 사례이다
~~~javascript
step1(function(value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                step5(value4, function(value5) {
                    // value5를 사용하는 처리
                });
            });
        });
    });
});
~~~  
  
![promise03](.\promise03.png)

<br>

콜백 헬이 발생하는 이유에 대해 살펴보자. 비동기 처리모델은 실행 완료를 기다리지 않고 즉시 다음 태스크를 실행한다. 따라서 비동기 함수(비동기를 처리하는 함수) 내에서 처리 결과를 반환(또는 전역변수에의 할당)하면 기대한 대로 동작하지 않는다.
~~~html
<!DOCTYPE html>
<html>
<head>
    <title>Promise example</title>
</head>
<body>
    <h1>Promise exmaple</h1>
    <script>
    // 비동기 함수
        function get(url) {
            // XMLHttpRequest 객체 생성
            const xhr = new XMLHttpRequest();

            // 서버 응답 시 호출될 이벤트 핸들러
            xhr.onreadystatechange = function () {
                // 서버 응답 완료
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) { // 정상 응답
                        /*
                            비동기식 처리 모델은 처리 완료를 기다리지 않고 즉시 다음 태스크를 실행한다.
                            따라서 비동기 함수 내에서 처리 결과를 반환(또는 전역변수에의 할당)하면
                            기대한 대로 동작하지 않는다.
                            비동기 함수의 결과에 대한 처리는 함수 내에서 처리해야 한다.
                        */
                        console.log(xhr.response);
                        return xhr.response;
                    } else { // 비정상 응답
                        console.log('Error: ' + xhr.status);
                    }
                }
            };
            // 비동기 방식으로 Request 오픈
            xhr.open('GET', url);
            // Request 전송
            xhr.send();
        }

        const url = 'http://jsonplaceholder.typicode.com/posts/1';

        /*
            get 함수는 비동기 함수이므로 처리 완료를 기다리지 않고 즉시 다음 태스크를 수행한다.
            즉, 함수의 실행이 완료되어 함수의 반환값을 받기 이전에 다음 태스크로 진행한다.
            따라서 res는 undefined이다.
        */
        const res = get(url);
        console.log(res); // undefined
    </script>
</body>
</html>
~~~
위 코드를 살펴보면 비동기 함수의 처리 결과를 반환하는 경우, 순서가 보장되지 않기 때문에 그 반환 결과를 가지고 후속 처리를 할 수 없다. 즉, 비동기 함수의 처리 결과에 대한 처리는 비동기 함수의 콜백함수 내에서 처리해야한다. 이로 인해 콜백 헬이 발생한다.  
  
만일 비동기 함수의 처리의 결과를 가지고도 다른 비동기 함수를 호출해야 하는 경우, 함수의 호출이 중첩(nesting)이 되어 복잡도가 높아지는 현상이 발생하는데 이를 **Callback Hell** 이라 한다.  
  
Callback Hell은 코드의 가독성을 나쁘게하고 복잡도를 증가시켜 실수를 유발하는 원인이 되며 에러 처리가 곤란하다.  

<br>

### 2.2 에러 처리의 한계  
  
콜백 방식의 비동기 처리가 갖는 문제점 중에서 가장 심각한 것은 에러 처리가 곤란하다는 것이다. 아래의 코드를 살펴보자.
~~~javascript
try {
    setTimeout(() => { throw 'Error!'; }, 1000);
} catch (e) {
    console.log('에러를 캐치하지 못한다..');
    console.log(e);
}
~~~
try 블록 내에서 setTimeout 함수가 실행되면 1초 후에 콜백 함수가 실행되고 이 콜백 함수는 예외를 발생시킨다. 하지만 이 예외는 catch 블록에서 캐치되지 않는다. 그 이유에 대해 알아보자.  
  
비동기 처리 함수의 콜백 함수는 해당 이벤트(DOM 이벤트, timer 함수의 tick 이벤트, Ajax의 onreadystatechange 이벤트)가 발생하면 이벤트 큐(Event queue)로 이동한 후 호출 스택이 비어졌을 때, 호출 스택으로 이동되어 실행된다. setTimeout 함수는 비동기 함수이므로 콜백 함수의 실행 완료를 기다리지 않고 즉시 종료되어 호출 스택에서 제거된다. 이후 tick 이벤트가 발생하면 setTimeout 함수의 콜백 함수는 이벤트 큐로 이동한 후 호출 스택이 비어졌을때 호출 스택으로 이동되어 실행된다. 이때 setTimeout 함수는 이미 호출스택에서 제거된 상태이다. 이것은 setTimeout 함수의 콜백 함수를 호출한 것은 setTimeout 함수가 아니다라는 것을 의미한다. setTimeout 함수의 콜백 함수의 호출자(caller)가 setTimeout 함수라면 호출 스택에 setTimeout 함수가 존재해야 하기 때문이다.  
  
예외(exception)는 호출자(caller) 방향으로 전파된다. 하지만 위에서 살펴본 바와 같이 setTimeout 함수의 콜백 함수를 호출한 것은 setTimeout 함수가 아니다. 따라서 setTimeout 함수의 콜백 함수 내에서 발생시킨 에러는 catch 블록에서 캐치되지 않아 프로세스는 종료된다.  
  
이러한 문제를 극복하기 위해 Promise가 제안되었다. Promise는 ES6에서 정식 채택되어 **IE를 제외한** 대부분의 브라우저가 지원하고 있다. 

<br>
<br>

## 3. 프로미스의 생성  
  
프로미스는 Promise 생성자 함수를 통해 인스턴스화 한다. Promise 생성자 함수는 비동기 작업을 수행할 콜백 함수를 인자로 전달받는데 이 콜백 함수는 resolve와 reject 함수를 인자로 전달받는다.
~~~javascript
// Promise 객체의 생성
const promise = new Promise((resolve, rejcet) => {
    // 비동기 작업을 수행한다.

    if (/* 비동기 작업 수행 성공 */) {
        resolve('result');
    } else {
        /* 비동기 작업 수행 실패 */
        rejcet('failuure reason');
    }
})
~~~
Promise는 비동기 처리가 성공(fulfilled) 하였는지 또는 실패(rejected) 하였는지 등의 상태(state) 정보를 갖는다.  
  
![promise04](.\promise04.png)

<br>

Promise 생성자 함수가 인자로 전달받은 콜백 함수는 내부에서 비동기 처리 작업을 수행한다. 이때 비동기 처리가 성공하면 콜백 함수의 인자로 전달받은 resolve 함수를 호출한다. 이때 프로미스는 'fulfilled' 상태가 된다. 비동기 처리가 실패하면 reject 함수를 호출한다. 이때 프로미스는 'rejected'상태가 된다. Promise를 사용하여 비동기 함수를 정의해보자.
~~~javascript
// 비동기 함수
function get(url) {
    // Promise 객체의 생성과 반환
    return new Promise((resolve, reject) => {
        // XMLHttpRequest 객체 생성
        const xhr = new XMLHttpRequest();

        // 서버 응답 시 호출된 이벤트 핸들러
        xhr.onreadystateschange = function () {
            // 서버 응답 완료
            if (xhr.readyState === 200) { // 정상 응답
                // resolve 메소드에 처리 결과를 전달
                resolve(xhr.response);
            } else { // 비정상 응답
                // reject 메소드에 에러 메시지를 전달
                reject('Error: ' + xhr.status);
            }
        };

        // 비동기 방식으로 Request를 오픈한다
        xhr.open('GET', url);
        // Request를 전송한다
        xhr.send();
    });
}
~~~
위 예제처럼 비동기 함수 내에서 Promise 객체를 생성하고 그 내부에서 비동기 처리를 구현한다. 이때 비동기 처리에 성공하면 resolve 메소드를 호출한다. 이때 resolve 메소드의 인자로 비동기 처리 결과를 전달한다. 이 처리 결과는 Promise 객체의 후속 처리 메소드로 전달된다. 만약 비동기 처리에 실패하면 reject 메소드를 호출한다. 이때 reject 메소드의 인자로 에러 메시지를 전달한다. 이 에러 메시지는 Promise 객체의 후속 처리 메소드로 전달된다.  
  
  
## 4. 프로미스의 사용  
Promise로 구현된 비동기 함수는 Promise 객체를 반환하여야 한다. Promise로 구현된 비동기 함수를 호출하는 측(promise consumer)에서는 Promise 객체의 후속 처리 메소드(then, catch)를 통해 비동기 처리 결과 또는 에러메시지를 전달받아 처리한다. Promise 객체는 상태를 갖는다고 하였다. 이 상태에 따라 후속 처리 메소드를 체이닝 방식으로 호출한다. Promise의 후속 처리 메소드는 아래와 같다.  
> then  
then 메소드는 두개의 콜백 함수를 인자로 전달 받는다. 첫번째 콜백 함수는 성공(fulfilled, resolve 함수가 호출된 상태)시 호출되고 두번째 함수는 실패(rejected, reject 함수가 호출된 상태)시 호출된다.

>catch  
예외(비동기 처리에서 발생한 에러와 then 메소드에서 발생한 에러)가 발생하면 호출된다.  
  
앞에서 프로미스로 정의한 비동기 함수 get을 사용해보자. get 함수는 XMLHttpRequest 객체를 통해 Ajax 요청을 수행하므로 브라우저에서 실행하여야 한다.
~~~html
<!DOCTYPE html>
<html>
<head>
    <title>Promise example</title>
</head>
<body>
    <h1>Promise exmaple</h1>
    <pre id="result"></pre>
    <script>
    // 비동기 함수
        function get(url) {
            //Promise 객체의 생성과 반환
            return new Promise((resolve, reject) => {
                // XMLHttpRequest 객체 생성
                const xhr = new XMLHttpRequest();

                // 서버 응답 시 호출될 이벤트 핸들러
                xhr.onreadystatechange = function () {
                    // 서버 응답 완료
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) { // 정상 응답
                            // resolve 메소드에 처리 결과를 전달
                            resolve(xhr.response);
                        } else { // 비정상 응답
                            console.log('Error: ' + xhr.status);
                        }
                    }
                };

                // 비동기 방식으로 Request 오픈
                xhr.open('GET', url);
                // Request 전송
                xhr.send();
            });
        }

        const url = 'http://jsonplaceholder.typicode.com/posts/1';

        /*
            비동기 함수 get은 Promise 객체를 반환한다.
            Promise 객체의 후속 메ㅐ소드를 사용하여 비동기 처리 결과에 대한 후속 처리를 수행한다.
        */
        get(url).then(
            // 첫번째 콜백 함수는 성공(fullfilled, resolve 함수가 호출된 상태) 시 호출된다.
            result => document.getElementById('result').innerHTML = result,
            // 두번째 함수는 실패(rejected, reject 함수가 호출된 상태) 시 호출된다.
            error => console.log(error)
        );
    </script>
</body>
</html>
~~~

<br>
<br>

## 5. 프로미스의 에러 처리  
  
위 예제의 비동기 함수 get은 Promise 객체를 반환한다. Promise 객체의 후속 처리 메소드를 사용하여 비동기 처리 결과에 대한 후속 처리를 수행한다. 비동기 처리시 발생한 에러메시지는 then 메소드의 두번째 콜백 함수로 전달된다. Promise 객체의 후속처리 메소드 catch를 사용하여도 에러를 처리할 수 있다.
~~~javascript
get(url)
    .then(result => document.getElementById('result').innerHTML = result)
    .catch(error => console.log(error));
~~~
catch 메소드는 에러를 처리한다는 점에서 then 메소드의 두번째 콜백 함수와 유사하지만 미묘한 차이가 있다. then 메소드의 두번째 콜백 함수는 비동기 처리에서 발생한 에러(reject 함수가 호출된 상태)만을 캐치한다. 하지만 catch 메소드는 비동기 처리에서 발생한 에러(reject 함수가 호출된 상태) 뿐만 아니라 then 메소드 내부에서 발생한 에러도 캐치한다. 따라서 에러 처리는 catch 메소드를 사용하는 편이 보다 효율적이다.  
  
  
## 6. 프로미스 체이닝  
  
비동기 함수의 처리 결과를 가지고 다른 비동기 함수를 호출해야 하는 경우, 함수의 호출이 중첩(nesting)이 되어 복잡도가 높아지는 콜백 헬이 발생한다. 프로미스는 후속 처리 메소드를 체이닝(chainning)하여 여러개의 프로미스를 연결해서 사용할 수 있다. 이로써 콜백 헬을 해결한다.  
  
Promise 객체를 반환한 비동기 함수는 프로미스 후속 처리 메소드인 then이나 catch 메소드를 사용할 수 있다. 따라서 then 메소드가 Promise 객체를 반환하도록 하면 여러개의 프로미스를 연결하여 사용할 수 있다.  
  
아래는 서버로 부터 특정 포스트를 취득한 후, 그 포스트를 작성한 사용자의 아이디로 작성된 모든 포스트를 검색하는 예제이다.
~~~html
<!DOCTYPE html>
<html>
<head>
<title>Promise example</title>
</head>
<body>
<h1>Promise example</h1>
<pre id="result"></pre>
<script>
// 비동기 함수
function get(url) {
    // promise 생성과 반환
    return new Promise((resolve, reject) => {
    // XMLHttpRequest 객체 생성
    const xhr = new XMLHttpRequest();

    // 서버 응답 시 호출될 이벤트 핸들러
    xhr.onreadystatechange = function () {
        // 서버 응답 완료
        if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) { // 정상 응답
            // resolve 메소드에 처리 결과를 전달
            resolve(xhr.response);
        } else { // 비정상 응답
            // reject 메소드에 에러 메시지를 전달
            reject('Error: ' + xhr.status);
        }
        }
    };

    // 비동기 방식으로 Request를 오픈한다
    xhr.open('GET', url);
    // Request를 전송한다
    xhr.send();
    });
}

const url = 'http://jsonplaceholder.typicode.com/posts';

// 포스트 id가 1인 포스트를 검색하고 프로미스를 반환한다.
get(`${url}/1`)
    // 포스트 id가 1인 포스트를 작성한 사용자의 아이디로 작성된 모든 포스트를 검색하고 프로미스를 반환한다.
    .then(result1 => get(`${url}?userId=${JSON.parse(result1).userId}`))
    // 포스트 검색 결과를 DOM에 반영한다.
    .then(result2 => document.getElementById('result').innerHTML = result2)
    .catch(error => console.log(error));
</script>
</body>
</html>
~~~

<br>
<br>

## Reference
* [MDN: Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [Google developers: Promise](https://developers.google.com/web/fundamentals/getting-started/primers/promises?hl=ko)
* [이벤트 루프와 동시성(Concurrency)](https://poiemaweb.com/js-event#2-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%A3%A8%ED%94%84event-loop%EC%99%80-%EB%8F%99%EC%8B%9C%EC%84%B1concurrency)