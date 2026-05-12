// app.jsx — Alexander Oliver landing page
// Centered, premium, white-with-techy-texture aesthetic — rounded white cards,
// single red accent card, chip pills, tabular-numeral clock, generous whitespace.

const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "tagline": "help",
  "newsletterStyle": "red",
  "cursorMagnet": true,
  "entrance": true,
  "livePerthTime": true,
  "showFreeResource": true,
  "ringBreathing": true
}/*EDITMODE-END*/;

const TAGLINES = {
  build: "I build AI marketing systems that drive leads — not just content.",
  plug:  "I plug AI into your marketing. Leads, not just content.",
  help:  "I help WA founders use AI to grow real businesses.",
};

const BLURB = "Here, just trying to share my very limited wisdom and life experience.";

// ── Perth time ────────────────────────────────────────────────────────────
function PerthClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const tick = () => setT(new Date());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = (opts) => t.toLocaleString('en-AU', { timeZone: 'Australia/Perth', ...opts });
  const hhmm = fmt({ hour: '2-digit', minute: '2-digit', hour12: false });
  const ss   = fmt({ second: '2-digit' });
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-mid font-body">
      <span className="relative inline-flex w-1.5 h-1.5">
        <span className="absolute inset-0 rounded-full bg-red-brand opacity-50 animate-ping"></span>
        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-red-brand"></span>
      </span>
      <span className="tnum">Perth · {hhmm}<span className="text-ink-soft">:{ss}</span></span>
    </div>
  );
}

// ── Magnet wrapper ────────────────────────────────────────────────────────
function Magnet({ children, enabled, strength = 0.28, range = 70, className = "" }) {
  const ref = useRef(null);
  const rafRef = useRef(0);
  useEffect(() => {
    if (!enabled) { if (ref.current) ref.current.style.transform = ''; return; }
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const d = Math.hypot(dx, dy);
        if (d < range) {
          const f = (1 - d / range) * strength;
          el.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
        } else {
          el.style.transform = '';
        }
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      if (el) el.style.transform = '';
    };
  }, [enabled, strength, range]);
  return <span ref={ref} className={`magnet ${className}`}>{children}</span>;
}

// ── Avatar slot — drop assets/avatar.gif (or .png/.mp4) to fill
const AVATAR_SRC = "assets/logo-animated.gif";
function AvatarSlot({ size = 96, breathing = true }) {
  const [errored, setErrored] = useState(false);
  const showImg = !!AVATAR_SRC && !errored;
  return (
    <div
      className={`gif-slot ${breathing ? 'breathing' : ''} scaleIn`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {showImg ? (
        <img src={AVATAR_SRC} alt="" onError={() => setErrored(true)} loading="eager" />
      ) : (
        <div className="gif-slot-placeholder">
          <span style={{ fontSize: size * 0.10, opacity: 0.8 }}>GIF</span>
          <span style={{ fontSize: size * 0.07, opacity: 0.55 }}>SLOT</span>
        </div>
      )}
    </div>
  );
}

// ── Email form (MailerLite embed) ─────────────────────────────────────────
function MailerLiteForm({ onRed = false }) {
  return (
    <div
      id="mlb2-41169706"
      className={`ml-form-embedContainer ml-subscribe-form ml-subscribe-form-41169706${onRed ? ' on-red-card' : ''}`}
    >
      <div className="ml-form-align-center">
        <div className="ml-form-embedWrapper embedForm">
          <div className="ml-form-embedBody ml-form-embedBodyDefault row-form">
            <div className="ml-form-embedContent">
              <h4>Get the in&#8209;the&#8209;know notes.</h4>
              <p>Here, just trying to share my very limited wisdom and life experience.</p>
            </div>
            <form
              className="ml-block-form"
              action="https://assets.mailerlite.com/jsonp/2288085/forms/187223424254347000/subscribe"
              data-code=""
              method="post"
              target="_blank"
            >
              <div className="ml-form-formContent">
                <div className="ml-form-fieldRow ml-last-item">
                  <div className="ml-field-group ml-field-email ml-validate-email ml-validate-required">
                    <input
                      aria-label="email"
                      aria-required="true"
                      type="email"
                      className="form-control"
                      data-inputmask=""
                      name="fields[email]"
                      placeholder="Email"
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>
              <input type="hidden" name="ml-submit" value="1" />
              <div className="ml-form-embedSubmit">
                <button type="submit" className="primary">Subscribe</button>
                <button disabled={true} style={{display: 'none'}} type="button" className="loading">
                  <div className="ml-form-embedSubmitLoad"></div>
                  <span className="sr-only">Loading...</span>
                </button>
              </div>
              <input type="hidden" name="anticsrf" value="true" />
            </form>
          </div>
          <div className="ml-form-successBody row-success" style={{display: 'none'}}>
            <div className="ml-form-successContent">
              <h4>Thank you!</h4>
              <p>You have successfully joined our subscriber list.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Social pill ───────────────────────────────────────────────────────────
function SocialPill({ href, icon, label, handle, magnet }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
      <Magnet enabled={magnet} strength={0.25} range={60}>
        <span className="pill">
          {icon}
          <span>{label}</span>
          <span className="pill-handle">{handle}</span>
        </span>
      </Magnet>
    </a>
  );
}

// ── Eyebrow label ─────────────────────────────────────────────────────────
function Eyebrow({ children, color = 'red' }) {
  const cls = color === 'red' ? 'text-red-brand' : 'text-ink-soft';
  return (
    <div className={`text-[10.5px] font-bold uppercase tracking-[0.2em] ${cls} font-body`}>
      {children}
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────
function LabelRow({ left, right }) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-3.5">
      <Eyebrow>{left}</Eyebrow>
      {right && <span className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink-soft font-body tnum">{right}</span>}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────
const IconYouTube = () => (
  <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[5px] bg-red-brand text-white">
    <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M4.5 3.5v5l4-2.5-4-2.5z"/>
    </svg>
  </span>
);

const IconInstagram = () => (
  <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[5px] bg-ink text-white">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  </span>
);

// ── Main App ──────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const tagline = TAGLINES[t.tagline] || TAGLINES.build;
  const today = useMemo(() => new Date().toLocaleDateString('en-AU', {
    timeZone: 'Australia/Perth', weekday: 'short', day: 'numeric', month: 'short',
  }).toUpperCase(), []);

  useEffect(() => {
    window.ml_webform_success_41169706 = function() {
      var form = document.querySelector('.ml-subscribe-form-41169706 .row-form');
      var success = document.querySelector('.ml-subscribe-form-41169706 .row-success');
      if (form) form.style.display = 'none';
      if (success) success.style.display = '';
    };
    var s = document.createElement('script');
    s.src = 'https://groot.mailerlite.com/js/w/webforms.min.js?vb397d78ebaa8a0f631d35384c46d781b';
    s.type = 'text/javascript';
    s.onload = function() {
      fetch('https://assets.mailerlite.com/jsonp/2288085/forms/187223424254347000/takel');
    };
    document.body.appendChild(s);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Top bar */}
      <header className={`w-full max-w-[640px] px-5 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between ${t.entrance ? 'rise rise-0' : ''}`}>
        <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-ink-soft font-body tnum">
          <span className="text-red-brand">{today.split(' ').slice(0,1).join(' ')}</span>
          {' '}{today.split(' ').slice(1).join(' ')}
        </div>
        {t.livePerthTime && <PerthClock />}
      </header>

      {/* Hero */}
      <main className="w-full max-w-[640px] px-5 sm:px-6 pt-10 sm:pt-14 pb-8 flex-1 flex flex-col">
        <section className={`flex flex-col items-center text-center gap-5 sm:gap-6 ${t.entrance ? 'rise rise-1' : ''}`}>
          <AvatarSlot size={104} breathing={t.ringBreathing} />

          <h1
            className="font-display font-extrabold text-ink"
            style={{
              fontSize: 'clamp(2.5rem, 9vw, 4.25rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.045em',
            }}
          >
            Alexander Oliver
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-mid">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-brand"></span>
              AI strategist
            </span>
            <span className="text-ink-faint">·</span>
            <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-mid">Perth, WA</span>
            <span className="text-ink-faint">·</span>
            <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-mid">TRIGRAMS Studio</span>
          </div>

          <p className={`text-[16px] sm:text-[17px] leading-[1.5] text-ink-mid max-w-[440px] ${t.entrance ? 'rise rise-2' : ''}`}>
            {tagline}
          </p>
        </section>

        {/* Find me */}
        <section className={`mt-10 sm:mt-14 ${t.entrance ? 'rise rise-3' : ''}`}>
          <LabelRow left="Find me" right="3 places" />
          <div className="flex flex-wrap justify-center gap-2.5">
            <SocialPill
              href="https://www.youtube.com/@trigramsstudio"
              icon={<IconYouTube />}
              label="YouTube"
              handle="@trigramsstudio"
              magnet={t.cursorMagnet}
            />
            <SocialPill
              href="https://www.instagram.com/alexandermoli_/"
              icon={<IconInstagram />}
              label="Instagram"
              handle="@alexandermoli_"
              magnet={t.cursorMagnet}
            />
            <SocialPill
              href="https://trigrams.studio"
              icon={<img src="assets/Logo.png" width="14" height="14" alt="" className="block" />}
              label="TRIGRAMS"
              handle="trigrams.studio"
              magnet={t.cursorMagnet}
            />
          </div>
        </section>

        {/* Newsletter */}
        <section className={`mt-8 sm:mt-10 ${t.entrance ? 'rise rise-4' : ''}`}>
          {t.newsletterStyle === 'red' ? (
            <div className="surface-red p-6 sm:p-7 relative">
              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-white/80 font-body">
                    In the know
                  </div>
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-white/55 font-body">
                    Newsletter
                  </div>
                </div>
                <div>
                  <h2 className="font-display font-bold text-white text-[22px] sm:text-[26px] leading-[1.1] tracking-[-0.025em]">
                    Get the in&#8209;the&#8209;know notes.
                  </h2>
                  <p className="mt-2.5 text-white/80 text-[14.5px] leading-[1.55] max-w-[420px]">
                    {BLURB}
                  </p>
                </div>
                <MailerLiteForm onRed={true} />
              </div>
            </div>
          ) : (
            <div className="surface p-6 sm:p-7">
              <div className="flex flex-col gap-5">
                <LabelRow left="In the know" right="Newsletter" />
                <div>
                  <h2 className="font-display font-bold text-ink text-[22px] sm:text-[26px] leading-[1.1] tracking-[-0.025em]">
                    Get the in&#8209;the&#8209;know notes.
                  </h2>
                  <p className="mt-2.5 text-ink-mid text-[14.5px] leading-[1.55] max-w-[420px]">
                    {BLURB}
                  </p>
                </div>
                <MailerLiteForm />
              </div>
            </div>
          )}
        </section>

        {/* Free resource */}
        {t.showFreeResource && (
          <section className={`mt-5 ${t.entrance ? 'rise rise-5' : ''}`}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="surface flex items-center justify-between gap-3 px-5 py-[18px] hover:border-ink/30 transition-colors group"
              style={{ textDecoration: 'none' }}
            >
              <Magnet enabled={t.cursorMagnet} strength={0.18} range={400} className="!block w-full">
                <span className="flex items-center justify-between gap-3 w-full">
                  <span className="flex items-center gap-3.5 min-w-0">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-tint text-red-brand shrink-0 transition-all group-hover:bg-red-brand group-hover:text-white">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1.5v8m0 0L3.5 6m3.5 3.5L10.5 6M2 12.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="flex flex-col items-start gap-1.5 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft leading-none">Free resource</span>
                      <span className="text-[15px] font-semibold text-ink truncate leading-none">20k Savings Tracker Printout</span>
                    </span>
                  </span>
                  <span className="text-[13px] font-semibold text-ink-mid group-hover:text-red-brand transition-colors shrink-0 inline-flex items-center gap-1">
                    Download
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10m0 0L8 3m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </span>
              </Magnet>
            </a>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className={`w-full max-w-[640px] px-5 sm:px-6 pb-7 sm:pb-9 flex items-center justify-between ${t.entrance ? 'rise rise-5' : ''}`}>
        <div className="inline-flex items-center gap-2 text-[12.5px] text-ink-mid">
          <img src="assets/Logo.png" width="14" height="14" alt="" className="inline-block" />
          <span>&copy; 2026 TRIGRAMS Studio</span>
        </div>
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft font-body">
          v0.1
        </div>
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Tagline" />
        <TweakSelect
          label="Variant"
          value={t.tagline}
          options={[
            { value: 'build', label: 'I build AI marketing systems…' },
            { value: 'plug',  label: 'I plug AI into your marketing.' },
            { value: 'help',  label: 'I help WA founders use AI…' },
          ]}
          onChange={(v) => setTweak('tagline', v)}
        />

        <TweakSection label="Newsletter card" />
        <TweakRadio
          label="Style"
          value={t.newsletterStyle}
          options={['red', 'white']}
          onChange={(v) => setTweak('newsletterStyle', v)}
        />

        <TweakSection label="Reactivity" />
        <TweakToggle label="Cursor magnetism"   value={t.cursorMagnet}     onChange={(v) => setTweak('cursorMagnet',     v)} />
        <TweakToggle label="Entrance animation" value={t.entrance}         onChange={(v) => setTweak('entrance',         v)} />
        <TweakToggle label="Avatar ring"        value={t.ringBreathing}    onChange={(v) => setTweak('ringBreathing',    v)} />
        <TweakToggle label="Live Perth time"    value={t.livePerthTime}    onChange={(v) => setTweak('livePerthTime',    v)} />

        <TweakSection label="Content" />
        <TweakToggle label="Free resource"      value={t.showFreeResource} onChange={(v) => setTweak('showFreeResource', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
