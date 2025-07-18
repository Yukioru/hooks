# @yukioru/hooks

A collection of powerful and flexible React hooks for UI development. Includes:

- `useSidebar` — advanced sidebar state and behavior management
- `useClickOutside` — handle clicks outside elements, with exclusions and ESC support
- `useContainerWidth` — responsive container width and breakpoints

## Installation

```bash
npm install @yukioru/hooks react react-dom
# or
yarn add @yukioru/hooks react react-dom
# or
bun add @yukioru/hooks react react-dom
```

## Usage Example

```tsx
import { useSidebar, useClickOutside, useContainerWidth } from '@yukioru/hooks';
```

---

## API Reference

### useSidebar

Manages sidebar open/close state, breakpoints, and advanced behaviors (hover, outside click, etc).

**Signature:**

```ts
function useSidebar<
  StateName extends string = 'hidden' | 'mini' | 'full',
  InitialOpen extends boolean = false,
>(
  options: UseSidebarOptions<StateName, InitialOpen>,
): UseSidebarReturn<StateName>;
```

**Options:**

- `containerRef?`: Ref to the container element
- `sidebarRef`: Ref to the sidebar element (**required**)
- `breakpoints`: Record of state name to min width (e.g. `{ mini: 600, full: 1200 }`)
- `initialOpen?`: Whether sidebar is open by default
- `onStateChange?`: Callback when state changes
- `onVisibilityChange?`: Callback when visibility changes
- `closeOnOutsideClick?`: Close sidebar on outside click
- `hoverOpenDelay?`, `hoverCloseDelay?`: Delays for hover open/close
- `hasAddons?`: Whether sidebar has additional content

**Returns:**

- `layoutState`: Current sidebar state name
- `contentLayoutState`: State for content area
- `states`: Object with boolean for each state
- `isOpen`: Is sidebar open
- `isVisible`: Is sidebar visible
- `toggle(next?)`: Toggle sidebar open/close

**Example:**

```tsx
const sidebarRef = useRef(null);
const { layoutState, isOpen, toggle } = useSidebar({
  sidebarRef,
  breakpoints: { hidden: 0, mini: 600, full: 1200 },
  initialOpen: true,
  closeOnOutsideClick: true,
});
```

---

### useClickOutside

Detects clicks outside a given element (or elements), with support for exclusions and ESC key.

**Signature:**

```ts
function useClickOutside(
  refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: (event: Event) => void,
  options?: UseClickOutsideOptions,
): void;
```

**Options:**

- `excludeRefs?`: Array of refs to ignore
- `disabled?`: Disable the hook
- `passive?`: Use passive event listeners (default: true)
- `capture?`: Use capture phase
- `handleEsc?`: Handle ESC key (default: true)
- `containerRef?`: Attach listeners to a specific container

**Example:**

```tsx
const ref = useRef(null);
useClickOutside(ref, () => setOpen(false));
```

---

### useContainerWidth

Tracks the width of a container (or window) and provides responsive breakpoints.

**Signature:**

```ts
// Returns width as number
function useContainerWidth(options?: {
  ref?: RefObject<HTMLElement>;
  initialWidth?: number | null;
}): number;

// Returns breakpoint state
function useContainerWidth<const BP extends readonly number[]>(options: {
  ref?: RefObject<HTMLElement>;
  breakpoints: BP;
  initialWidth?: number | null;
}): { [K in BP[number]]: boolean };
```

**Options:**

- `ref?`: Ref to the container element (default: window)
- `initialWidth?`: Initial width (for SSR)
- `breakpoints?`: Array of numbers for breakpoints

**Example:**

```tsx
const width = useContainerWidth();
// or
const bp = useContainerWidth({ breakpoints: [600, 1200] });
if (bp[600]) {
  /* >= 600px */
}
```

---

## License

MIT
