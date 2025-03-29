<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Risposta per la richiesta OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Attiva la visualizzazione degli errori per il debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../config.php';  // Includi il file di configurazione per la connessione al database

// Controlla che la richiesta sia DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    response(["error" => "Metodo non supportato. Usa DELETE."], 405);
}

// Ottieni i dati inviati nel corpo della richiesta (l'email dell'utente)
$data = json_decode(file_get_contents("php://input"), true);

// Verifica che l'email sia stata fornita
if (!isset($data["email"])) {
    response(["error" => "Email mancante"], 400);
}

$email = trim($data["email"]);

// Verifica la validità dell'email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    response(["error" => "Email non valida"], 400);
}


// Connessione al database
$conn = new mysqli($host, $db_user, $db_password, $dbname);

if ($conn->connect_error) {
    response(["error" => "Errore connessione al database"], 500);
}

// Verifica se l'utente esiste nel database
$stmt = $conn->prepare("SELECT id FROM h_users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    response(["error" => "Utente non trovato"], 404);
}

// Esegui la query per eliminare l'utente
$stmt = $conn->prepare("DELETE FROM h_users WHERE email = ?");
$stmt->bind_param("s", $email);

if ($stmt->execute()) {
    response(["message" => "Utente cancellato con successo"], 200);
} else {
    response(["error" => "Errore durante la cancellazione dell'utente"], 500);
}

$stmt->close();
$conn->close();
?>
