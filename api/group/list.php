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
$group_id = isset($_GET["id"]) ? intval($_GET["id"]) : null;

if (!$group_id) {
    response(["error" => "ID gruppo obbligatorio"], 400);
}


// Connessione al database
$conn = new mysqli($host, $db_user, $db_password, $dbname);
if ($conn->connect_error) {
    response(["error" => "Errore connessione al database: " . $conn->connect_error], 500);
}

// Verifica se l'utente esiste
$stmt = $conn->prepare("SELECT g.nome AS `group`, u.nome, u.cognome FROM h_users AS u JOIN h_user_groups AS ug ON ug.user_id = u.id JOIN h_groups AS g ON ug.group_id = g.id WHERE group_id = ?");
$stmt->bind_param("i", $group_id);
$stmt->execute();
$result = $stmt->get_result();

$stmt->close();

$users = [];
$group;
while ($row = $result->fetch_assoc()) {
    // Aggiungiamo nome, cognome e ID del gruppo nell'array
    $users[] = [
        'nome' => $row['nome'],
        'cognome' => $row['cognome']
    ];
    $group = $row['group'];
}

// Risposta JSON con i dati ottenuti
response(["message" => "Gruppi trovati", "group" => $group, "users" => $users], 200);

$stmt->close();
$conn->close();
?>