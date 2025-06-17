export default function validateUsername(username) {
    if (username.length >= 6 && 
        username.length <= 20 && 
        /\d/.test(username)){ // contains at least one digit
        return true;
    } else {
        return false
    }
}
