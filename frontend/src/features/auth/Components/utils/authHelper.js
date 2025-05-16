import { message } from "antd";

const loadingRestAuthStore = (state) => {
    //! Checking for invalid state or state is null 
    if (!state) {
        message.error("Invalid State information for authSlice");
        return;
    }

    //^ Reset the other values 
    state.isUserVerificationNeeded = null;
    state.isUserTwoFactorAuthNeeded = null;
    state.twoFactorAuthNeededToken= null;
    state.isValidTokenTwoFactor= null;
    state.isOtpValidationDone = null;
    state.isOtpResendSuccessful = null;
    state.email = '';
    state.isValidToken = null;
    state.verificationCompleted = null;
    state.isValidTokenPassword = null;
    state.passwordChangeSuccessful = null;
    state.error = null;

    //* Only set the loading state 
    state.isLoading = true;
}

const trueAuthCheckResetAuthStore = (state) => {
    //! Checking for invalid state or state is null 
    if (!state) {
        message.error("Invalid State information for authSlice");
        return;
    }

    //^ Reset the other values 
    state.isUserVerificationNeeded = false;
    state.isUserTwoFactorAuthNeeded= false;
    state.twoFactorAuthNeededToken= false;
    state.isValidTokenTwoFactor= false;
    state.isOtpValidationDone = null;
    state.isOtpResendSuccessful = null;
    state.email = '';
    state.isValidToken = false;
    state.verificationCompleted = false;
    state.isValidTokenPassword = false;
    state.passwordChangeSuccessful = false;
    state.error = null;
    state.isLoading = false;
    
}


const resetToDefaultAuthStore = (state) => {
    //! Checking for invalid state or state is null 
    if (!state) {
        message.error("Invalid State information for authSlice");
        return;
    }

    //^ Reset all the values 
    state.isUserVerificationNeeded = null;
    state.isUserTwoFactorAuthNeeded= null;
    state.twoFactorAuthNeededToken= null;
    state.isValidTokenTwoFactor= null;
    state.isOtpValidationDone = null;
    state.isOtpResendSuccessful = null;
    state.email = '';
    state.isValidToken = null;
    state.verificationCompleted = null;
    state.isValidTokenPassword = null;
    state.passwordChangeSuccessful = null;
    state.error = null;
    state.isLoading = null;
}

const userAccountVerificationAuthStore = (state) => {
    //! Checking for invalid state or state is null 
    if (!state) {
        message.error("Invalid State information for authSlice");
        return;
    }

    //^ Reset the other values 
    state.isUserVerificationNeeded = false;
    state.isUserTwoFactorAuthNeeded= false;
    state.twoFactorAuthNeededToken= false;
    state.isValidTokenTwoFactor= false;
    state.isOtpValidationDone = null;
    state.isOtpResendSuccessful = null;
    state.email = '';
    state.isValidToken = false;
    state.isValidTokenPassword = false;
    state.passwordChangeSuccessful = false;
    state.error = null;
    state.isLoading = false;
    
    //* Only set the verificationCompleted state true  
    state.verificationCompleted = true;
}


const validateVerificationTokenAuthStore = (state) => {
    //! Checking for invalid state or state is null 
    if (!state) {
        message.error("Invalid State information for authSlice");
        return;
    }

    //^ Reset the other values 
    state.isUserVerificationNeeded = false;
    state.isUserTwoFactorAuthNeeded= false;
    state.twoFactorAuthNeededToken= false;
    state.isValidTokenTwoFactor= false;
    state.isOtpValidationDone = null;
    state.isOtpResendSuccessful = null;
    state.email = '';
    state.error = null;
    state.verificationCompleted = false;
    state.passwordChangeSuccessful = false;
    state.isValidTokenPassword = false;
    state.isLoading = false;
    
    //* Only set the isValidToken state true  
    state.isValidToken = true;
}


const validatePasswordResetTokenAuthStore = (state) => {
    //! Checking for invalid state or state is null 
    if (!state) {
        message.error("Invalid State information for authSlice");
        return;
    }

    //^ Reset the other values 
    state.isUserVerificationNeeded = false;
    state.isUserTwoFactorAuthNeeded= false;
    state.twoFactorAuthNeededToken= false;
    state.isValidTokenTwoFactor= false;
    state.isOtpValidationDone = null;
    state.isOtpResendSuccessful = null;
    state.email = '';
    state.error = null;
    state.verificationCompleted = false;
    state.passwordChangeSuccessful = false;
    state.isValidToken = false;
    state.isLoading = false;
    
    //* Only set the isValidTokenPassword state true  
    state.isValidTokenPassword = true;
}

const validatePasswordResetAuthStore = (state) => {
    //! Checking for invalid state or state is null 
    if (!state) {
        message.error("Invalid State information for authSlice");
        return;
    }

    //^ Reset the other values 
    state.isUserVerificationNeeded = false;
    state.isUserTwoFactorAuthNeeded= false;
    state.twoFactorAuthNeededToken= false;
    state.isValidTokenTwoFactor= false;
    state.isOtpValidationDone = null;
    state.isOtpResendSuccessful = null;
    state.email = '';
    state.error = null;
    state.isValidToken = false;
    state.isLoading = false;
    state.isValidTokenPassword = false;
    state.verificationCompleted = false;
    
    //* Only set the passwordChangeSuccessful state true  
    state.passwordChangeSuccessful = true;
}


export { loadingRestAuthStore, trueAuthCheckResetAuthStore, resetToDefaultAuthStore, userAccountVerificationAuthStore, validateVerificationTokenAuthStore, validatePasswordResetTokenAuthStore, validatePasswordResetAuthStore }