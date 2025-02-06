// VARIABLES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const cursor = document.getElementById('cursor');
const innerCursor = document.getElementById('inner');
const buttons = document.querySelectorAll('button');
const menuButton = document.getElementById('menu-button');
const ytBtn = document.getElementById('rotating-circle');

// SET SCENE ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// AMBIENT LIGHTING ++++++++++++++++++++++++++++++++++++++++++++++++++++

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Dim global lighting
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 1, 500); // Strong point light for the scene
light.position.set(10, 10, 10);
scene.add(light);

camera.position.z = 50;

// CURSOR AND BUTTON +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Update cursor position on mouse move
window.addEventListener('mousemove', (event) => {
    cursor.style.top = `${event.clientY - 10}px`;  // Subtracting 10 to center the cursor
    cursor.style.left = `${event.clientX - 10}px`;
});

// Change cursor appearance when hovering over buttons
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        innerCursor.style.backgroundColor = 'gray';
        cursor.style.borderColor = 'gray';
    });
    button.addEventListener('mouseleave', () => {
        innerCursor.style.backgroundColor = 'transparent';
        cursor.style.borderColor = 'white';
        button.style.textDecoration = 'none';
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

ytBtn.addEventListener('mouseenter', () => {
    innerCursor.style.backgroundColor = 'gray';
    cursor.style.borderColor = 'gray';
});

ytBtn.addEventListener('mouseleave', () => {
    innerCursor.style.backgroundColor = 'transparent';
    cursor.style.borderColor = 'white';
});

// CREATE HEART SHAPE +++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Function to create the heart geometry with a fade-to-white effect
// Function to create the heart geometry
function createHeartGeometry() {
    const shape = new THREE.Shape();

    // Define the path for a heart shape with a pointed bottom
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0, 1, 1, 1, 1, 0);  // Top right curve
    shape.bezierCurveTo(1, -1, 0, -1.5, 0, -2);  // Sharp bottom point
    shape.bezierCurveTo(-1, -1.5, -1, -1, -1, 0);  // Bottom left curve
    shape.bezierCurveTo(-1, 1, 0, 1, 0, 0);  // Top left curve

    // Create the extruded geometry
    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 5,  // Depth of the extrusion
        bevelEnabled: false
    });

    const material = new THREE.MeshStandardMaterial({
        color: 0x00008B,  // Dark blue color
        emissive: 0x00008B,
        metalness: 0.5,
        roughness: 0.7
    });

    const heart = new THREE.Mesh(geometry, material);
    heart.position.set(0, 0, 0);

    // Scale the heart to make it a lot bigger
    heart.scale.set(5, 5, 5);  // Increase the size by a factor of 5 in all directions

    scene.add(heart);
}

// Call the function to create the heart geometry
createHeartGeometry();

// CREATE GRADIENT BACKGROUND AND SCREEN RESIZING ++++++++++++++++++++++++++++++++++++++++++++++

scene.background = new THREE.Color(0xF1A7B2); // Start with a light sunset color

function createGradientBackground() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#D1E5F4');  // Light blue
    gradient.addColorStop(1, '#f9f9f7');  // Pale cream

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    scene.background = texture;
}

createGradientBackground();

// RESIZE EVENT HANDLER
window.addEventListener('resize', () => {
    createGradientBackground();
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// ANIMATE ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function animate() {
    requestAnimationFrame(animate);

    // Render the scene
    renderer.render(scene, camera);
}

animate();
