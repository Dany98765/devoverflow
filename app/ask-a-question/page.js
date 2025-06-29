import { auth } from "@/auth";
import AskAQuestionPage from "@/components/pages/ask-a-question/page";
import ROUTES from "@/routes";
import logger from "@/utils/logger";
import { redirect } from "next/navigation";

export default async function AskAQuestion(){
    const session = await auth()
    if(!session){
        redirect(ROUTES.AUTH)
    }

    return(
        <div>
            <AskAQuestionPage />
        </div>
    )
}