<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"), true);

// Credenziali database
$host = "localhost"; // Cambia se necessario
$username = "root";  // Cambia con il tuo username MySQL
$password = "";      // Cambia con la tua password MySQL
$database = "hackaton";

// Connessione al database
$conn = new mysqli($host, $username, $password, $database);
if ($conn->connect_error) {
    response(["error" => "Errore connessione DB: " . $conn->connect_error], 500);
}

switch ($method) {
    case "GET":
        $username = isset($_GET["username"]) ? urldecode($_GET["username"]) : null;
        $password = isset($_GET["password"]) ? urldecode($_GET["password"]) : null;
        if ($username) {
            $stmt = $conn->prepare("SELECT * FROM user WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            if ($result) {
                if ($password && $result["password"] === $password) {
                    response(["message" => "Utente trovato", "logged" => "true"]);
                } else {
                    response(["message" => "Utente trovato", "logged" => "false"]);
                }
            } else {
                response(["error" => "Utente non trovato"], 404);
            }
        } else {
            response(["error" => "Username richiesto per la ricerca"], 400);
        }
        break;

    case "POST":
        if (!isset($data["username"]) || !isset($data["email"]) || !isset($data["password"])) {
            response(["error" => "Dati mancanti"], 400);
        }
        
        $username = urldecode($data["username"]);
        $email = urldecode($data["email"]);
        $password = urldecode($data["password"]);

        $stmt = $conn->prepare("INSERT INTO user (username, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $email, $password);
        $result = $stmt->execute();
        $stmt->close();

        if ($result) {
            response(["message" => "Utente creato", "username" => $username]);
        } else {
            response(["error" => "Errore durante la creazione. Username già esistente?"], 500);
        }
        break;

    case "PUT":
        if (!isset($data["username"]) || !isset($data["password"])) {
            response(["error" => "Dati mancanti"], 400);
        }
        $stmt = $conn->prepare("UPDATE user SET password = ? WHERE username = ?");
        $stmt->bind_param("ss", $data["password"], $data["username"]);
        $stmt->execute();
        $affected = $stmt->affected_rows;
        $stmt->close();

        if ($affected > 0) {
            response(["message" => "Password aggiornata"]);
        } else {
            response(["error" => "Utente non trovato"], 404);
        }
        break;

    case "DELETE":
        if (!isset($data["username"])) {
            response(["error" => "Username richiesto per eliminare un utente"], 400);
        }
        $stmt = $conn->prepare("DELETE FROM user WHERE username = ?");
        $stmt->bind_param("s", $data["username"]);
        $stmt->execute();
        $affected = $stmt->affected_rows;
        $stmt->close();

        if ($affected > 0) {
            response(["message" => "Utente eliminato"]);
        } else {
            response(["error" => "Utente non trovato"], 404);
        }
        break;

    default:
        response(["error" => "Metodo non supportato"], 405);
}

$conn->close();

// Funzione helper per inviare risposte JSON
function response($data, $status = 200)
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}
