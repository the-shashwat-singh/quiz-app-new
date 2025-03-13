# Quiz App

A C++ programming quiz application with anti-cheating features.

## Hosting on Local Network

To make the quiz accessible to other devices on your local WiFi network:

### Method 1: Using the Helper Script

1. Run the helper script:
   ```
   node start-local-server.js
   ```

2. The script will:
   - Display your local IP addresses
   - Build the application
   - Start the server
   - Show URLs that others can use to access the quiz

3. Share the displayed URL (e.g., `http://192.168.1.100:3000`) with others on the same network

### Method 2: Manual Setup

1. Build the application:
   ```
   npm run build
   ```

2. Start the server on all network interfaces:
   ```
   npm run start
   ```

3. Find your local IP address:
   - On Windows: Open Command Prompt and type `ipconfig`
   - On macOS/Linux: Open Terminal and type `ifconfig` or `ip addr`

4. Share the URL with your local IP address (e.g., `http://192.168.1.100:3000`)

## Anti-Cheating Features

This quiz includes anti-cheating measures:

- **Tab Switching Penalty**: If a student switches tabs or windows during the quiz, they receive a -2 point penalty each time
- **Time Limits**: Each question has a time limit
- **High Stakes Bonus**: Optional challenging question with risk/reward

## Development

- Run in development mode: `npm run dev`
- Lint the code: `npm run lint` 