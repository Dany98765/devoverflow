import "./styles.css"

import Image from "next/image"
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PreviewDesc from "@/components/question-preview/page";
import Votes from "@/components/votes/page";
import { getQuestion, incrementViews } from "@/utils/actions/question.action";
import { redirect } from "next/navigation";
import ROUTES from "@/routes";
import { readableDate } from "@/utils/readableDate";
import { after } from "next/server";
import AnswerForm from "@/components/answer-form/page";
import QuestionAnswers from "@/components/question-answers/page";
import { auth } from "@/auth";
import { hasVoted } from "@/utils/actions/vote.action";
import StarQuestion from "@/components/icons/star";

export default async function QuestionDetails({ params }){
    const session = await auth()
    const email = session?.user?.email
    const { id } = await params
    const iconSize = 25
    const { success, data: question } = await getQuestion({ questionId: id })
    if(!success || !question){
        redirect(ROUTES.HOME)
    }
    after(async () => {
        await incrementViews({ questionId: id })
    })
    const { author, createdAt, answers, views, tags, description, title, upvotes, downvotes } = question;
    const createdAtText = readableDate(createdAt)
    const { hasVotesSuccess, data } = await hasVoted({
        email,
        id,
        type: "Question"
    })
    return(
        <div>
            <div className="top-h-data">
                <div className="profile-data">
                    <Image className="profile-img" alt="Profile Img" src={author.image} width={35} height={35} />
                    <p>{author.name}</p>
                </div>
                <div className="votes-and-star-preferences">
                    <Votes email={email} id={id} hasVotesSuccess={hasVotesSuccess} data={data} upvotes={upvotes} downvotes={downvotes} type="Question" />
                    <StarQuestion id={id} email={email} />
                </div>
            </div>
            <h3>{title}</h3>
            <div className="statistics">
                <div className="date-container">
                    <AccessTimeIcon 
                     sx={{ color: "#007bff", fontSize: iconSize }}
                    />
                    <p className="date-of-post">{createdAtText}</p>
                </div>
                <div className="answers-container">
                    <QuestionAnswerOutlinedIcon 
                     sx={{ color: "#007bff", fontSize: iconSize }}
                    />
                    <p className="no-of-answers">{answers} answers</p>
                </div>
                <div className="views-container">
                    <VisibilityOutlinedIcon 
                     sx={{ color: "#007bff", fontSize: iconSize }}
                    />
                    <p className="no-of-views">{views} views</p>
                </div>
            </div>
            <br />
            <PreviewDesc content={description}/>
            <br />
            <div className="question-tags">
                {tags.map((tag) => {
                    return(
                        <div className="tags" key={tag._id}>
                            <span className="tag">{tag.name}</span>
                        </div>
                    )
                })}
            </div>
            <br />
            <br />
            <h3>{question.answers} answers</h3>
            <br />
            <QuestionAnswers id={id} params={params} />
            <br />
            {email ? <AnswerForm id={id} email={email}/> : <h3 style={{ textAlign: "center" }}>Signup/Signin now to be able to write answers!</h3>}
       </div>
    )
}