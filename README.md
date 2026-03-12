# @schedkit/react

[![npm version](https://img.shields.io/npm/v/@schedkit/react?color=dfff00&labelColor=0a0a0b)](https://www.npmjs.com/package/@schedkit/react)
[![license](https://img.shields.io/badge/license-MIT-dfff00?labelColor=0a0a0b)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@schedkit/react?color=dfff00&labelColor=0a0a0b)](https://bundlephobia.com/package/@schedkit/react)

React embed components for [SchedKit](https://schedkit.net) booking pages. Drop a scheduling form into any React app in one line — inline, popup, or floating widget.

---

## Install

```bash
npm install @schedkit/react
# or
yarn add @schedkit/react
# or
pnpm add @schedkit/react
```

React 17+ required. No other runtime dependencies.

---

## Usage

### Inline embed

Renders the booking form directly in your page.

```tsx
import { SchedKitEmbed } from '@schedkit/react';

export default function BookingPage() {
  return (
    <SchedKitEmbed
      user="jason"
      event="30min"
      height={800}
    />
  );
}
```

### Popup modal

Renders a button. Clicking it opens the booking form in a centered overlay.

```tsx
import { SchedKitEmbed } from '@schedkit/react';

export default function Hero() {
  return (
    <SchedKitEmbed
      user="jason"
      event="30min"
      mode="popup"
      label="Schedule a call"
      onBooked={(data) => console.log('Booked!', data)}
    />
  );
}
```

### Floating widget

Sticky button fixed to the corner of the page — works anywhere, no layout changes needed.

```tsx
import { SchedKitEmbed } from '@schedkit/react';

export default function App() {
  return (
    <>
      {/* your app */}
      <SchedKitEmbed
        user="jason"
        event="30min"
        mode="widget"
        label="Book now"
        corner="bottom-right"
      />
    </>
  );
}
```

### Programmatic control

Use `ref` to open/close programmatically, or `useSchedKit` to manage state yourself.

```tsx
import { useRef } from 'react';
import { SchedKitEmbed, useSchedKit } from '@schedkit/react';
import type { SchedKitHandle } from '@schedkit/react';

// Via ref
function MyComponent() {
  const ref = useRef<SchedKitHandle>(null);
  return (
    <>
      <button onClick={() => ref.current?.open()}>Open booking</button>
      <SchedKitEmbed ref={ref} user="jason" event="30min" mode="popup" />
    </>
  );
}

// Via hook
function MyComponent2() {
  const { isOpen, open, close } = useSchedKit();
  return (
    <>
      <button onClick={open}>Book a meeting</button>
      {isOpen && (
        <SchedKitEmbed
          user="jason"
          event="30min"
          mode="popup"
          onClose={close}
          onBooked={(data) => { console.log(data); close(); }}
        />
      )}
    </>
  );
}
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `user` | `string` | — | **Required.** SchedKit username |
| `event` | `string` | — | **Required.** Event slug |
| `mode` | `"inline" \| "popup" \| "widget"` | `"inline"` | Embed mode |
| `height` | `number \| string` | `800` | Iframe height (inline only) |
| `width` | `number \| string` | `"100%"` | Iframe width (inline only) |
| `borderRadius` | `number` | `12` | Border radius in px (inline only) |
| `label` | `string` | `"Book a meeting"` | Button label (popup/widget) |
| `buttonStyle` | `CSSProperties` | — | Override button styles |
| `corner` | `"bottom-right" \| "bottom-left"` | `"bottom-right"` | Widget corner position |
| `prefillName` | `string` | — | Pre-fill attendee name |
| `prefillEmail` | `string` | — | Pre-fill attendee email |
| `timezone` | `string` | — | Lock timezone (e.g. `"America/Chicago"`) |
| `onOpen` | `() => void` | — | Fires when overlay opens |
| `onClose` | `() => void` | — | Fires when overlay closes |
| `onBooked` | `(data: SchedKitBookedData) => void` | — | Fires when booking is confirmed |
| `className` | `string` | — | Class on the iframe/button (inline/popup) |
| `style` | `CSSProperties` | — | Style on the iframe (inline) |
| `branding` | `boolean` | `true` | Show SchedKit footer. Set `false` on paid plans to hide it. |

### `SchedKitBookedData`

```ts
interface SchedKitBookedData {
  uid: string;
  start_time: string;              // ISO 8601
  attendee_name: string;
  attendee_email: string;
  attendee_timezone: string;
  status: 'confirmed' | 'pending'; // 'pending' when host confirmation is required
  requires_confirmation: boolean;
}
```

### `SchedKitHandle` (ref)

```ts
interface SchedKitHandle {
  open: () => void;
  close: () => void;
}
```

---

## `useSchedKit` hook

```ts
const { isOpen, open, close, toggle } = useSchedKit();
```

Lightweight state hook for managing overlay visibility. Use when you want full control over the trigger UI.

---

## Get access

SchedKit is currently in early access. [Request an account →](https://schedkit.net/#request)

---

Powered by [SchedKit](https://schedkit.net)
