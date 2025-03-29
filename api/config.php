<?php

    $host = 'localhost';
    $dbname = 'hackerini';
    $db_user = 'inb5';
    $db_password = 'Kdevbf8-';
    function response($data, $status = 200)
    {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }
?>
