<?php
session_start();

include("_dbconnect.php");
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'C:\xampp\htdocs\Parfume_site\vendor\autoload.php'; // Path to Composer autoload

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $username = stripslashes($_POST['username']);
    $username = mysqli_real_escape_string($conn, $username);
    $firstName = stripslashes($_POST['firstName']);
    $firstName = mysqli_real_escape_string($conn, $firstName);
    $lastName = stripslashes($_POST['lastName']);
    $lastName = mysqli_real_escape_string($conn, $lastName);
    $email = stripslashes($_POST['email']);
    $email = mysqli_real_escape_string($conn, $email);
    $phone = stripslashes($_POST['phone']);
    $phone = mysqli_real_escape_string($conn, $phone);
    $password = stripslashes($_POST['password']);
    $password = mysqli_real_escape_string($conn, $password);
    $password_hashed = password_hash($password, PASSWORD_DEFAULT);
    $token = bin2hex(random_bytes(50));

    // Insert user data into the database
    $query = "INSERT into `users` (username, firstName, lastName, email, phone, userType, password, joinDate, isEmailVerified, token)
              VALUES ('$username', '$firstName', '$lastName', '$email', '$phone', '0', '$password_hashed', NOW(), '0', '$token')";
    $result = mysqli_query($conn, $query);

    if ($result) {
        // Send email verification
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'tudorcernei@gmail.com'; // Your Gmail username
            $mail->Password = 'hbif shff blbb xszr'; // Your Gmail app password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;

            //Recipients
            $mail->setFrom('tudorcernei@gmail.com', 'Parfume_site'); // Your Gmail address and your name
            $mail->addAddress($email, $username); // User's email and username
            $mail->addReplyTo('tudorcernei@gmail.com', 'Parfume_site'); // Your Gmail address and your name

            //Content
            $mail->isHTML(true);
            $mail->Subject = 'Email Verification';
            $mail->Body = "Click the following link to verify your email: <a href='http://localhost/Parfume_site'>Verify Email</a>";

            $mail->send();
            // echo "
            //   <div id='success-message'>
            //     <h3>You are registered successfully. Please check your email for verification.</h3>
            //     <p class='link'>Click here to <a href='login.php'>Login</a></p>
            //   </div>";
            echo "<script>alert('A verification email has been sent to your email address. Please check your inbox.');</script>";

        } catch (Exception $e) {
            echo "Mailer Error: {$mail->ErrorInfo}";
        }
    } else {
        echo "Please enter some valid information!";
    }
}
?>
