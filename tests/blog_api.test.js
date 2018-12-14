const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb/*, format, nonExistingId*/  } = require('./test_helper')

describe('when there is initially some blogs saved', async () => {

  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    await Promise.all(blogObjects.map(blog => blog.save()))
  })

  test('blogs are returned as json by GET /api/blogs', async () => {

    const blogsInDatabase = await blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)

    const returnedTitle = response.body.map(n => n.title)
    blogsInDatabase.forEach(blog => {
      expect(returnedTitle).toContain(blog.title)
    })
  })
  /*
  test('there are five blogs', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length)
  })

  test('the first blog is about React patterns', async () => {
    const response = await api
      .get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(titles).toContain('React patterns')
  })
  */
  test('blog without title is not added ', async () => {
    const newBlog = {
      author: 'Teemu Testaaja',
      url: 'https://io-tech.fi',
      likes: 4
    }

    const blogsBeforeOperation = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsBeforeOperation.length)
  })


  test('blog without url is not added ', async () => {
    const newBlog = {
      title: 'Testaaminen ilman urlia',
      author: 'Teemu Testaaja',
      likes: 4
    }


    const blogsBeforeOperation = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsBeforeOperation.length)
  })


  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'Testaaminen ehjällä blogilla',
      author: 'Teemu Testaaja',
      url: 'https://io-tech.fi',
      likes: 4
    }

    const blogsBeforeOperation = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterOperation = await blogsInDb()

    const titles= blogsAfterOperation.map(r => r.title)

    expect(blogsAfterOperation.length).toBe(blogsBeforeOperation.length + 1)
    expect(titles).toContain(newBlog.title)
  })


  test('a blog without likes info gets zero likes', async () => {
    const newBlog = {
      title: 'Testaaminen kun tykkäykset puuttuu',
      author: 'Teemu Testaaja',
      url: 'https://io-tech.fi'
    }

    const blogsBeforeOperation = await blogsInDb()

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
    const blogsAfterOperation = await blogsInDb()
    const titles= blogsAfterOperation.map(r => r.title)

    expect(blogsAfterOperation.length).toBe(blogsBeforeOperation.length + 1)
    expect(titles).toContain(newBlog.title)
  })


  test('a blog can be deleted', async () => {
    const newBlog = {
      title: 'Poista minut',
      author: 'Teemu Testaaja',
      url: 'https://io-tech.fi',
      likes: 4000
    }

    const addedBlog = await api
      .post('/api/blogs')
      .send(newBlog)

    const blogsBeforeOperation = await blogsInDb()

    await api
      .delete(`/api/blogs/${addedBlog.body.id}`)
      .expect(204)

    const blogsAfterOperation = await blogsInDb()

    const titles = blogsAfterOperation.map(r => r.title)

    expect(titles).not.toContain(newBlog.title)
    expect(blogsAfterOperation.length).toBe(blogsBeforeOperation.length - 1)
  })

  afterAll(() => {
    server.close()
  })
})