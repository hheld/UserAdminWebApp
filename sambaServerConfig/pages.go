package main

const mainPage = `
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Samba configuration</title>
	</head>
	<body>
		<p>Hello from Samba plugin. {{.Method}}</p>
		<form id="form_2">
            <label id="h2" form="form_2">Namenseingabe</label>
            <label for="vorname">Vorname</label>
            <input type="text" id="vorname" maxlength="30">

            <label for="zuname">Zuname</label>
            <input type="text" id="zuname" maxlength="40">

            <button type="button" onClick="sendFormData()">Eingaben absenden</button>
        </form>

        <script>
            function getCsrfToken() {
               var result = /(?:^Csrf-token|;\s*Csrf-token)=(.*?)(?:;|$)/g.exec(document.cookie);
               return (result === null) ? null : result[1];
            }

            function sendFormData() {
                var csrfToken = getCsrfToken();
                var xhttp = new XMLHttpRequest();

                xhttp.open("POST", "/plugin/SambaConfig", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.setRequestHeader("X-Csrf-token", csrfToken);
                xhttp.send("vorname=TEST_VORNAME&nachname=TEST_NACHNAME");

                xhttp.onreadystatechange = function() {
                    if(xhttp.readyState == 4 && xhttp.status == 200) {
                        document.write(xhttp.responseText);
                    }
                }
            }
        </script>
	</body>
</html>`
