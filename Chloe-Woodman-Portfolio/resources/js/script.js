// ARRAY +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const pastelColors = [    // Create stars with vibrant pastel colors
    0xfad0c4,  // Light pastel pink
    0xf7e9a0,  // Light pastel yellow
    0xa4d8eb,  // Light pastel blue
    0xffc3e3,  // Soft pastel pink
    0xc1f2d4   // Pastel green
];

const material = new THREE.MeshPhongMaterial({
    color: pastelColors[0],  // Light pastel pink
    emissive: pastelColors[0],
    emissiveIntensity: 0.4,
    specular: 0x555555,
    shininess: 50,
    vertexColors: THREE.VertexColors  // Ensure colors are taken from geometry
});

// VARIABLES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const cursor = document.getElementById('cursor');
const innerCursor = document.getElementById('inner');
const menuButton = document.getElementById('menu-button');
const buttons = document.querySelectorAll('button');
const abtBtn = document.getElementById('about');
const prjBtn = document.getElementById('projects');

// SET SCENE ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// AMBIENT LIGHTING ++++++++++++++++++++++++++++++++++++++++++++++++++++

// Add Ambient Light and Point Light for better illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Dim global lighting
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 1, 500); // Strong point light for the scene
light.position.set(10, 10, 10);
scene.add(light);

// Initialize camera position
camera.position.z = 50;

// Instead of multiple resize event listeners
window.addEventListener('resize', () => {
    createGradientBackground();
});

// CURSOR AND BUTTON +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Update cursor position on mouse move
window.addEventListener('mousemove', (event) => {
    cursor.style.top = `${event.clientY - 10}px`;  // Subtracting 10 to center the cursor
    cursor.style.left = `${event.clientX - 10}px`;
});

// Change cursor appearance when hovering over buttons, including the menu button
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

// Apply cursor effect specifically on menu button
menuButton.addEventListener('mouseenter', () => {
    innerCursor.style.backgroundColor = 'gray';
    cursor.style.borderColor = 'gray';
});
menuButton.addEventListener('mouseleave', () => {
    innerCursor.style.backgroundColor = 'transparent';
    cursor.style.borderColor = 'white';
});

// Click event listeners for the buttons to navigate to the About and Projects pages
abtBtn.addEventListener('click', () => {
    window.location.href = "about.html";
});

prjBtn.addEventListener('click', () => {
    window.location.href = "projects.html";
});

// GEOMETRYS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function createStarShape(radius1, radius2, points, depth) {
    const shape = new THREE.Shape();
    const angleStep = Math.PI / points;

    for (let i = 0; i < 2 * points; i++) {
        const angle = i * angleStep;
        const radius = i % 2 === 0 ? radius1 : radius2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        if (i === 0) {
            shape.moveTo(x, y);
        } else {
            shape.lineTo(x, y);
        }
    }
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 1,
        bevelSegments: 8
    });

    geometry.computeVertexNormals();

    // Use complimentary colors for the star shadow
    const colors = [];
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const distance = Math.sqrt(x * x + y * y);
        const baseColor = new THREE.Color(distance < radius1 ? pastelColors[0] : pastelColors[1]); // Base color
        const shadowColor = baseColor.clone().offsetHSL(0.5, 0.2, 0.3);  // Create a complimentary color for shadow

        // Assign colors: base color for center, shadow color for outer edges
        colors.push(baseColor.r, baseColor.g, baseColor.b);
        colors.push(shadowColor.r, shadowColor.g, shadowColor.b);
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

    return geometry;
}

// GEOMETRY GROUP ++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Create a group to hold the stars
const starGroup = new THREE.Group();
scene.add(starGroup);

function createStars() {
    const maxDistance = 80;
    const starCount = 100;
    const minDistance = 5;  // Minimum distance between stars to avoid overlap

    const positions = [];  // To store the positions of all the stars

    for (let i = 0; i < starCount; i++) {
        const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        const geometry = createStarShape(10, 16, 5, 3);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.4,
            metalness: 0.2,
            roughness: 0.6,
            vertexColors: true
        });
        const star = new THREE.Mesh(geometry, material);

        // Randomize rotation
        star.rotation.y = Math.random() * Math.PI * 2;
        star.rotation.x = Math.random() * Math.PI * 2;  // Random X rotation for each star
        star.rotation.z = Math.random() * Math.PI * 2;  // Random Z rotation for each star

        // Positioning
        let position;
        let distanceToExistingStars;
        let tries = 0;  // Avoid infinite loops in case of a very crowded scene
        do {
            const distance = Math.random() * (maxDistance + 150) + 50;
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const z = (Math.random() - 0.5) * (maxDistance + 50);

            position = new THREE.Vector3(x, y, z);
            distanceToExistingStars = positions.some(existingPosition => position.distanceTo(existingPosition) < minDistance);

            if (!distanceToExistingStars) {
                positions.push(position);  // Add the valid position to the list
                star.position.set(x, y, z);  // Set star position
            }

            tries++;
        } while (distanceToExistingStars && tries < 100);  // Try 100 times before giving up

        starGroup.add(star);
    }
}

createStars();

// MOUSE MOVEMENTS ++++++++++++++++++++++++++++++++++++++++++++++++++++++

let lastMouseX = 0, lastMouseY = 0, lastDirectionX = 0, lastDirectionY = 0, maxRotationAmount = Math.PI / 36, cooldown = 150, lastRotationTime = 0;

// Variables to smoothly interpolate rotation
let targetRotationX = starGroup.rotation.x, targetRotationY = starGroup.rotation.y, rotationSpeed = 0.1;  // How quickly to interpolate towards the target rotation

// Add event listener for mouse movement
window.addEventListener('mousemove', (event) => {
    // Only process the movement if enough time has passed
    const currentTime = Date.now();
    if (currentTime - lastRotationTime < cooldown) return; // Skip rotation if within cooldown period

    // Get mouse position relative to the window
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Calculate the direction of movement for X and Y
    const directionX = mouseX > lastMouseX ? 1 : (mouseX < lastMouseX ? -1 : 0);
    const directionY = mouseY > lastMouseY ? 1 : (mouseY < lastMouseY ? -1 : 0);

    // If the direction has changed for X, set target rotation
    if (directionX !== 0 && directionX !== lastDirectionX) {
        targetRotationY += directionX * maxRotationAmount;
        lastDirectionX = directionX;
    }

    // If the direction has changed for Y, set target rotation
    if (directionY !== 0 && directionY !== lastDirectionY) {
        targetRotationX += directionY * maxRotationAmount;
        lastDirectionY = directionY;
    }

    // Update last mouse position
    lastMouseX = mouseX;
    lastMouseY = mouseY;

    // Update last rotation time to apply cooldown
    lastRotationTime = currentTime;
});


// Function to get 2D screen position of 3D text
function getScreenPosition(object) {
    const vector = new THREE.Vector3();
    object.updateMatrixWorld(); // Ensure the object has its world matrix updated
    vector.setFromMatrixPosition(object.matrixWorld);
    vector.project(camera);

    // Convert the normalized device coordinates to pixel coordinates
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;

    return {
        x: (vector.x * widthHalf) + widthHalf,
        y: -(vector.y * heightHalf) + heightHalf
    };
}

// GRADIENT BACKGROUND AND SCREEN RESIZING ++++++++++++++++++++++++++++++++++++++++++++++

// Set a background color for the scene (this will act as the gradient base)
scene.background = new THREE.Color(0xF1A7B2); // Start with a light sunset color

// Create a plane with a sunset gradient texture
// Set the background to the sunset gradient using a shader
// Set up gradient background using THREE.js texture
function createGradientBackground() {
    // Create a canvas to draw the gradient on
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create gradient
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#D1E5F4');  // Light blue
    gradient.addColorStop(1, '#f9f9f7');  // Pale cream

    // Apply the gradient to the canvas
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    // Set the scene's background to the texture
    scene.background = texture;
}

createGradientBackground();

// ANIMATE ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Call the positionButtons function in the animation loop or after text has been created
function animate() {
    requestAnimationFrame(animate);

    // Update the rotation for each star individually
    starGroup.children.forEach(star => {
        star.rotation.x += 0.001 * Math.random();  // Slight random movement on X axis
        star.rotation.y += 0.001 * Math.random();  // Slight random movement on Y axis
        star.rotation.z += 0.001 * Math.random();  // Slight random movement on Z axis
    });

    // Smooth rotation of the entire star group based on mouse movement
    starGroup.rotation.x += (targetRotationX - starGroup.rotation.x) * rotationSpeed;
    starGroup.rotation.y += (targetRotationY - starGroup.rotation.y) * rotationSpeed;

    // Render the scene
    renderer.render(scene, camera);
}

animate();