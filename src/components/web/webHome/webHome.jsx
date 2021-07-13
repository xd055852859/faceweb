import React, { useState, useEffect } from 'react';
import './webHome.css';
import copy from 'copy-to-clipboard';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import shareSvg from '../../../images/share.svg';
import memoSvg from '../../../images/memo.svg';

const WebHome = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [loginState, setLoginState] = useState(false);
  const [modalState, setModalState] = useState(false);
  useEffect(() => {
    // history.push('/home/showPage');
  }, []);

  const invitePerson = () => {
    copy('https://faceview.qingtime.cn');
    message.success('复制链接成功');
  };
  const toUrl = (url) => {
    // if (localStorage.getItem('TOKEN')) {
    history.push(url);
    // } else {
    //   this.login();
    // }
  };
  return (
    <div
      className="webHome"
      style={{ backgroundImage: `url(./images/banner.jpg)` }}
    >
      {loginState ? (
        <div
          className="webHome-nav"
          onClick={() => {
            history.push('/history');
          }}
        >
          {/* <HistoryNav type={0} /> */}
        </div>
      ) : (
        <div className="webHome-nav"></div>
      )}
      <div className="webHome-info">
        <div className="home-info-container">
          阴阳五行，化生万物。相由心生，境随心转。古人经常从面部特征推算富贵时运。时光科技AI小组利用人脸识别等相关技术，结合相关典籍，帮助用户快速解读面相，将传统文化发扬光大。
        </div>
        <div className="home-info-image-container">
          <div
            className="home-info-image-info"
            onClick={() => {
              setModalState(true);
            }}
          >
            <img className="home-info-image-info-image" src={memoSvg} alt="" />
            <div
              className="home-info-image-info-text"
              style={{ color: '#85A8E6' }}
            >
              理论简介
            </div>
          </div>
          <div
            className="home-info-image-info"
            onClick={() => {
              invitePerson();
            }}
          >
            <img className="home-info-image-info-image" src={shareSvg} alt="" />
            <div
              className="home-info-image-info-text"
              style={{ color: '#85A8E6' }}
            >
              分享
            </div>
          </div>
        </div>
      </div>
      <div className="webHome-button">
        {/* <div className="webHome-button-item">
          <div
            className="webHomeLink"
            onClick={() => {
              toUrl('/uploadTongueImg');
            }}
            style={{
              backgroundImage: `url(./images/userInfo-left-button.png)`,
            }}
          >
            <img
              className="home-info-tongueButton"
              src="./images/tongueButton.svg"
              alt=""
            />
            智能舌诊
          </div>
        </div> */}

        <div className="webHome-button-item">
          <div
            className="webHomeLink"
            onClick={() => {
              toUrl('/webUploadImg');
            }}
            style={{
              backgroundImage: `url(./images/userInfo-right-button.png)`,
            }}
          >
            <img
              className="home-info-tongueButton"
              src="./images/faceButton.svg"
              alt=""
            />
            面相探索
          </div>
        </div>
        {/* <div className="home-info-text button-right-image home-info-button-image">
                        <Link className="homeLink" to="/uploadHandImg"> <img className="home-info-tongueButton" src="./images/handButton.svg" alt="" />手相探索
                        </Link>
                    </div>
                    <img className="button-right-image home-info-button-image home-info-right-button" src="./images/userInfo-center-button.svg" alt="" /> */}
      </div>
      {modalState ? (
        <div className="webHome-background">
          <div className="webHome-background-container">
            <div className="home-background-top">
              <img
                className="home-background-top-image"
                src="./images/home-background-top-image.png"
                alt=""
              />
            </div>
            <div className="home-background-info">
              <img
                className="home-background-info-image"
                src="http://cdn-icare.qingtime.cn/1548815240826_home-background-info-image.png"
                alt=""
              />
              <div className="home-background-info-text">
                <div className="home-background-info-text-title">产品简介</div>
                <div className="webHome-background-info-text-info">
                  <div className="title">1）相学</div>
                  <div className="text">
                    相学指的是根据长相、气质、音容笑貌来判断和预知一个人的过去和未来。一切事物都具有时空四维全息性，这是宇宙的法则，也是古人发现的天人合一，万物法一，其理同源。{' '}
                  </div>
                  <div className="text">
                    面相学构建在阴阳五行理论的基础之上，取法自然，也是几千年来大量前人对各种人体面部特征与人生运势走势之间关系的归纳总结和数理统计结果，也能从当代人体生理学、遗传学中找到立论依据。
                  </div>

                  <div className="title" style={{ marginTop: '0.1rem' }}>
                    2）舌诊
                  </div>
                  <div className="text">
                    舌辨五味，中医认为“舌为心之苗”。舌诊是中医的特色，因舌面血管又极其丰富，从舌质的色泽可以看出气血的运行并判断心脏的生理功能。
                  </div>
                  <div className="text">
                    心的功能正常，则舌体红润，柔软灵敏，语言流利；心的阳气不足，则舌质淡白胖嫩；心的阴血不足，则舌质红绛瘦瘪；心火上炎，则舌尖红，甚至糜烂；心血瘀阻，则舌质紫暗或有瘀斑；心神失常，则舌体强硬，语言障碍等。
                  </div>
                  <div className="text">
                    中医认为舌面分为四个区域，与五脏六腑相对应：舌尖区属心、肺，舌中部属脾、胃，舌根区属肾，舌的两边属肝、胆，所以舌面具体部位的病变，也可在其他脏腑上考虑病因。总而言之，舌就是反映五脏六腑状况的一面镜子。
                  </div>
                </div>
                <div className="home-background-info-footer">
                  江苏时光信息科技有限公司
                </div>
                <img
                  className="home-background-button"
                  src="./images/home-background-button.png"
                  alt=""
                  onClick={() => {
                    setModalState(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
WebHome.defaultProps = {};
export default WebHome;
