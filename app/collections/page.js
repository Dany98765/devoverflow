import { auth } from "@/auth";
import Modal from "@/components/modal/page";
import QuestionCard from "@/components/question-card/page";
import SearchBar from "@/components/search-bar/page";
import ROUTES from "@/routes";
import { getSavedQuestions } from "@/utils/actions/collection.action";
import logger from "@/utils/logger";

export default async function Collections({ searchParams }) {
    const { query } = await searchParams
    const session = await auth()
    const email = session?.user?.email
    const { success, data } = await getSavedQuestions({
        email,
        query
    }) 
    let savedQuestions;
    if (success){
        savedQuestions = data
    }
    return (
        <div>
            <h1>Your Collections</h1>
            <br />
            <SearchBar 
                placeholder="Search Questions..."
                route={ROUTES.COLLECTIONS}
            />
            <br />
            {success ? savedQuestions?.map((question) => (
                <QuestionCard
                    key={question.question._id}
                    id={question.question._id}
                    title={question.question.title}
                    description={question.question.description}
                    tags={question.question.tags}
                    author={question.question.author.name}
                    createdAt={new Date(question.question.createdAt).toLocaleDateString()}
                    upvotes={question.question.upvotes}
                    downvotes={question.question.downvotes}
                    answers={question.question.answers}
                    views={question.question.views}
                    image={question.question.author.image || null} 
                    email={email}
                />
            )) : <h1>An error interupted the action!</h1>}
            {!data ? "No questions were saved to collections!" : ""}
            {!email && <Modal title="You are unauthorized from viewing the collections tab!" message="You have to be authenticated in order to be able to save and view questions!"/>}
        </div>
    );
}