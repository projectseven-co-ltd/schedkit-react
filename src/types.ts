export type SchedKitMode = 'inline' | 'popup' | 'widget';
export type SchedKitCorner = 'bottom-right' | 'bottom-left';

export interface SchedKitBookedData {
  uid: string;
  start_time: string;
  attendee_name: string;
  attendee_email: string;
  attendee_timezone: string;
}

export interface SchedKitEmbedProps {
  /** SchedKit username */
  user: string;
  /** Event slug */
  event: string;
  /** Embed mode — default "inline" */
  mode?: SchedKitMode;

  // ── Inline options ──
  /** iframe height — default 800 */
  height?: number | string;
  /** iframe width — default "100%" */
  width?: number | string;
  /** Border radius in px — default 12 */
  borderRadius?: number;

  // ── Popup / Widget options ──
  /** Button label for popup/widget — default "Book a meeting" */
  label?: string;
  /** Override button styles */
  buttonStyle?: React.CSSProperties;
  /** Widget corner position — default "bottom-right" */
  corner?: SchedKitCorner;

  // ── Prefill ──
  prefillName?: string;
  prefillEmail?: string;
  timezone?: string;

  // ── Callbacks ──
  onOpen?: () => void;
  onClose?: () => void;
  /** Fires when booking is confirmed (via postMessage from iframe) */
  onBooked?: (data: SchedKitBookedData) => void;

  // ── Misc ──
  className?: string;
  style?: React.CSSProperties;

  /** Base URL — default "https://schedkit.net" */
  baseUrl?: string;
}

export interface SchedKitHandle {
  open: () => void;
  close: () => void;
}
