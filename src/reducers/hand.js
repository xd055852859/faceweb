import {
    HAND_IMGSRC,
    HAND_IMGFILE
} from '../../actions/actionTypes';
const defaultState = {
    imgHandSrc: '',
    imgHandFile: '',
    tongueState: 0
}
const hand = (state = defaultState, action) => {
    switch (action.type) {
        case HAND_IMGSRC:
            return {
                ...state,
                imgHandSrc: action.imgHandSrc,
            };
        case HAND_IMGFILE:
            return {
                ...state,
                imgHandFile: action.imgHandFile,
            };
        default:
            return state;
    }
}

export default hand;