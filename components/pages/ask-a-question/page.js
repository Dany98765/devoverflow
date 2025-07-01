"use client";

import "./styles.css";
import { useState, useTransition, useEffect } from "react";
import dynamic from "next/dynamic";
import QuestionTags from "@/components/question-tags/page";
import { createQuestion, editQuestion } from "@/utils/actions/questionTag";
import AlertMessage from "@/components/alert-message/page";
import { useRouter } from "next/navigation";
import ROUTES from "@/routes";
import { title } from "process";
import logger from "@/utils/logger";

const QuestionEditor = dynamic(() => import("@/components/question-editor/page"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
  forwardRef: true,
});

export default function AskAQuestionPage({ question, isEdit }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [tags, setTags] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [markdown, setMarkdown] = useState(
    typeof initialMarkdown === "string" ? initialMarkdown.trim() : ""
  );
  const handleChange = (value) => {
    setMarkdown(value);
  };
  const isPendingBGColor = isPending ? "#6c757d" : "#007bff"

  let submitLabel;

  if (isEdit){
    if (isPending){
      submitLabel = "Updating Question..."
    } else {
      submitLabel = "Update Question"
    }
  } else{
    if (isPending){
      submitLabel = "Creating Question..."
    } else {
      submitLabel = "Create Question"
    }
  }

  useEffect(() => {
    if (question?.title){
      setQuestionTitle(question.title)
    }
    if (question?.description){
      setMarkdown(question.description)
    }
    if (question?.tags){
      setTags(question.tags)
    }
  }, [question?.title, question?.description, question?.tags])
  if (question?.title === title && question?.description === markdown && question?.tags === tags){
    logger.info("EXACTLY THE SAME!")
  } else{
    logger.info("")
  }
  return (
    <div>
      {question?.title === title && question?.description === markdown && question?.tags === tags ? 
      <AlertMessage 
      status="success"
      message="No fields were updated"/> 
      : null}
      <h1>Ask a question</h1>
      <form className="question-form" action={async (formData) => {
        startTransition(async () => {
          if (isEdit){
            const result = await editQuestion(formData)
            if (result.data){
              logger.info(result.data + ">>>>>>>>>>>>>>>>>?????????????????!!!!!!!!!!!!!!!!")
              router.push(ROUTES.QUESTION_DETAILS(result.data._id))
            }
          } else {
            const result = await createQuestion(formData);
            if (result.data){
              router.push(ROUTES.QUESTION_DETAILS(result.data._id))
            }
          }
        })
      }
      }>
        <div className="question-title-container">
          <h3>Question Title</h3>
          <input
            type="text"
            name="title"
            placeholder="Enter your question's title"
            defaultValue={questionTitle}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "5px",
            }}
            onChange={(e) => setQuestionTitle(e.target.value)}
            required
          />
          <h5>Be specific and imagine you are asking this question to another person.</h5>
          {(questionTitle.length <= 15 || questionTitle.length >= 80) ? (
            <AlertMessage status="error" message="Title must be between 15-80 chracters long!" />
          ) : null}
        </div>
        <br />
        <div className="question-description-container">
          <h3>Question Description</h3>
          <QuestionEditor fieldName="description" markdownProp={markdown} handleChangeProp={handleChange} />
          <input name="description" type="hidden" value={markdown} onChange={handleChange} />
          <h5>Explain your problem clearly and thoroughly.</h5>
          {(markdown.length < 50 || markdown.length > 1000) ? 
          <AlertMessage status="error" message="Description must be between 50-1000 chracters long!" /> : null}
        </div>
        <br />
        <div>
          <h3>Question Tags</h3>
          <QuestionTags tags={tags} setTags={setTags} />
          <input type="hidden" name="tags" value={JSON.stringify(tags)} />
          <h5>Enter tags to help categorize your question.</h5>
        </div>
        <br />
        <input type="hidden" name="questionId" value={question._id} />
        <button type="submit" disabled={isPending ? true : false} className="post-question-button" style={{backgroundColor: isPendingBGColor}}>{submitLabel}</button>
      </form>
    </div>
  );
} 