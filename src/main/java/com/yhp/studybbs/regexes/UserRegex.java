package com.yhp.studybbs.regexes;

public enum UserRegex implements Regex {
    EMAIL("^(?=.{4,50}$)([\\da-z_\\-.]{4,})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15}\\.)?([a-z]{2,3})$"),
    PASSWORD("^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?]{4,50})$"),
    NICKNAME("^([\\da-zA-Z가-힣]{2,10})$"),
    CONTACT_FIRST("^(010)$"),
    CONTACT_SECOND("^([\\d]{3,4})$"),
    CONTACT_THIRD("^([\\d]{4})$");

    public final String expression;

    UserRegex(String expression) {
        this.expression = expression;
    }

    @Override
    public boolean matches(String input) {
        return input != null && input.matches(this.expression);
    }
}