const DrawCanvas = {
    maxNum(arr) {
        let [imgSrc, scaleNum, arr1, arr2, top, left, width, height, canvasName, arr3, arr4, faceWidth, faceBegin, that, drawContext, drawBgContext] = [...arr];
        //console.log(canvasName + 'Canvas');
        let canvasDom = document.getElementById(canvasName + 'Canvas');
        if (canvasDom) {
            const context = canvasDom.getContext("2d");
            let backgroundNumArr = [13, 22, 24, 26, 17, 15, 13, 19, 17, 50, 58, 64, 62, 53, 30, 39, 41, 43, 34, 32, 30, 36, 34];
            let xMax = (Math.max.apply(null, arr1) + top);
            let xMin = (Math.min.apply(null, arr1) + top);
            let yMax = (Math.max.apply(null, arr2) + left);
            let yMin = (Math.min.apply(null, arr2) + left);
            if (drawContext) {
                context.beginPath();
                if (arr3) {
                    context.rect(xMin - 10, yMin - 10, xMax - xMin + 20, yMax - yMin + 20);
                } else {
                    context.rect(faceBegin + top, yMin, faceWidth, yMax - yMin);
                    xMin = faceBegin + top + 10;
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
            context.lineWidth = 3;
            context.strokeStyle = '#00DF72';
            context.stroke();
            context.save();
            if (drawContext) {
                if (arr3) {
                    this.drawLine(arr3, context, top, left, 'rgba(0,233,114,0.4)');
                }
                if (arr4) {
                    this.drawLine(arr4, context, top, left, 'rgba(0,233,114,0.4)');
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
                    contextBackground.arc(that.state.backgroundArr[57].x + top, that.state.backgroundArr[57].y + left, 0.9, 0, 2 * Math.PI);
                    this.drawRectLine(that.state.backgroundArr[57].x + top, that.state.backgroundArr[57].y + left, that.state.backgroundArr[17].x + top, that.state.backgroundArr[17].y + left, contextBackground);
                    this.drawRectLine(that.state.backgroundArr[57].x + top, that.state.backgroundArr[57].y + left, that.state.backgroundArr[30].x + top, that.state.backgroundArr[30].y + left, contextBackground);
                    this.drawRectLine(that.state.backgroundArr[57].x + top, that.state.backgroundArr[57].y + left, that.state.backgroundArr[50].x + top, that.state.backgroundArr[50].y + left, contextBackground);
                    this.drawRectLine(that.state.backgroundArr[57].x + top, that.state.backgroundArr[57].y + left, that.state.backgroundArr[53].x + top, that.state.backgroundArr[53].y + left, contextBackground);
                    this.drawRectLine(that.state.backgroundArr[19].x + top, that.state.backgroundArr[19].y + left, that.state.backgroundArr[58].x + top, that.state.backgroundArr[58].y + left, contextBackground);
                    this.drawRectLine(that.state.backgroundArr[36].x + top, that.state.backgroundArr[36].y + left, that.state.backgroundArr[62].x + top, that.state.backgroundArr[62].y + left, contextBackground);
                    contextBackground.strokeStyle = "rgba(255,255,255,0.5)";
                    contextBackground.stroke();
                    contextBackground.closePath();

                    backgroundNumArr.forEach((item, index) => {
                        //圆点
                        contextBackground.beginPath();
                        contextBackground.arc(that.state.backgroundArr[item].x + top, that.state.backgroundArr[item].y + left, 0.9, 0, 2 * Math.PI);
                        if (index < backgroundNumArr.length - 1) {
                            this.drawRectLine(that.state.backgroundArr[item].x + top, that.state.backgroundArr[item].y + left, that.state.backgroundArr[backgroundNumArr[index + 1]].x + top, that.state.backgroundArr[backgroundNumArr[index + 1]].y + left, contextBackground);
                        }
                        contextBackground.strokeStyle = "rgba(255,255,255,0.5)";
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
                context.moveTo(arr[index - 1].x + top, arr[index - 1].y + left);
                context.lineTo(item.x + top, item.y + left);
                context.strokeStyle = color;
                context.stroke();
            } else {
                context.moveTo(arr[0].x + top, arr[0].y + left);
            }
        })
        context.moveTo(arr[arr.length - 1].x + top, arr[arr.length - 1].y + left);
        context.lineTo(arr[0].x + top, arr[0].y + left);
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
    }
}
export default {
    DrawCanvas
}