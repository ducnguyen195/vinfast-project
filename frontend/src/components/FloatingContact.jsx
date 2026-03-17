import React from 'react';

const HOTLINE_NUMBER = '0986585054';
const HOTLINE_DISPLAY = '0986.585.054';
const ZALO_URL = `https://zalo.me/${HOTLINE_NUMBER}`;

function PhoneIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.06 21 3 13.94 3 5a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FloatingContact() {
  return (
    <div
      className="pointer-events-none fixed left-4 z-50 flex flex-col items-start gap-3"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}
    >
      <div>
        <a
          href={ZALO_URL}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto relative flex h-20 w-20 items-center justify-center rounded-full bg-[#b9d5ff] shadow-[0_18px_36px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1"
          aria-label="Liên hệ Zalo"
        >
          <span className="absolute inset-0 rounded-full bg-[#7eb2ff] opacity-35 animate-ping"></span>
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#1677f2] text-base font-black text-white">
            Zalo
          </span>
        </a>
      </div>

      <div>
        <a
          href={`tel:${HOTLINE_NUMBER}`}
          className="pointer-events-auto flex h-12 w-[13.5rem] items-center overflow-hidden rounded-full bg-[#e52527] text-white shadow-[0_16px_42px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-0.5"
          aria-label={`Gọi hotline ${HOTLINE_DISPLAY}`}
        >
          <span className="flex h-full w-14 items-center justify-center rounded-r-[1.5rem] bg-black shadow-[18px_0_24px_rgba(0,0,0,0.35)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white ring-2 ring-white/70">
              <PhoneIcon />
            </span>
          </span>
          <span className="flex flex-1 items-center justify-center px-3 text-sm font-extrabold tracking-[0.04em] sm:text-base">
            {HOTLINE_DISPLAY}
          </span>
        </a>
      </div>
    </div>
  );
}

export default FloatingContact;