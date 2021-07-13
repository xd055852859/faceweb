const DrawCanvas = {
    maxNum(arr) {
        let [imgSrc, scaleNum, arr1, arr2, top, left, width, height, canvasName, arr3, arr4, faceWidth, faceBegin,backgroundArr, drawContext, drawBgContext] = [...arr];
        //console.log(canvasName + 'Canvas');
        let canvasDom = document.getElementById(canvasName + 'Canvas');
        if (canvasDom) {
            const context = canvasDom.getContext("2d");
            let backgroundNumArr = [13, 22, 24, 26, 17, 15, 13, 19, 17, 50, 58, 64, 62, 53, 30, 39, 41, 43, 34, 32, 30, 36, 34];
            let xMax = (Math.max.apply(null, arr1));
            let xMin = (Math.min.apply(null, arr1));
            let yMax = (Math.max.apply(null, arr2));
            let yMin = (Math.min.apply(null, arr2));
            console.log(faceWidth,faceBegin);
            if (drawContext) {
                context.beginPath();
                if (arr3) {
                    context.rect(xMin - 10, yMin - 10, xMax - xMin + 20, yMax - yMin + 20);
                } else {
                    context.rect(faceBegin, yMin, faceWidth, yMax - yMin);
                    xMin = faceBegin + 10;
                    xMax = faceWidth + xMin - 20;
                    yMin = yMin + 11;
                    yMax = yMax - 10;

                }

                context.strokeStyle = 'rgba(0,0,0,0)'
                context.stroke();

                context.clip();
                // context.arc(50, 50, 25, 0, 2 * Math.PI)

                // img.src = imgSrc;
                // img.crossOrigin = "Anonymous";
                // context.drawImage(imgSrc, 0, 0, width * scaleNum, height * scaleNum);
                // document.getElementById('testImg').src = document.getElementById('topAreaCanvas').toDataURL("image/jpeg", 1);
            }
            context.beginPath();
            this.drawRectLine(xMin - 9.5, yMin - 9.5, xMin + 2.5, yMin - 9.5, context); //横
            this.drawRectLine(xMin - 9.5, yMin - 9.5, xMin - 9.5, yMin - 0.5, context); //竖

            this.drawRectLine(xMax + 9.5, yMin - 9.5, xMax - 2.5, yMin - 9.5, context);
            this.drawRectLine(xMax + 9.5, yMin - 9.5, xMax + 9.5, yMin + 0.5, context);

            this.drawRectLine(xMin - 9.5, yMax + 9.5, xMin + 2.5, yMax + 9.5, context);
            this.drawRectLine(xMin - 9.5, yMax + 9.5, xMin - 9.5, yMax - 0.5, context);

            this.drawRectLine(xMax + 9.5, yMax + 9.5, xMax - 2.5, yMax + 9.5, context);
            this.drawRectLine(xMax + 9.5, yMax + 9.5, xMax + 9.5, yMax - 0.5, context);
            context.lineWidth = 0.7;
            context.strokeStyle = '#00DF72';
            context.stroke();
            context.save();
            if (drawContext) {
                if (arr3) {
                    this.drawLine(arr3, context, top, left, 'rgba(0,233,114,0.1)');
                }
                if (arr4) {
                    this.drawLine(arr4, context, top, left, 'rgba(0,233,114,0.1)');
                }

                context.save();
                // ctx.fill()     
                context.closePath();
            }
            // let test = document.getElementById("topAreaCanvas")
            // var imgData =test.toDataURL("image/png");
            // document.getElementById("testImg").setAttribute("src",imgData)
            context.restore();
            // const contextCover = wx.createCanvasContext(canvasName + 'CoverCanvas');
            // contextCover.setFillStyle("rgba(0, 0, 0, 0.4)")
            // contextCover.fillRect(0, 0, width, height);
            // contextCover.draw(true);
            if (drawBgContext) {
                const background = document.getElementById(canvasName + 'BackgroundCanvas');
                if (background) {
                    const contextBackground = background.getContext("2d");
                    //contextBackground.drawImage(this.state.uploadImg, 0, 0, width * scaleNum, height * scaleNum);
                    //contextBackground.drawImage(this.state.uploadImg, 0, 0, width, height);

                    contextBackground.beginPath();
                    contextBackground.arc(backgroundArr[57].x, backgroundArr[57].y, 0.9, 0, 2 * Math.PI);
                    this.drawRectLine(backgroundArr[57].x, backgroundArr[57].y, backgroundArr[17].x, backgroundArr[17].y, contextBackground);
                    this.drawRectLine(backgroundArr[57].x, backgroundArr[57].y, backgroundArr[30].x, backgroundArr[30].y, contextBackground);
                    this.drawRectLine(backgroundArr[57].x, backgroundArr[57].y, backgroundArr[50].x, backgroundArr[50].y, contextBackground);
                    this.drawRectLine(backgroundArr[57].x, backgroundArr[57].y, backgroundArr[53].x, backgroundArr[53].y, contextBackground);
                    this.drawRectLine(backgroundArr[19].x, backgroundArr[19].y, backgroundArr[58].x, backgroundArr[58].y, contextBackground);
                    this.drawRectLine(backgroundArr[36].x, backgroundArr[36].y, backgroundArr[62].x, backgroundArr[62].y, contextBackground);
                    contextBackground.strokeStyle = "rgba(255,255,255,0.2)";
                    contextBackground.stroke();
                    contextBackground.closePath();

                    backgroundNumArr.forEach((item, index) => {
                        //圆点
                        contextBackground.beginPath();
                        contextBackground.arc(backgroundArr[item].x, backgroundArr[item].y, 0.9, 0, 2 * Math.PI);
                        if (index < backgroundNumArr.length - 1) {
                            this.drawRectLine(backgroundArr[item].x, backgroundArr[item].y, backgroundArr[backgroundNumArr[index + 1]].x, backgroundArr[backgroundNumArr[index + 1]].y, contextBackground);
                        }
                        contextBackground.strokeStyle = "rgba(255,255,255,0.2)";
                        contextBackground.stroke();
                        contextBackground.closePath();
                    });
                }
            }
        }
    },
    drawLine(arr, context, top, left, color) {
        arr.forEach((item, index) => {
            if (index > 0) {
                context.moveTo(arr[index - 1].x, arr[index - 1].y);
                context.lineTo(item.x, item.y);
                context.strokeStyle = color;
                context.stroke();
            } else {
                context.moveTo(arr[0].x, arr[0].y);
            }
        })
        context.moveTo(arr[arr.length - 1].x, arr[arr.length - 1].y);
        context.lineTo(arr[0].x, arr[0].y);
        context.strokeStyle = color;
        context.lineWidth = 1;
        context.stroke();

    },
    drawRectLine(beginx, beginy, endx, endy, context) {
        context.moveTo(beginx, beginy);
        context.lineTo(endx, endy);
    },
    dataURLtoFile(dataurl, filename = 'file') {
        let arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let suffix = mime.split('/')[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], `${filename}.${suffix}`, {
            type: mime
        })
    },
    drawImgCanvas(canvasName,faceArr,img,scaleNum,height, width){
        canvasName.map((item,index)=>{
            let canvasDom = document.getElementById(item + 'ImgCanvas');
            if(canvasDom){
                const context = canvasDom.getContext("2d");
                console.log("????????????????????",scaleNum);               
                context.drawImage(img,-faceArr[0]*scaleNum,-faceArr[2]*scaleNum,img.width*scaleNum,img.height*scaleNum);
            }
        })
    }
}
export default {
    DrawCanvas
}