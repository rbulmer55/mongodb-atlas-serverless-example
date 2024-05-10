export const secretsManagerSend = jest
	.fn()
	.mockReturnValue(Promise.resolve({}));

export class SecretsManagerClient {
	send = secretsManagerSend;
}

export const SecretsManager = {
	SecretsManagerClient,
};
