import api from './services/Api';
import { Modal } from 'antd';
import {
    ASYNC_START,
    ASYNC_END,
    LOGIN,
    //   LOGOUT,
    REGISTER
    //   LOGIN,
    //   LOGOUT,
    //   REGISTER
}
    from './constants/actionTypes.js';
const promiseMiddleware = store => next => action => {
    if (isPromise(action.payload)) {
        store.dispatch({ type: ASYNC_START, subtype: action.type });
        const currentView = store.getState().viewChangeCounter;
        const skipTracking = action.skipTracking;
        action.payload.then(
            res => {
                const currentState = store.getState();
                if (!skipTracking && currentState.viewChangeCounter !== currentView) {
                    return;
                }
                //console.log('响应',res);
                if (res.msg === 'OK' || !res.msg) {
                    action.payload = res;
                    store.dispatch({ type: ASYNC_END, promise: action.payload });
                    store.dispatch(action);
                }
                else {
                    //console.log('ERROR', res);
                    action.error = true;
                    action.payload = res;
                    Modal.error({
                        title: '提示',
                        content: res.msg,
                    });
                    store.dispatch({ type: ASYNC_END });
                    store.dispatch(action);
                }
            },
            // error => {
            //   const currentState = store.getState()
            //   if (!skipTracking && currentState.viewChangeCounter !== currentView) {
            //     return
            //   }
            //   //console.log('ERROR', error);
            //   action.error = true;
            //   action.payload = error.responseJSON.errorMessage;
            //   if (!action.skipTracking) {
            //     store.dispatch({ type: ASYNC_END, promise: action.payload });
            //   }
            //   store.dispatch(action);
            // }
        );
        return;
    }
    next(action);
};
const localStorageMiddleware = store => next => action => {
    if (action.type === REGISTER || action.type === LOGIN) {
        if (!action.error) {
            window.localStorage.setItem('TOKEN', action.payload.token);
            api.setToken(action.payload.token);
        }
    }
    // else if (action.type === LOGOUT) {
    //   window.localStorage.setItem('TOKEN', '');
    //   api.setToken(null);
    // }
    next(action);
};
function isPromise(v) {
    return v && typeof v.then === 'function';
}
export { promiseMiddleware, localStorageMiddleware };