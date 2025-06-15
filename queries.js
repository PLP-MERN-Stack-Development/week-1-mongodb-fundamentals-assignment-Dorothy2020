// --- Basic CRUD Queries ---

// Find all books in a specific genre
db.books.find({ genre: "Business" });

// Find books published after a certain year
db.books.find({ published_year: { $gt: 2015 } });

// Find books by a specific author
db.books.find({ author: "Cal Newport" });

// Update the price of a specific book
db.books.updateOne({ title: "Deep Work" }, { $set: { price: 20.00 } });

// Delete a book by its title
db.books.deleteOne({ title: "Zero to One" });


// --- Advanced Queries ---

// Find books in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// Use projection to return only title, author, and price
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 });

// Sort books by price ascending
db.books.find().sort({ price: 1 });

// Sort books by price descending
db.books.find().sort({ price: -1 });

// Pagination: page 1 (skip 0, limit 5)
db.books.find().skip(0).limit(5);

// Pagination: page 2 (skip 5, limit 5)
db.books.find().skip(5).limit(5);


// --- Aggregation Pipelines ---

// Average price by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      average_price: { $avg: "$price" }
    }
  }
]);

// Author with the most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// Group books by publication decade
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $substr: ["$published_year", 0, 3] },
          "0s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  }
]);


// --- Indexing ---

// Create index on title
db.books.createIndex({ title: 1 });

// Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 });

// Use explain to show performance improvement
db.books.find({ title: "Deep Work" }).explain("executionStats");
