const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./mongo");
const collection = "author";

// make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db.connect((err) => {
  if (err) {
    console.log("unable to connect to database");
    process.exit(1);
  } else {
    console.log("connected to database");
    app.listen(3000, function () {
      console.log("listening on 3000");
    });
  }
});

// url -- {{baseUrl}}/author/details
/*{
    "name" :"JayPrakash",
    "awards": 8,
    "years": "2000-01-01",
    "birthDate":"1959-01-01"
}
*/
app.post("/author/details", (req, res) => {
  // var myobj = { name: "Company Inc", address: "Highway 37" };
  let autherDetails = req.body;
  console.log(autherDetails);
  autherDetails.years = new Date(autherDetails.years);
  autherDetails.birthDate = new Date(autherDetails.birthDate);
  db.getDB()
    .collection("authors")
    .insertOne(autherDetails, function (err, result) {
      if (err) throw err;
      res.send("1 document inserted");
    });
});

// ***********APIs to insert data in Auther Books and AuthorBooks collections **
// url -- {{baseUrl}}/author/books
/*
{
    "book_name" :"Yoga",
    "price": 200

}
*/
app.post("/author/books", (req, res) => {
  // var myobj = { name: "Company Inc", address: "Highway 37" };
  let bookDetails = req.body;

  db.getDB()
    .collection("books")
    .insertOne(bookDetails, function (err, result) {
      if (err) throw err;
      res.send("1 document inserted");
    });
});

//url -- {{baseUrl}}/authorbook
/*{
    "bookId": "5ef44e67d84b430ef0b5be35",
    "authorId":"5ef44dd7d84b430ef0b5be33",
    "price":200,
    "status": "sold"
} */
app.post("/authorBook", (req, res) => {
  let authorBookData = req.body;

  db.getDB()
    .collection("authorBooks")
    .insertOne(authorBookData, function (err, result) {
      if (err) throw err;
      res.send("1 document inserted");
    });
});

// ****************Assignment API ******************************
// 1. Assignment API
// url -- localhost:3000/author/awards/:nAwards
app.get("/author/awards/:nAwards", (req, res) => {
  var query = { awards: { $gte: parseInt(req.params.nAwards) } };
  db.getDB()
    .collection("authors")
    .find(query)
    .toArray(function (err, documents) {
      if (err) throw err;
      res.send(documents);
    });
});

//2. Assignment API
//url -- localhost:3000/awards/win/:year
app.get("/awards/win/:year", (req, res) => {
  let inputDate = new Date(req.params.year);
  var query = { years: { $gte: inputDate } };
  db.getDB()
    .collection("authors")
    .find(query)
    .toArray(function (err, result) {
      if (err) throw err;
      res.send(result);
    });
});

// 3. Assignment API
//url --localhost:3000/author/book/sale/:authorId
app.get("/author/book/sale/:authorId", (req, res) => {
  let result;
  var query = [
    { $match: { status: "sold" } },
    {
      $group: {
        _id: req.params.authorId,
        totalProfit: { $sum: "$price" },
      },
    },
  ];
  db.getDB()
    .collection("authorBooks")
    .aggregate(query)
    .toArray(function (err, documents) {
      if (err) throw err;
      result = documents[0];
    });

  let totalBooks = 0;

  db.getDB()
    .collection("authorBooks")
    .find({ authorId: req.params.authorId })
    .count()
    .then((data) => {
      result.totalBooksSold = data;
      res.status(200).json(result);
    });
});

// 4. Assignement API
// url -- localhost:3000/author/book/salestatus/:birthDate/:totalPrice
app.get("/author/book/salestatus/:birthDate/:totalPrice", (req, res) => {
  let birthDate, totalPrice;
  let author_Id;
  birthDate = new Date(req.params.birthDate);
  totalPrice = req.params.totalPrice;

  var query = { birthDate: { $eq: birthDate } };
  db.getDB()
    .collection("authors")
    .find(query)
    .toArray(function (err, result) {
      if (err) throw err;
      author_Id = result[0]._id.toString();
      var query = [
        {
          $match: { authorId: author_Id },
        },
        {
          $group: {
            _id: "$bookId",
            totalPrice: { $sum: "$price" },
          },
        },
      ];

      db.getDB()
        .collection("authorBooks")
        .aggregate(query)
        .toArray(function (err, documents) {
          if (err) throw err;
          documents = documents.filter((element) => {
            return element.totalPrice >= parseInt(totalPrice);
          });
          res.status(200).json(documents);
        });
    });
});

// app.get("/", (req, res) => {
//   res.send("<h1> Hello from Node , from inside a docker container </h1>");
// });

// app.listen(3000, () => {
//   console.log("App running on port 3000...");
// });
