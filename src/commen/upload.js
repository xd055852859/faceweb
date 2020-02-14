import * as qiniu from 'qiniu-js';
const uploadFile = {
  uploadImg: async (file, uptoken, mimeType,callback) => {
    //let res = await api.upload.getUptoken(window.localStorage.getItem("TOKEN"));
    if (!uptoken || !file) {
      return;
    }
    
    const domain = 'http://cdn-icare.qingtime.cn/';
    // if (file.size > 52428800) {
    //     message.error("文件过大,请重新选择");
    //     return;
    // }
    //console.log("进来了", uptoken);
    let putExtra = {
      // 文件原文件名
      fname: "",
      // 自定义变量
      params: {},
      // 限制上传文件类型
      mimeType: mimeType,
    };
    let config = {
      useCdnDomain: true,
      disableStatisticsReport: false,
      retryCount: 5,
      region: qiniu.region.z0
    };
    let observer = {
      next(res) {},
      error(err) {
        alert(err.message);
      },
      complete(res) {
        // content = content.replace(/(data:image\/){1}(jpeg|gif|png){1}(;){1}.*?\"/, "http://cdn-icare.qingtime.cn/" + res.key + "\"");
        //console.log(domain + res.key);
        callback(domain + res.key);
        //return domain + res.key;
      }
    }
    //console.log(file);
    // 上传
    let observable = qiniu.upload(file, new Date().getTime() + "_" + file.name, uptoken, putExtra, config);
    // 上传开始
    observable.subscribe(observer);
  }
}


export default uploadFile
