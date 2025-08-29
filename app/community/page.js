import "./styles.css"
import SearchBar from "@/components/search-bar/page";
import UserCard from "@/components/user-card/page";
import ROUTES from "@/routes";
import { getUsers } from "@/utils/actions/community.action";

export default async function Community({ searchParams }){
    const { page, pageSize, query, filter } = await searchParams;
    
    const { success, data, error } = await getUsers({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query,
        filter,
    });
    
    const { users } = data || {};
    return(
        <div>
            <h1>All Users</h1>
            <br />
            <SearchBar 
            placeholder="Search for Users..."
            route={ROUTES.COMMUNITY} />
            <br />
            <div className="user-cards">
                {users.map((user) => {
                    return <UserCard 
                        key={user._id}
                        id={user._id}
                        image={user.image}
                        name={user.name}
                        username={user.username}
                    />
                })}
            </div>
           
        </div>
    )
}