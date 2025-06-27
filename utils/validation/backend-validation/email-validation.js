import isEmail from "validator/lib/isEmail"

export function validateEmail(email) {
        if (!isEmail(email)){ 
            return false
        } else {
            return true
        }
}