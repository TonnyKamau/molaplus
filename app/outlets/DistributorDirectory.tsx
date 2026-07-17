"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Distributor } from "./distributors";

const PAGE_SIZE = 80;

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function DistributorDirectory({ distributors }: { distributors: Distributor[] }) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const searchableQuery = normalize(query);
  const filteredDistributors = useMemo(() => {
    if (!searchableQuery) {
      return distributors;
    }

    return distributors.filter((distributor) => {
      const phoneText = distributor.phones.map((phone) => phone.display).join(" ");
      return normalize(`${distributor.name} ${phoneText}`).includes(searchableQuery);
    });
  }, [distributors, searchableQuery]);

  const visibleDistributors = filteredDistributors.slice(0, visibleCount);
  const withPhoneCount = distributors.filter((distributor) => distributor.phones.length > 0).length;

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-container-max-width items-center justify-between px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 transition-colors hover:bg-surface-container-high active:opacity-80 md:hidden">
              <span className="material-symbols-outlined text-primary">menu</span>
            </button>
            <Link className="flex items-center gap-3" href="/">
              <Image alt="MolaPlus Africa logo" className="h-10 w-10 rounded-full object-contain" height={40} src="/molaplus/logo.png" width={40} />
              <span className="font-headline-md text-headline-md font-extrabold tracking-tight text-primary">
                MolaPlus Africa
              </span>
            </Link>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/">
              Home
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/products">
              Products
            </Link>
            <Link className="font-label-md text-label-md text-primary transition-colors" href="/distributors">
              Distributors
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/contact">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-container-max-width px-margin-mobile py-stack-lg md:px-margin-desktop">
        <section className="mb-stack-lg grid grid-cols-1 gap-gutter lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="mb-3 font-label-md text-label-md font-bold uppercase tracking-widest text-secondary">
              Distributor Directory
            </p>
            <h1 className="font-headline-xl text-headline-xl mb-4 text-primary">Find a MolaPlus distributor</h1>
            <p className="max-w-2xl text-body-lg text-on-surface-variant">
              Search by distributor name or phone number from the current MolaPlus distributor list.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-stack-sm rounded-xl border border-outline-variant bg-surface-container-low p-4">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant">Distributors</p>
              <p className="font-headline-md text-headline-md text-primary">{distributors.length.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant">With phone</p>
              <p className="font-headline-md text-headline-md text-primary">{withPhoneCount.toLocaleString()}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest">
          <div className="border-b border-outline-variant p-4 md:p-6">
            <label className="font-label-md text-label-md font-bold text-on-surface" htmlFor="distributor-search">
              Search distributors
            </label>
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-outline-variant bg-white px-4 py-3">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
              <input
                className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
                id="distributor-search"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Type a distributor name or phone number"
                type="search"
                value={query}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-label-md text-on-surface-variant">
              <span>
                Showing {visibleDistributors.length.toLocaleString()} of {filteredDistributors.length.toLocaleString()} matches
              </span>
              {query ? (
                <button className="font-bold text-primary hover:underline" onClick={() => setQuery("")} type="button">
                  Clear search
                </button>
              ) : null}
            </div>
          </div>

          <div className="divide-y divide-outline-variant">
            {visibleDistributors.map((distributor) => (
              <article className="grid gap-3 p-4 transition-colors hover:bg-surface-container-low md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-5" key={distributor.id}>
                <div className="min-w-0">
                  <h2 className="truncate font-headline-md text-[18px] text-on-surface">{distributor.name}</h2>
                  <p className="mt-1 font-label-md text-label-md text-on-surface-variant">Authorized MolaPlus distributor</p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {distributor.phones.length > 0 ? (
                    distributor.phones.map((phone) => (
                      <a
                        className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 font-label-md text-label-md font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                        href={`tel:${phone.tel}`}
                        key={phone.display}
                      >
                        <span className="material-symbols-outlined text-[18px]">call</span>
                        {phone.display}
                      </a>
                    ))
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-2 font-label-md text-label-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">phone_disabled</span>
                      Phone not listed
                    </span>
                  )}
                </div>
              </article>
            ))}

            {visibleDistributors.length === 0 ? (
              <div className="p-10 text-center">
                <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant">search_off</span>
                <p className="font-headline-md text-headline-md text-primary">No distributors found</p>
                <p className="mt-2 text-on-surface-variant">Try a shorter name or phone number.</p>
              </div>
            ) : null}
          </div>

          {visibleCount < filteredDistributors.length ? (
            <div className="border-t border-outline-variant p-4 text-center">
              <button
                className="rounded-lg bg-primary px-6 py-3 font-label-md text-label-md font-bold text-on-primary transition-opacity hover:opacity-90"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                type="button"
              >
                Show more distributors
              </button>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
