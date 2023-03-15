document.addEventListener('DOMContentLoaded', () => {
    const usernameForm = document.getElementById('usernameForm');
    const authPopup = document.getElementById('authPopup');

    usernameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        authPopup.classList.remove('hidden');
    });
});
