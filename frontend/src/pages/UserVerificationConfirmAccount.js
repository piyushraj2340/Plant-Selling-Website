import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { validateVerificationTokenAsync } from '../features/auth/authSlice';
import InvalidVerificationToken from '../features/auth/Components/InvalidVerificationToken';
import VerificationConfirmAccount from '../features/auth/Components/VerificationConfirmAccount';
import AccountVerificationCompleted from '../features/auth/Components/AccountVerificationCompleted';


const UserVerificationConfirmAccount = () => {
  document.title = "Confirm Account";

  const { isValidToken, verificationCompleted } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const { token } = useParams();

  useEffect(() => {
    dispatch(validateVerificationTokenAsync(token));
  }, []);

  if (verificationCompleted) {
    return <AccountVerificationCompleted />;
  } else {
    return (
      isValidToken ? <VerificationConfirmAccount token={token} /> : <InvalidVerificationToken />
    )
  }
}

export default UserVerificationConfirmAccount