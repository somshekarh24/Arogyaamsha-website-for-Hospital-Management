// Example: Displaying a welcome message based on user role
document.addEventListener('DOMContentLoaded', () => {
    const userRole = document.querySelector('#role');
    const welcomeMessage = document.querySelector('#welcome-message');

    if (userRole && welcomeMessage) {
        userRole.addEventListener('change', () => {
            welcomeMessage.textContent = `Welcome, ${userRole.value}!`;
        });
    }
});
