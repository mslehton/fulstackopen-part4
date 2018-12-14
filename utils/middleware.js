const logger = (request, response, next) => {
  if ( process.env.NODE_ENV === 'test' ) {
    return next()
  }
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const getTokenFrom = (request) => {
  try {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
  }
  catch(exception) {
    console.log(exception)
  }
  return null
}

const tokenExtractor = (request) => {
  console.log('getting token')
  const token = getTokenFrom(request)
  console.log('token=',token)
  if(token !== null && token !== undefined && request!=null && request!==undefined) {
    request.token = token
    console.log('saved token',request.token)
  }
  
}

module.exports = {
  logger,
  error,
  tokenExtractor
}