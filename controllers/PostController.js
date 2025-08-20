const Post = require("../models/Post");
const sessionValidation = require("../public/utilities/post-validation");

function getHome(req, res) {
  res.render("welcome");
}

async function getAdminPage(req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }

  // const posts = await db.getDb().collection('posts').find().toArray();
  const posts = await Post.fetchAll();

  const sessionInputData = sessionValidation.getSessionErrorData(req, {
    title: "",
    content: ""
  });

  res.render("admin", {
    posts: posts,
    inputData: sessionInputData,
  });
}

async function createPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (!sessionValidation.validateInput(enteredTitle, enteredContent)) {
    sessionValidation.flashErrorMessage(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
      },
      function () {
        res.redirect("/admin");
      }
    );

    return;
  }

  const post = new Post(enteredTitle, enteredContent);
  await post.save();

  res.redirect("/admin");
}

async function getPostById(req, res, next) {
  // const postId = new ObjectId(req.params.id);
  // const post = await db.getDb().collection('posts').findOne({ _id: postId });
  try{
    const post = new Post(null, null, req.params.id);
  }catch(error){
    next(error);
    return;
  }
  const postData = await post.fetchById();
  console.log(postData);
  if (!postData) {
    return res.render("404"); // 404.ejs is missing at this point - it will be added later!
  }

  const sessionInputData = sessionValidation.getSessionErrorData(req, {
    title: postData.title,
    content: postData.content,
  });

  res.render("single-post", {
    post: postData,
    inputData: sessionInputData,
  });
}

async function updatePost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;
  // const postId = new ObjectId(req.params.id);

  if (!sessionValidation.validateInput(enteredTitle, enteredContent)) {
    sessionValidation.flashErrorMessage(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
      },
      function () {
        res.redirect(`/posts/${req.params.id}/edit`);
      }
    );

    return;
  }

  const post = new Post(enteredTitle, enteredContent, req.params.id);
  await post.update();

  res.redirect("/admin");
}

async function deletePost(req, res) {
  // const postId = new ObjectId(req.params.id);
  // await db.getDb().collection('posts').deleteOne({ _id: postId });

  const post = new Post(null, null, req.params.id);
  await post.delete();

  res.redirect("/admin");
}

module.exports = {
  getHome: getHome,
  getAdminPage: getAdminPage,
  createPost: createPost,
  getPostById: getPostById,
  updatePost: updatePost,
  deletePost: deletePost,
};
