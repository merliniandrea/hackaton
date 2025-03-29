<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Attiva la visualizzazione degli errori per il debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Risposta per la richiesta OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include '../config.php';

// Controlla che la richiesta sia POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    response(["error" => "Metodo non supportato. Usa POST."], 405);
}

// Ottieni i dati inviati nel corpo della richiesta
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    response(["error" => "Dati mancanti o formattazione errata"], 400);
}

// Verifica la presenza dei campi obbligatori
$nome = isset($data["nome"]) ? trim($data["nome"]) : null;
$cognome = isset($data["cognome"]) ? trim($data["cognome"]) : null;
$email = isset($data["email"]) ? trim($data["email"]) : null;
$password = isset($data["password"]) ? trim($data["password"]) : null;

if (!$nome || !$cognome || !$email || !$password) {
    response(["error" => "Tutti i campi sono obbligatori"], 400);
}

// Validazione email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    response(["error" => "Email non valida"], 400);
}

// Connessione al database
$conn = new mysqli($host, $db_user, $db_password, $dbname);

if ($conn->connect_error) {
    response(["error" => "Errore connessione al database"], 500);
}

// Controlla se l'email è già registrata
$stmt = $conn->prepare("SELECT id FROM h_users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    response(["error" => "Email già in uso"], 409);
}

$stmt->close();


// Inserisci l'utente nel database
$stmt = $conn->prepare("INSERT INTO h_users (nome, cognome, email, password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nome, $cognome, $email, $password);

if ($stmt->execute()) {
    $stmt = $conn->prepare("SELECT id FROM h_users WHERE email = ?");
    $stmt->bind_param("s", $email);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        $id = $user["id"];

        response(["message" => "Sigup effettuato con successo", "id" => $id], 200);

    } else {
        response(["error" => "Errore durante la registrazione"], 500);

    }
} else {
    response(["error" => "Errore durante la registrazione"], 500);
}

$stmt->close();
$conn->close();
?>