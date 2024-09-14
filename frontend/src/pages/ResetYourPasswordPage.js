import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import PasswordResetTokenInvalid from "../features/auth/Components/PasswordResetTokenInvalid";
import PasswordChangeSuccessfully from "../features/auth/Components/PasswordChangeSuccessfully";
import ChangeYourPassword from "../features/auth/Components/ChangeYourPassword";
import { validatePasswordResetTokenAsync } from '../features/auth/authSlice';

const ResetYourPasswordPage = () => {
    document.title = "Change your password";

  let { isValidTokenPassword, passwordChangeSuccessful } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const { token } = useParams();

  useEffect(() => {
    dispatch(validatePasswordResetTokenAsync(token));
  }, [dispatch]);

  if(isValidTokenPassword === null && passwordChangeSuccessful === null) {
    return null;
  }
  
  if (passwordChangeSuccessful) {
    return <PasswordChangeSuccessfully />;
  } else {
    return (
        isValidTokenPassword ? <ChangeYourPassword token={token} /> : <PasswordResetTokenInvalid />
    )
  }
};

export default ResetYourPasswordPage;
