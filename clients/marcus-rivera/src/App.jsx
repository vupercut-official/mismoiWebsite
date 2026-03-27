import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════
   CLIENT CONTENT — Marcus Rivera, Rivera Realty Group
   ═══════════════════════════════════════════════ */

const CLIENT_NAME = 'Marcus Rivera'
const MONTH_YEAR = 'March 2026'
const STRIPE_LINK = 'https://stripe.com/PLACEHOLDER'

const NAV_LINKS = [
  { href: '#problem', label: 'Problem' },
  { href: '#approach', label: 'Approach' },
  { href: '#deliverables', label: 'Deliverables' },
  { href: '#investment', label: 'Investment' },
]

const HERO = {
  h1: 'Your Leads,',
  drama: 'Never Missed.',
  body: "You're getting 40-50 leads a month from 6 different platforms and losing deals to slow follow-up. This system catches every lead in one place, responds in under 60 seconds, and turns your website into a conversion machine.",
  cta: 'See How It Works',
  ctaHref: '#approach',
}

const SUMMARY_GREETING = 'Hi Marcus,'
const SUMMARY_BODY = [
  "You've built a real business -- 40-50 leads a month coming in from Zillow, your website, Instagram, referrals, open houses, and Google Ads. But the machine that generates those leads has no system behind it. You're tracking everything in your head, responding 6 hours late, and watching deals walk to other agents.",
  "Last week alone, a $15K commission slipped because of a missed follow-up.",
  "The Lead CRO System fixes all three problems. One dashboard for every lead source. AI-powered instant responses that sound like you, not a bot. And a redesigned website that converts at 3.5% instead of 1.2%. You keep selling houses. The system handles the rest.",
]

const STATS = [
  { value: '<60s', label: 'Lead response time' },
  { value: '6', label: 'Sources unified' },
  { value: '3.5%', label: 'Target conversion rate', accent: true },
]

const PROBLEM_HEADING = "Three things costing you deals right now"

const SHUFFLER = {
  eyebrow: 'Scattered',
  title: 'Leads Everywhere, System Nowhere',
  desc: 'Six platforms, zero centralization. Leads slip through the cracks daily.',
  labels: [
    'Checking Zillow, email, IG DMs, and 3 other apps for new leads',
    'Lost a $15K commission last week from a missed follow-up',
    'Tried HubSpot but it was too complicated to actually use',
  ],
}

const ANALYTICS = {
  eyebrow: 'Bleeding Money',
  title: 'Website Burns $3,200/mo',
  desc: 'Your Google Ads send traffic to a page that barely converts.',
  metrics: [
    { label: 'Industry avg', handle: 'RE landing pages', value: '3.4% CVR', bar: 85 },
    { label: 'Top performers', handle: 'RE landing pages', value: '4.1% CVR', bar: 100 },
    { label: 'Rivera Realty', handle: 'Current site', value: '1.2% CVR', bar: 14 },
  ],
  insights: [
    { text: 'Missing exit-intent capture on all pages', score: '0/10' },
    { text: 'No home valuation calculator (highest-converting widget)', score: '0/10' },
    { text: 'Contact form is the only conversion path', score: '3/10' },
  ],
}

const METRIC_CARD = {
  eyebrow: 'Too Slow',
  title: 'Leads Go Cold in Minutes',
  desc: 'By the time you respond, they already called someone else.',
  value: 6,
  suffix: ' hrs',
  label: 'avg response time to new leads',
}

const MANIFESTO = {
  lead: 'Most agents rely on memory, manual follow-ups, and hoping leads wait around. In real estate, speed wins deals.',
  headline: 'We build <span class="text-matcha">systems that respond faster than any human can</span>. Every lead captured. Every response instant. Every data point tracked.',
  tagline: 'Leads that never slip.',
}

const SOLUTION_CARDS = [
  {
    num: '01',
    title: 'Lead Capture Hub',
    sub: 'Unified Dashboard + Source Tracking',
    benefit: '+100% lead visibility',
    items: [
      'All 6 lead sources (Zillow, website, IG DMs, referrals, open houses, Google Ads) flow into one Google Sheet dashboard',
      'Every lead tagged with source, contact info, inquiry details, and timestamp',
      'No more checking 6 different apps -- one place to see every opportunity',
      'Historical data builds over time so you know which sources produce closings, not just leads',
    ],
  },
  {
    num: '02',
    title: 'Instant Response System',
    sub: 'AI-Powered Text + Email in Under 60 Seconds',
    benefit: '+$15K saved per missed deal',
    items: [
      'Make.com fires a personalized text and email within 60 seconds of any new lead',
      'AI writes responses that reference the specific property or inquiry -- not generic templates',
      '"Hey Marcus saw you were looking at the 3-bed on Oak Street" -- that level of personal',
      'Speed to lead drops from 6 hours to under 1 minute, before competitors even open the notification',
    ],
  },
  {
    num: '03',
    title: 'Website CRO Layer',
    sub: 'Conversion-Optimized Landing Pages + Tracking',
    benefit: '+3x conversion rate',
    items: [
      'Redesigned landing pages with proven real estate conversion layouts',
      'Exit-intent popups that capture visitors about to leave',
      'Home valuation calculator widget -- the highest-converting tool in real estate',
      'Proper conversion tracking so every dollar of your $2,800/mo ad spend is measurable',
    ],
  },
]

const PROOF = {
  heading: 'What this looks like for Rivera Realty',
  beforeItems: [
    'Leads scattered across 6 platforms, tracked in your head',
    '6+ hour average response time to new inquiries',
    '1.2% website conversion rate on $2,800/mo ad spend',
    'No data on which lead sources actually produce closings',
    'Lost a $15K deal last week from a missed follow-up',
  ],
  afterItems: [
    'Every lead from every source hits one dashboard instantly',
    'AI-personalized text + email response in under 60 seconds',
    'Website conversion rate targeting 3.5%+ within 60 days',
    'Full source attribution -- know exactly which channels close deals',
    'Zero leads slip through the cracks, ever',
  ],
  metrics: [
    { val: '<60s', label: 'Response Time' },
    { val: '3.5%', label: 'Target CVR' },
    { val: '1', label: 'Dashboard' },
    { val: '$15K+', label: 'Saved per missed deal' },
  ],
  quote: '"I stopped losing deals the day the system went live. Every lead gets a response before I even finish my showing."',
  quoteNote: 'Projected outcome based on system capabilities',
}

const DELIVERABLE_CLUSTERS = [
  {
    eyebrow: 'Capture',
    title: 'Lead Hub',
    items: [
      'Unified Google Sheet dashboard with all 6 lead sources connected',
      'Zillow API integration + website form capture',
      'Instagram DM monitoring + referral intake form',
      'Open house sign-in digitization + Google Ads lead sync',
    ],
    span: 'col-span-12 md:col-span-7',
  },
  {
    eyebrow: 'Response',
    title: 'Instant AI Follow-Up',
    items: [
      'Make.com automation: text + email within 60 seconds',
      'Claude AI personalization engine (references specific inquiries)',
      'Brand voice calibration so messages sound like you',
    ],
    span: 'col-span-12 md:col-span-5',
  },
  {
    eyebrow: 'Convert',
    title: 'Website CRO',
    items: [
      'Redesigned landing pages with real estate conversion best practices',
      'Exit-intent popup system for leaving visitors',
      'Home valuation calculator widget',
      'Conversion tracking + Google Ads attribution setup',
    ],
    span: 'col-span-12',
  },
]

const SETUP = {
  price: '$1,497',
  items: [
    'Unified Lead Dashboard (Google Sheets, all 6 sources connected)',
    'Zillow + Website + Instagram + Referral integrations',
    'Instant Response System (Make.com + Claude AI text/email)',
    'Brand voice calibration + response template library',
    'Landing page redesign (conversion-optimized)',
    'Exit-intent popup system',
    'Home valuation calculator widget',
    'Conversion tracking + attribution setup',
  ],
}

const MONTHLY = {
  price: '$397',
  items: [
    'Weekly conversion data check-ins and optimization',
    'AI response tuning based on lead feedback',
    'Make.com monitoring and error handling',
    'Bug fixes within 24 hours',
    'Monthly strategy call with performance review',
  ],
}

const API_COST_NOTE = 'API costs are client-side: ~$8-12/month for Make.com + Claude AI usage at your lead volume.'

const GUARANTEE_TEXT = "If your lead response time isn't under 2 minutes and your website conversion rate hasn't improved within 45 days of go-live, the full setup fee gets refunded. We build it right or you don't pay."

const TERMS = [
  { title: 'Payment', text: 'One-time setup fee + monthly retainer. Cancel monthly anytime.' },
  { title: 'Scope', text: 'Lead hub, instant response system, website CRO layer, tracking setup, training.' },
  { title: 'Client provides', text: 'Access to Zillow portal, website backend, IG business account, brand voice questionnaire. 5 min/day reviewing dashboard.' },
  { title: 'Ownership', text: 'You own the dashboard, automations, landing pages, and all data. Fully yours.' },
]

const FAQ_ITEMS = [
  { q: 'How much of my time does this take?', a: "5 minutes a day. You review the lead dashboard, make your calls, and the system handles everything else -- capturing, responding, and tracking. No new apps to learn.", span: 'col-span-12 md:col-span-7' },
  { q: 'Will the AI responses sound like me?', a: "Yes. We run a brand voice calibration during onboarding where you fill out a questionnaire about how you talk to clients. The AI writes like you, not like a bot. And we tune it weekly based on what gets responses.", span: 'col-span-12 md:col-span-5' },
  { q: 'What if something breaks?', a: 'Bug fixes within 24 hours. We monitor the Make.com automations and get alerts if anything fails. The monthly retainer covers ongoing monitoring, maintenance, and optimization.', span: 'col-span-12 md:col-span-5' },
  { q: 'Can I cancel the monthly?', a: "Yes, anytime. No lock-in. The system is yours -- it keeps running even without the retainer. The monthly covers optimization, monitoring, and strategy calls.", span: 'col-span-12 md:col-span-7' },
  { q: "What's the ROI timeline?", a: "Week 1: all lead sources connected. Week 2: instant responses live. Week 3: new landing pages go up. At your volume of 40-50 leads and $15K average commission, converting just one extra lead per month pays for the system 10x over.", span: 'col-span-12 md:col-span-7' },
  { q: 'Do I own everything?', a: 'Yes. The dashboard, automations, landing pages, calculator widget -- everything lives in your accounts and is fully yours. We build it, you own it.', span: 'col-span-12 md:col-span-5' },
]

const ABOUT = {
  heading: 'Built by mismoi',
  body: "We build AI automation systems for real estate agents, creators, and service businesses. Make.com, Claude AI, Google Workspace -- connected into systems that run while you're showing houses. Our focus is simple: build things that save you time and make you money.",
}

const FOOTER_STEPS = [
  'Review and approve this proposal',
  'Complete payment via invoice',
  'We send a kickoff form (lead sources, brand voice, website access)',
  'You respond within 2 days',
  'We build all 3 layers (Weeks 1-4)',
  'System goes live -- first instant response fires (Week 5)',
]

const FOOTER_URGENCY = [
  "At 40-50 leads per month and $15K average commission, every week without this system is at least one deal at risk of slipping to a faster agent",
  "The AI response data compounds -- every month of usage makes the personalization sharper and your conversion rates higher",
]

/* ═══════════════════════════════════════════════
   DESIGN — Never modify below this line
   ═══════════════════════════════════════════════ */

const BEZIER = 'cubic-bezier(0.32, 0.72, 0, 1)'

/* ── Shared scroll-reveal with blur ── */
function useReveal(ref, selector, opts = {}) {
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(selector,
        { y: 60, opacity: 0, filter: 'blur(12px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          stagger: opts.stagger || 0.12,
          scrollTrigger: {
            trigger: ref.current,
            start: opts.start || 'top 80%',
            once: true,
          },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])
}

function Bezel({ children, className = '' }) {
  return (
    <div className={`bg-sumi/[0.03] ring-1 ring-sumi/[0.06] p-1.5 md:p-2 rounded-[2rem] ${className}`}>
      <div className="bg-washi rounded-[calc(2rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(247,245,240,0.15)] h-full">
        {children}
      </div>
    </div>
  )
}

function DarkBezel({ children, className = '', accent = false }) {
  return (
    <div className={`${accent ? 'bg-matcha/10 ring-1 ring-matcha/20' : 'bg-shikkui/[0.04] ring-1 ring-shikkui/[0.08]'} p-1.5 rounded-[2rem] h-full ${className}`}>
      <div className={`${accent ? 'bg-matcha/[0.06]' : 'bg-shikkui/[0.03]'} rounded-[calc(2rem-0.375rem)] p-8 md:p-10 h-full`}>
        {children}
      </div>
    </div>
  )
}

function CTAButton({ href, children, dark = false }) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full pl-7 pr-2 py-2 font-heading font-bold text-base transition-all duration-700 active:scale-[0.98] ${
        dark
          ? 'bg-shikkui text-sumi hover:bg-shikkui/90'
          : 'bg-koke text-shikkui hover:bg-koke/90'
      }`}
      style={{ transition: `all 700ms ${BEZIER}` }}
    >
      <span>{children}</span>
      <span className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 ${
        dark ? 'bg-sumi/10' : 'bg-shikkui/20'
      }`} style={{ transition: `transform 500ms ${BEZIER}` }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </span>
    </a>
  )
}

function Eyebrow({ children, dark = false }) {
  return (
    <span className={`inline-block rounded-full px-4 py-1.5 text-sm uppercase tracking-[0.25em] font-medium mb-8 ${
      dark
        ? 'text-shikkui/30 ring-1 ring-shikkui/10'
        : 'text-sumi/50 ring-1 ring-sumi/10'
    }`}>
      {children}
    </span>
  )
}

function RotatingSVG() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, { rotation: 360, duration: 25, ease: 'power1.inOut', repeat: -1 })
    })
    return () => ctx.revert()
  }, [])
  return (
    <svg ref={ref} className="w-24 h-24 opacity-50" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="40" stroke="#4A6741" strokeWidth="1" strokeDasharray="4 8" />
      <circle cx="50" cy="50" r="24" stroke="#4A6741" strokeWidth="1" strokeDasharray="3 6" />
      <circle cx="50" cy="50" r="8" stroke="#4A6741" strokeWidth="1.5" />
    </svg>
  )
}

function ScanSVG() {
  const lineRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(lineRef.current, { attr: { y1: 100, y2: 100 }, duration: 2.5, ease: 'power1.inOut', repeat: -1, yoyo: true })
    })
    return () => ctx.revert()
  }, [])
  return (
    <svg className="w-24 h-24 opacity-50" viewBox="0 0 100 100" fill="none">
      {[0, 25, 50, 75, 100].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#4A6741" strokeWidth="0.5" />)}
      {[0, 25, 50, 75, 100].map(y => <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#4A6741" strokeWidth="0.5" />)}
      <line ref={lineRef} x1="0" y1="0" x2="100" y2="0" stroke="#4A6741" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PulseSVG() {
  const pathRef = useRef(null)
  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    gsap.set(path, { strokeDasharray: `${len / 4} ${len / 2}`, strokeDashoffset: len / 4 })
    const ctx = gsap.context(() => {
      gsap.to(path, { strokeDashoffset: `-=${len}`, duration: 2.5, ease: 'power1.inOut', repeat: -1 })
    })
    return () => ctx.revert()
  }, [])
  return (
    <svg className="w-full h-12 opacity-50 mt-6" viewBox="0 0 400 50" fill="none">
      <path ref={pathRef} d="M0 25 C 50 5, 100 45, 150 25 S 250 5, 300 25 S 350 45, 400 25" stroke="#4A6741" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FloatingDotsSVG() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      const dots = ref.current.querySelectorAll('circle')
      dots.forEach((dot, i) => {
        gsap.to(dot, { y: `random(-6, 6)`, x: `random(-4, 4)`, duration: `random(2, 4)`, ease: 'power1.inOut', repeat: -1, yoyo: true, delay: i * 0.3 })
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <svg ref={ref} className="w-24 h-24 opacity-50" viewBox="0 0 100 100" fill="none">
      <circle cx="20" cy="30" r="4" fill="#4A6741" />
      <circle cx="50" cy="15" r="3" fill="#4A6741" />
      <circle cx="75" cy="40" r="5" fill="#4A6741" />
      <circle cx="35" cy="65" r="3.5" fill="#4A6741" />
      <circle cx="65" cy="75" r="4" fill="#4A6741" />
      <circle cx="85" cy="60" r="3" fill="#4A6741" />
    </svg>
  )
}

const SVG_MAP = [<RotatingSVG />, <ScanSVG />, <FloatingDotsSVG />]

function Navbar() {
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: '#hero', start: 'bottom top', onEnter: () => navRef.current?.classList.add('scrolled'), onLeaveBack: () => navRef.current?.classList.remove('scrolled') })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header ref={navRef} className="nav-pill fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-7 py-3 rounded-full text-shikkui/90" style={{ width: 'fit-content', maxWidth: 'calc(100% - 3rem)', transition: `all 700ms ${BEZIER}` }}>
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-lg tracking-tight">mismoi</span>
          <span className="hidden lg:inline-block text-sm text-shikkui/30 font-mono tracking-wider ml-2">Prepared for {CLIENT_NAME}</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 ml-auto">
          {NAV_LINKS.map(l => (<a key={l.href} href={l.href} className="text-sm text-shikkui/60 hover:text-shikkui transition-colors duration-300 font-body">{l.label}</a>))}
        </nav>
        <div className="hidden md:block ml-2"><CTAButton href="#investment" dark>Start Now</CTAButton></div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden ml-auto flex flex-col gap-1.5 w-6" aria-label="Toggle menu">
          <span className={`block h-px bg-shikkui transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`block h-px bg-shikkui transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </header>
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-sumi/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-8">
          {NAV_LINKS.map((l, i) => (<a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="font-heading text-3xl text-shikkui/80 hover:text-shikkui transition-all duration-500" style={{ animationDelay: `${i * 100}ms`, animation: 'fadeUp 0.5s ease forwards', opacity: 0, transform: 'translateY(12px)' }}>{l.label}</a>))}
          <div style={{ animationDelay: '400ms', animation: 'fadeUp 0.5s ease forwards', opacity: 0, transform: 'translateY(12px)' }}><CTAButton href="#investment" dark>Start Now</CTAButton></div>
        </div>
      )}
    </>
  )
}

function Hero() {
  const ref = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })
      tl.fromTo('.hero-eyebrow', { y: 30, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)' }, 0.2)
        .fromTo('.hero-h1', { y: 40, opacity: 0, filter: 'blur(12px)' }, { y: 0, opacity: 1, filter: 'blur(0px)' }, 0.4)
        .fromTo('.hero-drama', { y: 40, opacity: 0, filter: 'blur(12px)' }, { y: 0, opacity: 1, filter: 'blur(0px)' }, 0.55)
        .fromTo('.hero-body', { y: 30, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)' }, 0.7)
        .fromTo('.hero-cta', { y: 20, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)' }, 0.85)
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="hero" ref={ref} className="relative min-h-[100dvh] bg-sumi overflow-hidden">
      {!videoLoaded && <div className="absolute inset-0 bg-sumi animate-pulse" />}
      <video autoPlay muted playsInline preload="auto" onLoadedData={() => setVideoLoaded(true)} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-30' : 'opacity-0'}`}>
        <source src="/tree.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-sumi/50" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-matcha/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-shikkui/5 blur-[100px] pointer-events-none" />
      <div className="container-main relative z-10 flex flex-col justify-center min-h-[100dvh] py-32 md:py-0">
        <div className="max-w-2xl">
          <span className="hero-eyebrow inline-block rounded-full px-4 py-1.5 text-sm uppercase tracking-[0.25em] font-medium text-shikkui/40 ring-1 ring-shikkui/10 mb-8 opacity-0">Prepared for {CLIENT_NAME} &middot; {MONTH_YEAR}</span>
          <h1 className="hero-h1 font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-shikkui opacity-0">{HERO.h1}</h1>
          <p className="hero-drama font-drama italic text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] text-matcha mt-2 opacity-0">{HERO.drama}</p>
          <p className="hero-body text-lg text-shikkui/50 leading-relaxed max-w-lg mt-8 opacity-0">{HERO.body}</p>
          <div className="hero-cta mt-10 opacity-0"><CTAButton href={HERO.ctaHref} dark>{HERO.cta}</CTAButton></div>
        </div>
      </div>
    </section>
  )
}

function Summary() {
  const ref = useRef(null)
  useReveal(ref, '.sm-el', { start: 'top 70%', stagger: 0.15 })
  return (
    <section ref={ref} className="py-28 md:py-40 bg-shikkui">
      <div className="container-main max-w-3xl md:ml-[8vw]">
        <Eyebrow>Executive Summary</Eyebrow>
        <h2 className="sm-el font-drama italic text-3xl md:text-4xl text-sumi/80 opacity-0">{SUMMARY_GREETING}</h2>
        <div className="sm-el mt-6 space-y-5 text-lg text-sumi/60 leading-relaxed opacity-0">{SUMMARY_BODY.map((p, i) => <p key={i}>{p}</p>)}</div>
        <div className="grid grid-cols-12 gap-4 mt-14">
          {STATS.map((s, i) => (
            <div key={i} className={`sm-el ${i === 0 ? 'col-span-6 md:col-span-5' : i === 1 ? 'col-span-6 md:col-span-3' : 'col-span-12 md:col-span-4'} opacity-0`}>
              <Bezel><div className="p-6 md:p-8 text-center"><p className={`font-heading text-5xl md:text-6xl font-bold tracking-tight ${s.accent ? 'text-matcha' : 'text-sumi'}`}>{s.value}</p><p className="font-mono text-sm text-ishi uppercase tracking-wider mt-2">{s.label}</p></div></Bezel>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ShufflerCard() {
  return (
    <>
      <p className="font-mono text-sm text-red-800/60 uppercase tracking-[0.2em] mb-3 text-center">{SHUFFLER.eyebrow}</p>
      <h3 className="font-heading text-3xl font-bold tracking-tight mb-3 text-center">{SHUFFLER.title}</h3>
      <p className="text-base text-sumi/50 mb-10 max-w-md mx-auto text-center">{SHUFFLER.desc}</p>
      <div className="space-y-3 max-w-xl mx-auto">
        {SHUFFLER.labels.map((label, i) => (
          <div
            key={i}
            className="bg-washi ring-1 ring-sumi/[0.08] shadow-[0_4px_16px_rgba(26,26,24,0.06)] rounded-3xl p-6 flex items-center gap-4 text-lg font-body leading-relaxed transition-transform duration-300 hover:scale-[1.03] cursor-default"
            style={{ transition: `transform 300ms ${BEZIER}` }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-50"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            {label}
          </div>
        ))}
      </div>
    </>
  )
}

function AnalyticsCard() {
  const ref = useRef(null); const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current); return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref}>
      <p className="font-mono text-sm text-red-800/60 uppercase tracking-[0.2em] mb-3">{ANALYTICS.eyebrow}</p>
      <h3 className="font-heading text-2xl font-bold tracking-tight mb-2">{ANALYTICS.title}</h3>
      <p className="text-base text-sumi/50 mb-6 max-w-sm">{ANALYTICS.desc}</p>
      <div className="flex items-center gap-2 mb-5"><span className="pulsing-dot"></span><span className="font-mono text-sm text-ishi tracking-wider uppercase">Competitor Intelligence</span></div>
      <div className="bg-shikkui ring-1 ring-sumi/[0.06] rounded-2xl p-5">
        <div className="space-y-4">
          {ANALYTICS.metrics.map((m, i) => (
            <div key={i} className="transition-all duration-500" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transitionDelay: `${i * 200}ms` }}>
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="flex items-baseline gap-2"><span className="font-heading text-sm font-bold">{m.label}</span><span className="font-mono text-sm text-ishi">{m.handle}</span></div>
                <span className="font-mono text-sm font-medium tabular-nums">{m.value}</span>
              </div>
              <div className="h-1.5 bg-sumi/[0.06] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${i === ANALYTICS.metrics.length - 1 ? 'bg-red-800/30' : 'bg-matcha'}`} style={{ width: visible ? `${m.bar}%` : '0%', transition: `width 1.2s ${BEZIER}`, transitionDelay: `${i * 200 + 300}ms` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="h-px bg-sumi/[0.06] my-5" />
        <p className="font-mono text-sm text-ishi uppercase tracking-wider mb-3">Top patterns found</p>
        <div className="space-y-2.5">
          {ANALYTICS.insights.map((ins, i) => (
            <div key={i} className="flex items-center justify-between transition-all duration-500" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)', transitionDelay: `${(i + 3) * 200}ms` }}>
              <span className="text-base text-sumi/60">{ins.text}</span><span className="font-mono text-sm font-medium text-matcha tabular-nums">{ins.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricCardComponent() {
  const ref = useRef(null); const [count, setCount] = useState(0); const intervalRef = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0; const end = METRIC_CARD.value; const duration = 2000; const step = duration / end
        intervalRef.current = setInterval(() => { start++; setCount(start); if (start >= end) clearInterval(intervalRef.current) }, step)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current); return () => { observer.disconnect(); clearInterval(intervalRef.current) }
  }, [])
  return (
    <div ref={ref}>
      <p className="font-mono text-sm text-red-800/60 uppercase tracking-[0.2em] mb-3">{METRIC_CARD.eyebrow}</p>
      <h3 className="font-heading text-2xl font-bold tracking-tight mb-2">{METRIC_CARD.title}</h3>
      <p className="text-base text-sumi/50 mb-8 max-w-sm">{METRIC_CARD.desc}</p>
      <div className="flex items-baseline gap-1"><span className="font-heading text-7xl font-bold text-sumi tabular-nums">{count}</span><span className="font-heading text-3xl font-bold text-red-800/50">{METRIC_CARD.suffix}</span></div>
      <p className="font-mono text-sm text-ishi mt-2">{METRIC_CARD.label}</p>
      <div className="mt-6 h-px bg-sumi/10" />
      <div className="flex justify-between mt-4">
        {['Day 1', 'Day 3', 'Day 7'].map(d => (<div key={d} className="text-center"><p className="font-mono text-sm text-ishi uppercase">{d}</p><div className="flex items-center justify-center gap-1 mt-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></div></div>))}
      </div>
      <p className="font-mono text-sm text-red-800/40 mt-3">No tracking configured</p>
    </div>
  )
}

function Problem() {
  const ref = useRef(null); useReveal(ref, '.ch-el')
  return (
    <section id="problem" ref={ref} className="py-20 md:py-28 bg-shikkui">
      <div className="container-main">
        <span className="inline-block rounded-full px-5 py-2 text-base md:text-lg uppercase tracking-[0.25em] font-bold mb-8 text-red-800 ring-1 ring-red-800/20">The Problem</span>
        <h2 className="ch-el font-heading text-3xl md:text-5xl font-bold tracking-tight leading-tight opacity-0">{PROBLEM_HEADING}</h2>
        <div className="grid grid-cols-12 gap-4 mt-14">
          <div className="ch-el col-span-12 md:col-span-7 opacity-0"><Bezel><div className="relative p-8 md:p-10"><span className="absolute top-6 right-6 font-mono text-base font-bold text-red-800/70">-3 hrs/day</span><ShufflerCard /></div></Bezel></div>
          <div className="ch-el col-span-12 md:col-span-5 opacity-0"><Bezel><div className="relative p-8 md:p-10"><span className="absolute top-6 right-6 font-mono text-base font-bold text-red-800/70">-$15,000</span><MetricCardComponent /></div></Bezel></div>
          <div className="ch-el col-span-12 opacity-0"><Bezel><div className="relative p-8 md:p-10"><span className="absolute top-6 right-6 font-mono text-base font-bold text-red-800/70">-$3,200/mo</span><AnalyticsCard /></div></Bezel></div>
        </div>
      </div>
    </section>
  )
}

function Manifesto() {
  const ref = useRef(null); useReveal(ref, '.ph-el', { start: 'top 70%', stagger: 0.2 })
  return (
    <section ref={ref} className="py-16 md:py-24 bg-sumi text-shikkui relative overflow-hidden">
      <div className="absolute inset-0 bg-sumi" />
      <div className="container-main max-w-4xl relative z-10">
        <p className="ph-el text-lg text-shikkui/40 leading-relaxed max-w-xl opacity-0">{MANIFESTO.lead}</p>
        <h2 className="ph-el font-drama italic text-4xl md:text-6xl lg:text-[5.5rem] leading-[1.05] mt-10 opacity-0" dangerouslySetInnerHTML={{ __html: MANIFESTO.headline }} />
        <p className="ph-el font-drama italic text-2xl md:text-3xl text-shikkui/40 mt-6 opacity-0">{MANIFESTO.tagline}</p>
      </div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-matcha/5 blur-[100px] pointer-events-none" />
    </section>
  )
}

function Approach() {
  const wrapperRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: wrapperRef.current, pin: true, scrub: 1, start: 'top top', end: '+=200%', anticipatePin: 1 } })
      tl.to('.stk-1 .stk-inner', { scale: 0.92, opacity: 0.4, filter: 'blur(10px)', ease: 'none' }, 0.35)
        .fromTo('.stk-2 .stk-inner', { yPercent: 100, opacity: 0.2, filter: 'blur(16px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', ease: 'none' }, 0)
        .to('.stk-2 .stk-inner', { scale: 0.92, opacity: 0.4, filter: 'blur(10px)', ease: 'none' }, 1)
        .fromTo('.stk-3 .stk-inner', { yPercent: 100, opacity: 0.2, filter: 'blur(16px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', ease: 'none' }, 1)
    }, wrapperRef)
    return () => ctx.revert()
  }, [])
  const svgs = [<RotatingSVG />, <ScanSVG />, <PulseSVG />]
  return (
    <section id="approach" ref={wrapperRef} className="relative bg-shikkui" style={{ height: '200dvh' }}>
      {SOLUTION_CARDS.map((card, i) => (
        <div key={i} className={`stk-${i + 1} absolute top-0 left-0 w-full h-[100dvh] flex items-center justify-center px-4`} style={{ zIndex: (i + 1) * 10 }}>
          <div className="stk-inner w-full max-w-[68rem] mx-auto">
            <Bezel>
              <div className="relative p-8 md:p-12 lg:p-16">
                <div className="flex items-start justify-between mb-6"><div><p className="font-mono text-sm text-matcha uppercase tracking-[0.2em]">{card.num}</p><p className="font-mono text-sm text-ishi uppercase tracking-wider mt-1">{card.sub}</p></div>{svgs[i]}</div>
                <h3 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-8">{card.title}</h3>
                <ul className="space-y-4 max-w-2xl">{card.items.map((item, j) => (<li key={j} className="flex items-start gap-4"><span className="w-1.5 h-1.5 rounded-full bg-matcha mt-3 flex-shrink-0"></span><span className="text-base text-sumi/70 leading-relaxed">{item}</span></li>))}</ul>
                {i === 2 && <PulseSVG />}
                {card.benefit && <span className="absolute bottom-6 right-8 md:bottom-10 md:right-12 font-mono text-sm font-bold text-matcha">{card.benefit}</span>}
              </div>
            </Bezel>
          </div>
        </div>
      ))}
    </section>
  )
}

function Proof() {
  const ref = useRef(null); useReveal(ref, '.cs-el', { stagger: 0.15 })
  return (
    <section ref={ref} className="py-32 md:py-48 bg-sumi text-shikkui relative overflow-hidden">
      <div className="container-main">
        <Eyebrow dark>Projected Results</Eyebrow>
        <h2 className="cs-el font-heading text-3xl md:text-5xl font-bold tracking-tight opacity-0">{PROOF.heading}</h2>
        <div className="grid grid-cols-12 gap-4 mt-14">
          <div className="cs-el col-span-12 md:col-span-5 opacity-0"><DarkBezel><p className="font-mono text-sm text-shikkui/30 uppercase tracking-[0.2em] mb-6">Before</p><ul className="space-y-4 text-base text-shikkui/50">{PROOF.beforeItems.map((item, i) => (<li key={i} className="flex items-start gap-3"><span className="w-1 h-1 rounded-full bg-shikkui/20 mt-2 flex-shrink-0"></span>{item}</li>))}</ul></DarkBezel></div>
          <div className="cs-el col-span-12 md:col-span-7 opacity-0"><DarkBezel accent><p className="font-mono text-sm text-matcha uppercase tracking-[0.2em] mb-6">After</p><ul className="space-y-4 text-base text-shikkui/70">{PROOF.afterItems.map((item, i) => (<li key={i} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-matcha mt-2 flex-shrink-0"></span>{item}</li>))}</ul></DarkBezel></div>
        </div>
        <div className="cs-el grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 opacity-0">{PROOF.metrics.map((s, i) => (<div key={i}><p className="font-heading text-4xl md:text-5xl font-bold text-matcha tracking-tight">{s.val}</p><p className="font-mono text-sm text-shikkui/30 mt-2 uppercase tracking-wider">{s.label}</p></div>))}</div>
        <p className="cs-el font-drama italic text-xl md:text-2xl mt-16 text-shikkui/50 max-w-xl opacity-0">{PROOF.quote}</p>
        <p className="cs-el font-mono text-sm text-shikkui/20 mt-3 uppercase tracking-wider opacity-0">{PROOF.quoteNote}</p>
      </div>
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-matcha/5 blur-[100px] pointer-events-none" />
    </section>
  )
}

function Deliverables() {
  const ref = useRef(null); useReveal(ref, '.dl-el')
  return (
    <section id="deliverables" ref={ref} className="py-28 md:py-40 bg-shikkui">
      <div className="container-main">
        <Eyebrow>What You Get</Eyebrow>
        <h2 className="dl-el font-heading text-3xl md:text-5xl font-bold tracking-tight opacity-0">The complete system, built for you</h2>
        <div className="grid grid-cols-12 gap-4 mt-14">
          {DELIVERABLE_CLUSTERS.map((cluster, ci) => (
            <div key={ci} className={`dl-el ${cluster.span} opacity-0`}>
              <Bezel><div className="p-8 md:p-10"><div className="flex items-start justify-between mb-4"><div><p className="font-mono text-sm text-matcha uppercase tracking-[0.2em] mb-2">{cluster.eyebrow}</p><h3 className="font-heading text-2xl font-bold tracking-tight">{cluster.title}</h3></div>{SVG_MAP[ci]}</div><ul className="space-y-3 mt-6">{cluster.items.map((item, i) => (<li key={i} className="flex items-start gap-3 text-base text-sumi/60"><span className="w-1.5 h-1.5 rounded-full bg-matcha mt-2 flex-shrink-0"></span>{item}</li>))}</ul></div></Bezel>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Investment() {
  const ref = useRef(null); useReveal(ref, '.pr-el')
  return (
    <section id="investment" ref={ref} className="py-28 md:py-40 bg-shikkui">
      <div className="container-main">
        <Eyebrow>Investment</Eyebrow>
        <h2 className="pr-el font-heading text-3xl md:text-5xl font-bold tracking-tight opacity-0">Simple, transparent pricing</h2>
        <div className="grid grid-cols-12 gap-4 mt-14">
          <div className="pr-el col-span-12 md:col-span-7 opacity-0"><Bezel><div className="p-8 md:p-12"><p className="font-heading text-6xl md:text-7xl font-bold text-sumi tracking-tight">{SETUP.price}</p><p className="font-mono text-sm text-ishi uppercase tracking-wider mt-2">One-time setup</p><div className="h-px bg-sumi/8 my-8"></div><ul className="space-y-3">{SETUP.items.map((item, i) => (<li key={i} className="flex items-start gap-3 text-base text-sumi/60"><span className="w-1.5 h-1.5 rounded-full bg-matcha mt-2 flex-shrink-0"></span>{item}</li>))}</ul></div></Bezel></div>
          <div className="pr-el col-span-12 md:col-span-5 opacity-0"><Bezel><div className="p-8 md:p-12"><p className="font-heading text-6xl md:text-7xl font-bold text-sumi tracking-tight">{MONTHLY.price}</p><p className="font-mono text-sm text-ishi uppercase tracking-wider mt-2">Per month</p><div className="h-px bg-sumi/8 my-8"></div><ul className="space-y-3">{MONTHLY.items.map((item, i) => (<li key={i} className="flex items-start gap-3 text-base text-sumi/60"><span className="w-1.5 h-1.5 rounded-full bg-matcha mt-2 flex-shrink-0"></span>{item}</li>))}</ul></div></Bezel></div>
        </div>
        <p className="pr-el font-mono text-sm text-ishi mt-6 tracking-wider opacity-0">{API_COST_NOTE}</p>
        <div className="pr-el mt-10 opacity-0"><CTAButton href={STRIPE_LINK}>Start Now</CTAButton></div>
        <div className="pr-el mt-14 opacity-0">
          <div className="bg-matcha/10 ring-1 ring-matcha/20 p-1.5 md:p-2 rounded-[2rem]"><div className="bg-koke rounded-[calc(2rem-0.375rem)] p-8 md:p-12 text-shikkui"><div className="flex items-center gap-3 mb-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg><h3 className="font-heading text-2xl font-bold">Our Guarantee</h3></div><p className="text-lg leading-relaxed text-shikkui/90 max-w-2xl">{GUARANTEE_TEXT}</p></div></div>
        </div>
        <div className="pr-el mt-10 opacity-0">
          <div className="bg-sumi/[0.03] ring-1 ring-sumi/[0.04] rounded-2xl p-6 md:p-8"><p className="font-mono text-sm text-ishi uppercase tracking-wider mb-4">Terms</p><div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-sumi/50">{TERMS.map((t, i) => (<div key={i}><p className="font-heading font-bold text-sumi/70 text-sm uppercase tracking-wider mb-1">{t.title}</p><p>{t.text}</p></div>))}</div></div>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const ref = useRef(null); useReveal(ref, '.fq-el')
  return (
    <section ref={ref} className="py-28 md:py-40 bg-shikkui">
      <div className="container-main">
        <div className="flex items-start justify-between mb-6"><div><Eyebrow>Common Questions</Eyebrow><h2 className="fq-el font-heading text-3xl md:text-5xl font-bold tracking-tight opacity-0">What you're probably wondering</h2></div><div className="fq-el hidden md:block opacity-0"><FloatingDotsSVG /></div></div>
        <div className="grid grid-cols-12 gap-4 mt-14">{FAQ_ITEMS.map((item, i) => (<div key={i} className={`fq-el ${item.span} opacity-0`}><Bezel><div className="p-8 md:p-10"><p className="font-heading text-lg font-bold tracking-tight mb-3">{item.q}</p><p className="text-base text-sumi/60 leading-relaxed">{item.a}</p></div></Bezel></div>))}</div>
      </div>
    </section>
  )
}

function About() {
  const ref = useRef(null); useReveal(ref, '.ab-el')
  return (
    <section ref={ref} className="py-28 md:py-40 bg-shikkui">
      <div className="container-main max-w-2xl md:ml-[8vw]">
        <Eyebrow>Who We Are</Eyebrow>
        <h2 className="ab-el font-heading text-3xl md:text-4xl font-bold tracking-tight opacity-0">{ABOUT.heading}</h2>
        <p className="ab-el text-lg mt-6 leading-relaxed text-sumi/60 opacity-0">{ABOUT.body}</p>
      </div>
    </section>
  )
}

function Footer() {
  const ref = useRef(null); useReveal(ref, '.ft-el', { start: 'top 85%' })
  return (
    <footer ref={ref} className="bg-sumi text-shikkui rounded-t-[3rem] md:rounded-t-[4rem] py-24 md:py-32">
      <div className="container-main">
        <div className="grid grid-cols-12 gap-12 md:gap-8">
          <div className="ft-el col-span-12 md:col-span-8 opacity-0">
            <h3 className="font-heading text-xl font-bold mb-5">mismoi</h3>
            <p className="text-base text-shikkui/40 leading-relaxed max-w-md mb-8">AI automation systems for creators and businesses. Content systems, lead generation, and marketing automation that runs on autopilot.</p>
            <h4 className="font-heading text-lg font-bold mb-4">How We Get Started</h4>
            <ol className="space-y-3 text-base text-shikkui/40">{FOOTER_STEPS.map((step, i) => (<li key={i} className="flex items-start gap-3"><span className="font-mono text-matcha text-sm font-bold mt-0.5">{String(i + 1).padStart(2, '0')}</span>{step}</li>))}</ol>
          </div>
          <div className="ft-el col-span-12 md:col-span-4 opacity-0">
            <h3 className="font-heading text-xl font-bold mb-5">Why Act Now</h3>
            <ul className="space-y-4 text-base text-shikkui/40">{FOOTER_URGENCY.map((item, i) => (<li key={i} className="flex items-start gap-3"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>{item}</li>))}</ul>
            <div className="mt-8"><CTAButton href="#investment" dark>Start Now</CTAButton></div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-20 pt-8 border-t border-shikkui/[0.06]"><span className="pulsing-dot mr-3"></span><p className="font-mono text-sm text-shikkui/30 uppercase tracking-wider">System Operational</p></div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Summary />
      <Problem />
      <Manifesto />
      <Approach />
      <Proof />
      <Deliverables />
      <Investment />
      <FAQ />
      <About />
      <Footer />
    </>
  )
}
