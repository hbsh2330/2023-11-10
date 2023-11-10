package com.yhp.studybbs.controllers;

import com.yhp.studybbs.entities.ContactCompanyEntity;
import com.yhp.studybbs.entities.EmailAuthEntity;
import com.yhp.studybbs.results.user.SendRegisterEmailResult;
import com.yhp.studybbs.results.user.VerifyRegisterEmailResult;
import com.yhp.studybbs.services.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.mail.MessagingException;

@Controller
@RequestMapping(value = "user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "login",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getLogin() {
        return new ModelAndView("user/login");
    }

    @RequestMapping(value = "register",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getRegister() {
        ContactCompanyEntity[] contactCompanyEntities = this.userService.getContactCompanies();
        ModelAndView modelAndView = new ModelAndView("user/register");
        modelAndView.addObject("contactCompanies", contactCompanyEntities);
        return modelAndView;
    }

    @RequestMapping(value = "registerEmail",
            method = RequestMethod.POST, //포스트 방식으로 서버로 전송
            produces = MediaType.APPLICATION_JSON_VALUE) //제이슨 방식으로 전달
    @ResponseBody
    public String postRegisterEmail(EmailAuthEntity emailAuth) throws MessagingException {
        SendRegisterEmailResult result = this.userService.sendRegisterEmail(emailAuth); //userService의 메서드 sendRegisterEmail를 호출해서 result에 넣음
        JSONObject responseObject = new JSONObject(); //제이슨 오브젝트 생성
        responseObject.put("result", result.name().toLowerCase()); // 제이슨 오브젝트에 키가 result이고 값이 SendRegisterEmailResult enum의 값을 가져와서 소문자로 변환
        if (result == SendRegisterEmailResult.SUCCESS) { //만약 result가 SUCCESS라면
            responseObject.put("salt", emailAuth.getSalt()); // responseObject 객체에 키가 salt이고 값이 emailAuth의getSalt를 추가함.
        }
        return responseObject.toString(); //그러한 responseObject의 문자를 반환함
    }

    @RequestMapping(value = "registerEmail",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchRegisterEmail(EmailAuthEntity emailAuth) { //값을 넘겨주기 위한 매개변수
        VerifyRegisterEmailResult result = this.userService.verifyRegisterEmail(emailAuth); //userService가 가지고 있는 매소드를 실행
        JSONObject responseObject = new JSONObject(); //json객체 생성
        responseObject.put("result", result.name().toLowerCase()); // json객체에 키값이 result이고 값이 VerifyRegisterEmailResult를 가져와서 소문자로 변환
        return responseObject.toString(); //받은 값을 문자열로 리턴시켜줌
    }
}






