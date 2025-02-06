// VARIABLES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const cursor = document.getElementById('cursor');
const innerCursor = document.getElementById('inner');
const buttons = document.querySelectorAll('button');

// CURSOR AND BUTTON +++++++++++++++++++++++++++++++++++++++++++++++++++++

document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.getElementById('cursor');
    const innerCursor = document.getElementById('inner');
    const buttons = document.querySelectorAll('button');

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
    }
});