// SignIn.js

function clearDbUserFromLocalStorage() {
    localStorage.removeItem('dbUser');
}

clearDbUserFromLocalStorage();

function handleSignIn() {
    // Prevent form submission
    
    // Get user input values
    const emailInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const emailOrPhone = emailInput.value; 
    const password = passwordInput.value;
    

    
    // Define email and phone number patterns
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^[0-9]{10}$/;
    
    // Validation
    if (emailOrPhone === "" || password === "") {
      alert("All fields are required");
      return;
    } else if (!emailPattern.test(emailOrPhone) && !phonePattern.test(emailOrPhone)) {
      alert("Please enter a valid email or phone number");
      return;
    } else if (password.length < 8 || password.length > 12) {
      alert("Password must be between 8 and 12 characters long");
      return;
    }
    
    // Fetch user details from the API
    fetch("https://minitgo.com/api/fetch_client.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((allUsers) => {
        // Find user by email or phone number and password
        const foundUser = allUsers.find(
          (user) =>( user.email === emailOrPhone || user.client_phone === emailOrPhone) && user.password === password
        );
    
        if (foundUser) {
          // Login successful
          localStorage.setItem('dbUser', JSON.stringify(foundUser));
          window.location.href = "dashboard.html";
          console.log("Login successful");
          // Perform any necessary action (e.g., redirect)
          emailInput.value = "";
          passwordInput.value = "";
        } else {
          const findByEmailOrPhone = allUsers.find(
            (user) => user.email === emailOrPhone || user.client_phone === emailOrPhone
          );
          const findByPassword = allUsers.find((user) => user.password === password);

       
    
          if (!findByEmailOrPhone && !findByPassword) {
            // No user found with the provided email/phone number and password
            alert("No user found, please sign up");
          } else if (!findByEmailOrPhone) {
            // Neither email/phone number nor password is correct
            alert("Invalid email or phone number");
          } else {
            // Email/phone number or password is incorrect
            alert("Invalid password");
          }
        }
      })
      .catch((error) => {
        // Error handling
        console.error("Error fetching user information:", error);
        alert("Error fetching user information");
      });
  }
  
  // Attach event listener to the sign-in button
  document
    .querySelector('button[type="button"]')
    .addEventListener("click", handleSignIn);
