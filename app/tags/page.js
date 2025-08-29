import "./styles.css"

import SearchBar from "@/components/search-bar/page";
import TagCard from "@/components/tag-card/page";
import ROUTES from "@/routes";
import { getTags } from "@/utils/actions/tags.action";

export default async function Tags({searchParams}) {
    const { page, pageSize, query, filter } = await searchParams;
    const { success, data, error } = await getTags({
        page: 1,
        pageSize: 15,
        query,
        filter: "popular"
    });
    const { tags } = data || {};
    return (
        <div>
            <h1>Tags Page</h1>
            <br />
            <SearchBar 
            placeholder="Search tags..." 
            route={ROUTES.TAGS}
            />
           <div className="tag-cards">
            {tags?.length > 0 ?
            tags.map(tag => (
            <TagCard 
                key={tag._id}
                id={tag._id}  
                name={tag.name}
                questionCount={tag.questionCount}
            />
            )) : <p>No results found</p>}
           </div>
          
        </div>
    );
}
