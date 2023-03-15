document.getElementById('username-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const response = await fetch(`/user/exists/${username}`);
    const userExists = await response.json();

    if (userExists) {
        window.location.href = `/profile/${username}`;
    } else {
        document.getElementById('signin-popup').style.display = 'block';
    }
});
