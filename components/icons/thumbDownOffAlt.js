"use client"

import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

export default function ThumbDownOffAltWrapper({ onClickAction }){
    const iconSize = 25
    return(
        <div>
            <ThumbDownOffAltIcon 
                sx={{ color: "red", fontSize: iconSize }}
                onClick={onClickAction}
            />
        </div>
    )   
}