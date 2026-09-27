import { afterEach, describe, expect, it } from 'vitest';
import { getEnvSources } from './env-sources';

const original = process.env.DEFAULT_SOURCES;

afterEach(() => {
  if (original === undefined) delete process.env.DEFAULT_SOURCES;
  else process.env.DEFAULT_SOURCES = original;
});

describe('getEnvSources', () => {
  it('keeps explicit env keys stable when earlier sources are removed', () => {
    process.env.DEFAULT_SOURCES = JSON.stringify([
      { key: 'env_0', name: '电影天堂资源', url: 'http://caiji.dyttzyapi.com/api.php/provide/vod' },
      { key: 'env_2', name: '暴风资源', url: 'https://bfzyapi.com/api.php/provide/vod' },
    ]);
    expect(getEnvSources().map((source) => source.key)).toEqual(['env_0', 'env_2']);
  });
});

