import imgCanvas from './drawCanvas';
const analysisReport = {
  analysisReport: (report, height, width, img, canvasNameStr, that) => {
    //裁剪器官
    let imgSrc = img.src;
    let beauty = report.split('beauty: ')[1].split('gender')[0];
    console.log('beauty', beauty);
    let beautyArr = beauty.split(' face: ');
    let beautyMark = parseFloat(beautyArr[0]);
    let stateIndex = 0;
    console.log('分数', beautyMark);
    stateIndex =
      20 < beautyMark && beautyMark <= 40
        ? 1
        : 40 < beautyMark && beautyMark <= 60
        ? 2
        : 60 < beautyMark && beautyMark <= 80
        ? 3
        : 80 < beautyMark && beautyMark <= 100
        ? 4
        : 0;
    let upMarkArr = beautyArr[1].split(' up_stop: ');
    let midMarkArr = upMarkArr[1].split(' mid_stop: ');
    let downMarkArr = midMarkArr[1].split(' down_stop: ');
    let browMarkArr = downMarkArr[1].split(' brow: ');
    let eyeMarkArr = browMarkArr[1].split(' eye: ');
    let noseMarkArr = eyeMarkArr[1].split(' nose: ');
    let mouthMarkArr = noseMarkArr[1].split(' mouth: ');

    let faceOrgArr = report.split('x1,x2,y1,y2:')[1].split(' ');
    let upStop = parseInt(
      report.split('Up_Stops: ')[1].split('【')[0].replace(/↵/g, '')
    );
    let faceArr = [
      parseInt(faceOrgArr[1]) - 50,
      parseInt(faceOrgArr[2]) - 50,
      parseInt(faceOrgArr[3]),
      parseInt(faceOrgArr[4]),
    ];
    let scaleWidth = 0;
    if (navigator.userAgent.toLowerCase().indexOf('miniprogram') !== -1) {
      scaleWidth = 300;
    }
    scaleWidth = /Android|webOS|iPhone|iPod|BlackBerry/i.test(
      navigator.userAgent
    )
      ? 600
      : 300;
    let scaleNum = 1;
    let personWidth = faceArr[3] - faceArr[2];
    let personHeight = faceArr[1] - faceArr[0];
    // if(personWidth>scaleWidth){
    //   scaleNum =personWidth/ scaleWidth
    // }else if(personWidth<scaleWidth){
    scaleNum = scaleWidth / personWidth;
    // }
    imgCanvas.DrawCanvas.drawImgCanvas(
      canvasNameStr,
      faceArr,
      img,
      scaleNum,
      height * scaleNum,
      width * scaleNum
    );
    let newFaceData = report.split('landmark72: ')[1];
    let newFaceArr = newFaceData
      .replace(/u/g, '')
      .replace('[', '')
      .replace(']', '')
      .replace('↵', '')
      .replace(/ 'x'/g, "'x'")
      .split(', ');
    let faceXArr = [];
    let faceYArr = [];
    let faceNewArr = [];
    let eyebrowXArr = [];
    let eyebrowYArr = [];
    let eyebrowLeftArr = [];
    let eyebrowRightArr = [];
    let eyeXArr = [];
    let eyeYArr = [];
    let eyeLeftArr = [];
    let eyeRightArr = [];
    let mouthXArr = [];
    let mouthYArr = [];
    let mouthArr = [];
    let noseXArr = [];
    let noseYArr = [];
    let noseArr = [];
    let faceWidth = width;
    let faceHeight = height;
    let faceTop = +faceArr[0] * scaleNum;
    let faceLeft = +faceArr[2] * scaleNum;
    let backgroundArr = newFaceArr.map((item, index) => {
      // item = JSON.parse("'"+item.replace(/\"/g,'').replace(/\'/g,"\"")+"'");
      item = JSON.parse(item.replace(/'/g, '"'));
      item.x = (item.x + 50) * scaleNum;
      item.y = item.y * scaleNum;
      if (0 <= index && index <= 12) {
        faceXArr.push(item.x);
        faceYArr.push(item.y);
        faceNewArr.push(item);
      }
      if ((13 <= index && index <= 20) || (30 <= index && index <= 37)) {
        eyeXArr.push(item.x);
        eyeYArr.push(item.y);
        if (13 <= index && index <= 20) {
          eyeLeftArr.push(item);
        }
        if (30 <= index && index <= 37) {
          eyeRightArr.push(item);
        }
      }
      if ((22 <= index && index <= 29) || (39 <= index && index <= 46)) {
        eyebrowXArr.push(item.x);
        eyebrowYArr.push(item.y);
        if (22 <= index && index <= 29) {
          eyebrowLeftArr.push(item);
        }
        if (39 <= index && index <= 46) {
          eyebrowRightArr.push(item);
        }
      }
      if (47 <= index && index <= 56) {
        noseXArr.push(item.x);
        noseYArr.push(item.y);
        noseArr.push(item);
      }
      if (58 <= index && index <= 65) {
        mouthXArr.push(item.x);
        mouthYArr.push(item.y);
        mouthArr.push(item);
      }
      return item;
    });
    let list = backgroundArr;
    // console.log(list);
    // console.log('上停', upStop * scaleNum, (list[24].y + list[41].y) * 0.5);
    // console.log(
    //   '中停',
    //   (list[24].y + list[41].y) * 0.5,
    //   (list[51].y + list[52].y) * 0.5
    // );
    // console.log('下停', (list[51].y + list[52].y) * 0.5, list[6].y);
    //console.log("上停", upStop, Math.min.apply(null, eyebrowYArr))
    imgCanvas.DrawCanvas.maxNum([
      imgSrc,
      scaleNum,
      eyeXArr,
      eyeYArr,
      faceTop,
      faceLeft,
      faceWidth,
      faceHeight,
      canvasNameStr[0],
      eyeLeftArr,
      eyeRightArr,
      0,
      0,
      backgroundArr,
      1,
      1,
    ]);
    imgCanvas.DrawCanvas.maxNum([
      imgSrc,
      scaleNum,
      eyebrowXArr,
      eyebrowYArr,
      faceTop,
      faceLeft,
      faceWidth,
      faceHeight,
      canvasNameStr[1],
      eyebrowLeftArr,
      eyebrowRightArr,
      0,
      0,
      backgroundArr,
      1,
      1,
    ]);
    imgCanvas.DrawCanvas.maxNum([
      imgSrc,
      scaleNum,
      faceXArr,
      faceYArr,
      faceTop,
      faceLeft,
      faceWidth,
      faceHeight,
      canvasNameStr[2],
      faceNewArr,
      0,
      0,
      0,
      backgroundArr,
      1,
      1,
    ]);
    imgCanvas.DrawCanvas.maxNum([
      imgSrc,
      scaleNum,
      mouthXArr,
      mouthYArr,
      faceTop,
      faceLeft,
      faceWidth,
      faceHeight,
      canvasNameStr[3],
      mouthArr,
      0,
      0,
      0,
      backgroundArr,
      1,
      1,
    ]);
    imgCanvas.DrawCanvas.maxNum([
      imgSrc,
      scaleNum,
      noseXArr,
      noseYArr,
      faceTop,
      faceLeft,
      faceWidth,
      faceHeight,
      canvasNameStr[4],
      noseArr,
      0,
      0,
      0,
      backgroundArr,
      1,
      1,
    ]);
    let topAreaXArr = [0, Math.min.apply(null, eyebrowXArr)];
    let topAreaYArr = [
      upStop * scaleNum,
      // Math.min.apply(null, eyebrowYArr)
      (list[24].y + list[41].y) * 0.5,
    ];
    let middleAreaXArr = [
      Math.min.apply(null, eyebrowXArr),
      Math.max.apply(null, noseXArr),
    ];
    let middleAreaYArr = [
      // Math.min.apply(null, eyebrowYArr),
      // Math.max.apply(null, noseYArr),
      (list[24].y + list[41].y) * 0.5,
      (list[51].y + list[52].y) * 0.5,
    ];
    let bottomAreaXArr = [
      Math.max.apply(null, noseXArr),
      Math.max.apply(null, faceXArr),
    ];
    let bottomAreaYArr = [
      // Math.max.apply(null, noseYArr),
      // Math.max.apply(null, faceYArr)
      (list[51].y + list[52].y) * 0.5,
      list[6].y,
    ];
    imgCanvas.DrawCanvas.maxNum([
      imgSrc,
      scaleNum,
      topAreaXArr,
      topAreaYArr,
      faceTop,
      faceLeft,
      faceWidth,
      faceHeight,
      canvasNameStr[5],
      0,
      0,
      Math.max.apply(null, faceXArr) - Math.min.apply(null, faceXArr),
      Math.min.apply(null, faceXArr),
      backgroundArr,
      1,
      1,
    ]);
    imgCanvas.DrawCanvas.maxNum([
      imgSrc,
      scaleNum,
      middleAreaXArr,
      middleAreaYArr,
      faceTop,
      faceLeft,
      faceWidth,
      faceHeight,
      canvasNameStr[6],
      0,
      0,
      Math.max.apply(null, faceXArr) - Math.min.apply(null, faceXArr),
      Math.min.apply(null, faceXArr),
      backgroundArr,
      1,
      1,
    ]);
    imgCanvas.DrawCanvas.maxNum([
      imgSrc,
      scaleNum,
      bottomAreaXArr,
      bottomAreaYArr,
      faceTop,
      faceLeft,
      faceWidth,
      faceHeight,
      canvasNameStr[7],
      0,
      0,
      Math.max.apply(null, faceXArr) - Math.min.apply(null, faceXArr),
      Math.min.apply(null, faceXArr),
      backgroundArr,
      1,
      1,
    ]);
    return {
      markArr: [
        beautyMark,
        upMarkArr[0],
        midMarkArr[0],
        downMarkArr[0],
        browMarkArr[0],
        eyeMarkArr[0],
        noseMarkArr[0],
        mouthMarkArr[0],
        mouthMarkArr[1].replace('↵'),
      ],
      viewWidth: scaleWidth + 'px',
      viewHeight: parseInt(personHeight * scaleNum + 80) + 'px',
    };
  },
};

export default analysisReport;
