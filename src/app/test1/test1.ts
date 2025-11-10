import { Component } from '@angular/core';

@Component({
  selector: 'app-test1',
  imports: [],
  templateUrl: './test1.html',
  styleUrl: './test1.scss'
})
export class Test1 {
// Konfiguration
const CANVAS_SIZE = 400;
const GRID_SIZE = 20; // 20x20 Raster
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
const INITIAL_SPEED = 150; // Millisekunden pro Bewegung

// DOM-Elemente
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const gameOverMessage = document.getElementById('game-over-message');

// Spielzustand
let snake;
let food;
let dx, dy; // Bewegungsrichtung (Delta X, Delta Y)
let score;
let gameLoopInterval;
let gameSpeed;
let isGameRunning = false;
let changingDirection = false; // Flag um doppelte Tastenanschläge zu verhindern

/**
 * @function resetGame
 * Initialisiert alle Spielvariablen und setzt den Zustand zurück.
 */
function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dx = 1; // Startet nach rechts
    dy = 0;
    score = 0;
    gameSpeed = INITIAL_SPEED;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverMessage.classList.add('hidden');
    startButton.textContent = 'Neustart';
    generateFood();
    isGameRunning = true;
}

/**
 * @function drawCell
 * Zeichnet ein einzelnes Gitterquadrat.
 * @param {number} x - Gitter-X-Koordinate
 * @param {number} y - Gitter-Y-Koordinate
 * @param {string} color - Füllfarbe
 */
function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    // Optional: Rand für bessere Sichtbarkeit
    ctx.strokeStyle = '#383c42';
    ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

/**
 * @function drawSnake
 * Zeichnet die gesamte Schlange auf das Canvas.
 */
function drawSnake() {
    snake.forEach((segment, index) => {
        // Kopf der Schlange hat eine andere Farbe
        const color = index === 0 ? '#4CAF50' : '#8BC34A'; 
        drawCell(segment.x, segment.y, color);
    });
}

/**
 * @function drawFood
 * Zeichnet das Futter auf das Canvas.
 */
function drawFood() {
    drawCell(food.x, food.y, '#FF5722'); // Rote Farbe für Futter
}

/**
 * @function generateRandomPosition
 * Erzeugt eine zufällige Gitterposition, die nicht von der Schlange belegt ist.
 * @returns {{x: number, y: number}} - Zufällige Position
 */
function generateRandomPosition() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (isPositionOnSnake(newFood));
    return newFood;
}
