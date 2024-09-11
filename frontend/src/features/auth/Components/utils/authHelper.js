import { message } from "antd";

const loadingRestAuthStore = (state) => {
    //! Checking for invalid state or state is null 
    if (!state) {
        message.error("Invalid State information for authSlice");
        return;
    }

    //^ Reset the other values 
    state.userAuthCheck = null;
    state.isUserVerificationNeeded = null;
    state.email = '';
    state.isValidToken = null;
    state.verificationCompleted = null;
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
    state.email = '';
    state.isValidToken = false;
    state.verificationCompleted = false;
    state.error = null;
    state.isLoading = false;
    
    //* Only set the user Auth Check state true  
    state.userAuthCheck = true;
}


const resetToDefaultAuthStore = (state) => {
    //! Checking for invalid state or state is null 
    if (!state) {
        message.error("Invalid State information for authSlice");
        return;
    }

    //^ Reset all the values 
    state.isUserVerificationNeeded = null;
    state.email = '';
    state.isValidToken = null;
    state.verificationCompleted = null;
    state.error = null;
    state.isLoading = null;
    state.userAuthCheck = null;
}

const userAccountVerificationAuthStore = (state) => {
    //! Checking for invalid state or state is null 
    if (!state) {
        message.error("Invalid State information for authSlice");
        return;
    }

    //^ Reset the other values 
    state.isUserVerificationNeeded = false;
    state.email = '';
    state.isValidToken = false;
    state.error = null;
    state.userAuthCheck = false;
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
    state.email = '';
    state.error = null;
    state.userAuthCheck = false;
    state.verificationCompleted = false;
    state.isLoading = false;
    
    //* Only set the isValidToken state true  
    state.isValidToken = true;
}


export { loadingRestAuthStore, trueAuthCheckResetAuthStore, resetToDefaultAuthStore, userAccountVerificationAuthStore, validateVerificationTokenAuthStore }