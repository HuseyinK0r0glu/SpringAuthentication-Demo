import React , { useEffect, useState }from "react";

const PasswordValidation = ({password,setIsValid,setPasswordRules}) => {

    const [localPasswordRules,setLocalPasswordRules] = useState({
        minLength : false,
        uppercase : false,
        lowercase : false,
        number : false,
        specialChar : false,
      });
  
      // regex expression for password validation
      const validations = {
        minLength : /.{8,30}/,
        uppercase : /[A-Z]/,
        lowercase : /[a-z]/,
        number : /[0-9]/,
        specialChar : /[!@#$%^&*(),.?":{}|<>]/,
      };
  
      const checkPasswordStrength = () => {
  
        const newRules = {...localPasswordRules};
  
        newRules.minLength = validations.minLength.test(password);
        newRules.uppercase = validations.uppercase.test(password);
        newRules.lowercase = validations.lowercase.test(password);
        newRules.number = validations.number.test(password);
        newRules.specialChar = validations.specialChar.test(password);
  
        setLocalPasswordRules(newRules);
  
        const isPasswordValid = Object.values(newRules).every((
          rule => rule === true
        ));
        setIsValid(isPasswordValid);
        setPasswordRules(newRules);
      };


      useEffect(() => {
        checkPasswordStrength();
      },[password,setIsValid,setPasswordRules]);

    return(
        <ul className="mt-2 text-left">
            {!localPasswordRules.minLength && (
              <li style={{ color: 'red' }}>
                Password must be between 8 and 30 characters
              </li>
            )}
            {!localPasswordRules.uppercase && (
              <li style={{ color: 'red' }}>
                Must contain at least one uppercase letter
              </li>
            )}
            {!localPasswordRules.lowercase && (
              <li style={{ color: 'red' }}>
                Must contain at least one lowercase letter
              </li>
            )}
            {!localPasswordRules.number && (
              <li style={{ color: 'red' }}>
                Must contain at least one number
              </li>
            )}
            {!localPasswordRules.specialChar && (
              <li style={{ color: 'red' }}>
                Must contain at least one special character
              </li>
            )}
            </ul>
    );
};

export default PasswordValidation;