import { useParams } from 'react-router-dom';
import InvalidVerificationToken from '../features/auth/Components/InvalidVerificationToken';
import VerificationConfirmAccount from '../features/auth/Components/VerificationConfirmAccount';
import AccountVerificationCompleted from '../features/auth/Components/AccountVerificationCompleted';
import useEmailVerification from '../hooks/auth/useEmailVerification';
import Animation from '../features/common/Animation';


const UserVerificationConfirmAccount = () => {
  document.title = "Confirm Account";

  const { token } = useParams();

  const { isLoading, isValidToken, verificationCompleted, userAccountVerification } = useEmailVerification(token);

  if ((isValidToken === null && verificationCompleted === null) || isLoading) {
    return <Animation />;
  }

  if (verificationCompleted) {
    return <AccountVerificationCompleted />;
  } else {
    return (
      isValidToken ? <VerificationConfirmAccount token={token} userAccountVerification={userAccountVerification} /> : <InvalidVerificationToken />
    )
  }
}

export default UserVerificationConfirmAccount