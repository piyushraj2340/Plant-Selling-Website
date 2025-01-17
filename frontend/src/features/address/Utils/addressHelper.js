export function loadingState(state) {
    state.isLoading = true;
    state.isRedirectAllowed = null;
    state.error = null;
}

export function errorState(state, action) {
    state.isLoading = false;
    state.isRedirectAllowed = false;
    state.error = action.error;
}

export function fulfilledState(state, isRedirectAllowed) {
    state.isLoading = false;
    state.isRedirectAllowed = isRedirectAllowed;
    state.error = null;
}
