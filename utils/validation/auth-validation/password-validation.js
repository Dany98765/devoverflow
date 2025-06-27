"use client"
import { useEffect, useState } from "react";
import AlertMessage from "@/components/alert-message/page";

export default function ValidatePassword({password}) {
    const [passwordError, setPasswordError] = useState({ message: "", status: "error" })
    useEffect(() => {
        if (password.length < 8){ 
            setPasswordError({ message: "Password must contain at least 8 characters!", status: "error"})
        } else if (password.length > 30) {
            setPasswordError({ message: "Password must not exceed 30 characters!", status: "error"})
        } else if (!/\d/.test(password)) { // contains at least one digit
            setPasswordError({ message: "Password must contain at least 1 digit!", status: "error"})
        } else if (!/[A-Z]/.test(password)) {// contains at least one uppercase letter
            setPasswordError({ message: "Password must contain at least 1 uppercase letter!", status: "error"})
        }
        else if (!/[a-z]/.test(password)) {// contains at least one lowercase letter
            setPasswordError({ message: "Password must contain at least 1 lowercase letter!", status: "error"})
        }
        else if (!/[^A-Za-z0-9]/.test(password)) { // contains at least one special
            setPasswordError({ message: "password must contain at least 1 special charcater!", status: "error"})
        }
        else {
            setPasswordError({ message: "", status: "success"})
        }
    }, [password])
    return(
        <div>
            {passwordError.message ? <AlertMessage status={passwordError.status} message={passwordError.message}/> : null}
        </div>
    )
}
