"use client"

import "./styles.css"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/routes";
import { isSavedToCollection } from "@/utils/actions/collection.action";
import StarQuestion from "../icons/star";
import AlertMessage from "../alert-message/page";

export default function QuestionCard(props) {
  const { id, title, createdAt, description, tags, author, upvotes, downvotes, answers, views, image, email } = props;

  const [starred, setStarred] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);

  const iconColor = "#007bff";

  const checkIfSavedToCollection = async () => {
    if (!email) {
      setChecked(true); // still mark check done
      return;
    }
    const { success, questionSavedInCollection } = await isSavedToCollection({ id, email });
    if (success && questionSavedInCollection) {
      setStarred(true);
    }
    setChecked(true);
  };

  useEffect(() => {
    checkIfSavedToCollection();
  }, []);

  return (
    <div className="question-card">
      {error && <AlertMessage status="error" message={error} />}
      
      <div className="author-and-date">
        <div>
          {image ? (
            <Image
              className="profile-img"
              alt="Profile Img"
              src={props.image || null}
              width={35}
              height={35}
            />
          ) : (
            <img
              alt="Profile Img"
              src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
              width={35}
              height={35}
              style={{ borderRadius: "50%" }}
            />
          )}
          <p>{typeof author === "string" ? author : author?.name || "Unknown Author"}</p>
        </div>
        <div>
          <div className="star">
            {checked && (
              <StarQuestion
                id={id}
                email={email}
                starred={starred}
                setStarred={setStarred}
                refreshCollection={checkIfSavedToCollection}
                setError={setError}
              />
            )}
          </div>
          <p>{createdAt}</p>
        </div>
      </div>

      <h2>{title}</h2>

      <p className={expanded ? "desc" : "description"}>{description}</p>
      <a href="#" className="desc-length-adjust" onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }}>
        {expanded ? "See less" : "See more"}
      </a>

      <div className="tags">
        {tags?.map((tag, index) => (
          <span className="tag" key={index}>{tag.name}</span>
        ))}
      </div>

      <div className="question-statistics">
        <div className="question-upvotes">
          <ThumbUpIcon sx={{ color: iconColor }} />
          <p>{upvotes}</p>
          <ThumbDownIcon sx={{ color: iconColor }} />
          <p>{downvotes}</p>
        </div>
        <div className="question-answers">
          <QuestionAnswerIcon sx={{ color: iconColor }} />
          <p>{answers}</p>
        </div>
        <div className="question-views">
          <VisibilityIcon sx={{ color: iconColor }} />
          <p>{views}</p>
        </div>
      </div>

      <Link href={ROUTES.QUESTION_DETAILS(id)}>
        <button className="view-question-button">View Question</button>
      </Link>
    </div>
  );
}
