import {
    FACE_IMGSRC,
    FACE_REPORT,
    FACE_IMGFILE,
    FACE_USERKEY,
    FACE_REPORTID,
    FACE_UPLOADSTATE
} from '../actions/actionTypes';
const defaultState = {
    imgSrc: '',
    imgFullSrc: '',
    report: '',
    imgFile: '',
    userKey: '',
    reportId: '',
    uploadState: false
}
const face = (state = defaultState, action) => {
    switch (action.type) {
        case FACE_IMGSRC:
            //console.log('https://face2.qingtime.cn/' + action.imgSrc.replace(/\\/g, '/').replace('/home/work/service/face_node/public/', ''));
            return {
                ...state,
                imgSrc: 'https://face2.qingtime.cn/' + action.imgSrc.replace(/\\/g, '/').replace('/home/work/service/face_node/public/', ''),
                    imgFullSrc: action.imgSrc
            };
        case FACE_REPORT:
            return {
                ...state,
                report: action.report,
            };
        case FACE_IMGFILE:
            return {
                ...state,
                imgFile: action.imgFile,
            };
        case FACE_USERKEY:
            return {
                ...state,
                userKey: action.userKey,
            };
        case FACE_REPORTID:
            return {
                ...state,
                reportId: action.reportId,
            };
        case FACE_UPLOADSTATE:
            return {
                ...state,
                uploadState: action.uploadState,
            };
        default:
            return state;
    }
}

export default face;