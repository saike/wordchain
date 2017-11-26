let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let WordSchema = new Schema({
  text: String
}, {
  timestamps: true
});

let WordModel = mongoose.model('Word', WordSchema );

module.exports = WordModel;