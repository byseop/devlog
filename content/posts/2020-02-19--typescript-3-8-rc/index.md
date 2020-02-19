---
title: Typescript 3.8 RC 기능 미리보기
subTitle: Typescript 3.8 RC Feature Preview
cover: typescript.png
category: "Typescript"
---
  
![typescript](typescript.png)  
  
# Announcing Typescript 3.8 RC  
Typescript 개발블로그에 3.8 버전 출시가 임박하는 [글을 올렸습니다](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-rc/#type-only-imports-exports).  
Typescript 3.8 RC(Release Candidate) 버전은 특별한 이슈가 없으면 Final 버전으로 몇주 이내에 배포 될 예정입니다. 배포시 기능이 빠지거나 변경 될 가능성이 있습니다.  
  
그렇다면 Typescript 3.8 RC 버전에서는 어떠한 기능들이 추가되는지 확인해보겠습니다.  
- Type-Only Imports and Export  
- ECMAScript Private Fields  
- export * as ns Syntax  
- Top-Level await  
- JSDoc Property Modifiers  
- Better Directory Watching and watchOptions  
- 'Fast and Loose' Incremental Checking  
  
다음 추가 기능들 중 제 기준에서 체감 될 만한 기능들을 간단하게 알아보겠습니다!
  
## Type-Only Imports and Export  
제목 그대로 <code>type</code>을 <code>import</code> 혹은 <code>export</code> 하기 위한 새로운 문법입니다. 바로 예를 들어 보겠습니다.  
```typescript
import type { Something } from './some-module.ts';
export type { Something } from './some-module.ts';
```
이 새로운 문법은 오직 <code>type</code> 만을 위한 <code>import</code>, <code>export</code> 문법입니다. 그렇다면 이러한 문법을 왜 사용하는 걸까요?  
  
이 문법을 왜 사용하는지 알아보기에 앞서 타입스크립트에서 자바스크립트로 변환 될 때 코드에 어떠한 변화가 있는지 알아보아야 합니다.
```typescript
// ./foo.ts
interface Options {
  // ...
}

export function doThing(options: Options) {
  // ...
}

// ./bar.ts
import { doThing, Options } from "./foo.ts";

function doThingBetter(options: Options) {
  // do something twice as good
  doThing(options);
  doThing(options);
}
```
위와 같은 타입스크립트로 쓰여진 코드가 있습니다. 이 샘플코드를 자바스크립트로 변환한다면
```javascript
// ./foo.js
export function doThing(options: Options) {
  // ...
}

// ./bar.js
import { doThing } from "./foo.js";

function doThingBetter(options: Options) {
  // do something twice as good
  doThing(options);
  doThing(options);
}
```
대부분의 경우에는 일반적인 <code>import</code>로 <code>value</code> 혹은 <code>type</code>을 가져오는데 큰 문제가 없었습니다. 단지 <code>type</code> 으로 선언된 부분은 자바스크립트로 변환 될 때 코드에서 지워지는 것을 확인 할 수 있습니다.  
  
그렇다면 다음 샘플도 확인해 봅시다.
```typescript
import { Something } from './some-module.ts';
export { Something } from './some-module.ts';
```
위 샘플 코드에서 <code>Something</code>은 <code>value</code> 일까요 <code>type</code> 일까요? 위에서 확인한 것 처럼 <code>type</code>은 자바스크립트로 변환되었을 때 코드에서 제외됩니다. 그렇다면 만약 위 샘플코드가 자바스크립트 파일로 변환 할 때는 Babel 혹은 타입스크립트 transpileModule API는 어떻게 판단할까요?  
아마도 이 코드는 문제가 될 것이라고 경고할 겁니다.  
  
이렇게 일반 <code>import</code> 로는 충분하지 않을때를 위해 Type-Only Imports and Export 문법이 추가됩니다. 이 문법을 사용할때 주의해야 하는 부분이 몇가지 있습니다.  
1. <code>import type</code> 은 오직 [Type Annotation](https://www.tutorialsteacher.com/typescript/type-annotation) 혹은 타입선언에만 사용해야 합니다.  
그 이유는 자바스크립트로 변환 될 때 <code>import type</code> 을 이용한 코드는 통째로 지워지게 됩니다.  
2. <code>class</code> 의 <code>extends</code> 로 사용될 때는 사용하지 않습니다.  
```typescript
import type { Component } from "react";

interface ButtonProps {
  // ...
}

class Button extends Component<ButtonProps> {
  //                 ~~~~~~~~~
  // error! 'Component' only refers to a type, but is being used as a value here.

  // ...
}
```  
3. 기본 불러오기와 혼합하여 사용하지 않는다.  
```typescript
// Is only 'Foo' a type? Or every declaration in the import?
// We just give an error because it's not clear.

import type Foo, { Bar, Baz } from "some-module";
//     ~~~~~~~~~~~~~~~~~~~~~~
// error! A type-only import can specify a default import or named bindings, but not both.
```
애매하게 보일 수 있는 기본 불러오기와 혼합하여 <code>import type</code> 하는것은 허용하지 않습니다.  
  
이 외에 추가적인 정보는 [Github pull request](https://github.com/microsoft/TypeScript/pull/35200)나 [베타버전 배포 이후 변경사항](https://github.com/microsoft/TypeScript/pull/36092/)에서 확인할 수 있습니다.  
  
## export * as ns Syntax  
일반적으로 다른 모듈의 모든 구성요소를 하나로 <code>export</code> 하기 위해서는 다음과 같이 처리합니다.
```typescript
import * as two from './one';
export { two };
```
그리고 ECMAScript2020 에 추가된 일반적인 방법으로는 다음과 같이 처리할 수 있습니다.
```typescript
export * as two from './one';
```
이 문법이 타입스크립트 3.8 버전에 추가됩니다.  
추가적인 정보는 [Github pull request](https://github.com/microsoft/TypeScript/pull/34903)에서 확인할 수 있습니다.  
  
## Top-Level await  
자바스크립트에서 HTTP요청과 같은 대부분의 Input과 Output은 비동기적이고, 많은 API가 <code>Promise</code>를 반환합니다.  
```javascript
fetch("...")
  .then(response => response.text())
  .then(greeting => { console.log(greeting) });
```
자바스크립트 사용자들은 <code>.then</code>으로 처리하는 것 대신에 <code>async function</code>과 <code>await</code>을 도입하였습니다.
```javascript
async function main() {
  const response = await fetch("...");
  const greeting = await response.text();
  console.log(greeting);
}

main()
  .catch(e => console.error(e))
```
이제는 <code>async function</code> 를 사용하는 것 대신에 ECMAScript의 'Top-Level awiat' 라고 부르는 기능을 도입하였습니다.  
이 전의 자바스크립트는 <code>async function</code> 안쪽에서 <code>await</code> 키워드를 사용할 수 있었습니다. 하지만 'Top-Level await'는 모듈의 Top-Level에서 <code>async</code> 없이 사용 할 수 있습니다.
```javascript
const response = await fetch("...");
const greeting = await response.text();
console.log(greeting);

// Make sure we're a module
export {};
```  
이 기능은 모듈의 Top-Level 에서만 사용 할 수 있고, 타입스크립트에서는 <code>import</code>, <code>export</code> 할 때만 모듈로 간주됩니다. 상황에 따라서 위 샘플코드 처럼 <code>export {};</code> 같은 코드를 사용해야 할 때도 있습니다.  
  
> 'Top-Level await'는 아직 모든 환경에서 사용 할 수 없으며, 타겟 컴파일러가 ES2017 이상이고, 모듈이 esnext 이거나 system 일때 사용 가능하다고 합니다. 또한 여러 환경 및 번들러 내에서의 지원은 제한적이거나 실험 지원을 가능하게 해야 할 수 있습니다.  
  
사실 'Top-Level await' 기능은 당장 체감될 정도의 추가기능은 아니지만 타입스크립트가 ECMAScript2020의 'Optional chaning', 'Nullish coalescing' 등 비교적 최신 문법을 빠르게 포함하는 방향성에 의의를 두었습니다.  
  
## Better Directory Watching and watchOptions  
더 나은 Directory Watching이 제공됩니다. 이전 버전의 타입스크립트는 패키지를 설치할 때 가끔 에디터 세션의 크롤링이 느려지는 경우가 있었습니다. 이러한 현상을 막기 위해 타입스크립트 3.8 버전에서는 패키지가 설치된 이후 안정화 될 시간을 약간 두고 해당 디렉토리의 Watcher를 설치합니다.  
  
각 프로젝트마다 Directory Watching의 최적의 방법이 다르므로 이를 <code>tsconfig</code> 옵션으로 제공합니다
```json
{
    // Some typical compiler options
    "compilerOptions": {
        "target": "es2020",
        "moduleResolution": "node",
        // ...
    },

    // NEW: Options for file/directory watching
    "watchOptions": {
        // Use native file system events for files and directories
        "watchFile": "useFsEvents",
        "watchDirectory": "useFsEvents",

        // Poll files for updates more frequently
        // when they're updated a lot.
        "fallbackPolling": "dynamicPriority"
    }
}
```
옵션은 총 4가지가 있고 해당 옵션은 [이 곳](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-rc/#better-folder-watching)에서 확인 가능합니다.
  

## 그 외 변경사항  
이 외의 변경사항을 자세하게 확인하고 싶으시면 [Announcing Typescript 3.8 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-rc/#type-only-imports-exports)에서 확인 할 수 있습니다.  

## Reference  
- [Announcing Typescript 3.8 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-rc/#type-only-imports-exports)