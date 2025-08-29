// import { signOut } from "@/auth";
// import { auth } from "@/auth";
// import ROUTES from "@/routes";

// export default async function LogoutButton() {
//   const sesison = await auth();
//   async function handleLogout() {
// "use server"
//     await signOut({ redirectTo: ROUTES.AUTH });
//   }
//   return (
//     sesison?.user?.email &&
//     <form action={handleLogout}>
//       <button type="submit" className="logout-button">Log Out</button>
//     </form>
    
//   )
// }
/////
"use client";

import "./styles.css"

import { logoutAction } from "@/utils/actions/logout.action";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="logout-button">
        Log Out
      </button>
    </form>
  );
}

