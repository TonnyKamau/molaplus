"use client";

import { useMemo, useState } from "react";
import { useT } from "../../lib/i18n";
import type { Distributor } from "./distributors";
import { classifyTown, distanceKm, towns, type Town } from "./towns";

const PAGE_SIZE = 60;

type UserLoc = { lat: number; lng: number };
type GeoState = "idle" | "loading" | "granted" | "denied" | "error";
type MapTarget = { name: string; town: Town };

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function DistributorDirectory({ distributors }: { distributors: Distributor[] }) {
  // Native French (not Google): live counts stay exact and business names untouched.
  const t = useT();
  const fr = t.lang === "fr";
  const num = (value: number) => value.toLocaleString(fr ? "fr-FR" : "en-US");
  const [query, setQuery] = useState("");
  const [selectedTown, setSelectedTown] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [userLoc, setUserLoc] = useState<UserLoc | null>(null);
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [mapTarget, setMapTarget] = useState<MapTarget | null>(null);

  // Classify every distributor into a town once.
  const enriched = useMemo(
    () =>
      distributors.map((d) => {
        const townKey = classifyTown(d.name);
        return { ...d, townKey, town: townKey ? towns[townKey] : null };
      }),
    [distributors]
  );

  // Counts per town + unclassified, and the town options for the filter.
  const { townOptions, unclassifiedCount } = useMemo(() => {
    const counts = new Map<string, number>();
    let unknown = 0;
    for (const d of enriched) {
      if (d.townKey) counts.set(d.townKey, (counts.get(d.townKey) ?? 0) + 1);
      else unknown += 1;
    }
    const options = Array.from(counts.entries()).map(([key, count]) => ({
      key,
      count,
      town: towns[key],
    }));
    options.sort((a, b) => {
      if (userLoc) {
        return distanceKm(userLoc, a.town) - distanceKm(userLoc, b.town);
      }
      return a.town.name.localeCompare(b.town.name);
    });
    return { townOptions: options, unclassifiedCount: unknown };
  }, [enriched, userLoc]);

  const searchableQuery = normalize(query);

  const filtered = useMemo(() => {
    let list = enriched;

    if (selectedTown === "unclassified") {
      list = list.filter((d) => !d.townKey);
    } else if (selectedTown !== "all") {
      list = list.filter((d) => d.townKey === selectedTown);
    }

    if (searchableQuery) {
      list = list.filter((d) => {
        const phoneText = d.phones.map((p) => p.display).join(" ");
        const townName = d.town?.name ?? "";
        return normalize(`${d.name} ${townName} ${phoneText}`).includes(searchableQuery);
      });
    }

    if (userLoc) {
      list = [...list].sort((a, b) => {
        const da = a.town ? distanceKm(userLoc, a.town) : Infinity;
        const db = b.town ? distanceKm(userLoc, b.town) : Infinity;
        return da - db;
      });
    }

    return list;
  }, [enriched, selectedTown, searchableQuery, userLoc]);

  const visible = filtered.slice(0, visibleCount);
  const classifiedCount = enriched.length - unclassifiedCount;

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoState("error");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState("granted");
        setSelectedTown("all");
        setVisibleCount(PAGE_SIZE);
      },
      (err) => {
        setGeoState(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  };

  const clearLocation = () => {
    setUserLoc(null);
    setGeoState("idle");
  };

  const nearestTown = userLoc && townOptions.length > 0 ? townOptions[0] : null;
  const nearestDist =
    userLoc && nearestTown ? distanceKm(userLoc, nearestTown.town) : null;
  // Kenya's classified towns are dense; a nearest town >400km away means the
  // browser returned a location outside the country (desktop wifi / VPN / IP).
  const locationOutOfRange = nearestDist !== null && nearestDist > 400;

  return (
    <div className="directory-page min-h-screen bg-surface text-on-surface" translate="no">
      <main className="mx-auto w-full max-w-container-max-width px-margin-mobile py-stack-lg md:px-margin-desktop">
        <section className="mb-10 grid grid-cols-1 gap-gutter lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <span className="mp-eyebrow text-secondary">{t("Distributor Directory", "Annuaire des distributeurs")}</span>
            <h1 className="mp-display-sm mt-4 text-ink-black">{t("Find a MolaPlus distributor", "Trouver un distributeur MolaPlus")}</h1>
            <p className="mt-4 max-w-2xl text-lg text-on-surface-variant">
              {t("Search by name or phone, filter by town, or share your location to see the distributors nearest to you.", "Recherchez par nom ou téléphone, filtrez par ville, ou partagez votre position pour voir les distributeurs les plus proches.")}
            </p>
          </div>

          <div className="directory-stats grid grid-cols-3 gap-3 rounded-3xl border border-outline-variant bg-surface-container-low p-5">
            <div>
              <p className="mp-eyebrow text-on-surface-variant">{t("Outlets", "Points de vente")}</p>
              <p className="text-2xl font-extrabold text-primary">{num(distributors.length)}</p>
            </div>
            <div>
              <p className="mp-eyebrow text-on-surface-variant">{t("Towns", "Villes")}</p>
              <p className="text-2xl font-extrabold text-primary">{num(townOptions.length)}</p>
            </div>
            <div>
              <p className="mp-eyebrow text-on-surface-variant">{t("Mapped", "Localisés")}</p>
              <p className="text-2xl font-extrabold text-primary">{num(classifiedCount)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-outline-variant bg-surface-container-lowest">
          <div className="border-b border-outline-variant p-4 md:p-6">
            {/* Search + filters */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
              <div className="flex items-center gap-3 rounded-lg border border-outline-variant bg-white px-4 py-3">
                <span className="material-symbols-outlined notranslate text-on-surface-variant">search</span>
                <input
                  className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  placeholder={t("Search name, town or phone", "Nom, ville ou téléphone")}
                  type="search"
                  value={query}
                />
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-white px-3 py-2.5">
                <span className="material-symbols-outlined notranslate text-on-surface-variant">location_city</span>
                <select
                  aria-label={t("Filter by town", "Filtrer par ville")}
                  className="w-full cursor-pointer bg-transparent text-body-md text-on-surface outline-none md:w-56"
                  onChange={(event) => {
                    setSelectedTown(event.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  value={selectedTown}
                >
                  <option value="all">{`${t("All towns", "Toutes les villes")} (${num(townOptions.length)})`}</option>
                  {townOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.town.name}
                      {userLoc ? ` · ${Math.round(distanceKm(userLoc, option.town))} km` : ""} ({option.count})
                    </option>
                  ))}
                  <option value="unclassified">{`${t("Unclassified", "Non classés")} (${num(unclassifiedCount)})`}</option>
                </select>
              </div>

              {userLoc ? (
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2.5 font-label-md text-label-md font-bold text-on-primary transition-opacity hover:opacity-90"
                  onClick={clearLocation}
                  type="button"
                >
                  <span className="material-symbols-outlined notranslate text-[18px]">my_location</span>
                  {t("Clear location", "Effacer la position")}
                </button>
              ) : (
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-4 py-2.5 font-label-md text-label-md font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-60"
                  disabled={geoState === "loading"}
                  onClick={requestLocation}
                  type="button"
                >
                  <span className="material-symbols-outlined notranslate text-[18px]">near_me</span>
                  {geoState === "loading" ? t("Locating…", "Localisation…") : t("Distributors near me", "Distributeurs près de moi")}
                </button>
              )}
            </div>

            {/* Status line */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-label-md text-on-surface-variant">
              <span>
                {t(`Showing ${num(visible.length)} of ${num(filtered.length)} matches`, `${num(visible.length)} sur ${num(filtered.length)} résultats affichés`)}
              </span>
              {query || selectedTown !== "all" ? (
                <button
                  className="font-bold text-primary hover:underline"
                  onClick={() => {
                    setQuery("");
                    setSelectedTown("all");
                    setVisibleCount(PAGE_SIZE);
                  }}
                  type="button"
                >
                  {t("Clear filters", "Effacer les filtres")}
                </button>
              ) : null}
            </div>

            {userLoc && locationOutOfRange ? (
              <p className="mt-3 flex items-start gap-2 rounded-2xl bg-error-container px-4 py-2.5 font-label-md text-label-md text-on-error-container">
                <span className="material-symbols-outlined notranslate text-[18px]">location_off</span>
                <span>
                  {t(
                    `We couldn’t pinpoint your location inside Kenya (it looks about ${num(Math.round(nearestDist!))} km away). This usually happens on a desktop browser or over a VPN — please pick your town from the list above for accurate results.`,
                    `Impossible de vous situer au Kenya (votre position semble à environ ${num(Math.round(nearestDist!))} km). Cela arrive souvent sur un ordinateur ou avec un VPN — choisissez votre ville dans la liste ci-dessus pour des résultats précis.`,
                  )}
                </span>
              </p>
            ) : null}
            {userLoc && nearestTown && !locationOutOfRange ? (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-container/40 px-4 py-1.5 font-label-md text-label-md text-primary">
                <span className="material-symbols-outlined notranslate text-[18px]">where_to_vote</span>
                {t(
                  `Sorted by distance — nearest town is ${nearestTown.town.name} (~${Math.round(distanceKm(userLoc, nearestTown.town))} km)`,
                  `Triés par distance — ville la plus proche : ${nearestTown.town.name} (~${Math.round(distanceKm(userLoc, nearestTown.town))} km)`,
                )}
              </p>
            ) : null}
            {geoState === "denied" ? (
              <p className="mt-3 font-label-md text-label-md text-error">
                {t("Location permission was denied. You can still filter by town using the dropdown.", "L’accès à la position a été refusé. Vous pouvez toujours filtrer par ville avec la liste déroulante.")}
              </p>
            ) : null}
            {geoState === "error" ? (
              <p className="mt-3 font-label-md text-label-md text-error">
                {t("Could not get your location. You can still filter by town using the dropdown.", "Impossible d’obtenir votre position. Vous pouvez toujours filtrer par ville avec la liste déroulante.")}
              </p>
            ) : null}
          </div>

          <div className="divide-y divide-outline-variant">
            {visible.map((distributor) => {
              const dist = userLoc && distributor.town ? Math.round(distanceKm(userLoc, distributor.town)) : null;
              return (
                <article
                  className="grid gap-3 p-4 transition-colors hover:bg-surface-container-low md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-5"
                  key={distributor.id}
                >
                  {distributor.town ? (
                    <button
                      className="group min-w-0 text-left"
                      onClick={() => setMapTarget({ name: distributor.name, town: distributor.town! })}
                      title={t(`Show ${distributor.town.name} on the map`, `Voir ${distributor.town.name} sur la carte`)}
                      type="button"
                    >
                      <h2 className="truncate font-headline-md text-[18px] text-on-surface group-hover:text-primary group-hover:underline">
                        {distributor.name}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-label-md text-label-md text-on-surface-variant">
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined notranslate text-[16px] text-primary">location_on</span>
                          {distributor.town.name}, {distributor.town.county}
                        </span>
                        {dist !== null ? (
                          <span className="rounded-full bg-primary-container/40 px-2 py-0.5 font-bold text-primary">
                            {t(`~${dist} km away`, `à ~${dist} km`)}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-0.5 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="material-symbols-outlined notranslate text-[16px]">map</span>
                          {t("View on map", "Voir sur la carte")}
                        </span>
                      </div>
                    </button>
                  ) : (
                    <div className="min-w-0">
                      <h2 className="truncate font-headline-md text-[18px] text-on-surface">{distributor.name}</h2>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-label-md text-label-md text-on-surface-variant">
                        <span className="inline-flex items-center gap-1 text-outline">
                          <span className="material-symbols-outlined notranslate text-[16px]">help</span>
                          {t("Town not classified", "Ville non classée")}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {distributor.town ? (
                      <button
                        className="inline-flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-2 font-label-md text-label-md font-bold text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                        onClick={() => setMapTarget({ name: distributor.name, town: distributor.town! })}
                        type="button"
                      >
                        <span className="material-symbols-outlined notranslate text-[18px]">map</span>
                        {t("Map", "Carte")}
                      </button>
                    ) : null}
                    {distributor.phones.length > 0 ? (
                      distributor.phones.map((phone) => (
                        <a
                          className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 font-label-md text-label-md font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                          href={`tel:${phone.tel}`}
                          key={phone.display}
                        >
                          <span className="material-symbols-outlined notranslate text-[18px]">call</span>
                          {phone.display}
                        </a>
                      ))
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-2 font-label-md text-label-md text-on-surface-variant">
                        <span className="material-symbols-outlined notranslate text-[18px]">phone_disabled</span>
                        {t("Phone not listed", "Téléphone non renseigné")}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}

            {visible.length === 0 ? (
              <div className="p-10 text-center">
                <span className="material-symbols-outlined notranslate mb-3 text-4xl text-on-surface-variant">search_off</span>
                <p className="font-headline-md text-headline-md text-primary">{t("No distributors found", "Aucun distributeur trouvé")}</p>
                <p className="mt-2 text-on-surface-variant">{t("Try a different town or a shorter search term.", "Essayez une autre ville ou une recherche plus courte.")}</p>
              </div>
            ) : null}
          </div>

          {visibleCount < filtered.length ? (
            <div className="border-t border-outline-variant p-4 text-center">
              <button
                className="rounded-lg bg-primary px-6 py-3 font-label-md text-label-md font-bold text-on-primary transition-opacity hover:opacity-90"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                type="button"
              >
                {t("Show more distributors", "Afficher plus de distributeurs")}
              </button>
            </div>
          ) : null}
        </section>
      </main>

      {mapTarget ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-black/60 p-4"
          onClick={() => setMapTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-label={t(`Map for ${mapTarget.name}`, `Carte pour ${mapTarget.name}`)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-outline-variant p-5">
              <div className="min-w-0">
                <h2 className="truncate font-headline-md text-headline-md text-on-surface">{mapTarget.name}</h2>
                <p className="mt-1 inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
                  <span className="material-symbols-outlined notranslate text-[18px] text-primary">location_on</span>
                  {fr ? `${mapTarget.town.name}, comté de ${mapTarget.town.county}` : `${mapTarget.town.name}, ${mapTarget.town.county} County`}
                  {userLoc ? (fr ? ` · à ~${Math.round(distanceKm(userLoc, mapTarget.town))} km` : ` · ~${Math.round(distanceKm(userLoc, mapTarget.town))} km away`) : ""}
                </p>
              </div>
              <button
                aria-label={t("Close map", "Fermer la carte")}
                className="shrink-0 rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                onClick={() => setMapTarget(null)}
                type="button"
              >
                <span className="material-symbols-outlined notranslate">close</span>
              </button>
            </div>
            <div className="relative aspect-[4/3] w-full bg-surface-container">
              <iframe
                key={`${mapTarget.town.lat},${mapTarget.town.lng}`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${mapTarget.town.lat},${mapTarget.town.lng}&z=12&hl=${t.lang}&output=embed`}
                title={t(`Map of ${mapTarget.town.name}`, `Carte de ${mapTarget.town.name}`)}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant p-4">
              <p className="font-label-md text-label-md text-on-surface-variant">
                {t("Approximate town location — call the distributor for exact directions.", "Emplacement approximatif de la ville — appelez le distributeur pour l’itinéraire exact.")}
              </p>
              <a
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md text-label-md font-bold text-on-primary transition-opacity hover:opacity-90"
                href={`https://www.google.com/maps/search/?api=1&query=${mapTarget.town.lat},${mapTarget.town.lng}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">open_in_new</span>
                {t("Open in Google Maps", "Ouvrir dans Google Maps")}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

