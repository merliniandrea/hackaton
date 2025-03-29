<?php
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["method"])) {
    $method = $_POST["method"];
    $api_url = "http://localhost/api/user";

    $data = [
        "username" => $_POST["username"] ?? "",
        "email" => $_POST["email"] ?? "",
        "password" => $_POST["password"] ?? "",
    ];

    if ($method === "GET") {
        $query = http_build_query($data);
        $api_url .= "?$query";
        $response = file_get_contents($api_url);
    } else {
        $options = [
            "http" => [
                "method" => $method,
                "header" => "Content-Type: application/json\r\n",
                "content" => json_encode($data),
                "ignore_errors" => true
            ]
        ];
        $context = stream_context_create($options);
        $response = file_get_contents($api_url, false, $context);
    }

    $output = $response ?: "Errore nella richiesta API.";
}
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form con API</title>
</head>
<body>
    <h2>Invia Dati con Diversi Metodi HTTP</h2>
    <form method="post">
        <label>Username: <input type="text" name="username" required></label><br><br>
        <label>Email: <input type="email" name="email"></label><br><br>
        <label>Password: <input type="password" name="password" required></label><br><br>

        <button type="submit" name="method" value="GET">Invia con GET</button>
        <button type="submit" name="method" value="POST">Invia con POST</button>
        <button type="submit" name="method" value="PUT">Invia con PUT</button>
        <button type="submit" name="method" value="DELETE">Invia con DELETE</button>
    </form>

    <?php if (isset($output)): ?>
        <h3>Risposta del Server:</h3>
        <textarea rows="10" cols="50" readonly><?php echo htmlspecialchars($output); ?></textarea>
    <?php endif; ?>
</body>
</html>
