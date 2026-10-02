<?php

/**
 * PAUD-KB Nurul Ilmi Sumberadi
 * Laravel-compatible built-in server router
 */

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''
);

// Jika file statis (CSS, JS, gambar, SVG) ada di direktori, sajikan langsung
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// Default ke index.html
require_once __DIR__ . '/index.html';
