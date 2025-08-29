import Link from "next/link";
import "./styles.css"
import { tagDesc } from "@/utils/tagDesc"
import ROUTES from "@/routes";

export default function TagCard({ id, name, questionCount }){
    let tagName;
    let tagNameDesc;
    tagDesc.map((tag) => {
        tagName = tag.name
        tagNameDesc = tag.desc
    })

    const regex = new RegExp({name}, "i");
    const tag = tagDesc.find((t) => new RegExp(name, "i").test(t.name));
    return(
        <div className="tag-card-container">
            <div className="name-container">
                <Link href={ROUTES.TAG_DETAILS(id)}>
                    <h3 className="tag-name">{name}</h3>
                </Link>      
            </div>
            <p className="tag-desc">{tag ? tag.desc : `${name} is a powerful programming tool`}</p>
            <div className="question-count-container">
                <p className="question-count-number">{questionCount}+</p>
                <p className="question-count-text">Questions</p>
            </div>
        </div>
    )
}