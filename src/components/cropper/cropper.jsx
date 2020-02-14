import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import api from "../../fetch/api";
import { message } from 'antd';
import uploadFile from "../../commen/upload";
import { TONGUEUP_IMGSRC, TONGUEDOWN_IMGSRC, TONGUE_STATE, FACE_IMGSRC, FACE_UPLOADSTATE, BASEUP_IMGSRC, BASEDOWN_IMGSRC, HAND_IMGSRC } from '../../actions/actionTypes';
import imgCanvas from "../../commen/drawCanvas";
import "cropperjs/dist/cropper.css"
import Cropper from 'react-cropper'
import './cropper.css';
// const Step = Steps.Step;
//需要渲染什么数据
const mapStateToProps = state => ({
    imgFile: state.face.imgFile,
    tongueState: state.tongue.tongueState,
})
const mapDispatchToProps = dispatch => ({
    // getloading: (loading) =>
    //     dispatch({ type: LOADING, loading: loading }),
    setImgSrc: (imgSrc) =>
        dispatch({ type: FACE_IMGSRC, imgSrc: imgSrc }),
    setUploadState: (uploadState) =>
        dispatch({ type: FACE_UPLOADSTATE, uploadState: uploadState }),
    setTongueUpImgSrc: (tongueUpSrc) =>
        dispatch({ type: TONGUEUP_IMGSRC, tongueUpSrc: tongueUpSrc }),
    setTongueDownImgSrc: (tongueDownSrc) =>
        dispatch({ type: TONGUEDOWN_IMGSRC, tongueDownSrc: tongueDownSrc }),
    setBaseUpImgSrc: (baseUpSrc) =>
        dispatch({ type: BASEUP_IMGSRC, baseUpSrc: baseUpSrc }),
    setBaseDownImgSrc: (baseDownSrc) =>
        dispatch({ type: BASEDOWN_IMGSRC, baseDownSrc: baseDownSrc }),
    setTongueState: (tongueState) =>
        dispatch({ type: TONGUE_STATE, tongueState: tongueState }),
})

class FaceCropper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uptoken: "",
            mimeType: ["image/png", "image/jpeg"]
        }
    }
    async componentDidMount() {
        let { history } = this.props;
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
    }
    uploadImg() {
        let { setImgSrc, setHandImgSrc, history, setUploadState, tongueState, setTongueState, setTongueUpImgSrc, setTongueDownImgSrc, setBaseUpImgSrc, setBaseDownImgSrc } = this.props;
        let { uptoken, mimeType } = this.state;
        if (localStorage.getItem('TOKEN')) {
            let userKey = localStorage.getItem('userKey')
            const croppedCanvas = this.cropper.getCroppedCanvas({
                minWidth: 100,
                minHeight: 200,
                width: 400,
                height: 800,
                maxWidth: 800,
                maxHeight: 800
            });

            if (typeof croppedCanvas === "undefined") {
                return;
            }
            let dataURL = croppedCanvas.toDataURL("image/png");
            let imgFile = imgCanvas.DrawCanvas.dataURLtoFile(dataURL);
            // //console.log(imgFile)
            const formData = new FormData();
            // 添加要上传的文件        
            formData.append('userKey', userKey);
            formData.append('token', localStorage.getItem('TOKEN'));
            // 添加要上传的文件
            let config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (tongueState === 3) {
                formData.append('hand', imgFile);
                axios.post(api.APIURL + 'upload/hand', formData, config).then(res => {
                    console.log(res);
                    if (res.data.msg === "OK") {
                        setImgSrc(res.data.picPath);
                        setUploadState(true);
                        // //console.log("图片地址", res.data.picPath);
                        // setTitle(title);                 
                        history.push({ pathname: '/scanHandImg' })
                    }
                })
            } else {
                formData.append('file', imgFile);
                axios.post(api.APIURL + 'upload/picture', formData, config).then(res => {
                    // //console.log(res);
                    if (res.data.msg === "OK") {
                        setImgSrc(res.data.picPath);
                        setUploadState(true);
                        // //console.log("图片地址", res.data.picPath);
                        // setTitle(title);
                        if (tongueState === 1) {
                            setBaseUpImgSrc(res.data.picPath)
                        } else if (tongueState === 2) {
                            setBaseDownImgSrc(res.data.picPath)
                        } else if (tongueState === 0) {
                            history.push({ pathname: '/scanImg' })
                        }
                    }
                })
            }

            if (tongueState === 1 || tongueState === 2) {
                //七牛上传
                uploadFile.uploadImg(imgFile, uptoken, mimeType, function (url) {
                    // //console.log(url);
                    if (tongueState === 1) {
                        setTongueUpImgSrc(url)
                    } else if (tongueState === 2) {
                        setTongueDownImgSrc(url)
                    }
                    history.push({ pathname: '/uploadTongueImg' })
                })
            }
        } else {
            const redirect = `${window.location.protocol}//${window.location.host}`;
            window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://faceview.qingtime.cn/images/icon.png`;
        }
    }
    render() {
        let { imgFile } = this.props
        return (
            <div className="container cropper-container fullContainer">
                <Cropper
                    style={{ width: "100%", height: "95%" }}
                    aspectRatio={1}
                    // preview=".uploadCrop"
                    guides={true}
                    src={imgFile}
                    ref={cropper => { this.cropper = cropper }}
                />
                {/* <div className="uploadCrop"></div> */}
                <div onClick={() => { this.props.history.push({ pathname: '/uploadImg' }) }} className="backButton">返回</div>
                <div onClick={() => { this.uploadImg() }} className="uploadButton">确定</div>
            </div>
        );
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FaceCropper);