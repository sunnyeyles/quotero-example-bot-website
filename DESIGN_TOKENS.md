# Design Tokens Guide

This document explains how to use the global design tokens set up in your project. These tokens provide a consistent design system across your application.

## Overview

The design tokens are defined in `app/globals.css` using CSS custom properties and Tailwind CSS v4's `@theme` directive. This approach provides:

- **Consistency**: All components use the same design values
- **Maintainability**: Change values in one place to update the entire design system
- **Flexibility**: Easy to override for specific components or themes
- **Performance**: CSS custom properties are highly optimised

## Typography

### Font Families

```css
/* Available font families */
--font-sans: var(--font-geist-sans); /* Primary sans-serif */
--font-mono: var(--font-geist-mono); /* Monospace */
--font-display: "Inter", system-ui, ...; /* Display font */
--font-body: "Inter", system-ui, ...; /* Body font */
```

### Font Sizes

```css
/* Use with Tailwind classes or CSS */
text-xs    /* 12px */
text-sm    /* 14px */
text-base  /* 16px */
text-lg    /* 18px */
text-xl    /* 20px */
text-2xl   /* 24px */
text-3xl   /* 30px */
text-4xl   /* 36px */
text-5xl   /* 48px */
text-6xl   /* 60px */
text-7xl   /* 72px */
text-8xl   /* 96px */
text-9xl   /* 128px */
```

### Font Weights

```css
font-thin        /* 100 */
font-extralight  /* 200 */
font-light       /* 300 */
font-normal      /* 400 */
font-medium      /* 500 */
font-semibold    /* 600 */
font-bold        /* 700 */
font-extrabold   /* 800 */
font-black       /* 900 */
```

### Line Heights

```css
leading-none     /* 1 */
leading-tight    /* 1.25 */
leading-snug     /* 1.375 */
leading-normal   /* 1.5 */
leading-relaxed  /* 1.625 */
leading-loose    /* 2 */
```

### Letter Spacing

```css
tracking-tighter  /* -0.05em */
tracking-tight    /* -0.025em */
tracking-normal   /* 0em */
tracking-wide     /* 0.025em */
tracking-wider    /* 0.05em */
tracking-widest   /* 0.1em */
```

## Border Radius

```css
/* Use with Tailwind classes */
rounded-none   /* 0px */
rounded-sm     /* calc(var(--radius) - 4px) */
rounded-md     /* calc(var(--radius) - 2px) */
rounded-lg     /* var(--radius) - 0.65rem */
rounded-xl     /* calc(var(--radius) + 4px) */
rounded-2xl    /* calc(var(--radius) + 8px) */
rounded-3xl    /* calc(var(--radius) + 12px) */
rounded-full   /* 9999px */
```

## Box Shadows

### Standard Shadows

```css
/* Use with Tailwind classes */
shadow-xs      /* Subtle shadow */
shadow-sm      /* Small shadow */
shadow-md      /* Medium shadow */
shadow-lg      /* Large shadow */
shadow-xl      /* Extra large shadow */
shadow-2xl     /* 2x large shadow */
shadow-inner   /* Inset shadow */
shadow-none    /* No shadow */
```

### Custom Shadow Utilities

```css
/* Use these classes for consistent elevation */
.shadow-elevation-1  /* Light elevation */
/* Light elevation */
/* Light elevation */
/* Light elevation */
/* Light elevation */
/* Light elevation */
/* Light elevation */
/* Light elevation */
.shadow-elevation-2  /* Medium elevation */
.shadow-elevation-3  /* High elevation */
.shadow-elevation-4  /* Very high elevation */
.shadow-elevation-5; /* Maximum elevation */
```

### Colored Shadows

```css
/* Available colored shadows */
--shadow-primary    /* Blue shadow */
--shadow-secondary  /* Gray shadow */
--shadow-success    /* Green shadow */
--shadow-warning    /* Yellow shadow */
--shadow-error      /* Red shadow */
```

## Spacing

### Standard Spacing Scale

```css
/* Use with Tailwind classes (p-, m-, gap-, etc.) */
space-0     /* 0px */
space-0.5   /* 2px */
space-1     /* 4px */
space-1.5   /* 6px */
space-2     /* 8px */
space-2.5   /* 10px */
space-3     /* 12px */
space-3.5   /* 14px */
space-4     /* 16px */
space-5     /* 20px */
space-6     /* 24px */
space-7     /* 28px */
space-8     /* 32px */
space-9     /* 36px */
space-10    /* 40px */
space-11    /* 44px */
space-12    /* 48px */
space-14    /* 56px */
space-16    /* 64px */
space-20    /* 80px */
space-24    /* 96px */
space-28    /* 112px */
space-32    /* 128px */
space-36    /* 144px */
space-40    /* 160px */
space-44    /* 176px */
space-48    /* 192px */
space-52    /* 208px */
space-56    /* 224px */
space-60    /* 240px */
space-64    /* 256px */
space-72    /* 288px */
space-80    /* 320px */
space-96    /* 384px */
```

### Semantic Spacing

```css
/* Use these for consistent component spacing */
--spacing-section    /* 64px - Between major sections */
--spacing-component  /* 24px - Between components */
--spacing-element    /* 16px - Between elements */
--spacing-text       /* 8px - Between text elements */
```

## Z-Index Scale

```css
/* Use these for proper layering */
z-hide      /* -1 */
z-auto      /* auto */
z-base      /* 0 */
z-docked    /* 10 */
z-dropdown  /* 1000 */
z-sticky    /* 1100 */
z-banner    /* 1200 */
z-overlay   /* 1300 */
z-modal     /* 1400 */
z-popover   /* 1500 */
z-skiplink  /* 1600 */
z-toast     /* 1700 */
z-tooltip   /* 1800 */
```

## Animation

### Durations

```css
duration-75    /* 75ms */
duration-100   /* 100ms */
duration-150   /* 150ms */
duration-200   /* 200ms */
duration-300   /* 300ms */
duration-500   /* 500ms */
duration-700   /* 700ms */
duration-1000  /* 1000ms */
```

### Easing Functions

```css
ease-linear     /* linear */
ease-in         /* cubic-bezier(0.4, 0, 1, 1) */
ease-out        /* cubic-bezier(0, 0, 0.2, 1) */
ease-in-out     /* cubic-bezier(0.4, 0, 0.2, 1) */
ease-bounce     /* cubic-bezier(0.68, -0.55, 0.265, 1.55) */
ease-spring     /* cubic-bezier(0.175, 0.885, 0.32, 1.275) */
```

### Transition Utilities

```css
/* Use these classes for consistent transitions */
.transition-fast   /* 150ms ease-out */
/* 150ms ease-out */
/* 150ms ease-out */
/* 150ms ease-out */
/* 150ms ease-out */
/* 150ms ease-out */
/* 150ms ease-out */
/* 150ms ease-out */
.transition-normal /* 300ms ease-out */
.transition-slow; /* 500ms ease-out */
```

## Focus Management

```css
/* Focus ring utilities */
.focus-ring {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```

## Container System

```css
/* Responsive container utility */
.container-responsive {
  /* Automatically handles responsive breakpoints */
  /* sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px */
}
```

## Usage Examples

### Typography

```jsx
<h1 className="text-display text-4xl font-bold">
  Display Heading
</h1>

<p className="text-body text-base leading-normal">
  Body text with consistent styling
</p>
```

### Shadows and Elevation

```jsx
<div className="shadow-elevation-2 rounded-lg p-6">
  Card with medium elevation
</div>

<div className="shadow-elevation-4 rounded-xl p-8">
  Modal with high elevation
</div>
```

### Spacing

```jsx
<div className="space-y-4">
  {/* Uses semantic spacing between children */}
</div>

<section className="py-section">
  {/* Uses semantic section spacing */}
</section>
```

### Transitions

```jsx
<button className="transition-fast hover:shadow-elevation-2">
  Button with fast transition
</button>
```

### Focus Management

```jsx
<input className="focus:focus-ring" />
```

## Customization

To customise any design token, simply update the CSS custom property in `app/globals.css`:

```css
:root {
  --radius: 0.5rem; /* Change base border radius */
  --spacing-component: 2rem; /* Change component spacing */
}
```

## Best Practices

1. **Use semantic tokens** when possible (e.g., `--spacing-component` instead of `--spacing-6`)
2. **Leverage Tailwind classes** for most styling needs
3. **Use custom utilities** for complex patterns
4. **Maintain consistency** by using the design tokens
5. **Test across themes** to ensure tokens work in both light and dark modes

## Migration from Hard-coded Values

Replace hard-coded values with design tokens:

```css
/* Before */
.card {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

/* After */
.card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-6);
}
```

This approach ensures your design system is maintainable, consistent, and scalable.
