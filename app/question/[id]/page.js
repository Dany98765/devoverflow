export default async function QuestionDetails({params}){
    const {id} = await params
    return(
        <div>
            Question: {id}
        </div>
    )
}