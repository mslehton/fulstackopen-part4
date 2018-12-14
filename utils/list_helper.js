const dummy = () => {
  return 1
}

const totalLikes = (blogs) => (
  blogs.reduce((acc, cur) => acc + cur.likes,0)
)

const maxLike = (blogs) => (
  blogs.reduce((bestIndexSoFar, currentlyTestedValue, currentlyTestedIndex, blogs) => currentlyTestedValue.likes > blogs[bestIndexSoFar].likes ? currentlyTestedIndex : bestIndexSoFar, 0)
)

const favoriteBlog = (blogs) => (
  blogs[maxLike(blogs)]
)

module.exports = {
  dummy,totalLikes,favoriteBlog
}