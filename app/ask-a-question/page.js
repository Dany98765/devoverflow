"use client";

import "./styles.css";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import QuestionTags from "@/components/question-tags/page";

const QuestionEditor = dynamic(() => import("@/components/question-editor/page"), {
  ssr: false,
});

export default function AskAQuestion() {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionTitleError, setQuestionTitleError] = (true)
  const editorRef = useRef();

  function handleTitleSubmission(e){
    if (newValue.length <= 30) {
      setQuestionTitle(e.target.value)
    }else{
      setQuestionTitle(questionTitle)
      setQuestionTitleError("Cannot Exceed 30 charcaters!")
    }
  }

  const handleSubmit = () => {
    const markdown = editorRef.current?.getMarkdown?.();
    console.log("Title:", questionTitle);
    console.log("Description:", markdown);
  };

  return (
    <div>
      <h1>Ask a question</h1>
      <br />
      <div className="question-form">
        <div className="question-title-container">
          <h3>Question Title</h3>
          <input
            type="text"
            className="title-field"
            placeholder="Enter your question's title"
            onChange={questionTitle.length > 30 ? undefined : handleTitleSubmission}
            error={questionTitleError}
            helperText={questionTitleError}
            value={questionTitle}
          />
          <h5>Be specific and imagine you are asking this question to another person face-to-face.</h5>
        </div>
        <br />
        <div className="question-description-container">
          <h3>Question Description</h3>
          <QuestionEditor editorRef={editorRef} initialMarkdown=""/>
          <h5>Introduce the problem and explain it thoroughly in order to facilitate comprehension.</h5>
        </div>
        <br />
        <div>
          <h3>Question Tags</h3>
          <QuestionTags />
          <h5>Enter tags to help people find your question by topics corresponding to it.</h5>
        </div>
        <br />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}