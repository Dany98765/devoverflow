"use client"

import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export default function ThumbUpIconWrapper({ onClickAction }){
    const iconSize = 25
    return(
        <div>
            <ThumbUpIcon 
                sx={{ color: "green", fontSize: iconSize }}
                onClick={onClickAction}
            />
        </div>
    )   
}