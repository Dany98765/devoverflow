"use client"

import "./styles.css"
import ThumbUpIconWrapper from "../icons/thumpUp";
import ThumbUpOffAltIconWrapper from "../icons/thumbUpOffAlt";
import ThumbDownIconWrapper from "../icons/thumbDown";
import ThumbDownOffAltIconWrapper from "../icons/thumbDownOffAlt";
import { handleVoteAction } from "@/utils/actions/vote.action";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import logger from "@/utils/logger";
import { set } from "mongoose";
import AlertMessage from "../alert-message/page";

export default function Votes({ email, id, data, upvotes, downvotes, type }) {
    const [voted, setVoted] = useState(data || { hasUpvoted: false, hasDownvoted: false })
    const [voteCounts, setVoteCounts] = useState({ upvotes, downvotes })
    const [clicked, setClicked] = useState(false)
    useEffect(() => {
        setVoted(data || { hasUpvoted: false, hasDownvoted: false })
        setVoteCounts({ upvotes, downvotes })
    }, [data, upvotes, downvotes])

    const handleVote = async (voteType) => {
        setClicked(true)
        const { success } = await handleVoteAction({
            email,
            id,
            type,
            voteType
        })
        if (!success) return;

        if (voteType === "upvotes") {
            if (voted.hasUpvoted) {
                // remove upvote
                setVoteCounts(prev => ({
                    ...prev,
                    upvotes: prev.upvotes - 1
                }))
                setVoted({ hasUpvoted: false, hasDownvoted: false })
            } else {
                setVoteCounts(prev => ({
                    ...prev,
                    upvotes: prev.upvotes + 1,
                    downvotes: voted.hasDownvoted ? prev.downvotes - 1 : prev.downvotes
                }))
                setVoted({ hasUpvoted: true, hasDownvoted: false })
            }
        } else if (voteType === "downvotes") {
            if (voted.hasDownvoted) {
                // remove downvote
                setVoteCounts(prev => ({
                    ...prev,
                    downvotes: prev.downvotes - 1
                }))
                setVoted({ hasUpvoted: false, hasDownvoted: false })
            } else {
                setVoteCounts(prev => ({
                    ...prev,
                    downvotes: prev.downvotes + 1,
                    upvotes: voted.hasUpvoted ? prev.upvotes - 1 : prev.upvotes
                }))
                setVoted({ hasUpvoted: false, hasDownvoted: true })
            }
        }
    }
    return (
        <div className="optional-preferences">
            <div className="upvote-container">
                {clicked && <AlertMessage status="error" message="You have to be authenticated in order to gain privilege to vote!"/>}
                {voted?.hasUpvoted
                    ? <ThumbUpIconWrapper onClickAction={() => handleVote("upvotes")} />
                    : <ThumbUpOffAltIconWrapper onClickAction={() => handleVote("upvotes")} />
                }
                <p style={{ backgroundColor: "#48494B", color: "white", padding: "0 7px" }}>
                    {voteCounts.upvotes}
                </p>
            </div>
            <div className="downvote-container">
                {voted?.hasDownvoted
                    ? <ThumbDownIconWrapper onClickAction={() => handleVote("downvotes")} />
                    : <ThumbDownOffAltIconWrapper onClickAction={() => handleVote("downvotes")} />
                }
                <p style={{ backgroundColor: "#48494B", color: "white", padding: "0 7px" }}>
                    {voteCounts.downvotes}
                </p>
            </div>
           
        </div>
    )
}
