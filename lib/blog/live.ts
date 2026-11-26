/**
 * Live blog reads from the PHP API.
 *
 * Bluehost's CDN once kept API answers for 24 hours, so a newly published
 * article showed "Story not found". Reads therefore carry a version value:
 *  - `minuteUrl`: changes every minute. Visitors share one cached copy per
 *    minute, and new articles appear within about a minute.
 *  - `freshUrl`: unique per request, for answers that must be current
 *    (a just-published article, comments, reactions).
 */
export function minuteUrl(url: string) {
  return `${url}${url.includes("?") ? "&" : "?"}v=${Math.floor(Date.now() / 60000)}`;
}

export function freshUrl(url: string) {
  return `${url}${url.includes("?") ? "&" : "?"}_=${Date.now()}`;
}
