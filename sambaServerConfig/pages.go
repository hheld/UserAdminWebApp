package main

const mainPage = `
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Samba configuration</title>
	</head>
	<body>
		<p>Hello from Samba plugin. {{ .Method }}</p>
		<form id="form_2">
            <label id="h2" form="form_2">Namenseingabe</label>
            <label for="vorname">Vorname</label>
            <input type="text" id="vorname" maxlength="30">

            <label for="zuname">Zuname</label>
            <input type="text" id="zuname" maxlength="40">

            <button type="button" onClick="onSubmitClicked()">Eingaben absenden</button>
        </form>

        <script>
            {{ range .JsFuncs }}{{ . }}{{ end }}

            function onSubmitClicked() {
                var vn = document.getElementById('vorname').value;
                var nn = document.getElementById('zuname').value;

                sendFormData({
                    firstName: vn,
                    lastName: nn
                });
            }
        </script>
	</body>
</html>`
