import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
// import { withRouter } from 'react-router';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import Home from './components/h5/home/home';
import Index from './components/index/index';
import WebHome from './components/web/webHome/webHome';

import ScanImg from './components/h5/scanImg/scanImg';
import ScanHandImg from './components/h5/scanHandImg/scanHandImg';
import UploadImg from './components/h5/uploadImg/uploadImg';
import UploadHandImg from './components/h5/uploadHandImg/uploadHandImg';
import UploadTongueImg from './components/h5/uploadTongueImg/uploadTongueImg';
import Report from './components/h5/report/report';
import HandReport from './components/h5/handReport/handReport';
import History from './components/h5/history/history';
import BindTel from './components/h5/bindTel/bindTel';
import Cropper from './components/h5/cropper/cropper';
import ReportImg from './components/h5/reportImg/reportImg';
import TongueInfo from './components/h5/tongueInfo/tongueInfo';
import TongueReport from './components/h5/tongueReport/tongueReport';

import WebUploadImg from './components/web/webUploadImg/webUploadImg';

import './App.css';
// window.router = this.props.history;
class App extends Component {
  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <HashRouter>
          {/* <div style={{ width: '100%', height: '100%' }}> */}
          <Route exact path="/" component={Index} />
          <Route path="/home" component={Home} />
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

          <Route path="/webHome" component={WebHome} />
          <Route path="/webUploadImg" component={WebUploadImg} />
          
          {/* </div> */}
        </HashRouter>
      </LocaleProvider>
    );
  }
}

export default App;
