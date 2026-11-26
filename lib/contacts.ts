/**
 * MolaPlus people customers can contact. Change names, roles and numbers here only.
 * `tel` is the international form used for call and WhatsApp links.
 */
export type Contact = { name: string; role: string; display: string; tel: string };

/** Main contact: used for the header, footer, call buttons and WhatsApp. */
export const MAIN_CONTACT: Contact = { name: "Geofrey Kamau", role: "Main contact", display: "0724 968 847", tel: "254724968847" };

export const TEAM: Contact[] = [
  { name: "Samuel Mugenyo", role: "Sales", display: "0723 351 024", tel: "254723351024" },
  { name: "Joseph Mugenyo", role: "Sales", display: "0720 843 844", tel: "254720843844" },
  { name: "John Karanja", role: "Sales", display: "0723 832 811", tel: "254723832811" },
  { name: "Nick Mutuku", role: "Finance", display: "0712 037 069", tel: "254712037069" },
];
