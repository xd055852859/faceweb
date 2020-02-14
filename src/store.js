// import { applyMiddleware, createStore } from 'redux';
import {
    createStore
} from 'redux';
// // import { createLogger } from 'redux-logger'
// import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
// import { promiseMiddleware, localStorageMiddleware } from './middleware';
import reducer from './reducer';
// const getMiddleware = () => {
//     // process.env.NODE_ENV === 'production'
//     if (false) {
//         return applyMiddleware(promiseMiddleware, localStorageMiddleware);
//     } else {
//         // Enable additional logging in non-production environments.
//         return applyMiddleware(promiseMiddleware, localStorageMiddleware);
//     }
// };
const loadState = () => {
    try { // 也可以容错一下不支持localStorage的情况下，用其他本地存储
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        } else {
            return JSON.parse(serializedState);
        }
    } catch (err) {
        // ... 错误处理
        return undefined;
    }
}
const store = createStore(reducer, loadState())
// , composeWithDevTools(getMiddleware()));
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {
        // ...错误处理
    }
};
window.onbeforeunload = (e) => {
    const state = store.getState();
    saveState(state);
};
export default store;