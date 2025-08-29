"use client";

import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/utils/url-params";

export default function SearchBar({ placeholder, route }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, route, searchParams, pathname]);
    return(
        <div>
            <TextField
                type="search"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                variant="outlined"
                InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#007bff" }} />
                </InputAdornment>
                ),
                }}
            />
        </div>
    )
}