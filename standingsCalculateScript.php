<?php

// URL Firebase Function
$url = "https://us-central1-tipovacka-c63cb.cloudfunctions.net/public/standings/calculate";

// Inicializace cURL session
$ch = curl_init($url);

// Nastavení cURL pro provedení POST requestu
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: 0'
]);

// Provedení POST requestu a získání odpovědi
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Kontrola chyby
if (curl_errno($ch)) {
    $errorMessage = curl_error($ch);
    $subject = "Error executing URL";
    $message = "Error occurred: $errorMessage";
} else if ($httpCode != 200) {
    // Kontrola HTTP status kódu, jiný než 200 znamená chybu
    $subject = "Error HTTP Response";
    $message = "HTTP Response Code: $httpCode\nResponse: $response";
} else {
    // Úspěšné provedení
    $subject = "Successful Execution";
    $message = "Script finished successfully at " . date("Y-m-d H:i:s") . "\nResponse: $response";
}

// Uzavření cURL session
curl_close($ch);

// Nastavení příjemce a odesílatele emailu
$to = 'sportovsky.info@gmail.com';
$headers = 'From: sportovsky.info@gmail.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

// Odeslání emailu
if (!mail($to, $subject, $message, $headers)) {
    // Logování, pokud odeslání selže
    error_log("Failed to send email to $to");
}
