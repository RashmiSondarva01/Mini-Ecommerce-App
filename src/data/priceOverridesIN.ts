/**
 * The Fake Store API returns USD list prices that don't reflect what these
 * categories of goods actually cost in the Indian market (e.g. a curved
 * gaming monitor at "$999.99" vs. its real ~₹90,000 street price). Keyed by
 * the API's fixed product id (1-20), these are approximate real-world INR
 * prices for the closest matching product category, used in place of the
 * API price everywhere downstream (listing, detail, cart, sale-price calc).
 */
export const INR_PRICE_OVERRIDES: Record<number, number> = {
  1: 8999, // Fjallraven Foldsack No. 1 laptop backpack
  2: 799, // Men's premium slim fit T-shirt
  3: 2499, // Men's cotton jacket
  4: 699, // Men's casual slim fit shirt
  5: 58999, // John Hardy gold & silver chain bracelet
  6: 12999, // Solid gold petite micropave ring
  7: 799, // White gold plated princess ring (fashion/plated)
  8: 899, // Pierced Owl stainless steel earrings
  9: 4999, // WD 2TB Elements portable hard drive
  10: 5499, // SanDisk SSD Plus 1TB
  11: 1999, // Silicon Power 256GB SSD
  12: 8999, // WD 4TB Gaming Drive for PS4
  13: 8999, // Acer SB220Q 21.5" Full HD monitor
  14: 89999, // Samsung 49" CHG90 curved gaming monitor
  15: 3999, // Women's 3-in-1 snowboard jacket
  16: 2499, // Women's faux leather moto jacket
  17: 1499, // Women's windbreaker rain jacket
  18: 499, // Women's boat neck top
  19: 599, // Women's moisture-wicking top
  20: 399, // Women's casual cotton T-shirt
};
