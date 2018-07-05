---
title: ECMAScript 6 - 9. Promise -3-
subTitle: ES6 - 프로미스의 사용
cover: es6.jpg
category: "Javascript"
---

이 포스팅은 내용이 많아 1, 2, 3편으로 나뉘어 져 있습니다.  
  



자바스크립트는 비동기 처리를 위한 하나의 패턴으로 콜백함수를 사용한다.  
하지만 전통적인 콜백함수는 가독성이 나쁘고 비동기 처리중 발생한 에러의 예외처리가 곤란하다.
  
  
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
            Promise 객체의 후속 메소드를 사용하여 비동기 처리 결과에 대한 후속 처리를 수행한다.
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