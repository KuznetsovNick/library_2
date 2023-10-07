class Manager{
    fs = require("fs")
    books
    id
    constructor() {
        this.update_books()
        this.id = 0
        for(let i = 0; i < this.books.length; i++){
            if(this.books[i]["id"] >= this.id){
                this.id = this.books[i]["id"] + 1
            }
        }
    }

    update_books(){
        this.books = JSON.parse(this.fs.readFileSync('library.json', 'utf8'));
    }
    write_to_file(){
        this.fs.writeFileSync("library.json", JSON.stringify(this.books),() => {})
    }

    add_to_library(body){
        this.update_books()
        body["id"] = this.id
        body["owner"] = null
        body["returnDate"] = null
        this.books.push(body)
        this.write_to_file()
        this.id++
    }

    delete_from_library(body){
        this.update_books()
        for(let i = 0; i < this.books.length; i++){
            if(this.books[i]["id"] == body["id"]){
                this.books.splice(i, 1)
            }
        }
        this.write_to_file()
    }

    send_library(){
        this.update_books()
        return JSON.stringify(this.books)
    }

    sort_stock(){
        this.update_books()
        let sorted = []
        for(let i = 0; i < this.books.length; i++){
            if(!this.books[i]["owner"]){
                sorted.push(this.books[i])
            }
        }
        return JSON.stringify(sorted)
    }

    sort_date(){
        this.update_books()
        this.books.sort(function(a, b){
            a = a.returnDate
            b = b.returnDate
            if(a == null){
                a = "-1"
            }
            if(b == null){
                b = "-1"
            }
            console.log(typeof a.returnDate)
            if(a < b) return 1
            return -1
        })
        return JSON.stringify(this.books)
    }

    issue_book(body){
        this.update_books()
        for(let i = 0; i < this.books.length; i++){
            if(this.books[i]["id"] == body["id"]){
                this.books[i]["owner"] = body["owner"]
                this.books[i]["returnDate"] = body["date"]
            }
        }
        this.write_to_file()
    }

    return_book(body){
        this.update_books()
        for(let i = 0; i < this.books.length; i++){
            if(this.books[i]["id"] == body["id"]){
                this.books[i]["owner"] = null
                this.books[i]["returnDate"] = null
            }
        }
        this.write_to_file()
    }

    redact_book(body){
        this.update_books()
        for(let i = 0; i < this.books.length; i++){
            if(this.books[i]["id"] == body["id"]){
                if(body["title"]) this.books[i]["title"] = body["title"]
                if(body["author"]) this.books[i]["author"] = body["author"]
                if(body["year"]) this.books[i]["year"] = body["year"]
            }
        }
        this.write_to_file()
    }
}

module.exports = Manager