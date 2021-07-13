import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Progress, message } from 'antd';
import api from '../../../fetch/api';
import imgCanvas from "../../../common/drawCanvas";
import { FACE_REPORT, FACE_REPORTID, FACE_UPLOADSTATE } from '../../../actions/actionTypes';
import './scanHandImg.css';
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
class ScanHandImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            upProcess: 0,
            middleProcess: 0,
            downProcess: 0,
            handProcess: 0,
            upState: 'active',
            middleState: 'active',
            downState: 'active',
            handState: 'active',
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
            let img = new Image();
            img.src = imgSrc;
            img.onload = async function () {
                width = img.width;
                height = img.height;
                let res = await api.Face.getHandReport({
                    'picPath': imgFullSrc,
                    'picHeight': height,
                    'picWidth': width,
                    'userKey': localStorage.getItem('userKey'),
                    'token': localStorage.getItem('TOKEN')
                });

                if (res.msg === "OK") {
                    report = res.data;
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
                        //console.log(scaleNum);
                        that.setState({
                            viewWidth: imgHeight,
                            viewHeight: imgHeight,
                            width: imgHeight,
                            height: imgHeight,
                            viewTop: 0,
                            viewLeft: (imgWidth - imgHeight) / 2
                        })
                        if (imgState && progressState) {
                            message.success('手相识别成功');
                            that.setState({
                                buttonState: true
                            })
                            // history.push({ pathname: '/report' })
                        }
                    }
                }

            }
            let upNum = 0;
            let middleNum = 0;
            let downNum = 0;
            let handNum = 0;
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
                        that.setState({
                            upState: 'success'
                        })
                    }
                } else if (upNum > 100 && middleNum <= 100) {
                    if (middleNum < 100 && upNum > 100) {
                        middleNum++;
                    } else if (middleNum === 100) {
                        middleNum++;
                        that.setState({
                            middleState: 'success'
                        })
                    }
                } else if (middleNum > 100 && downNum <= 100) {
                    if (downNum < 100 && middleNum > 100) {
                        downNum++;
                    } else if (downNum === 100) {
                        downNum++;
                        that.setState({
                            downState: 'success'
                        })
                    }
                } else if (downNum > 100) {
                    if (handNum <= 100 && downNum > 100) {
                        handNum++;
                    } else if (handNum > 100) {
                        that.setState({
                            handState: 'success'
                        })
                        progressState = true;
                        if (imgState && progressState) {
                            message.success('手相识别成功', 3);
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
                    downProcess: downNum,
                    handProcess: handNum
                })
                if (errorState) {
                    clearInterval(that.timer);
                }
            }, 15);

        } else {
            this.props.history.push({ pathname: '/' })
        }
    }
    toReport() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.props.setUploadState(false);
        this.props.history.push({ pathname: '/handReport' })
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
        let { upProcess, middleProcess, downProcess, handProcess, upState, middleState, downState, handState, viewWidth, viewHeight, viewTop, viewLeft, buttonState } = this.state
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
                        <div>感情线解析</div>
                        <div className="scanImg-message-bar">
                            <Progress percent={upProcess} status={upState} />
                        </div>
                        <div>智慧线解析</div>
                        <div className="scanImg-message-bar">
                            <Progress percent={middleProcess} status={middleState} />
                        </div>
                        <div>生命线解析</div>
                        <div className="scanImg-message-bar">
                            <Progress percent={downProcess} status={downState} />
                        </div>
                        <div>事业线解析</div>
                        <div className="scanImg-message-bar">
                            <Progress percent={handProcess} status={handState} />
                        </div>
                    </div>
                    {!buttonState ? <audio className="scanImg-video" src="./scanImg.mp3" autoPlay="autoplay" loop controls id="scanImg" preload="true" hidden></audio > : null}
                </div>
                {buttonState ?
                    <React.Fragment>
                        <audio className="scanImg-video" src="./scanButton.mp3" autoPlay="autoplay" id="scanButton" preload="true" controls hidden></audio >
                        <div className="scanImg-info-text button-image scanImg-info-button-image" onClick={() => { this.toReport() }}>手相报告解读</div>
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
)(ScanHandImg);;
