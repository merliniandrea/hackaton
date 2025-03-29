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

// Verifica la presenza dei parametri richiesti
$user_id = isset($_GET["id"]) ? intval($_GET["id"]) : null;

if (!$user_id) {
    response(["error" => "ID utente obbligatorio"], 400);
}


// Connessione al database
$conn = new mysqli($host, $db_user, $db_password, $dbname);
if ($conn->connect_error) {
    response(["error" => "Errore connessione al database: " . $conn->connect_error], 500);
}

// Verifica se l'utente esiste
$stmt = $conn->prepare("SELECT id FROM h_users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    response(["error" => "Utente non trovato"], 404);
}
$stmt->close();

// Recupera i dati del report giornaliero
$stmt = $conn->prepare("
    SELECT social, streaming, gaming, ecommerce, report_date 
    FROM h_daily_reports 
    WHERE user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    response(["error" => "Nessun report trovato per la data specificata"], 404);
}

$report = $result->fetch_assoc();
response(["message" => "Report trovato", "data" => $report], 200);

$stmt->close();
$conn->close();
?>
