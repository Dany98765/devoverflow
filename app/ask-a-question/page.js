import { auth } from "@/auth";
import AskAQuestionPage from "@/components/pages/ask-a-question/page";
import ROUTES from "@/routes";
import { redirect } from "next/navigation";

export default async function AskAQuestion(){
    const session = await auth()
    return(
        <div>
            <AskAQuestionPage isEdit={false}/>
        </div>
    )
}