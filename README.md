# OllaMoMa v2

> A modern web interface for interacting with Ollama models, built with Nuxt 3 and Nuxt UI v3.
>
> ⚠️ **Work in Progress**: This project is under active development.

## 🌟 Features

- 🎨 Interactive Chat Interface
  - Real-time streaming responses
  - Multiple model support
  - Clear conversation history
- 🤖 Model Management
  - View and manage Ollama models
  - Search and sort functionality
  - Detailed model information
- 🎨 Modern UI with Nuxt UI v3
  - Dark/Light mode with theme customization
  - Responsive design for all devices
  - Customizable UI elements
- ⚡ Performance Focused
  - Fast and responsive interface
  - Efficient model handling
  - Type-safe development

## 🛠️ Tech Stack

- **Frontend Framework**: [Nuxt 3](https://nuxt.com/)
- **UI Components**: [Nuxt UI v3](https://ui.nuxt.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Utilities**: [VueUse](https://vueuse.org/)
- **LLM Backend**: [Ollama](https://ollama.ai/)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v18+)
- Ollama installed and running locally
- Git for version control
- Docker (optional, for containerized deployment)

## 🚀 Quick Start

### Local Development

1. **Clone and Install**
   ```bash
   git clone https://github.com/EndoTheDev/OllaMoMa-v2.git
   cd OllaMoMa-v2
   npm install  # or pnpm install / yarn install / bun install
   ```

2. **Start Development Server**
   ```bash
   npm run dev  # or pnpm dev / yarn dev / bun run dev
   ```

3. **Configure Ollama**
   - Default settings: host: 127.0.0.1, port: 11434
   - Adjust in application settings if needed

### Docker Deployment

1. **Using Docker**
   ```bash
   # Build the image
   docker build -t ollamoma-v2 .
   
   # Run the container
   docker run -d -p 3000:3000 --name ollamoma ollamoma-v2
   ```

2. **Using Docker Compose**
   ```bash
   # Start the application
   docker compose up -d
   
   # Stop the application
   docker compose down
   ```

3. **Important Docker Notes**
   - Ensure Ollama is running on your host machine
   - For Windows/macOS: Use `host.docker.internal` instead of `localhost`
   - For Linux: Use your host machine's IP address

## 📚 Documentation

Detailed documentation is available in the [docs](./docs) directory:

- **Getting Started**
  - [Installation Guide](./docs/getting-started/installation.md)
  - [Development Guide](./docs/getting-started/development.md)

- **Features**
  - [Chat Interface](./docs/pages/index.md)
  - [Model Management](./docs/pages/models.md)
  - [Settings](./docs/pages/settings.md)

## 🏗️ Project Structure

```
.
├── assets/          # Static assets
├── components/      # Vue components
├── composables/     # Vue composables
├── docs/           # Documentation
├── pages/          # File-based routing
├── server/         # Server API routes
├── stores/         # Pinia stores
├── tests/          # Test files
└── types/          # TypeScript types
```

## 📝 Roadmap

### Current Progress
- ✅ Core Features
  - ✅ Chat interface with streaming
  - ✅ Model management
  - ✅ Theme customization
  - ✅ Settings management

### Upcoming Features
- 🔄 LangChain integration
- 📊 Knowledge graph visualization
- 🎨 Enhanced theme customization
  - Color picker
  - Border radius settings
- 🗃️ Database/Files management

## 🤝 Contributing

We welcome contributions! Please see our [Development Guide](./docs/getting-started/development.md) for details on:
- Setting up your development environment
- Our coding standards
- The contribution workflow
- Testing requirements

## 📄 License

This project is licensed under the MIT License.

---
Built with ❤️ by EndoTheDev using [Nuxt 3](https://nuxt.com/) and [Nuxt UI v3](https://ui.nuxt.com/)
