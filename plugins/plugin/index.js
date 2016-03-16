import React from 'react';
import ReactDOM from 'react-dom';

const SambaConfig  = () => {
    return (<p>I'm a component from the samba plugin!!</p>)
};

ReactDOM.render(
    <SambaConfig />,
    document.getElementById('mount-point')
);

function getCsrfToken() {
    var result = /(?:^Csrf-token|;\s*Csrf-token)=(.*?)(?:;|$)/g.exec(document.cookie);
    return (result === null) ? null : result[1];
}
