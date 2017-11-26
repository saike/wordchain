let Word = require('../models/word');

module.exports.list = function () {

  return new Promise(function (resolve, reject) {

    Word.find({}, function (err, words) {
      if (err) return reject(err);
      return resolve(words);
    })

  });

};

module.exports.create = function (word) {

  return new Promise((resolve, reject) => {

    Word.create({ text: word }, function (err, new_word) {
      if (err) return reject(err);
      // saved!
      resolve(new_word);
    });

  });

};