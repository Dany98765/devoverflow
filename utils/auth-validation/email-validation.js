import isEmail from 'validator/lib/isEmail';

export default function validateEmail(email) {
    if (isEmail(email)) {
        return true;
    } else {
        return false;
    }
}