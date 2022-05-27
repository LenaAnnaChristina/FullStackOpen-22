const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const helper = require("./test_helper")
const config = require("../utils/config")
const Blog = require("../models/blog")
const User = require("../models/user")

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe("when there are initially some blogs saved", () => {

  test("correct amount of blogs are returned in json format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("unique identifier property has to be named id instead of _id", async () => {
    const response = await api.get("/api/blogs")

    const ids = response.body.map((blog) => blog.id)

    for (const id of ids) {
      expect(id).toBeDefined()
    }
  })
})

describe("addition of a new blog", () => {
  let token = null
  beforeAll(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("1x1x1x1x", 10)
    const user = await new User({ username: "username", passwordHash }).save()

    const userForToken = { username: "username", id: user.id }
    return (token = jwt.sign(userForToken, config.SECRET))
  })

  test("the HTTP POST request successfully creates a new blog post", async () => {
    const newBlog = {
      title: "New blog",
      author: "MeMyselfAndI",
      url: "http://www.example.com",
      likes: 5,
    }

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  })

  test("missing likes property = default 0", async () => {
    const newBlog = {
      title: "Hello World",
      author: "MyselfAndMe2",
      url: "http://www.example.com",
    }

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
  })

  test("fails with status 400 due to missing title and url", async () => {
    const newBlog = {
      likes: 1,
    }

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe("deletion of blog post", () => {
  let token = null
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("x1x1x1x", 10)
    const user = await new User({ username: "username", passwordHash }).save()

    const userForToken = { username: "username", id: user.id }
    token = jwt.sign(userForToken, config.SECRET)

    const newBlog = {
      title: "Another Blog",
      author: "Another Me2",
      url: "http://www.example.com",
    }

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    return token
  })

  test("deletion succeeds with status code 204 with valid ID", async () => {
    const blogsAtStart = await Blog.find({}).populate("user")
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).not.toContain(blogToDelete.id)
  })

  test("deletion fails with status code 401 if user is not authorized", async () => {
    const blogsAtStart = await Blog.find({}).populate("user")
    const blogToDelete = blogsAtStart[0]

    token = null

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(401)

    const blogsAtEnd = await Blog.find({}).populate("user")

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(blogsAtStart).toEqual(blogsAtEnd)
  })
})

describe("updating a blog", () => {
  test("succeeds with status 200 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 10 })
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd[0]
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    expect(updatedBlog.likes).toBe(10)
  })
})

afterAll(() => {
  mongoose.connection.close()
})