import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PrivateExampleStatelessStack } from '@infra/lib/private-example/stateless/private-example-stateless.stack';
import { IVpc, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { PrivateExampleStatefulStack } from '../../stateful/private-example-stateful.stack';

const env = {
	domain: 'mydomain',
	environment: 'fdv',
	mongoAtlasOrgId: 'org-abc123',
	projectName: 'atlas-example',
	region: 'eu-west-1',
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

export const processTemplate = (template: Template) => {
	return JSON.parse(
		JSON.stringify(template, null, 4).replace(
			/"S3Key":\s".+?\..+?"/gi,
			'"S3Key": "Any<String>"'
		)
	);
};

describe('All atlas-example stacks created and has correct properties', () => {
	test('Private Stateless Stack', () => {
		const app = new App();

		const statefulStack = new PrivateExampleStatefulStack(
			app,
			'PrivateStateful'
		);

		const stack = new PrivateExampleStatelessStack(
			app,
			'PrivateStatelessStack',
			{
				atlasVpc: statefulStack.applicationVpc,
				atlasSecurityGroupId: 'sg-1234',
			}
		);

		expect(processTemplate(Template.fromStack(stack))).toMatchSnapshot();
	});
});
