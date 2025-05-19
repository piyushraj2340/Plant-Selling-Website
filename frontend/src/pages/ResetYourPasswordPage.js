import { useParams } from 'react-router-dom';
import PasswordResetTokenInvalid from "../features/auth/Components/PasswordResetTokenInvalid";
import PasswordChangeSuccessfully from "../features/auth/Components/PasswordChangeSuccessfully";
import ChangeYourPassword from "../features/auth/Components/ChangeYourPassword";
import useResetPassword from '../hooks/auth/useResetPassword';
import Animation from '../features/common/Animation';

const ResetYourPasswordPage = () => {
  document.title = "Change your password";

  const { token } = useParams();
  let { isLoading, isValidTokenPassword, passwordChangeSuccessful, validatePasswordReset } = useResetPassword(token);


  if ((isValidTokenPassword === null && passwordChangeSuccessful === null) || isLoading) {
    return <Animation />;
  }

  if (passwordChangeSuccessful) {
    return <PasswordChangeSuccessfully />;
  } else {
    return (
      isValidTokenPassword ? <ChangeYourPassword token={token} validatePasswordReset={validatePasswordReset} /> : <PasswordResetTokenInvalid />
    )
  }
};

export default ResetYourPasswordPage;
