import isEmail from 'validator/lib/isEmail';

export default function validateUser(user) {
  const existingValidName =
    typeof user?.name === "string" && user.name.trim().length > 1;

  const existingValidEmail =
    typeof user?.email === "string" && isEmail(user.email);

  const existingValidUsername =
    typeof user?.username === "string" && user.username.length > 8;

  const existingValidDesc =
    user.description === undefined || typeof user.description === "string";

  const existingValidImg =
    user.image === undefined || typeof user.image === "string";

  const existingValidLocation =
    user.location === undefined || typeof user.location === "string";

  const existingValidPortofolio =
    user.portofolio === undefined || typeof user.portofolio === "string";

  const existingValidReputation =
    user.reputation === undefined || typeof user.reputation === "number";

  return (
    existingValidName &&
    existingValidEmail &&
    existingValidUsername &&
    existingValidDesc &&
    existingValidImg &&
    existingValidLocation &&
    existingValidPortofolio &&
    existingValidReputation
  );
}
