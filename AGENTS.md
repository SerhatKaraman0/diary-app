# Windsurf AI Agent Guidelines

## Project Overview
This is a Next.js application with Tailwind CSS. Follow these guidelines to maintain code quality, consistency, and best practices.

## Technology Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript (preferred) or JavaScript

## Next.js Best Practices

### App Router Structure
- Use the App Router (`app/` directory) for all new features
- Organize routes using folder-based routing
- Place route files in appropriate directories: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Use route groups `(group-name)` for organization without affecting URL structure

### Server vs Client Components
- **Default to Server Components** for better performance
- Only use Client Components when needed:
  - Interactive elements (onClick, onChange, etc.)
  - React hooks (useState, useEffect, etc.)
  - Browser-only APIs
- Mark Client Components with `'use client'` directive at the top
- Keep Client Components small and focused

### Data Fetching
- Fetch data in Server Components whenever possible
- Use async/await directly in Server Components
- Implement proper error handling with try-catch blocks
- Use `loading.tsx` for loading states
- Use `error.tsx` for error boundaries

### Performance Optimization
- Implement proper image optimization with `next/image`
- Use dynamic imports for code splitting: `dynamic()` from `next/dynamic`
- Leverage React Suspense for lazy loading
- Optimize fonts with `next/font`
- Minimize use of `'use client'` to reduce JavaScript bundle size

## Tailwind CSS Best Practices

### Utility-First Approach
- Use Tailwind utility classes directly in JSX
- Avoid custom CSS files unless absolutely necessary
- Compose utilities to build complex designs

### Responsive Design
- Use responsive modifiers: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Design mobile-first, then add responsive variants
- Example: `className="text-sm md:text-base lg:text-lg"`

### Class Organization
- Order classes logically: layout → spacing → sizing → typography → colors → effects
- Example: `className="flex items-center gap-4 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"`

### Custom Styling
- Extend Tailwind config for custom colors, spacing, etc. in `tailwind.config.ts`
- Use `@apply` directive sparingly in CSS files
- Prefer composition of utilities over creating custom classes

### Reusable Patterns
- Extract repeated patterns into components
- Use consistent spacing scale (4, 8, 12, 16, 24, 32, etc.)
- Maintain consistent color palette throughout the app

## Component Best Practices

### Component Structure
- Keep components small and focused (single responsibility)
- Use descriptive, PascalCase names for components
- Place reusable components in `components/` directory
- Co-locate component-specific files together

### Props and Types
- Define TypeScript interfaces for props
- Use destructuring for props
- Provide default values when appropriate
- Example:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  // component code
}
```

### State Management
- Use local state (useState) for component-specific data
- Lift state up when needed by multiple components
- Consider React Context for app-wide state
- Use Server Components to avoid unnecessary client-side state

## Code Quality Standards

### General Principles
- Write clean, readable, and maintainable code
- Follow DRY (Don't Repeat Yourself) principle
- Use meaningful variable and function names
- Add comments for complex logic only

### File Organization
```
app/
  ├── (routes)/
  │   ├── page.tsx
  │   └── layout.tsx
  ├── api/
  │   └── route.ts
  └── globals.css
components/
  ├── ui/
  │   └── Button.tsx
  └── features/
      └── FeatureComponent.tsx
lib/
  └── utils.ts
public/
  └── images/
```

### Naming Conventions
- Components: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- Files/folders: kebab-case for routes (`user-profile/`)
- Functions: camelCase (`getUserData`, `handleSubmit`)
- Constants: UPPER_SNAKE_CASE (`API_URL`, `MAX_ITEMS`)

### Error Handling
- Always handle errors gracefully
- Provide meaningful error messages
- Use error boundaries for catching React errors
- Log errors appropriately (avoid console.log in production)

## Accessibility

- Use semantic HTML elements
- Include proper ARIA labels when needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Add alt text to images

## Design Guidelines

### Visual Style: Simple & Clean
- Use a minimal, uncluttered design
- Maintain consistent spacing and alignment
- Ensure good typography hierarchy
- Keep interfaces intuitive and user-friendly

### Color Palette

Our application uses a sophisticated, earthy color palette. Always use these exact hex values:

#### Beige/Tan Palette
- `#E9DEC0` - Lightest beige (backgrounds, subtle highlights)
- `#C0B69B` - Light tan
- `#99927A` - Medium tan
- `#726D5B` - Dark tan
- `#4E4A3D` - Deep brown-tan
- `#202A22` - Very dark (near black)
- `#12110D` - Darkest (text, borders)

#### Neutral Gray Palette
- `#F3EFE8` - Off-white (backgrounds, cards)
- `#D4C5AE` - Warm light gray
- `#A69F8C` - Medium gray
- `#7A776B` - Mid-tone gray
- `#5E574C` - Dark gray
- `#3D3535` - Very dark gray
- `#1B1914` - Almost black (text)

#### Warm Brown Palette
- `#F5EFE7` - Cream (light backgrounds)
- `#E9C297` - Light peach-brown
- `#C79B60` - Golden brown
- `#9B7753` - Medium brown
- `#6C553A` - Dark brown
- `#443532` - Deep brown
- `#22190E` - Darkest brown

#### Accent Red Palette (Use Sparingly)
- `#FCE8CC` - Pale pink (subtle backgrounds)
- `#FF9296` - Coral pink
- `#FF4953` - Bright red (primary CTAs, alerts)
- `#CC182B` - Deep red (hover states, emphasis)
- `#8B0F1A` - Dark red (pressed states)
- `#4F0508` - Very dark red
- `#280203` - Darkest red

#### Base Gray Palette
- `#E0DEDA` - Light gray (dividers, borders)
- `#BBB8B2` - Medium-light gray
- `#92908D` - Mid gray (disabled states)
- `#6B6B68` - Dark gray (secondary text)
- `#464848` - Darker gray
- `#2A2A28` - Very dark gray
- `#111110` - Pure dark (text, UI elements)

### Color Usage Guidelines

**Backgrounds:**
- Primary: `#F3EFE8`, `#F5EFE7`, `#E9DEC0`
- Cards/Surfaces: `#E0DEDA`, `#F3EFE8`
- Dark mode alternatives: `#1B1914`, `#111110`, `#12110D`

**Text:**
- Primary text: `#111110`, `#1B1914`, `#12110D`
- Secondary text: `#6B6B68`, `#5E574C`
- Muted text: `#92908D`, `#A69F8C`

**Interactive Elements:**
- Primary CTA: `#FF4953` (background), `#FCE8CC` or `#F3EFE8` (text)
- Primary CTA hover: `#CC182B`
- Secondary buttons: `#C79B60`, `#9B7753`
- Links: `#443532`, `#6C553A`

**Borders & Dividers:**
- Subtle: `#E0DEDA`, `#D4C5AE`
- Standard: `#BBB8B2`, `#A69F8C`
- Emphasis: `#6B6B68`, `#5E574C`

**Status & Feedback:**
- Error/Alert: `#FF4953`, `#CC182B`
- Warning: `#E9C297`, `#C79B60`
- Success: `#6C553A`, `#4E4A3D` (use browns for positive states)
- Info: `#92908D`, `#7A776B`

### Tailwind Configuration

Add these colors to your `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      beige: {
        50: '#E9DEC0',
        100: '#C0B69B',
        200: '#99927A',
        300: '#726D5B',
        400: '#4E4A3D',
        500: '#202A22',
        600: '#12110D',
      },
      neutral: {
        50: '#F3EFE8',
        100: '#D4C5AE',
        200: '#A69F8C',
        300: '#7A776B',
        400: '#5E574C',
        500: '#3D3535',
        600: '#1B1914',
      },
      brown: {
        50: '#F5EFE7',
        100: '#E9C297',
        200: '#C79B60',
        300: '#9B7753',
        400: '#6C553A',
        500: '#443532',
        600: '#22190E',
      },
      accent: {
        50: '#FCE8CC',
        100: '#FF9296',
        200: '#FF4953',
        300: '#CC182B',
        400: '#8B0F1A',
        500: '#4F0508',
        600: '#280203',
      },
      gray: {
        50: '#E0DEDA',
        100: '#BBB8B2',
        200: '#92908D',
        300: '#6B6B68',
        400: '#464848',
        500: '#2A2A28',
        600: '#111110',
      },
    },
  },
}
```

### Design Principles

- **Earthy & Warm**: The palette creates a natural, organic feel
- **High Contrast**: Use dark text (`#111110`) on light backgrounds (`#F3EFE8`)
- **Accent Sparingly**: Red accents (`#FF4953`) should be used only for primary CTAs and important alerts
- **Hierarchy**: Use the tonal variations within each palette to create visual hierarchy
- **Consistency**: Stick to the defined color palette - avoid introducing new colors

---

## Visual Style Guide: "Digital Scrapbook" Aesthetic

### Core Aesthetic: Structured Chaos
The interface should feel like a physical desk or bullet journal - NOT a sleek modern SaaS app.

**Key Philosophy**: Avoid perfect alignment. Embrace the "Doodle" layout principle with intentional imperfection.

### 1. Background & Foundation

**Global Background:**
- Use off-white or cream-colored "paper" texture: `#F9F7F2` or `#FDFBF5` (Aged Paper)
- Apply a subtle dot-grid pattern (5px or 10px spacing) as the container background
- This creates the feeling of graph paper or a planning notebook

**Implementation:**
```css
body {
  background-color: #FDFBF5;
  background-image: radial-gradient(circle, #D4C5AE 1px, transparent 1px);
  background-size: 10px 10px;
}
```

### 2. Shadows: Paper Cutout Style

**Never use soft shadows.** Use hard, offset shadows to mimic physical paper layers.

**Standard Shadow:**
```css
box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.1);
```

**Elevated Shadow (hover states):**
```css
box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.15);
```

**Pressed Shadow:**
```css
box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
```

### 3. Layout Components

#### "Paper Patch" Containers
Lists, cards, and content sections should look like torn paper or stickers.

**Irregular Borders:**
- Use varying `border-radius` values: `border-radius: 8px 12px 10px 15px;`
- Or use `clip-path` for hand-torn effects
- Add a 2px solid border to mimic pen strokes

**Example Component:**
```jsx
<div className="bg-neutral-50 border-2 border-gray-300 p-6" 
     style={{
       borderRadius: '8px 12px 10px 15px',
       boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
       transform: 'rotate(-0.5deg)'
     }}>
  {/* Content */}
</div>
```

#### Rotated Elements
Apply slight random rotations to cards and stickers for organic feel.

**Rotation Values:** `-2deg` to `2deg`
```css
transform: rotate(-1deg);
transform: rotate(1.5deg);
transform: rotate(-0.5deg);
```

#### Washi Tape Headers
Use horizontal decorative strips as section anchors.

**Characteristics:**
- Height: 30-40px
- Add floral or geometric pattern texture
- Position at top or bottom of sections
- Colors: Muted Gold (`#D4AF37`), Sunset Orange (`#E67E22`), or Dusk Blue (`#2C3E50`)

```jsx
<div className="h-8 bg-opacity-80" 
     style={{
       background: 'repeating-linear-gradient(45deg, #D4AF37, #D4AF37 10px, #C79B60 10px, #C79B60 20px)',
       boxShadow: '0px 2px 0px rgba(0,0,0,0.1)'
     }}>
</div>
```

### 4. Typography System

Use **three distinct font styles** to replicate handmade journal aesthetics:

#### 1. The Header (Blocky) - "Label Maker" Style
**Use for:** Main titles like "GOALS," "HABITS," section headers

**Font Suggestions:**
- Alfa Slab One
- Black Ops One
- Bebas Neue
- Font weight: 700-900

**Style:**
```css
font-family: 'Alfa Slab One', sans-serif;
color: #FDFBF5; /* White text */
background-color: #111110; /* Black background */
padding: 8px 16px;
text-transform: uppercase;
letter-spacing: 2px;
```

#### 2. The Handwriting (Script) - Personal Touch
**Use for:** Journal entries, personal notes, user-written content

**Font Suggestions:**
- Caveat (cursive, natural)
- Indie Flower (playful)
- Patrick Hand (casual handwriting)
- Shadows Into Light

**Style:**
```css
font-family: 'Caveat', cursive;
font-size: 18-24px;
line-height: 1.6;
color: #1B1914;
```

#### 3. The Secondary (Print) - Typewriter Style
**Use for:** Labels, UI buttons, metadata, timestamps

**Font Suggestions:**
- Special Elite
- Courier Prime
- Anonymous Pro
- JetBrains Mono

**Style:**
```css
font-family: 'Special Elite', monospace;
font-size: 12-14px;
text-transform: uppercase;
letter-spacing: 1px;
color: #6B6B68;
```

**Google Fonts Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Special+Elite&family=Alfa+Slab+One&display=swap" rel="stylesheet">
```

### 5. Retro Celestial Color Palette

Add these special semantic colors to your palette:

| Element | Color Hex | Usage | Vibe |
|---------|-----------|-------|------|
| Primary Base | `#FDFBF5` | Main background | Aged Paper |
| Accent Red | `#C0392B` | CTAs, hearts, important | The Moon / Hearts |
| Muted Gold | `#D4AF37` | Stars, washi tape, highlights | Stars / Washi Tape |
| Dusk Blue | `#2C3E50` | Temperature log (cold), headers | Temperature Log (Cold) |
| Sunset Orange | `#E67E22` | Temperature log (warm), accents | Temperature Log (Warm) |

**Tailwind Extension:**
```typescript
colors: {
  journal: {
    paper: '#FDFBF5',
    heart: '#C0392B',
    star: '#D4AF37',
    cold: '#2C3E50',
    warm: '#E67E22',
  }
}
```

### 6. Interactive Components: "The Pixels"

#### Year in Pixels / Temperature Log Grids

**Grid Structure:**
- Use strict geometric grid layout
- Each cell: slight `border-radius: 2px`
- Gap between cells: `1px`
- This prevents sterile Excel-sheet appearance

**Cell Styling:**
```jsx
<div className="grid gap-[1px] grid-cols-31">
  {pixels.map((pixel) => (
    <div 
      key={pixel.id}
      className="w-4 h-4 rounded-[2px] border border-gray-200 transition-all hover:scale-110 hover:shadow-md"
      style={{ backgroundColor: pixel.color }}
    />
  ))}
</div>
```

**Hover States:**
- Apply subtle "lift" effect: `scale(1.1)` + increased shadow
- NOT just a color change

```css
.pixel:hover {
  transform: scale(1.1);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
}
```

#### Sticker Icons
**Replace standard Material icons** with hand-drawn SVG illustrations.

**Recommended icon style:**
- Bunnies, stars, crescent moons, hearts, flowers
- Outlined style with 2px stroke width
- Slightly imperfect/hand-drawn appearance

**Icon Sources:**
- Create custom SVGs with hand-drawn aesthetic
- Use illustration packs like "Doodle Icons" or "Handdrawn Icons"

### 7. CSS Implementation Guidelines

#### Border Style
Always use solid borders with pen-stroke width:
```css
border: 2px solid #111110;
```

#### List Styling
Use decorative bullets to match inspiration:
```css
ul {
  list-style-type: '★ ';
  padding-left: 1.5em;
}

/* Alternative decorative bullets */
list-style-type: '✦ ';
list-style-type: '◆ ';
list-style-type: '• ';
```

#### Button Styles
Buttons should feel like stickers or stamps:

```jsx
<button className="px-6 py-3 bg-journal-heart text-white font-mono uppercase tracking-wider border-2 border-gray-600 transition-all hover:scale-105"
        style={{
          boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
          transform: 'rotate(-1deg)'
        }}>
  Add Entry
</button>
```

#### Card Components
```jsx
<div className="bg-neutral-50 border-2 border-gray-300 p-6 transition-all hover:shadow-[6px_6px_0px_rgba(0,0,0,0.15)]"
     style={{
       borderRadius: '12px 8px 14px 10px',
       boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
       transform: 'rotate(0.5deg)'
     }}>
  <h3 className="font-['Alfa_Slab_One'] text-white bg-gray-600 px-4 py-2 inline-block -mt-8 -ml-8" 
      style={{ transform: 'rotate(-2deg)' }}>
    SECTION TITLE
  </h3>
  <div className="font-['Caveat'] text-lg mt-4">
    Your content here...
  </div>
</div>
```

### 8. Animation & Transitions

Keep animations playful but subtle:

```css
/* Standard transition */
transition: all 0.2s ease-out;

/* Hover lift */
transition: transform 0.2s ease, box-shadow 0.2s ease;

/* Sticker peel effect */
@keyframes peel {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-2deg) translateY(-2px); }
}
```

### 9. Spacing & Rhythm

**Use irregular spacing** to avoid grid-like rigidity:
- Instead of `gap-4` everywhere, vary: `gap-3`, `gap-5`, `gap-6`
- Add random margins to elements: `ml-2`, `mt-1`, `-mr-1`
- Create visual "clusters" rather than perfect rows

### 10. Developer Implementation Notes

**Priority Guidelines for Code Generation:**

1. **Always prioritize `border-style: solid` with 2px width** to mimic pen strokes
2. **Use hard shadows (`box-shadow: 4px 4px 0px`)** instead of soft blurs
3. **Apply slight rotations** (`transform: rotate()`) to most containers
4. **Use irregular border-radius** values for organic shapes
5. **Implement the three-font system** consistently
6. **Add decorative bullets** to lists (`list-style-type: '★ '`)
7. **Create hover states** that "lift" elements (scale + shadow increase)
8. **Use dot-grid background** on main containers
9. **Add washi tape decorative elements** to section dividers
10. **Keep interactions playful** but not distracting

**Example Complete Component:**
```jsx
export default function JournalCard({ title, children }) {
  return (
    <article 
      className="bg-neutral-50 border-2 border-gray-600 p-6 relative transition-all hover:scale-[1.02]"
      style={{
        borderRadius: '10px 15px 12px 8px',
        boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
        transform: 'rotate(-0.5deg)'
      }}
    >
      {/* Washi Tape Header */}
      <div 
        className="absolute -top-3 left-4 right-4 h-6 opacity-80"
        style={{
          background: 'repeating-linear-gradient(45deg, #D4AF37, #D4AF37 10px, #C79B60 10px, #C79B60 20px)',
          transform: 'rotate(-1deg)'
        }}
      />
      
      {/* Label Maker Title */}
      <h2 
        className="inline-block bg-gray-600 text-white px-4 py-2 font-['Alfa_Slab_One'] text-sm uppercase tracking-widest mb-4"
        style={{
          boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
          transform: 'rotate(-2deg)'
        }}
      >
        {title}
      </h2>
      
      {/* Content in handwriting font */}
      <div className="font-['Caveat'] text-lg leading-relaxed text-gray-600">
        {children}
      </div>
    </article>
  );
}
```

## Testing Approach

- Write tests for critical functionality
- Test user interactions and edge cases
- Use meaningful test descriptions
- Keep tests simple and focused

## Performance Checklist

- [ ] Images optimized with next/image
- [ ] Fonts optimized with next/font
- [ ] Minimal Client Components usage
- [ ] Code splitting implemented where beneficial
- [ ] No console.logs in production code
- [ ] Proper loading and error states

## Common Patterns

### Button Component Example
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md' 
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-colors';
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </button>
  );
}
```

## Version Control

- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Use meaningful branch names
- Review code before committing

## Additional Notes

- Prioritize user experience and performance
- Keep bundle size minimal
- Stay updated with Next.js and Tailwind updates
- Document complex features and decisions
- Ask for clarification when requirements are unclear

