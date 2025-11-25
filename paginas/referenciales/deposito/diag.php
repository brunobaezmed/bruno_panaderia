<?php
// Diagnostic endpoint to help debug why the agregar.php partial may not load
header('Content-Type: application/json; charset=utf-8');
$base = __DIR__;
$agregar = $base . DIRECTORY_SEPARATOR . 'agregar.php';
$resp = [
    'ok' => true,
    'ts' => date('c'),
    'php_sapi' => php_sapi_name(),
    'php_version' => phpversion(),
    'cwd' => getcwd(),
    'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? null,
    'agregar_exists' => file_exists($agregar),
    'agregar_readable' => is_readable($agregar),
    'agregar_size' => file_exists($agregar) ? filesize($agregar) : 0,
    'agregar_path' => $agregar,
];
echo json_encode($resp);
?>
