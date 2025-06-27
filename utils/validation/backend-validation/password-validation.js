export function validatePassword(password) {
    if (password.length < 8){ 
        return false
    } else if (password.length > 30) {
        return false
    } else if (!/\d/.test(password)) { // contains at least one digit
        return false
    } else if (!/[A-Z]/.test(password)) {// contains at least one uppercase letter
        return false
    }
    else if (!/[a-z]/.test(password)) {// contains at least one lowercase letter
        return false
    }
    else if (!/[^A-Za-z0-9]/.test(password)) { // contains at least one special
        return false
    }
    else {
       return true
    }
}

