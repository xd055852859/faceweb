import React, { Component } from 'react';
import { Input, message } from 'antd';
import api from "../../fetch/api";
import './bindTel.css';

class BindTel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            code: '',
            codeState: false,
            num: 60, //倒计时，
            password: '',
            buttonState: 0,
            rewritePassword: ''
        }
    }
    getInput(e) {
        const { name, value } = e.target;
        this.setState((prevState) => {
            prevState[name] = value;
            return prevState
        })
    }
    async sendVercode(e) {
        let that = this;
        let { mobile, num } = this.state;
        var re = new RegExp(/^\s*$/);
        var re1 = new RegExp(/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/);
        if (re.test(mobile)) {
            message.error('手机号码不能为空');
            return;
        } else if (!re1.test(mobile)) {
            message.error('请输入正确的手机号码');
            return;
        }
        this.setState({
            codeState: true,
            codeViewState: true
        })
        let res = await api.Face.getCode({
            'mobileArea': '+86',
            'mobile': mobile,
            'source': 2
        })
        if (res.msg === "OK") {
            that.timer = setInterval(function () {
                if (num < 2) {
                    num = 60;
                    that.setState({
                        codeState: false,
                        num: num
                    })
                    clearInterval(that.timer);
                } else {
                    num--;
                    that.setState({
                        num: num,
                    })
                }
            }, 1000)
        }
    }
    async bindMobile() {
        let { history } = this.props;
        let { mobile, password, code } = this.state
        let re = new RegExp(/^\s*$/);

        if (re.test(code)) {
            message.error('验证码不能为空');
            return;
        } else if (code.length !== 4) {
            message.error('请输入正确的验证码');
            return;
        }
        // let res = await api.Face.regist({ mobile, password, code });

        let res = await api.Face.bindTel({
            'mobileArea': '+86',
            'mobile': mobile,
            'password': password,
            'code': code,
            'profile': '',
            'app': 17
        })
        if (res.msg === "OK") {
            // //console.log(res);
            message.success('注册成功');
            localStorage.setItem('userKey', res.data._key);
            localStorage.setItem('avatar', './images/defaultAvatar.png');
            localStorage.setItem('nickName', mobile);
            history.push({ pathname: '/' });
        } else {
            message.error(res.msg);
        }
    }
    async login() {
        let { mobile, password } = this.state;
        let { history } = this.props;
        if (!/^[0-9]+$/.test(mobile)) {
            message.error("请输入正确的手机号码");
            return;
        }
        if (!/^[a-zA-Z0-9]{6,18}$/.test(password)) {
            message.error("请输入数字或字母组成的6-18位密码");
            return;
        }
        let res = await api.Face.login(mobile, password);
        if (res.msg === "OK") {
            // //console.log(res);
            localStorage.setItem("TOKEN", res.token);
            localStorage.setItem('userKey', res._key);
            localStorage.setItem('avatar', res.profile.avatar ? res.profile.avatar : './images/defaultAvatar.png');
            localStorage.setItem('nickName', res.profile.nickName ? res.profile.nickName : res.profile.trueName ? res.profile.trueName : res.mobile);
            history.push({ pathname: '/' });
            message.success("登录成功");
        } else {
            message.error(res.msg);
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    render() {
        let { mobile, code, codeState, num, password, buttonState, rewritePassword } = this.state
        return (
            <div className="container" style={{ paddingTop: "0.20rem", boxSizing: "border-box", position: "relative" }}>
                <div className="bindtel-title">
                    <img src="./images/icon.png" className="bindtel-logo" alt="" />
                </div>
                <div className="bindtel-container">
                    <div className="bindtel-image">
                        <img src="./images/tel.png" className="bindtel-icon" style={{ height: "0.43rem", width: "0.23rem" }} alt="" />
                    </div>
                    <Input onChange={(e) => { this.getInput(e) }} placeholder="请输入手机号" type="number" value={mobile} name="mobile" className="mobileInput" />
                </div>
                <div className="bindtel-container">
                    <div className="bindtel-image">
                        <img src="./images/lock.png" className="bindtel-icon" style={{ height: "0.40rem", width: "0.37rem" }} alt="" />
                    </div>
                    <Input onChange={(e) => { this.getInput(e) }} placeholder="请输入密码" value={password} type="password" name="password" className="mobileInput" />
                </div>

                {buttonState === 1 ?
                    <div className="bindtel-container">
                        <div className="bindtel-image">
                            <img src="./images/code.png" className="bindtel-icon" style={{ height: "0.40rem", width: "0.37rem" }} alt="" />
                        </div>
                        <Input onChange={(e) => { this.getInput(e) }} placeholder="请输入验证码" maxLength={4} type="number" value={code} name="code" className="codeInput" />
                        <div className={"code-button" + (codeState ? " sendCode" : "")} onClick={!codeState ? (e) => { this.sendVercode(e) } : null}>
                            {codeState ? '已发送验证码(' + num + ')' : '验证'}
                        </div>
                    </div> : null}
                {buttonState === 2 ?
                    <div className="bindtel-container">
                        <div className="bindtel-image">
                            <img src="./images/code.png" className="bindtel-icon" style={{ height: "0.40rem", width: "0.37rem" }} alt="" />
                        </div>
                        <Input onChange={(e) => { this.getInput(e) }} placeholder="请再次输入密码" value={rewritePassword} type="password" name="rewritePassword" className="mobileInput" />
                    </div>
                    : null}
                {buttonState === 0 ? <div className="button-group binTel-text-button">
                    <div className="binTel-info-text" onClick={() => { this.login() }}>登录</div>
                </div> : null}
                {buttonState === 1 ? <div className="button-group binTel-text-button">
                    <div className="binTel-info-text" onClick={() => { this.bindMobile() }}>绑定手机号</div>
                </div> : null}
                {buttonState === 2 ? <div className="button-group binTel-text-button">
                    <div className="binTel-info-text" onClick={() => { this.regist() }}>重置密码</div>
                </div> : null}
                <img className="button-image binTel-background-text-image" src="./images/userInfo-button.png" alt="" />
                <div className="button-type" style={buttonState === 1 ? { justifyContent: 'flex-start' } : { justifyContent: 'flex-end' }}>
                    {buttonState !== 0 ? <span onClick={() => { this.setState({ buttonState: 0 }) }} style={{textDecoration :'underline'}}>登录</span> : null}
                    {buttonState !== 1 ? <span onClick={() => { this.setState({ buttonState: 1 }) }} style={{textDecoration :'underline'}}>注册</span> : null}
                    {/* {buttonState !== 2 ? <span onClick={() => { this.setState({ buttonState: 2 }) }}>重置密码</span> : null} */}
                </div>
            </div>
        );
    }
}
export default BindTel;