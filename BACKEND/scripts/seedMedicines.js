// Seed 25 medicines into MongoDB.
// Usage: node scripts/seedMedicines.js
require('dotenv').config();
const mongoose = require('mongoose');
const Medicine = require('../models/Medicine');

// Real medicine photos (keyword-matched, deterministic per item via lock)
const img = (i, dosageForm) => {
  const form = String(dosageForm).toLowerCase();
  const tag = form.includes('capsule') ? 'capsule' : form.includes('syrup') ? 'syrup' : 'tablet';
  return `https://loremflickr.com/600/400/medicine,pharmacy,${tag}?lock=${i + 1}`;
};

const base = [
  ['Napa', 'Paracetamol', 'Tablet', '500mg', 1.2, 200, 'Beximco Pharma', 'Relieves mild to moderate pain and reduces fever.'],
  ['Ace', 'Paracetamol', 'Tablet', '500mg', 1.0, 180, 'Square Pharmaceuticals', 'Effective for fever, headache and body ache.'],
  ['Seclo', 'Omeprazole', 'Capsule', '20mg', 6.0, 120, 'Square Pharmaceuticals', 'Reduces stomach acid; treats acidity and ulcers.'],
  ['Sergel', 'Esomeprazole', 'Capsule', '20mg', 7.0, 110, 'Healthcare Pharma', 'For acid reflux, heartburn and gastric ulcers.'],
  ['Maxpro', 'Esomeprazole', 'Capsule', '20mg', 7.0, 95, 'Renata Limited', 'Proton pump inhibitor for GERD.'],
  ['Fexo', 'Fexofenadine', 'Tablet', '120mg', 9.0, 90, 'Square Pharmaceuticals', 'Antihistamine for allergic rhinitis and urticaria.'],
  ['Histacin', 'Chlorpheniramine', 'Tablet', '4mg', 0.8, 150, 'Square Pharmaceuticals', 'Relieves allergy symptoms and runny nose.'],
  ['Monas', 'Montelukast', 'Tablet', '10mg', 14.0, 70, 'ACME Laboratories', 'Used for asthma and allergic rhinitis.'],
  ['Azithral', 'Azithromycin', 'Tablet', '500mg', 35.0, 60, 'Incepta Pharmaceuticals', 'Macrolide antibiotic for bacterial infections.'],
  ['Cef-3', 'Cefixime', 'Capsule', '400mg', 30.0, 65, 'Square Pharmaceuticals', 'Broad-spectrum antibiotic for infections.'],
  ['Amodis', 'Metronidazole', 'Tablet', '400mg', 2.5, 130, 'Square Pharmaceuticals', 'Treats anaerobic bacterial and protozoal infections.'],
  ['Filmet', 'Metronidazole', 'Tablet', '400mg', 2.3, 100, 'Beximco Pharma', 'For amoebiasis and giardiasis.'],
  ['Napa Extra', 'Paracetamol + Caffeine', 'Tablet', '500mg+65mg', 1.8, 140, 'Beximco Pharma', 'Stronger relief for headache with caffeine.'],
  ['Tufnil', 'Tolfenamic Acid', 'Tablet', '200mg', 8.0, 80, 'Square Pharmaceuticals', 'For migraine and acute pain.'],
  ['Algin', 'Tiemonium Methylsulfate', 'Tablet', '50mg', 4.0, 110, 'Square Pharmaceuticals', 'Antispasmodic for abdominal cramps.'],
  ['Pantonix', 'Pantoprazole', 'Tablet', '20mg', 6.5, 100, 'Incepta Pharmaceuticals', 'Reduces gastric acid secretion.'],
  ['Rivotril', 'Clonazepam', 'Tablet', '0.5mg', 5.0, 40, 'Roche', 'For anxiety and seizure disorders.'],
  ['Indever', 'Propranolol', 'Tablet', '10mg', 1.5, 90, 'ACI Limited', 'Beta-blocker for hypertension and anxiety.'],
  ['Cardipro', 'Bisoprolol', 'Tablet', '5mg', 9.0, 75, 'Incepta Pharmaceuticals', 'For high blood pressure and heart conditions.'],
  ['Comet', 'Metformin', 'Tablet', '500mg', 3.0, 160, 'ACME Laboratories', 'First-line therapy for type 2 diabetes.'],
  ['Diabet', 'Gliclazide', 'Tablet', '80mg', 5.5, 85, 'Square Pharmaceuticals', 'Controls blood sugar in type 2 diabetes.'],
  ['Losectil', 'Omeprazole', 'Tablet', '20mg', 6.0, 105, 'Eskayef Pharmaceuticals', 'Treats heartburn and reflux disease.'],
  ['Bextram Gold', 'Multivitamin + Minerals', 'Capsule', '—', 6.0, 130, 'Beximco Pharma', 'Daily multivitamin and mineral supplement.'],
  ['Calbo-D', 'Calcium + Vitamin D3', 'Tablet', '500mg+200IU', 7.0, 120, 'Square Pharmaceuticals', 'Supports bone health.'],
  ['Vita-C', 'Ascorbic Acid', 'Tablet', '250mg', 1.5, 200, 'ACME Laboratories', 'Vitamin C supplement to boost immunity.'],
];

const medicines = base.map(([name, genericName, dosageForm, strength, price, strip, manufacturer, description], i) => ({
  name, genericName, dosageForm, strength, price, strip, manufacturer, description,
  image: img(i, dosageForm),
}));

(async () => {
  try {
    if (!process.env.ATLAS_URI) throw new Error('ATLAS_URI not set');
    await mongoose.connect(process.env.ATLAS_URI);
    console.log('Connected to MongoDB');

    let inserted = 0, updated = 0;
    for (const m of medicines) {
      const existing = await Medicine.findOne({ name: m.name, strength: m.strength });
      if (existing) {
        existing.image = m.image; // refresh to real photo
        await existing.save();
        updated++;
        console.log(`~ Updated image: ${m.name} ${m.strength}`);
        continue;
      }
      await new Medicine(m).save();
      inserted++;
      console.log(`+ Inserted: ${m.name} ${m.strength} (${m.genericName})`);
    }

    const total = await Medicine.countDocuments();
    console.log(`\nDone. Inserted ${inserted}, updated ${updated}. Total medicines in DB: ${total}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
})();
