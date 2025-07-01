"use client"
import { useEffect, useState } from "react";
import AlertMessage from "@/components/alert-message/page";
import isEmail from "validator/lib/isEmail";

export default function ValidateEmail({email}) {
    const [emailError, setEmailError] = useState({ message: "", status: "error" })
    useEffect(() => {
        if (email.length > 0 && !isEmail(email)){ 
            setEmailError({ message: "Invalid email address!", status: "error"})
        } else {
            setEmailError({ message: "", status: "success"})
        }
    }, [email])
    return(
        <div>
            {emailError.message ? <AlertMessage status={emailError.status} message={emailError.message}/> : null}
        </div>
    )
}

