import { config } from '@infra/config';
import * as cdk from 'aws-cdk-lib';
import {
	IVpc,
	InterfaceVpcEndpoint,
	InterfaceVpcEndpointAwsService,
	SecurityGroup,
	SubnetType,
} from 'aws-cdk-lib/aws-ec2';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, SourceMapMode } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { join } from 'path';

interface AtlasStackProps extends cdk.StackProps {
	atlasVpc: IVpc;
	atlasSecurityGroupId: string;
}

export class PrivateExampleStatelessStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: AtlasStackProps) {
		super(scope, id, props);

		if (!props?.atlasVpc) {
			throw new Error('Application VPC not provided');
		}

		const atlasSecurityGroup = SecurityGroup.fromSecurityGroupId(
			this,
			'counterSecurityGroup',
			props.atlasSecurityGroupId
		);

		// allow the lambda to privately fetch secrets
		new InterfaceVpcEndpoint(this, 'SecretsManagerEndpoint', {
			vpc: props.atlasVpc,
			service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
			subnets: props.atlasVpc.selectSubnets({
				subnetType: SubnetType.PRIVATE_ISOLATED,
			}),
			securityGroups: [atlasSecurityGroup],
		});

		const incrementCounter = new NodejsFunction(
			this,
			'incrementCounterLambda',
			{
				entry: join('./src/adapters/primary/increment-counter.adapter.ts'),
				handler: 'incrementCounter',
				runtime: Runtime.NODEJS_18_X,
				architecture: Architecture.ARM_64,
				timeout: cdk.Duration.seconds(15),
				vpc: props.atlasVpc,
				vpcSubnets: props.atlasVpc.selectSubnets({
					subnetType: SubnetType.PRIVATE_ISOLATED,
				}),
				securityGroups: [atlasSecurityGroup],
				bundling: {
					minify: true,
					sourceMap: true,
					sourceMapMode: SourceMapMode.INLINE,
				},
				environment: {
					COUNTER_DB_CONNECTION_SECRET: `db/atlas/${config.environment}/${config.projectName}`,
				},
				logRetention: RetentionDays.THREE_MONTHS,
			}
		);

		const counterDbSecret = new Secret(this, 'db-connection-secret', {
			secretName: `db/atlas/${config.environment}/${config.projectName}`,
			secretObjectValue: {
				dbConnectionString: cdk.SecretValue.unsafePlainText('REPLACE_ME'),
			},
		});

		counterDbSecret.grantRead(incrementCounter);
	}
}
