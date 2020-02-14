import {
    TONGUEUP_IMGSRC,
    TONGUEDOWN_IMGSRC,
    BASEUP_IMGSRC,
    BASEDOWN_IMGSRC,
    TONGUE_STATE,
} from '../actions/actionTypes';
const defaultState = {
    tongueUpSrc: '',
    tongueDownSrc: '',
    tongueState: 0
}
const face = (state = defaultState, action) => {
    switch (action.type) {
        case TONGUEUP_IMGSRC:
            return {
                ...state,
                tongueUpSrc: action.tongueUpSrc,
            };
        case TONGUEDOWN_IMGSRC:
            return {
                ...state,
                tongueDownSrc: action.tongueDownSrc,
            };
        case BASEUP_IMGSRC:
            return {
                ...state,
                baseUpSrc: action.baseUpSrc,
            };
        case BASEDOWN_IMGSRC:
            return {
                ...state,
                baseDownSrc: action.baseDownSrc,
            };
        case TONGUE_STATE:
            return {
                ...state,
                tongueState: action.tongueState,
            };
        default:
            return state;
    }
}

export default face;