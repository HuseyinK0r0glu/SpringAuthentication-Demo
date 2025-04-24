import React , {useState} from "react";
import { useNavigate } from "react-router-dom";
import PasswordValidation from "../../components/PasswordValidation";
import { authFetch } from "../../components/ApiClient";
import PhoneInput from "react-phone-input-2";
import Swal from "sweetalert2";

const SignUpPage = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    // phone wont have + just 90 5...
    const [phone,setPhone] = useState('');

    // validation for the phone
    const [isValidPhone,setIsValidPhone] = useState(false);

    // regex expression for phone validation
    const phoneRegex = /^\90[5-9][0-9]{9}$/
    
    // validation for the password
    const [isValid,setIsValid] = useState(false);

    const [passwordRules,setPasswordRules] = useState({
        minLength : false,
        uppercase : false,
        lowercase : false,
        number : false,
        specialChar : false,
        noWhiteSpace : false
      });

    const handlePasswordChange = (event) => {
      setError("");
      const newPassword = event.target.value;
      setPassword(newPassword);
    };

    const handlePhoneChange = (newPhone) => {
      setPhone(newPhone);
      setIsValidPhone(phoneRegex.test(newPhone));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if(!isValid){
          setError("Password is not valid");
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match!");
          return;
        }

        try{    

            const data = await authFetch('http://localhost:8080/api/auth/signup',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username,
                email,
                password,
                confirmPassword,
                phoneNumber : phone
              }),
            },false);

            localStorage.setItem("signupRequest", JSON.stringify({
              email,
              username,
              phoneNumber: phone
            }));
            
            // for resending the verification token
            const expiresAt = new Date().getTime() + 60 * 1000;
            localStorage.setItem("cooldownEnd", expiresAt);
              
            setError("");
            Swal.fire({
              title: 'Email Sent!',
              text: data.message || 'Verification link is sent! Please check your email!',
              icon: 'info',
              confirmButtonColor: '#3085d6'
            });
            navigate("/verify");
            
        }catch(error){
            setError(error.message || 'Error occurred during sign up');
        }
    };

    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm p-4">
              <h2 className="text-center mb-4">Sign Up</h2>

              <form onSubmit={handleSignUp}>
                {/* Username */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="mb-3">
                  <PhoneInput
                    country={'tr'}
                    onlyCountries={['tr']}
                    countryCodeEditable={false}
                    value={phone}
                    onChange={phone => handlePhoneChange(phone)}
                    specialLabel={
                      <div>
                        Phone 
                        <small className="text-muted"> (e.g. +90 5XX XXX XXXX)</small>
                      </div>
                    }
                    inputProps={{
                      name: 'phone',
                      required: true,
                    }}
                    inputStyle={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da',
                    }}
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex flex-column">
                  {/* Password Rules */}
                  <PasswordValidation
                    password={password}
                    setIsValid={setIsValid}
                    setPasswordRules={setPasswordRules}
                  />

                  {/* Phone Validation */}
                  <ul className="text-left">
                  {!isValidPhone && (
                    <li style={{ color: 'red' }}>
                      Phone number is not in correct format 
                    </li>
                  )}
                  </ul>
                </div>

                {/* Error Message */}
                {error && <p className="text-danger mt-2">{error}</p>}

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mt-3"
                  disabled={!isValid && !isValidPhone}
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

    );
}

export default SignUpPage;

