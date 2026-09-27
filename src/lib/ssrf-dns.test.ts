import dns from 'node:dns/promises';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { isBlockedByDNS } from './ssrf';

afterEach(() => vi.restoreAllMocks());
describe('Workers-compatible DNS checks', () => {
  it('blocks a private IPv4 even when IPv6 has no records', async () => {
    vi.spyOn(dns, 'resolve4').mockResolvedValue(['10.0.0.1'] as never);
    vi.spyOn(dns, 'resolve6').mockRejectedValue(new Error('ENODATA'));
    expect(await isBlockedByDNS('https://example.com/path')).toBe(true);
  });
  it('blocks a private IPv6 even when IPv4 is public', async () => {
    vi.spyOn(dns, 'resolve4').mockResolvedValue(['8.8.8.8'] as never);
    vi.spyOn(dns, 'resolve6').mockResolvedValue(['fd00::1'] as never);
    expect(await isBlockedByDNS('https://example.com/path')).toBe(true);
  });
  it('allows public addresses without calling unsupported lookup', async () => {
    const lookup = vi.spyOn(dns, 'lookup').mockRejectedValue(new Error('Not implemented'));
    vi.spyOn(dns, 'resolve4').mockResolvedValue(['8.8.8.8'] as never);
    vi.spyOn(dns, 'resolve6').mockResolvedValue(['2606:4700::1111'] as never);
    expect(await isBlockedByDNS('https://example.com/path')).toBe(false);
    expect(lookup).not.toHaveBeenCalled();
  });
});

