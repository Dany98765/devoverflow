"use client"

import "./styles.css"
import Image from "next/image"
import { useEffect, useState, useTransition } from "react";
import QuestionEditor from "../question-editor/page";
import AlertMessage from "../alert-message/page";
import { createAnswer } from "@/utils/actions/answer.action";
import logger from "@/utils/logger";

export default function AnswerForm({ id, email }) {
    let [result, setResult] = useState({status: "", message: ""})
    const [isPending, startTransition] = useTransition()
    const [markdown, setMarkdown] = useState("");
    const handleChange = (value) => {
        setMarkdown(value);
    };
    useEffect(() => {
        logger.info(result)
    }, [result])
    return (
        <div>
           {result.status !== "" ? 
            <AlertMessage 
            status={result.status}
            message={result.message}
            /> : null}
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                startTransition(async () => {
                    let response = await createAnswer(id, formData, email);
                    if (response.success){
                        setResult({status: "success", message: "Your answer has been successfully created!"})
                    } else{
                        result = "error"
                        setResult({status: "error", message: `An error has occured while creating answer: ${response.message}!`})
                    }

                });
            }}>
                <div className="horizontal-elements">
                    <h3>Write your answer here</h3>
                    <button className="ai-answer-button" type="button">
                        <Image 
                        src="/star.png"
                        alt="star"
                        width={12}
                        height={12}/> Generate AI Answer
                    </button>
                </div>
                <br />
                <QuestionEditor fieldName="description" markdownProp={markdown} handleChangeProp={handleChange} />
                <input type="hidden" name="description" value={markdown} />
                {markdown.length > 0 ? <p style={{ color: "rgb(211,211,211)" }}>Characters count: {markdown.length}/1000</p> : null}
                {((markdown.length > 0 && markdown.length < 50) || markdown.length > 1000) ? 
                <AlertMessage status="error" message="Answer must be between 50-1000 characters long!" /> : null}
                <br />
                <br />
                <button className="answer-question-button" type="submit">
                    {isPending ? "Publishing Answer..." : "Publish Answer"}
                </button>
            </form>
        </div>
    )
}
