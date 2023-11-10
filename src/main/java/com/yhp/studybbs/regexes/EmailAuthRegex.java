package com.yhp.studybbs.regexes;

public enum EmailAuthRegex implements Regex { //정규화 대상이 되는 열만 쓰면됨
    EMAIL(UserRegex.EMAIL.expression), //UserRegex가 가지고 있는 EMail정규 표현식
    CODE("^(\\d{6})$"), //숫자로만 이루어진 6자
    SALT("^([\\da-z]{128})$"); // 영어소문자와 숫자로만 이루어진 128자

    public final String expression;

    EmailAuthRegex(String expression) {
        this.expression = expression;
    }

    @Override
    public boolean matches(String input) {
        return input != null && input.matches(this.expression);
    }
}