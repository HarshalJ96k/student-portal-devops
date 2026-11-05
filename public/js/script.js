
async function checkServerStatus() {
    const statusElement = document.getElementById('server-status');

    if (!statusElement) return;

    try {
        const response = await fetch('/api/health');

        if (!response.ok) {
            throw new Error('Server unavailable');
        }

        const data = await response.json();

        statusElement.textContent = '● ' + data.message;

    } catch (error) {
        statusElement.textContent = '● Server connection failed';
    }
}

checkServerStatus();

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const status = document.getElementById('form-status');

        status.textContent =
            `Thank you, ${name}! Your message has been received.`;

        contactForm.reset();
    });
}
