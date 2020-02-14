import React, { Component } from 'react';
import {HashRouter,Route} from 'react-router-dom';
// import { withRouter } from 'react-router';
import { LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import Home from './components/home/home';
import ScanImg from './components/scanImg/scanImg';
import ScanHandImg from './components/scanHandImg/scanHandImg';
import UploadImg from './components/uploadImg/uploadImg';
import UploadHandImg from './components/uploadHandImg/uploadHandImg';
import UploadTongueImg from './components/uploadTongueImg/uploadTongueImg';
import Report from './components/report/report';
import HandReport from './components/handReport/handReport';
import History from './components/history/history';
import BindTel from './components/bindTel/bindTel';
import Cropper from './components/cropper/cropper';
import ReportImg from './components/reportImg/reportImg';
import TongueInfo from './components/tongueInfo/tongueInfo';
import TongueReport from './components/tongueReport/tongueReport'
import './App.css';
// window.router = this.props.history;
class App extends Component {
  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <HashRouter>
          <div style={{width: "100%",height:"100%" }}>
            <Route exact path="/" component={Home} />
            <Route path="/scanImg" component={ScanImg} />
            <Route path="/scanhandImg" component={ScanHandImg} />           
            <Route path="/uploadImg" component={UploadImg} />
            <Route path="/uploadHandImg" component={UploadHandImg} />
            <Route path="/uploadTongueImg" component={UploadTongueImg} />
            <Route path="/report" component={Report} />
            <Route path="/handReport" component={HandReport} />
            <Route path="/history" component={History} />
            <Route path="/bindTel" component={BindTel} />
            <Route path="/cropper" component={Cropper} />
            <Route path="/reportImg" component={ReportImg} />
            <Route path="/tongueInfo" component={TongueInfo} /> 
            <Route path="/tongueReport" component={TongueReport} />           
          </div>
        </HashRouter>
      </LocaleProvider>
    );
  }
}

export default App;
