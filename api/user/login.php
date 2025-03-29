<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Attiva la visualizzazione degli errori per il debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../config.php';

// Controllo per il metodo GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    response(["error" => "Metodo non supportato. Usa GET."], 405);
}

// Verifica la presenza del parametro 'email'
$email = isset($_GET["email"]) ? urldecode($_GET["email"]) : null;
$password = isset($_GET["password"]) ? urldecode($_GET["password"]) : null;

if (!$email) {
    response(["error" => "Email richiesta per la ricerca"], 400);
}


// Connessione al database
$conn = new mysqli($host, $db_user, $db_password, $dbname);

if ($conn->connect_error) {
    response(["error" => "Errore connessione al database: " . $conn->connect_error], 500);
}

// Prepara la query per il recupero dell'utente
$stmt = $conn->prepare("SELECT id, password FROM h_users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $hashed_password = $user["password"];

    // Verifica la password con password_verify()
    if ($password && password_verify($password, $hashed_password)) {
        response(["message" => "Utente trovato", "logged" => "true", "id" => $user["id"]]);
    } else {
        response(["message" => "Password errata", "logged" => "false"]);
    }
} else {
    response(["error" => "Utente non trovato"], 404);
}

$stmt->close();
$conn->close();
?>
