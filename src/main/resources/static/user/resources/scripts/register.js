const mainForm = document.getElementById('main'); // id가 main인 html을 선택하여 mainForm에 대입
const addressFind = document.getElementById('addressFind'); // id가 addressFind인 html을 선택하여 addressFind에 대입
mainForm['prev'].onclick = function () { // mainForm의 name이 prev인 녀석을 클릭하면 함수를 생성
    const minStep = 1; // minStep =1인 상수생성
    const maxStep = 3; // maxStep =3인 상수생성
    let step = parseInt(mainForm.dataset.step) - 1; //-1을 하는 이유가 무엇인가? //main폼의 data-step을 -1을 하여 인트로 형변환해서 step에 담기
    if (step < minStep) { // 만약 step의 크기가 1보다 작으면
        step = minStep; // step에 1을 대입
    }
    if (step > maxStep) { //만약 step의 크기가 3보다 크면
        step = maxStep; //step에 3을 대입
    }
    mainForm.dataset.step = step + ''; //메인폼의 data-step에 step을 대입
}

mainForm['infoEmailSend'].onclick = function () { // html name이 infoEmailSend인 것을 클릭했을 때 함수 실행
    if (mainForm['infoEmail'].value === '') { //만약 infoEmail의 값이 없을때
        dialog.show({ //dialog.show 함수 호출
            title: '이메일', //
            content: '이메일을 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    mainForm['infoEmail'].focus();
                    dialog.hide();
                })
            ]
        });
        return;
    }
    if (!new RegExp(mainForm['infoEmail'].dataset.regex).test(mainForm['infoEmail'].value)) { //만약 정규식 infoEmail의 data의 정규식이 infoEmail의 값이랑 다르다면
        dialog.show({ //dialog.show 함수를 생성
            title: '이메일',
            content: '올바른 이메일을 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    mainForm['infoEmail'].focus();
                    mainForm['infoEmail'].select();
                    dialog.hide();
                })
            ]
        });
        return;
    }
    const xhr = new XMLHttpRequest(); //xhr 객체 생성
    const formData = new FormData(); //formdata 생성
    formData.append('email', mainForm['infoEmail'].value); // name=email mainForm의 받아온 값을 폼형태로 만들어
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) { //만약 준비단계 완료되지 않을 경우 return한다.
            return;
        }
        loading.hide(); // 준비단계가 완료되었을 경우 loding을 숨기고
        if (xhr.status >= 200 && xhr.status < 300) { //만약 상태코드가 200보다 크거나 상태코드가 300보다 작을경우 //서버가 구동될 경우
            const responseObject = JSON.parse(xhr.responseText); //UserController에서 받은 responseObject text를 제이슨으로 파싱해서 resonseObject에 담는다.
            switch (responseObject['result']) { //키가 result인 것의 값이 failure이면
                case 'failure':
                    dialog.show({ //dialog.show함수를 실행한다.
                        title: '오류', // 제목: 오류
                        content: '알 수 없는 이유로 인증번호를 전송하지 못하였습니다.<br><br>잠시 후 다시 시도해 주세요.', //내용
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    }); //버튼을 만들고 확인 하고 dialog를 숨긴다.
                    break; //빠져나간다.
                case 'failure_duplicate_email': //만약 키가 result인 것의 값이 failure_duplicate_email이면
                    dialog.show({ //dialog.show함수를 실행한다.
                        title: '오류', // 제목 오류
                        content: '해당 이메일은 이미 사용 중입니다.',
                        buttons: [
                            dialog.createButton('확인', function () {
                                mainForm['infoEmail'].focus();
                                mainForm['infoEmail'].select();
                                dialog.hide();
                            })
                        ]
                    });
                    break;
                case 'success': // //만약 키가 result인 것의 값이 success면
                    mainForm['infoEmailSalt'].value = responseObject['salt']; // name이 infoEmailSalt에 responseObject의 키가 salt인 것의 값을 찾아 대입한다.
                    mainForm['infoEmail'].setAttribute('disabled', ''); // 이메일 인증의 속성값을 disabled로 한다.
                    mainForm['infoEmailSend'].setAttribute('disabled', ''); // 인증번호 발송의 속성값을 disabled로 한다.
                    mainForm['infoEmailCode'].removeAttribute('disabled'); // 이메일 인증번호의 속성값인 disabled를 제거한다.
                    mainForm['infoEmailVerify'].removeAttribute('disabled'); //이메일 확인값의 속성값인 disabled를 제거한다.
                    dialog.show({ //성공하면 dialog.show함수를 실행한다.
                        title: '성공',
                        content: '입력하신 이메일로 인증번호가 포함된 메일을 전송하였습니다.<br><br>해당 인증번호는 <b>5분간만 유효</b>하니 유의해 주세요.',
                        buttons: [
                            dialog.createButton('확인', function () {
                                dialog.hide();
                                mainForm['infoEmailCode'].focus();
                            })
                        ]
                    });
                    break;
                default:
                    dialog.show({ // 기본값은 dialog.show의 함수값이 다음과 같다.
                        title: '오류',
                        content: '서버가 예상치 못한 응답을 반환하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
            }
        } else { //서버가 구동되지 않을 경우
            dialog.show({
                title: '오류',
                content: '요청을 전송하는 도중 예상치 못한 오류가 발생하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                buttons: [dialog.createButton('확인', dialog.hide)]
            });
        }
    }
    xhr.open('POST', './registerEmail'); // 요청이 Post고 url주소가 registerEmail인 컨트롤러를 찾아
    xhr.send(formData); // 중요!!! GET방식으로는 폼데이터를 못만들어서 보낸다. 폼 데이터를 만들어요청을 내 보낸다.
    loading.show();
}

mainForm['infoEmailVerify'].onclick = function () { // 인증번호확인을 클릭했을 때
    if (mainForm['infoEmailCode'].value === '') { // 만약 이메일 인증번호(숫자 6자)의값이 없다면
        dialog.show({ // dialog.show함수 실행
            title: '이메일 인증번호',
            content: '이메일 인증번호를 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    dialog.hide();
                    mainForm['infoEmailCode'].focus();
                })
            ]
        });
        return;
    }
    if (!new RegExp(mainForm['infoEmailCode'].dataset.regex).test(mainForm['infoEmailCode'].value)) {
        dialog.show({ //정규식과 이메일인증번호 숫자6자의 값이 다르다면
            title: '이메일 인증번호',
            content: '올바른 이메일 인증번호를 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    dialog.hide();
                    mainForm['infoEmailCode'].focus();
                    mainForm['infoEmailCode'].select();
                })
            ]
        });
        return;
    }
    const xhr = new XMLHttpRequest(); // xhr객체 생성
    const formData = new FormData(); //formdata 객체 생성
    formData.append('email', mainForm['infoEmail'].value); //폼 데이타에 name이 email이고 값이 이메일(user@sample.com)에 들어온 값을 폼을 생성
    formData.append('code', mainForm['infoEmailCode'].value); // 이메일 인증번호(숫자 6자)로 들어온 값의 폼을 생성
    formData.append('salt', mainForm['infoEmailSalt'].value); // name= infoEmailSalt의 값으로 들어온 값의 폼을 생성
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return; //만약 xhr의 준비가 완료되지 않았다면 retun
        }
        if (xhr.status >= 200 && xhr.status < 300) { //만약 상태코드가 200보다 크거나, 상태코드가 300보다 작으면
            const responseObject = JSON.parse(xhr.responseText); //제이슨으로 파싱된 xhr의 문자열을  responseObject에 대입 // open의 url 주소의 컨트롤러가 준 제이슨과 형태가 같은 문자열을 받아서 사용
            switch (responseObject['result']) { // responseObject가 가지고 있는 키값인 result의 값이 faulure이면
                case 'failure':
                    dialog.show({ // dialog/show 실행
                        title: '오류',
                        content: '알 수 없는 이유로 이메일 인증번호를 확인하지 못하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
                    break;
                case 'failure_expired': // responseObject가 가지고 있는 키값인 result의 값이 failure_expired이면
                    dialog.show({ //dialog.show 실행
                        title: '오류',
                        content: '이메일 인증번호 세션이 만료되었습니다.<br><br>아래 확인 버튼을 눌러 이메일 인증을 재진행해 주세요.',
                        buttons: [
                            dialog.createButton('확인', function () {
                                dialog.hide();
                                mainForm['infoEmailSalt'].value = ''; // name이 infoEmailSalt인 값을 공백으로 설정
                                mainForm['infoEmail'].removeAttribute('disabled'); //disabled속성을 제거
                                mainForm['infoEmail'].focus();
                                mainForm['infoEmail'].select();
                                mainForm['infoEmailSend'].removeAttribute('disabled'); // 인증번호 발송의 disabled 속성을 제거
                                mainForm['infoEmailCode'].value = ''; // "이메일 인증번호(숫자 6자)의 값을 공백으로 지정
                                mainForm['infoEmailCode'].setAttribute('disabled', ''); // 이메일 인증번호(숫자 6자)를 disabled 속성을 지정
                                mainForm['infoEmailVerify'].setAttribute('disabled', ''); // 인증번호 확인에 disabled속성을 지정
                            })
                        ]
                    });
                    break;
                case 'failure_invalid_code':
                    dialog.show({
                        title: '오류',
                        content: '이메일 인증번호가 올바르지 않습니다.<br><br>입력하신 인증번호를 다시 확인해 주세요.',
                        buttons: [
                            dialog.createButton('확인', function () {
                                dialog.hide();
                                mainForm['infoEmailCode'].focus();
                                mainForm['infoEmailCode'].select();
                            })
                        ]
                    });
                    break;
                case 'success':
                    mainForm.querySelector('[rel="infoEmailComplete"]').classList.add('visible');
                    dialog.show({
                        title: '이메일 인증',
                        content: '이메일 및 인증번호를 확인하였습니다.',
                        buttons: [
                            dialog.createButton('확인', function () {
                                dialog.hide();
                                mainForm['infoEmailCode'].setAttribute('disabled', '');
                                mainForm['infoEmailVerify'].setAttribute('disabled', '');
                            })
                        ]
                    });
                    break;
                default:
                    dialog.show({
                        title: '오류',
                        content: '서버가 예상치 못한 응답을 반환하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
            }
        } else {
            dialog.show({
                title: '오류',
                content: '요청을 전송하는 도중 예상치 못한 오류가 발생하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                buttons: [dialog.createButton('확인', dialog.hide)]
            });
        }
    };
    xhr.open('PATCH', './registerEmail'); //컨트롤러가 준 method = PATCH이고 url주소가 registerEmail인 값을 받아서 사용
    xhr.send(formData);
}

mainForm['infoAddressFind'].onclick = function () {
    new daum.Postcode({
        width : '100%',
        height : '100%',
        oncomplete : function (data){
            mainForm['infoAddressPostal'].value = data['zonecode'];
            mainForm['infoAddressPrimary'].value = data['address'];
            mainForm['infoAddressSecondary'].focus();
            mainForm['infoAddressSecondary'].select();
            console.log(data)
            addressFind.classList.remove('visible')
        }
    }).embed(addressFind.querySelector(':scope > .modal'));
    addressFind.classList.add('visible')
};

mainForm.onsubmit = function (e) {
    e.preventDefault();
    switch (parseInt(mainForm.dataset.step)) {
        case 1:
            if (!mainForm['termPolicyAgree'].checked) {
                dialog.show({
                    title: '서비스 이용약관',
                    content: '서비스 이용약관을 읽고 동의해 주세요.',
                    buttons: [dialog.createButton('확인', dialog.hide)]
                });
                return false;
            }
            if (!mainForm['termPrivacyAgree'].checked) {
                dialog.show({
                    title: '개인정보 처리방침',
                    content: '개인정보 처리방침을 읽고 동의해 주세요.',
                    buttons: [dialog.createButton('확인', dialog.hide)]
                });
                return false;
            }
            if (!mainForm['termMarketingAgree'].checked) {
                dialog.show({
                    title: '마케팅 및 광고 활용 동의',
                    content: '마케팅 및 광고 활용에 동의하시면 다양한 혜택을 받아보실 수 있습니다.<br><br>다시 확인해 보시려면 <b>닫기</b>버튼을, 동의하지 않고 진행하시려면 <b>계속하기</b>버튼을 클릭해 주세요.',
                    buttons: [
                        dialog.createButton('닫기', dialog.hide),
                        dialog.createButton('계속하기', function () {
                            mainForm.dataset.step = '2';
                            dialog.hide();
                        })
                    ]
                });
            } else {
                mainForm.dataset.step = '2';
            }
            break;
        case 2:
            break;
        case 3:
            break;
    }
}

addressFind.querySelector('[rel=close]').onclick = function (){
    addressFind.classList.remove('visible')
}