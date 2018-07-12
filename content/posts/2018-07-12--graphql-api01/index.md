---
title: GraphQL 그리고 NodeJS로 영화 API 만들기 - 1
subTitle: Hello and Introduction
cover: graphql.png
category: "GraphQL"
---

  
  
 이 포스팅은 GraphQL이 기본적으로 어떻게 돌아가고 요점이 무엇인지 볼 수 있는 프로젝트이다. 프로젝트 끝에는 영화를 다루는 작은 API를 만드는게 최종 목표이다. 그리고 나중에는 이 API를 통해서 영화 웹앱을 만드는게 목표이다.  
   
## GraphQL을 사용해서 해결 할 수 있는 문제들
  
 GraphQL을 본격적으로 시작하기 전에 GraphQL로 해결할 수 있는 두가지 문제를 알아보자.  
 1. Over-fetching  
 2. Under-fetching  

예를들어 우리가 모든 유저의 이름을 웹사이트에 보여주고 싶다면 users라는 엄청나게 큰 패키지를 GET을 할 것이다. 하지만 이 패키지에는 예를들어 유저의 성별이나 사진 등 필요하지 않은 정보들이 더 많을 것이다. 그리고 만약 다른곳에서 이 사진이나 성별을 보여주고 싶다면 또다시 이렇게 큰 패키지를 GET하게 된다.  
  
Database에 내가 사용하지 않을 영역을 요청하는 방식은 효율적인 방법이 아니다. 우리가 처음에 필요했던 정보는 오직 유저의 이름뿐이었다. 그런데 사용도 하지 않을 정보드를 전달 받은것이다. 이렇게 되면 우리의 Database가 쓸데없는 영역을 가져오게 하고, 우리의 프로젝트를 이용하는 유저들 또한 필요도 없는 정보를 받게 한다. 이것을 **Over-fetching** 이라고 한다. 우리가 요청한 정보의 영역보다 많은정보를 서버에서 받아오는 것이다. 상당히 비효율적이다 예를들어 모든 object를 다 받아서 console.log로 확인한 뒤 "모든 object를 전부 받았지만, 난 사용자명만 사용할거야~" 하게 되는것이다. GraphQL은 **Over-fetching** 없이 코드를 짤 수 있고 개발자가 어떤 정보를 원하는지에 대해 통제할 수 있게 된다.  
  
그렇다면 **Under-fetching**은 무엇일까? 위에 내용을 이해 했다면 추측이 가능할 것이다. 바로 어떤 하나를 완성하기 위해 우리가 다른 요청을 해야 할 때 발생하는 것이다.  
인스타그램을 예를 들면 기본적으로 앱을 실행하려면 페이지의 feed, notifications, user, 최소 세가지를 요청해야하고, 즉 세가지의 요청이 세번 오고가야 앱이 시작되는것이다. 이것이 바로 **Under-fetching**이다. REST에서 하나를 완성하려고 많은 소스를 요청하는 것이다.  
이것도 GraphQL에서 해결 할 수 있는 문제이다. Over-fetching, Under-fetching을 겪을 필요가 없다. 우리가 하나의 query에서 정확하게 필요하는 정보만 받아올 수 있는 것이다. 이 내용은 앞으로 보여줄 것이다!  
  
내가 필요한 정보들만을 어떻게 받아올 수 있을까? 예를들어 위에서 말한 인스타그램의 feed, notifications, user를 한 URL에서 받는것이다. 이것이 생각의 방식을 바꾸는 첫 지점이다. GraphQL에서는 URL자체가 존재하지 않다. URL체계도 없고 저러한 URL도 당연히 없다. 오직 하나의 종점만 있을 뿐이다. 이것을 api로 하던 graphql로 하던 어떤 방식으로도 가능하다. GraphQL에서는 이 모든것을 한개의 query로 만들 수 있다.  
  
여기서 Query는 Database에서 무언가를 요청하고 GraphQL 언어로 내가 원하는 정보를 알려준다. 예를들어 feed를 원하는데 모든 사진 feed중에 댓글과 좋아요 수를 원하고, 알림을 원하고, 그 알림을 확인했는지에 대한 정보를 원하고, 유저 프로필을 원하는데 사용자명과 프로필 사진을 원한다는 query를 구현해보면  
```query
query {
  feed {
    commnets
    likeNumber
  }
  notifications {
    isRead
  }
  user {
    username
    profilePic
  }
}
```
이렇게 구현 할 수 있다. 이것을 GraphQL의 Backend에 이와 같은 정보를 보내면
```json
{
  feed: [
    {
      comments:1,
      likeNumber: 20
    }
  ],
  notifications: [
    {
      isRead: true
    },
    {
      isRead: false
    }
  ],
  user: [
    {
      username: "Bae youngseop",
      profilePic: "http://...img"
    }
  ]
}
```
이와 같이 Object로 반환받는다. 정말 놀랍고 또 놀라운 기능이다. 우리가 요청한 정보들만 받을 수 있고 또 원하는 방식으로 조정이 가능 한 것이다!

이제 **graphql yoga**가 무엇인지 확인해보자.  


## graphql yoga  
  
**graphql yoga**란 무엇일까?  
graphql-yoga는 create-react-app 명령어와 비슷하다. GraphQL 프로젝트를 빠르게 시작할 수 있게 도와준다. 공식 리포지토리에는 '쉽게 설치하는데 중점을 둔 완전한 기능을 갖춘 GraphQL 서버' 라고 설명되어있다. 쉬운설치, 바로 우리가 원하는것이다.
  
깃헙에 [repository](https://github.com/byseop/movieql)를(이곳이 미리 만들어둔 리포지토리 입니다.) 만들어보자. repository 이름은 movieql이고 Description에는 Movie API with Graphql 라고 간단하게 설명을 적어두었다. README를 사용하고 .gitignore을 Node로 추가해주었다.  
  
리포지토리를 생성했으면 다음은 디렉토리를 만들어보자. 자신이 원하는 적당한곳에 디렉토리를 생성한다. 이번에도 movieql 이라는 이름으로 만들었다. 그리고나서 yarn init을 해주자. 
```text
yarn init
```
yarn init을 하면 name, version, description, main, repository, author, license 등을 묻는다. 이중에 description, repository, author 만 입력하고 나머지는 전부 enter 해주자.  
```text
"description": "Movie API width Graphql",
"repository": "https://github.com/byseop/movieql",
"author": "Bae youngseop<byseop@gmailc.om>",
```  
자신의 정보를 입력하고 디렉토리로 들어가 package.json을 확인해보자  
```json
{
  "name": "movieql",
  "version": "1.0.0",
  "description": "Movie API width Graphql",
  "main": "index.js",
  "repository": "https://github.com/byseop/movieql",
  "author": "Bae youngseop<byseop@gmailc.om>",
  "license": "MIT"
}
```
라고 나오면 정상적으로 성공. 그리고 깃과 연결해야한다.  
```text
git init .

git remote add origin https://github.com/byseop/movieql

git pull origin master
```
이제 다시 우리의 디렉토리로 돌아가서
```text
yarn add graphql-yoga
```
graphql yoga를 설치했다면 기본적인 준비는 끝났다. 다음 포스팅에서는 GraphQL Yoga를 이용해 서버를 구축해보자.  
  
## Reference
이 포스팅은 [노마드 코더](https://academy.nomadcoders.co/)의 GraphQL 강의 리뷰입니다. 자세한 정보를 보고싶으시면 노마드코더에서 강의를 확인해보세요!  