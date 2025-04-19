const mongoose = require('mongoose');

const ngrokSchema = new mongoose.Schema({
    url: String,
    createdAt: { type: Date, default: Date.now }
  });

const NgrokURL = mongoose.model('NgrokURL', ngrokSchema);

module.exports = NgrokURL;