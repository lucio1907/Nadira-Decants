"use client";

import { useTheme } from "./ThemeProvider";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      className="nd-toggle-wrap"
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      id="theme-toggle"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px",
      }}
    >
      {/* Sun / Moon icon — monoline, 1.5px stroke */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          color: isLight
            ? "var(--text-display)"
            : "var(--text-disabled)",
          transition: "color 250ms cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        {isLight ? (
          /* Sun icon */
          <>
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </>
        ) : (
          /* Moon icon */
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
    </button>
  );
};
