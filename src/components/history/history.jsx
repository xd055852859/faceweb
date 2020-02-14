import React, { Component } from 'react';
import api from "../../fetch/api";
import HistoryNav from '../historyNav/historyNav';
import { message } from 'antd';
import './history.css';
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}
class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            historyData: [],
            tongueData: [],
            handData: [],
            userData: {},
            page: 1,
            limit: 20,
            scrollState: true,
            loading: true,
            deleteState: false,
            deleteKey: 0,
            deleteIndex: 0,
            historyType: 0,
            faceTotal: 0,
            tongueTotal: 0,
            handTotal: 0
        }
    }
    componentWillMount() {
        window.scrollTo(0, 0);
    }
    componentDidMount() {
        this.getData();
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
    handleScroll(e, type) {
        let scrollT = document.body.scrollTop || document.documentElement.scrollTop;
        let scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        let { page, scrollState } = this.state
        console.log(scrollT + windowHeight)
        console.log(scrollHeight);
        console.log(scrollState)
        if (scrollT + windowHeight + 10 > scrollHeight && scrollState) {
            this.setState({
                page: page + 1
            }, () => {
                this.getData()
            })
        }
    }
    async deleteReport() {
        let { deleteKey, deleteIndex, historyData, deleteType, tongueData, handData, faceTotal,
            tongueTotal,
            handTotal } = this.state
        let that = this;
        if (deleteType === 0) {
            let res = await api.Face.deleteReport({
                'token': localStorage.getItem('TOKEN'),
                'recordIdArr': [deleteKey],
            })
            if (res.msg === "OK") {
                message.success('面相报告删除成功');
                historyData.splice(deleteIndex, 1);
                faceTotal = faceTotal < 2 ? 0 : faceTotal - 1;
                this.setState({
                    historyData: historyData,
                    faceTotal: faceTotal
                })
            } else {
                message.error(res.msg);
            }
        } else if (deleteType === 1) {
            let res = await api.Face.deleteTongueReport({
                'recordIdArr': [deleteKey],
                'token': localStorage.getItem('TOKEN')
            })
            if (res.msg === "OK") {
                message.success('舌象报告删除成功');
                tongueData.splice(deleteIndex, 1);
                tongueTotal = tongueTotal < 2 ? 0 : tongueTotal - 1;
                this.setState({
                    tongueData: tongueData,
                    tongueTotal: tongueTotal
                })
            } else {
                message.error(res.msg);
            }
        } else if (deleteType === 2) {
            let res = await api.Face.deleteHandReport({
                'recordIdArr': [deleteKey],
                'token': localStorage.getItem('TOKEN')
            })
            if (res.msg === "OK") {
                message.success('手相报告删除成功');
                handData.splice(deleteIndex, 1);
                handTotal = handTotal < 2 ? 0 : handTotal - 1
                this.setState({
                    handData: handData,
                    handTotal: handTotal
                })
            } else {
                message.error(res.msg);
            }
        }

    }
    async getData() {
        let that = this;
        let { page, limit, historyData, tongueData, handData, historyType } = this.state;
        this.setState({
            loading: true
        })
        let obj = {
            token: localStorage.getItem('TOKEN'),
            userKey: localStorage.getItem('userKey'), page: page, limit: limit
        }
        if (historyType === 0) {
            let res = await api.Face.getHistoryList(obj);
            if (res.msg === "OK") {
                if (res.data.length > 0) {
                    res.data.forEach((item, index) => {
                        item.filePath = "https://face2.qingtime.cn/" + item.filePath.replace(/\\/g, '/');
                        // item.filePath = app.globalData.URL + "/" + item.filePath.replace(/\\/g, '/');
                        historyData.push(item);
                    })
                    that.setState({
                        historyData: historyData,
                        faceTotal: res.totals,
                        tongueTotal: res.tongueNum,
                        handTotal: res.handNum
                    });
                    if (res.data.length < 20) {
                        window.removeEventListener('scroll', this.handleScroll.bind(this));
                        that.setState({
                            scrollState: false
                        });
                    }
                }
                that.setState({
                    loading: false
                });
            }
        } else if (historyType === 1) {
            let res = await api.Face.getTongueList(obj);
            if (res.msg === "OK") {
                if (res.data.length > 0) {
                    res.data.forEach((item, index) => {
                        tongueData.push(item);
                    })
                    that.setState({
                        tongueData: tongueData
                    });
                    if (res.data.length < 20) {
                        window.removeEventListener('scroll', this.handleScroll.bind(this));
                        that.setState({
                            scrollState: false
                        });
                    }
                }
                that.setState({
                    loading: false
                });
            }
        } else if (historyType === 2) {
            let res = await api.Face.getHandList(obj);
            if (res.msg === "OK") {
                if (res.data.length > 0) {
                    res.data.forEach((item, index) => {
                        item.filePath = "https://face2.qingtime.cn/" + item.filePath.replace(/\\/g, '/');
                        // item.filePath = app.globalData.URL + "/" + item.filePath.replace(/\\/g, '/');
                        handData.push(item);
                    })
                    that.setState({
                        handData: handData
                    });
                    if (res.data.length < 20) {
                        window.removeEventListener('scroll', this.handleScroll.bind(this));
                        that.setState({
                            scrollState: false
                        });
                    }
                }
                that.setState({
                    loading: false
                });
            }
        }
    }
    chooseTab(type) {
        this.setState({
            historyType: type,
            historyData: [],
            tongueData: [],
            handData: [],
            page: 1,
            scrollState: true
        }, () => {
            this.getData();
        })
    }
    toReport(id) {
        this.props.history.push({ pathname: '/report', query: { reportId: id } })
    }
    toTongueReport(id) {
        this.props.history.push({ pathname: '/tongueReport', query: { reportId: id } })
    }
    toHandReport(id) {
        this.props.history.push({ pathname: '/handReport', query: { reportId: id } })
    }
    render() {
        let { historyData, tongueData, handData, loading, deleteState, historyType, faceTotal, tongueTotal, handTotal } = this.state;
        return (
            <div className="container history-container" id="historyReport">
                {loading ?
                    <div className="loading">
                        <div className="loading-container">
                            <img className="loading-img" src="./images/loading.gif" alt="" />
                            <div className="loading-text">正在加载数据</div>
                            <div className="loading-text">请稍等~</div>
                        </div>
                    </div>
                    : null}
                <React.Fragment>
                    <HistoryNav type={1} />
                    <div className="historyTab">
                        <div className="tabItem" onClick={() => { this.chooseTab(0) }}><div className={historyType === 0 ? "tabItem-active" : ""}>面相报告({faceTotal})</div></div>
                        <div className="tabItem" onClick={() => { this.chooseTab(1) }}><div className={historyType === 1 ? "tabItem-active" : ""}>舌象报告({tongueTotal})</div></div>
                        <div className="tabItem" onClick={() => { this.chooseTab(2) }}><div className={historyType === 2 ? "tabItem-active" : ""}>手相报告({handTotal})</div></div>
                    </div>
                    <div className="waterfall">
                        {historyType === 0 ?
                            historyData.length === 0 ?
                                <div className="history-empty" >
                                    <img src="./images/empty.png" className="history-empty-image" alt="" />
                                    <div className="history-text">您还没有测过面相和舌象或手相哦</div>
                                    <div className="history-text">快去上传照片试试吧</div>
                                </div>
                                : historyData.map((item, index) => {
                                    return (
                                        <div className="item"
                                            onClick={() => { this.toReport(item._key) }}
                                            key={index}>
                                            <img src={item.filePath} className="item-content" alt="" />
                                            <div className="deleteIcon" onClick={(e) => {
                                                e.stopPropagation();
                                                e.nativeEvent.stopImmediatePropagation();
                                                this.setState({ deleteState: true, deleteKey: item._key, deleteIndex: index, deleteType: 0 })
                                            }}>
                                                <img src="./images/delete.svg" alt="" />
                                            </div>
                                        </div>
                                    )
                                }) : historyType === 1 ?
                                tongueData.length === 0 ?
                                    <div className="history-empty" >
                                        <img src="./images/empty.png" className="history-empty-image" alt="" />
                                        <div className="history-text">您还没有测过面相和舌象或手相哦</div>
                                        <div className="history-text">快去上传照片试试吧</div>
                                    </div>
                                    : tongueData.map((item, index) => {
                                        return (
                                            <div className="item"
                                                onClick={() => { this.toTongueReport(item.outId) }}
                                                key={index}>
                                                <img src={item.imageQiniu} className="item-content" alt="" />
                                                <div className="deleteIcon" onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.nativeEvent.stopImmediatePropagation();
                                                    this.setState({ deleteState: true, deleteKey: item.outId, deleteIndex: index, deleteType: 1 })
                                                }}>
                                                    <img src="./images/delete.svg" alt="" />
                                                </div>
                                                <div className="tongueUsername">{item.personName}</div>
                                            </div>
                                        )
                                    }) : historyType === 2 ?
                                    handData.length === 0 ?
                                        <div className="history-empty" >
                                            <img src="./images/empty.png" className="history-empty-image" alt="" />
                                            <div className="history-text">您还没有测过面相和舌象或手相哦</div>
                                            <div className="history-text">快去上传照片试试吧</div>
                                        </div>
                                        : handData.map((item, index) => {
                                            return (
                                                <div className="item"
                                                    onClick={() => { this.toHandReport(item._key) }}
                                                    key={index}>
                                                    <img src={item.filePath} className="item-content" alt="" />
                                                    <div className="deleteIcon" onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.nativeEvent.stopImmediatePropagation();
                                                        this.setState({ deleteState: true, deleteKey: item._key, deleteIndex: index, deleteType: 2 })
                                                    }}>
                                                        <img src="./images/delete.svg" alt="" />
                                                    </div>
                                                </div>
                                            )
                                        }) : null}
                    </div>
                    <div className="history-bottom-container">
                        <div className="history-info-text button-image history-info-button-image" onClick={() => { this.props.history.push({ pathname: '/' }) }}>返回</div>
                        <img className="button-image history-info-button-image" src="./images/userInfo-button.png" alt="" />
                    </div>
                </React.Fragment>
                {deleteState ?
                    <div className="bgHistory" onClick={() => { this.setState({ deleteState: false }) }}>
                        <div className="deleteDiv">
                            <div className="deleteButton" onClick={() => { this.deleteReport() }}>删除记录</div>
                            <div className="cancelButton">取消</div>
                        </div>
                    </div>
                    : null
                }
            </div>
        );
    }
}

export default History;