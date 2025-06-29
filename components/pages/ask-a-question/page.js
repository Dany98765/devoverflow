// "use client";

// import "./styles.css";
// import { useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import QuestionTags from "@/components/question-tags/page";

// const QuestionEditor = dynamic(() => import("@/components/question-editor/page"), {
//   ssr: false,
// });

// export default function AskAQuestion() {
//   const [tags, setTags] = useState([]);
//   const [questionTitle, setQuestionTitle] = useState("");
//   const [questionContent, setQuestionContent] = useState("");
//   const editorRef = useRef();

//   const handleSubmit = () => {
//     const markdown = editorRef.current?.getMarkdown?.();
//     console.log("Title:", questionTitle);
//     console.log("Description:", markdown);
//   };

//   return (
//     <div>
//       <h1>Ask a question</h1>
//       <br />
//       <div className="question-form">
//         <div className="question-title-container">
//           <h3>Question Title</h3>
//           <input
//             type="text"
//             name="title"
//             className="title-field"
//             placeholder="Enter your question's title"
//             onChange={(e) => {
//               const newValue = e.target.value;
//               if (newValue.length <= 5 || newValue.length < questionTitle.length) {
//                 setQuestionTitle(newValue);
//               }
//             }}
//             value={questionTitle}
//           />
//           <h5>Be specific and imagine you are asking this question to another person face-to-face.</h5>
//         </div>
//         <br />
//         <div className="question-description-container">
//           <h3>Question Description</h3>
//           <QuestionEditor editorRef={editorRef} initialMarkdown=""/>
//           <h5>Introduce the problem and explain it thoroughly in order to facilitate comprehension.</h5>
//         </div>
//         <br />
//         <div>
//           <h3>Question Tags</h3>
//           <QuestionTags tags={tags} setTags={setTags} name="tags"/>
//           <h5>Enter tags to help people find your question by topics corresponding to it.</h5>
//         </div>
//         <br />
//         <button onClick={handleSubmit}>Submit</button>
//       </div>
//     </div>
//   );
// }
"use client";

import "./styles.css";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import QuestionTags from "@/components/question-tags/page";
import logger from "@/utils/logger";
import { QuestionTag } from "@/utils/actions/questionTag";

const QuestionEditor = dynamic(() => import("@/components/question-editor/page"), {
  ssr: false,
});

export default function AskAQuestionPage() {
  const [tags, setTags] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const editorRef = useRef();
  logger.info(editorRef)
  const borderColor = questionTitle.length > 15 & questionTitle.length < 80 ? "blue" : "red"
  return (
    <div>
      <h1>Ask a question</h1>
      <br />
      <form className="question-form" action={QuestionTag}>
        <div className="question-title-container">
          <h3>Question Title</h3>
          <input
            type="text"
            name="title"
            placeholder="Enter your question's title"
            value={questionTitle}
            style={{borderColor: borderColor, width: "100%", padding: "16px", borderRadius: "5px"}}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 80 || value.length < questionTitle.length) {
                setQuestionTitle(value);
              }
            }}
            required
          />
          <h5>Be specific and imagine you are asking this question to another person face-to-face.</h5>
          {questionTitle.length > 15 && questionTitle.length < 80 ? null : <p style={{color: "red", fontSize: "12px"}}>Make sure your title is greater than 15 charcaters and less than 80 characters</p>}
        </div>

        <br />

        {/* Description */}
        <div className="question-description-container">
          <h3>Question Description</h3>
          <QuestionEditor editorRef={editorRef} initialMarkdown="" setMarkdown={setQuestionDescription} />
          <input type="hidden" name="description" onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 50 || value.length < questionTitle.length) {
                setQuestionTitle(value);
              }
            }} />
          <h5>Introduce the problem and explain it thoroughly in order to facilitate comprehension.</h5>
        </div>

        <br />

        {/* Tags */}
        <div>
          <h3>Question Tags</h3>
          <QuestionTags tags={tags} setTags={setTags} name="tags" />
          <input type="hidden" name="tags" value={JSON.stringify(tags)} />
          <h5>Enter tags to help people find your question by topics corresponding to it.</h5>
        </div>

        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
