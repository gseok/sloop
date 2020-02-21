# sloop
Nginx + Typescript + React + Koa + SSR + Webpack 형태의 프로젝트 기본 구성을 위한, skeleton 프로젝트(이하 sloop) 입니다.

---

## Pre-reqs
기본적으로 필요한 requirement 요소는 dependency설치(```yarn install``` or ```npm install```)을 통해서 자동으로 설치 됩니다. 그외 아래 요소를 먼저 설치해야 정상 구동 할 수 있습니다.

To build and run this app locally you will need a few things:
- Install [Node.js](https://nodejs.org/en/) ("node": ">=10")
- Install [Nginx](http://nginx.org/en/download.html) ("nginx": ">=1.15")

---

## Getting started
### 간략한게 sloop 를 구동해 보는 방법입니다.
```javascript
// Clone the repository
$ git clone git@oss.navercorp.com:Maps/sloop.git

// Install dependencies
$ yarn install

// Build and run the project
$ yarn start:local
```
구동이 성공하면, 자동으로 browser가 open되어, SSR형태로 서빙되는 React Client을 확인 할 수 있습니다.

SSR지원을 위해서 sloop는, 내부적으로 Koa(Node)서버로 구동되고 있습니다. 따라서, 구현시 간단한 proxy api server나 rest서버를 해당(koa)로 구현 가능합니다. Server or Client을 아래와 같이 독립적으로 체크 가능합니다.

```javascript
// server check
$ curl http://localhost:3131/ping

// client check (in browser)
Browse to http://localhost:3131
```

### Sloop 활용 방법
구현하려는 프로젝트의 성격 및 기획, 기능(feature)에 따라서, Sloop을 기반으로 필요한 부분만 취사 선택해서 사용하는 것을 권장합니다. 아래 몇가지 예시를 들었습니다.
- SSR이 굳이 필요 없는 경우, `start:client:local-only`을 `webpack-dev-server` 에서 `webpack`으로 간단 변경하여, static한 client 빌드를 구성 할 수 있습니다.
- SSR사용하되, String형태로 사용하는 경우 `.env.phase.{phase_value}`의 `SSR_TYPE`값을 `string`로 설정하여 사용
- Bundle을 single파일로 하고 싶은 경우 `.env.phase.{phase_value}`의 `USE_LOADABLE`값을 `off`로 설정하여 사용
- SSR사용필요 없이 독립적인 Koa 서버와 독립적인 React Client을 사용하려는 경우, `Server의 ssr 미들웨어 제거` 및 `Server에서 dynamic webpack build` 제거, 대신 client을 서빙하기위한 static file 서빙 기능 추가 후 사용
- nginx layer 별도 구성하고 싶은 경우, `nginx설정 및 startNginx.js`을 제거하고, 독립 구성된 nginx을 사용하도록 한뒤 사용

---

## Debugging Server
서버(koa) 코드를 디버깅 하는 방법입니다. 현재 ```start:local```와 ```start:dev```로 구동시 서버를 디버깅 가능한 port(```9331```)를 추가로 open하면서 구동됩니다.

- ```yarn start:local``` 또는 ```yarn start:dev``` 로 구동

정상 구동된 사태에서 아래와 같이 chrome이나, IntelliJ, VsCode등을 통해서 server 코드를 디버깅 할 수 있습니다.

> Warning: Sloop는 서버보다 SSR Client개발 환경을 우선하기 때문에, 서버 코드 디버깅시 서버 자동 Refresh가 되어 있지 않습니다. 해당 부분은 별도로 구성하거나, 서버를 재시작하면서 확인해야 합니다.

<details>
  <summary><b>chrome browser</b></summary>

  Open chrome browser and type url
  ```
  chrome://inspect/#devices
  ```
  - You can find `Remote Target` inspect link, access the link then inspector open.
  - If Not Display `Remote Target` Then Add ```localhost:9331``` configure in `Discover network targets`
</details>

<details>
  <summary><b>intelliJ IDE</b></summary>

  Make run configuration in IntelliJ IDE
  * Menu > Run > Edit Configurations...
  * Add new configuration in `Attach to Node.js/chrome` section
  * Host `localhost` or `127.0.0.1`
  * Port `9331`
  * Attach To Option > `chrome or Node.js > 6.3 started with --inspect`
  * check reconnection automatically

  `Debug Run` in IntelliJ IDE then automatically connection debug mode. You can access and debug break point in you IDE.
</details>

<details>
  <summary><b>VsCode IDE</b></summary>

  Add follow `.vscode/launch.json` file and Start `RUN ADN DEBUG` in VsCode
  ```json
  {
    "version": "0.2.0",
    "configurations": [
      {
        "type": "node",
        "request": "attach",
        "name": "Sloop Server Debut",
        "port": 9331,
        "restart": true,
      }
    ]
  }
  ```
</details>

## Debugging Client
클라이언트 (React)을 디버깅하는 방법입니다. 서버와 동일하게 현재 ```start:local```와 ```start:dev```로 구동시 코드 HMR형태로 코드 디버깅이 가능하게 되어 있습니다.

SSR와 관계없이 Client만 단독으로 확인 & 테스트 해야 하는 경우 ```start:client:local-only```을 통해서 HMR 및 코드 디버깅이 가능합니다.

---

## Project Structure
sloop의 구조를 설명합니다.


| Name | Description |
| ---- | ----------- |
| **dist**                 | 빌드 결과가 모이는 디렉토리, `client`, `server` 로 폴더가 나누어져 있습니다. |
| **environments**         | .env을 활용한 빌드 config값을 모아둔 폴더로, 빌드 `phase`별로 파일이 나누어져 있습니다. |
| **nginx-conf**           | nginx 설정이 모아진 폴더입니다, 해당 폴더의 `nginx.conf`파일로 nginx을 구동합니다. |
| **node_modules**         | 모든 dependencies 모듈들이 설치되는 폴더입니다. |
| **public**               | 클라이언트의 asset 혹은, resource등을 모아둔 폴더입니다. |
| **scripts**              | 번들러(Webpack)스크립트, 배포(docker, kubernetes)스크립트 등을 모아두는 폴더 입니다. |
| **src**                  | 프로젝트의 모든 소스 코드를 모아두는 폴더입니다. `client`, `server` 로 폴더가 나누어져 있습니다. |
| **src/*/tsconfig.json**  | typescript빌드 설정을 위한 파일로 `client`, `server` 각각 독립적으로 설정되어 있습니다. |
| .eslintignore            | eslint 예외 처리 파일입니다. |
| .eslintrc                | eslint에서 lint설정을 담당하는 파일입니다. |
| .gitignore               | git 예외 처리 파일입니다. |
| .prettierrc              | 코드 포멧팅을 담당하는 prettier 설정 파일입니다. |
| babel.config.js          | es3, es5을 지원하기위한 babel compiler 기본 설정 파일 입니다. |
| package.json             | 스크립트와, 전체 dependency을 설정하는 파일입니다. |
| README.md                | 기본 Document 파일 입니다. |
| startNginx.js            | nginx을 수행하는 util성 실행파일입니다. package.json 의 스크립트에서 활용하고, nginx의 default config의 오염을 방지합니다. |

---

## command
sloop의 기본 command을 설명합니다.

| Npm Script                 | Description |
|----------------------------|-------------|
| `clear`                    | dist폴더를 초기화 합니다. |
| `codelint`                 | code lint을 수행합니다. `huskey` 설정에 의하여, commit 이전에 선 수행됩니다. |
| `coeelint:fix`             | code lint을 수행하고, 수정까지 진행합니다. `huskey` 설정에 의하여, push 이전에 선 수행됩니다. |
| `start:{phase}`            | clear, build, start을 한번에 수행하여 줍니다. `phase` 는 `local`, `dev`, `test`, `real` 이 있습니다. |
| `start:server`             | nginx및 koa 서버를 실행합니다. 서버는 `dist/server.js` 을 기준으로 실행됩니다. |
| `start:server:local-debug` | nginx및 koa 서버를 실행합니다. 서버는 `dist/server.js` 을 기준으로 실행되고, debug모드로 실행됩니다. |
| `start:client:local-only`  | client만 단독 실행합니다. koa서버와 무방하게 client의 독립적인 기능 테스트를 위해서 활용 가능합니다. |
| `build:{phase}`            | server와 client을 모두 빌드합니다. `phase` 는 `local`, `dev`, `test`, `real` 이 있습니다. |
| `build:client:{phase}`     | client을 빌드합니다. `phase` 는 `local`, `dev`, `test`, `real` 이 있습니다. |
| `build:server:{phase}`     | server을 빌드합니다. `phase` 는 `local`, `dev`, `test`, `real` 이 있습니다. |

---

## Build Env
sloop는 `webpack`을 이용하여 build을 수행하고 있습니다. 이때(Build시점에), Target Phase나 Build Env(빌드 설정)을 통하여, build을 조정 할 수 있습니다. sloop는 `dotenv`을 사용하여, build 이전에 설정을 process enviroment에 확장하고, 해당 값을 webpack 빌드 시점에 사용하게 됩니다.

### env 파일 규칙은 아래와 같습니다
```javascript
  // 항상 아래 형태의 파일 이름을 가져야 합니다.
  $ environments/.env.phase.{phase_value}

  // phase_value는 webpack env설정으로 전달되어 집니다.
  $ webpack --env.phase={phase_value}
```

### env 설정값은 아래와 같습니다.

| Env Config Name                 | Description | Default |
|---------------------------------|-------------|---------|
| NODE_ENV                        | `development`, `production` 을 결정합니다. | `development` |
| GENERATE_SOURCEMAP              | debug용 source map생성여부를 결정합니다. | 기본 미생성 |
| GENERATE_SOURCE_NAME            | dist에 결과로 나타나는 output이름을 설정하니다. `normal`, `hash` 을 지원합니다. | `normal` |
| GENERATE_STYLE                  | style 파일을 extract할지 js inline으로 가져갈지 결정합니다. `normal`, `extract` 을 지원합니다. | `inline` |
| BUILD_WATCH                     | entry source의 변경감지를 설정합니다. `on`, `off` 을 지원합니다. | `off` |
| SSR_TYPE                        | SSR지원시 SSR Type을 설정합니다. `stream`, `string` 을 지원합니다. | `stream` |
| LOG_LEVEL                       | Server Log Level을 설정합니다. 현재 서버 Logger는 `winston`을 `cutomize`하여 쓰고 있고, `src/server/helpers/logger.ts`로 구현되어 있습니다. 해당 구현체에서 정의한 `log level`을 써야하며, 현재 `log`, `error`, `warn`, `info`, `debug` 로 되어있습니다. | `error` |
| USE_LOADABLE                    | SSR에서 Code을 single bundler로 지원하기 위한 옵션 입니다. loadable을 `미사용`하여야 single bunding이 가능합니다. `on`, `off`을 지원합니다. `off`시 여러 js가 아닌 하나의 js로 번들링 됩니다. | `on` |

---

## Dependencies
Dependencies are managed through `package.json`.
In that file you'll find two sections:

| Package                         | Description   |
| ------------------------------- | --------------|
| @loadable/component             | SSR에서 Code Split및 Lazy Loading을 지원하는 모듈입니다. |
| @loadable/server                | SSR에서 @loadable/component로 구성된 Component을 SSR에서 해석하기위한 모듈 입니다.|
| axios                           | Ajax Call 유틸 모듈 입니다. |
| core-js                         | Babel에서 Transfile 및 polyfill을 지원하기위한 core모듈 입니다. |
| dotenv                          | Koa서버 실행전 Env을 설정하는, Process.env을 위한 모듈 입니다. |
| koa                             | Node.js web서버 Framework 입니다. |
| koa-router                      | koa에서 route컨트롤을 위한 plugin 모듈 입니다. |
| koa-send                        | koa에서 static file serving을 위한 plugin 모듈 입니다. |
| react                           | React Lib 입니다. |
| react-dom                       | React V-Dom을 위한 Lib 입니다. |
| react-redux                     | React에서 redux을 연동하는 모듈 입니다. |
| react-router                    | React에서 route을 지원하는 모듈 입니다. |
| react-router-dom                | React에서 route을 지원하는 추가 모듈 입니다. |
| redux                           | redux 코어 모듈 입니다. |
| regenerator-runtime             | Babel에서 poloyfill을 지원하기위한 추가 모듈 입니다. |
| winston                         | 서버 Logging Lib 모듈 입니다. |


To install or update these dependencies you can use `yarn install`.

---
