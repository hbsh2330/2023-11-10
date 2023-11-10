const dialog = document.getElementById('dialog'); //dialog 상수를 생성

if (dialog) { //만약 dialog가 null이 아니거나, 빈값이 아닐때 . 즉 dialog가 있을때
    dialog.createButton = function (text, onclick) { // dialog.createButton은 매개변수로 text와 onclick을 가지고 있는 함수다
        return { //반환한다
            text: text, // 매개변수의 값으로 들어온 것의 text오브젝트의 값으로 반환
            onclick: onclick // 매개변수 값으로 들어온 것을 onclick 오브젝트의 값으로 반환
        };
    }

    dialog.hide = function () {
        dialog.classList.remove('visible'); //dialog의 클래스인 visible을 제거한다.
    }

    dialog.show = function (params) { // dialog.show는 매개변수로 params를 가지고 있는 함수다
        const modal = dialog.querySelector(':scope > [rel="modal"]'); // dialog자식 rel=modal을 선택하여 modal의 상수를 만들고
        const buttonContainer = modal.querySelector(':scope > [rel="buttonContainer"]'); //modal의 자식인 rel="buttonContainer을 선택하여 buttonContainer 상수를 만들고
        modal.querySelector(':scope > [rel="title"]').innerText = params['title']; //modal의 자식인 title에 title을 키로 갖는 값을 출력
        modal.querySelector(':scope > [rel="content"]').innerHTML = params['content']; //modal의 자식인 content에 content를 키로 갖는 값을 html로 출력
        buttonContainer.innerHTML = ''; //버튼 컨테이너의 html를 빈공백으로 만듦
        if (params['buttons'] && params['buttons'].length > 0) { //만약 buttons을 키로 값는 값 또는 buttons 키로값는 값의 길이가 0보다 크면
            for (const button of params['buttons']) { // buttons을 키로값는 값을 button에 넣어 오브젝트의 배열을 출력
                const buttonElement = document.createElement('div'); // div의 태그를 만들고 상수 buttonElement에 넣고
                buttonElement.classList.add('button'); //buttonElement에 button이라는 클래스를 만듬
                buttonElement.innerText = button['text']; //buttonElement의 택스트에 button의 text를 키로갖는 값의 결과를 출력
                buttonElement.onclick = button['onclick']; // buttonElement을 클릭하면 onclick을 키로 갖는 값의 결과를 대입
                buttonContainer.append(buttonElement); // buttonContainer에 buttonElement를 대입
            }
        }
        dialog.classList.add('visible'); // dialog.show라는 함수를 실행하면 dialog에 visible이라는 클래스를 추가
    }
}

const loading = document.getElementById('loading');

if (loading) {
    loading.hide = function () {
        loading.classList.remove('visible');
    }

    loading.show = function () {
        loading.classList.add('visible');
    }
}















