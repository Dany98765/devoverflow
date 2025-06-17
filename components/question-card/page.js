"use client"

import "./styles.css"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from "react";

export default function QuestionCard({ id, title, description, tags, author, createdAt, upvotes, answers, views }) {
    const [expanded, setExpanded] = useState(false);
    const iconColor = "#007bff"
    return(
        <div className="question-card">
            <div className="author-and-date">
                <p>{author}</p>
                <p>{new Date(createdAt).toLocaleDateString()}</p>
            </div>
            <h2>{title}</h2>
            <p className={expanded ? 'desc' : 'description'}>{description}</p>
            <a href="#" className="desc-length-adjust" onClick={() => setExpanded(!expanded)}>{expanded ? 'See less' : 'See more'}</a>
            <div className="tags">
                {tags.map((tag, index) => (
                    <span className="tag" key={index}>{tag}</span>
                ))}
            </div>
            <div className="question-statistics">
                <div className="question-upvotes">
                    <ThumbUpIcon 
                    sx={{ color: iconColor }}/>
                    <p>{upvotes}</p>
                </div>
                <div className="question-answers">
                    <QuestionAnswerIcon 
                    sx={{ color: iconColor }}/>
                    <p>{answers}</p>
                </div>
                <div className="question-views">
                    <VisibilityIcon 
                    sx={{ color: iconColor }}/>
                    <p>{views}</p>
                </div>
            </div>
            <button className="view-question-button">View Question</button>
        </div>
    )
}