<?php
// Adjust PHP settings to allow larger file uploads
ini_set('upload_max_filesize', '64M');
ini_set('post_max_size', '64M');

$uploadsDirectory = 'uploads/';

// Check if the 'uploads' folder exists, and if not, create it
if (!file_exists($uploadsDirectory)) {
    mkdir($uploadsDirectory, 0777, true); // Create the folder with full permissions
}

if(isset($_FILES['fileInput'])){
    $fileInputs = $_FILES['fileInput'];
    $fileNames = array();

    // Loop through each file input
    for ($i = 0; $i < count($fileInputs['name']); $i++) {
        if(isset($fileInputs['name'][$i]) && $fileInputs['error'][$i] === UPLOAD_ERR_OK) {
            $fileName = $fileInputs['name'][$i];
            $fileTmpName = $fileInputs['tmp_name'][$i];
            $fileSize = $fileInputs['size'][$i];
            $fileError = $fileInputs['error'][$i];

            // Ensure the destination path has the correct directory separator and is absolute
            $destination = $uploadsDirectory . DIRECTORY_SEPARATOR . $fileName;

            // Move the uploaded file to the destination directory
            if (move_uploaded_file($fileTmpName, $destination)) {
                $fileNames[] = $destination; // Add file name to the array
            } else {
                echo "Error moving uploaded file '$fileName'.<br>";
            }
        }
    }

    // Return file names separated by a comma
    echo implode(',', $fileNames);
}
?>
