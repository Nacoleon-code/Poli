document.addEventListener('DOMContentLoaded', () => {
    const debateButton = document.getElementById('debate-button');
    const backButton = document.getElementById('back-button');

    debateButton.addEventListener('click', () => {
        window.location.href = 'debate.html'; // Redirect to debate page
    });

    backButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Go back to the homepage
    });
});
