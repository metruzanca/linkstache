import { describe, it, expect } from 'vitest'
import { groupByDate } from '../../src/lib/util'

const day = 1000 * 60 * 60 * 24

describe('groupByDate', () => {
  it('should work', () => {

    const today = new Date().getTime()

    const result = groupByDate([
      { createdAt: today + day },
      { createdAt: today + day },
      { createdAt: today },
      { createdAt: today },
    ])

    const todayDate = new Date(today).toLocaleDateString()
    const tomorrowDate = new Date(today + day).toLocaleDateString()

    expect(result).toEqual({
      [todayDate]: [
        { createdAt: today },
        { createdAt: today },
      ],
      [tomorrowDate]: [
        { createdAt: today + day },
        { createdAt: today + day },
      ],
    })
  })
})
