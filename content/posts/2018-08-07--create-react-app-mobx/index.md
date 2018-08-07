---
title: create-react-app에서 MobX 사용하기
subTitle: How to use MobX with create-react-app
cover: mobx.jpg
category: "React"
---
  
![mobx](mobx.jpg)

## create-react-app 그리고 MobX
  
우리가 리액트를 처음 배울때, 그리고 연습하고 실제로 프로젝트에 사용할때도 많이 사용하는것이 **create-react-app**입니다. 프로젝트를 처음 시작할때 수동으로 작업할 필요 없이 만들어주는 쿨한 도구임이 틀림없습니다. 우리는 단지 create-react-app Anything 만 입력하면 됩니다.  
  
저는 최근 MobX와 Redux를 둘 다 공부하는 중이고, 각각의 장단점을 알아가는 중이지만 만약 이 글을 보시는 여러분이 MobX를 더 선호하신다면 한번쯤 막혀서 검색해 볼 수도 있는 부분을 말하려고 합니다. 바로 create-react-app에서는 **decorator**를 지원 하지 않습니다. decorator를 사용하지 않고 MobX를 사용할 수도 있지만 이것은 마치 여러분이 리액트를 JSX없이 사용하는 것과 같다고 생각합니다.  
  
리액트 컴포넌트는 <code>@observer</code>를 사용하여 MobX의 데이터 store의 변화를 감지하고 반응합니다. 예제를 같이 볼까요?
```javascript

import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class Hello extends Component {
    render() {
        return <h1>Hello {this.props.store.name}</h1>
    }
}
```
하지만 이 예제를 따라하기 전에 해결해야 할 문제가 있습니다. 바로 create-react-app에서는 **decorator**를 사용할 수 없습니다. 그 이유는 간단합니다. create-react-app에는 babel5를 이용하고 있지만 decorator를 사용하기 위해서는 babel6 이상이 필요합니다. 따라서 우리의 app을 eject하고 플러그인을 커스텀해서 create-react-app에서 사용해야 합니다.  
  
## create-react-app 에서 MobX 사용하기
  
먼저 우리가 사용할 app을 만들어줍니다.  
```text
create-react-app myApp
```
그리고 eject 작업을 해야합니다.  
yarn을 예로 들겠습니다. npm을 사용하신다면 eject 명령어를 살펴보세요!
```text
yarn eject
```
eject할때 확인하는 문구가 나올수 있는데 y를 눌러 넘어갑니다.
그리고 우리가 필요한 플러그인을 설치해봅시다.
```text
yarn add babel-plugin-transform-decorators-legacy
```
이제 packge.json을 열어 **babel**을 찾고 그 부분을 수정할 것입니다.
```json
"babel": {
  "plugins": [
    "transform-decorators-legacy"
  ],
  "presets": [
    "react-app"
  ]
}
```
우리가 사용할 MobX도 설치해야겠죠?
```text
yarn add mobx mobx-react
```
모든것이 끝났습니다. 정말쉽죠? MobX를 사용할 준비가 되셨나요?  
  
## Reference
[https://swizec.com/blog/mobx-with-create-react-app/swizec/7158](https://swizec.com/blog/mobx-with-create-react-app/swizec/7158)
