(function () {
    const identityTokenPattern = /(invite_token|confirmation_token|recovery_token|email_change_token|access_token)=/;
    const identityPayload = `${window.location.search || ""}${window.location.hash || ""}`;
    const isAdmin = window.location.pathname.replace(/\/+$/, "").endsWith("/admin");

    if (!isAdmin && identityTokenPattern.test(identityPayload)) {
        window.location.replace(`/admin/${window.location.search || ""}${window.location.hash || ""}`);
        return;
    }

    if (!window.netlifyIdentity) return;

    window.netlifyIdentity.on("init", () => {
        if (identityTokenPattern.test(identityPayload)) {
            window.netlifyIdentity.open();
        }
    });

    window.netlifyIdentity.on("login", () => {
        if (!isAdmin) window.location.href = "/admin/";
    });
}());
