class BlogCategory {
  constructor(){
    this.#category = {
      "0": "Computer and Technology",
      "1": "Finance and Industry",
      "2": "Game and Entertainment",
      "3": "New and Media Publisher",
      "4": "Science and Education"
    }
  }
  static getCategory(cateNum) {
    return this.#category[cateNum];
  }
}

module.exports = BlogCategory;