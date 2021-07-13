import React, { Component } from 'react';
import { connect } from 'react-redux';
import api from "../../../fetch/api";
import axios from 'axios';
import imgCanvas from "../../../common/drawCanvas";
import analysisReport from '../../../common/analysisReport'
import html2canvas from 'html2canvas'
import uploadFile from "../../../common/upload";
import copy from 'copy-to-clipboard';
import Canvas2Image from 'canvas2image'
import './report.css';
import { FACE_IMGSRC, FACE_REPORT, FACE_REPORTID } from '../../../actions/actionTypes';

import { message, Tooltip } from 'antd';
//需要渲染什么数据
const mapStateToProps = state => ({
    report: state.face.report,
    imgSrc: state.face.imgSrc,
    reportId: state.face.reportId
})
const mapDispatchToProps = dispatch => ({
    setReport: (report) =>
        dispatch({ type: FACE_REPORT, report: report }),
    setImgSrc: (imgSrc) =>
        dispatch({ type: FACE_IMGSRC, imgSrc: imgSrc }),
    setReportId: (reportId) =>
        dispatch({ type: FACE_REPORTID, reportId: reportId }),
})
class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            reportArr: [],
            viewWidthArr: ["500px", "500px"],
            viewHeightArr: ["500px", "500px"],
            name: '',
            reportId: 0,
            faceImg: '',
            reportNameArr: ["面形", "眉形", "眼形", "鼻形", "嘴形"],
            reportEnNameArr: [],
            markNameArr: ["面型", "上停", "中停", "下停", "眉毛", "眼睛", "鼻子", "嘴巴"],
            markStateArr: ["颜值欠佳", "颜值尚可", "颜值良好", "颜值优秀", "颜值完美"],
            markState: "",
            markNameNum: [],
            markArr: [],
            beautyMark: 0,
            option: '',
            canvasImg: '',
            canvasImgState: false,
            reportImg: '',
            loading: false,
            uptoken: "",
            mimeType: ["image/png", "image/jpeg"],
            miniState: false,
            reportListName: []
        }
    }
    async componentWillMount() {
        let r = window.location.href.split("?reportId=")[1];
        if (r) {
            this.setState({
                reportId: r
            })
        }
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
        }
        // else {
        //     message.error('请登录')
        //     history.push({ pathname: '/bindTel' })
        // }
    }
    async componentDidMount() {
        // //console.log(Canvas2Image);
        let that = this;
        let scaleNum = 1;
        let { location, setReport, setImgSrc, history, setReportId } = this.props
        let userKey = localStorage.getItem('userKey')
        let img = new Image();
        if ((location.query && location.query.reportId) || that.state.reportId) {
            let reportId = that.state.reportId ? that.state.reportId : location.query.reportId;
            console.log("xxx", reportId);
            setReportId(reportId);
            that.setState({
                reportId: reportId
            })
            let res = await api.Face.getReportDetail({ 'resultId': reportId });
            if (res.msg === "OK") {
                let imgSrc = res.data.picPath;
                console.log("res.data.result", res.data.result)
                setReport(res.data.result);
                setImgSrc(imgSrc)
                that.state.height = res.data.picHeight;
                that.state.width = res.data.picWidth;
                img.src = "https://face2.qingtime.cn/" + imgSrc.replace(/\\/g, '/');
                img.setAttribute("crossOrigin", 'Anonymous');
                img.onload = function () {
                    that.getReport(img, img.height * scaleNum, img.width * scaleNum, scaleNum, res.data.result);
                };
            } else {
                message.error(res.msg);
            }
        } else {
            img.src = that.props.imgSrc;
            img.setAttribute("crossOrigin", 'Anonymous');
            img.onload = function () {
                that.getReport(img, img.height * scaleNum, img.width * scaleNum, scaleNum, that.props.report);
            };

        }
    }
    getReport(img, height, width, scaleNum, report) {
        let reportListName = [];
        let imgSrc = img.src
        let reportStrArr = [];
        let reportEnNameArr = [];
        let markArr = [];
        let viewWidthArr = [];
        let viewHeightArr = [];
        console.log("report", this.props.report);
        let reportArr = report.split('x1,x2,y1,y2:');
        reportArr = reportArr.map((item, index) => {
            return 'x1,x2,y1,y2:' + item;
        });
        console.log("reportArr", reportArr);
        reportArr.splice(0, 1);
        reportArr.forEach(async (item, index) => {
            let newArr = item.split('angle_yaw')[0].split('【').splice(1);
            //.split("【").splice(1).split("angle_yaw")[0]
            let newReportArr = newArr.map((item, index) => {
                return item
                    .split('】')[1]
                    .substring(2)
                    .replace(/↵/g, '')
                    .replace(/"/g, '');
            });
            reportStrArr.push(newReportArr);
            reportListName.push(["eye" + index, "eyebrow" + index, "face" + index, "mouth" + index, "nose" + index, "topArea" + index, "middleArea" + index, "bottomArea" + index]);
            reportEnNameArr.push(["face" + index, "eyebrow" + index, "eye" + index, "nose" + index, "mouth" + index]);
            await this.setState({
                reportListName: reportListName,
                reportArr: reportStrArr,
                reportEnNameArr: reportEnNameArr
            }, () => {
                let obj = analysisReport.analysisReport(item, height, width, img, reportListName[index])
                viewWidthArr.push(obj.viewWidth);
                viewHeightArr.push(obj.viewHeight);
                markArr.push(obj.markArr)
            });
            this.setState({
                markArr: markArr,
                viewWidthArr: viewWidthArr,
                viewHeightArr: viewHeightArr,
            })
        })
    }
    async htmlToImg() {
        let { reportId, history } = this.props;
        let { uptoken, mimeType } = this.state;
        let userKey = localStorage.getItem('userKey')
        let that = this;
        this.setState({
            loading: true
        })
        let saveRes = await api.Face.saveImg({ 'token': localStorage.getItem('TOKEN'), 'reportId': reportId, 'userKey': userKey });
        if (saveRes.msg === "OK") {
            that.setState({
                loading: false
            })
            // if (navigator.userAgent.toLowerCase().indexOf('miniprogram') === -1) {
            history.push({ pathname: '/reportImg', query: { 'reportImg': saveRes.reportImg, 'picHeight': saveRes.picHeight, 'picWidth': saveRes.picWidth } })
            // }
            // window.wx.miniProgram.getEnv(function (res) {
            //     if (res.miniprogram) {
            //         window.wx.miniProgram.navigateTo({ url: '/pages/reportImg/reportImg?reportImg=' + saveRes.reportImg + '&picHeight=' + saveRes.picHeight + '&picWidth=' + saveRes.picWidth })
            //     }
            // })
        } else if (saveRes.msg === "报告图片未找到") {
            //绘制图片
            window.scrollTo(0, 0);
            let canvasImgDiv = document.getElementById('canvasImgDiv');
            let reportHtml = document.getElementById('reportHtml');
            //console.log(canvasImgDiv);
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
                // axios.post(api.APIURL + 'upload/picture', formData, config).then(res => {
                uploadFile.uploadImg(imgFile, uptoken, mimeType, async function (url) {
                    //console.log(url);
                    let saveImgRes = await api.Face.saveImg({ 'token': localStorage.getItem('TOKEN'), 'reportId': reportId, 'reportImg': url, 'userKey': userKey });
                    if (saveImgRes.msg === "OK") {
                        that.setState({
                            loading: false
                        })
                        // if (navigator.userAgent.toLowerCase().indexOf('miniprogram') === -1) {

                        history.push({ pathname: '/reportImg', query: { 'reportImg': url } })
                        // }
                        // window.wx.miniProgram.getEnv(function (res) {
                        //     if (res.miniprogram) {
                        //         window.wx.miniProgram.navigateTo({ url: '/pages/reportImg/reportImg?reportImg=' + url })
                        //     }
                        // })
                    }
                })
            })
        }
    }
    // setTitle(title);

    // let res = await api.Face.saveImg({ 'base64String': canvasImg.src });
    // //console.log(res);
    // canvasImgDiv.appendChild(canvasImg);
    // that.setState({
    //     canvasImgState: true
    // })


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
            copy("https://faceview.qingtime.cn/#/report?reportId=" + this.props.reportId);
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
        let { markArr, markNameArr, markNameNum, markState, beautyMark, reportArr, reportNameArr, reportEnNameArr, viewWidthArr, viewHeightArr, canvasImgState, loading, miniState, reportListName } = this.state
        return (
            <div className="container" style={{ backgroundColor: '#fff', height: "auto" }}>
                {loading ?
                    <div className="loading">
                        <div className="loading-container">
                            <img className="loading-img" src="./images/loading.gif" alt="" />
                            <div className="loading-text">正在生成长图</div>
                            <div className="loading-text">请稍等~</div>
                        </div>
                    </div>
                    : null}
                {/* <div className="report-name">{title}</div> */}
                <div className="report-message-container" id="reportHtml" >
                    <img className="report-background" src="http://cdn-icare.qingtime.cn/1548815282118_report-background.png" alt="" />
                    <img className="report-avatar" src={imgSrc} alt="" />
                    <div className="report-message-top">
                        <img className="report-message-top-image" src="./images/home-background-top-image.png" alt="" />
                    </div>
                    <div className="report-message-info">
                        {/* <img className="report-message-info-image" src="http://cdn-icare.qingtime.cn/1548815240826_home-background-info-image.png" alt="" /> */}
                        {/* <div className="report-message-info-text-title">面相概述</div> */}
                        {/* <canvas id="topArea1BackgroundCanvas" className="backgroundCanvas" width={viewWidthArr} height={viewHeightArr}></canvas> */}
                        {reportListName.map((item, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <div className="report-message-info-text">
                                        <div className="report-message-info-text-title">面相概述</div>
                                        <img className="report-message-info-image" src="http://cdn-icare.qingtime.cn/1548815240826_home-background-info-image.png" alt="" />
                                        <div className="report-message-info-text-subtitle">上停</div>
                                        {viewWidthArr.length > 0 ? <div className="report-message-info-canvas" style={{ width: viewWidthArr[index], height: viewHeightArr[index] }}>
                                            <canvas id={reportListName[index][5] + "Canvas"} className="myCanvas" width="600px" height="600px"></canvas>
                                            <canvas id={reportListName[index][5] + "BackgroundCanvas"} className="backgroundCanvas" width="600px" height="600px"></canvas>
                                            <canvas id={reportListName[index][5] + "ImgCanvas"} className="backgroundImage" width="600px" height="600px"></canvas>
                                            {/* <img src={imgSrc} className="backgroundImage" style={{ width: viewWidthArr, height: viewHeightArr }} alt="" /> */}
                                            {/* <div className="coverView" style={{ width: viewWidthArr, height: viewHeightArr }}></div> */}
                                        </div> : null}
                                        <div className="report-message-info-text-info">{reportArr[index][5]}</div>
                                        <div className="report-message-bottom-image">
                                            <div className="leftSrc"></div>
                                            <img className="report-message-line" src="./images/report-message-line.png" alt="" />
                                            <div className="rightSrc" ></div>
                                        </div>
                                        <div className="report-message-info-text-subtitle">中停</div>
                                        {viewWidthArr.length > 0 ? <div className="report-message-info-canvas" style={{ width: viewWidthArr[index], height: viewHeightArr[index] }}>
                                            <canvas id={reportListName[index][6] + "Canvas"} className="myCanvas" width="600px" height="600px"></canvas>
                                            <canvas id={reportListName[index][6] + "BackgroundCanvas"} className="backgroundCanvas" width="600px" height="600px"></canvas>
                                            <canvas id={reportListName[index][6] + "ImgCanvas"} className="backgroundImage" width="600px" height="600px"></canvas>
                                            {/* <img src={imgSrc} className="backgroundImage" style={{ width: viewWidthArr, height: viewHeightArr }} alt="" /> */}
                                            {/* <div className="coverView" style={{ width: viewWidthArr, height: viewHeightArr }}></div> */}
                                        </div> : null}
                                        <div className="report-message-info-text-info">{reportArr[index][6]}</div>
                                        <div className="report-message-bottom-image">
                                            <div className="leftSrc"></div>
                                            <img className="report-message-line" src="./images/report-message-line.png" alt="" />
                                            <div className="rightSrc" ></div>
                                        </div>
                                        <div className="report-message-info-text-subtitle">下停</div>
                                        {viewWidthArr.length > 0 ? <div className="report-message-info-canvas" style={{ width: viewWidthArr[index], height: viewHeightArr[index] }}>
                                            <canvas id={reportListName[index][7] + "Canvas"} className="myCanvas" width="600px" height="600px"></canvas>
                                            <canvas id={reportListName[index][7] + "BackgroundCanvas"} className="backgroundCanvas" width="600px" height="600px"></canvas>
                                            <canvas id={reportListName[index][7] + "ImgCanvas"} className="backgroundImage" width="600px" height="600px"></canvas>
                                            {/* <img src={imgSrc} className="backgroundImage" style={{ width: viewWidthArr, height: viewHeightArr }} alt="" /> */}
                                            {/* <div className="coverView" style={{ width: viewWidthArr, height: viewHeightArr }}></div> */}
                                        </div> : null}
                                        <div className="report-message-info-text-info" style={{ paddingBottom: '0.4rem' }}>{reportArr[index][7]}</div>
                                    </div>
                                    <div className="report-message-info-div" style={{ marginTop: "-0.2rem" }}>
                                        <img className="report-message-leftIcon" src="./images/leftIcon.png" alt="" />
                                        <img className="report-message-rightIcon" src="./images/rightIcon.png" alt="" />
                                        <img className="report-message-info-image" src="http://cdn-icare.qingtime.cn/1548815240826_home-background-info-image.png" alt="" />
                                        <div className="report-message-info-text-title" style={{ marginTop: "0.85rem" }}>面相解读</div>
                                        <div className="report-message-info-text">
                                            <div className="report-message-info-text-subtitle">五行解读</div>
                                            <div className="report-message-info-text-info" style={{ paddingBottom: '0.4rem' }}>{reportArr[index][8]}</div>
                                            <div className="report-message-bottom-image">
                                                <div className="leftSrc"></div>
                                                <img className="report-message-line" src="./images/report-message-line.png" alt="" />
                                                <div className="rightSrc" ></div>
                                            </div>
                                        </div>
                                        <div className="report-message-info-text">
                                            <div className="report-message-info-text-subtitle">情感解读</div>
                                            <div className="report-message-info-text-info" style={{ paddingBottom: '0.4rem' }}>{reportArr[index][9]}</div>
                                            <div className="report-message-bottom-image">
                                                <div className="leftSrc"></div>
                                                <img className="report-message-line" src="./images/report-message-line.png" alt="" />
                                                <div className="rightSrc" ></div>
                                            </div>
                                        </div>
                                        <div className="report-message-info-text">
                                            <div className="report-message-info-text-subtitle">事业解读</div>
                                            <div className="report-message-info-text-info" style={{ paddingBottom: '0.4rem' }}>{reportArr[index][10]}</div>
                                        </div>
                                        {/* <img className="report-message-bottom-image" src="./images/report-message-bottom-image.png" alt="" /> */}




                                    </div>
                                    <div className="report-message-info-div" style={{ marginTop: "-0.2rem", marginBottom: "0.2rem" }}>
                                        <img className="report-message-leftIcon" src="./images/leftIcon.png" alt="" />
                                        <img className="report-message-rightIcon" src="./images/rightIcon.png" alt="" />
                                        <img className="report-message-info-image" src="http://cdn-icare.qingtime.cn/1548815240826_home-background-info-image.png" alt="" />
                                        <div className="report-message-info-text-title" style={{ marginTop: "0.85rem" }}>五官分析</div>
                                        <div className="report-message-info-text-subtitle">五官评分</div>
                                        <div className="report-message-info-mark" >
                                            {markArr.length > 0 ? markNameArr.map((markItem, markIndex) => {
                                                return (
                                                    <Tooltip title={markArr[index][markIndex + 1]} key={markIndex}>
                                                        <div className="report-message-info-mark-div">
                                                            <div className="report-message-info-mark-top">
                                                                <div style={{ height: 100 - (markArr[index][markIndex + 1] ? markArr[index][markIndex + 1] : 0) + "%" }}></div>
                                                            </div>
                                                            <div className="report-message-info-mark-bottom">{markItem}</div>
                                                        </div>
                                                    </Tooltip>)
                                            }) : null}
                                        </div>
                                        <div className="report-message-info-mark-info">
                                            <div className="report-message-info-mark-info-top">
                                                <div><span>颜值评分：</span><span>{markArr.length > 0 ? markArr[index][0] : 0} </span>  <span> 总分100分</span></div>
                                                <div>{markState}</div>
                                            </div>
                                            <div className="report-message-info-mark-info-bottom">
                                                <div style={{ width: beautyMark + "%" }}></div>
                                            </div>
                                        </div>
                                        <div className="report-message-bottom-image">
                                            <div className="leftSrc"></div>
                                            <img className="report-message-line" src="./images/report-message-line.png" alt="" />
                                            <div className="rightSrc" ></div>
                                        </div>
                                        {reportNameArr.map((value, key) => {
                                            return (<div className="report-message-info-text" key={key}>

                                                <div className="report-message-info-text-subtitle">{reportNameArr[key]}</div>
                                                {viewWidthArr.length > 0 ? <div className="report-message-info-canvas" style={{ width: viewWidthArr[index], height: viewHeightArr[index] }}>
                                                    <canvas id={reportEnNameArr[index][key] + "Canvas"} className="myCanvas" width="600px" height="600px"></canvas>
                                                    <canvas id={reportEnNameArr[index][key] + "BackgroundCanvas"} className="backgroundCanvas" width="600px" height="600px"></canvas>
                                                    <canvas id={reportEnNameArr[index][key] + "ImgCanvas"} className="backgroundImage" width="600px" height="600px"></canvas>
                                                    {/* <img src={imgSrc} className="backgroundImage" style={{ width: viewWidthArr, height: viewHeightArr }} alt="" /> */}
                                                    {/* <div className="coverView" style={{ width: viewWidthArr, height: viewHeightArr }}></div> */}
                                                </div> : null}
                                                <div className="report-message-info-text-info" style={key + 1 === reportNameArr.length ? { paddingBottom: '0.5rem' } : null}>{reportArr[index][key]}</div>
                                                {key + 1 !== reportNameArr.length ?
                                                    <div className="report-message-bottom-image">
                                                        <div className="leftSrc"></div>
                                                        <img className="report-message-line" src="./images/report-message-line.png" alt="" />
                                                        <div className="rightSrc" ></div> </div> : null}
                                                {/* <img className="report-message-bottom-image" src="./images/report-message-bottom-image.png" alt="" /> */}
                                            </div>)
                                        })}

                                    </div>
                                </React.Fragment>)
                        })}
                        <div className="report-message-info-div" style={{ marginTop: "-0.2rem" }}>
                            <img className="report-message-leftIcon" src="./images/leftIcon.png" alt="" style={{ top: "-0.85rem" }} />
                            <img className="report-message-rightIcon" src="./images/rightIcon.png" alt="" style={{ top: "-0.85rem" }} />
                            <img className="report-message-info-image" src="http://cdn-icare.qingtime.cn/1548815240826_home-background-info-image.png" alt="" />
                            <div className="report-message-info-text">
                                <div className="report-message-info-text-info">阴阳五行，化生万物。相由心生，境随心转。古人经常从面部特征推算富贵时运。时光科技A小组利用人脸识别等相关技术，结合相关典籍，帮助用户快速解读面相，将传统文化发扬光大。</div>
                            </div>
                        </div>
                    </div>

                    <div className="report-message-bottom">
                        <img className="report-message-top-image" src="./images/home-background-top-image.png" alt="" />
                    </div>
                    {/* <div className="report-message-info-code">
                        <img className="report-message-info-code-img" src="./images/report-message-info-code-img.jpg" alt="" />
                        <div className="report-message-info-code-text">长按二维码获取你的面相报告</div>
                    </div> */}
                </div>
                <div className="report-view">
                    {/* {miniState ? <div className="report-container report-save" onClick={() => { this.htmlToImg() }}>
                        <div className="report-button-view">
                            <div className="report-button">保存长图</div>
                        </div>
                        <img className="report-image" src="./images/report-leftButton.png" alt="" />
                    </div> : null} */}
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
                    <div className="report-message-url-item first-url-item" onClick={() => { window.open("https://yijing.qingtime.cn") }}>
                        <img className="report-message-url-item-image" src="./images/url0.png" alt="" />
                        <div className="report-message-url-item-text">
                            <div className="report-message-url-item-text-title">时光易经</div>
                            {/* <div className="report-message-url-item-text-subtitle">记录成长的每个瞬间</div> */}
                        </div>
                    </div>
                    <div className="report-message-url-item" onClick={() => { window.open("https://ssx.qingtime.cn") }}>
                        <img className="report-message-url-item-image" src="./images/url1.png" alt="" />
                        <div className="report-message-url-item-text">
                            <div className="report-message-url-item-text-title">上上香</div>
                            {/* <div className="report-message-url-item-text-subtitle">记录成长的每个瞬间</div> */}

                        </div>
                    </div>
                    <div className="report-message-url-item" onClick={() => { window.open("https://g.qingtime.cn") }}>
                        <img className="report-message-url-item-image" src="./images/url2.png" alt="" />
                        <div className="report-message-url-item-text">
                            <div className="report-message-url-item-text-title">中华谱库</div>
                            <div className="report-message-url-item-text-subtitle">快速发现你感兴趣的家谱</div>
                            {/* <div className="report-message-url-item-text-info">
                                <div className="report-message-url-item-text-info-button">谱卷攻略</div>
                                <div className="report-message-url-item-text-info-msg">注册获赠18谱券</div>
                            </div> */}
                        </div>
                    </div>
                    <div className="report-message-url-item" onClick={() => { window.open("https://superbible.qingtime.cn") }}>
                        <img className="report-message-url-item-image" src="./images/url2.png" alt="" />
                        <div className="report-message-url-item-text">
                            <div className="report-message-url-item-text-title">时光 姓氏宝典</div>
                            <div className="report-message-url-item-text-subtitle">发现你的姓氏密码</div>

                        </div>
                    </div>
                    {/* <img className="report-message-url-item-wait" src="./images/report-message-url-item-wait.png" alt="" />
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
                    </div> */}
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
)(Report);
