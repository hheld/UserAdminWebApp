export function getCsrfToken() {
    var result = /(?:^Csrf-token|;\s*Csrf-token)=(.*?)(?:;|$)/g.exec(document.cookie);
    return (result === null) ? null : result[1];
}
