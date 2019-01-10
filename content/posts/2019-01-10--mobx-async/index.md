---
title: Mobx와 비동기 작업 - React
subTitle: Mobx and Asynchronous actions - React
cover: mobx.jpg
category: "React"
---
  
![main](mobx.jpg)

## Mobx의 비동기 작업  
Mobx를 이용하여 개발할 때 사용하는 <code>action</code>은 현재 사용중인 함수에만 영향을 주고, 이 함수에 의해 스케줄되어 있는 다른 함수는 영향을 받지 않습니다. 예를들어 <code>setTimeout</code> 이나, promise의 <code>.then</code> 혹은 <code>async</code> 같은 구조에서 콜백으로 또 다른 상태변화가 일어나면, 이 콜백들은 또 다른 <code>action</code>으로 감싸져야 한다는 것 입니다.  
  
Mobx의 도큐먼트에는 비동기작업을 위한 몇가지 방법이 예제와 함께 소개되어 있습니다.  
  
## 1. Promise
```javascript
// action 함수만으로 상태를 변경할 수 있게 설정
mobx.configure({ enforceActions: 'observed' }) 

class Store {
  @observable githubProjects = []
  @observable state = 'pending' // 'pending', 'done', 'error'

  @action
  fetchProject() {
    this.githubProjects = []
    this.state = 'pending'
    fetchGithubProjectsSomehow().then( // action 안에서 .then이 사용 됨
      projects = > {
        const filteredProjects = somePreprocessing(projects)
        this.githubProjects = filterProjects
        this.state = 'done'
      },
      error => {
        this.state = 'error'
      }
    )
  }
}
```
위의 예제는 언뜻보면 맞는 것 같지만 위에서 설명했듯이 <code>action</code>안의 <code>.then</code>에서의 상태변화가 일어나면 다른 <code>action</code>으로 감싸야 합니다.
  
먼저 간단하게 수정 해 보면
```javascript
mobx.configure({ enforceActions: 'observed' })

class Store {
  @observable githubProjects = []
  @observable state = 'pending' // 'pending', 'done', 'error'

  @action
  fetchProject() {
    this.githubProjects = []
    this.state = 'pending'
    fetchGithubProjectsSomehow().then(this.fetchProjectsSuccess, this.fetchProjectsError)
  }

  @action.bound
  fetchProjectsSuccess(projects) {
    const filteredProjects = somePreprocessing(projects)
    this.githubProjects = filteredProjects
    this.state = 'done'
  }

  @action.bound
  fetchProjectsError(error) {
    this.state = 'error'
  }
}
```
이렇게 또 다른 <code>action</code>으로 감싸주었습니다. 이 방법은 꽤 깔끔하고 명확하게 보이지만 조금 더 규모가 큰 flow에서는 점점 더 복잡해 질 것입니다.  
이를 위해 <code>action</code> 블럭 안쪽에 또 다른 <code>action</code>을 생성 할 수 있습니다. 도큐먼트에서는 이것을 추천하지만 필수는 아니라고 합니다.
```javascript
mobx.configure({ enforceActions: 'observed' })

class Store {
  @observable githubProjects = []
  @observable state = 'pending' // 'pending', 'done', 'error'

  @action
  fetchProject() {
    this.githubProjects = []
    this.state = 'pending'
    
    fetchGithubProjectsSomehow().then(
      // 또 다른 action을 생성해줍니다.
      action('fetchSuccess', projects => {
        const filteredProjects = somePreprocessing(projects)
        this.githubProjects = filteredProjects
        this.state = 'done'
      }),
      action('fetchError', error => {
        this.state = 'error'
      })
    )
  }
}
```
이렇게 <code>action</code>안에 또 다른 <code>action</code>을 생성하여 코드를 더 보기 좋게 만들 수 있습니다.  
  

## 2. runInAction  
인라인 action 들의 단점은 TypeScript 에서 이러한 형식을 허용하지 않는 것 입니다.  
콜백 전체를 위한 action을 만드는 것 대신에 상태변화를 일으키는 콜백 action 만 따로 적용 할 수도 있습니다. 이 패턴의 장점은 action 들을 남용하지 않으면서 오히려 전체의 프로세스에서 상태변화를 할 수 있게 만들어 주는 것 입니다.
```javascript
mobx.configure({ enforceActions: 'observed' })

class Store {
  @observable githubProjects = []
  @observable state = 'pending' // 'pending', 'done', 'error'

  @action
  fetchProjects() {
    fetchProjects() {
      this.githubProjects = []
      this.state = 'pending'
      fetchGithubProjectsSomehow().then(
        projects => {
          const filteredProjects = somePreprocessing(projects)
          runInActions(() => {
            this.githubProjects = filteredProjects
            this.state = 'done'
          })
        },
        error => {
          runInAction(() => {
            this.state = 'error'
          })
        }
      )
    }
  }
}
```
  
## 3. async / await  
async와 await 기반의 함수들은 처음엔 혼란스러워 보일수 있습니다. 왜냐하면 사전적 의미로 이것들은 동시적인 기능으로 보이기 때문에, <code>@action</code>이 함수 전체에 적용되는 것 같은 착각을 줍니다.  
결과적으로 <code>@action</code> 는 첫번째 <code>await</code> 전 까지의 블록만 적용됩니다. 그리고나서 각각 <code>await</code> 이 실행되고, 각 <code>await</code> 의 상태변경 코드들은 또 다른 action들로 감싸져야 합니다. 이것이 <code>runInAction</code> 이 유용한 이유입니다.
```javascript
mobx.configure({ enforceActions: 'observed' })

class Store {
  @observable githubProjects = []
  @observable state = 'pending' // 'pending', 'done', 'error'

  @action
  async fetchProjects() {
    this.githubProjects = []
    this.state = 'pending'
    try {
      const projects = await fetchGithubProjectsSomehow()
      const filteredProjecst = somePreprocessing(projects)
      // await 이후에 상태를 변화시키려면 또 다시 action이 필요합니다.
      runInAction(() => {
        this.state = 'done'
        this.githubProjects = filteredProjects
      })
    } catch (error) {
      runInAction(() => {
        this.state = 'error'
      })
    }
  }
}
```
  
## 4. flows
<code>flow</code> 는 더 좋은 사용 방법이지만, 이것은 다른 문자를 추가로 사용해야합니다. 처음엔 어려워 보일 수 있지만 사실 <code>async</code> 나 <code>await</code>과 같은 원리입니다. 단지 <code>async</code> 나 <code>await</code>을 사용하는 대신에 <code>function *</code>을 사용하는 것 뿐입니다. <code>flow</code> 의 장점은 async / await과 문법적으로 매우 비슷하고, 비동기 작업이 필요한 부분에 수동으로 감싸지 않아도 된다는 것입니다. 결과적으로 매우 깨끗한 코드가 됩니다.  
  
<code>flow</code>는 오직 함수로만 사용할 수 있고, decorator로는 사용할 수 없습니다. 그리고 <code>flow</code>는 MobX 개발 도구와 깔끔하게 통합되어 있어서 비동기 작업의 과정을 쉽게 추적할 수 있습니다.
```javascript
mobx.configure({ enforceActions: 'observed' })

class Store {
  @observable githubProjects = []
  @observable state = 'pending' // 'pending', 'done', 'error'

  fetchProjcets = flow(function * () {
    this.githubProjects = []
    this.state = 'pending'
    try {
      // await 대신에 yield 를 사용합니다.
      const projects = yield fetchGithubProjectsSomehow() 
      const filteredProjects = somePreprocessing(projects)
      
      // 비동기 작업이 필요한 부분을 수동으로 감싸지 않아도 됩니다.
      this.state = 'done'
      this.githubProjects = filteredProjects
    } catch (error) {
      this.state = 'error'
    }
  })
}
```
flow는 취소할 수 있습니다. 우리가 <code>cancel()</code> 실행하면, 그 flow는 즉시 중단됩니다. 하지만 다른 flow들은 여전히 실행됩니다. 그리고 <code>FLOW_CANCELLED.</code>를 함께 반환합니다.  
  

## Reference
[MobX document](https://mobx.js.org/)