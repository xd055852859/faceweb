import React, { Component } from 'react';
import api from "../../fetch/api";
import './historyNav.css';

class HistoryNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            avatar: '',
            total: 0,

        }
    }
    async componentDidMount() {
        let that = this;
        let userKey = '';
        let nickName = '';
        let avatar = '';
        let token = '';
        if (window.location.search || localStorage.getItem('userKey')) {
            if (localStorage.getItem("TOKEN")) {
                let userRes = await api.Face.getUserFullInfo({ token: localStorage.getItem('TOKEN') });
                if (userRes.msg == "OK") {
                    userKey = userRes.result._key;
                    avatar = userRes.result.profile.avatar;
                    nickName = userRes.result.profile.nickName;
                    localStorage.setItem('userKey', userKey);
                    localStorage.setItem('avatar', avatar);
                    localStorage.setItem('nickName', nickName);
                }
            } else {
                if (window.location.search) {
                    userKey = window.location.search.replace('?', '').split('=')[1].split('&')[0];
                    avatar = decodeURI(window.location.search.replace('?', '').split('=')[2].split('&')[0]);
                    nickName = decodeURI(window.location.search.replace('?', '').split('=')[3].split('&')[0]);
                    token = decodeURI(window.location.search.replace('?', '').split('=')[4].split('&')[0]);
                    localStorage.setItem('userKey', userKey);
                    localStorage.setItem('avatar', avatar);
                    localStorage.setItem('nickName', nickName);
                    localStorage.setItem('TOKEN', token);
                } else if (localStorage.getItem('userKey')) {
                    userKey = localStorage.getItem('userKey')
                    avatar = localStorage.getItem('avatar');
                    nickName = localStorage.getItem('nickName');
                }
            }
            let res = await api.Face.getHomeData({ userKey: userKey, token: localStorage.getItem('TOKEN') });
            if (res.msg === "OK") {
                that.setState({
                    total: res.data,
                    avatar: avatar,
                    name: nickName
                })
            }
        }
    }

    render() {
        let { name, avatar, total } = this.state
        let { type } = this.props
        return (
            <div className="report-info" style={type ? { width: "100%", height: "1.5rem", margin: "0.3rem" } : { width: "90%", height: '100%' }}>

                <div className="report-info-div">
                    <img className="report-info-image-time" src="./images/time.png" alt="" />
                    <div className="report-userInfo-message">
                        <div className="report-userInfo-title"> {name.length > 5 ? name.substring(0, 5) + '...' : name} 已获取面相报告</div>
                        <div className="report-userInfo-num">已生成 <span className="report-userInfo-num-span">{total}</span> 份</div>
                    </div>
                    {avatar
                        ? <img className="userinfo-avatar" src={avatar} alt="" />
                        : <img className="userinfo-avatar" src="" alt="" />}
                </div>
                <img className="report-info-image" src="./images/report-image.png" alt="" />
            </div>
        );
    }
}
export default HistoryNav;