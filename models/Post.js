const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

const db = require('../data/database');

class Post {
  constructor(title, content, id) {
    this.title = title;
    this.content = content;
    // this.id = id;
    if(id){
        this.id = new ObjectId(id);
    }
  }

  static async fetchAll(){
    const posts = await db.getDb().collection('posts').find().toArray();
    return posts;
  }

  async fetchById(){
    if(!this.id){
        return; // or throw an error
    }
    const post = await db.getDb().collection('posts').findOne({ _id: this.id });
    // console.log(post);
    return post;
  }

  async save() {
    const newPost = {
      title: this.title,
      content: this.content,
    };

    await db.getDb().collection("posts").insertOne(newPost);
  }

  async update() {
    await db
        .getDb()
        .collection('posts')
        .updateOne(
          { _id: this.id },
          { $set: { title: this.title, content: this.content } }
        );
  }

  async delete(){
    if(!this.id){
        return; // or throw an error
    }
    await db.getDb().collection('posts').deleteOne({ _id: this.id });
  }
}

module.exports = Post;
