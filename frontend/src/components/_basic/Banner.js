import BannerImg from '../../assets/miao-banner.gif'

const Banner = () => {
    return (
        <div style={{backgroundColor: "rgba(247, 247, 247, 1)"}}>
            <div style={{display: "inline-block", marginLeft: "20%"}}>
                <span style={{fontSize: "45px", color: "black"}}>PyPan</span>
                <br />
                <span style={{fontSize: "25px"}}>私人网盘项目</span>
                <br />
            </div>
            <div style={{display: "inline-block", marginLeft: "2%"}}><img src={BannerImg} style={{width: "400", height: "400px"}}/></div>
        </div>
    )
}


export default Banner
