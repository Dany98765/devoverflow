"use server";

import {signUpWithCredentials} from "@/utils/signupWIthCredentials";

export default async function authSignupCredentials({
  username,
  email,
  password,
}) {
    
  return await signUpWithCredentials({ username, email, password });
}
