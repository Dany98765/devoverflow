import QuestionCard from "@/components/question-card/page";
import { getTagQuestions } from "@/utils/actions/tags.action";
import ROUTES from "@/routes";
import SearchBar from "@/components/search-bar/page";
import FilterButtons from "@/components/filter-buttons/page";
import Tag from "@/database/tags.model";
import logger from "@/utils/logger";

export default async function TagId({ params, searchParams }){
    const { id } = await params;
    const { page, pageSize, query } = await searchParams;
  
    const { success, data, error } = await getTagQuestions({
      tagId: id,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      query,
    });
  
    const { tag, questions } = data || {};
    const tagObject = await Tag.findById(id).lean()
    const tagName = tagObject.name
    return(
        <div>
          <h2>{tagName} tag-realated questions</h2>
          <SearchBar placeholder="Search Questions..." route={ROUTES.HOME} />
          <br />
          <br />
          <FilterButtons />
          <br />
          <br />
          {questions && questions.length > 0 ? (
            questions.map((question) => (
              <QuestionCard
                key={question._id}
                title={question.title}
                description={question.description}
                tags={question?.tags}
                author={question.author?.name || question?.author}
                createdAt={new Date(question.createdAt).toLocaleDateString()}
                upvotes={question.upvotes}
                answers={question.answers}
                views={question.views}
                image={question.author.image}
              />
            ))
          ) : (
            <p>No questions found</p>
          )}
          {/* <h1>{error}</h1> */}
        </div>
    )
}