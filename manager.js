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
        this.fs.writeFile("library.json", JSON.stringify(this.books),() => {})
    }

    add_to_library(body){
        body["id"] = this.id
        body["owner"] = null
        body["returnDate"] = null
        this.books.push(body)
        this.write_to_file()
        this.id++
    }

    delete_from_library(body){
        this.update_books()
        let cur = this.books
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
}

module.exports = Manager