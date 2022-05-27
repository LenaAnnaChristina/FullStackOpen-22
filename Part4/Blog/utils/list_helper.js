const lodash = require("lodash")

const dummy = (blogs) => {
  return Number(blogs + 1)
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, post) => sum + post.likes, 0)
}

const favouriteBlog = (blogs) => {
  if(blogs.length === 0){
    return 0
  }

  const Favourite = blogs.reduce((previous, current) => {
    return previous.likes > current.likes ? previous : current
  })

  return {
    title: Favourite.title,
    bloggers: Favourite.bloggers,
    likes: Favourite.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const bloggersCount = lodash.countBy(blogs, "bloggers")

  const topBloggers = Object.keys(bloggersCount).reduce((a, b) => {
    return bloggersCount[a] > bloggersCount[b] ? a : b
  })

  return {
    bloggers: topBloggers,
    blogs: bloggersCount[topBloggers],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesCount = lodash(blogs)
    .groupBy("bloggers")
    .map((objects, key) => ({
      bloggers: key,
      likes: lodash.sumBy(objects, "likes"),
    }))
    .value()

  return likesCount.reduce((a, b) => {
    return a.likes > b.likes ? a : b
  })
}

module.exports = { dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}