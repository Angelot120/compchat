<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Invitation spéciale</title>
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="text-align: center; padding: 20px;">
        <h3>CompChat</h3>
        <h3>Bonjour,</h3>
        <br>
        <h4>{{ $senderName }} ({{ $email }}) a envoyé fichier {{ $fileType }} dans le groupe :
            {{ $group }}. Veuillez
            accéder au
            groupe via ce <a href="http://localhost:5173/">lien</a></h4>
    </div>
</body>

</html>
