"use client"
import { useEffect, useState } from "react";
import AlertMessage from "@/components/alert-message/page";

export default function ValidateUsername({username}) {
    const [usernameError, setUsernameError] = useState({ message: "", status: "error" })
    useEffect(() => {
        if (username.length < 6){ 
            setUsernameError({ message: "Username must contain at least 6 characters!", status: "error"})
        } else if (username.length > 20) {
            setUsernameError({ message: "Username must not exceed 20 characters!", status: "error"})
        } else if ( !/\d/.test(username)) { // contains at least one digit
            setUsernameError({ message: "Username must contain at least 1 digit!", status: "error"})
        }
        else {
            setUsernameError({ message: "", status: "success"})
        }
    }, [username])
    return(
        <div>
            {usernameError.message ? <AlertMessage status={usernameError.status} message={usernameError.message}/> : null}
        </div>
    )
}


