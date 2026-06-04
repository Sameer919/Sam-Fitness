/**
 * Zod request validation middleware factory.
 * Usage: validate({ body: myZodSchema })
 */
export function validate({ body, query, params } = {}) {
  return (req, res, next) => {
    try {
      if (body)   req.body   = body.parse(req.body)
      if (query)  req.query  = query.parse(req.query)
      if (params) req.params = params.parse(req.params)
      next()
    } catch (err) {
      const issues = err.errors?.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: issues,
      })
    }
  }
}
