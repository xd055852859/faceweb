import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin, message } from 'antd';
import api from '../../../fetch/api';
import axios from 'axios';
import { FACE_REPORT, FACE_IMGSRC, FACE_IMGFILE, TONGUE_STATE } from '../../../actions/actionTypes';
import './uploadImg.css';
// const Step = Steps.Step;
//需要渲染什么数据
const mapStateToProps = state => ({
    // loading: state.indexpage.loading,
})
const mapDispatchToProps = dispatch => ({
    // getloading: (loading) =>
    //     dispatch({ type: LOADING, loading: loading }),
    setImgSrc: (imgSrc) =>
        dispatch({ type: FACE_IMGSRC, imgSrc: imgSrc }),
    setImgFile: (imgFile) =>
        dispatch({ type: FACE_IMGFILE, imgFile: imgFile }),
    setTongueState: (tongueState) =>
        dispatch({ type: TONGUE_STATE, tongueState: tongueState }),
    setReport: (report) =>
        dispatch({ type: FACE_REPORT, report: report }),
})

class UploadImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadImgArr: ["正面", "面部完整呈现", "无刘海遮挡", "五官清晰", "不带眼镜","图像不宜过小"],
            hidden: true,
            title: '我的照片',
            loading: false
        }
    }
    componentDidMount() {
        //console.log(this.props);
        this.props.setTongueState(0);
    }
    getImage(e) {
        let { history, setImgSrc, setReport } = this.props;
        let that = this;
        // let { title } = this.state;
        // if (title === "") {
        //     message.error("请输入报告标题");
        //     return;
        // }
        this.setState({
            loading: true
        })
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        let config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };
        axios.post(api.APIURL + 'upload/picture', formData, config).then(async res => {
            //console.log(res);
            if (res.data.msg === "OK") {
                setImgSrc(res.data.picPath);
                let imgSrc = res.data.picPath
                let img = new Image();
                img.src = 'https://face2.qingtime.cn/' + imgSrc.replace(/\\/g, '/').replace('/home/work/service/face_node/public/', '');
                console.log("图片地址", img.src);
                img.onload = async function () {
                    let width = img.width;
                    let height = img.height;
                    let reportRes = await api.Face.getReport({
                        'picPath': imgSrc,
                        'userKey': localStorage.getItem('userKey'),
                        'token': localStorage.getItem('TOKEN'),
                        'picHeight': height,
                        'picWidth': width,
                    });
                    if (reportRes.msg == "OK") {
                        that.setState({
                            loading: false
                        })
                        if (reportRes.data.indexOf("Face too small") != -1) {
                            message.error('图像脸部过小，请上传可识别的图片', 5);
                            return;
                        }
                        setReport(reportRes.data);
                        history.push({ pathname: '/report' })
                    } else {
                        that.setState({
                            loading: false
                        })
                        message.error('面部识别有误，请上传可识别的图片', 5);
                    }
                }
            }
        })
        //         // setTitle(title);
        //console.log(e.target.files);
        // const fileReader = new FileReader()
        // fileReader.onload = (e) => {
        //     const dataURL = e.target.result;
        //     setImgFile(dataURL);
        // }
        // fileReader.readAsDataURL(e.target.files[0]);
        // history.push({ pathname: '/cropper' })
        //     }
        //     // } else {
        //     //     alert("请输入完整再提交");
        //     // }
        // })
    }
    render() {
        return (
            <div className="container fullContainer">
                {/* <Steps current={0}>
                    <Step title="上传照片" />
                    <Step title="扫描图片" />
                    <Step title="输出报告" />
                </Steps> */}
                {this.state.loading ? <div className="uploadImg-loading"><Spin size="large" /></div> : false}
                <div className="uploadImg-title">您可选择打开相册或直接拍照</div>
                <div className="uploadImg-bigImg">
                    <img className="uploadImg-bigImg-person" src="http://cdn-icare.qingtime.cn/1548815328635_uploadImg-bigImg-person.png" alt="" />
                    <div className="uploadImg-bigImg-title">照片示例</div>
                </div>
                <div className="uploadImg-item-content">
                    {/* <div className="uploadImg-nameInput"><input onChange={(e) => { this.getName(e) }} name="title" placeholder="请输入标题" className="nameInput" value={this.state.title} /></div> */}
                    <div className="uploadImg-item-title">满足以下要求结果更准确</div>
                    {this.state.uploadImgArr.map((item, index) => {
                        return (<div className="uploadImg-item-info" key={index}>
                            <img className="uploadImg-item-left" src="../../images/uploadImg-item-left.png" alt="" />
                            <div className="uploadImg-item-label">
                                {item}
                            </div>
                            <img className="uploadImg-item-left" src="../../images/uploadImg-item-right.png" alt="" />
                        </div>)
                    })}
                </div>
                <img className="uploadImg-back" src="../../images/backpage.svg" alt="" onClick={() => { this.props.history.push({ pathname: '/' }) }} />
                <div className="button-group uploadImg-button">
                    <label className="uploadImg-button-text">拍照/上传美照<input type="file" accept="image/*" style={{ display: "none" }} onChange={(files) => { this.getImage(files) }} /></label>
                </div>
                <img className="button-image uploadImg-button-image" src="../../images/userInfo-button.png" alt="" />
                {/* <ul className={popState === 0 ? "pop" : popState === 1 ? "pop pop-up" : popState === 2 ? "pop pop-down" : ""}>
                    <li>拍照
                   
                    </li>
                    <li>从手机相册选择</li>
                    <li onClick={() => { this.changePop() }}>取消</li>
                </ul> */}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UploadImg);