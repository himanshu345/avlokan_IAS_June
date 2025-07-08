// Usage: node src/scripts/fix_originalname_in_answers.js
const mongoose = require('mongoose');
const Answer = require('../models/Answer');
require('dotenv').config({ path: './avlokan_IAS_June/backend/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/avlokanias';

async function fixOriginalNames() {
  await mongoose.connect(MONGO_URI);
  const answers = await Answer.find({ 'fileAttachments.0': { $exists: true } });
  let updatedCount = 0;
  for (const answer of answers) {
    let changed = false;
    for (const file of answer.fileAttachments) {
      if (!file.originalname) {
        file.originalname = file.filename;
        changed = true;
      }
    }
    if (changed) {
      await answer.save();
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} answers with missing originalname.`);
  await mongoose.disconnect();
}

fixOriginalNames().catch(err => {
  console.error('Error updating answers:', err);
  process.exit(1);
}); 