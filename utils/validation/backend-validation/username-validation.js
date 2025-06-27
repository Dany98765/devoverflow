export function validateUsername(username) {
    if (username.length < 6){ 
       return false
    } else if (username.length > 20) {
        return false
    } else if ( !/\d/.test(username)) { // contains at least one digit
        return false
    }
    else {
        return true
    }   
}