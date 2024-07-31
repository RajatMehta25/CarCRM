import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

// Login Redux States
import { CHECK_LOGIN, LOGOUT_USER } from './actionTypes';
import { apiError, loginUserSuccessful, logoutUserSuccess } from './actions';

// AUTH related methods
import { postLogin } from '../../../helpers/fackBackend_Helper';
import { getFirebaseBackend } from '../../../helpers/firebase_helper';
import { Cookies } from 'js-cookie';
//Initilize firebase
const fireBaseBackend = getFirebaseBackend();

//If user is login then dispatch redux action's are directly from here.
function* loginUser({ payload: { user, history } }) {
        try {
            // if(process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            //     const response = yield call(fireBaseBackend.loginUser, user.username, user.password);
            //     yield put(loginUserSuccessful(response));
            // }
            // else {
            //     const response = yield call(postLogin, '/login', {username: user.username, password: user.password});
            //     localStorage.setItem("authUser", JSON.stringify(response));
            //     yield put(loginUserSuccessful(response));
            // }
            // history.push('/adminPanel/dashboard');
        } catch (error) {
            yield put(apiError(error));
        }
}

function* logoutUser({ payload: { history } }) {
    try {
        localStorage.removeItem("authUser");

        // if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
        //     const response = yield call(fireBaseBackend.logout);
        //     yield put(logoutUserSuccess(response));
        // }

        // history.push('adminPanel/login');
        let cookieCheck=Cookies.get("admin_access_token");
        console.log(cookieCheck);
         // if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
         //     const response = yield call(fireBaseBackend.logout);
         //     yield put(logoutUserSuccess(response));
         // }
 
         (cookieCheck&&cookieCheck!=="undefined")?history.push('/adminPanel/dashboard'):history.push('/adminPanel/login');
         console.log(history);
    } catch (error) {
        yield put(apiError(error));
    }

}

export function* watchUserLogin() {
    yield takeEvery(CHECK_LOGIN, loginUser)
}

export function* watchUserLogout() {
    yield takeEvery(LOGOUT_USER, logoutUser)
}

function* loginSaga() {
    yield all([
        fork(watchUserLogin),
        fork(watchUserLogout),
    ]);
}

export default loginSaga;