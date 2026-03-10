import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from 'react';
import { createPortal } from 'react-dom';
import type { SchedKitBookedData, SchedKitEmbedProps, SchedKitHandle } from './types';

const BASE_URL = 'https://schedkit.net';
const ACCENT = '#DFFF00';
const ACCENT_FG = '#0d0d0d';

function buildSrc(props: SchedKitEmbedProps): string {
  const base = props.baseUrl ?? BASE_URL;
  const url = new URL(`${base}/book/${props.user}/${props.event}`);
  if (props.prefillName) url.searchParams.set('name', props.prefillName);
  if (props.prefillEmail) url.searchParams.set('email', props.prefillEmail);
  if (props.timezone) url.searchParams.set('tz', props.timezone);
  if (props.branding === false) url.searchParams.set('nobranding', '1');
  return url.toString();
}

// ── Backdrop + Sheet shared between Popup and Widget ──
interface OverlayProps {
  src: string;
  onClose: () => void;
  onBooked?: (data: SchedKitBookedData) => void;
}

function Overlay({ src, onClose, onBooked }: OverlayProps) {
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'schedkit:booked' && onBooked) {
        onBooked(e.data.data as SchedKitBookedData);
      }
      if (e.data?.type === 'schedkit:close') {
        onClose();
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose, onBooked]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 2147483647,
    background: 'rgba(0,0,0,0.72)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    boxSizing: 'border-box',
  };

  const sheetStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: 960,
    height: '90vh',
    borderRadius: 18,
    overflow: 'hidden',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
    background: '#111112',
  };

  const closeStyle: React.CSSProperties = {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 1,
    background: 'rgba(0,0,0,0.55)',
    border: 'none',
    color: '#fff',
    borderRadius: '50%',
    width: 34,
    height: 34,
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  };

  return createPortal(
    <div style={backdropStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={sheetStyle}>
        <button style={closeStyle} onClick={onClose} aria-label="Close booking">✕</button>
        <iframe
          src={src}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Booking"
          loading="lazy"
        />
      </div>
    </div>,
    document.body
  );
}

// ── INLINE ──
function InlineEmbed(props: SchedKitEmbedProps) {
  const { height = 800, width = '100%', borderRadius = 12, className, style, onBooked } = props;
  const src = buildSrc(props);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'schedkit:booked' && onBooked) {
        onBooked(e.data.data as SchedKitBookedData);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onBooked]);

  return (
    <iframe
      src={src}
      width={width}
      height={height}
      frameBorder={0}
      style={{
        border: 'none',
        borderRadius,
        display: 'block',
        ...style,
      }}
      className={className}
      title="Booking"
      loading="lazy"
    />
  );
}

// ── POPUP ──
function PopupEmbed(props: SchedKitEmbedProps) {
  const { label = 'Book a meeting', buttonStyle, className, style, onOpen, onClose, onBooked } = props;
  const [open, setOpen] = useState(false);
  const src = buildSrc(props);

  const handleOpen = useCallback(() => { setOpen(true); onOpen?.(); }, [onOpen]);
  const handleClose = useCallback(() => { setOpen(false); onClose?.(); }, [onClose]);

  const btnStyle: React.CSSProperties = {
    background: ACCENT,
    color: ACCENT_FG,
    border: 'none',
    padding: '12px 24px',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
    ...buttonStyle,
  };

  return (
    <>
      <button style={btnStyle} className={className} onClick={handleOpen}>{label}</button>
      {open && <Overlay src={src} onClose={handleClose} onBooked={onBooked} />}
    </>
  );
}

// ── WIDGET ──
function WidgetEmbed(props: SchedKitEmbedProps) {
  const {
    label = 'Book now',
    corner = 'bottom-right',
    buttonStyle,
    onOpen,
    onClose,
    onBooked,
  } = props;
  const [open, setOpen] = useState(false);
  const src = buildSrc(props);

  const handleOpen = useCallback(() => { setOpen(true); onOpen?.(); }, [onOpen]);
  const handleClose = useCallback(() => { setOpen(false); onClose?.(); }, [onClose]);

  const isRight = corner === 'bottom-right';
  const btnStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 20,
    [isRight ? 'right' : 'left']: 20,
    zIndex: 2147483646,
    background: ACCENT,
    color: ACCENT_FG,
    border: 'none',
    padding: '13px 22px',
    borderRadius: 50,
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
    fontFamily: 'inherit',
    transition: 'transform 0.15s',
    ...buttonStyle,
  };

  return createPortal(
    <>
      <button
        style={btnStyle}
        onClick={open ? handleClose : handleOpen}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      >
        {label}
      </button>
      {open && <Overlay src={src} onClose={handleClose} onBooked={onBooked} />}
    </>,
    document.body
  );
}

// ── MAIN EXPORT ──
export const SchedKitEmbed = forwardRef<SchedKitHandle, SchedKitEmbedProps>((props, ref) => {
  const { mode = 'inline' } = props;
  const [forcedOpen, setForcedOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setForcedOpen(true),
    close: () => setForcedOpen(false),
  }));

  if (mode === 'inline') return <InlineEmbed {...props} />;
  if (mode === 'popup') {
    return (
      <>
        <PopupEmbed {...props} />
        {forcedOpen && (
          <Overlay
            src={buildSrc(props)}
            onClose={() => { setForcedOpen(false); props.onClose?.(); }}
            onBooked={props.onBooked}
          />
        )}
      </>
    );
  }
  if (mode === 'widget') {
    return (
      <>
        <WidgetEmbed {...props} />
        {forcedOpen && (
          <Overlay
            src={buildSrc(props)}
            onClose={() => { setForcedOpen(false); props.onClose?.(); }}
            onBooked={props.onBooked}
          />
        )}
      </>
    );
  }
  return null;
});

SchedKitEmbed.displayName = 'SchedKitEmbed';
