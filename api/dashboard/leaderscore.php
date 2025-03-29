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


// Connessione al database
$conn = new mysqli($host, $db_user, $db_password, $dbname);
if ($conn->connect_error) {
    response(["error" => "Errore connessione al database: " . $conn->connect_error], 500);
}

// Recupera i dati con il punteggio totale e restituisci in formato JSON
$stmt = $conn->prepare("
    SELECT 
        u.nome, 
        u.cognome, 
        SUM(w.social + w.streaming + w.gaming + w.ecommerce) AS total_score
    FROM 
        h_weekly_reports w
    JOIN 
        h_users u ON w.user_id = u.id
    GROUP BY 
        u.id
    ORDER BY
        total_score ASC
");

$stmt->execute();
$result = $stmt->get_result();

$users = [];
while ($row = $result->fetch_assoc()) {
    // Aggiungi ogni utente con nome, cognome e punteggio
    $users[] = [
        "nome" => $row["nome"],
        "cognome" => $row["cognome"],
        "point" => $row["total_score"]
    ];
}

if (empty($users)) {
    response(["error" => "Nessun dato trovato per l'utente"], 404);
}

// Rispondi con i dati in formato JSON
response(["message" => "Dati trovati", "data" => $users], 200);

$stmt->close();
$conn->close();

?>
