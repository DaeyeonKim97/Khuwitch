## SOCKET SERVER

> TMI client (twitch chat socket server)와 socket서버를 연결하여 front에게 해당 스트리머 채널의 채팅/번역된 채팅을 emit해주는 서버

## 현재 개발상태

> nodejs서버와 테스트용으로 만든 ejs를 결합.
> papago API와 연동하여 챗이 emit하면 한국어인지 판단하고 해당 room에 번역된 채팅을 뿌려줌
> twitch bachelorchuckchuck, nonnu 의 방송에 example로 연결.
> localhost/:{env.SOCKET_PORT} 에서 해당 채팅방의 내용을 socket에 연결된 front(현재는 test ejs)로 뿌려줌

## 실행방법

>.env파일을 만듭니다.

**/server/env**
```txt
    SOCKET_PORT=
    TOKEN=
    PAPAGO_ID=
    PAPAGO_SECRET=
    BOT_USERNAME= 
    OAUTH_TOKEN=
```

```bash
    $cd server
    $npm install pkg.json --save
    $npm start
```

> localhost/:{env.SOCKET_PORT} 에서 결과 확인

