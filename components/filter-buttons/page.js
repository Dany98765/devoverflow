"use client";

import { formUrlQuery, removeKeysFromUrlQuery } from "@/utils/url-params";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function FilterButtons() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const filter = searchParams.get("filter") || "";
    const [selectedFilter, setSelectedFilter] = useState(filter);
    const enabledColor = "#007bff";
    const disabledColor = "#48494B";
    const filterColor = selectedFilter === "filter" ? enabledColor : disabledColor;
    const recommendedQColor = selectedFilter === "recommended-questions" ? enabledColor : disabledColor;
    const frequentColor = selectedFilter === "frequent" ? enabledColor : disabledColor;
    const unansweredColor = selectedFilter === "unanswered" ? enabledColor : disabledColor; 
    function handleFilterChange(value) {
        let newUrl = ""
        setSelectedFilter(value);
        if (value === filter){
            // If the filter is already selected, remove it from the URL
            newUrl = removeKeysFromUrlQuery({
                params: searchParams.toString(),
                keysToRemove: ["filter"]
            });
            router.push(newUrl, { scroll: false });
            setSelectedFilter("");
            return;
        }
        else {
            newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "filter",
            value: value
        })}
        router.push(newUrl, { scroll: false });
    }
    return(
        <div className="filter-buttons">
            <button className="filter" onClick={(e) => handleFilterChange("filter")} style={{backgroundColor: filterColor, marginRight: "10px", marginBottom: "20px", height: "30px", width: "80px", borderRadius: "5px", border: "none", outline: "none", color: "white"}}>Filter</button>
            <button className="filter" onClick={(e) => handleFilterChange("recommended-questions")} style={{backgroundColor: recommendedQColor, marginRight: "10px", marginBottom: "20px", height: "30px", width: "150px", borderRadius: "5px", border: "none", outline: "none", color: "white"}}>Recommended Qs</button>
            <button className="filter" onClick={(e) => handleFilterChange("frequent")} style={{backgroundColor: frequentColor, marginRight: "10px", marginBottom: "20px", height: "30px", width: "80px", borderRadius: "5px", border: "none", outline: "none", color: "white"}}>Frequent</button>
            <button className="filter" onClick={(e) => handleFilterChange("unanswered")} style={{backgroundColor: unansweredColor, marginRight: "10px", marginBottom: "20px", height: "30px", width: "90px", borderRadius: "5px", border: "none", outline: "none", color: "white"}}>Unanswered</button>
        </div>
    )
}