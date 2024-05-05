let imageFile = null;
const apiKeys = ['pTfXUQg5TDjBZBV19dfdWYQN', 'jvAk9opEnK85Yt3XsYuEV3CZ', 'RxoTT7eqoXkyhs4GcdzULvfC']; // only 2,3 api key is working Array of API keys
let currentApiKeyIndex = 0;

async function removeBackground(imageFile, onProgress) {
    const apiKey = apiKeys[currentApiKeyIndex];
    if (!apiKey) {
        throw new Error('No API key available');
    }

    const formData = new FormData();
    formData.append('image_file', imageFile);
    formData.append('size', 'regular'); // Specify the desired output size

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
            'X-Api-Key': apiKey,
        },
        body: formData,
        // Track progress of the upload
        onProgress: onProgress
    });

    if (!response.ok) {
        // If the request fails with the current API key, try the next one
        currentApiKeyIndex++;
        if (currentApiKeyIndex < apiKeys.length) {
            return removeBackground(imageFile, onProgress);
        } else {
            throw new Error('Failed to remove background with all API keys');
        }
    }

    return await response.blob();
}

async function handleImageUpload(event) {
    imageFile = event.target.files[0];
    if (!imageFile) return;

    // Automatically trigger previewImage function
    await previewImage();
}

async function previewImage() {
    if (!imageFile) {
        console.error('No image selected');
        return;
    }

    try {
        const progressBar = document.getElementById('loading-progress');
        
        // Update progress bar while loading
        const onProgress = (event) => {
            const progress = (event.loaded / event.total) * 100;
            progressBar.style.width = `${progress}%`;
        };

        const removedBackgroundBlob = await removeBackground(imageFile, onProgress);

        // Once the background is removed, set the progress to 100%
        progressBar.style.width = '100%';

        const imageUrl = URL.createObjectURL(removedBackgroundBlob);

        const outputContainer = document.getElementById('output');
        outputContainer.innerHTML = `<img src="${imageUrl}" alt="Background Removed Image">`;
    } catch (error) {
        console.error('Error removing background:', error);
    }
}

 