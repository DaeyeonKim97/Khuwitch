## Polly

> Polly는 text를 음성으로 변환해주는 AWS의 한 서비스이다.

### 권한 (Cognito service)

모든 AWS는 이용하려면 그를 위한 자격 증명이 필요하다. 
브라우저에서 이용자가 바로 AWS 서비스를 이용하려면 AWS 서비스를 이용하기위한 자격증명이 필요하지만, IAM User의 Credential을
웹페이지 코드에 공개하는 것은 바람직하지않다.
`Cognito` 는 이런 경우에 웹페이지에서의 인증, 인가 상태와 AWS 서비스를 위한 인증, 인가를 연동할 수 있도록 해주는 AWS의 한 서비스이다.

우리는 인증되지않은 사용자도 Polly를 통해 TTS(text to speech) 기능을 이용할 수 있도록 Cognito의 자격 증명 풀을 생성했고, 그들은 Polly full access 권한을 갖는다.

### 사용 방법

```html
<script src="https://sdk.amazonaws.com/js/aws-sdk-2.796.0.min.js"></script>
```

브라우저에서 javascript AWS SDK를 설치한다(불러온다).

```html
<script>
<!-- Polly를 사용하기 위한 자격증명을 설정한다. -->
AWS.config.region = 'ap-northeast-2'; 
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'ap-northeast-2:03db97c9-a857-45f3-be6e-3cf84d6f619b'});
const polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'ap-northeast-2',
});

let params = {
    'Text': '반가워 친구야~',
    'OutputFormat': 'mp3',
    'VoiceId': 'Seoyeon'
};
let tts = new AWS.Polly.Presigner(params, polly)
        

// Create presigned URL of synthesized speech file
tts.getSynthesizeSpeechUrl(params, function(error, url) {
    if (error) {
    } else {
        setTimeout(()=>{
            console.log("실행")
            let audio = new Audio(url)
            audio.play()
                .then(delete audio);
        }, 3000)
    }
})
</script>
```
