"use client"

import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import ROUTES from "@/routes";

export default function LogoutButton() {
    const { data: data, status } = useSession();
    return(
        <div>
            {data ? <button className="logout-button" onClick={() => signOut({redirectTo: ROUTES.AUTH})}>Log Out</button> : null}
        </div>
    )
}