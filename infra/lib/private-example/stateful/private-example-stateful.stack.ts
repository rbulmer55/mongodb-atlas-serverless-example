import { config } from '@infra/config';
import * as cdk from 'aws-cdk-lib';
import {
	Peer,
	Port,
	SecurityGroup,
	SubnetType,
	Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { PrivateAtlasServerless } from '../constructs/atlas-serverless-private.construct';

export class PrivateExampleStatefulStack extends cdk.Stack {
	public readonly applicationVpc;
	public readonly atlasSecurityGroupId;
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const applicationVpc = new Vpc(this, 'AppVpc', {
			natGateways: 0,
			maxAzs: 1, // increase as necessary for HA
			cidr: '10.0.0.0/16',
			subnetConfiguration: [
				{
					cidrMask: 24,
					name: `${config.environment}-${config.domain}-${config.projectName}-pvt-app`,
					subnetType: SubnetType.PRIVATE_ISOLATED,
				},
			],
		});
		this.applicationVpc = applicationVpc;

		/**
		 * Default security needs to be used see construct for details
		 */
		const defualtSg = SecurityGroup.fromSecurityGroupId(
			this,
			'sg-default',
			applicationVpc.vpcDefaultSecurityGroup
		);
		defualtSg.addEgressRule(Peer.anyIpv4(), Port.allTraffic());
		defualtSg.addIngressRule(
			Peer.ipv4(applicationVpc.vpcCidrBlock),
			Port.allTraffic()
		);

		this.atlasSecurityGroupId = defualtSg.securityGroupId;

		new PrivateAtlasServerless(this, 'prvAtlasServerless', {
			atlas: {
				orgId: config.mongoAtlasOrgId,
				vpc: applicationVpc,
			},
		});
	}
}
