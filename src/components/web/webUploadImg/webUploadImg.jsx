import React, { useState, useEffect } from 'react';
import './webUploadImg.css';
import { useDispatch } from 'react-redux';

const WebUploadImg = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const [] = useState([]);
  const uploadImgArr = [
    '正面',
    '面部完整呈现',
    '无刘海遮挡',
    '五官清晰',
    '不带眼镜',
    '图像不宜过小',
  ];
  return (
    <div className="webUploadImg">
      <div className="webUploadImg-title">拍照/上传照片</div>
      <div className="webUploadImg-subtitle">您可以直接拍照或上传本地照片</div>
      <div className="webUploadImg-bigImg">
        <div className="webUploadImg-bigImg-title">照片示例</div>
      </div>
      <div className="webUploadImg-bottom-title">满足以下要求结果更准确</div>
      <div className="webUploadImg-info">
        {uploadImgArr.map((item, index) => {
          return (
            <div
              className="webUploadImg-item-info"
              key={'upload' + index}
              style={{ backgroundImage: `url(./images/uploadImg-title.png)` }}
            >
              {item}
            </div>
          );
        })}
      </div>

      <div className="webHome-button">
        <div className="webHome-button-item">
          <div
            className="webHomeLink"
            onClick={() => {
              // toUrl('/uploadTongueImg');
            }}
            style={{
              backgroundImage: `url(./images/userInfo-center-button.png)`,
            }}
          >
            立即拍照
          </div>
        </div>

        <div className="webHome-button-item">
          <div
            className="webHomeLink"
            onClick={() => {
              // toUrl('/webUploadImg');
            }}
            style={{
              backgroundImage: `url(./images/userInfo-right-button.png)`,
            }}
          >
            本地上传
          </div>
        </div>
      </div>
    </div>
  );
};
WebUploadImg.defaultProps = {};
export default WebUploadImg;
