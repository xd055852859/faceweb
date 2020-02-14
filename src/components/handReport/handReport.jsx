import React, { Component } from 'react';
import { connect } from 'react-redux';
import api from "../../fetch/api";
import axios from 'axios';
import imgCanvas from "../../commen/drawCanvas";
import html2canvas from 'html2canvas'
import copy from 'copy-to-clipboard';
import Canvas2Image from 'canvas2image'
import uploadFile from "../../commen/upload";
import './handReport.css';
import { FACE_REPORT, FACE_IMGSRC, FACE_REPORTID } from '../../actions/actionTypes';

import { message, Tooltip } from 'antd';
//需要渲染什么数据
const mapStateToProps = state => ({
    reportId: state.face.reportId,
    report: state.face.report,
    imgSrc: state.face.imgSrc,
})
const mapDispatchToProps = dispatch => ({
    setReport: (report) =>
        dispatch({ type: FACE_REPORT, report: report }),
    setImgSrc: (imgSrc) =>
        dispatch({ type: FACE_IMGSRC, imgSrc: imgSrc }),
    setReportId: (reportId) =>
        dispatch({ type: FACE_REPORTID, reportId: reportId }),
})
class HandReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportArr: [],
            canvasImg: '',
            canvasImgState: false,
            reportImg: '',
            loading: false,
            uptoken: "",
            reportName: "",
            mimeType: ["image/png", "image/jpeg"],
            miniState: false,
            reportArr: []
        }
    }
    async componentDidMount() {
        let { history } = this.props;
        if (navigator.userAgent.toLowerCase().indexOf('miniprogram') === -1) {
            this.setState({
                miniState: true
            })
        }
        if (localStorage.getItem("TOKEN")) {
            let qiNiuRes = await api.Face.getQiNiuUpToken({
                token: localStorage.getItem("TOKEN"),
                type: 2
            });
            if (qiNiuRes.msg === "OK") {
                this.setState({
                    uptoken: qiNiuRes.result
                })
            }
        } else {
            message.error('请登录')
            history.push({ pathname: '/bindTel' })
        }
    }
    async componentWillMount() {
        let { location, setReport, setImgSrc } = this.props;
        let that = this;
        if (location.query && location.query.reportId) {
            let reportId = location.query.reportId;
            this.setState({
                reportId: reportId
            })
            let handResult = await api.Face.getHandDetail({
                token: localStorage.getItem('TOKEN'),
                resultId: reportId
            })
            if (handResult.msg === "OK") {
                // //console.log("定时器", timer, clearInterval);
                let imgSrc = handResult.data.picPath;
                setReport(handResult.data.result);
                setImgSrc(imgSrc)
                that.getReport();
            } else {
                message.error(handResult.msg);
            }
        } else {
            this.getReport();
        }
    }
    getReport() {
        let that = this;
        let { report } = this.props;
        console.log(report);
        let arr = report.split("【").splice(1);
        let reportArr = arr.map((item, index) => {
            return item.split("】")[1].substring(2).replace(/↵/g, "").replace(/"/g, "");
        });
        this.setState({
            reportArr: reportArr,
        })
    }

    async htmlToImg() {
        let { history, reportId } = this.props;
        let { uptoken, mimeType } = this.state;
        let userKey = localStorage.getItem('userKey')
        let that = this;
        this.setState({
            loading: true
        })
        let saveRes = await api.Face.saveHandImg({ 'token': localStorage.getItem('TOKEN'), 'reportId': reportId, 'userKey': userKey });
        if (saveRes.msg === "OK") {
            that.setState({
                loading: false
            })
            // if (navigator.userAgent.toLowerCase().indexOf('miniprogram') === -1) {
                history.push({ pathname: '/reportImg', query: { 'reportImg': saveRes.reportImg } })
            // }
            // window.wx.miniProgram.getEnv(function (res) {
            //     if (res.miniprogram) {
            //         window.wx.miniProgram.navigateTo({ url: '/pages/reportImg/reportImg?reportImg=' + saveRes.reportImg })
            //     }
            // })
        } else if (saveRes.msg === "报告图片未找到") {
            //绘制图片
            window.scrollTo(0, 0);
            let canvasImgDiv = document.getElementById('canvasImgDiv');
            let reportHtml = document.getElementById('reportHtml');
            html2canvas(reportHtml, {
                useCORS: true,
                scale: 1,
                allowTaint: false,
                width: reportHtml.scrollWidth,
                height: reportHtml.scrollHeight,
                // windowWidth: .scrollWidth,
                // windowHeight: reportHtml.scrollHeight,
                x: 0,
                y: window.pageYOffset,
            }).then(async function (canvas) {
                let canvasImg = Canvas2Image.convertToPNG(canvas);
                let imgFile = imgCanvas.DrawCanvas.dataURLtoFile(canvasImg.src);
                // const formData = new FormData();
                // // 添加要上传的文件
                // formData.append('file', imgFile);
                // formData.append('userKey', userKey);
                // let config = {
                //     headers: { 'Content-Type': 'multipart/form-data' }
                // };
                uploadFile.uploadImg(imgFile, uptoken, mimeType, async function (url) {
                    //console.log(url);
                    let saveImgRes = await api.Face.saveHandImg({ 'token': localStorage.getItem('TOKEN'), 'reportId': reportId, 'reportImg': url, 'userKey': userKey });
                    if (saveImgRes.msg === "OK") {
                        that.setState({
                            loading: false
                        })
                        // if (navigator.userAgent.toLowerCase().indexOf('miniprogram') === -1) {
                        history.push({ pathname: '/reportImg', query: { 'reportImg': url } })
                    }
                })
            })
        }
    }
    // base64编码的图片
    // 这样就会转成一个 图片文件了。
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    toIndex() {
        this.props.history.push({ pathname: '/' })
    }
    invitePerson() {
        if (navigator.userAgent.toLowerCase().indexOf('miniprogram') === -1) {
            copy("https://faceview.qingtime.cn");
            message.success("复制链接成功");
        }
        window.wx.miniProgram.getEnv(function (res) {
            if (res.miniprogram) {
                window.wx.miniProgram.navigateTo({ url: '/pages/share/share' })
            }
        })
    }
    showImg() {
        let canvasImgDiv = document.getElementById('canvasImgDiv');
        canvasImgDiv.innerHTML = "";
        this.setState({ canvasImgState: false })
    }
    shareReport() {
        window.wx.miniProgram.getEnv(function (res) {
            if (res.miniprogram) {
                window.wx.miniProgram.navigateTo({ url: '/pages/share/share' })
            }
        })
    }
    render() {
        let { imgSrc } = this.props
        let { reportArr, canvasImgState, loading, reportName, miniState } = this.state
        //console.log(treatPlanJson);
        return (
            <div className="container" style={{ backgroundColor: "#7492C7", height: "auto" }}  >
                {loading ?
                    <div className="loading">
                        <div className="loading-container">
                            <img className="loading-img" src="./images/loading.gif" alt="" />
                            <div className="loading-text">正在生成长图</div>
                            <div className="loading-text">请稍等~</div>
                        </div>
                    </div>
                    : null}
                <div className="report-message-container" id="reportHtml" >
                    <img className="report-background" src="http://cdn-icare.qingtime.cn/1548815282118_report-background.png" alt="" />
                    <img className="report-avatar" src={imgSrc} alt="" />
                    <div className="report-message-top">
                        <img className="report-message-top-image" src="./images/home-background-top-image.png" alt="" style={{ marginTop: "-0.2rem" }} />
                    </div>
                    <div className="report-message-info">
                        <div className="report-message-info-div" style={{ marginTop: "-0.2rem", marginBottom: "0.2rem" }}>
                            {/* <img className="report-message-leftIcon" src="./images/leftIcon.png" alt="" />
                        <img className="report-message-rightIcon" src="./images/rightIcon.png" alt="" style={{ top: "-0.7rem" }} /> */}
                            <img className="report-message-info-image" src="http://cdn-icare.qingtime.cn/1548815240826_home-background-info-image.png" alt="" />
                            <div className="report-message-info-text-title" style={{ marginTop: "0.3rem" }}>手相概述</div>
                            <div className="report-message-info-text-subtitle">个性解说</div>
                            <div className="report-message-info-text-info">{reportArr[0]}</div>
                            <div className="report-message-bottom-image">
                                <div className="leftSrc"></div>
                                <img className="report-message-line" src="./images/report-message-line.png" alt="" />
                                <div className="rightSrc" ></div>
                            </div>
                            <div className="report-message-info-text-subtitle">情感解说</div>
                            <div className="report-message-info-text-info">{reportArr[1]}</div>
                            <div className="report-message-bottom-image">
                                <div className="leftSrc"></div>
                                <img className="report-message-line" src="./images/report-message-line.png" alt="" />
                                <div className="rightSrc" ></div>
                            </div>
                            <div className="report-message-info-text-subtitle">职业解说</div>
                            <div className="report-message-info-text-info">{reportArr[2]}</div>
                        </div>
                        <div className="report-message-info-div" style={{ marginTop: "-0.2rem" }}>
                            <img className="report-message-leftIcon" src="./images/leftIcon.png" alt="" />
                            <img className="report-message-rightIcon" src="./images/rightIcon.png" alt="" />
                            <img className="report-message-info-image" src="http://cdn-icare.qingtime.cn/1548815240826_home-background-info-image.png" alt="" />
                            <div className="report-message-info-text">
                                <div className="report-message-info-text-info">阴阳五行，化生万物。相由心生，境随心转。古人经常从面部特征推算富贵时运。时光科技A小组利用人脸识别等相关技术，结合相关典籍，帮助用户快速解读面相，将传统文化发扬光大。</div>
                            </div>
                        </div>

                        <div className="report-message-bottom">
                            <img className="report-message-top-image" src="./images/home-background-top-image.png" alt="" style={{ width: "105%" }} />
                        </div>
                    </div>
                </div>
                <div className="report-view">
                    {miniState ? <div className="report-container report-save" onClick={() => { this.htmlToImg() }}>
                        <div className="report-button-view">
                            <div className="report-button">保存长图</div>
                        </div>
                        <img className="report-image" src="./images/report-leftButton.png" alt="" />
                    </div> : null}
                    <div className="report-container report-again" onClick={() => { this.toIndex() }}>
                        <div className="report-button-view">
                            <div className="report-button">再玩一次</div>
                        </div>
                        <img className="report-image" src="./images/report-middleButton.png" alt="" />
                    </div>
                    <div className="report-container report-share" onClick={() => { this.invitePerson() }}>
                        <div className="report-button-view">
                            <div className="report-button">分享给好友</div>
                        </div>
                        <img className="report-image" src="./images/userInfo-left-button.png" alt="" />
                    </div>
                </div>
                <div className="report-message-url">
                    <img className="report-message-url-image" src="http://cdn-icare.qingtime.cn/1548833140128_report-message-url-background.png" alt="" />
                    <div className="report-message-url-item first-url-item">
                        <img className="report-message-url-item-image" src="./images/url1.png" alt="" />
                        <div className="report-message-url-item-text" onClick={() => { window.open("https://f.qingtime.cn") }}>
                            <div className="report-message-url-item-text-title">家庭树</div>
                            <div className="report-message-url-item-text-subtitle">记录成长的每个瞬间</div>
                            <div className="report-message-url-item-text-info">
                                <div className="report-message-url-item-text-info-button">谱卷攻略</div>
                                <div className="report-message-url-item-text-info-msg">注册获赠18谱券</div>
                            </div>
                        </div>
                    </div>
                    <div className="report-message-url-item">
                        <img className="report-message-url-item-image" src="./images/url1.png" alt="" />
                        <div className="report-message-url-item-text" onClick={() => { window.open("https://app.qingtime.cn") }}>
                            <div className="report-message-url-item-text-title">时光宝典</div>
                            <div className="report-message-url-item-text-subtitle">记录成长的每个瞬间</div>
                            <div className="report-message-url-item-text-info">
                                <div className="report-message-url-item-text-info-button">谱卷攻略</div>
                                <div className="report-message-url-item-text-info-msg">注册获赠88谱券</div>
                            </div>
                        </div>
                    </div>
                    <div className="report-message-url-item">
                        <img className="report-message-url-item-image" src="./images/url2.png" alt="" />
                        <div className="report-message-url-item-text" onClick={() => { window.open("https://g.qingtime.cn") }}>
                            <div className="report-message-url-item-text-title">家谱探索</div>
                            <div className="report-message-url-item-text-subtitle">快速发现你感兴趣的家谱</div>
                            <div className="report-message-url-item-text-info">
                                <div className="report-message-url-item-text-info-button">谱卷攻略</div>
                                <div className="report-message-url-item-text-info-msg">注册获赠18谱券</div>
                            </div>
                        </div>
                    </div>
                    <div className="report-message-url-item">
                        <img className="report-message-url-item-image" src="./images/url2.png" alt="" />
                        <div className="report-message-url-item-text" onClick={() => { window.open("https://superbible.qingtime.cn") }}>
                            <div className="report-message-url-item-text-title">时光 姓氏宝典</div>
                            <div className="report-message-url-item-text-subtitle">发现你的姓氏密码</div>
                            <div className="report-message-url-item-text-info">
                                <div className="report-message-url-item-text-info-button">谱卷攻略</div>
                                <div className="report-message-url-item-text-info-msg">注册获赠18谱券</div>
                            </div>
                        </div>
                    </div>
                    <img className="report-message-url-item-wait" src="./images/report-message-url-item-wait.png" alt="" />
                    <div className="report-message-url-item">
                        <img className="report-message-url-item-image" src="./images/url3.png" alt="" />
                        <div className="report-message-url-item-text">
                            <div className="report-message-url-item-text-title">时光 中国祠堂网</div>
                            <div className="report-message-url-item-text-subtitle">网罗全国姓氏祠堂</div>
                        </div>
                    </div>
                    <div className="report-message-url-item">
                        <img className="report-message-url-item-image" src="./images/url4.png" alt="" />
                        <div className="report-message-url-item-text">
                            <div className="report-message-url-item-text-title">时光 中华寻根网</div>
                            <div className="report-message-url-item-text-subtitle">原来你的家人这么多</div>
                        </div>
                    </div>
                    <div className="report-message-url-item">
                        <img className="report-message-url-item-image" src="./images/url5.png" alt="" />
                        <div className="report-message-url-item-text">
                            <div className="report-message-url-item-text-title">时光 基因祖源网</div>
                            <div className="report-message-url-item-text-subtitle">发现基因密码，探索亲情祖源</div>
                        </div>
                    </div>
                    <div className="report-message-url-item">
                        <img className="report-message-url-item-image" src="./images/url6.png" alt="" />
                        <div className="report-message-url-item-text">
                            <div className="report-message-url-item-text-title">时光 中华姓氏源流图</div>
                            <div className="report-message-url-item-text-subtitle">姓氏源流一目了然，原来你的祖先在这里</div>
                        </div>
                    </div>
                </div>

                <div id="canvasImgDiv" className="canvasImgDiv"></div>
                {
                    canvasImgState ?
                        <div className="report-background-button-div">
                            <img className="report-background-button" src="./images/home-background-button.png" alt="" onClick={() => { this.showImg() }} />
                        </div>
                        : null
                }
            </div >
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HandReport);
