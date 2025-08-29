"use client"

import ThumbDownIcon from '@mui/icons-material/ThumbDown';

export default function ThumbUpIconWrapper({ onClickAction }){
    const iconSize = 25
    return(
        <div>
            <ThumbDownIcon 
                sx={{ color: "red", fontSize: iconSize }}
                onClick={onClickAction}
            />
        </div>
    )   
}