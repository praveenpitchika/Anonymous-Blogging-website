import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.port||3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//main page
app.get("/", (req, res) => {
  res.render("index.ejs");
});

//Getting All Blogs
app.get("/allBlogs", (req, res) => {
  res.render("blogsPage.ejs", { blogs: blogs });
});

//Createing a Blog
app.get("/writeBlog", (req, res) => {
  res.render("blogs.ejs");
});

// Viewing  the blog based on the index Number
app.get("/view-blog", (req, res) => {
  const blogIndex = parseInt(req.query.blogIndex, 10);

  // validating  the Index Number
  if (isNaN(blogIndex) || blogIndex < 0 || blogIndex >= blogs.length) {
    res.status(404).send("no Blog"); // Error 
  } else {
    const blog = blogs[blogIndex]; 

    const escapeHTML = (str) => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const escapedContent = escapeHTML(blog.content);

    const formattedContent = escapedContent.replace(/\n/g, "<br>");

   // sending response back to view blog
    res.render("viewBlog.ejs", {
      title: blog.title,
      author: blog.author,
      date: blog.date,
      content: formattedContent,
    });
  }
});

//saving the Created bLog
app.post("/blog", (req, res) => {
  const newBlog = {
    title: req.body["title"],
    author: req.body["author"],
    content: req.body["content"],
    date: `${date.toLocaleString("en", {
      month: "long",
    })} ${date.getDate()}, ${date.getFullYear()}`,
  };
  blogs.push(newBlog);
  res.render("blogsPage.ejs", { blogs: blogs });
});

//edit page
let blogEditIndex;
app.post("/editPage", (req, res) => {
  blogEditIndex = req.body["blogIndex"];
  const blogEdit = blogs.slice(blogEditIndex)[0];
  res.render("blogs.ejs", { blogEdit: blogEdit });
});

//Edit the specific blog
app.post("/editBlog", (req, res) => {
  const blogToEdit = blogs[blogEditIndex];
  blogToEdit.title = req.body["title"];
  blogToEdit.author = req.body["author"];
  blogToEdit.content = req.body["content"];
  res.render("blogsPage.ejs", { blogs: blogs });
});

//Deleting the blog
app.post("/delete-blog", (req, res) => {
  const blogIndex = req.body["blogIndex"];
  blogs.splice(blogIndex, 1);
  res.render("blogsPage.ejs", { blogs: blogs });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const date = new Date();

//Temparay Blog Cerating(Quotes)
const blogs = [];
blogs.push({
  title: "Inspirational Quotes by Elon Musk",
  author: "Elon Musk",
  content:
    "“When something is important enough, you do it even if the odds are not in your favor.”\n\n“I think it is possible for ordinary people to choose to be extraordinary.”\n\n“Persistence is very important. You should not give up unless you are forced to give up.”\n\n“Some people don't like change, but you need to embrace change if the alternative is disaster.”\n\n“Failure is an option here. If things are not failing, you are not innovating enough.”",
  date: `April 25, 2024`,
});

blogs.push({
  title: "Words of Wisdom from Ratan Tata",
  author: "Ratan Tata",
  content:
    "“None can destroy iron, but its own rust can! Likewise, none can destroy a person, but their own mindset can.”\n\n“Take the stones people throw at you and use them to build a monument.”\n\n“I don't believe in taking right decisions. I take decisions and then make them right.”\n\n“If you want to walk fast, walk alone. But if you want to walk far, walk together.”\n\n“The biggest risk is not taking any risk. In a world that is changing quickly, the only strategy that is guaranteed to fail is not taking risks.”",
  date: `April 26, 2024`,
});
