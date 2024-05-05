
const dbUser = JSON.parse(localStorage.getItem('dbUser'));
const cid = dbUser ? dbUser.cid : null;
const requestBody = JSON.stringify({ cid });

console.log("cid:",cid)
document.addEventListener("DOMContentLoaded", function() {
    // Get the dropdown menu element
    var dropdownMenu = document.getElementById("dropdownMenu");

    // Get the dropdown toggle button element
    var dropdownToggleButton = document.getElementById("dropdownMenuButton");

    // Function to toggle the dropdown menu
    function toggleDropdown() {
        if (dropdownMenu.classList.contains("show")) {
            dropdownMenu.classList.remove("show");
        } else {
            dropdownMenu.classList.add("show");
        }
    }

    // Function to fetch notifications from the API
    function fetchNotifications() {
        // API endpoint URL
        var apiUrl = 'https://minitgo.com/api/orders_notification.php';
        // API key
        var apiKey = 'be0fbece0783dc6732b25d5fee7886b9';
        // Client ID (replace 'YOUR_CID_VALUE' with the actual value from your application)
        

        // Prepare the request body
        var requestBody = {
            cid: cid
        };

        // Make API request to fetch notifications
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            renderNotifications(data.data);
            updateNotificationCount(data.data.length);
            playNotificationSound();
        })
        .catch(error => {
            console.error('Error fetching notifications:', error);
        });
    }

    // Function to update notification count
    function updateNotificationCount(count) {
        var notificationCountElement = document.getElementById('notificationCount');
        notificationCountElement.textContent = count;
    }

    // Function to play notification sound
    function playNotificationSound() {
        var notificationSound = document.getElementById('notificationSound');
        notificationSound.play();
    }

// Function to render notifications
function renderNotifications(notifications) {
    // Get the notification body element
    var notificationBody = document.getElementById("notificationbody");

    // Clear existing notifications
    notificationBody.innerHTML = '';

    // Check if there are any notifications
    if (notifications != null) {
        // Iterate over each notification and create HTML dynamically
        notifications.forEach(notification => {
            var notificationHtml = `
                <li class="mb-2">
                    <a class="dropdown-item border-radius-md" href="javascript:;">
                        <div class="d-flex py-1">
                            <div class="my-auto">
                                <img src="https://minitgo.com/assets/product-DZK5OcKX.png" class="avatar avatar-sm  me-3 ">
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                                <h6 class="text-sm font-weight-normal mb-1">
                                    <span class="font-weight-bold">Order ID:</span> ${notification.oid}
                                </h6>
                                <p class="text-xs text-secondary mb-0">
                                    <i class="fa fa-clock me-1"></i>
                                    <span class="font-weight-bold">Date:</span> ${notification.date}
                                </p>
                                <p class="text-xs text-secondary mb-0">
                                    <span class="font-weight-bold">Product ID:</span> ${notification.product_id}
                                </p>
                                <!-- Buttons for accepting and rejecting the notification -->
                                <div class="mt-2">
                                    <button class="acceptButton btn btn-success btn-sm me-2" data-notification-id="${notification.oid}">Accept</button>
                                    <button class="rejectButton btn btn-danger btn-sm" data-notification-id="${notification.oid}">Reject</button>
                                </div>
                            </div>
                        </div>
                    </a>
                </li>
            `;
            // Append the notification HTML to the notification body
            notificationBody.innerHTML += notificationHtml;
        });

        // Add event listeners to accept and reject buttons
        var acceptButtons = document.querySelectorAll('.acceptButton');
        acceptButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                var notificationId = this.dataset.notificationId;
                var clientStatus = 'accepted'; // Set client status to 'accepted'
                sendDataToAnotherAPI(notificationId, clientStatus);
                updateNotificationCount(notifications.length - 1); // Update notification count
            });
        });

        var rejectButtons = document.querySelectorAll('.rejectButton');
        rejectButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                var notificationId = this.dataset.notificationId;
                var clientStatus = 'rejected'; // Set client status to 'not_accepted'
                sendDataToAnotherAPI(notificationId, clientStatus);
                updateNotificationCount(notifications.length - 1); // Update notification count
            });
        });
    } else {
        // If no notifications, display a message
        notificationBody.innerHTML = '<li class="mb-2">No notifications</li>';
    }
}


    // Function to send data to another API
    function sendDataToAnotherAPI(notificationId, clientStatus) {
        var apiUrl = 'https://minitgo.com/api/client_order_confirmation.php';
        var apiKey = 'be0fbece0783dc6732b25d5fee7886b9';

        // Prepare the request body
        var requestBody = {
            oid: notificationId,
             clientStatus,
            cid:  cid
        };

        // Make API request to send data
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            renderNotifications(data.data);
            updateNotificationCount(data.data.length); // Update notification count
            playNotificationSound();
        })
        .catch(error => {
            console.error('Error fetching notifications:', error);
        });
    }

    // Event listener for the dropdown toggle button
    dropdownToggleButton.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevents the click event from bubbling up
        toggleDropdown();
    });

    // Event listener to close the dropdown menu when clicking outside of it
    document.addEventListener("click", function(event) {
        var targetElement = event.target;
        if (!targetElement.closest(".dropdown")) {
            // If the click target is not within the dropdown menu, close the dropdown
            dropdownMenu.classList.remove("show");
        }
    });

    // Fetch notifications initially and then every half second
    fetchNotifications();
    setInterval(fetchNotifications, 500); // Fetch notifications every 500 milliseconds
});




/*update in the sql function
document.addEventListener("DOMContentLoaded", function() {
    // Function to handle click event on the accept button
    document.getElementById("acceptButton").addEventListener("click", function() {
        // Make a fetch API call to update data on the server
        fetch("your_api_endpoint", {
            method: "PUT", // or "POST" if appropriate
            headers: {
                "Content-Type": "application/json",
                // Add any other headers as needed
            },
            body: JSON.stringify({
                // Provide data to update
                // Example: { accepted: true }
            }),
        })
        .then(response => {
            // Check if the request was successful (status code 2xx)
            if (response.ok) {
                // Redirect to another page
                window.location.href = "tables.html";
            } else {
                console.error("Failed to update data on the server.");
            }
        })
        .catch(error => {
            console.error("Error occurred while updating data:", error);
        });
    });
});
*/