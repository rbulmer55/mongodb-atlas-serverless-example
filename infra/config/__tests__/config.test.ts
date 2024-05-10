import { config } from '@infra/config';

test('throws an error when region is not set', () => {
	expect(config.region).toBe('');
});
