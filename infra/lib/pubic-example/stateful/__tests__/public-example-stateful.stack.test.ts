import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PublicExampleStatefulStack } from '@infra/lib/pubic-example/stateful/public-example-stateful.stack';

const env = {
	domain: 'mydomain',
	environment: 'fdv',
	mongoAtlasOrgId: 'org-abc123',
	projectName: 'atlas-example',
	region: 'eu-west-1',
};

export const processTemplate = (template: Template) => {
	return JSON.parse(
		JSON.stringify(template, null, 4).replace(
			/"S3Key":\s".+?\..+?"/gi,
			'"S3Key": "Any<String>"'
		)
	);
};

beforeEach(() => {
	jest.resetModules();
	process.env = {
		REGION: env.region,
		ENVIRONMENT: env.environment,
		DOMAIN_NAME: env.domain,
		PROJECT_NAME: env.projectName,
		MONGO_ORG_ID: env.mongoAtlasOrgId,
	};
});
describe('All atlas-example stacks created and has correct properties', () => {
	test('Public Stateful Stack', () => {
		const app = new App();
		const stack = new PublicExampleStatefulStack(app, 'PublicStack');

		expect(processTemplate(Template.fromStack(stack))).toMatchSnapshot();
	});
});
