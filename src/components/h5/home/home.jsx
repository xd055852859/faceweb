import React, { Component } from 'react';
import copy from 'copy-to-clipboard';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import HistoryNav from '../historyNav/historyNav';
import './home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalState: false,
            checkState: true,
            userInfo: {},
            hasUserInfo: false,
            loginState: false
        }
    }
    componentWillMount() {
        let reg = new RegExp("(^|&)token=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r) {
            localStorage.setItem("TOKEN", unescape(r[2]))
        }
        let url = window.location.href;
        // 自动切换为https
        if (url.indexOf("http://localhost") == -1 && url.indexOf("https") < 0) {
            url = url.replace("http:", "https:");
            window.location.replace(url);
        }
    }
    componentDidMount() {
        let { history } = this.props;
        // if (!window.location.search && !localStorage.getItem('userKey')) {
        //     history.push({ pathname: '/bindTel' });
        // }
        if (localStorage.getItem('TOKEN')) {
            this.setState({
                loginState: true
            })
        }
    }
    showModel() {
        let modalState = this.state.modalState;
        this.setState({
            checkState: true,
            modalState: !modalState
        })
    }
    showCheck() {
        let checkState = this.state.checkState;
        this.setState({
            checkState: !checkState
        })
    }
    toHistory() {
        let { history } = this.props;
        history.push({ pathname: '/history' })
    }
    invitePerson() {
        if (navigator.userAgent.toLowerCase().indexOf('miniprogram') === -1) {
            copy("https://faceview.qingtime.cn");
            message.success("复制链接成功");
        }
        window.wx.miniProgram.getEnv(function (res) {
            // //console.log(res);
            if (res.miniprogram) {
                window.wx.miniProgram.navigateTo({ url: '/pages/share/share' })
            }
        })
    }
    logout() {
        let { history } = this.props;
        localStorage.clear();
        this.setState({
            loginState: false
        })
        // history.push({ pathname: '/bindTel' })
    }
    login() {
        const redirect = `${window.location.protocol}//${window.location.host}/`;
        window.location.href = `https://account.qingtime.cn?apphigh=32&redirect=${redirect}&logo=https://faceview.qingtime.cn/images/icon.png`;
    }
    toUrl(url) {
        let { history } = this.props;
        if (localStorage.getItem('TOKEN')) {
            history.push(url)
        } else {
            this.login()
        }
    }
    render() {
        return (
            <div className="container fullContainer">
                <img className="home-background-image" src="http://cdn-icare.qingtime.cn/1548815172330_home-background-image.png" alt="" />
                {this.state.loginState ? <div className="home-nav" onClick={() => { this.toHistory() }} >
                    <HistoryNav type={0} />
                </div> : <div className="home-nav"></div>}
                <div className="home-info">
                    <div className="home-info-container">阴阳五行，化生万物。相由心生，境随心转。古人经常从面部特征推算富贵时运。时光科技AI小组利用人脸识别等相关技术，结合相关典籍，帮助用户快速解读面相，将传统文化发扬光大。
                </div>
                    <div className="home-info-image-container">
                        <div className="home-info-image-info" onClick={() => { this.showModel() }}>
                            <img className="home-info-image-info-image" src="./images/memo.svg" alt="" />
                            <div className="home-info-image-info-text">理论简介</div>
                        </div>
                        <div className="home-info-image-info" onClick={() => { this.invitePerson() }}>
                            <img className="home-info-image-info-image" src="./images/share.svg" alt="" />
                            <div className="home-info-image-info-text">分享</div>
                        </div>
                    </div>
                    {/* <div className="home-background-info-text-warning">
                        <img className="home-background-info-text-warning-image" src='./images/info-text-check-image.png' alt="" />
                        <div>我已阅读并同意<span className="online-text">用户隐私协议</span></div>
                    </div> */}

                </div>
                <div className="home-button">
                    <div className="home-info-text button-left-image home-info-button-image home-info-button">
                        <div className="homeLink" onClick={() => { this.toUrl("/uploadTongueImg") }}> <img className="home-info-tongueButton" src="./images/tongueButton.svg" alt="" />智能舌诊
                        </div>
                    </div>
                    <img className="button-left-image home-info-button-image" src="./images/userInfo-left-button.png" alt="" />
                    <div className="home-info-text button-center-image home-info-button-image">
                        <div className="homeLink" onClick={() => { this.toUrl("/uploadImg") }}> <img className="home-info-tongueButton" src="./images/faceButton.svg" alt="" />面相探索
                        </div>
                    </div>
                    <img className="button-center-image home-info-button-image home-info-right-button" src="./images/userInfo-right-button.png" alt="" />
                    {/* <div className="home-info-text button-right-image home-info-button-image">
                        <Link className="homeLink" to="/uploadHandImg"> <img className="home-info-tongueButton" src="./images/handButton.svg" alt="" />手相探索
                        </Link>
                    </div>
                    <img className="button-right-image home-info-button-image home-info-right-button" src="./images/userInfo-center-button.svg" alt="" /> */}
                </div>
                {this.state.loginState ? <div className="logout" onClick={() => { this.logout() }}>退出登录</div> : <div className="logout" onClick={() => { this.login() }}>登录</div>}
                {this.state.modalState ?
                    <div className="home-background">
                        <div className="home-background-container">
                            <div className="home-background-top">
                                <img className="home-background-top-image" src="./images/home-background-top-image.png" alt="" />
                            </div>
                            <div className="home-background-info">
                                <img className="home-background-info-image" src="http://cdn-icare.qingtime.cn/1548815240826_home-background-info-image.png" alt="" />
                                <div className="home-background-info-text">
                                    <div className="home-background-info-text-title">产品简介</div>
                                    <div className="home-background-info-text-info">
                                        <div className="title">1）相学</div>
                                        <div className="text">相学指的是根据长相、气质、音容笑貌来判断和预知一个人的过去和未来。一切事物都具有时空四维全息性，这是宇宙的法则，也是古人发现的天人合一，万物法一，其理同源。 </div>
                                        <div className="text">面相学构建在阴阳五行理论的基础之上，取法自然，也是几千年来大量前人对各种人体面部特征与人生运势走势之间关系的归纳总结和数理统计结果，也能从当代人体生理学、遗传学中找到立论依据。</div>

                                        <div className="title" style={{ marginTop: '0.1rem' }}>2）舌诊</div>
                                        <div className="text">舌辨五味，中医认为“舌为心之苗”。舌诊是中医的特色，因舌面血管又极其丰富，从舌质的色泽可以看出气血的运行并判断心脏的生理功能。</div>
                                        <div className="text">心的功能正常，则舌体红润，柔软灵敏，语言流利；心的阳气不足，则舌质淡白胖嫩；心的阴血不足，则舌质红绛瘦瘪；心火上炎，则舌尖红，甚至糜烂；心血瘀阻，则舌质紫暗或有瘀斑；心神失常，则舌体强硬，语言障碍等。</div>
                                        <div className="text">中医认为舌面分为四个区域，与五脏六腑相对应：舌尖区属心、肺，舌中部属脾、胃，舌根区属肾，舌的两边属肝、胆，所以舌面具体部位的病变，也可在其他脏腑上考虑病因。总而言之，舌就是反映五脏六腑状况的一面镜子。</div>
                                    </div>
                                    <div className="home-background-info-footer">江苏时光信息科技有限公司</div>
                                    <img className="home-background-button" src="./images/home-background-button.png" alt="" onClick={() => { this.showModel() }} />
                                </div>
                            </div>
                        </div>
                    </div > : null}
            </div >
        );
    }
}

export default Home;