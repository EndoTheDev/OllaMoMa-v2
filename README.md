# OllaMoMa v2

> A modern web interface for interacting with Ollama models, built with Nuxt 3 and Nuxt UI v3.
>
> ⚠️ **Work in Progress**: This project is under active development.

## 🌟 Features

- 🎨 Modern UI with Nuxt UI v3 components
- 🌗 Dark/Light mode with theme customization
- 🔄 Real-time Ollama model management
- 📱 Fully responsive design
- 🔍 Advanced model search and sorting
- ⚡ Type-safe development with TypeScript

## 🛠️ Tech Stack

- **Frontend Framework**: [Nuxt 3](https://nuxt.com/)
- **UI Components**: [Nuxt UI v3](https://ui.nuxt.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Utilities**: [VueUse](https://vueuse.org/)
- **LLM Backend**: [Ollama](https://ollama.ai/)

## 📋 Prerequisites

- Node.js (v18+)
- Ollama installed and running locally
- Git
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
   - For Windows/macOS: Use `host.docker.internal` instead of `localhost` in Ollama URL settings
   - For Linux: Use your host machine's IP address

## 🏗️ Project Structure

```
.
├── assets/          # Static assets
├── components/      # Vue components
├── composables/     # Vue composables
├── pages/          # File-based routing
├── server/         # Server API routes
├── stores/         # Pinia stores
└── types/          # TypeScript types
```

## ⚙️ Configuration

Manage through the application's settings interface:
- Theme colors and radius
- Dark/Light mode
- Ollama connection
- UI preferences

## 🔄 Development Workflow

### Production Build
```bash
npm run build   # Build for production
npm run preview # Preview production build
```

### Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Roadmap

### Current Progress
- ✅ Ollama Integration
  - ✅ Model listing
  - ✅ Model copying
  - ✅ Model deletion
  - ✅ Model details

### Upcoming Features
- 🔄 LangChain integration
- 💬 Chat interface
- 📊 Knowledge graph visualization
- 🎨 Enhanced theme customization
  - Color picker
  - Border radius settings
- 🗃️ Database/Files management

## 📄 License

This project is licensed under the MIT License.

---
Built with ❤️ using [Nuxt 3](https://nuxt.com/) and [Nuxt UI v3](https://ui.nuxt.com/)
