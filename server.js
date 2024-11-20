import express from 'express';  // Express framework for creating the server
import cors from 'cors';  // CORS middleware to allow cross-origin requests
import puppeteer from 'puppeteer';  // Puppeteer for headless browser automation (used to capture video frames)
import axios from 'axios';  // Axios for making HTTP requests (used to interact with the API for the video URL)
import { Server } from 'socket.io';  // Socket.IO for real-time communication via WebSockets

// Create an Express app instance and enable CORS (Cross-Origin Resource Sharing).
const app = express().use(cors());

// Start the server on port 3000 and log that the server is running.
const server = app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// Attach the Express HTTP server to a Socket.IO instance for real-time communication.
const io = new Server(server);

// Set up a listener for new WebSocket connections.
io.on('connection', (socket) => {
    console.log('A client connected');  // Log when a client connects.

    // Listen for the disconnect event to handle client disconnections.
    socket.on('disconnect', () => {
        console.log('A client disconnected');  // Log when a client disconnects.
    });
});

// Function to launch Puppeteer and capture video frames from the webpage.
async function captureVideo() {
    // Launch a headless browser with a specific viewport size.
    const browser = await puppeteer.launch({
        headless: false,  // Set to false to visually see the browser window (true for headless mode).
        defaultViewport: {
            width: 1366,  // Set the width of the viewport.
            height: 768,  // Set the height of the viewport.
        },
    });

    // Open a new page in the browser.
    const page = await browser.newPage();

    // The video source url. Feel free to change this url.
    const url = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

    // Use the URL from the API response to load the video source.
    await page.goto(url);

    // Capture 30 frames per second from the video feed
    // The higher the FPS, the more CPU usage, so tweak the value based on your needs.
    setInterval(async () => {
        // Capture the screenshot of the current frame and encode it as base64
        const base64Image = await page.screenshot({ encoding: "base64", type: "jpeg" });

        // Emit the captured frame to all connected WebSocket clients.
        io.emit('newFrame', base64Image);  // Send image as base64-encoded string.
    }, 1000 / 30);  // 30 FPS (frames per second)
}

// Start the video capture process.
captureVideo();

// Serve static files for the client-side, like HTML, CSS, and JS.
app.use(express.static('public'));
