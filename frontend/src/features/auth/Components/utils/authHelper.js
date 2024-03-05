export const handelUserLoginStatus = (userLoggedInStatus, message, navigate) => {
    if (userLoggedInStatus && userLoggedInStatus.status) {
        message.success(userLoggedInStatus.message);

        const [redirect, to] = window.location.search && window.location.search.split("=");
        navigate(redirect === "?redirect" ? to : "/profile");

        return;
    } else if (userLoggedInStatus && !userLoggedInStatus.status) {
        message.error(userLoggedInStatus.message);

        return;
    }
}