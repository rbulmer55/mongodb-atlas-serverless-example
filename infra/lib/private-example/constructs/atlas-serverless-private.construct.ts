import { config, Environment } from '@infra/config';
import { StackProps } from 'aws-cdk-lib';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import {
	AtlasServerlessBasic,
	CfnServerlessPrivateEndpoint,
	ScopeDefinitionType,
	ServerlessInstanceProviderSettingsProviderName,
} from 'awscdk-resources-mongodbatlas';
import { Construct } from 'constructs';

interface AtlasStackProps {
	readonly profile: string;
	readonly region: string;
	readonly instanceName: string;
	readonly projectName: string;
	readonly continuousBackupEnabled: boolean;
	readonly terminationProtectionEnabled: boolean;
	readonly username: string;
}

interface CustomPrivateAtlasServerlessProps extends StackProps {
	atlas: {
		orgId: string;
		vpc: Vpc;
	};
}

export class PrivateAtlasServerless extends Construct {
	public readonly vpceId: string;
	constructor(
		scope: Construct,
		id: string,
		props: CustomPrivateAtlasServerlessProps
	) {
		super(scope, id);

		const atlasProps = this.getContextProps();

		const atlas = new AtlasServerlessBasic(this, 'PrivateAtlasSlsInstance', {
			serverlessProps: {
				name: atlasProps.instanceName,
				profile: atlasProps.profile,
				continuousBackupEnabled: atlasProps.continuousBackupEnabled,
				providerSettings: {
					providerName:
						ServerlessInstanceProviderSettingsProviderName.SERVERLESS,
					regionName: atlasProps.region,
				},
				terminationProtectionEnabled: atlasProps.terminationProtectionEnabled,
			},
			projectProps: {
				name: atlasProps.projectName,
				orgId: props.atlas.orgId,
			},
			dbUserProps: {
				username: atlasProps.username,
				scopes: [
					{ name: atlasProps.instanceName, type: ScopeDefinitionType.CLUSTER },
				],
			},
			ipAccessListProps: {
				accessList: [{ cidrBlock: props.atlas.vpc.vpcCidrBlock }],
			},
			profile: atlasProps.profile,
		});

		/**
		 * MAY/24 - RB
		 * Notes:
		 *
		 * Issues with the Security Group - Must use the default security group with PrivateLink and Atlas Serverless (See Below).
		 *
		 * CfnPrivateEndpointService - This Atlas CloudFormation resource does not support a serverless instance
		 *
		 * CfnServerlessPrivateEndpoint - This resource does not allow you to change the security group for the generated VPCE.
		 * 								If using just to create the EndpointService, you are unable to get the EndpointServiceId OR VPCE Id to add a security group in CDK.
		 *
		 * CfnPrivateEndpointAws - This resource would be used to link up the Atlas EndpointService and the VPCE, however as we can't get the EndpointService Id yet we can't use this.
		 */
		const cfnPrivateEndpoint = new CfnServerlessPrivateEndpoint(
			this,
			'AtlasSlsPrivateEndpoint',
			{
				profile: atlasProps.profile,
				instanceName: atlasProps.instanceName,
				projectId: atlas.mProject.attrId,
				createAndAssignAwsPrivateEndpoint: true,
				awsPrivateEndpointConfigurationProperties: {
					vpcId: props.atlas.vpc.vpcId,
					subnetIds: props.atlas.vpc.selectSubnets({
						subnetType: SubnetType.PRIVATE_ISOLATED,
					}).subnetIds,
					region: atlasProps.region,
				},
			}
		);
		cfnPrivateEndpoint.addDependency(atlas.mserverless);
	}

	private getContextProps(): AtlasStackProps {
		const profile = config.environment;
		const region = config.region.toUpperCase().replace(/-/gi, '_');
		const instanceName = `${config.environment}-${config.domain}-${config.projectName}`;
		const projectName = `${config.environment}-${config.domain}-${config.projectName}`;
		const username = `${config.environment}-${config.domain}-${config.projectName}-user`;
		const terminationProtectionEnabled =
			config.environment === Environment.Prd ? true : false;
		const continuousBackupEnabled =
			config.environment === Environment.Prd ? true : false;

		return {
			terminationProtectionEnabled,
			continuousBackupEnabled,
			profile,
			region,
			instanceName,
			projectName,
			username,
		};
	}
}
