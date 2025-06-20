const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const seedInput = document.getElementById('seedInput');
const randomSeedBtn = document.getElementById('randomSeedBtn');
const patternTypeSpan = document.getElementById('patternType');
const paletteTypeSpan = document.getElementById('paletteType');
const complexitySpan = document.getElementById('complexity');

let currentSeed = "default";
let patternTypes = [
	"Géométrique", "Végétal", "Abstrait", "Fractal", "Organique", "Minimaliste", "Fractales de Newton", "Réseaux de neurones dessinés", "Tissus Voronoï organiques",
	"Lignes de flux de champ vectoriel", "Carrelages quasi-périodiques", "Automates cellulaires artistiques", "Graphes aléatoires décoratifs",
	"Strates de bruit multiéchelle", "Mandalas symétriques chaotiques", "Trames de contours topographiques"
];
let paletteTypes = [
	"Pastel", "Vibrante", "Monochrome", "Tropicale", "Néon", "Terracotta", "Océan", "Forêt", "Crépuscule", "Galaxie", "Sahara", "Arctique", "Jardin", "Cristal", "Lave", "Boutique", "Métal", "Vintage",
	"Cyberpunk", "Café", "Berry", "Méditerranée", "Corail", "Or", "Émeraude", "Rubis", "Saphir", "Violet", "Ciel", "Soleil", "Minuit", "Fumée", "Citron", "Champagne", "Grenade", "Éclipse", "Bouton d'or"
];
let complexityLevels = [
	"Minimaliste", "Très simple", "Simple", "Modérée", "Moyenne", "Évoluée", "Complexe", "Très complexe", "Intricate", "Hypercomplexe"
];
let debounceTimer;

function init() {
	resizeCanvas();
	
	generateRandomSeed();
	generateArt();
	
	window.addEventListener('resize', resizeCanvas);
	
	randomSeedBtn.addEventListener('click', function() {
		generateRandomSeed();
		generateArt();
	});
	
	seedInput.addEventListener('input', function() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			currentSeed = seedInput.value.trim() || "default";
			generateArt();
		}, 500);
	});
}

function generateRandomSeed() {
	currentSeed = Math.random().toString(36).substring(2, 10);
	seedInput.value = currentSeed;
}

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	generateArt();
}

function createRandom(seed) {
	return function() {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
}

function getPalette(random, type) {
	const palettes = {
		"Pastel": ["#FFD1DC", "#FFB7C5", "#E2F0CB", "#B5EAD7", "#C7CEEA"],
		"Vibrante": ["#FF6B6B", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"],
		"Monochrome": ["#2A2D34", "#4C5B5C", "#6B7F82", "#8AA29E", "#ADBABD"],
		"Tropicale": ["#FF6B6B", "#4ECDC4", "#556270", "#C06C84", "#F8B195"],
		"Néon": ["#FF00FF", "#00FFFF", "#FFFF00", "#FF00BF", "#BF00FF"],
		"Terracotta": ["#E27D60", "#85CDCA", "#E8A87C", "#C38D9E", "#41B3A3"],
		"Océan": ["#05386B", "#379683", "#5CDB95", "#8EE4AF", "#EDF5E1"],
		"Forêt": ["#5D5E36", "#6A6B47", "#7A7C51", "#8A8D6F", "#9A9F88"],
		"Crépuscule": ["#FF7E5F", "#FEB47B", "#FF6B6B", "#6A82FB", "#FC5C7D"],
		"Galaxie": ["#0F2027", "#203A43", "#2C5364", "#4A00E0", "#8E2DE2"],
		"Sahara": ["#C2B280", "#E1C16E", "#D4AF37", "#AA6C39", "#8B4513"],
		"Arctique": ["#E0FBFC", "#98C1D9", "#3D5A80", "#293241", "#EE6C4D"],
		"Jardin": ["#8EAC50", "#365939", "#5F8D4E", "#A4BE7B", "#285430"],
		"Cristal": ["#A7D7C5", "#74B49B", "#5C8D89", "#3E5C76", "#2D4B73"],
		"Lave": ["#FF0000", "#FF5E00", "#FF9A00", "#FFCE00", "#FFEA00"],
		"Boutique": ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7"],
		"Métal": ["#5F6F94", "#5B7DB1", "#5F9DF7", "#3C5186", "#1C3879"],
		"Vintage": ["#D8B384", "#A97155", "#7D4F50", "#3C2A21", "#1A1208"],
		"Cyberpunk": ["#00F5D4", "#00BBF9", "#9B5DE5", "#F15BB5", "#FEE440"],
		"Café": ["#6F4E37", "#5D4037", "#4E342E", "#3E2723", "#2E1B0E"],
		"Berry": ["#FF0A54", "#FF477E", "#FF5C8A", "#FF7096", "#FF85A1"],
		"Méditerranée": ["#0081A7", "#00AFB9", "#FDFCDC", "#FED9B7", "#F07167"],
		"Corail": ["#FF6F61", "#FF9F7F", "#FFBEA3", "#F6D6AD", "#9EB7E5"],
		"Or": ["#D4AF37", "#E5C100", "#F0E68C", "#FFD700", "#B8860B"],
		"Émeraude": ["#50C878", "#3EB489", "#20B2AA", "#5F9EA0", "#008080"],
		"Rubis": ["#E0115F", "#B22222", "#DC143C", "#FF0000", "#800020"],
		"Saphir": ["#0F52BA", "#1E40AF", "#1D4ED8", "#2563EB", "#3B82F6"],
		"Violet": ["#8A2BE2", "#9400D3", "#9932CC", "#BA55D3", "#DA70D6"],
		"Ciel": ["#87CEEB", "#B0E0E6", "#ADD8E6", "#89CFF0", "#6495ED"],
		"Soleil": ["#FFD700", "#FFA500", "#FF8C00", "#FF7F50", "#FF6347"],
		"Minuit": ["#191970", "#000080", "#00008B", "#0000CD", "#0000FF"],
		"Fumée": ["#708090", "#778899", "#808080", "#A9A9A9", "#C0C0C0"],
		"Citron": ["#C7EA46", "#D4E157", "#CDDC39", "#AFB42B", "#9E9D24"],
		"Champagne": ["#F7E7CE", "#F5DEB3", "#F5F5DC", "#FAF0BE", "#FAFAD2"],
		"Grenade": ["#E30B5C", "#C71585", "#DA70D6", "#DB7093", "#FF1493"],
		"Éclipse": ["#2E2E2E", "#4A4A4A", "#696969", "#808080", "#A9A9A9"],
		"Bouton d'or": ["#FDDA0D", "#F9A602", "#FFC300", "#FFD700", "#FFDF00"]
	};
	const paletteKeys = Object.keys(palettes);
	const paletteName = paletteKeys[Math.floor(random() * paletteKeys.length)];
	paletteTypeSpan.textContent = paletteName;
	return palettes[paletteName];
}

function drawBackground(width, height, random, palette) {
    const bgType = Math.floor(random() * 8);
    
    const pastelPalette = palette.map(color => {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        const gray = 0.3 * r + 0.59 * g + 0.11 * b;
        const darkened = Math.max(0, gray * 0.7);
        
        const toHex = (c) => Math.floor(c).toString(16).padStart(2, '0');
        return `#${toHex(r * 0.3 + darkened * 0.7)}${toHex(g * 0.3 + darkened * 0.7)}${toHex(b * 0.3 + darkened * 0.7)}`;
    });

    const applyBlur = random() > 0.7;
    const blurAmount = applyBlur ? Math.floor(1 + random() * 10) : 0;
    
    ctx.save();
    
    switch (bgType) {
        case 0: { // Dégradé linéaire simple
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, pastelPalette[0]);
            gradient.addColorStop(1, pastelPalette[pastelPalette.length - 1]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            break;
        }
            
        case 1: { // Dégradé radial
            const centerX = width * random();
            const centerY = height * random();
            const radius = Math.max(width, height) * (0.5 + random() * 0.5);
            const radialGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, radius
            );
            radialGradient.addColorStop(0, pastelPalette[0]);
            radialGradient.addColorStop(1, pastelPalette[pastelPalette.length - 1]);
            ctx.fillStyle = radialGradient;
            ctx.fillRect(0, 0, width, height);
            break;
        }
            
        case 2: { // Quadrillage
            ctx.fillStyle = pastelPalette[0];
            ctx.fillRect(0, 0, width, height);
            
            const gridSize = 20 + Math.floor(random() * 50);
            ctx.strokeStyle = pastelPalette[1];
            ctx.lineWidth = 1 + random() * 3;
            ctx.globalAlpha = 0.4;
            
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
            break;
        }
            
        case 3: { // Points
            ctx.fillStyle = pastelPalette[0];
            ctx.fillRect(0, 0, width, height);
            
            const dotSize = 1 + random() * 3;
            const dotSpacing = 15 + random() * 40;
            const dotColor = pastelPalette[Math.floor(random() * (pastelPalette.length - 1)) + 1];
            
            ctx.fillStyle = dotColor;
            ctx.globalAlpha = 0.5;
            
            for (let x = dotSpacing/2; x < width; x += dotSpacing) {
                for (let y = dotSpacing/2; y < height; y += dotSpacing) {
                    ctx.beginPath();
                    ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            break;
        }
            
        case 4: { // Lignes diagonales
            ctx.fillStyle = pastelPalette[0];
            ctx.fillRect(0, 0, width, height);
            
            const lineSpacing = 25 + random() * 60;
            const lineWidth = 1 + random() * 3;
            const lineColor = pastelPalette[Math.floor(random() * (pastelPalette.length - 1)) + 1];
            
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;
            ctx.globalAlpha = 0.4;
            
            for (let i = -height; i < width; i += lineSpacing) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + height, height);
                ctx.stroke();
            }
            
            for (let i = -height; i < width; i += lineSpacing) {
                ctx.beginPath();
                ctx.moveTo(i, height);
                ctx.lineTo(i + height, 0);
                ctx.stroke();
            }
            break;
        }
            
        case 5: { // Texture organique
            ctx.fillStyle = pastelPalette[0];
            ctx.fillRect(0, 0, width, height);
            
            const organicCount = 30 + Math.floor(random() * 100);
            ctx.globalAlpha = 0.08 + random() * 0.15;
            
            for (let i = 0; i < organicCount; i++) {
                const x = random() * width;
                const y = random() * height;
                const size = 15 + random() * 70;
                const color = pastelPalette[Math.floor(random() * pastelPalette.length)];
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        }
            
        case 6: { // Rayons
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = Math.sqrt(width*width + height*height) / 2;
            
            for (let r = 0; r < maxRadius; r += 10) {
                const gradient = ctx.createRadialGradient(
                    centerX, centerY, r,
                    centerX, centerY, r + 10
                );
                
                const colorIndex = Math.floor(r / maxRadius * pastelPalette.length);
                const nextColorIndex = Math.min(colorIndex + 1, pastelPalette.length - 1);
                
                gradient.addColorStop(0, pastelPalette[colorIndex]);
                gradient.addColorStop(1, pastelPalette[nextColorIndex]);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, r + 10, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        }
            
        case 7: // Motif aléatoire
        default: {
            ctx.fillStyle = pastelPalette[0];
            ctx.fillRect(0, 0, width, height);
            break;
        }
    }
    
    ctx.restore();
    
    if (applyBlur) {
        ctx.save();
        ctx.filter = `blur(${blurAmount}px)`;
        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = 0.5;
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
    }
}

function generateArt() {
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const seedNum = currentSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = createRandom(seedNum);
    
    const patternType = Math.floor(random() * patternTypes.length);
    patternTypeSpan.textContent = patternTypes[patternType];
    
    const complexity = Math.floor(random() * complexityLevels.length);
    complexitySpan.textContent = complexityLevels[complexity];
    
    const palette = getPalette(random);
    
    drawBackground(width, height, random, palette);
    
    switch (patternType) {
        case 0: // Géométrique
            drawGeometricPattern(width, height, random, palette, complexity);
            break;
        case 1: // Végétal
            drawOrganicPattern(width, height, random, palette, complexity);
            break;
        case 2: // Abstrait
            drawAbstractPattern(width, height, random, palette, complexity);
            break;
        case 3: // Fractal
            drawFractalPattern(width, height, random, palette, complexity);
            break;
        case 4: // Organique
            drawOrganicPattern(width, height, random, palette, complexity);
            break;
        case 5: // Minimaliste
            drawMinimalPattern(width, height, random, palette, complexity);
            break;
        case 6: // Fractales de Newton
            drawNewtonFractal(width, height, random, palette, complexity);
            break;
        case 7: // Tissus Voronoï organiques
            drawVoronoi(width, height, random, palette, complexity);
            break;
        case 8: // Réseaux de neurones dessinés
            drawNeuralNetwork(width, height, random, palette, complexity);
            break;
        case 9: // Lignes de flux de champ vectoriel
            drawVectorField(width, height, random, palette, complexity);
            break;
        case 10: // Carrelages quasi-périodiques
            drawQuasiPeriodicTiling(width, height, random, palette, complexity);
            break;
        case 11: // Automates cellulaires artistiques
            drawCellularAutomaton(width, height, random, palette, complexity);
            break;
        case 12: // Graphes aléatoires décoratifs
            drawDecorativeGraph(width, height, random, palette, complexity);
            break;
        case 13: // Strates de bruit multiéchelle
            drawMultiScaleNoise(width, height, random, palette, complexity);
            break;
        case 14: // Mandalas symétriques chaotiques
            drawChaoticMandala(width, height, random, palette, complexity);
            break;
        case 15: // Trames de contours topographiques
            drawTopographicContours(width, height, random, palette, complexity);
            break;
        default:
            drawGeometricPattern(width, height, random, palette, complexity);
    }
}

function drawGeometricPattern(width, height, random, palette, complexity) {
	const shapeCount = 50 + Math.floor(random() * 200) * (complexity + 1);
	const maxSize = Math.min(width, height) / (5 + complexity);
	
	for (let i = 0; i < shapeCount; i++) {
		const x = random() * width;
		const y = random() * height;
		const size = 10 + random() * maxSize;
		const rotation = random() * Math.PI * 2;
		const color = palette[Math.floor(random() * palette.length)];
		const opacity = 0.3 + random() * 0.7;
		
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(rotation);
		ctx.globalAlpha = opacity;
		ctx.fillStyle = color;
		
		const shapeType = Math.floor(random() * 4);
		
		switch (shapeType) {
			case 0: // Rectangle
				ctx.fillRect(-size/2, -size/2, size, size);
				break;
			case 1: // Cercle
				ctx.beginPath();
				ctx.arc(0, 0, size/2, 0, Math.PI * 2);
				ctx.fill();
				break;
			case 2: // Triangle
				ctx.beginPath();
				ctx.moveTo(0, -size/2);
				ctx.lineTo(size/2, size/2);
				ctx.lineTo(-size/2, size/2);
				ctx.closePath();
				ctx.fill();
				break;
			case 3: // Ligne
				ctx.lineWidth = 2 + random() * 10;
				ctx.beginPath();
				ctx.moveTo(-size/2, 0);
				ctx.lineTo(size/2, 0);
				ctx.strokeStyle = color;
				ctx.stroke();
				break;
		}
		
		ctx.restore();
	}
}

function drawOrganicPattern(width, height, random, palette, complexity) {
	const branchCount = 10 + Math.floor(random() * 30) * (complexity + 1);
	
	for (let i = 0; i < branchCount; i++) {
		const startX = random() * width;
		const startY = height;
		const length = 50 + random() * (height / 2);
		const angle = -Math.PI/2 + (random() - 0.5) * Math.PI/4;
		const thickness = 3 + random() * 7;
		const color = palette[Math.floor(random() * palette.length)];
		
		drawBranch(startX, startY, angle, length, thickness, random, palette, complexity);
	}
}

function drawBranch(x, y, angle, length, thickness, random, palette, depth) {
	if (thickness < 0.5 || depth <= 0) return;
	
	const endX = x + Math.cos(angle) * length;
	const endY = y + Math.sin(angle) * length;
	
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(endX, endY);
	ctx.lineWidth = thickness;
	ctx.lineCap = 'round';
	ctx.strokeStyle = palette[Math.floor(random() * palette.length)];
	ctx.stroke();
	
	if (thickness < 2) {
		const leafCount = Math.floor(1 + random() * 3);
		for (let i = 0; i < leafCount; i++) {
			const leafSize = 5 + random() * 15;
			const leafX = x + (endX - x) * random();
			const leafY = y + (endY - y) * random();
			const leafAngle = random() * Math.PI * 2;
			
			ctx.save();
			ctx.translate(leafX, leafY);
			ctx.rotate(leafAngle);
			ctx.fillStyle = palette[Math.floor(random() * palette.length)];
			ctx.globalAlpha = 0.7 + random() * 0.3;
			
			ctx.beginPath();
			ctx.ellipse(0, 0, leafSize, leafSize/2, 0, 0, Math.PI * 2);
			ctx.fill();
			
			ctx.restore();
		}
	}
	
	const branchCount = depth > 1 ? Math.floor(1 + random() * 3) : 0;
	for (let i = 0; i < branchCount; i++) {
		const newAngle = angle + (random() - 0.5) * Math.PI/2;
		const newLength = length * (0.5 + random() * 0.3);
		const newThickness = thickness * (0.5 + random() * 0.3);
		
		drawBranch(endX, endY, newAngle, newLength, newThickness, random, palette, depth - 1);
	}
}

function drawAbstractPattern(width, height, random, palette, complexity) {
	ctx.globalCompositeOperation = 'lighter';
	
	const layerCount = 3 + complexity * 2;
	
	for (let layer = 0; layer < layerCount; layer++) {
		const points = [];
		const pointCount = 20 + Math.floor(random() * 50);
		
		for (let i = 0; i < pointCount; i++) {
			points.push({
				x: random() * width,
				y: random() * height
			});
		}
		
		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		
		for (let i = 1; i < points.length; i++) {
			const cpX = (points[i].x + points[i-1].x) / 2;
			const cpY = (points[i].y + points[i-1].y) / 2;
			ctx.quadraticCurveTo(points[i-1].x, points[i-1].y, cpX, cpY);
		}
		
		ctx.lineWidth = 1 + random() * 5;
		ctx.strokeStyle = palette[Math.floor(random() * palette.length)];
		ctx.globalAlpha = 0.1 + random() * 0.3;
		ctx.stroke();
		
		for (let i = 0; i < pointCount * 2; i++) {
			const x = random() * width;
			const y = random() * height;
			const size = 5 + random() * 50;
			
			ctx.beginPath();
			ctx.arc(x, y, size, 0, Math.PI * 2);
			ctx.fillStyle = palette[Math.floor(random() * palette.length)];
			ctx.globalAlpha = 0.05 + random() * 0.1;
			ctx.fill();
		}
	}
	
	ctx.globalCompositeOperation = 'source-over';
}

function drawFractalPattern(width, height, random, palette, complexity) {
	const depth = 2 + complexity * 2;
	
	for (let i = 0; i < 5; i++) {
		const startX = width/2 + (random() - 0.5) * width/3;
		const startY = height;
		const angle = -Math.PI/2;
		const length = 100 + random() * (height/3);
		
		drawFractalPlant(startX, startY, angle, length, depth, random, palette);
	}
}

function drawFractalPlant(x, y, angle, length, depth, random, palette) {
	if (depth === 0) return;
	
	const endX = x + Math.cos(angle) * length;
	const endY = y + Math.sin(angle) * length;
	
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(endX, endY);
	ctx.lineWidth = depth * 2;
	ctx.lineCap = 'round';
	ctx.strokeStyle = palette[Math.floor(random() * palette.length)];
	ctx.stroke();
	
	const branchCount = 1 + Math.floor(random() * 2);
	for (let i = 0; i < branchCount; i++) {
		const newAngle = angle + (random() - 0.5) * Math.PI/1.5;
		const newLength = length * (0.4 + random() * 0.4);
		
		drawFractalPlant(endX, endY, newAngle, newLength, depth - 1, random, palette);
	}
}

function drawMinimalPattern(width, height, random, palette, complexity) {
	const shapeCount = 10 + Math.floor(random() * 20) * (complexity + 1);
	
	for (let i = 0; i < shapeCount; i++) {
		const x = random() * width;
		const y = random() * height;
		const size = 20 + random() * 100;
		const color = palette[1 + Math.floor(random() * (palette.length - 1))];
		const opacity = 0.7 + random() * 0.3;
		
		ctx.globalAlpha = opacity;
		ctx.fillStyle = color;
		
		const shapeType = Math.floor(random() * 3);
		
		switch (shapeType) {
			case 0: // Cercle
				ctx.beginPath();
				ctx.arc(x, y, size/2, 0, Math.PI * 2);
				ctx.fill();
				break;
			case 1: // Rectangle
				ctx.fillRect(x - size/2, y - size/2, size, size);
				break;
			case 2: // Ligne
				const angle = random() * Math.PI * 2;
				const length = size * 2;
				ctx.lineWidth = 3 + random() * 10;
				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
				ctx.strokeStyle = color;
				ctx.stroke();
				break;
		}
	}
}

function drawNewtonFractal(width, height, random, palette, complexity) {
    const maxIterations = 20 + complexity * 10;
    const zoom = 0.5 + random() * 2;
    const offsetX = (random() - 0.5) * width * 0.5;
    const offsetY = (random() - 0.5) * height * 0.5;
    
    const roots = [];
    const colors = [];
    const numRoots = 3 + Math.floor(random() * 5);
    
    for (let i = 0; i < numRoots; i++) {
        roots.push({
            x: (random() - 0.5) * 4,
            y: (random() - 0.5) * 4
        });
        colors.push(palette[i % palette.length]);
    }
    
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const zx = (x - width / 2 + offsetX) / (width * zoom);
            const zy = (y - height / 2 + offsetY) / (height * zoom);
            
            let z = {x: zx, y: zy};
            let iter = 0;
            let closestRoot = 0;
            let minDist = Infinity;
            
            while (iter < maxIterations) {
                const f = {
                    x: z.x * z.x * z.x - 3 * z.x * z.y * z.y - 1,
                    y: 3 * z.x * z.x * z.y - z.y * z.y * z.y
                };
                
                const df = {
                    x: 3 * (z.x * z.x - z.y * z.y),
                    y: 6 * z.x * z.y
                };
                
                const denom = df.x * df.x + df.y * df.y;
                if (Math.abs(denom) < 0.000001) break;
                
                z.x -= (f.x * df.x + f.y * df.y) / denom;
                z.y -= (f.y * df.x - f.x * df.y) / denom;
                
                for (let i = 0; i < roots.length; i++) {
                    const dx = z.x - roots[i].x;
                    const dy = z.y - roots[i].y;
                    const dist = dx * dx + dy * dy;
                    if (dist < minDist) {
                        minDist = dist;
                        closestRoot = i;
                    }
                }
                
                iter++;
            }
            
            const color = colors[closestRoot];
            const alpha = 0.2 + 0.8 * (iter / maxIterations);
            
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    ctx.globalAlpha = 1.0;
}

function drawVoronoi(width, height, random, palette, complexity) {
    const numPoints = 20 + complexity * 30;
    const points = [];
    const colors = [];
    
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: random() * width,
            y: random() * height
        });
        colors.push(palette[i % palette.length]);
    }
    
    const cellSize = 50;
    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let minDist = Infinity;
            let closestPoint = 0;
            
            const col = Math.floor(x / cellSize);
            const row = Math.floor(y / cellSize);
            
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const cellCol = col + i;
                    const cellRow = row + j;
                    
                    if (cellCol >= 0 && cellCol < cols && cellRow >= 0 && cellRow < rows) {
                        const cellIndex = cellRow * cols + cellCol;
                        
                        // Pour chaque point dans la cellule
                        for (let p = 0; p < points.length; p++) {
                            const dx = x - points[p].x;
                            const dy = y - points[p].y;
                            const dist = dx * dx + dy * dy;
                            
                            if (dist < minDist) {
                                minDist = dist;
                                closestPoint = p;
                            }
                        }
                    }
                }
            }
            
            ctx.fillStyle = colors[closestPoint];
            ctx.fillRect(x, y, 1, 1);
        }
    }
    
    ctx.strokeStyle = palette[palette.length - 1];
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150 + random() * 100) {
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
            }
        }
    }
    ctx.stroke();
}

function drawNeuralNetwork(width, height, random, palette, complexity) {
    const numLayers = 3 + Math.floor(complexity / 2);
    const neuronsPerLayer = [];
    const neuronPositions = [];
    
    for (let i = 0; i < numLayers; i++) {
        neuronsPerLayer.push(3 + Math.floor(random() * (3 + complexity * 2)));
    }
    
    const layerSpacing = width / (numLayers + 1);
    for (let layer = 0; layer < numLayers; layer++) {
        const layerNeurons = [];
        const ySpacing = height / (neuronsPerLayer[layer] + 1);
        
        for (let neuron = 0; neuron < neuronsPerLayer[layer]; neuron++) {
            const x = (layer + 1) * layerSpacing;
            const y = (neuron + 1) * ySpacing;
            layerNeurons.push({x, y});
        }
        neuronPositions.push(layerNeurons);
    }
    
    ctx.globalAlpha = 0.3;
    for (let layer = 0; layer < numLayers - 1; layer++) {
        for (let i = 0; i < neuronPositions[layer].length; i++) {
            for (let j = 0; j < neuronPositions[layer + 1].length; j++) {
                const weight = random();
                ctx.strokeStyle = weight > 0.5 ? palette[0] : palette[1];
                ctx.lineWidth = 1 + weight * 4;
                
                ctx.beginPath();
                ctx.moveTo(neuronPositions[layer][i].x, neuronPositions[layer][i].y);
                ctx.lineTo(neuronPositions[layer + 1][j].x, neuronPositions[layer + 1][j].y);
                ctx.stroke();
            }
        }
    }
    
    ctx.globalAlpha = 1.0;
    for (let layer = 0; layer < numLayers; layer++) {
        for (let i = 0; i < neuronPositions[layer].length; i++) {
            const size = 10 + random() * 20;
            const neuron = neuronPositions[layer][i];
            
            ctx.fillStyle = palette[2 + layer % (palette.length - 2)];
            ctx.beginPath();
            ctx.arc(neuron.x, neuron.y, size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = palette[palette.length - 1];
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

function drawVectorField(width, height, random, palette, complexity) {
    const gridSize = 20 + Math.floor(40 / (complexity + 1));
    const numLines = 50 + complexity * 50;
    const scale = 0.02 + complexity * 0.01;
    
    ctx.lineWidth = 1 + random() * 2;
    ctx.globalAlpha = 0.7;
    
    for (let i = 0; i < numLines; i++) {
        let x = random() * width;
        let y = random() * height;
        const color = palette[i % palette.length];
        ctx.strokeStyle = color;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        for (let step = 0; step < 100; step++) {
            const angle = Math.sin(x * scale) * Math.cos(y * scale) * 4 + 
                          Math.sin(x * scale * 0.3) * Math.cos(y * scale * 0.7) * 2;
            
            x += Math.cos(angle) * 2;
            y += Math.sin(angle) * 2;
            
            if (x < 0 || x > width || y < 0 || y > height) break;
            
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    
    ctx.globalAlpha = 0.5;
    for (let x = gridSize / 2; x < width; x += gridSize) {
        for (let y = gridSize / 2; y < height; y += gridSize) {
            const angle = Math.sin(x * scale) * Math.cos(y * scale) * 4 + 
                          Math.sin(x * scale * 0.3) * Math.cos(y * scale * 0.7) * 2;
            
            const dx = Math.cos(angle) * gridSize * 0.8;
            const dy = Math.sin(angle) * gridSize * 0.8;
            
            ctx.strokeStyle = palette[Math.floor(y / height * palette.length)];
            ctx.lineWidth = 1;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + dx, y + dy);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x + dx, y + dy);
            ctx.lineTo(x + dx * 0.8 - dy * 0.2, y + dy * 0.8 + dx * 0.2);
            ctx.lineTo(x + dx * 0.8 + dy * 0.2, y + dy * 0.8 - dx * 0.2);
            ctx.closePath();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fill();
        }
    }
    ctx.globalAlpha = 1.0;
}

function drawQuasiPeriodicTiling(width, height, random, palette, complexity) {
    const tileSize = 20 + Math.floor(50 / (complexity + 1));
    const phi = (1 + Math.sqrt(5)) / 2; // Nombre d'or
    
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, width, height);
    
    for (let y = 0; y < height; y += tileSize) {
        for (let x = 0; x < width; x += tileSize * phi) {
            const offset = (y / tileSize) % 2 === 0 ? 0 : tileSize * phi / 2;
            const xPos = x + offset;
            
            if (xPos < width) {
                const colorIndex = Math.floor((x + y) / tileSize) % palette.length;
                ctx.fillStyle = palette[colorIndex];
                
                // Tuile losange
                ctx.beginPath();
                ctx.moveTo(xPos, y);
                ctx.lineTo(xPos + tileSize * phi / 2, y + tileSize / 2);
                ctx.lineTo(xPos, y + tileSize);
                ctx.lineTo(xPos - tileSize * phi / 2, y + tileSize / 2);
                ctx.closePath();
                ctx.fill();
                
                // Tuile autre type
                ctx.fillStyle = palette[(colorIndex + 1) % palette.length];
                ctx.beginPath();
                ctx.moveTo(xPos + tileSize * phi / 2, y + tileSize / 2);
                ctx.lineTo(xPos + tileSize * phi, y);
                ctx.lineTo(xPos + tileSize * phi, y + tileSize);
                ctx.lineTo(xPos + tileSize * phi / 2, y + tileSize * 1.5);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}

function drawCellularAutomaton(width, height, random, palette, complexity) {
    const cellSize = 5;
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);
    
    let grid = new Array(cols);
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            grid[i][j] = Math.random() > 0.5 ? 1 : 0;
        }
    }
    
    const generations = 3 + complexity;
    
    for (let gen = 0; gen < generations; gen++) {
        const newGrid = new Array(cols);
        
        for (let i = 0; i < cols; i++) {
            newGrid[i] = new Array(rows);
            for (let j = 0; j < rows; j++) {
                let neighbors = 0;
                
                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        if (di === 0 && dj === 0) continue;
                        
                        const ni = (i + di + cols) % cols;
                        const nj = (j + dj + rows) % rows;
                        
                        neighbors += grid[ni][nj];
                    }
                }
                
                if (grid[i][j] === 1) {
                    newGrid[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                } else {
                    newGrid[i][j] = neighbors === 3 ? 1 : 0;
                }
            }
        }
        
        grid = newGrid;
    }
    
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j] === 1) {
                ctx.fillStyle = palette[j % palette.length];
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
}

function drawDecorativeGraph(width, height, random, palette, complexity) {
    const numNodes = 20 + complexity * 10;
    const nodes = [];
    
    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: random() * width,
            y: random() * height,
            size: 5 + random() * 15,
            color: palette[i % palette.length]
        });
    }
    
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150 + complexity * 20) {
                ctx.strokeStyle = palette[Math.floor(dist / 200 * palette.length)];
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }
    
    ctx.globalAlpha = 1.0;
    for (let i = 0; i < numNodes; i++) {
        const node = nodes[i];
        
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = palette[palette.length - 1];
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawMultiScaleNoise(width, height, random, palette, complexity) {
    const numLayers = 3 + complexity;
    const noiseScale = 0.01;
    
    for (let layer = 0; layer < numLayers; layer++) {
        const scale = noiseScale * Math.pow(2, layer);
        const amplitude = 1.0 / (layer + 1);
        const offsetX = random() * 1000;
        const offsetY = random() * 1000;
        
        ctx.globalAlpha = 0.1 + 0.3 / (layer + 1);
        
        for (let y = 0; y < height; y += 4) {
            for (let x = 0; x < width; x += 4) {
                // Bruit simple (pourrait être amélioré avec du Perlin)
                const noiseValue = Math.sin(x * scale + offsetX) * Math.cos(y * scale + offsetY);
                const colorValue = Math.abs(noiseValue) * palette.length;
                const colorIndex = Math.floor(colorValue) % palette.length;
                
                ctx.fillStyle = palette[colorIndex];
                ctx.fillRect(x, y, 4, 4);
            }
        }
    }
    ctx.globalAlpha = 1.0;
}

function drawChaoticMandala(width, height, random, palette, complexity) {
    const centerX = width / 2;
    const centerY = height / 2;
    const numSections = 6 + Math.floor(complexity / 2);
    const maxRadius = Math.min(width, height) * 0.4;
    
    for (let layer = 0; layer < 3 + complexity; layer++) {
        const layerRadius = maxRadius * (layer + 1) / (4 + complexity);
        const numElements = 20 + layer * 10;
        const angleStep = (Math.PI * 2) / numSections;
        
        for (let section = 0; section < numSections; section++) {
            const startAngle = section * angleStep;
            const color = palette[(layer + section) % palette.length];
            
            ctx.fillStyle = color;
            ctx.strokeStyle = palette[palette.length - 1];
            ctx.lineWidth = 1;
            
            for (let i = 0; i < numElements; i++) {
                const angle = startAngle + (i / numElements) * angleStep;
                const radius = layerRadius * (0.7 + random() * 0.3);
                const chaos = 10 * complexity * (random() - 0.5);
                
                const x = centerX + Math.cos(angle) * radius + chaos;
                const y = centerY + Math.sin(angle) * radius + chaos;
                const size = 3 + random() * 7;
                
                if (random() > 0.7) {
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                } else {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    
                    if (random() > 0.5) {
                        // Triangle
                        ctx.beginPath();
                        ctx.moveTo(0, -size);
                        ctx.lineTo(size, size);
                        ctx.lineTo(-size, size);
                        ctx.closePath();
                        ctx.fill();
                    } else {
                        // Rectangle
                        ctx.fillRect(-size/2, -size/2, size, size);
                    }
                    
                    ctx.restore();
                }
            }
        }
    }
}

function drawTopographicContours(width, height, random, palette, complexity) {
    const gridSize = 10;
    const cols = Math.ceil(width / gridSize);
    const rows = Math.ceil(height / gridSize);
    
    const heightmap = new Array(cols);
    for (let i = 0; i < cols; i++) {
        heightmap[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            // Bruit simple (pourrait être amélioré avec du Perlin)
            heightmap[i][j] = Math.sin(i * 0.1) * Math.cos(j * 0.1) + 
                              Math.sin(i * 0.05) * Math.cos(j * 0.05) * 0.5;
        }
    }
    
    const contourSpacing = 0.2;
    const numContours = 10 + complexity * 5;
    
    for (let c = 0; c < numContours; c++) {
        const level = -1 + c * contourSpacing;
        const color = palette[c % palette.length];
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.7;
        
        for (let i = 0; i < cols - 1; i++) {
            for (let j = 0; j < rows - 1; j++) {
                const x = i * gridSize;
                const y = j * gridSize;
                
                // Vérifier les intersections avec le niveau de contour
                const a = heightmap[i][j];
                const b = heightmap[i + 1][j];
                const c = heightmap[i][j + 1];
                const d = heightmap[i + 1][j + 1];
                
                if ((a < level && b >= level) || (a >= level && b < level)) {
                    const t = (level - a) / (b - a);
                    ctx.beginPath();
                    ctx.moveTo(x + t * gridSize, y);
                    ctx.lineTo(x + t * gridSize, y + gridSize);
                    ctx.stroke();
                }
                
                if ((a < level && c >= level) || (a >= level && c < level)) {
                    const t = (level - a) / (c - a);
                    ctx.beginPath();
                    ctx.moveTo(x, y + t * gridSize);
                    ctx.lineTo(x + gridSize, y + t * gridSize);
                    ctx.stroke();
                }
            }
        }
    }
    
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const elevation = heightmap[i][j];
            const colorIndex = Math.floor((elevation + 1) * palette.length / 2) % palette.length;
            
            ctx.fillStyle = palette[colorIndex];
            ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
        }
    }
    ctx.globalAlpha = 1.0;
}

window.addEventListener('load', init);