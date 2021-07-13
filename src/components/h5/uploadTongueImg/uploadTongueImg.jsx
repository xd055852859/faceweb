import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FACE_IMGFILE, TONGUE_STATE, TONGUEUP_IMGSRC, TONGUEDOWN_IMGSRC } from '../../../actions/actionTypes';
import api from "../../../fetch/api";
import './uploadTongueImg.css';
import { Input, Radio, message } from 'antd';
// const Step = Steps.Step;
//需要渲染什么数据
const mapStateToProps = state => ({
    tongueUpSrc: state.tongue.tongueUpSrc,
    tongueDownSrc: state.tongue.tongueDownSrc,
    baseUpSrc: state.tongue.baseUpSrc,
    baseDownSrc: state.tongue.baseDownSrc,
    tongueState: state.tongue.tongueState,
})
const mapDispatchToProps = dispatch => ({
    // setTongueDownImgSrc: (tongueDownSrc) =>
    //     dispatch({ type: TONGUEDOWN_IMGSRC, tongueDownSrc: tongueDownSrc }),
    setTongueState: (tongueState) =>
        dispatch({ type: TONGUE_STATE, tongueState: tongueState }),
    // setImgSrc: (imgSrc) =>
    //     dispatch({ type: FACE_IMGSRC, imgSrc: imgSrc }),
    setImgFile: (imgFile) =>
        dispatch({ type: FACE_IMGFILE, imgFile: imgFile }),
    setTongueUpImgSrc: (tongueUpSrc) =>
        dispatch({ type: TONGUEUP_IMGSRC, tongueUpSrc: tongueUpSrc }),
    setTongueDownImgSrc: (tongueDownSrc) =>
        dispatch({ type: TONGUEDOWN_IMGSRC, tongueDownSrc: tongueDownSrc }),
})

class UploadTongueImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            userName: '',
            age: 1,
            sex: 1,
            tongueState: false,
            loading: false,
            tongueTime: 0,
            timer: 0,
            buttonState: true
        }
    }
    componentDidMount() {
    }
    uploadTongueImg(e, state) {
        let { history, setImgFile, setTongueState } = this.props;
        setTongueState(state);
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            const dataURL = e.target.result;
            setImgFile(dataURL);
        }
        fileReader.readAsDataURL(e.target.files[0]);
        history.push({ pathname: '/cropper' })
    }
    changeInput(name, e) {
        this.setState({ [name]: e.target.value })
    }
    async submitPicture() {
        //console.log(this.state.sex);
        let { age, sex, userName } = this.state;
        let that = this;
        this.setState({
            buttonState: false
        })
        let { tongueUpSrc, tongueDownSrc, baseUpSrc, baseDownSrc, history,setTongueUpImgSrc,setTongueDownImgSrc } = this.props
        let res = await api.Face.submitPictures({
            token: localStorage.getItem('TOKEN'),
            userKey: localStorage.getItem('userKey'),
            personName: userName,
            age: parseInt(age),
            sex: sex,
            image: baseUpSrc,
            backImage: baseDownSrc,
            imageQiniu: tongueUpSrc,
            backImageQiniu: tongueDownSrc
        });
        if (res.msg === "OK") {
            //console.log(res.data + 1);
            that.setState({
                loading: true,
                tongueTime: res.data + 1
            })
            let newTime = res.data + 1;
            //console.log(newTime)
            this.timer = setInterval(async () => {
                if (newTime <= 0) {
                    clearInterval(that.timer);
                    let tongueResult = await api.Face.tongueResult({
                        token: localStorage.getItem('TOKEN'),
                        outId: res.outId
                    })
                    if (tongueResult.msg === "OK") {
                        // //console.log("定时器", timer, clearInterval);
                        localStorage.setItem('outId', res.outId);
                        localStorage.setItem('reportName', userName);
                        if (tongueResult.answers) {
                            localStorage.setItem('inquiryQuestions', JSON.stringify(tongueResult.answers));
                            history.push({ pathname: '/tongueInfo' });
                        } else {
                            localStorage.setItem('inquiryQuestions', JSON.stringify([]));
                            localStorage.setItem('tongueReport', JSON.stringify(tongueResult.result));
                            history.push({ pathname: '/tongueReport' });
                        }
                        that.setState({
                            loading: false
                        })

                    } else {
                        message.error(tongueResult.msg);
                    }
                }
                newTime = newTime - 1;
                that.setState({
                    tongueTime: newTime
                })
            }, 1000)
        }
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
        clearInterval(this.timer);
    }
    render() {
        let { tongueUpSrc, tongueDownSrc } = this.props
        let { userName, age, sex, loading, tongueTime, buttonState } = this.state
        return (
            <div className="container tongueImg-container" id="tongueImg">
                {loading ?
                    <div className="loading">
                        <div className="loading-container">
                            <img className="loading-img" src="./images/loading.gif" alt="" />
                            <div className="loading-text">正在加载数据</div>
                            <div className="loading-text">请稍等{tongueTime}秒~</div>
                        </div>
                    </div>
                    : null}
                <div className="tongueImg-info">
                    <div className="tongueImg-title">点击示例图上传舌面图像</div>
                    <div className="tongueImg-div">
                        {!tongueUpSrc ?
                            <React.Fragment>
                                <img className="tongueImg-tongueBg" src="./images/tongueBg.svg" alt="" />
                                <img className="tongueImg-tongueUp" src="./images/tongueUp.png" alt="" />
                                <img className="tongueImg-tongueGif" src="./images/tongueGif.gif" alt="" />
                            </React.Fragment> :
                            <img className="tongueImg-tongueBg" src={tongueUpSrc} alt="" />
                        }
                        <input className="tongueImg-tongueFile" type="file" accept="image/*" onChange={(e) => { this.uploadTongueImg(e, 1) }} />
                    </div>
                </div>
                <div className="tongueImg-info">
                    <div className="tongueImg-title">点击实例图上传舌下络脉</div>
                    <div className="tongueImg-div">
                        {!tongueDownSrc ?
                            <React.Fragment>
                                <img className="tongueImg-tongueBg" src="./images/tongueBg.svg" alt="" />
                                <img className="tongueImg-tongueUp" src="./images/tongueDown.png" alt="" />
                                <img className="tongueImg-tongueGif" src="./images/tongueGif.gif" alt="" />
                            </React.Fragment> :
                            <img className="tongueImg-tongueBg" src={tongueDownSrc} alt="" />
                        }
                        <input className="tongueImg-tongueFile" type="file" accept="image/*" onChange={(e) => { this.uploadTongueImg(e, 2) }} />
                    </div>
                </div>
                <div className="tongueImg-userInfo">
                    <div className="tongueImg-userInfo-title">受检人姓名</div>
                    <Input placeholder="请输入姓名" className="tongueImg-input" onChange={(e) => { this.changeInput('userName', e) }} value={userName} />
                </div>
                <div className="tongueImg-userInfo">
                    <div className="tongueImg-userInfo-title">受检人年龄</div>
                    <Input placeholder="请输入年龄" className="tongueImg-input" onChange={(e) => { this.changeInput('age', e) }} value={age} />
                </div>
                <div className="tongueImg-userInfo">
                    <div className="tongueImg-userInfo-title">受检人性别</div>
                    <Radio.Group onChange={(e) => { this.changeInput('sex', e) }} value={sex}>
                        <Radio.Button value={1}>男</Radio.Button>
                        <Radio.Button value={2}>女</Radio.Button>
                    </Radio.Group>
                </div>
                <div className="tongueImg-memo">
                    <div className="tongueImg-memo-title">满足以下要求结果更准确</div>
                    <div className="tongueImg-memo-info"> 1、拍摄:不要使用美颜相机，使用后置摄像头并正确对焦，由别人拍摄；</div>
                    <div className="tongueImg-memo-info"> 2、舌面图像拍摄伸舌姿势:嘴巴张大，露出舌根，舌体尽量平展伸长，舌尖自然向下，避免伸舌时间过长、过于用力；</div>
                    <div className="tongueImg-memo-info"> 3、舌下络脉拍摄伸舌姿势:嘴巴张大，舌体向上颚方向翘起，舌尖轻抵上颚，避免伸舌时间过长、过于用力；</div>
                    <div className="tongueImg-memo-info"> 4、光线:白天充足、柔和的自然光线下效果最佳，避免背光、偏暗、曝光；</div>
                    <div className="tongueImg-memo-info"> 5、禁忌:不要在食用有色饮食或药物后、有色光源下、早晨起床时、饭后半小时内拍摄舌象。</div>
                </div>
                <div className="tongueImg-bottom-container">
                    <img className="tongueImg-back" src="../../images/backpage.svg" alt="" onClick={() => { this.props.history.push({ pathname: '/' }) }} />
                    {tongueUpSrc && tongueDownSrc && userName && age && buttonState
                        ? <React.Fragment>
                            <div className="tongueImg-info-text button-image tongueImg-info-button-image" onClick={() => { this.submitPicture() }}>开始诊断</div>
                            <img className="button-image tongueImg-info-button-image" src="./images/userInfo-button.png" alt="" />
                        </React.Fragment>
                        : <React.Fragment>
                            <div className="untongueImg-info-text button-image tongueImg-info-button-image">开始诊断</div>
                            <img className="button-image tongueImg-info-button-image" src="./images/unchoose.svg" alt="" />
                        </React.Fragment>
                    }
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UploadTongueImg);