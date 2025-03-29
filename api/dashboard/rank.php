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

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    response(["error" => "Metodo non supportato. Usa GET."], 405);
}

// Recupero parametri
$user_id = isset($_GET["id"]) ? intval($_GET["id"]) : null;

if (!$user_id) {
    response(["error" => "ID utente obbligatorio"], 400);
}
// Connessione al database
$conn = new mysqli($host, $db_user, $db_password, $dbname);
if ($conn->connect_error) {
    response(["error" => "Errore connessione al database: " . $conn->connect_error], 500);
}
// Recupera i gruppi dell'utente
$stmt = $conn->prepare("SELECT g.id, g.nome FROM h_user_groups hg JOIN h_groups g ON hg.group_id = g.id WHERE hg.user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$groups = [];
while ($row = $result->fetch_assoc()) {
    $groups[] = ["id" => $row['id'], "name" => $row['nome']];
}
$stmt->close();

$output = [];

foreach ($groups as $group) {
    $stmt = $conn->prepare("
        SELECT 
            u.nome AS user_name, 
            u.cognome AS user_surname, 
            (hr.social + hr.streaming + hr.gaming + hr.ecommerce) AS total_score 
        FROM h_user_groups hg 
        JOIN h_users u ON hg.user_id = u.id 
        JOIN h_weekly_reports hr ON u.id = hr.user_id 
        WHERE hg.group_id = ? 
        ORDER BY total_score ASC 
        LIMIT 3;
    ");
    $stmt->bind_param("i", $group["id"]);
    $stmt->execute();
    $result = $stmt->get_result();

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = [
            "name" => $row["user_name"],
            "surname" => $row["user_surname"],
            "points" => intval($row["total_score"]) // Converto in intero per coerenza
        ];
    }
    $stmt->close();

    if (!empty($users)) {
        $output[] = [
            "group" => $group["name"],
            "users" => $users
        ];
    }
}

$conn->close();
echo json_encode($output, JSON_PRETTY_PRINT);
?>
