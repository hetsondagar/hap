## HAP UI Animations – Midnight Violet Flux

This document summarizes all currently implemented animations and motion utilities in the frontend. All are CSS-based (no layout/logic changes), themed to Midnight Violet Flux.

### Global Keyframes (defined in `src/index.css`)
- shine: sweeping shimmer used for shine effects on elements.
- badge-glow: pulsing outer glow for badges.
- progress-pulse: subtle opacity pulse for progress states.
- celebration-bounce: quick bounce for success micro-moments.
- sparkle-float: float/fade for particle-like sparkle.
- gradient-flow: animates background-position for gradient text/indicators.
- fade-in: opacity + translateY entrance.
- slide-up: longer translateY entrance.
- pulse-glow: glow intensity alternation (used by .badge-glow, premium styles).
- glow-pulse: broader glow oscillation for general elements.
- card-flip / card-flip-reverse: 3D Y-axis flip in/out.
- scale-in: pop-in scale entrance.
- slide-in-left / slide-in-right: directional fade + slide entrances.
- shimmer: background-position sweep used by shimmering surfaces.
- bounce-subtle: idle bounce loop for attention.
- float: idle float loop for orbs/background elements.
- button-pulse: expanding ring pulse for call-to-action emphasis.
- gradient-shift: slow gradient movement for premium elements.
- circuit-float: slow drift of circuit overlays.
- circuit-pulse: circuit grid faint pulsing.
- glass-shimmer: diagonal glass sweep shine.
- tech-glow: neon glow oscillation.
- lightning-border: animated gradient border flicker.

### Utility Classes (apply directly in JSX)
- animate-fade-in: uses fade-in keyframes.
- animate-slide-up: uses slide-up keyframes.
- animate-glow-pulse: uses glow-pulse for oscillating glow.
- animate-scale-in: scale-in entrance.
- animate-slide-in-left / animate-slide-in-right: directional entrances.
- animate-shimmer: shimmer sweep.
- animate-bounce-subtle: idle bounce.
- animate-float: idle float.
- animate-in, fade-in-0, slide-in-from-bottom-4: additional entrance helpers.

### 3D/Flip Helpers
- perspective-1000: establishes 3D perspective on container.
- transform-style-preserve-3d: preserve 3D for children during flip.
- backface-hidden: prevents backface flash during flips.
- rotate-y-180 / rotate-y-0: flip states.
- card-flip-animation / card-flip-reverse-animation: animated flip transitions.

### Glass and Glow Surfaces
- glass-effect: glassmorphic background (blur + subtle gradient) with `glass-shimmer` overlay.
- circuit-pattern: animated circuit grid with floating glow nodes (uses circuit-float & pulse).
- gradient-border: premium gradient border frame with animated mask.
- hover-lift: on hover, translateY(-8px) + scale(1.02) + neon shadows.
- hover-glow: on hover, magenta/violet neon bloom and mild scale.
- feature-card-hover: combined lift + multi-layer neon glow + lightning-border.
- gradient-text / gradient-text-engineering: animated gradient text (gradient-flow).

### Component-Specific Behaviors
- Buttons (`src/components/ui/button.tsx` and `premium-button.tsx`):
  - Default: gradient background (violet→magenta), glow pulse, hover lift (-2px), active scale(0.95).
  - Destructive/Outline/Ghost/Secondary: themed hover lift + glow; disabled lowers opacity, removes glow.
  - Premium variants may use `animate-button-pulse` and `animate-shimmer`.

- Inputs/Textareas (`ui/input.tsx`, `ui/textarea.tsx`):
  - Transparent borders, translucent panels.
  - Focus: neon violet ring + soft inner glow.
  - Placeholders dimmed; success/error via theme vars.

- Tabs (`ui/tabs.tsx`):
  - Active trigger gets neon gradient underline with glow sweep.
  - List has subtle translucent panel with magenta border.

- Tooltips (`ui/tooltip.tsx`):
  - Fade/zoom entrance and directional slide; dark-violet bg with magenta border glow.

- Badges (`ui/badge.tsx`):
  - Glowing edges, default gradient fill, gentle glow pulse.

- Progress (`ui/progress.tsx`):
  - Track: translucent dark.
  - Indicator: animated gradient bar (D16BA5→86A8E7→5FFBF1) with smooth width transition.
  - Flow speed increases as value grows; quick pulse on completion can be added with particles.

### Particles & Rank Flares
- Particle system (`src/lib/particles.tsx`):
  - `ParticleLayer` mounts globally in `src/main.tsx` and listens for `hap:particles` events.
  - `emitParticles({ x, y, count, colors, lifetimeMs })` helper dispatches a burst.
  - CSS keyframes: `particle-pop` uses CSS vars `--dx`, `--dy` for trajectory; colors match theme (violet, magenta, cyan).
  - Usage example:
    ```ts
    import { emitParticles } from '@/lib/particles';
    const onSuccess = (e: React.MouseEvent) => {
      emitParticles({ x: e.clientX, y: e.clientY, count: 18 });
    };
    ```

- Leaderboard rank flare:
  - Utility `.rank-flare` triggers a 600ms neon bloom around an item.
  - Apply when a rank improves to draw attention.

### Background/Ornament Animations
- Body before/after layers animate subtle radial orbs and circuit lines (`circuit-float`, `circuit-pulse`).
- Optional parallax-like orbs via `animate-float` on decorative elements.

### Usage Examples
```tsx
// Entrance for a section
<section className="animate-slide-up"> ... </section>

// Glow pulsing icon
<Icon className="animate-glow-pulse" />

// Feature card with glass + glow
<Card className="glass-effect circuit-pattern feature-card-hover"> ... </Card>

// Gradient animated text
<h1 className="gradient-text">Midnight Violet Flux</h1>

// Flashcard flip container
<div className="perspective-1000">
  <div className="transform-style-preserve-3d card-flip-animation"> ... </div>
</div>
```

### Performance Notes
- Animations use transform/opacity where possible for 60fps.
- Durations: 150–300ms for interactions; idle loops are subtle.
- All effects are purely visual and do not alter layout or component hierarchy.


