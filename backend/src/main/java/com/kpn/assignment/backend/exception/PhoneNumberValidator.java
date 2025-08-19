package com.kpn.assignment.backend.exception;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneNumberValidator implements ConstraintValidator<ValidPhoneNumber, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) return false;
        String digitsOnly = value.replaceAll("[\\s\\-()]", "");
        return digitsOnly.matches("^\\+?[1-9][0-9]{6,19}$");
    }
}
