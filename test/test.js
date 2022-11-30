/* ****************************************************
/                      INSTRUCTIONS
/ Here is the code corresponding a simplified management of books in a library.
/ Elements are declared first then used in a short example.
/
/ Please, read and complete the following tasks:
/ 1/ Review and comment the following code. Note all your remarks that we'll debrief during an interview.
/ 2/ Write a new script with modifications and optimizations that you find pertinent
/ 3/ Write a new script by migrating to code to ES6
/
**************************************************** */


/* ********************** DECLARATIONS ****************************** */

// A Book is defined by an id (integer), a title (string) and a author (string). 
// It can be commented (string) and get evaluations (integer between 0 and 5). Internal revision is used for future purpose.

// we should use a class for creating objects
// inside the class, use the constructor method to create and initialize the object Book
function Book(id, title, author) {
    this._id = id;
    this._title = title;
    this._author = author;
    this._comments = undefined;
    this._revision = 0;
    this._evaluations = []; 

    this.getID = function() { return this._id; }
    this.getTitle = function() { return this._title; }
    this.getAuthor = function() { return this._author; }
    this.setComments = function(comments) { this._revision+=1; this._comments = comments; }
    this.getComments = function() { return this._comments; }
    this.setEvaluation = function(e) { this._evaluations[this._evaluations.length] = e; }
    this.getGlobalEvaluation = function() {
        var globalEvaluation = 0;

        // with ES6 the classic for loop has become for...in/of
        for (var i = 0; i < this._evaluations.length; ++i) {
            globalEvaluation += this._evaluations[i];
        }
        return globalEvaluation / this._evaluations.length;
    }
}

// A Library contains books (collection of Book). It can gain or lose books.
// A method is used to search books by words contained in their titles.
// A method is used to barrow a book: checks are done and can take a while. 

// we should use a class for creating objects
// inside the class, use the constructor method to create and initialize the object Library
function Library() {
    this._books = [];

    this.addBook = function(book) {
        this._books[this._books.length] = book;
    }

    // removeBook method could be simplified
    // same here, we should use the ES6 for...in/of
    this.removeBook = function(id) {
        var bookIndex;
        for (var i = 0; i < this._books.length; ++i) {
            if (this._books[i].getID() == id) {
              bookIndex = i;
            }
        }

        if (bookIndex != undefined) {
            var removedBook = this._books.splice(bookIndex, 1);

            if (removedBook.length > 0) {
                return removedBook[0];
            }
        }
    }
    
    // same here, we should use the ES6 for...in/of
    this.searchBooks = function() {
        var args = arguments;
        var books = [];

        for (var i = 0; i < this._books.length; ++i) {
            var title = this._books[i].getTitle();

            var matches = 0;
            for (var k = 0; k < args.length; ++k) {
                if (title.indexOf(args[k]) != -1) {
                    matches += 1;
                }
            }

            if (matches == args.length) {
                books[books.length] = this._books[i];
            }
        }

        return books;
    }

    // the callback function should be a Promise, either a try / catch that returns a promise
    // or an async/await function 
    // or even a function passed to new Promise that takes the arguments resolve (success) and reject (error)
    // js also has the methods .then and .catch 
    this.barrowBook = function(book, user, onOperationSuccess, onOperationFailed) {

        function checkResult(success) {
            if (success) {
                onOperationSuccess(book);
            } else {
                onOperationFailed(error);
            }
        }

        // DO A LOT OF WORK..... NOTHING TO CHANGE HERE
        setTimeout(checkResult.bind(this), 3000, user.hasValidSubscription());
    }
}

// suppose we have a class Reader with all its specific methods
// we could then put this function inside because it's related to the reader whon we give the borrowed books to
function giveBarrowedBooksToTheReader(books) {
    // DO STUFF WITH THE BOOKS
    console.log("Thank you. Here are your " + books.length + " books");
}


/* ********************** EXAMPLE ****************************** */

// all the 'var' should be let (block scoped) or const (block scoped, cannot be updated or re-declared)
var library = new Library();

// initializing a new Book like this is not efficient
// in a real project we get the data from databases or even json files.
// here we could put all the datas inside an array or even in a json file
// and then loop through the array to create a new Book each time
// it will also reduce the code

var bookA = new Book(101, "La Barbe Bleue", "Charles Perrault");
var bookB = new Book(32, "La Petite Poucette", "Hans Chistian Andersen");
var bookC = new Book(35, "La Petite Sirene", "Hans Chistian Andersen");
var bookD = new Book(67, "Hansel et Gretel", "Jacob et Wilhelm Grimm");
var bookE = new Book(75, "La Petite gardeuse d'oies", "Jacob et Wilhelm Grimm");
var bookF = new Book(3, "Baba Yaga", "Alexandre Afanassiev");
library.addBook(bookA);
library.addBook(bookB);
library.addBook(bookC);
library.addBook(bookD);
library.addBook(bookE);
library.addBook(bookF);

bookC.setEvaluation(5);
bookC.setEvaluation(4);
bookC.setEvaluation(5);

library.removeBook(101);

console.log(bookC.getGlobalEvaluation()); // expected output: 4.666
console.log(library.searchBooks("Petite")); // expected output: [bookB, bookC, bookE]
console.log(library.searchBooks("Petite", "Sirene")); // expected output: [bookC]

// The reader barrows 2 books
var reader = {hasValidSubscription(){return true;}};

// this should be simplified, we only need to parse the arguments and fire the function
library.barrowBook(bookF, reader, function (book1) {
    console.log("Internal: successful operation on book: " + book1.getTitle());
    library.barrowBook(bookD, reader, function (book2) {
        console.log("Internal: successful operation on book: " + book2.getTitle());
        giveBarrowedBooksToTheReader([book1, book2]);
    }, function() {
        console.log("Internal: operation failed on book: " + book2.getTitle());
        giveBarrowedBooksToTheReader([book1]);
    });
}, function() {
    console.log("Internal: operation failed on book: " + book1.getTitle());
    giveBarrowedBooksToTheReader([]);
});

// expected output:
// Internal: successful operation on book: Baba Yaga
// Internal: successful operation on book: Hansel et Gretel
// Thank you. Here are your 2 books
