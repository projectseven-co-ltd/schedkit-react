export type SchedKitMode = 'inline' | 'popup' | 'widget';
export type SchedKitCorner = 'bottom-right' | 'bottom-left';

export interface SchedKitBookedData {
  uid: string;
  start_time: string;
  attendee_name: string;
  attendee_email: string;
  attendee_timezone: string;
  /** "confirmed" for instant bookings; "pending" when host confirmation is required */
  status: 'confirmed' | 'pending';
  /** True if the event type requires host confirmation before the booking is finalized */
  requires_confirmation: boolean;
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

  /**
   * Show SchedKit branding in the embedded page.
   * Default: true (free). Set to false on paid plans to hide the footer.
   * The server will ignore this flag unless the account has branding removal enabled.
   */
  branding?: boolean;
}

export interface SchedKitHandle {
  open: () => void;
  close: () => void;
}
