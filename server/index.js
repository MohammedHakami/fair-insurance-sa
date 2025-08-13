const express = require('express');
const cors = require('cors');

/*
 * Simple backend API for calculating the fair car insurance price and generating
 * comparative offers from five sample companies. The API accepts a JSON
 * payload describing the vehicle and driver then returns the calculated fair
 * price along with a list of offers. Each offer is derived from the fair
 * price by applying a random percentage modifier between −12% and +18%.
 */

const app = express();

// Allow JSON bodies and cross‑origin requests
app.use(express.json());
app.use(cors());

// Base price before modifiers
const BASE_PRICE = 900;

/**
 * Compute the fair price for a given set of insurance variables. The fair
 * price is derived from the base price with modifiers that reflect the
 * vehicle's age, driver’s age, accident history and city risk factor. The
 * final price is clipped to be within the range 600–3000 SAR.
 *
 * @param {Object} payload   User supplied data
 * @param {string} payload.model   Vehicle model (unused but could influence price)
 * @param {number|string} payload.year   Year of manufacture
 * @param {string} payload.city   City where the vehicle is registered
 * @param {number|string} payload.accidents  Number of recorded accidents
 * @param {number|string} payload.driver_age Driver's age
 * @returns {{fair_price: number, modifiers: number}}  The computed fair price and total modifiers
 */
function computeFairPrice(payload) {
  let modifiers = 0;

  const currentYear = new Date().getFullYear();
  const year = parseInt(payload.year, 10) || currentYear;
  const carAge = currentYear - year;

  // Older vehicles attract a higher modifier
  if (carAge > 10) modifiers += 0.10;
  if (carAge > 20) modifiers += 0.20;

  // Accident history increases risk
  const accidents = parseInt(payload.accidents, 10) || 0;
  modifiers += accidents * 0.05;

  // Driver age: inexperienced (young) or very old drivers are higher risk
  const driverAge = parseInt(payload.driver_age, 10) || 30;
  if (driverAge < 25) modifiers += 0.15;
  if (driverAge > 60) modifiers += 0.10;

  // City risk factors based on population density or accident statistics. These
  // values are illustrative – real insurers would use actuarial data.
  const city = (payload.city || '').toString();
  const cityRisk = {
    Riyadh: 0.10,
    Jeddah: 0.08,
    Dammam: 0.05,
    Mecca: 0.07,
    Medina: 0.06,
  };
  if (cityRisk[city]) modifiers += cityRisk[city];

  let price = BASE_PRICE * (1 + modifiers);
  // Clamp price to the allowed range
  price = Math.max(600, Math.min(price, 3000));

  return { fair_price: Math.round(price), modifiers };
}

/**
 * Generate offers from the five companies by applying a random modifier
 * between –12% and +18% to the fair price. Each company has a unique name.
 *
 * @param {number} fairPrice  The calculated fair price
 * @returns {Array<{company: string, modifier: number, price: number}>}
 */
function generateOffers(fairPrice) {
  const companies = ['Najm', 'TameenX', 'Aman', 'Wathiq', 'Sanad'];
  return companies.map(company => {
    // random between -0.12 and +0.18 → Math.random() * (0.18 + 0.12) - 0.12
    const randomModifier = Math.random() * 0.30 - 0.12;
    const price = Math.round(fairPrice * (1 + randomModifier));
    return {
      company,
      modifier: parseFloat(randomModifier.toFixed(3)),
      price,
    };
  });
}

// POST route to handle insurance quote requests
app.post('/api/quote', (req, res) => {
  const payload = req.body || {};
  const { fair_price } = computeFairPrice(payload);
  const offers = generateOffers(fair_price);
  res.json({ fair_price, offers });
});

// Health check endpoint
app.get('/', (_, res) => {
  res.send('Fair Insurance Backend is running.');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
