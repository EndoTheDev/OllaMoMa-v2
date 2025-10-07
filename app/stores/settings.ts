import { useLocalStorage } from "@vueuse/core";
import { computed, watch, nextTick } from "vue";
import { useColorMode, useAppConfig } from "#imports";
import { defineStore } from "pinia";
import type {
  SettingsState,
  ThemeColors,
  ThemeOption,
  NeutralOption,
  RadiusOption,
} from "~/types/settings";
import { themeColorMap, neutralColorMap } from "~/types/settings";

export const useSettingsStore = defineStore("settings", () => {
  const colorMode = useColorMode();
  const appConfig = useAppConfig();

  // Default settings
  const defaultSettings: SettingsState = {
    sidebarOpen: true,
    colorMode: "dark",
    followSystem: true,
    theme: "green",
    neutral: "neutral",
    radius: "md",
    ollamaHost: "127.0.0.1",
    ollamaPort: 11434,
    airplaneMode: false,
    customPrimaryColor: null,
  };

  // State
  const settings = useLocalStorage<SettingsState>(
    "app:settings",
    defaultSettings
  );

  // Computed
  const sidebarOpen = computed(() => settings.value.sidebarOpen);
  const isDarkMode = computed(() => settings.value.colorMode === "dark");
  const followSystem = computed(() => settings.value.followSystem);
  const currentColorMode = computed(() => colorMode.value);
  const currentTheme = computed(() => settings.value.theme);
  const currentNeutral = computed(() => settings.value.neutral);
  const currentRadius = computed(() => settings.value.radius);
  const ollamaHost = computed(() => settings.value.ollamaHost);
  const ollamaPort = computed(() => settings.value.ollamaPort);
  const airplaneMode = computed(() => settings.value.airplaneMode);
  const customPrimaryColor = computed(() => settings.value.customPrimaryColor);

  // Store click coordinates for view transition
  let transitionCoordinates: { x: number; y: number } | null = null;
  // Flag to prevent double transitions
  let isManualTransition = false;

  // Actions
  function updateThemeColors(
    theme: ThemeOption = settings.value.theme,
    neutral: NeutralOption = settings.value.neutral
  ): void {
    // For predefined themes, use Tailwind color names
    // For custom theme, use 'green' as base but override with CSS variable
    const colors: ThemeColors = {
      primary:
        theme === "custom" ? "green" : (
          themeColorMap[theme as keyof typeof themeColorMap]
        ),
      neutral: neutralColorMap[neutral],
      error: "red",
      warning: "yellow",
      success: "green",
      info: "blue",
      secondary: "gray",
    };
    appConfig.ui.colors = colors;

    // For custom colors, override all primary color shades with the custom color
    if (theme === "custom" && settings.value.customPrimaryColor) {
      const shades = [
        "50",
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900",
        "950",
      ];
      shades.forEach((shade) => {
        document.documentElement.style.setProperty(
          `--ui-color-primary-${shade}`,
          settings.value.customPrimaryColor!
        );
      });
    } else {
      // Remove custom overrides to let Nuxt UI handle the color conversion
      const shades = [
        "50",
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900",
        "950",
      ];
      shades.forEach((shade) => {
        document.documentElement.style.removeProperty(
          `--ui-color-primary-${shade}`
        );
      });
    }
  }

  function toggleSidebar(): void {
    settings.value.sidebarOpen = !settings.value.sidebarOpen;
  }

  /**
   * Helper function to start a view transition with circular reveal animation
   */
  async function startViewTransition(callback: () => void): Promise<void> {
    // Check if View Transitions API is supported and user doesn't prefer reduced motion
    const hasAPI =
      typeof document !== "undefined" && "startViewTransition" in document;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (typeof document === "undefined" || !hasAPI || prefersReducedMotion) {
      callback();
      return;
    }

    // Get coordinates or use center of screen as fallback
    const x = transitionCoordinates?.x ?? window.innerWidth / 2;
    const y = transitionCoordinates?.y ?? window.innerHeight / 2;

    // Calculate the maximum radius needed to cover the entire viewport
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    try {
      // Start the transition
      const transition = (document as any).startViewTransition(async () => {
        callback();
        await nextTick();
      });

      // Animate the clip-path once transition is ready
      await transition.ready;

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: "cubic-bezier(.76,.32,.29,.99)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    } catch (error) {
      // Transition was skipped or aborted - this is fine, just continue
    } finally {
      // Clear coordinates after use
      transitionCoordinates = null;
    }
  }

  function setColorMode(mode: SettingsState["colorMode"]): void {
    isManualTransition = true;
    startViewTransition(() => {
      settings.value.colorMode = mode;
      colorMode.preference = mode;
    }).finally(() => {
      isManualTransition = false;
    });
  }

  function setTransitionCoordinates(x: number, y: number): void {
    transitionCoordinates = { x, y };
  }

  function setTheme(theme: ThemeOption): void {
    settings.value.theme = theme;
    if (theme !== "custom") {
      settings.value.customPrimaryColor = null;
    }
    updateThemeColors(theme);
  }

  function setNeutral(neutral: NeutralOption): void {
    settings.value.neutral = neutral;
    updateThemeColors(settings.value.theme, neutral);
  }

  function setRadius(radius: RadiusOption): void {
    settings.value.radius = radius;
  }

  function setOllamaHost(host: string): void {
    settings.value.ollamaHost = host;
  }

  function setOllamaPort(port: number): void {
    settings.value.ollamaPort = port;
  }

  function setAirplaneMode(mode: boolean): void {
    settings.value.airplaneMode = mode;
  }

  function setCustomPrimaryColor(color: string): void {
    settings.value.customPrimaryColor = color;
    settings.value.theme = "custom";
    updateThemeColors("custom");
  }

  function setFollowSystem(mode: boolean): void {
    settings.value.followSystem = mode;
    colorMode.preference = mode ? "system" : settings.value.colorMode;
  }

  function resetSettings(): void {
    settings.value = { ...defaultSettings };
    colorMode.preference =
      defaultSettings.followSystem ? "system" : defaultSettings.colorMode;
    updateThemeColors(defaultSettings.theme, defaultSettings.neutral);
  }

  // Initialize settings
  function initializeSettings(): void {
    colorMode.preference =
      settings.value.followSystem ? "system" : settings.value.colorMode;
    updateThemeColors(settings.value.theme);
  }
  initializeSettings();

  // Watch system color mode changes and animate transitions
  watch(
    () => colorMode.value,
    async (newMode) => {
      // Skip if this is a manual transition already in progress
      if (isManualTransition) {
        return;
      }

      if (
        (newMode === "light" || newMode === "dark") &&
        !settings.value.followSystem
      ) {
        await startViewTransition(() => {
          settings.value.colorMode = newMode;
        });
      }
      // System changes when following system happen instantly (no animation)
      // This provides natural UX - user actions are animated, automatic changes aren't
    }
  );

  return {
    // State exports
    sidebarOpen,
    isDarkMode,
    followSystem,
    currentColorMode,
    currentTheme,
    currentNeutral,
    currentRadius,
    ollamaHost,
    ollamaPort,
    airplaneMode,
    customPrimaryColor,

    // Action exports
    toggleSidebar,
    setColorMode,
    setTransitionCoordinates,
    setFollowSystem,
    setTheme,
    setNeutral,
    setRadius,
    setOllamaHost,
    setOllamaPort,
    setAirplaneMode,
    setCustomPrimaryColor,
    resetSettings,
  };
});
