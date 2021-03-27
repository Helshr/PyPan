import LoadingImg from '../../assets/m1.gif'

const Loading = ({ }) => {
    return (
        <div style={{textAlign: "center"}}>
            <span style={{margin: "0 auto", marginTop: "300px"}}><img src={LoadingImg} style={{width: "70px", height: "70px"}}/></span>
        </div>

    )
}

export default Loading