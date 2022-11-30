class Book {
    constructor(id, title, author) {
        this._id = id;
        this._title = title;
        this._author = author;
        this._comments = undefined;
        this._revision = 0;
        this._evaluations = []; 
    }

    getID() { return this._id; }
    getTitle() { return this._title; }
    getAuthor() { return this._author; }
    setComments(comments) { this._revision+=1; this._comments = comments; }
    getComments() { return this._comments; }
    setEvaluation(e) { 
        this._evaluations[this._evaluations.length] = e; 
    }
    getGlobalEvaluation() {
        let globalEvaluation = 0;

        for (let evaluation of this._evaluations) {
            globalEvaluation += evaluation;
        }
        return globalEvaluation / this._evaluations.length;
    }
}

class Library {
    constructor(_books) {
        this._books = [];
    }
    
    addBook(book){
        this._books[this._books.length] = book;
    }

    removeBook(id=null) {
        const bookIndex = this._books.findIndex((book) => book.getID() === id);
        this._books.splice(bookIndex, 1);  

        return this._books;
    }

    searchBooks() {
        let args = arguments;
        let books = [];

        for (let book of this._books) {
            const title = book.getTitle();

            let matches = 0;
            for (let key in args) {
                if (title.indexOf(args[key]) !== -1) {
                    matches += 1;
                }
            }

            if (matches === args.length) {
                books[books.length] = book;
            }
        }

        return books;
    }

    async barrowBook(books, user) {

        if (user.hasValidSubscription()) {
            const promises = books.map((book) => {
                console.log(`Internal: successful operation on book: ${book.getTitle()}`);
            });

            giveBarrowedBooksToTheReader(books);
            await Promise.all(promises);
        } else {
            console.log(`User doesn't have permission`)
        }
    }
}

const giveBarrowedBooksToTheReader = books => {
    // DO STUFF WITH THE BOOKS
    console.log(`Thank you. Here are your ${books.length} books`);
}

let booksData = [{
    "id": 3,
    "title": "Baba Yaga",
    "author": "Alexandre Afanassiev",
},
{
    "id": 32,
    "title": "La Petite Poucette",
    "author": "Hans Chistian Andersen",
},
{
    "id": 35,
    "title": "La Petite Sirene",
    "author": "Hans Chistian Andersen",
},
{
    "id": 67,
    "title": "Hansel et Gretel",
    "author": "Jacob et Wilhelm Grimm",
},
{
    "id": 75,
    "title": "La Petite gardeuse d'oies",
    "author": "Jacob et Wilhelm Grimm",
},
{
    "id": 101,
    "title": "La Barbe Bleue",
    "author": "Charles Perrault",
}]

const library = new Library();
let bookFile;

booksData.map((book) => {
    bookFile = new Book(book.id, book.title, book.author);
    library.addBook(bookFile);
})

const bookC = library._books.find((book) => book._id === 35);
const bookF = library._books.find((book) => book._id === 3);
const bookD = library._books.find((book) => book._id === 67);

bookC.setEvaluation(5);
bookC.setEvaluation(4);
bookC.setEvaluation(5);
library.removeBook(101);

console.log(bookC.getGlobalEvaluation()); // expected output: 4.666
console.log(library.searchBooks("Petite")); // expected output: [bookB, bookC, bookE]
console.log(library.searchBooks("Petite", "Sirene")); // expected output: [bookC]

const reader = {hasValidSubscription() {return true;}};

library.barrowBook([bookD, bookF], reader)
