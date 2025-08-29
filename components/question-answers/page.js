import "./styles.css"
import Image from "next/image"
import PreviewDesc from "../question-preview/page"
import { getAnswers } from "@/utils/actions/answer.action";
import Votes from "../votes/page";
import { hasVoted } from "@/utils/actions/vote.action";
import { auth } from "@/auth";

export default async function QuestionAnswers({ params, id }) {
    const session = await auth()
    const email = session?.user?.email
    const { page, pageSize, filter, questionId } = await params

    // Get all answers
    const { success, error, data: { answers, isNext, totalAnswers } } = await getAnswers({
      page,
      pageSize,
      filter,
      questionId: id
    })
    const votesData = await Promise.all(
        answers.map(answer =>
            hasVoted({
                email,
                id: answer._id,   
                type: "Answer"
            })
        )
    )

    return (
        <div>
          {answers?.map((answer, index) => (
            <div key={answer._id}>
              <div className="top-h-data">
                  <div className="profile-data">
                      <Image className="profile-img" alt="Profile Img" src={answer.author.image} width={35} height={35} />
                      <p>{answer.author.name}</p>
                  </div>
                  <Votes 
                    email={email}
                    id={answer._id}   
                    data={votesData[index]?.data}
                    upvotes={answer.upvotes}
                    downvotes={answer.downvotes}
                    type="Answer"
                  />
              </div>
              <PreviewDesc content={answer?.content}/>
              <hr />
            </div>
          ))}
        </div>
    )
}
