import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function getRedis() {
  return new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
}

export const signInRateLimit = new Ratelimit({
  redis:   getRedis(),
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: false,
  prefix: 'rl:signin',
})

export const checkoutRateLimit = new Ratelimit({
  redis:   getRedis(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: false,
  prefix: 'rl:checkout',
})
