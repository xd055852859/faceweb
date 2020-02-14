import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { FACE_IMGSRC, FACE_IMGFILE } from '../../actions/actionTypes';
import './tongueInfo.css';
import api from "../../fetch/api";
// const Step = Steps.Step;
//需要渲染什么数据
const mapStateToProps = state => ({
    // loading: state.indexpage.loading,
})
const mapDispatchToProps = dispatch => ({

})

class TongueInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tongueInfoState: true,
            inquiryQuestions: JSON.parse(localStorage.getItem('inquiryQuestions')),
            loading: false,
            tongueTime: 0,
            timer: 0
        }
    }
    componentDidMount() {
        //console.log(this.props)
        let { inquiryQuestions } = this.state;
        inquiryQuestions.map((item, index) => {
            item.answerArr = item.answerOptions.split(",");
            item.chooseIndex = item.answerArr.indexOf(item.defaultOption)
            return item
        })
        //console.log(inquiryQuestions);
        this.setState({
            inquiryQuestions: inquiryQuestions,
            userName: localStorage.getItem('nickName')
        })
    }
    chooseItem(index, optionIndex) {
        let { inquiryQuestions } = this.state;
        inquiryQuestions[index].chooseIndex = optionIndex;
        this.setState({
            inquiryQuestions: inquiryQuestions
        })
    }

    async getReport() {
        localStorage.setItem('inquiryQuestions', JSON.stringify(this.state.inquiryQuestions));
        let that = this;
        let { history } = this.props;
        let newArr = this.state.inquiryQuestions.map((item, index) => {
            return {
                answerCode: item.answerArr[item.chooseIndex],
                questionIndex: item.questionIndex
            }
        })
        let res = await api.Face.submitAnswer({
            token: localStorage.getItem('TOKEN'),
            outId: localStorage.getItem('outId'),
            answerArr: newArr
        })
        if (res.msg === "OK") {
            that.setState({
                loading: true,
                tongueTime: res.data + 1
            })
            let newTime = res.data + 1;
            this.timer = setInterval(async () => {
                if (newTime === 0) {
                    clearInterval(that.timer);
                    let tongueResult = await api.Face.tongueResult({
                        token: localStorage.getItem('TOKEN'),
                        outId: localStorage.getItem('outId')
                    })
                    if (tongueResult.msg === "OK") {
                        // //console.log("定时器", timer, clearInterval);
                        localStorage.setItem('tongueReport', JSON.stringify(tongueResult.result));
                        that.setState({
                            loading: false
                        })
                        history.push({ pathname: '/tongueReport' });
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
        let { inquiryQuestions, tongueInfoState, loading, tongueTime } = this.state;
        return (
            <div className="container fullContainer" id="tongueInfo">
                {loading ?
                    <div className="loading">
                        <div className="loading-container">
                            <img className="loading-img" src="./images/loading.gif" alt="" />
                            <div className="loading-text">正在加载数据</div>
                            <div className="loading-text">请稍等{tongueTime}秒~</div>
                        </div>
                    </div>
                    : null}
                <div className="tongueInfo-title">根据您最近三个月的体验和感觉，是否有以下症状：</div>
                <div className="tongueInfo-info">
                    {
                        inquiryQuestions.map((item, index) => {
                            return (<div className="tongueInfo-container" key={index}>
                                <div className="tongueInfo-container-title">{item.questionIndex}.{item.questionContent}</div>
                                <div className="tongueInfo-container-info">
                                    {item.answerArr
                                        ? item.answerArr.map((optionItem, optionIndex) => {
                                            return (
                                                <div className="tongueInfo-item-info" key={optionIndex} onClick={() => { this.chooseItem(index, optionIndex) }}>
                                                    <div className="tongueInfo-item-label" style={item.chooseIndex === optionIndex ? { color: '#fff' } : null}>
                                                        {optionItem}
                                                    </div>
                                                    <img className="tongueInfo-item-bg" src={item.chooseIndex === optionIndex ? "../../images/chooseItem.svg" : "../../images/unchooseItem.svg"} alt="" />
                                                </div>)
                                        }) : null}
                                </div>
                            </div>)
                        })}
                </div>
                <img className="tongueInfo-back" src="../../images/backpage.svg" alt="" onClick={() => { this.props.history.push({ pathname: '/uploadTongueImg' }) }} />
                {!tongueInfoState ?
                    <React.Fragment>
                        <div className="untongueInfo-button-text button-group uploadImg-button">查看报告</div>
                        <img className="button-image uploadImg-button-image" src="../../images/unchoose.svg" alt="" />
                    </React.Fragment> :
                    <React.Fragment>
                        <div className="tongueInfo-button-text button-group uploadImg-button" onClick={() => { this.getReport() }}>查看报告</div>
                        <img className="button-image uploadImg-button-image" src="../../images/userInfo-button.png" alt="" />
                    </React.Fragment>}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TongueInfo);