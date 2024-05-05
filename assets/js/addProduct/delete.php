<?php
// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if productId is set in the POST data
    if (isset($_POST["productId"])) {
        // Get the productId from POST data
        $productId = $_POST["productId"];

        // Perform any necessary validation/sanitization on productId
        // For example, you might want to ensure it's an integer and sanitize it to prevent SQL injection

        // Connect to your database (assuming MySQL for this example)
        $servername = "localhost";
        $username = "username";
        $password = "password";
        $dbname = "your_database";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Prepare SQL statement to delete the product
        $sql = "DELETE FROM products WHERE id = ?";

        // Prepare and bind the statement
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $productId);

        // Execute the statement
        if ($stmt->execute()) {
            // Deletion successful
            $response = array("success" => true, "message" => "Product deleted successfully.");
        } else {
            // Deletion failed
            $response = array("success" => false, "message" => "Error deleting product: " . $conn->error);
        }

        // Close the statement and connection
        $stmt->close();
        $conn->close();

        // Send JSON response
        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        // productId not provided in POST data
        $response = array("success" => false, "message" => "Product ID not provided.");
        // Send JSON response
        header('Content-Type: application/json');
        echo json_encode($response);
    }
} else {
    // Invalid request method
    $response = array("success" => false, "message" => "Invalid request method.");
    // Send JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
