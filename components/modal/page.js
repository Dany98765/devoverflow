// "use client"

// import Image from "next/image"
// import "./styles.css"
// import { ROUTES } from "@/utils/routes"
// import { useRouter } from "next/navigation"

// export default function Modal(){
//     const router = useRouter()
//     return (
//         <div className="overlay">
//             <div className="container">
//                 <img
//                     src="/icons/lock.png"
//                     className="lockImg"
//                     alt="Unauthorized Img"
//                 />
//                 <h2 className="title">You are unauthorized from filling out this form!</h2>
//                 <p className="desc">You have to signup/signin to gain priviledge to access this form.</p>
//                 <button className="signinButton" onClick={() => router.push(ROUTES.SIGNIN)}>Sign in now!</button>
//             </div>
//         </div>
//     )
// }
"use client"

import { useRouter } from "next/navigation"
import ROUTES from "@/routes"
import "./styles.css"  // Separate file to avoid conflicts

export default function Modal({ title = "You are unauthorized from filling out this form!", message = "You have to signup/signin to gain privilege to access this form." }) {
  const router = useRouter()

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <img
          src="/lock.png"
          className="modal-lock-img"
          alt="Unauthorized"
        />
        <h2 className="modal-title">
          You are unauthorized from filling out this form!
        </h2>
        <p className="modal-desc">
          You have to signup/signin to gain privilege to access this form.
        </p>
        <button
          className="modal-signin-button"
          onClick={() => router.push(ROUTES.AUTH)}
        >
          Sign in now!
        </button>
      </div>
    </div>
  )
}
