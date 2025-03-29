<?php
header("Content-Type: application/json");
require_once 'user.php';

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));

if (count($requestUri) < 2 || $requestUri[0] !== 'api') {
    echo json_encode(["error" => "Endpoint non valido"]);
    exit;
}

$resource = $requestUri[1];

if ($resource === 'user') {
    $user = new User();
    switch ($method) {
        case 'GET':
            echo isset($_GET['email']) ? $user->login($_GET['email']) : json_encode(["error" => "Email richiesta"]);
            break;
        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            echo isset($data['email'], $data['password']) ? $user->signup($data['email'], $data['password']) : json_encode(["error" => "Dati mancanti"]);
            break;
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            echo isset($data['id'], $data['email'], $data['password']) ? $user->update($data['id'], $data['email'], $data['password']) : json_encode(["error" => "Dati mancanti"]);
            break;
        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"), true);
            echo isset($data['id']) ? $user->delete($data['id']) : json_encode(["error" => "ID mancante"]);
            break;
        default:
            echo json_encode(["error" => "Metodo non supportato"]);
    }
} else {
    echo json_encode(["error" => "Risorsa non trovata"]);
}
