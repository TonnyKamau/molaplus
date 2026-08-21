import Image from "next/image";
import Link from "next/link";

const benefits = [
  ["01", "Better digestion", "Beneficial microbes help animals unlock more value from everyday feed."],
  ["02", "Stronger performance", "Support steadier weight gain, healthier poultry and improved milk output."],
  ["03", "Practical by design", "Simple feed-and-water routines developed for East African farm conditions."],
];

const services = [
  ["/molaplus/service-cows.webp", "Farm consultancy", "Nutrition and management guidance shaped around your herd and targets.", "/consultancy"],
  ["/molaplus/service-poultry.webp", "Farmer training", "Practical workshops and resources for confident day-to-day application.", "/resources"],
  ["/molaplus/service-pigs.webp", "Technical support", "Real help for farmers and distributors, before and after purchase.", "/contact"],
];

export default function Home() {
  return (
    <main className="new-home">
      <section className="hero-v2">
        <div className="hero-v2__copy">
          <p className="kicker"><span /> Animal nutrition, made for East Africa</p>
          <h1>Healthy animals.<br /><em>Stronger farms.</em></h1>
          <p className="hero-v2__intro">MolaPlus combines probiotics, microbes and essential minerals to help farmers get better health, better feed efficiency and better yields—naturally.</p>
          <div className="hero-v2__actions">
            <Link className="button button--light" href="/products">Explore our range <span>↗</span></Link>
            <Link className="button button--line" href="/distributors">Find a stockist</Link>
          </div>
          <div className="hero-v2__proof">
            <div><strong>3,800+</strong><span>stockists nationwide</span></div>
            <div><strong>3 species</strong><span>dairy, poultry &amp; pigs</span></div>
            <div><strong>Local support</strong><span>when farmers need it</span></div>
          </div>
        </div>
        <div className="hero-v2__visual">
          <Image alt="MolaPlus Super Milk Booster" className="hero-v2__pack" fetchPriority="high" fill loading="eager" sizes="(min-width: 900px) 48vw, 100vw" src="/molaplus/milk-booster-5kg-cutout.webp" />
          <div className="hero-v2__stamp"><b>MORE</b><span>MILK</span><small>BETTER CONDITION</small></div>
          <p className="hero-v2__caption">Super Milk Booster<br /><span>Minerals + probiotics</span></p>
        </div>
      </section>

      <section className="ticker" aria-label="Product benefits"><div>MORE MILK <i>✦</i> HEALTHIER GUTS <i>✦</i> STRONGER POULTRY <i>✦</i> BETTER FEED CONVERSION <i>✦</i></div></section>

      <section className="section products-v2">
        <div className="section-heading">
          <p className="kicker"><span /> Products</p>
          <h2>One farm.<br /><em>Three powerful solutions.</em></h2>
          <Link href="/products">View all products ↗</Link>
        </div>
        <div className="product-grid-v2">
          <Link className="product-tile product-tile--milk" href="/products/super-milk-booster">
            <div className="product-tile__top"><span>01 / Dairy</span><b>Best seller</b></div>
            <Image alt="Super Milk Booster 5kg" fill loading="eager" sizes="(min-width: 800px) 50vw, 100vw" src="/molaplus/milk-booster-5kg-cutout.webp" />
            <div className="product-tile__copy"><h3>Super Milk<br />Booster</h3><p>More milk, improved body condition and support for healthier dairy cows.</p><span className="round-arrow">↗</span></div>
          </Link>
          <Link className="product-tile product-tile--poultry" href="/products#poultry-microbes">
            <div className="product-tile__top"><span>02 / Poultry</span><b>500ml · 1L · 5L</b></div>
            <Image alt="Poultry Microbes 10 litre" fill sizes="(min-width: 800px) 50vw, 100vw" src="/molaplus/poultry-microbes-10l.webp" />
            <div className="product-tile__copy"><h3>Poultry<br />Microbes</h3><p>Natural gut support for stronger broilers, layers and better feed conversion.</p><span className="round-arrow">↗</span></div>
          </Link>
          <Link className="product-tile product-tile--pig" href="/products#pig-microbes">
            <div className="product-tile__top"><span>03 / Livestock</span><b>1L · 5L · 20L</b></div>
            <Image alt="Pig Microbes 10 litre" fill sizes="(min-width: 800px) 40vw, 100vw" src="/molaplus/pig-microbes-10l.webp" />
            <div className="product-tile__copy"><h3>Livestock<br />Microbes</h3><p>Improved digestion and reduced odour for pigs, goats, sheep and beef cattle.</p><span className="round-arrow">↗</span></div>
          </Link>
        </div>
      </section>

      <section className="section how-v2">
        <div className="how-v2__lead">
          <p className="kicker kicker--light"><span /> How it works</p>
          <h2>Good health<br />starts <em>inside.</em></h2>
          <p>Our formulations work with the animal’s digestive system—not against it. Add them to the feed or water routine and let beneficial microbes do the rest.</p>
          <Link className="button button--orange" href="/products">Choose your product <span>↗</span></Link>
        </div>
        <div className="how-v2__steps">
          {benefits.map(([number, title, text]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
        </div>
      </section>

      <section className="section support-v2">
        <div className="section-heading section-heading--center">
          <p className="kicker"><span /> Beyond the product</p>
          <h2>We help farmers<br /><em>make it work.</em></h2>
        </div>
        <div className="support-v2__grid">
          {services.map(([image, title, body, href], index) => <Link href={href} key={title}><div className="support-v2__image"><Image alt={title} fill sizes="(min-width: 800px) 33vw, 100vw" src={image} /><span>0{index + 1}</span></div><h3>{title}</h3><p>{body}</p><b>Learn more ↗</b></Link>)}
        </div>
      </section>

      <section className="section story-v2">
        <div className="story-v2__visual"><Image alt="Dairy cattle supported by MolaPlus nutrition" fill sizes="(min-width: 900px) 52vw, 100vw" src="/molaplus/service-cows.webp" /><div>Made in Kenya<br /><b>for the farms<br />that feed us.</b></div></div>
        <div className="story-v2__copy"><p className="kicker"><span /> Why MolaPlus</p><h2>Local realities.<br /><em>Serious science.</em></h2><p>We build evidence-based animal nutrition around the challenges East African farmers face every day. Every product is backed by careful formulation, practical guidance and a team that stays close to the farm.</p><ul><li><span>Quality</span> Carefully researched nutrition</li><li><span>Innovation</span> Solutions for regional challenges</li><li><span>Reliability</span> Consistent, season after season</li></ul><Link href="/about-us">Meet MolaPlus Africa ↗</Link></div>
      </section>

      <section className="cta-v2"><p className="kicker kicker--light"><span /> Ready to grow?</p><h2>Let’s build a<br /><em>healthier farm.</em></h2><div><a className="button button--light" href="/order">Place an order <span>↗</span></a><a className="button button--line" href="tel:+254722656142">Call +254 722 656 142</a></div><small>Lipa na M-Pesa · Till number 906520</small></section>
    </main>
  );
}
