export function readableDate(createdAt){
    const today = new Date();
    const currentdDay = today.getDate();         // Day of the month (1-31)
    const currentMonth = today.getMonth() + 1;  // Months are 0-indexed (0 = Jan, so +1)
    const currentYear = today.getFullYear();   // Full year (e.g. 2025)

    const createdAtReadable = new Date(createdAt)
    const dayOfPost = createdAtReadable.getDate() 
    const monthOfPost = createdAtReadable.getMonth() + 1
    const yearOfPost = createdAtReadable.getFullYear() 

    if (yearOfPost > currentYear){
        return `Asked ${yearOfPost - currentYear} year(s) ago`
    } else if (yearOfPost == currentYear && monthOfPost < currentMonth){
        return `Asked ${currentMonth - monthOfPost} month(s) ago`
    }
    if (monthOfPost - currentMonth >= 2){
        return `Asked ${monthOfPost - currentMonth} month(s) ago.`
    } else if (monthOfPost == currentMonth && currentdDay > dayOfPost){
        return `Asked ${currentdDay - dayOfPost} day(s) ago`
    } else if (monthOfPost != currentMonth){
        
    }
    if (currentdDay == dayOfPost){
         return "Asked a few hours ago"
    }
    return "Unhandled case!"
}
// SOLVE FOR LATER!!!