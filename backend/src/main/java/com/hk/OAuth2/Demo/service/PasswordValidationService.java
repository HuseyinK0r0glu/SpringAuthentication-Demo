package com.hk.OAuth2.Demo.service;

import org.passay.*;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class PasswordValidationService {

    // it will return a message if the password is not valid
    // if the message is valid return null
    public static String validatePassword(String password) {

        PasswordValidator validator = new PasswordValidator(Arrays.asList(
                new LengthRule(8,30),
                new CharacterRule(EnglishCharacterData.UpperCase , 1),
                new CharacterRule(EnglishCharacterData.LowerCase , 1),
                new CharacterRule(EnglishCharacterData.Digit , 1),
                new CharacterRule(EnglishCharacterData.Special, 1),
                new WhitespaceRule() // no whitespace is allowed
        ));

        RuleResult result = validator.validate(new PasswordData(password));

        if(result.isValid()) {
            return null;
        }

        return String.join(", " , validator.getMessages(result));
    }


}
