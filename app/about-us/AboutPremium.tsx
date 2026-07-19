import Image from "next/image";
import Link from "next/link";
import { FadeIn, MotionDiv, Stagger, StaggerItem } from "../_components/MotionPrimitives";
import { SiteFooter, SiteHeader } from "../_components/SiteChrome";

const pillars = [
  ["science", "Scientific Excellence", "Research-led formulations designed for real livestock productivity."],
  ["eco", "Sustainable Growth", "Nutrition strategies that support animal health while reducing waste."],
  ["handshake", "Trusted Partnership", "Technical support for farmers, distributors, and commercial operations."],
] as const;

const timeline = [
  ["2009", "Founded to close livestock nutrition gaps for East African farms."],
  ["15+ yrs", "Continuous formulation, field learning, and technical support."],
  ["Today", "A premium suite for dairy, poultry, pigs, goats, sheep, and beef."],
] as const;

const standards = ["Integrity", "Transparency", "Farmer-first support", "Verified quality", "Practical science"] as const;

export function AboutPremium() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8fbf4] text-on-surface">
      <SiteHeader active="/about-us" />
      <main>
        <section className="relative overflow-hidden bg-[#07130c] pt-24 text-white md:pt-28">
          <div className="absolute inset-0">
            <Image alt="Healthy livestock farm" className="h-full w-full object-cover opacity-46" fill priority sizes="100vw" src="/molaplus/service-poultry.png" />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,#07130c_0%,rgba(7,19,12,0.88)_45%,rgba(7,19,12,0.35)_100%)]" />
          </div>
          <div className="relative mx-auto grid min-h-[82svh] max-w-container-max-width grid-cols-1 items-center gap-10 px-margin-mobile pb-12 md:grid-cols-[1fr_0.88fr] md:px-margin-desktop">
            <FadeIn>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-fixed">About MolaPlus Africa</p>
              <h1 className="max-w-3xl text-[2.65rem] font-extrabold leading-[1.04] tracking-normal md:text-[5.25rem]">
                Science-led nutrition for Africa&apos;s modern farms.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/72">
                We translate biotechnology, probiotics, and practical farm knowledge into premium products that help livestock perform better every season.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="rounded-full bg-primary-fixed px-7 py-4 text-center font-bold text-primary" href="/products">
                  Explore Products
                </Link>
                <Link className="rounded-full border border-white/18 bg-white/10 px-7 py-4 text-center font-bold text-white backdrop-blur" href="/contact">
                  Request Consultation
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <MotionDiv
                animate={{ rotate: [0, 1.5, 0], y: [0, -10, 0] }}
                className="rounded-[2rem] border border-white/12 bg-white/[0.08] p-4 shadow-[0_32px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative col-span-2 aspect-[1.55] overflow-hidden rounded-[1.35rem]">
                    <Image alt="Dairy nutrition service" className="object-cover" fill sizes="(min-width: 768px) 460px, 100vw" src="/molaplus/service-cows.png" />
                  </div>
                  <div className="rounded-[1.35rem] bg-white p-5 text-primary">
                    <p className="text-4xl font-extrabold">15+</p>
                    <p className="mt-2 text-sm font-bold text-on-surface-variant">Years in nutrition science</p>
                  </div>
                  <div className="relative overflow-hidden rounded-[1.35rem] bg-[#f8fbf4] p-4">
                    <Image alt="MolaPlus product range" className="object-contain p-3" fill sizes="200px" src="/molaplus/poultry-5ltr.png" />
                  </div>
                </div>
              </MotionDiv>
            </FadeIn>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <FadeIn className="mx-auto mb-12 max-w-3xl text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-secondary">Our Foundation</p>
              <h2 className="text-4xl font-extrabold leading-tight text-ink-black md:text-5xl">
                Premium products need premium principles.
              </h2>
            </FadeIn>
            <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {pillars.map(([icon, title, copy]) => (
                <StaggerItem className="rounded-2xl border border-outline-variant bg-white p-7 shadow-sm" key={title}>
                  <span className="material-symbols-outlined text-4xl text-secondary">{icon}</span>
                  <h3 className="mt-6 text-2xl font-extrabold text-primary">{title}</h3>
                  <p className="mt-3 leading-7 text-on-surface-variant">{copy}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto grid max-w-container-max-width grid-cols-1 gap-12 px-margin-mobile md:grid-cols-[0.86fr_1.14fr] md:items-center md:px-margin-desktop">
            <FadeIn>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-secondary">Our Story</p>
              <h2 className="text-4xl font-extrabold leading-tight text-ink-black md:text-5xl">
                Built from a real farming need.
              </h2>
              <p className="mt-5 text-lg leading-8 text-on-surface-variant">
                MolaPlus Africa began with a clear mission: help farmers unlock stronger animal performance through products that are practical, consistent, and scientifically grounded.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {standards.map((standard) => (
                  <span className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-bold text-primary" key={standard}>
                    {standard}
                  </span>
                ))}
              </div>
            </FadeIn>

            <Stagger className="grid grid-cols-1 gap-4">
              {timeline.map(([date, copy]) => (
                <StaggerItem className="grid grid-cols-[5.5rem_1fr] gap-4 rounded-2xl border border-outline-variant bg-[#fbfdf8] p-5" key={date}>
                  <p className="text-2xl font-extrabold text-primary">{date}</p>
                  <p className="leading-7 text-on-surface-variant">{copy}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="bg-[#0b1b11] py-20 text-white md:py-28">
          <div className="mx-auto grid max-w-container-max-width grid-cols-1 gap-10 px-margin-mobile md:grid-cols-[1fr_0.9fr] md:items-center md:px-margin-desktop">
            <FadeIn>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-fixed">Local Impact</p>
              <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
                Made for the conditions farmers actually face.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/68">
                We focus on East African breeds, feed systems, distributor realities, and climate pressure, so the science lands where it matters: in daily production.
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                <div className="relative aspect-[1.1] overflow-hidden rounded-[1.5rem] bg-white">
                  <Image alt="MolaPlus livestock product" className="object-contain p-10" fill sizes="(min-width: 768px) 420px, 100vw" src="/molaplus/pig-20ltr.png" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-3xl font-extrabold text-primary-fixed">4+</p>
                    <p className="text-sm text-white/68">regional markets</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-3xl font-extrabold text-primary-fixed">500+</p>
                    <p className="text-sm text-white/68">operations reached</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <FadeIn className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="rounded-[2rem] bg-primary p-7 text-white shadow-2xl shadow-primary/20 md:p-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-fixed">Partner With Us</p>
                  <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
                    Bring premium nutrition to your farm or distributor network.
                  </h2>
                </div>
                <Link className="rounded-full bg-white px-8 py-4 text-center font-extrabold text-primary" href="/contact">
                  Contact MolaPlus
                </Link>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
