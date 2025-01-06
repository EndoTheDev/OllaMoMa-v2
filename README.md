# Brain - Nuxt 3 + Nuxt UI v3 + Ollama Interface

A modern web interface for interacting with Ollama models, built with Nuxt 3 and Nuxt UI v3.

## Features

- 🎨 Beautiful UI with Nuxt UI v3 components
- 🌗 Dark/Light mode support
- 🎨 Customizable theme colors
- 🔄 Real-time Ollama model interactions
- 📱 Responsive design
- 🔍 Model search and sorting capabilities
- ⚡ Type-safe development with TypeScript

## Tech Stack

- [Nuxt 3](https://nuxt.com/) - The Intuitive Vue Framework
- [Nuxt UI v3](https://ui.nuxt.com/) - Fully styled and customizable components
- [Vue 3](https://vuejs.org/) - The Progressive JavaScript Framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Pinia](https://pinia.vuejs.org/) - The Vue Store that you will enjoy using
- [VueUse](https://vueuse.org/) - Collection of Vue Composition Utilities
- [Ollama](https://ollama.ai/) - Run large language models locally

## Prerequisites

- Node.js (v18+)
- Ollama installed and running locally
- Git

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

3. Configure Ollama settings in the application (default: host: 127.0.0.1, port: 11434)

## Development

Start the development server:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

The application will be available at `http://localhost:3000`

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Preview the production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Configuration

The application supports various configuration options:

- Theme customization (colors, radius)
- Dark/Light mode
- Ollama connection settings
- Sidebar visibility

These can be managed through the application's settings interface.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
