// const { ObjectID } = require("mongodb");

// const MongoClient = require("mongodb").MongoClient;
// const ObjcetId = require("mongodb").ObjectID;
// const url = "mongodb://localhost:27017/authorDb";
// const mongoOptions = { useNewUrlParser: true };

// const state = {
//   db: null,
// };

// const connect = (cb) => {
//   if (state.db) cb();
//   else {
//     MongoClient.connect(url, mongoOptions, (err, client) => {
//       if (err) {
//         cb(err);
//       } else {
//         state.db = client.db("authorDb");
//         cb();
//       }
//     });
//   }
// };
// const getPrimarykey = (_id) => {
//   return ObjectID(_id);
// };

// const getDB = () => {
//   return state.db;
// };

// module.exports = {
//   getDB,
//   connect,
//   getPrimarykey,
// };
