document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('graphCanvas');
    const graphContainer = document.querySelector('.graph-container');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Elements
    const logo = document.getElementById('logo');
    const featuresContainer = document.getElementById('featuresContainer');
    const featureBoxes = document.querySelectorAll('.feature-box');
    const ctaButton = document.getElementById('ctaButton');
    
    // Create cursor (light neon green)
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Graph drawing
    function drawGraph() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.1)';
        ctx.lineWidth = 1;
        
        // Draw grid lines
        const spacing = Math.max(canvas.width, canvas.height) / 10;
        for (let x = 0; x <= canvas.width; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // Trail Configuration
    const trailDots = [];
    const trailLength = 800; // Smooth consistent trail
    const trailPositions = [];

    // Initialize trail dots
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.opacity = '0';
        document.body.appendChild(dot);
        trailDots.push(dot);
    }

    // Animation parameters
    let animationStartTime = null;
    const animationDuration = 6500; // 7 seconds
    let animationComplete = false;
    const pathPoints = [];

    // Calculate smooth path points
    function calculatePathPoints() {
        const points = [];
        const segments = 300;
        const startX = 50;
        const startY = canvas.height - 50;
        const endX = canvas.width - 50;
        const endY = 50;
        
        for (let i = 0; i <= segments; i++) {
            const progress = i / segments;
            const x = startX + progress * (endX - startX);
            // Moderate zigzag (5 waves)
            const zigzag = Math.sin(progress * Math.PI * 5) * (canvas.height * 0.15);
            const y = startY - progress * (startY - endY) + zigzag;
            points.push({ x, y });
        }
        return points;
    }

    pathPoints.push(...calculatePathPoints());

    function animateCursor(timestamp) {
        if (!animationStartTime) animationStartTime = timestamp;
        const progress = Math.min((timestamp - animationStartTime) / animationDuration, 1);
        
        // Get current position
        const pathIndex = Math.min(Math.floor(progress * pathPoints.length), pathPoints.length - 1);
        const { x: currentX, y: currentY } = pathPoints[pathIndex];

        // Update cursor
        cursor.style.left = `${currentX}px`;
        cursor.style.top = `${currentY}px`;

        // Store position
        trailPositions.push({ x: currentX, y: currentY });
        
        // Update trail dots - consistent coloring
        trailPositions.forEach((pos, index) => {
            if (index < trailDots.length) {
                const dot = trailDots[index];
                dot.style.left = `${pos.x}px`;
                dot.style.top = `${pos.y}px`;
                dot.style.opacity = '0.6';
            }
        });

        // Maintain trail length
        if (trailPositions.length > trailLength) {
            trailPositions.shift();
        }

        drawGraph();

        if (progress < 1) {
            requestAnimationFrame(animateCursor);
        } else if (!animationComplete) {
            animationComplete = true;
            
            // Smooth fade out
            cursor.style.transition = 'opacity 1s ease-out';
            cursor.style.opacity = '0';
            
            trailDots.forEach(dot => {
                dot.style.transition = 'opacity 1.5s ease-out';
                dot.style.opacity = '0.1';
            });
            
            graphContainer.style.transition = 'opacity 2s ease-out';
            graphContainer.style.opacity = '0.08';
            
            setTimeout(animateLogo, 500);
        }
    }

    function animateLogo() {
        logo.style.opacity = '1';
        let size = 26;
        const growInterval = setInterval(() => {
            size += 1;
            logo.style.fontSize = `${size}px`;
            if (size >= 40) {
                clearInterval(growInterval);
                setTimeout(() => {
                    logo.classList.add('final-position');
                    setTimeout(() => {
                        ctaButton.classList.add('visible');
                        featuresContainer.classList.add('visible');
                        animateFeatures();
                    }, 400);
                }, 400);
            }
        }, 16);
    }

    function animateFeatures() {
        featureBoxes.forEach((box, index) => {
            setTimeout(() => {
                box.classList.add('visible');
            }, index * 100);
        });
    }

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        pathPoints.length = 0;
        pathPoints.push(...calculatePathPoints());
        drawGraph();
    });

    // Start animation
    drawGraph();
    requestAnimationFrame(animateCursor);

    ctaButton.addEventListener('click', function() {
        window.location.href = 'https://wealthxpilot.vercel.app/';
    });
});