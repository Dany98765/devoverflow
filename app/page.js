import LogoutButton from "@/components/logout-button/page";
import SearchBar from "@/components/search-bar/page";
import ROUTES from "@/routes";
import FilterButtons from "@/components/filter-buttons/page";
import QuestionCard from "@/components/question-card/page";
import logger from "@/utils/logger";
import Link from "next/link";
import { getQuestions } from "@/utils/actions/question.action";
import "./globals.css";
import { auth } from "@/auth";


export default async function Home({ searchParams }) {
  const session = await auth()
  const email = session?.user?.email
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { questions } = data || {};

  const filtered = query
    ? questions.filter((q) => q.title.toLowerCase().includes(query.toLowerCase()))
    : questions;
  return (
    <div>
      <div className="ask-question-section">
        <Link href={ROUTES.ASK_A_QUESTION} className="ask-question-button">
          <button className="ask-question-button">Ask a Question</button>
        </Link>
      </div>
      <h2>All Questions</h2>
      <SearchBar placeholder="Search Questions..." route={ROUTES.HOME} />
      <br />
      <br />
      <FilterButtons />
      <br />
      {session?.user && <LogoutButton />}
      <br />
      {questions && questions.length > 0 ? (
        questions.map((question) => (
          <QuestionCard
            key={question._id}
            id={question._id}
            title={question.title}
            description={question.description}
            tags={question?.tags}
            author={question.author?.name || question?.author}
            createdAt={new Date(question.createdAt).toLocaleDateString()}
            upvotes={question.upvotes}
            downvotes={question.downvotes}
            answers={question.answers}
            views={question.views}
            image={question.author?.image || null}
            email={email}
          />
        ))
      ) : (
        <p>No questions found</p>
      )}
      <h1>{error}</h1>
    </div>
  );
}