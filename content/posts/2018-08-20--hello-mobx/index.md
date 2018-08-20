---
title: MobX 란? MobX 와 React
subTitle: Hello, MobX
cover: mobx.jpg
category: "React"
---
  
![mobx](mobx.jpg)

## Hello, MobX
  
**MobX**은 **Redux**가 메인이었던 상태관리 생태계에 천천히 경쟁자로 자리 잡았습니다. 이것이 우연일까요? **MobX**는 정말쉽고, 정말 강력합니다. 그리고 **React**와 함께 사용 되었을 때 이 강점들은 더욱 강력해집니다. 상태관리 솔루션이 꽤 중요해진 지금, **MobX**는 이를위해 어떤일을 했었던 걸까요?    
  
우리는 **MobX**를 제대로 이해하기 위해서는 4가지 핵심 개념을 파악해야합니다.  
1. Observable State  
첫 번째로 **Observable State**란 어플리케이션의 우리가 관찰하려는 state를 말합니다. 이 state의 변화는 **reaction**과 **computations**를 일으킵니다.  
  
2. Computations  
두 번째로 **Computations**란 **Observable State**의 변화에 따른 값입니다. 이 **computations**은 필요한 경우에만 업데이트 됩니다.  
  
3. Actions  
세 번째로 **Actions**란 **Observable State**가 사용자가 지정한 것을 포함한 모든 변경사항을 말합니다.  
  
4. Reactions  
네 번째로 **Reactions**란 **Observable State**의 변화에 따른 부가적인 변화들입니다.  
  
그럼 **MobX**의 핵심 포인트는 무엇일까요?
>Anything that can be derived from the application state, should be derived. Automatically.  
  
모든 상태변화로 일어나는 부분을 자동으로 추적하는 것 입니다.  
  
이 글에서는 **MobX**의 컨셉만 알아 볼 것입니다. 물론 **MobX**를 사용하기 위해 모든것을 알아야 할 필요는 없습니다. 그리고 이것 또한 장점중 하나입니다.  
  
이렇게 단순한 컨셉은 **OOP기반**과 함께 **MobX**의 러닝커브를 매우 낮추어 주고, 이것은 새로운 프로젝트를 진행할때 많은 도움이 됩니다.  
  
## MobX를 React와 함께 사용하는 이유  
여러분도 잘 알다시피 **React**는 세계에서 가장 유명한 사용자 인터페이스를 렌더링하는 프론트엔드 라이브러리 입니다. 그렇다면 **MobX**와 **React**를 같이 사용하는 이유는 무엇일까요? 그 이유는 **MobX**의 장점과 **React**의 장점을 합쳤을 때 배가 되기 때문입니다.  
  
* **React**는 state의 변경사항을 기반으로 최소한의 UI를 업데이트 합니다.
* **MobX**는 절대적으로 필요한 경우에만 state를 변경합니다.  
  
즉 최소한의 state변경과 최소한의 UI업데이트는 우리의 프로젝트를 자연스럽게 매우 빠르고 효율적인 사용자 인터페이스를 제공할 수 있게 됩니다.  
  
## MobX와 React를 함께 사용해보기  
* [MobX와 React를 사용할 수 있는 템플릿](https://codepen.io/orliph/pen/eWQQOO)에 나중에 진행할 **Mobx** 튜토리얼에 필요한 것들이 있어요!  
* [create-react-app에 MobX 적용하기](../create-react-app-mobx/)도 가능합니다.  
  
이제 우리는 MobX를 사용해서 튜토리얼을 진행 해 볼 것입니다.  
오늘 포스팅에서는 MobX의 핵심개념들과 React와 사용했을때 장점에 대해 알아보았습니다.  
  
튜토리얼 또한 준비중이고 후기 남기겠습니다.