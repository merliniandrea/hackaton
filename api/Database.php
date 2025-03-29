<?php
class Database {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        $config = include('config.php');
        $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8";
        try {
            $this->pdo = new PDO($dsn, $config['user'], $config['password']);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die(json_encode(["error" => "Errore connessione DB: " . $e->getMessage()]));
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->pdo;
    }
}
?>
