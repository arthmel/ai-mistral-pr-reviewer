import {describe, expect, test} from '@jest/globals'
import {TokenLimits} from '../src/limits'
import {flattenContent} from '../src/content'

describe('TokenLimits', () => {
  test('glm models get a large window and reasoning headroom', () => {
    const l = new TokenLimits('zai-glm-5-3')
    expect(l.maxTokens).toBe(200000)
    expect(l.responseTokens).toBe(48000)
  })
  test('direct Z.ai glm names get the same window', () => {
    for (const m of ['glm-5.3', 'glm-5.1', 'glm-4.7']) {
      const l = new TokenLimits(m)
      expect(l.maxTokens).toBe(200000)
      expect(l.responseTokens).toBe(48000)
    }
    expect(new TokenLimits('glmx').maxTokens).toBe(4000)
  })
  test('current mistral models and -latest aliases get a large window', () => {
    for (const m of [
      'mistral-small-latest',
      'mistral-medium-2604',
      'ministral-8b-latest'
    ]) {
      expect(new TokenLimits(m).maxTokens).toBe(100000)
    }
  })
  test('legacy names and unknown models are unchanged', () => {
    expect(new TokenLimits('mistral-small').maxTokens).toBe(32000)
    expect(new TokenLimits('gpt-4').maxTokens).toBe(8000)
    expect(new TokenLimits('something-else').maxTokens).toBe(4000)
  })
})

describe('flattenContent', () => {
  test('keeps strings', () => {
    expect(flattenContent('hi')).toBe('hi')
  })
  test('drops thinking chunks and joins text chunks', () => {
    expect(
      flattenContent([
        {type: 'thinking', thinking: [{type: 'text', text: 'secret'}]},
        {type: 'text', text: 'Hello '},
        {type: 'text', text: 'world'}
      ])
    ).toBe('Hello world')
  })
})
