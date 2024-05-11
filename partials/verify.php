<?php
session_start();
include("_dbconnect.php");
require 'vendor/autoload.php'; // Path to Composer autoload


if (isset($_GET['token'])) {
    $token = $_GET['token'];
    $query = "UPDATE `users` SET isEmailVerified = '1' WHERE token = '$token'";
    $result = mysqli_query($conn, $query);

    
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/verified.css">
    <title>Verification page</title>
</head>
<body>
    <?php 
    if ($result) {
        echo "<h3>Email verification successful. You can now <a href='_handleLogin.php'>login</a>.</h3>";
    } else {
        echo "<h3>Email verification failed. Please contact support.</h3>";
            
    }
} else {
    echo "<h3>Invalid verification link.</h3>";
}
?>
</body>
</html>
