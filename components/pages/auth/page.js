"use client";

import { useState } from "react";
import ROUTES from "@/routes";
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import Button from '@mui/material/Button';
import ValidateEmail from "@/utils/validation/auth-validation/email-validation";
import ValidateUsername from "@/utils/validation/auth-validation/username-validation";
import ValidatePassword from "@/utils/validation/auth-validation/password-validation";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import "./styles.css";
import { signUpWithCredentials } from "@/utils/actions/signupWithCredentials";
import AlertMessage from "@/components/alert-message/page";

export default function AuthenticationPage() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signup, setSignup] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const signupBgColor = signup ? "#007bff" : "white";
    const signinBgColor = signup ? "white" : "#007bff";
    const router = useRouter()


    async function handleProviderSignin(provider) {
        try {
            await signIn(provider,
                {
                    callbackUrl: ROUTES.HOME,
                    redirect: true,     
                }
            );
        }
        catch (error) {
            setErrorMessage(`Failed to sign in with ${provider}.` + error.message);
        }
    }   
    return (
        <div className="signin-container">
            {errorMessage ? <AlertMessage status="error" message={errorMessage}/> : null}
            <ValidateUsername username={username}/>
            <ValidateEmail email={email}/>
            <ValidatePassword password={password}/>
            <br />
            <div className="auth-choice">
                <button className="signup-choice" style={{borderRadius: "5px", width: "80px", height: "30px", backgroundColor: signupBgColor}} onClick={() => {setSignup(true)}}>Signup</button>
                <button className="signin-choice" style={{borderRadius: "5px", width: "80px", height: "30px", backgroundColor: signinBgColor}} onClick={() => {setSignup(false)}}>Signin</button>
            </div>
            
            <br />
            <form action={signUpWithCredentials}>
                {signup ? <div className="password-input">
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
                <div className="password-input">
                    <p>Name</p>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder="Enter your full name"
                    />
                </div>
                <div className="password-input">
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
                <button type="submit" className="auth-button">{signup ? "Signup": "Signin"}</button>
            </form>
        </div>
    );
}