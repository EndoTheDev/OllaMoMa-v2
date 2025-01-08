# Installation Guide

This guide will help you get OllaMoMa v2 up and running on your system.

## Prerequisites

Before installing OllaMoMa v2, make sure you have:

- Node.js (v18 or higher)
- Ollama installed and running locally
- Git for version control
- Docker (optional, for containerized deployment)

## Installation Methods

### Method 1: Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/EndoTheDev/OllaMoMa-v2.git
   cd OllaMoMa-v2
   ```

2. Install dependencies:
   ```bash
   npm install
   # or use: pnpm install / yarn install / bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or use: pnpm dev / yarn dev / bun run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Method 2: Docker Installation (Recommended)

1. Using Docker:
   ```bash
   # Build the image
   docker build -t ollamoma-v2 .
   
   # Run the container
   docker run -d -p 3000:3000 --name ollamoma ollamoma-v2
   ```

2. Using Docker Compose:
   ```bash
   # Start the application
   docker compose up -d
   ```

## Initial Configuration

1. Ensure Ollama is running on your system
2. Default Ollama settings:
   - Host: `127.0.0.1`
   - Port: `11434`
3. For Docker installations:
   - Windows/macOS: Use `host.docker.internal` instead of `localhost`
   - Linux: Use your host machine's IP address

## Troubleshooting

- If you can't connect to Ollama:
  1. Check if Ollama is running
  2. Verify the host and port settings
  3. Check your firewall settings

- For Docker users:
  1. Ensure proper network configuration
  2. Verify host machine accessibility 