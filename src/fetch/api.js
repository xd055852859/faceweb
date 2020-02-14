import axios from "axios";
// import { withRouter } from 'react-router';
import { message } from "antd";
//const history = createHistory();
//'http://192.168.1.101:8086/'
const HOMEURL = "https://baokudata.qingtime.cn/sgbh/";
const APIURL = "https://facedata.qingtime.cn/";
const history = require("history").createHashHistory();
//console.log("history", history);
// let token = null;
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    let that = this;
    //console.log("response", window.router);
    if (response.status === 200) {
      console.log(response.data);
      if (response.data.status == "701"||response.data.statusCode=="701") {
        message.error("登录失效,请重新登录");
        //console.log("xxxx", navigator.userAgent.toLowerCase().indexOf('miniprogram'));
        if (navigator.userAgent.toLowerCase().indexOf("miniprogram") === -1) {
          const redirect = `${window.location.protocol}//${window.location.host}`;
          window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://faceview.qingtime.cn/images/icon.png`;
        }
        // window.wx.miniProgram.getEnv(function (res) {

        //     if (res.miniprogram) {
        //         window.wx.miniProgram.navigateTo({
        //             url: '/pages/bindTel/bindTel'
        //         })
        //     }
        // })

        // 清除token
        localStorage.clear();
        // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
        return Promise.resolve(response);
      }
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  error => {
    if (error.response && error.response.status) {
      //     switch (error.response.status) {
      // 401: 未登录
      // 未登录则跳转登录页面，并携带当前页面的路径
      // 在登录成功后返回当前页面，这一步需要在登录页操作。
      //  case 701:
      //   router.replace({
      //   path: '/login',
      //   query: {
      //    redirect: router.currentRoute.fullPath
      //   }
      //   });
      //   break;

      // 403 token过期
      // 登录过期对用户进行提示
      // 清除本地token和清空vuex中token对象
      // 跳转登录页面

      // 404请求不存在
      // case 404:
      //     this.$message.error("网络请求不存在")
      //     break;
      //     // 其他错误，直接抛出错误提示
      // default:
      //     this.$message.error(error.response.data.message);
      // }
      return Promise.reject(error.response);
    }
  }
);
const requests = {
  get: (url, params) => {
    // todo ping
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params
        })
        .then(response => {
          //console.log(response);
          resolve(response.data);
        })
        .catch(error => {
          //console.log(error)
          reject(error);
        });
    });
  },
  post: (url, params) => {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          //console.log(error)
          reject(error);
        });
    });
  },
  patch: (url, params) => {
    return new Promise(async function(resolve, reject) {
      axios
        .patch(url, params)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          //console.log(error)
          reject(error);
        });
    });
  },
  delete: (url, params) => {
    return new Promise(async function(resolve, reject) {
      axios
        .delete(url, {
          params
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          //console.log(error)
          reject(error);
        });
    });
  }
};

const Face = {
  login(mobile, password) {
    return requests.get(
      "https://baokudata.qingtime.cn/sgbh/account?mobileArea=%2B86&mobile=" +
        mobile +
        "&password=" +
        password +
        "&app=17&appHigh=26&deviceType=4&deviceModel=chrome"
    );
  },
  getUserFullInfo(params) {
    return requests.get(HOMEURL + "account/userinfo", params);
  },
  getHomeData(params) {
    return requests.get(APIURL + "resultLength", params);
  },
  getHistoryList(params) {
    return requests.get(APIURL + "userResultWeb", params);
  },
  getReport(params) {
    return requests.get(APIURL + "readFaceWeb", params);
  },
  getHandReport(params) {
    return requests.get(APIURL + "readHand", params);
  },
  getHandList(params) {
    return requests.get(APIURL + "hand/result", params);
  },

  deleteReport(params) {
    return requests.post(APIURL + "deleteReport", params);
  },
  deleteHandReport(params) {
    return requests.post(APIURL + "hand/delete", params);
  },
  getReportDetail(params) {
    return requests.get(APIURL + "resultDetail", params);
  },
  getHandDetail(params) {
    return requests.get(APIURL + "hand/detail", params);
  },
  getCode(params) {
    return requests.post(
      "https://baokudata.qingtime.cn/sgbh/account/verifyCode",
      params
    );
  },
  bindTel(params) {
    return requests.post("https://baokudata.qingtime.cn/sgbh/account", params);
  },
  saveImg(params) {
    return requests.post(APIURL + "savePic", params);
  },
  saveHandImg(params) {
    return requests.post(APIURL + "hand/savePic", params);
  },
  getQiNiuUpToken(params) {
    return requests.get(
      "https://baokudata.qingtime.cn/sgbh/upTokenQiniu/getQiNiuUpToken",
      params
    );
  },
  submitPictures(params) {
    return requests.post(APIURL + "submitPictures", params);
  },
  tongueResult(params) {
    return requests.get(APIURL + "tongueResult", params);
  },
  submitAnswer(params) {
    return requests.post(APIURL + "submitAnswer", params);
  },
  saveTongueImg(params) {
    return requests.post(APIURL + "tongue/savePic", params);
  },
  getTongueList(params) {
    return requests.get(APIURL + "tongue/result", params);
  },
  deleteTongueReport(params) {
    return requests.post(APIURL + "tongue/deleteRecord", params);
  }
};
export default {
  // 获取我的页面的后台数据
  Face,
  APIURL
};
