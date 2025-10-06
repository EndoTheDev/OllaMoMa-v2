export default defineAppConfig({
  ui: {
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error',
    neutral: 'neutral',
  },
  toaster: {
    position: 'top-center' as const,
    expand: true,
    duration: 3000,
  }
});
