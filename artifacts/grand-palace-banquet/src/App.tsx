import { type FormEvent, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronLeft,
  ChevronRight, Crown, Flower2, HeartHandshake, Lightbulb, MapPin, Menu,
  Phone, Sparkles, Star, UtensilsCrossed, UsersRound, X,
} from 'lucide-react';
import './index.css';
const ParticleAtmosphere = lazy(() => import('./HeroParticles'));

const phoneNumber = '+923242886757';
const address = '42-1/C, Main Shahra-e-Faisal, Block 6, P.E.C.H.S., Karachi';
const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
const googleReviewsUrl = 'https://www.google.com/search?q=Grand+Palace+Banquet+Karachi+Google+reviews';
const photoBase = 'https://grandpalace.com.pk/wp-content/uploads/2025/12/';
const photos = [
  { src: `${photoBase}DSC_7484-scaled.jpg`, title: 'A grand entrance', kind: 'Barat', ratio: 'wide' },
  { src: `${photoBase}DSC_7521-scaled.jpg`, title: 'The evening, in bloom', kind: 'Ambiance', ratio: 'tall' },
  { src: `${photoBase}DSC_7496-scaled.jpg`, title: 'A table set for forever', kind: 'Walima', ratio: 'wide' },
  { src: `${photoBase}DSC_7497-scaled.jpg`, title: 'Golden-hour celebration', kind: 'Mehndi', ratio: 'tall' },
  { src: `${photoBase}DSC_7486-681x1024.jpg`, title: 'Details worth remembering', kind: 'Ambiance', ratio: 'tall' },
  { src: `${photoBase}Screenshot-2025-12-04-220230.png`, title: 'A room made luminous', kind: 'Corporate', ratio: 'wide' },
  { src: `${photoBase}Screenshot-2025-12-04-220406.png`, title: 'The palace at night', kind: 'Barat', ratio: 'wide' },
  { src: `${photoBase}Screenshot-2025-12-04-220121.png`, title: 'An intimate moment', kind: 'Walima', ratio: 'tall' },
];
const categories = ['All', 'Barat', 'Walima', 'Mehndi', 'Corporate', 'Ambiance'];
const eventTypes = ['Barat', 'Walima', 'Mehndi', 'Corporate', 'Engagement'];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const heroTitle = useRef<HTMLHeadingElement>(null);
  const heroCopy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      if (heroTitle.current) gsap.fromTo(heroTitle.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.15, delay: .18, ease: 'power3.out' });
      if (heroCopy.current) gsap.fromTo(heroCopy.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: .48, ease: 'power2.out' });
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((v) => v === null ? null : (v + 1) % photos.length);
      if (e.key === 'ArrowLeft') setLightbox((v) => v === null ? null : (v - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [lightbox]);

  const handoff = (lines: string[]) => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const submitInquiry = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    handoff([
      'Grand Palace Banquet — Event enquiry',
      `Event type: ${data.get('eventType')}`,
      `Date: ${data.get('date')}`,
      `Slot: ${data.get('slot')}`,
      `Guest count: ${data.get('guests')}`,
      `Phone: ${data.get('phone')}`,
      '',
      'Please confirm availability with me. I understand this enquiry is not an instant booking confirmation.',
    ]);
  };
  const submitContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    handoff([
      'Grand Palace Banquet — Contact enquiry',
      `Name: ${data.get('name')}`,
      `Phone: ${data.get('contactPhone')}`,
      `Email: ${data.get('email') || 'Not provided'}`,
      `Event type: ${data.get('contactEvent')}`,
      `Message: ${data.get('message')}`,
      '',
      'Please confirm availability and next steps. This message is an enquiry, not an instant booking confirmation.',
    ]);
  };
  const visiblePhotos = photos.map((photo, index) => ({ ...photo, index })).filter((photo) => filter === 'All' || photo.kind === filter);

  const navItems = [['The palace', '#experience'], ['Celebrations', '#celebrations'], ['Packages', '#packages'], ['Gallery', '#gallery'], ['Enquire', '#enquire']];
  return (
    <div className="site-shell grain">
      <header className="topbar">
        <a href="#home" className="brand" data-testid="link-brand-home" aria-label="Grand Palace Banquet home">
          <span className="brand-mark"><Crown size={19} strokeWidth={1.25} /></span>
          <span className="brand-words"><strong>GRAND PALACE</strong><small>BANQUET · KARACHI</small></span>
        </a>
        <nav className={`desktop-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>)}
        </nav>
        <a className="nav-phone" href={`tel:${phoneNumber}`} data-testid="link-call-header"><Phone size={14} /> <span>0324 2886757</span></a>
        <button className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-image" role="img" aria-label="An atmospheric view of an illuminated celebration hall" />
          <div className="hero-shade" />
          <Suspense fallback={null}><ParticleAtmosphere /></Suspense>
          <div className="hero-frame" />
          <div className="hero-content">
            <div className="hero-kicker"><span className="gold-line" /> A KARACHI LANDMARK FOR YOUR BIGGEST MOMENTS <span className="gold-line" /></div>
            <h1 className="serif" ref={heroTitle}>Where beautiful<br /><em>beginnings</em> turn into forever.</h1>
            <div ref={heroCopy} className="hero-lower">
              <p>Royalty at its peak.</p>
              <div className="hero-actions">
                <a className="button button-gold" href="#enquire" data-testid="link-hero-enquire">Book Your Event <ArrowRight size={16} /></a>
                <a className="text-link" href="#packages" data-testid="link-discover-palace">Explore Packages <ArrowDown size={14} /></a>
              </div>
            </div>
          </div>
          <div className="hero-index"><span>01</span><i /> 04</div>
          <div className="hero-caption"><span className="gold-line" /> A PLACE FOR THE MOMENTS THAT MATTER</div>
          <a className="hero-scroll" href="#experience" aria-label="Scroll to explore" data-testid="link-scroll-explore"><span>SCROLL TO EXPLORE</span><ArrowDown size={13} /></a>
        </section>

        <div className="trust-strip">
          <div className="trust-inner">
            <div className="rating-mark"><Star size={16} fill="currentColor" /><span>4.5 <small>/ 5</small></span></div>
            <p>Google rating</p><span className="trust-divider" />
            <strong>2,900<span>+</span></strong><p>Google reviews</p>
            <span className="trust-note"><MapPin size={13} /> Main Shahra-e-Faisal, PECHS Block 6, Karachi</span>
          </div>
        </div>

        <section className="intro-section section-wrap" id="experience">
          <div className="intro-copy reveal">
            <div className="eyebrow">THE GRAND PALACE EXPERIENCE</div>
            <h2 className="serif">Some evenings<br />deserve <em>their own</em><br />kind of forever.</h2>
            <p>From the first welcome to the final farewell, every detail is composed to make your celebration feel unmistakably yours. Step into an evening of quiet grandeur, warm hospitality and memories made together.</p>
            <a href="#celebrations" className="under-link" data-testid="link-experience-celebrations">Explore the experience <ArrowRight size={14} /></a>
          </div>
          <div className="intro-visual reveal">
            <img src={`${photoBase}DSC_7521-scaled.jpg`} alt="Warmly illuminated banquet setting with considered floral details" />
            <div className="image-caption"><span>AN EVENING, BEAUTIFULLY SET</span><span>01 / 04</span></div>
            <div className="seal"><Crown size={22} /><span>ROYALTY<br />AT ITS PEAK</span></div>
          </div>
          <span className="section-ornament">G</span>
        </section>

        <section className="celebrations-section" id="celebrations">
          <div className="section-wrap">
            <div className="section-heading reveal">
              <div className="eyebrow">A SETTING FOR EVERY STORY</div>
              <h2 className="serif">Gather. Celebrate.<br /><em>Remember.</em></h2>
              <p>Milestones take many forms. We make room for every one.</p>
            </div>
            <div className="celebration-grid">
              <article className="celebration-card reveal">
                <span className="card-number">01 — WEDDINGS</span><Flower2 size={23} />
                <h3 className="serif">A promise, made grand.</h3>
                <p>Barat and Walima celebrations with space for the people who make your day.</p>
                <a href="#enquire" data-testid="link-celebration-wedding" aria-label="Enquire about wedding celebrations"><ArrowUpRight size={16} /></a>
              </article>
              <article className="celebration-card reveal">
                <span className="card-number">02 — PRE-WEDDING</span><Sparkles size={23} />
                <h3 className="serif">Colour in every corner.</h3>
                <p>Mehndi and engagement evenings filled with family, music and meaning.</p>
                <a href="#enquire" data-testid="link-celebration-mehndi" aria-label="Enquire about Mehndi and engagement celebrations"><ArrowUpRight size={16} /></a>
              </article>
              <article className="celebration-card reveal">
                <span className="card-number">03 — GATHERINGS</span><Crown size={23} />
                <h3 className="serif">A reason to come together.</h3>
                <p>Corporate occasions and milestone celebrations, handled with care.</p>
                <a href="#enquire" data-testid="link-celebration-corporate" aria-label="Enquire about corporate events"><ArrowUpRight size={16} /></a>
              </article>
            </div>
          </div>
        </section>

        <section className="capacity-section">
          <div className="capacity-photo" />
          <div className="capacity-overlay" />
          <div className="capacity-content reveal">
            <div className="eyebrow">ROOM FOR EVERYONE YOU LOVE</div>
            <div className="capacity-big serif">1,100<span>+</span></div>
            <h2 className="serif">guests, gathered<br />under one roof.</h2>
            <p>A generous marquee, dedicated event planning and seasonal florals come together for a celebration that feels considered from the first detail to the last dance.</p>
            <a href="#enquire" className="button button-outline" data-testid="link-capacity-enquire">Plan your celebration <ArrowRight size={15} /></a>
          </div>
          <div className="capacity-aside">THE GRAND<br />GATHERING</div>
        </section>

        <section className="amenities-section section-wrap" id="packages">
          <div className="amenities-heading reveal">
            <div className="eyebrow">THE DETAILS, THOUGHTFULLY HANDLED</div>
            <h2 className="serif">The setting is grand.<br /><em>The care is personal.</em></h2>
            <p>Explore the elements that help bring a celebration together. Ask our team what can be included for your date and event.</p>
          </div>
          <div className="amenities-grid">
            <article className="amenity-card reveal">
              <span className="amenity-icon"><Lightbulb size={22} /></span>
              <span className="card-number">01 — ATMOSPHERE</span>
              <h3 className="serif">Light, beautifully set.</h3>
              <p>Professional lighting rigs and glowing setups help shape the room around your celebration.</p>
            </article>
            <article className="amenity-card reveal">
              <span className="amenity-icon"><UtensilsCrossed size={22} /></span>
              <span className="card-number">02 — HOSPITALITY</span>
              <h3 className="serif">A table for everyone.</h3>
              <p>Premium in-house catering, planned with your gathering and guests in mind.</p>
            </article>
            <article className="amenity-card reveal">
              <span className="amenity-icon"><Flower2 size={22} /></span>
              <span className="card-number">03 — YOUR MOMENT</span>
              <h3 className="serif">A stage of your own.</h3>
              <p>Custom stage decoration and seasonal florals bring a personal touch to the room.</p>
            </article>
            <article className="amenity-card reveal">
              <span className="amenity-icon"><UsersRound size={22} /></span>
              <span className="card-number">04 — THE TEAM</span>
              <h3 className="serif">Every detail, in hand.</h3>
              <p>A courteous, dedicated management team helps your event run smoothly for the whole family.</p>
            </article>
            <article className="amenity-card amenity-card-wide reveal">
              <span className="amenity-icon"><HeartHandshake size={22} /></span>
              <span className="card-number">MADE FOR GATHERING</span>
              <h3 className="serif">Room to celebrate, together.</h3>
              <p>From intimate milestones to large family occasions, the venue is designed to welcome the people who matter most.</p>
            </article>
          </div>
        </section>

        <section className="gallery-section section-wrap" id="gallery">
          <div className="gallery-head reveal">
            <div><div className="eyebrow">A GLIMPSE INSIDE</div><h2 className="serif">The room before<br /><em>the moment.</em></h2></div>
            <p>Light, florals, a table set just so. Take a closer look at the spaces where your story could unfold.</p>
          </div>
          <div className="gallery-filters" role="group" aria-label="Filter gallery images">
            {categories.map((category) => <button key={category} className={filter === category ? 'filter-active' : ''} onClick={() => setFilter(category)} data-testid={`button-gallery-filter-${category.toLowerCase()}`}>{category}</button>)}
          </div>
          <div className="gallery-grid">
            {visiblePhotos.map((photo) => <button key={photo.index} className={`gallery-tile ${photo.ratio} reveal`} onClick={() => setLightbox(photo.index)} aria-label={`View image: ${photo.title}`} data-testid={`button-gallery-image-${photo.index}`}>
              <img src={photo.src} alt={photo.title} loading="lazy" />
              <span className="tile-overlay"><span>{photo.kind}</span><strong>{photo.title}</strong><span className="tile-expand"><ArrowUpRight size={15} /></span></span>
            </button>)}
          </div>
          <p className="gallery-note">Venue gallery imagery from Grand Palace Banquet.</p>
        </section>

        <section className="testimonials-section" id="reviews">
          <div className="section-wrap testimonials-layout">
            <div className="testimonials-intro reveal">
              <div className="eyebrow">KIND WORDS FROM THE CELEBRATIONS</div>
              <h2 className="serif">The day passes.<br /><em>The feeling stays.</em></h2>
              <p>Guest testimonials published by Grand Palace Banquet. The Google rating and review count above are shown separately.</p>
              <a className="under-link" href={googleReviewsUrl} target="_blank" rel="noreferrer" data-testid="link-google-reviews">Find Grand Palace on Google <ArrowUpRight size={14} /></a>
            </div>
            <div className="testimonial-cards">
              <figure className="testimonial-card reveal">
                <span className="quote-mark" aria-hidden="true">“</span>
                <blockquote>Our wedding was truly magical! From start to finish, every detail was perfect, and the team made us feel like royalty. We couldn’t have asked for a better experience!</blockquote>
                <figcaption><span>Bride &amp; Groom</span><small>Guest testimonial shared by Grand Palace Banquet</small></figcaption>
              </figure>
              <figure className="testimonial-card reveal">
                <span className="quote-mark" aria-hidden="true">“</span>
                <blockquote>Seeing my sister’s wedding come together so beautifully was unforgettable! Every detail was flawless, and the team made the day truly magical for the whole family.</blockquote>
                <figcaption><span>Bride’s sister</span><small>Guest testimonial shared by Grand Palace Banquet</small></figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="offer-section">
          <div className="offer-lines" />
          <div className="offer-inner reveal">
            <div className="offer-icon"><Sparkles size={18} /></div>
            <div><div className="eyebrow">A SEASON TO CELEBRATE</div><h2 className="serif">Your autumn evening,<br /><em>with a little more.</em></h2><p>30% OFF on October &amp; November Bookings! Celebrate your special moments at Grand Palace Banquet.</p></div>
            <div className="offer-action"><span>LIMITED SEASON OFFER</span><a href="#enquire" className="button button-gold" data-testid="link-offer-enquire">Enquire about dates <ArrowRight size={15} /></a></div>
          </div>
        </section>

        <section className="enquiry-section" id="enquire">
          <div className="section-wrap enquiry-layout">
            <div className="enquiry-copy reveal">
              <div className="eyebrow">THE FIRST STEP IS A HELLO</div>
              <h2 className="serif">Let us set<br /><em>the evening.</em></h2>
              <p>Tell us a little about your celebration. Our team will be in touch to confirm availability and help you plan the details.</p>
              <div className="contact-details">
                <a href={`tel:${phoneNumber}`} data-testid="link-call-enquiry"><Phone size={16} /><span><small>CALL OUR TEAM</small>0324 2886757</span><ArrowUpRight size={14} /></a>
                <a href={mapUrl} target="_blank" rel="noreferrer" data-testid="link-directions"><MapPin size={16} /><span><small>FIND THE PALACE</small>42-1/C, Main Shahra-e-Faisal,<br />Block 6, P.E.C.H.S., Karachi</span><ArrowUpRight size={14} /></a>
              </div>
              <div className="social-links"><a href="https://www.facebook.com/GrandPalaceKHI/" target="_blank" rel="noreferrer" data-testid="link-facebook">Facebook <ArrowUpRight size={12} /></a><a href="https://www.instagram.com/grandpalacepk/?hl=en" target="_blank" rel="noreferrer" data-testid="link-instagram">Instagram <ArrowUpRight size={12} /></a></div>
            </div>
            <div className="form-card reveal">
              <div className="form-tabs"><span>EVENT ENQUIRY</span><span className="whatsapp-handoff"><span /> WHATSAPP HANDOFF</span></div>
              <h3 className="serif">Tell us what you’re celebrating.</h3>
              <p className="form-intro">We’ll take it from here, together.</p>
              <form onSubmit={submitInquiry} data-testid="form-event-inquiry">
                <label>EVENT TYPE<select name="eventType" required defaultValue="" data-testid="select-event-type"><option value="" disabled>Select your occasion</option>{eventTypes.map((event) => <option key={event}>{event}</option>)}</select></label>
                <div className="form-row">
                  <label>CELEBRATION DATE<input type="date" name="date" required data-testid="input-event-date" /></label>
                  <label>TIME OF DAY<select name="slot" required defaultValue="" data-testid="select-event-slot"><option value="" disabled>Choose a slot</option><option>Day</option><option>Night</option></select></label>
                </div>
                <div className="form-row">
                  <label>EXPECTED GUESTS<input type="number" name="guests" min="1" max="2000" placeholder="e.g. 450" required data-testid="input-guest-count" /></label>
                  <label>YOUR PHONE<input type="tel" name="phone" placeholder="+92 3xx xxxxxxx" pattern="[+0-9() -]{7,20}" required data-testid="input-inquiry-phone" /></label>
                </div>
                <button className="button button-gold form-submit" type="submit" data-testid="button-submit-inquiry">Check Availability <ArrowRight size={15} /></button>
                <p className="form-disclaimer"><Check size={13} /> Your enquiry is not an instant booking confirmation. Our team must confirm availability.</p>
              </form>
            </div>
          </div>
        </section>

        <section className="location-section" id="visit">
          <div className="section-wrap location-layout">
            <div className="location-copy reveal">
              <div className="eyebrow">FIND YOUR WAY TO THE PALACE</div>
              <h2 className="serif">A familiar address.<br /><em>A memorable evening.</em></h2>
              <p>Visit Grand Palace Banquet on Main Shahra-e-Faisal in P.E.C.H.S., Karachi.</p>
              <a href={mapUrl} target="_blank" rel="noreferrer" className="button button-outline" data-testid="link-map-directions">Get directions <ArrowUpRight size={14} /></a>
            </div>
            <div className="map-frame reveal">
              <iframe
                title="Map showing Grand Palace Banquet in P.E.C.H.S., Karachi"
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                data-testid="embed-venue-map"
              />
            </div>
          </div>
        </section>

        <section className="contact-band">
          <div className="section-wrap contact-layout">
            <div className="contact-band-copy reveal"><div className="eyebrow">A PERSONAL NOTE GOES A LONG WAY</div><h2 className="serif">Not sure where<br />to begin?</h2><p>Share your idea with us. We’ll help you find the right way to celebrate.</p></div>
            <form className="contact-form reveal" onSubmit={submitContact} data-testid="form-contact">
              <div className="form-row"><label>YOUR NAME<input name="name" required placeholder="Name" data-testid="input-contact-name" /></label><label>PHONE<input name="contactPhone" required type="tel" pattern="[+0-9() -]{7,20}" placeholder="+92 3xx xxxxxxx" data-testid="input-contact-phone" /></label></div>
              <div className="form-row"><label>EMAIL <span>(OPTIONAL)</span><input name="email" type="email" placeholder="you@example.com" data-testid="input-contact-email" /></label><label>EVENT TYPE<select name="contactEvent" required defaultValue="" data-testid="select-contact-event"><option value="" disabled>Select occasion</option>{eventTypes.map((event) => <option key={event}>{event}</option>)}</select></label></div>
              <label>YOUR MESSAGE<textarea name="message" required rows={3} placeholder="Tell us what you have in mind…" data-testid="input-contact-message" /></label>
              <div className="contact-submit-row"><p>We’ll reply with care, not an automated confirmation.</p><button className="button button-outline" type="submit" data-testid="button-submit-contact">Send a message <ArrowRight size={14} /></button></div>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-wrap footer-top">
          <a href="#home" className="brand footer-brand" data-testid="link-footer-home"><span className="brand-mark"><Crown size={19} /></span><span className="brand-words"><strong>GRAND PALACE</strong><small>BANQUET · KARACHI</small></span></a>
          <p className="serif">Where beautiful beginnings<br />turn into forever.</p>
          <a href="#home" className="back-top" data-testid="link-back-top">BACK TO TOP <ArrowUpRight size={13} /></a>
        </div>
        <div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} GRAND PALACE BANQUET</span><span>42-1/C, Main Shahra-e-Faisal, Karachi</span><span>ROYALTY AT ITS PEAK.</span></div>
      </footer>

      {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery image viewer" onClick={() => setLightbox(null)}>
        <button className="lightbox-close" aria-label="Close image viewer" onClick={() => setLightbox(null)} data-testid="button-gallery-close"><X /></button>
        <button className="lightbox-prev" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length); }} data-testid="button-gallery-previous"><ChevronLeft /></button>
        <figure onClick={(e) => e.stopPropagation()}><img src={photos[lightbox].src} alt={photos[lightbox].title} /><figcaption><span>{photos[lightbox].kind}</span>{photos[lightbox].title}<small>{String(lightbox + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</small></figcaption></figure>
        <button className="lightbox-next" aria-label="Next image" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length); }} data-testid="button-gallery-next"><ChevronRight /></button>
      </div>}

      <a href={`tel:${phoneNumber}`} className="mobile-call" data-testid="link-mobile-call"><Phone size={16} /> CALL THE PALACE</a>
    </div>
  );
}

export default App;
