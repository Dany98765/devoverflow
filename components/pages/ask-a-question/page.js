// "use client";

// import "./styles.css";
// import { useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import QuestionTags from "@/components/question-tags/page";
// import logger from "@/utils/logger";
// import { QuestionTag } from "@/utils/actions/questionTag";

// const QuestionEditor = dynamic(() => import("@/components/question-editor/page"), {
//   ssr: false,
// });

// export default function AskAQuestionPage() {
//   const [tags, setTags] = useState([]);
//   const [questionTitle, setQuestionTitle] = useState("");
//   const [questionDescription, setQuestionDescription] = useState("");
//   const editorRef = useRef();
//   logger.info(editorRef)
//   const borderColor = questionTitle.length > 15 & questionTitle.length < 80 ? "blue" : "red"
//   return (
//     <div>
//       <h1>Ask a question</h1>
//       <br />
//       <form className="question-form" action={QuestionTag}>
//         <div className="question-title-container">
//           <h3>Question Title</h3>
//           <input
//             type="text"
//             name="title"
//             placeholder="Enter your question's title"
//             value={questionTitle}
//             style={{borderColor: borderColor, width: "100%", padding: "16px", borderRadius: "5px"}}
//             onChange={(e) => {
//               const value = e.target.value;
//               if (value.length <= 80 || value.length < questionTitle.length) {
//                 setQuestionTitle(value);
//               }
//             }}
//             required
//           />
//           <h5>Be specific and imagine you are asking this question to another person face-to-face.</h5>
//           {questionTitle.length > 15 && questionTitle.length < 80 ? null : <p style={{color: "red", fontSize: "12px"}}>Make sure your title is greater than 15 charcaters and less than 80 characters</p>}
//         </div>

//         <br />

//         {/* Description */}
//         <div className="question-description-container">
//           <h3>Question Description</h3>
//           <QuestionEditor editorRef={editorRef} initialMarkdown="" setMarkdown={setQuestionDescription} />
//           <input type="hidden" name="description" onChange={(e) => {
//               const value = e.target.value;
//               if (value.length <= 50 || value.length < questionTitle.length) {
//                 setQuestionDescription(value);
//               }
//             }} 
//           value={questionDescription}
//           />
//           <h5>Introduce the problem and explain it thoroughly in order to facilitate comprehension.</h5>
//         </div>

//         <br />

//         {/* Tags */}
//         <div>
//           <h3>Question Tags</h3>
//           <QuestionTags tags={tags} setTags={setTags} name="tags" />
//           <input type="hidden" name="tags" value={JSON.stringify(tags)} />
//           <h5>Enter tags to help people find your question by topics corresponding to it.</h5>
//         </div>

//         <br />

//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   )
// }

"use client";

import "./styles.css";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import QuestionTags from "@/components/question-tags/page";
import { QuestionTag } from "@/utils/actions/questionTag";

const QuestionEditor = dynamic(() => import("@/components/question-editor/page"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
  forwardRef: true,
});

export default function AskAQuestionPage() {
  const [tags, setTags] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const editorRef = useRef(null);

  const borderColor = questionTitle.length > 15 && questionTitle.length < 80 ? "blue" : "red";

  return (
    <div>
      <h1>Ask a question</h1>
      <form className="question-form" action={QuestionTag}>
        {/* Title */}
        <div className="question-title-container">
          <h3>Question Title</h3>
          <input
            type="text"
            name="title"
            placeholder="Enter your question's title"
            value={questionTitle}
            style={{
              borderColor,
              width: "100%",
              padding: "16px",
              borderRadius: "5px",
            }}
            onChange={(e) => setQuestionTitle(e.target.value)}
            required
          />
          <h5>Be specific and imagine you are asking this question to another person.</h5>
          {questionTitle.length <= 15 || questionTitle.length >= 80 ? (
            <p style={{ color: "red", fontSize: "12px" }}>
              Title must be 15-80 characters long.
            </p>
          ) : null}
        </div>

        <br />

        {/* Description */}
        <div className="question-description-container">
          <h3>Question Description</h3>
          <QuestionEditor ref={editorRef} fieldName="description" />
          <h5>Explain your problem clearly and thoroughly.</h5>
        </div>

        <br />

        {/* Tags */}
        <div>
          <h3>Question Tags</h3>
          <QuestionTags tags={tags} setTags={setTags} />
          <input type="hidden" name="tags" value={JSON.stringify(tags)} />
          <h5>Enter tags to help categorize your question.</h5>
        </div>

        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}