# Development Guide

This guide covers the development workflow and best practices for contributing to OllaMoMa v2.

## Development Workflow

### Setting Up Development Environment

1. Follow the [Installation Guide](./installation.md) to set up your local environment
2. Install recommended VS Code extensions (optional):
   - Volar (Vue Language Features)
   - TypeScript Vue Plugin
   - Tailwind CSS IntelliSense

### Running in Development Mode

1. Start the development server:

   ```bash
   npm run dev
   ```

   This will:

   - Start the Nuxt development server
   - Enable hot module replacement
   - Provide detailed error messages

2. View your changes at `http://localhost:3000`

### Building for Production

1. Create a production build:

   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

## Project Structure

```
.
├── app/                    # Application source (Nuxt 4 structure)
│   ├── assets/            # Static assets (images, global styles)
│   ├── components/        # Reusable Vue components
│   │   ├── app/           # App-specific components
│   │   ├── base/          # Base/shared components
│   │   └── ui/            # UI components
│   ├── composables/       # Vue composables (shared logic)
│   ├── pages/             # Application pages (auto-routed)
│   ├── stores/            # Pinia stores (state management)
│   ├── types/             # TypeScript type definitions
│   ├── app.vue            # Root component
│   └── app.config.ts      # App configuration
├── docs/                  # Documentation
├── public/                # Public static files
├── server/                # Server API routes
├── test/                  # Test files
└── nuxt.config.ts         # Nuxt configuration
```

**Note:** With Nuxt 4, all application source code is now organized under the `app/` directory, while configuration files and server/public directories remain at the project root.

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes following our code style:

   - Use TypeScript
   - Follow Vue 3 Composition API conventions
   - Use Nuxt UI components when possible
   - Keep components small and focused
   - Write self-documenting code

4. Test your changes:

   - Run unit tests: `npm run test`
   - Test in development mode
   - Verify mobile responsiveness

5. Submit your contribution:
   - Commit your changes
   - Push to your fork
   - Create a Pull Request

## Best Practices

- Use TypeScript for type safety
- Follow the Composition API pattern
- Keep components small and focused
- Use Nuxt UI components for consistency
- Implement responsive design
- Write clear commit messages
- Update documentation for new features
