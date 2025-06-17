"use client";

import { useState } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import Button from '@mui/material/Button';
import { signIn } from "next-auth/react";
import ROUTES from "@/routes";
import AlertMessage from "@/components/alert-message/page";
import validateEmail from "@/utils/auth-validation/email-validation";
import validateUsername from "@/utils/auth-validation/username-validation";
import validatePassword from "@/utils/auth-validation/password-validation";
import "./styles.css";

export default function Signin() {
    const [signup, setSignup] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const signupBgColor = signup ? "#007bff" : "white";
    const signinBgColor = signup ? "white" : "#007bff";

    async function handleProviderSignin(provider) {
        try {
            await signIn(provider,
                {
                    callbackUrl: ROUTES.HOME,
                    prompt: "login"
                }
            );
        }
        catch (error) {
            setErrorMessage("Failed to sign in with GitHub. " + error.message);
        }
    }   
    
    function handleAuth() {
        console.log(validateEmail(email));
        if (!validateUsername(username)) {
            setErrorMessage("Invalid Username: username must be between 6 and 20 characters long and must contain at least one digit.");
            return;
        }
        if (!validateEmail(email)) {
            setErrorMessage("Invalid Email: please enter a valid email address.");
            return;
        }
        if (!validatePassword(password)) {
            setErrorMessage("Invalid Password: password must be at least 8 characters long, 30 characters max, and contain at least one digit, one uppercase letter, one lowercase letter, and one special character.");
            return;
        }
        else {
            setErrorMessage("Sucess... redirecting to home page");
            console.log("Username:", username);
            console.log("Email:", email);
            
        }
    }

    return (
        <div className="signin-container">
            {errorMessage && (
               <AlertMessage status="error" message={errorMessage} />
            )}
            <br />
            <div className="auth-choice">
                <button className="signup-choice" style={{borderRadius: "5px", width: "80px", height: "30px", backgroundColor: signupBgColor}} onClick={() => {setSignup(true)}}>Signup</button>
                <button className="signin-choice" style={{borderRadius: "5px", width: "80px", height: "30px", backgroundColor: signinBgColor}} onClick={() => {setSignup(false)}}>Signin</button>
            </div>
            
            <br />
            {signup ? <div className="username-input">
                <p>Username</p>
                <input
                    type="text"
                    id="username"
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    placeholder="Enter your username"
                />
            </div> : null}
            <div className="email-input">
                <p>Email</p>
                <input
                    type="text"
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Enter your email"
                />
            </div>
            <div className="password-input">
                <p>Password</p>
                <input
                    type="text"
                    id="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="Enter your password"
                />
            </div>
            <br />
            <br />
            <div className="providers-buttons">
                <Button variant="outlined" startIcon={<GoogleIcon />} onClick={() => handleProviderSignin("google")}>
                    Signin with Google
                </Button>
                <Button variant="outlined" startIcon={<GitHubIcon />} onClick={() => handleProviderSignin("github")}>
                    Signin with Github
                </Button>
            </div>
            <br />
            <br />
            <button onClick={handleAuth} className="auth-button">{signup ? "Signup": "Signin"}</button>
        </div>
    );
}