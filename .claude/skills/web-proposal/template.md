# Web Proposal HTML Template

Copy this entire HTML block, replace all `REPLACE_` placeholders with client content, and write to `projects/proposals/[client-name]/index.html`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>REPLACE_PAGE_TITLE — Proposal for REPLACE_CLIENT_NAME</title>
  <meta name="description" content="REPLACE_META_DESCRIPTION" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Noto+Serif+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            cream: '#FDFBF7',
            sand: '#F5F0E8',
            stone: '#D4CBC0',
            moss: '#4A5D4F',
            'moss-deep': '#3A4A3E',
            charcoal: '#2C2C2C',
            'warm-gray': '#8B8279',
          },
          fontFamily: {
            display: ['Outfit', 'sans-serif'],
            serif: ['"Noto Serif JP"', 'serif'],
          },
        },
      },
    }
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; font-size: 1rem; }
    @media (min-width: 768px) { html { font-size: 1.6rem; } }
    body {
      font-family: 'Outfit', sans-serif;
      background-color: #FDFBF7;
      color: #2C2C2C;
      overflow-x: hidden;
      line-height: 1.6;
    }
    .sand-lines h1, .sand-lines .text-6xl { line-height: 1.1; }
    .sand-lines h2, .sand-lines .text-5xl { line-height: 1.1; }
    .zen-transition { transition: all 0.7s cubic-bezier(0.32, 0.72, 0, 1); }
    .fade-up {
      opacity: 0;
      transform: translateY(2.5rem);
      transition: opacity 0.9s cubic-bezier(0.32, 0.72, 0, 1), transform 0.9s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .fade-up.visible { opacity: 1; transform: translateY(0); }
    .stagger-1 { transition-delay: 0.05s; }
    .stagger-2 { transition-delay: 0.12s; }
    .stagger-3 { transition-delay: 0.2s; }
    .stagger-4 { transition-delay: 0.28s; }
    .stagger-5 { transition-delay: 0.36s; }
    .stagger-6 { transition-delay: 0.44s; }
    #dotGrid { display: block; }
    .sand-lines {
      background-image: repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(74, 93, 79, 0.08) 31px, rgba(74, 93, 79, 0.08) 32px);
      background-size: 100% 32px;
    }
    @media (min-width: 768px) {
      .sand-lines {
        background-image: repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(74, 93, 79, 0.12) 50px, rgba(74, 93, 79, 0.12) 51px);
        background-size: 100% 51px;
      }
    }
    .grain-overlay {
      position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    }
    .nav-pill {
      backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px);
      background: #FDFBF7; border: 2px solid rgba(74, 93, 79, 0.25);
      box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.12);
      transition: all 0.7s cubic-bezier(0.32, 0.72, 0, 1); animation: none;
    }
    .nav-pill.nav-scrolled {
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      background: rgba(253, 251, 247, 0.4); border: 1px solid rgba(74, 93, 79, 0.06);
      box-shadow: 0 4px 20px -6px rgba(0, 0, 0, 0.04); overflow: hidden;
    }
    .nav-pill.nav-scrolled > * { position: relative; z-index: 1; }
    .nav-pill.nav-scrolled a { color: #2C2C2C; }
    .nav-pill.nav-scrolled::after {
      content: ''; position: absolute; width: 40%; top: -50%; bottom: -50%; z-index: 0;
      background: radial-gradient(ellipse 50% 100% at center, rgba(253, 251, 247, 0.5) 0%, rgba(253, 251, 247, 0.25) 40%, transparent 70%);
      pointer-events: none; animation: ripple-x 15s ease-in-out infinite alternate;
    }
    @keyframes ripple-x { 0% { left: -10%; } 100% { left: 70%; } }
    .cta-btn { position: relative; overflow: hidden; }
    .cta-btn::before {
      content: ''; position: absolute; inset: 0; background: #3A4A3E;
      transform: scaleX(0); transform-origin: right;
      transition: transform 0.6s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .cta-btn:hover::before { transform: scaleX(1); transform-origin: left; }
    .cta-btn span, .cta-btn .arrow-wrap { position: relative; z-index: 1; }
    .card-shell {
      background: rgba(0, 0, 0, 0.04); border: 2px solid rgba(74, 93, 79, 0.18);
      padding: 6px; border-radius: 2rem;
    }
    .card-core {
      background: #FFFFFF; border-radius: calc(2rem - 6px);
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 20px 40px -10px rgba(0, 0, 0, 0.1);
    }
    .service-card:hover .card-core {
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 24px 48px -12px rgba(74, 93, 79, 0.1);
    }
    .mobile-menu { opacity: 0; pointer-events: none; transition: opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1); }
    .mobile-menu.open { opacity: 1; pointer-events: auto; }
    .mobile-menu .menu-link { transform: translateY(3rem); opacity: 0; transition: all 0.6s cubic-bezier(0.32, 0.72, 0, 1); }
    .mobile-menu.open .menu-link { transform: translateY(0); opacity: 1; }
    .mobile-menu.open .menu-link:nth-child(1) { transition-delay: 0.1s; }
    .mobile-menu.open .menu-link:nth-child(2) { transition-delay: 0.15s; }
    .mobile-menu.open .menu-link:nth-child(3) { transition-delay: 0.2s; }
    .mobile-menu.open .menu-link:nth-child(4) { transition-delay: 0.25s; }
    .mobile-menu.open .menu-link:nth-child(5) { transition-delay: 0.3s; }
    .hamburger-line { transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1); }
    .hamburger.active .hamburger-line:first-child { transform: translateY(6px) rotate(45deg); }
    .hamburger.active .hamburger-line:last-child { transform: translateY(-6px) rotate(-45deg); }
    @media (max-width: 768px) {
      .max-w-\[80vw\] { max-width: 90vw; padding-left: 1.25rem; padding-right: 1.25rem; }
      h1 { font-size: 2.25rem !important; }
      h2 { font-size: 1.75rem !important; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      .fade-up { opacity: 1; transform: none; filter: none; }
    }
  </style>
</head>
<body class="sand-lines">
  <div class="grain-overlay" aria-hidden="true"></div>

  <!-- Navigation -->
  <nav class="fixed top-0 left-0 right-0 z-40 px-4 pt-6">
    <div class="nav-pill max-w-[80vw] mx-auto rounded-full px-6 py-3.5 flex items-center justify-between">
      <a href="#" class="flex items-center gap-2.5">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="13" stroke="#4A5D4F" stroke-width="1.2"/>
          <circle cx="14" cy="14" r="4" fill="#4A5D4F" opacity="0.7"/>
          <circle cx="14" cy="7" r="1.5" fill="#4A5D4F" opacity="0.4"/>
        </svg>
        <span class="font-display font-semibold text-charcoal tracking-tight text-lg">Mismoi</span>
      </a>
      <div class="hidden md:flex items-center gap-8">
        <a href="#problem" class="text-sm text-warm-gray hover:text-charcoal zen-transition font-medium">Problem</a>
        <a href="#approach" class="text-sm text-warm-gray hover:text-charcoal zen-transition font-medium">Approach</a>
        <a href="#investment" class="text-sm text-warm-gray hover:text-charcoal zen-transition font-medium">Investment</a>
        <a href="#faq" class="text-sm text-warm-gray hover:text-charcoal zen-transition font-medium">FAQ</a>
        <a href="REPLACE_STRIPE_LINK" class="cta-btn bg-moss text-cream rounded-full px-5 py-2.5 text-sm font-medium flex items-center gap-2.5 hover:bg-moss-deep zen-transition active:scale-[0.98]">
          <span>Approve Proposal</span>
          <span class="arrow-wrap w-6 h-6 rounded-full bg-white/15 flex items-center justify-center zen-transition">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"/></svg>
          </span>
        </a>
      </div>
      <button class="hamburger md:hidden flex flex-col gap-1.5 p-2" onclick="toggleMenu()" aria-label="Toggle navigation menu">
        <span class="hamburger-line w-5 h-[1.5px] bg-charcoal block"></span>
        <span class="hamburger-line w-5 h-[1.5px] bg-charcoal block"></span>
      </button>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <div class="mobile-menu fixed inset-0 z-30 bg-cream/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8" id="mobileMenu">
    <a href="#problem" class="menu-link font-display text-3xl text-charcoal font-medium" onclick="toggleMenu()">Problem</a>
    <a href="#approach" class="menu-link font-display text-3xl text-charcoal font-medium" onclick="toggleMenu()">Approach</a>
    <a href="#investment" class="menu-link font-display text-3xl text-charcoal font-medium" onclick="toggleMenu()">Investment</a>
    <a href="#faq" class="menu-link font-display text-3xl text-charcoal font-medium" onclick="toggleMenu()">FAQ</a>
    <a href="REPLACE_STRIPE_LINK" class="menu-link cta-btn bg-moss text-cream rounded-full px-8 py-4 text-lg font-medium flex items-center gap-3 zen-transition active:scale-[0.98]" onclick="toggleMenu()">
      <span>Approve Proposal</span>
      <span class="arrow-wrap w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"/></svg>
      </span>
    </a>
  </div>

  <main>
  <!-- Hero Section -->
  <section id="hero" class="min-h-[100dvh] relative flex items-center">
    <div class="max-w-[80vw] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center pt-36 pb-24 md:pt-32 md:pb-0">
      <div class="max-w-xl">
        <p class="fade-up stagger-1 text-sm uppercase tracking-[0.2em] text-moss font-medium mb-6">Proposal for REPLACE_CLIENT_NAME &middot; REPLACE_MONTH_YEAR</p>
        <h1 class="fade-up stagger-2 font-display text-4xl md:text-6xl tracking-tighter leading-none text-charcoal font-bold mb-8">
          REPLACE_HERO_HEADLINE<br />
          <span class="font-serif font-light italic text-moss">REPLACE_HERO_DRAMA</span>
        </h1>
        <p class="fade-up stagger-3 text-base md:text-lg text-warm-gray leading-relaxed max-w-[50ch] mb-10">
          REPLACE_HERO_BODY
        </p>
        <div class="fade-up stagger-4 flex flex-col sm:flex-row gap-4">
          <a href="#approach" class="cta-btn bg-moss text-cream rounded-full px-7 py-4 text-base font-medium flex items-center gap-3 hover:bg-moss-deep zen-transition active:scale-[0.98] w-fit">
            <span>REPLACE_HERO_CTA</span>
            <span class="arrow-wrap w-8 h-8 rounded-full bg-white/15 flex items-center justify-center zen-transition">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h8m0 0L7 3m3 3L7 9"/></svg>
            </span>
          </a>
          <a href="#investment" class="rounded-full px-7 py-4 text-base font-medium text-charcoal border-2 border-charcoal/40 hover:border-charcoal/60 bg-[#EEEBe4] zen-transition active:scale-[0.98] w-fit text-center">
            View pricing
          </a>
        </div>
      </div>
      <div class="relative flex items-center justify-center min-h-[400px] md:min-h-[500px] hidden md:flex">
        <canvas id="dotGrid" class="absolute inset-0 w-full h-full"></canvas>
      </div>
    </div>
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 fade-up stagger-5">
      <span class="text-[10px] uppercase tracking-[0.2em] text-warm-gray/50 font-medium">Scroll</span>
      <div class="w-[1px] h-8 bg-gradient-to-b from-warm-gray/30 to-transparent"></div>
    </div>
  </section>

  <!-- Summary Section -->
  <section class="py-16 md:py-[160px] lg:py-[288px]">
    <div class="max-w-[80vw] mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">
        <div class="md:col-span-6">
          <span class="fade-up inline-block rounded-full px-5 py-2 text-[15px] uppercase tracking-[0.2em] font-medium text-moss border border-moss/20 bg-[#EEEBe4] mb-8">The Situation</span>
          <h2 class="fade-up stagger-1 font-display text-3xl md:text-5xl tracking-tighter leading-none text-charcoal font-bold mb-8">
            REPLACE_SUMMARY_HEADING
          </h2>
          <p class="fade-up stagger-2 text-base text-warm-gray leading-relaxed max-w-[50ch] mb-4">
            REPLACE_SUMMARY_P1
          </p>
          <p class="fade-up stagger-3 text-base text-warm-gray leading-relaxed max-w-[50ch] mb-4">
            REPLACE_SUMMARY_P2
          </p>
          <p class="fade-up stagger-3 text-base text-warm-gray leading-relaxed max-w-[50ch]">
            REPLACE_SUMMARY_P3
          </p>
        </div>
        <div class="md:col-span-5 md:col-start-8 relative">
          <div class="fade-up stagger-2 card-shell relative z-10">
            <div class="card-core p-8 md:p-10">
              <div class="grid grid-cols-2 gap-8">
                <div>
                  <span class="font-display text-3xl md:text-4xl font-bold text-charcoal tracking-tighter">REPLACE_STAT_1_VALUE</span>
                  <p class="text-warm-gray text-sm mt-1">REPLACE_STAT_1_LABEL</p>
                </div>
                <div>
                  <span class="font-display text-3xl md:text-4xl font-bold text-charcoal tracking-tighter">REPLACE_STAT_2_VALUE</span>
                  <p class="text-warm-gray text-sm mt-1">REPLACE_STAT_2_LABEL</p>
                </div>
                <div>
                  <span class="font-display text-3xl md:text-4xl font-bold text-charcoal tracking-tighter">REPLACE_STAT_3_VALUE</span>
                  <p class="text-warm-gray text-sm mt-1">REPLACE_STAT_3_LABEL</p>
                </div>
                <div>
                  <span class="font-display text-3xl md:text-4xl font-bold text-moss tracking-tighter">REPLACE_STAT_4_VALUE</span>
                  <p class="text-warm-gray text-sm mt-1">REPLACE_STAT_4_LABEL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Problem Section -->
  <section id="problem" class="py-16 md:py-[160px] lg:py-[288px] bg-charcoal relative overflow-hidden">
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.3) 24px, rgba(255,255,255,0.3) 25px)" aria-hidden="true"></div>
    <div class="max-w-[80vw] mx-auto relative z-10">
      <div class="mb-16">
        <span class="fade-up inline-block rounded-full px-5 py-2 text-[15px] uppercase tracking-[0.2em] font-medium text-moss border border-moss/30 bg-moss/10 mb-8">The Problem</span>
        <h2 class="fade-up stagger-1 font-display text-3xl md:text-5xl tracking-tighter leading-none text-cream font-bold">
          REPLACE_PROBLEM_HEADING
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="fade-up stagger-1 card-shell service-card h-full" style="border-color: rgba(255,255,255,0.08); background: rgba(255,255,255,0.03);">
          <div class="card-core p-8 h-full" style="background: #333333;">
            <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
              <span class="font-display text-4xl font-bold text-moss/40 leading-none">01</span>
              <span class="text-xs font-medium text-red-400 uppercase tracking-wider">REPLACE_PROBLEM_1_TAG</span>
            </div>
            <h3 class="font-display text-lg font-semibold text-cream tracking-tight mb-3">REPLACE_PROBLEM_1_TITLE</h3>
            <p class="text-stone/50 text-sm leading-relaxed">REPLACE_PROBLEM_1_BODY</p>
          </div>
        </div>
        <div class="fade-up stagger-2 card-shell service-card h-full" style="border-color: rgba(255,255,255,0.08); background: rgba(255,255,255,0.03);">
          <div class="card-core p-8 h-full" style="background: #333333;">
            <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
              <span class="font-display text-4xl font-bold text-moss/40 leading-none">02</span>
              <span class="text-xs font-medium text-red-400 uppercase tracking-wider">REPLACE_PROBLEM_2_TAG</span>
            </div>
            <h3 class="font-display text-lg font-semibold text-cream tracking-tight mb-3">REPLACE_PROBLEM_2_TITLE</h3>
            <p class="text-stone/50 text-sm leading-relaxed">REPLACE_PROBLEM_2_BODY</p>
          </div>
        </div>
        <div class="fade-up stagger-3 card-shell service-card h-full" style="border-color: rgba(255,255,255,0.08); background: rgba(255,255,255,0.03);">
          <div class="card-core p-8 h-full" style="background: #333333;">
            <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
              <span class="font-display text-4xl font-bold text-moss/40 leading-none">03</span>
              <span class="text-xs font-medium text-red-400 uppercase tracking-wider">REPLACE_PROBLEM_3_TAG</span>
            </div>
            <h3 class="font-display text-lg font-semibold text-cream tracking-tight mb-3">REPLACE_PROBLEM_3_TITLE</h3>
            <p class="text-stone/50 text-sm leading-relaxed">REPLACE_PROBLEM_3_BODY</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Solution Section -->
  <section id="approach" class="py-16 md:py-[160px] lg:py-[288px]">
    <div class="max-w-[80vw] mx-auto">
      <div class="mb-16 max-w-2xl">
        <span class="fade-up inline-block rounded-full px-5 py-2 text-[15px] uppercase tracking-[0.2em] font-medium text-moss border border-moss/20 bg-[#EEEBe4] mb-8">The Solution</span>
        <h2 class="fade-up stagger-1 font-display text-3xl md:text-5xl tracking-tighter leading-none text-charcoal font-bold mb-8">
          REPLACE_SOLUTION_HEADING
        </h2>
        <p class="fade-up stagger-2 text-base text-warm-gray leading-relaxed max-w-[50ch]">
          REPLACE_SOLUTION_INTRO
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="fade-up stagger-1 card-shell service-card h-full">
          <div class="card-core h-full p-8 flex flex-col justify-between">
            <div>
              <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
                <span class="font-display text-4xl font-bold text-moss/25 leading-none">01</span>
                <span class="text-xs font-medium text-moss uppercase tracking-wider">REPLACE_SOLUTION_1_TAG</span>
              </div>
              <h3 class="font-display text-lg font-semibold text-charcoal tracking-tight mb-2">REPLACE_SOLUTION_1_TITLE</h3>
              <p class="text-sm text-warm-gray mb-4">REPLACE_SOLUTION_1_SUBTITLE</p>
              <ul class="space-y-3">
                <li class="text-sm text-warm-gray leading-relaxed flex gap-2">
                  <span class="text-moss shrink-0 leading-relaxed">&bull;</span>
                  REPLACE_SOLUTION_1_BULLET_1
                </li>
                <li class="text-sm text-warm-gray leading-relaxed flex gap-2">
                  <span class="text-moss shrink-0 leading-relaxed">&bull;</span>
                  REPLACE_SOLUTION_1_BULLET_2
                </li>
                <li class="text-sm text-warm-gray leading-relaxed flex gap-2">
                  <span class="text-moss shrink-0 leading-relaxed">&bull;</span>
                  REPLACE_SOLUTION_1_BULLET_3
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="fade-up stagger-2 card-shell service-card h-full">
          <div class="card-core h-full p-8 flex flex-col justify-between">
            <div>
              <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
                <span class="font-display text-4xl font-bold text-moss/25 leading-none">02</span>
                <span class="text-xs font-medium text-moss uppercase tracking-wider">REPLACE_SOLUTION_2_TAG</span>
              </div>
              <h3 class="font-display text-lg font-semibold text-charcoal tracking-tight mb-2">REPLACE_SOLUTION_2_TITLE</h3>
              <p class="text-sm text-warm-gray mb-4">REPLACE_SOLUTION_2_SUBTITLE</p>
              <ul class="space-y-3">
                <li class="text-sm text-warm-gray leading-relaxed flex gap-2">
                  <span class="text-moss shrink-0 leading-relaxed">&bull;</span>
                  REPLACE_SOLUTION_2_BULLET_1
                </li>
                <li class="text-sm text-warm-gray leading-relaxed flex gap-2">
                  <span class="text-moss shrink-0 leading-relaxed">&bull;</span>
                  REPLACE_SOLUTION_2_BULLET_2
                </li>
                <li class="text-sm text-warm-gray leading-relaxed flex gap-2">
                  <span class="text-moss shrink-0 leading-relaxed">&bull;</span>
                  REPLACE_SOLUTION_2_BULLET_3
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="fade-up stagger-3 card-shell service-card h-full">
          <div class="card-core h-full p-8 flex flex-col justify-between">
            <div>
              <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
                <span class="font-display text-4xl font-bold text-moss/25 leading-none">03</span>
                <span class="text-xs font-medium text-moss uppercase tracking-wider">REPLACE_SOLUTION_3_TAG</span>
              </div>
              <h3 class="font-display text-lg font-semibold text-charcoal tracking-tight mb-2">REPLACE_SOLUTION_3_TITLE</h3>
              <p class="text-sm text-warm-gray mb-4">REPLACE_SOLUTION_3_SUBTITLE</p>
              <ul class="space-y-3">
                <li class="text-sm text-warm-gray leading-relaxed flex gap-2">
                  <span class="text-moss shrink-0 leading-relaxed">&bull;</span>
                  REPLACE_SOLUTION_3_BULLET_1
                </li>
                <li class="text-sm text-warm-gray leading-relaxed flex gap-2">
                  <span class="text-moss shrink-0 leading-relaxed">&bull;</span>
                  REPLACE_SOLUTION_3_BULLET_2
                </li>
                <li class="text-sm text-warm-gray leading-relaxed flex gap-2">
                  <span class="text-moss shrink-0 leading-relaxed">&bull;</span>
                  REPLACE_SOLUTION_3_BULLET_3
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Timeline Section -->
  <section class="py-16 md:py-[160px] lg:py-[288px] border-t border-charcoal/8">
    <div class="max-w-[80vw] mx-auto">
      <div class="mb-20 max-w-2xl">
        <span class="fade-up inline-block rounded-full px-5 py-2 text-[15px] uppercase tracking-[0.2em] font-medium text-moss border border-moss/20 bg-[#EEEBe4] mb-8">Timeline</span>
        <h2 class="fade-up stagger-1 font-display text-3xl md:text-5xl tracking-tighter leading-none text-charcoal font-bold">
          REPLACE_TIMELINE_HEADING
        </h2>
      </div>
      <div class="relative">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          <div class="fade-up stagger-1 card-shell service-card h-full">
            <div class="card-core h-full p-8 flex flex-col justify-between">
              <div>
                <span class="font-display text-4xl font-bold text-moss/25 leading-none mb-5 block">01</span>
                <h3 class="font-display text-lg font-semibold text-charcoal tracking-tight mb-2">REPLACE_STEP_1_TITLE</h3>
                <p class="text-warm-gray text-sm leading-relaxed">REPLACE_STEP_1_BODY</p>
              </div>
            </div>
          </div>
          <div class="fade-up stagger-2 card-shell service-card h-full">
            <div class="card-core h-full p-8 flex flex-col justify-between">
              <div>
                <span class="font-display text-4xl font-bold text-moss/25 leading-none mb-5 block">02</span>
                <h3 class="font-display text-lg font-semibold text-charcoal tracking-tight mb-2">REPLACE_STEP_2_TITLE</h3>
                <p class="text-warm-gray text-sm leading-relaxed">REPLACE_STEP_2_BODY</p>
              </div>
            </div>
          </div>
          <div class="fade-up stagger-3 card-shell service-card h-full">
            <div class="card-core h-full p-8 flex flex-col justify-between">
              <div>
                <span class="font-display text-4xl font-bold text-moss/25 leading-none mb-5 block">03</span>
                <h3 class="font-display text-lg font-semibold text-charcoal tracking-tight mb-2">REPLACE_STEP_3_TITLE</h3>
                <p class="text-warm-gray text-sm leading-relaxed">REPLACE_STEP_3_BODY</p>
              </div>
            </div>
          </div>
          <div class="fade-up stagger-4 card-shell service-card h-full">
            <div class="card-core h-full p-8 flex flex-col justify-between">
              <div>
                <span class="font-display text-4xl font-bold text-moss/25 leading-none mb-5 block">04</span>
                <h3 class="font-display text-lg font-semibold text-charcoal tracking-tight mb-2">REPLACE_STEP_4_TITLE</h3>
                <p class="text-warm-gray text-sm leading-relaxed">REPLACE_STEP_4_BODY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Investment Section -->
  <section id="investment" class="py-16 md:py-[160px] lg:py-[288px] border-t border-charcoal/8">
    <div class="max-w-[80vw] mx-auto">
      <div class="mb-16 max-w-2xl">
        <span class="fade-up inline-block rounded-full px-5 py-2 text-[15px] uppercase tracking-[0.2em] font-medium text-moss border border-moss/20 bg-[#EEEBe4] mb-8">Investment</span>
        <h2 class="fade-up stagger-1 font-display text-3xl md:text-5xl tracking-tighter leading-none text-charcoal font-bold">
          Simple pricing. Clear scope.
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="fade-up stagger-1 card-shell service-card h-full">
          <div class="card-core p-8 md:p-10 h-full">
            <div class="flex items-center justify-between mb-8">
              <span class="text-xs uppercase tracking-[0.15em] text-warm-gray font-semibold">One-Time Setup</span>
              <span class="font-display text-3xl md:text-4xl font-bold text-charcoal tracking-tighter">REPLACE_SETUP_PRICE</span>
            </div>
            <ul class="space-y-4">
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_SETUP_ITEM_1</li>
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_SETUP_ITEM_2</li>
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_SETUP_ITEM_3</li>
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_SETUP_ITEM_4</li>
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_SETUP_ITEM_5</li>
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_SETUP_ITEM_6</li>
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_SETUP_ITEM_7</li>
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_SETUP_ITEM_8</li>
            </ul>
          </div>
        </div>
        <div class="fade-up stagger-2 card-shell service-card h-full">
          <div class="card-core p-8 md:p-10 h-full">
            <div class="flex items-center justify-between mb-8">
              <span class="text-xs uppercase tracking-[0.15em] text-warm-gray font-semibold">Peace of Mind Package</span>
              <p class="text-xs text-warm-gray mt-1">Monthly retainer</p>
              <span class="font-display text-3xl md:text-4xl font-bold text-charcoal tracking-tighter">REPLACE_MONTHLY_PRICE<span class="text-lg text-warm-gray font-normal">/mo</span></span>
            </div>
            <ul class="space-y-4">
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_MONTHLY_ITEM_1</li>
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_MONTHLY_ITEM_2</li>
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_MONTHLY_ITEM_3</li>
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_MONTHLY_ITEM_4</li>
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_MONTHLY_ITEM_5</li>
              <li class="text-sm text-warm-gray leading-relaxed flex gap-3"><span class="text-moss shrink-0 mt-0.5">&#10003;</span>REPLACE_MONTHLY_ITEM_6</li>
            </ul>
            <div class="mt-8 pt-6 border-t border-charcoal/8">
              <p class="text-xs text-warm-gray leading-relaxed">REPLACE_API_COST_NOTE</p>
            </div>
          </div>
        </div>
      </div>
      <div class="fade-up stagger-3 card-shell">
        <div class="card-core p-8 md:p-10" style="background: linear-gradient(135deg, #4A5D4F 0%, #3A4A3E 100%);">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FDFBF7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <h3 class="font-display text-lg font-semibold text-cream tracking-tight mb-2">Money-Back Guarantee</h3>
              <p class="text-cream/70 text-sm leading-relaxed">REPLACE_GUARANTEE_TEXT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section id="faq" class="py-16 md:py-[160px] lg:py-[288px] border-t border-charcoal/8">
    <div class="max-w-[80vw] mx-auto">
      <div class="mb-16">
        <span class="fade-up inline-block rounded-full px-5 py-2 text-[15px] uppercase tracking-[0.2em] font-medium text-moss border border-moss/20 bg-[#EEEBe4] mb-8">FAQ</span>
        <h2 class="fade-up stagger-1 font-display text-3xl md:text-5xl tracking-tighter leading-none text-charcoal font-bold">
          Common questions.
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="fade-up stagger-1 card-shell service-card h-full"><div class="card-core p-8 h-full">
          <h3 class="font-display text-base font-semibold text-charcoal tracking-tight mb-3">REPLACE_FAQ_1_Q</h3>
          <p class="text-sm text-warm-gray leading-relaxed">REPLACE_FAQ_1_A</p>
        </div></div>
        <div class="fade-up stagger-2 card-shell service-card h-full"><div class="card-core p-8 h-full">
          <h3 class="font-display text-base font-semibold text-charcoal tracking-tight mb-3">REPLACE_FAQ_2_Q</h3>
          <p class="text-sm text-warm-gray leading-relaxed">REPLACE_FAQ_2_A</p>
        </div></div>
        <div class="fade-up stagger-3 card-shell service-card h-full"><div class="card-core p-8 h-full">
          <h3 class="font-display text-base font-semibold text-charcoal tracking-tight mb-3">REPLACE_FAQ_3_Q</h3>
          <p class="text-sm text-warm-gray leading-relaxed">REPLACE_FAQ_3_A</p>
        </div></div>
        <div class="fade-up stagger-4 card-shell service-card h-full"><div class="card-core p-8 h-full">
          <h3 class="font-display text-base font-semibold text-charcoal tracking-tight mb-3">REPLACE_FAQ_4_Q</h3>
          <p class="text-sm text-warm-gray leading-relaxed">REPLACE_FAQ_4_A</p>
        </div></div>
        <div class="fade-up stagger-5 card-shell service-card h-full"><div class="card-core p-8 h-full">
          <h3 class="font-display text-base font-semibold text-charcoal tracking-tight mb-3">REPLACE_FAQ_5_Q</h3>
          <p class="text-sm text-warm-gray leading-relaxed">REPLACE_FAQ_5_A</p>
        </div></div>
        <div class="fade-up stagger-6 card-shell service-card h-full"><div class="card-core p-8 h-full">
          <h3 class="font-display text-base font-semibold text-charcoal tracking-tight mb-3">REPLACE_FAQ_6_Q</h3>
          <p class="text-sm text-warm-gray leading-relaxed">REPLACE_FAQ_6_A</p>
        </div></div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-16 md:py-[160px] lg:py-[288px]">
    <div class="max-w-[80vw] mx-auto">
      <div class="card-shell">
        <div class="card-core bg-charcoal relative overflow-hidden">
          <div class="absolute inset-0 opacity-[0.03]" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px)" aria-hidden="true"></div>
          <div class="relative z-10 p-10 md:p-16 lg:p-24">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div class="md:col-span-7">
                <span class="fade-up inline-block rounded-full px-5 py-2 text-[15px] uppercase tracking-[0.2em] font-medium text-moss border border-moss/30 bg-moss/10 mb-8">Next Steps</span>
                <h2 class="fade-up stagger-1 font-display text-3xl md:text-5xl tracking-tighter leading-none text-cream font-bold mb-8">
                  REPLACE_CTA_HEADING
                </h2>
                <ol class="fade-up stagger-2 space-y-4 mb-10">
                  <li class="text-stone/60 text-sm leading-relaxed flex gap-3"><span class="text-moss font-display font-bold shrink-0">1.</span>REPLACE_NEXT_STEP_1</li>
                  <li class="text-stone/60 text-sm leading-relaxed flex gap-3"><span class="text-moss font-display font-bold shrink-0">2.</span>REPLACE_NEXT_STEP_2</li>
                  <li class="text-stone/60 text-sm leading-relaxed flex gap-3"><span class="text-moss font-display font-bold shrink-0">3.</span>REPLACE_NEXT_STEP_3</li>
                  <li class="text-stone/60 text-sm leading-relaxed flex gap-3"><span class="text-moss font-display font-bold shrink-0">4.</span>REPLACE_NEXT_STEP_4</li>
                  <li class="text-stone/60 text-sm leading-relaxed flex gap-3"><span class="text-moss font-display font-bold shrink-0">5.</span>REPLACE_NEXT_STEP_5</li>
                  <li class="text-stone/60 text-sm leading-relaxed flex gap-3"><span class="text-moss font-display font-bold shrink-0">6.</span>REPLACE_NEXT_STEP_6</li>
                </ol>
                <p class="fade-up stagger-3 text-stone/40 text-xs leading-relaxed max-w-[45ch]">
                  REPLACE_URGENCY_TEXT
                </p>
              </div>
              <div class="md:col-span-5 flex flex-col items-center md:items-end gap-6">
                <div class="fade-up stagger-3">
                  <a href="REPLACE_STRIPE_LINK" class="cta-btn inline-flex items-center gap-3 bg-moss text-cream rounded-full px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-medium hover:bg-moss-deep zen-transition active:scale-[0.98]">
                    <span>Approve &amp; Get Started</span>
                    <span class="arrow-wrap w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/15 flex items-center justify-center zen-transition">
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"/></svg>
                    </span>
                  </a>
                </div>
                <p class="text-stone/40 text-xs">Questions? Email <a href="mailto:vu@mismoi.com" class="text-moss hover:text-cream zen-transition">vu@mismoi.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  </main>

  <!-- Footer -->
  <footer class="py-16 border-t border-charcoal/8">
    <div class="max-w-[80vw] mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div class="md:col-span-4">
          <div class="flex items-center gap-2.5 mb-4">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="13" stroke="#4A5D4F" stroke-width="1.2"/>
              <circle cx="14" cy="14" r="4" fill="#4A5D4F" opacity="0.7"/>
              <circle cx="14" cy="7" r="1.5" fill="#4A5D4F" opacity="0.4"/>
            </svg>
            <span class="font-display font-semibold text-charcoal tracking-tight">Mismoi</span>
          </div>
          <p class="text-warm-gray text-sm leading-relaxed max-w-[35ch]">
            AI automation systems that grow your business. Built to run. Built to last.
          </p>
        </div>
        <div class="md:col-span-2 md:col-start-7">
          <h4 class="text-xs uppercase tracking-[0.15em] text-charcoal font-semibold mb-4">Proposal</h4>
          <div class="flex flex-col gap-3">
            <a href="#problem" class="text-sm text-warm-gray hover:text-charcoal zen-transition">Problem</a>
            <a href="#approach" class="text-sm text-warm-gray hover:text-charcoal zen-transition">Approach</a>
            <a href="#investment" class="text-sm text-warm-gray hover:text-charcoal zen-transition">Investment</a>
            <a href="#faq" class="text-sm text-warm-gray hover:text-charcoal zen-transition">FAQ</a>
          </div>
        </div>
        <div class="md:col-span-2">
          <h4 class="text-xs uppercase tracking-[0.15em] text-charcoal font-semibold mb-4">Connect</h4>
          <div class="flex flex-col gap-3">
            <a href="mailto:vu@mismoi.com" class="text-sm text-warm-gray hover:text-charcoal zen-transition">vu@mismoi.com</a>
            <a href="https://calendly.com/vu-mismoi/30min" class="text-sm text-warm-gray hover:text-charcoal zen-transition">Book a Call</a>
          </div>
        </div>
        <div class="md:col-span-2">
          <h4 class="text-xs uppercase tracking-[0.15em] text-charcoal font-semibold mb-4">Terms</h4>
          <div class="flex flex-col gap-3">
            <span class="text-sm text-warm-gray">One-time setup + monthly retainer</span>
            <span class="text-sm text-warm-gray">Cancel monthly anytime</span>
            <span class="text-sm text-warm-gray">You own everything</span>
          </div>
        </div>
      </div>
      <div class="mt-16 pt-8 border-t border-charcoal/8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-xs text-warm-gray/50">&copy; 2026 Mismoi. All rights reserved.</p>
        <p class="text-xs text-warm-gray/50">Prepared for REPLACE_CLIENT_NAME &middot; REPLACE_MONTH_YEAR</p>
      </div>
    </div>
  </footer>

  <script>
    function toggleMenu() {
      var menu = document.getElementById('mobileMenu');
      var btn = document.querySelector('.hamburger');
      if (menu) menu.classList.toggle('open');
      if (btn) btn.classList.toggle('active');
      document.body.style.overflow = (menu && menu.classList.contains('open')) ? 'hidden' : '';
    }
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
      document.querySelectorAll('.fade-up').forEach(function(el) { observer.observe(el); });
      var navPill = document.querySelector('.nav-pill');
      var heroSection = document.getElementById('hero');
      if (navPill && heroSection) {
        var navObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) { navPill.classList.remove('nav-scrolled'); }
            else { navPill.classList.add('nav-scrolled'); }
          });
        }, { threshold: 0, rootMargin: '-80px 0px 0px 0px' });
        navObserver.observe(heroSection);
      }
    } else {
      document.querySelectorAll('.fade-up').forEach(function(el) { el.classList.add('visible'); });
    }
  </script>

  <script>
    (function() {
      var canvas = document.getElementById('dotGrid');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var dpr = window.devicePixelRatio || 1;
      var mouseX = -9999, mouseY = -9999;
      var dots = [];
      var SPACING = 22, BASE_RADIUS = 3.5, MAX_RADIUS = 9, EFFECT_RANGE = 120, EASE_SPEED = 0.08;
      function resize() {
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr);
        buildDots(rect.width, rect.height);
      }
      function blobRadius(angle, base) {
        return base + base * 0.15 * Math.sin(angle * 3 + 0.5) + base * 0.1 * Math.sin(angle * 5 + 1.2)
          + base * 0.08 * Math.cos(angle * 2 + 2.8) + base * 0.05 * Math.sin(angle * 7 + 0.3);
      }
      function buildDots(w, h) {
        dots = [];
        var cx = w / 2, cy = h / 2, blobBase = Math.min(w, h) * 0.4;
        for (var x = SPACING; x < w - SPACING; x += SPACING) {
          for (var y = SPACING; y < h - SPACING; y += SPACING) {
            var dx = x - cx, dy = y - cy, dist = Math.sqrt(dx * dx + dy * dy);
            var angle = Math.atan2(dy, dx), maxR = blobRadius(angle, blobBase);
            if (dist < maxR) { dots.push({ x: x, y: y, r: BASE_RADIUS, tr: BASE_RADIUS }); }
          }
        }
      }
      function draw() {
        var rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        for (var i = 0; i < dots.length; i++) {
          var d = dots[i], dx = d.x - mouseX, dy = d.y - mouseY;
          var dist = Math.sqrt(dx * dx + dy * dy);
          d.tr = dist < EFFECT_RANGE ? BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * (1 - dist / EFFECT_RANGE) : BASE_RADIUS;
          d.r += (d.tr - d.r) * EASE_SPEED;
          ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(74, 93, 79, 0.18)'; ctx.fill();
        }
        requestAnimationFrame(draw);
      }
      canvas.addEventListener('mousemove', function(e) {
        var rect = canvas.getBoundingClientRect(); mouseX = e.clientX - rect.left; mouseY = e.clientY - rect.top;
      });
      canvas.addEventListener('mouseleave', function() { mouseX = -9999; mouseY = -9999; });
      window.addEventListener('resize', resize); resize(); draw();
    })();
  </script>
</body>
</html>
```
