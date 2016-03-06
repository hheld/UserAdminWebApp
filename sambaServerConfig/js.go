package main

const jsGetCsrfToken = `
function getCsrfToken() {
   var result = /(?:^Csrf-token|;\s*Csrf-token)=(.*?)(?:;|$)/g.exec(document.cookie);
   return (result === null) ? null : result[1];
}`

const jsSendFormValuesAndUpdateDoc = `
function sendFormData(data) {
    var csrfToken = getCsrfToken();
    var xhttp = new XMLHttpRequest();
    var dataAsQueryStr = '';
    var first = true;

    for (var d in data) {
        if (!data.hasOwnProperty(d)) {
            //The current property is not a direct property of d
            continue;
        }

        dataAsQueryStr += (first ? '' : '&') + d + '=' + data[d];

        first = false;
    }

    xhttp.open("POST", "/plugin/SambaConfig", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader("X-Csrf-token", csrfToken);
    xhttp.send(dataAsQueryStr);

    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            document.open();
            document.write(xhttp.responseText);
            document.close();
        }
    }
}`
