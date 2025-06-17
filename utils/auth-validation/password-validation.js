export default function validatePassword(password) {
    if (password.length >= 8 && // 8 characters minimum
        password.length <= 30 && // 30 characters maximum
        /\d/.test(password) && //contains at least one digit
        /[A-Z]/.test(password) &&  // contains at least one uppercase letter
        /[a-z]/.test(password) && // contains at least one lowercase letter
        /[^A-Za-z0-9]/.test(password)) { // contains at least one special character
        return true;
    } else {
        return false 
    }
}