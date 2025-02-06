// VARIABLES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const cursor = document.getElementById('cursor');
const innerCursor = document.getElementById('inner');
const buttons = document.querySelectorAll('button');
const menuButton = document.getElementById('menu-button');
const iframes = document.querySelectorAll('iframe');
const githubLink = document.getElementById('github-link');

// CURSOR AND BUTTON +++++++++++++++++++++++++++++++++++++++++++++++++++++

document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.getElementById('cursor');
    const innerCursor = document.getElementById('inner');
    const buttons = document.querySelectorAll('button');
    const iframes = document.querySelectorAll('iframe');
    const githubLink = document.getElementById('github-link');

    if (cursor && innerCursor) {
        window.addEventListener('mousemove', (event) => {
            cursor.style.top = `${event.clientY - 10}px`;
            cursor.style.left = `${event.clientX - 10}px`;
        });

        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                innerCursor.style.backgroundColor = 'gray';
                cursor.style.borderColor = 'gray';
            });

            button.addEventListener('mouseleave', () => {
                innerCursor.style.backgroundColor = 'transparent';
                cursor.style.borderColor = 'white';
            });
        });

        menuButton.addEventListener('mouseenter', () => {
            innerCursor.style.backgroundColor = 'gray';
            cursor.style.borderColor = 'gray';
        });
        menuButton.addEventListener('mouseleave', () => {
            innerCursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = 'white';
        });

        // Detect when hovering over an iframe (YouTube video)
        iframes.forEach(iframe => {
            iframe.addEventListener('mouseenter', () => {
                innerCursor.style.backgroundColor = 'gray';
                cursor.style.borderColor = 'gray';
                iframe.style.pointerEvents = 'auto'; // Enable pointer events on hover
            });

            iframe.addEventListener('mouseleave', () => {
                innerCursor.style.backgroundColor = 'transparent';
                cursor.style.borderColor = 'white';
                iframe.style.pointerEvents = 'none'; // Disable pointer events when not hovering
            });
        });

        // Detect when hovering over the GitHub link
        githubLink.addEventListener('mouseenter', () => {
            innerCursor.style.backgroundColor = 'gray';
            cursor.style.borderColor = 'gray';
        });

        githubLink.addEventListener('mouseleave', () => {
            innerCursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = 'white';
        });
    }
});