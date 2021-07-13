import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Progress, message } from 'antd';
import api from '../../../fetch/api';
import imgCanvas from "../../../common/drawCanvas";
import { FACE_REPORT, FACE_REPORTID, FACE_UPLOADSTATE } from '../../../actions/actionTypes';
import './scanImg.css';
// const Step = Steps.Step;
//需要渲染什么数据
const mapStateToProps = state => ({
    report: state.face.report,
    imgSrc: state.face.imgSrc,
    imgFullSrc: state.face.imgFullSrc,
    uploadState: state.face.uploadState,
})
const mapDispatchToProps = dispatch => ({
    setReport: (report) =>
        dispatch({ type: FACE_REPORT, report: report }),
    setReportId: (reportId) =>
        dispatch({ type: FACE_REPORTID, reportId: reportId }),
    setUploadState: (uploadState) =>
        dispatch({ type: FACE_UPLOADSTATE, uploadState: uploadState }),
})
class ScanImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            upProcess: 0,
            middleProcess: 0,
            downProcess: 0,
            upState: 'active',
            middleState: 'active',
            downState: 'active',
            viewWidth: 0,
            viewHeight: 0,
            viewTop: 0,
            viewLeft: 0,
            backgroundArr: [],
            buttonState: false,
            reportId: '',
            timer: ''
        }
    }
    componentDidMount() {
        let { uploadState, setReport, imgFullSrc, report, imgSrc, setReportId, history } = this.props;
        if (uploadState) {
            let scanImg = document.getElementById('scanImg');
            // scanImg.play();
            document.addEventListener("WeixinJSBridgeReady", function () {
                scanImg.play();
            }, false);
            let that = this;
            let imgState = false;
            let errorState = false;
            let progressState = false;

            let { width, height } = this.state;
            let faceTop = 0;
            let faceLeft = 0;
            let faceXArr = [];
            let faceYArr = [];
            let scaleNum = 1;
            let img = new Image();
            img.src = imgSrc;
            img.onload = async function () {
                width = img.width;
                height = img.height;
                let res = await api.Face.getReport({
                    'picPath': imgFullSrc,
                    'picHeight': height,
                    'picWidth': width,
                    'userKey': localStorage.getItem('userKey'),
                    'token': localStorage.getItem('TOKEN')
                });

                if (res.msg === "OK") {
                    report = res.data;
                    console.log(report)
                    let angle_yaw = Math.abs(parseFloat(report.split("angle_yaw:")[1].split("↵angle_pitch")));
                    let angle_pitch = Math.abs(parseFloat(report.split("angle_pitch:")[1].split("↵angle_roll")));
                    let angle_roll = Math.abs(parseFloat(report.split("angle_roll:")[1].split("↵age")));
                    if (angle_yaw >= 30 || angle_pitch >= 30 || angle_roll >= 30) {
                        errorState = true;
                        message.error('面部偏转超过30°，为了更准确的评估面相，请重新上传正脸照片', 5);
                        history.push({ pathname: '/uploadImg' })
                    } else {
                        imgState = true;
                        // that.setState({
                        //     width: width,
                        //     height: height
                        // })
                        setReport(res.data);
                        setReportId(res.id);
                        let myImg = document.getElementById('scanDiv');
                        let scanImg = document.getElementById('canvas');
                        if (scanImg) {
                            // const ctx = scanImg.getContext("2d");
                            let imgWidth = parseInt(myImg.offsetWidth);
                            let imgHeight = parseInt(myImg.offsetHeight);

                            //裁剪器官
                            let faceOrgArr = report.split('x1,x2,y1,y2:')[1].split(" ");
                            let faceArr = [faceOrgArr[1], faceOrgArr[2], faceOrgArr[3], parseInt(faceOrgArr[4])];
                            let newFaceData = report.split("landmark72: ")[1];
                            let newFaceArr = newFaceData.replace(/u/g, '').replace('[', '').replace(']', '').replace('↵', '').replace(/ 'x'/g, "'x'").split(', ')
                            //console.log(scaleNum);
                            that.setState({
                                viewWidth: imgHeight,
                                viewHeight: imgHeight,
                                width: imgHeight,
                                height: imgHeight,
                                viewTop: 0,
                                viewLeft: (imgWidth - imgHeight) / 2
                            })
                            scaleNum = imgHeight / width;
                            // ctx.drawImage(img, 0, 0, imgHeight, imgHeight);
                            faceTop = +faceArr[0] * scaleNum;
                            faceLeft = +faceArr[2] * scaleNum;
                            faceXArr = [];
                            faceYArr = [];
                            that.state.backgroundArr = newFaceArr.map((item, index) => {
                                // item = JSON.parse("'"+item.replace(/\"/g,'').replace(/\'/g,"\"")+"'");
                                item = JSON.parse(item.replace(/'/g, "\""));
                                item.x = item.x * scaleNum;
                                item.y = item.y * scaleNum;
                                faceXArr.push(item.x);
                                faceYArr.push(item.y);
                                return item
                            });
                            if (imgState && progressState) {
                                message.success('面部识别成功');
                                that.setState({
                                    buttonState: true
                                })
                                // history.push({ pathname: '/report' })
                            }
                        }
                    }
                } else {
                    errorState = true;
                    message.error('面部识别有误，请上传可识别的图片', 5);
                    history.push({ pathname: '/uploadImg' })
                }
            }
            let upNum = 0;
            let middleNum = 0;
            let downNum = 0;
            that.timer = setInterval(function () {
                if (upNum <= 100) {
                    if (upNum <= 90) {
                        upNum++;
                    }
                    else if (upNum < 100 && upNum > 90) {
                        if (imgState) {
                            upNum++;
                        }
                    } else if (upNum === 100) {
                        upNum++;
                        imgCanvas.DrawCanvas.maxNum([imgSrc, 1, faceXArr, faceYArr, faceTop, faceLeft, width, height, 'face', 0, 0, 0, 0, that, 0, 0]);
                        that.setState({
                            upState: 'success'
                        })
                    }
                } else if (upNum > 100 && middleNum <= 100) {
                    if (middleNum < 100 && upNum > 100) {
                        middleNum++;
                    } else if (middleNum === 100) {
                        imgCanvas.DrawCanvas.maxNum([imgSrc, 1, faceXArr, faceYArr, faceTop, faceLeft, width, height, 'face', 0, 0, 0, 0, that, 0, 1]);
                        middleNum++;
                        that.setState({
                            middleState: 'success'
                        })
                    }
                } else if (middleNum > 100) {
                    if (downNum <= 100 && middleNum > 100) {
                        downNum++;
                    } else if (downNum > 100) {
                        that.setState({
                            downState: 'success'
                        })
                        progressState = true;
                        if (imgState && progressState) {
                            message.success('面部识别成功', 3);
                            that.setState({
                                buttonState: true
                            }, () => {
                                let scanButton = document.getElementById('scanButton');
                                // scanButton.play();
                                document.addEventListener("WeixinJSBridgeReady", function () {
                                    scanButton.play();
                                }, false);
                            })
                            // history.push({ pathname: '/report' })
                        }
                        clearInterval(that.timer);
                    }
                }
                that.setState({
                    upProcess: upNum,
                    middleProcess: middleNum,
                    downProcess: downNum
                })
                if (errorState) {
                    clearInterval(that.timer);
                }
            }, 15);
        }
        else {
            this.props.history.push({ pathname: '/' })
        }
    }
    toReport() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.props.setUploadState(false);
        this.props.history.push({ pathname: '/report' })
        this.setState((state, callback) => {
            return
        })

    }
    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.setState((state, callback) => {
            return
        })
    }
    render() {
        let { upProcess, middleProcess, downProcess, upState, middleState, downState, viewWidth, viewHeight, viewTop, viewLeft, buttonState } = this.state
        let { imgSrc } = this.props
        return (
            <div className="container fullContainer">
                {/* <Steps current={1} labelPlacement="vertical">
                    <Step title="上传照片" />
                    <Step title="扫描图片"/>
                    <Step title="输出报告" />
                </Steps> */}
                <div className="scanImg-image-info">
                    <div className="scanImg-image-info-div" id="scanDiv">
                        <img className="scanImg-image-info-background" src="./images/scanImg-img-info-background.png" alt="" />
                        <div className="scanImg-image-info-background-div" ref="myImg">
                            {!buttonState ? <div className="scanImg-image-info-div-changediv"></div> : null}
                            <canvas id="faceBackgroundCanvas" className="scanImg-backgroundCanvas" width={viewWidth} height={viewHeight} style={{ top: viewTop, left: viewLeft }}></canvas>
                            <canvas id="faceCanvas" className="scanImg-myCanvas" width={viewWidth} height={viewHeight} style={{ top: viewTop, left: viewLeft }}></canvas>
                            <img className="scanImg-image-table" src="./images/scanImg-table.png" alt="" />
                            <img src={imgSrc} id="canvas" className="scanImg-canvas" style={{ width: viewWidth, height: viewHeight, top: viewTop, left: viewLeft }} ref="scanImg" alt="" />
                            {!buttonState ? <img className="scanImg-image-info-div-image" src="./images/scanImg-img-info-view-img.png" alt="" /> : null}
                        </div>
                    </div>
                </div>
                <div className="scanImg-message">
                    {/* <div className="scanImg-tabs">
                        <div className="scanImg-tabs-item ">面相探索</div>
                    </div> */}
                    <div className="scanImg-message-info">
                        <div>人脸识别定位</div>
                        <div className="scanImg-message-bar">
                            <Progress percent={upProcess} status={upState} />
                        </div>
                        <div>五官轮廓分析</div>
                        <div className="scanImg-message-bar">
                            <Progress percent={middleProcess} status={middleState} />
                        </div>
                        <div>生成面相报告</div>
                        <div className="scanImg-message-bar">
                            <Progress percent={downProcess} status={downState} />
                        </div>
                    </div>
                    {!buttonState ? <audio className="scanImg-video" src="./scanImg.mp3" autoPlay="autoplay" loop controls id="scanImg" preload="true" hidden></audio > : null}
                </div>
                {buttonState ?
                    <React.Fragment>
                        <img className="scanImg-back" src="../../images/backpage.svg" alt=""  onClick={()=>{this.props.history.push({ pathname: '/uploadImg' })}}/>
                        <audio className="scanImg-video" src="./scanButton.mp3" autoPlay="autoplay" id="scanButton" preload="true" controls hidden></audio >
                        <div className="scanImg-info-text button-image scanImg-info-button-image" onClick={() => { this.toReport() }}>面相报告解读</div>
                        <img className="button-image scanImg-info-button-image" src="./images/userInfo-button.png" alt="" />
                    </React.Fragment>
                    : null}
            </div>
        );
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScanImg);;
