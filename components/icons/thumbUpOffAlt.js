"use client"

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

export default function ThumbUpOffAltWrapper({ onClickAction }){
    const iconSize = 25
    return(
        <div>
            <ThumbUpOffAltIcon 
                sx={{ color: "green", fontSize: iconSize }}
                onClick={onClickAction}
            />
        </div>
    )   
}