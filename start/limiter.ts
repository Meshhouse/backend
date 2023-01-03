/*
|--------------------------------------------------------------------------
| Define HTTP rate limiters
|--------------------------------------------------------------------------
|
| The "Limiter.define" method callback receives an instance of the HTTP
| context you can use to customize the allowed requests and duration
| based upon the user of the request.
|
*/

import { Limiter } from '@adonisjs/limiter/build/services'

export const { httpLimiters } = Limiter
  .define('api', ({ auth }) => {
    if (auth.user) {
      const tokenObj = auth.use('api').token
      const limitPerHour = tokenObj?.meta.limit_per_hour

      if (Number(limitPerHour) === 0) {
        return Limiter
          .noLimit()
      }

      return Limiter
        .allowRequests(limitPerHour)
        .every('1 hour')
        .blockFor('1 hour')
        .usingKey(auth.user.id.toString())
    }

    return Limiter
      .allowRequests(10)
      .every('1 min')
  })
