export default function QuestionDetails({params}){
    const {id} = params
    return(
        <div>
            Question: {params.id}
        </div>
    )
}