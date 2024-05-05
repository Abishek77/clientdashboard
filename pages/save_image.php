<?php
// Check if imageData is set and not empty
if (isset($_POST['imageData']) && !empty($_POST['imageData'])) {
    // Get the base64 image data
    $imageData = $_POST['imageData'];

    // Remove the data:image/png;base64 prefix
    $imageData = str_replace('data:image/png;base64,', '', $imageData);

    // Decode the base64 image data
    $imageData = base64_decode($imageData);

    // Set the file path where the image will be saved
    $filePath = 'uploads/photo_' . uniqid() . '.png';

    // Save the image to the file
    file_put_contents($filePath, $imageData);

    // Output success message
    echo 'Image saved successfully!';
} else {
    // Output error message
    echo 'Error: No image data received!';
}
?>
