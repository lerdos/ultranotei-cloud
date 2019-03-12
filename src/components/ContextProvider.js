import React from 'react';
import { withRouter } from 'react-router';

import AuthHelper from '../helpers/AuthHelper';
import ApiHelper from '../helpers/ApiHelper';
import useAppState from './useAppState';


export const AppContext = React.createContext();
const Auth = new AuthHelper();

const AppContextProvider = props => {
  const [state, dispatch] = useAppState(Auth);
  const Api = new ApiHelper({ Auth, state });

  const loginUser = (e, email, password, twoFACode) => {
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Auth.login(email, password, twoFACode)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'REDIRECT_TO_REFERRER', value: true });
          // this.initApp();
        } else {
          dispatch({ type: 'DISPLAY_MESSAGE', message: res.message });
        }
      })
      .catch(err => {
        dispatch({ type: 'DISPLAY_MESSAGE', message: `ERROR ${err}` });
      })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const signUpUser = (e, userName, email, password) => {
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.signUpUser(userName, email, password)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = 'Please check your email and follow the instructions to activate your account.';
          return props.history.replace('/login');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const resetPassword = (e, email) => {
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let message;
    Api.resetPassword(email)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = 'Please check your email and follow instructions to reset password.';
          Auth.logout();
          // this.clearApp();
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const resetPasswordConfirm = (e, password, token) => {
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.resetPasswordConfirm(password, token)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = (<>Password successfully changed.<br />Please log in.</>);
          return props.history.replace('/login');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const logoutUser = () => {
    // this.clearApp();
    Auth.logout();
    dispatch({ type: 'REDIRECT_TO_REFERRER', value: false });
    props.history.replace('/');
  };

  const getQRCode = () => {};
  const updateUser = () => {};
  const update2FA = () => {};

  const actions = {
    loginUser,
    signUpUser,
    resetPassword,
    resetPasswordConfirm,
    logoutUser,
    getQRCode,
    updateUser,
    update2FA,
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {props.children}
    </AppContext.Provider>
  )
};

export default withRouter(AppContextProvider);
