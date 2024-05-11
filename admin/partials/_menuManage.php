<?php
    include '_dbconnect.php';

if($_SERVER["REQUEST_METHOD"] == "POST") {

    if(isset($_POST['createItem'])) {
        $name = $_POST["name"];
        $description = $_POST["description"];
        $categoryId = $_POST["categoryId"];
        $price = $_POST["price"];

        $sql = "INSERT INTO `products` (`prodName`, `price`, `desc`, `prodCategorieId`, `date`) VALUES ('$name', '$price', '$description', '$categoryId', current_timestamp())";   
        $result = mysqli_query($conn, $sql);
        $prodId = $conn->insert_id;
        if ($result){
            $check = getimagesize($_FILES["image"]["tmp_name"]);
            if($check !== false) {
                
                $newName = 'parfum-'.$prodId;
                $newfilename=$newName .".jpg";

                $uploaddir = $_SERVER['DOCUMENT_ROOT'].'/Parfume_site/img/';
                $uploadfile = $uploaddir . $newfilename;

                if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadfile)) {
                    echo "<script>alert('success');
                            window.location=document.referrer;
                        </script>";
                } else {
                    echo "<script>alert('failed');
                            window.location=document.referrer;
                        </script>";
                }

            }
            else{
                echo '<script>alert("Please select an image file to upload.");
                        window.location=document.referrer;
                    </script>';
            }
        }
        else {
            echo "<script>alert('failed');
                    window.location=document.referrer;
                </script>";
        }
    }
    if(isset($_POST['removeItem'])) {
        $prodId = $_POST["prodId"];
        $sql = "DELETE FROM `products` WHERE `prodId`='$prodId'";   
        $result = mysqli_query($conn, $sql);
        $filename = $_SERVER['DOCUMENT_ROOT']."/Parfume_site/img/pizza-".$prodId.".jpg";
        if ($result){
            if (file_exists($filename)) {
                unlink($filename);
            }
            echo "<script>alert('Removed');
                window.location=document.referrer;
            </script>";
        }
        else {
            echo "<script>alert('failed');
            window.location=document.referrer;
            </script>";
        }
    }
    if(isset($_POST['updateItem'])) {
        $prodId = $_POST["prodId"];
        $prodName = $_POST["name"];
        $desc = $_POST["desc"];
        $price = $_POST["price"];
        $prodCategorieId = $_POST["catId"];

        $sql = "UPDATE `products` SET `prodName`='$prodName', `price`='$price', `desc`='$desc', `prodCategorieId`='$prodCategorieId' WHERE `prodId`='$prodId'";   
        $result = mysqli_query($conn, $sql);
        if ($result){
            echo "<script>alert('update');
                window.location=document.referrer;
                </script>";
        }
        else {
            echo "<script>alert('failed');
                window.location=document.referrer;
                </script>";
        }
    }
    if(isset($_POST['updateItemPhoto'])) {
        $prodId = $_POST["prodId"];
        $check = getimagesize($_FILES["itemimage"]["tmp_name"]);
        if($check !== false) {
            $newName = 'parfum-'.$prodId;
            $newfilename=$newName .".jpg";

            $uploaddir = $_SERVER['DOCUMENT_ROOT'].'/Parfume_site/img/';
            $uploadfile = $uploaddir . $newfilename;

            if (move_uploaded_file($_FILES['itemimage']['tmp_name'], $uploadfile)) {
                echo "<script>alert('success');
                        window.location=document.referrer;
                    </script>";
            } else {
                echo "<script>alert('failed');
                        window.location=document.referrer;
                    </script>";
            }
        }
        else{
            echo '<script>alert("Please select an image file to upload.");
            window.location=document.referrer;
                </script>';
        }
    }
}
?>