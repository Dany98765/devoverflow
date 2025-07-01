import { auth } from "@/auth";
import AskAQuestionPage from "@/components/pages/ask-a-question/page";
import { getQuestion } from "@/utils/actions/questionTag";
import ROUTES from "@/routes";
import { notFound, redirect } from "next/navigation";

export default async function AskAQuestion({ params }) {
  const { id } = await params;
  if (!id) throw new Error("ID not found!");

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success) return notFound();

  const session = await auth();
  if (!session) redirect(ROUTES.AUTH);

  const userId = session?.user?.id;
  // if (question.author.toString() !== userId.toString()) {
  //   redirect(ROUTES.QUESTION_DETAILS(id));
  // }

  return (
    <div>
      <AskAQuestionPage isEdit question={question} />
    </div>
  );
}
