# Video Stream Server using Puppeteer & Socket.IO

This project sets up a server that captures video frames from a given video source and streams them in real-time to connected clients using WebSockets. The video is captured using **Puppeteer**, and the frames are sent as **base64-encoded images** using **Socket.IO**.

## Features
- **Capture video frames** from a video source using Puppeteer.
- **Stream video frames** in real-time to clients via WebSocket.
- **Supports real-time updates** with a frame rate of 30 FPS (configurable).
- **Cross-origin resource sharing (CORS)** enabled for client-side connections.
- **Static file serving** for the client-side interface.

## Prerequisites

Before running this project, you will need:

- **Node.js** installed. You can download it from [here](https://nodejs.org/).
- **npm** (Node package manager), which comes bundled with Node.js.

### Install Dependencies

Clone this repository and navigate to the project directory:

```bash
git clone https://github.com/triwiboworidhopermana19/video-stream-server.git
cd video-stream-server
npm install
```

## Running the Server
Once all dependencies are installed, you can start the server with:

```bash
npm start
```

The server will listen on port 3000 by default. You can access the server via:
http://localhost:3000

## Client-side Setup
In the public directory, you can place an index.html file that connects to the WebSocket server and displays the video frames using an `<img>` tag or `<canvas>`.

Example WebSocket client:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Real-Time Video Stream</title>
</head>
<body>
    <h1>Real-Time Video Stream</h1>
    <img id="videoStream" src="" alt="Video Stream" width="800px" />
    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io.connect('http://localhost:3000');
        const videoStream = document.getElementById('videoStream');
        
        // Listen for 'newFrame' event and update the image source with the base64 frame
        socket.on('newFrame', (base64Image) => {
            videoStream.src = `data:image/jpeg;base64,${base64Image}`;
        });
    </script>
</body>
</html>
```

### Running the Client
To run the client, ensure that the index.html file is inside the public folder. You can then access the client through your browser at: http://localhost:3000

## How It Works

1. Puppeteer Launches a Headless Browser: The Puppeteer script launches a browser, navigates to the video source, and begins capturing frames.

2. Login to the Video Source: The login details are posted to the API endpoint, and the video URL is retrieved.

3. Capture Video Frames: Every 1/30th of a second, Puppeteer captures a screenshot of the video feed and encodes it as a base64 JPEG image.

4. Stream to Clients: The captured frames are sent to all connected WebSocket clients using the io.emit() function, where each frame is encoded as a base64 image.

5. Client-side Display: On the client-side, an `<img>` or `<canvas>` element displays the incoming base64 frames in real-time, creating the effect of a video stream.

## Configurable Options

* Frame Rate: The default frame rate is set to 30 frames per second (FPS). You can adjust this by changing the interval in the setInterval function inside the captureVideo function.

```javascript
setInterval(async () => {
    // Capture frame and send to clients
}, 1000 / 30);  // 30 FPS
```

* Viewport Size: The default Puppeteer viewport size is 1366x768. You can adjust this to match the dimensions of the video you are capturing:

```javascript
const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1366, height: 768 }
});
```

* Video Source: You can change the URL and authentication details to capture from a different video source.

## Troubleshooting

* WebSocket Connection Issues: If you encounter WebSocket connection issues, ensure that your browser allows WebSocket connections. You may need to adjust the CORS settings or WebSocket configuration.

* High CPU Usage: Capturing video frames at high frame rates can be resource-intensive. If you experience performance issues, consider lowering the FPS or optimizing the server hardware.

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
```markdown

### Key Sections Explained:

- **Project Overview**: Describes the functionality of the server (capturing and streaming video frames).
- **Prerequisites**: Lists the required software for running the project (Node.js and npm).
- **Installation Instructions**: Details how to clone the repository and install dependencies.
- **Running the Server**: Provides steps to start the server and access it in the browser.
- **How It Works**: Explains the internal flow of the project from launching Puppeteer to streaming frames to the client.
- **Configurable Options**: Highlights the key configuration points such as frame rate and viewport size.
- **Troubleshooting**: Offers solutions for common issues you might encounter during development.

Feel free to modify the README to fit your needs and add any additional information specific to your setup!
```