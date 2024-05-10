#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PublicExampleStatefulStack } from '@infra/lib/pubic-example/stateful/public-example-stateful.stack';
import { PublicExampleStatelessStack } from '@infra/lib/pubic-example/stateless/public-example-stateless.stack';
import { InitSetupStack } from '@infra/lib/init-setup/init-setup-stack';
import { PrivateExampleStatefulStack } from '@infra/lib/private-example/stateful/private-example-stateful.stack';
import { PrivateExampleStatelessStack } from '@infra/lib/private-example/stateless/private-example-stateless.stack';

const app = new cdk.App();

new InitSetupStack(app, `AtlasSetupStack`, {});

/**
 * Public Example
 *
 * Stateful: Atlas application vpc and atlas instance
 * Stateless: Lambda with a security group and Connection secret
 */
const publicStateful = new PublicExampleStatefulStack(
	app,
	'PublicExampleStatefulStack'
);
new PublicExampleStatelessStack(app, 'PublicExampleStatelessStack', {
	atlasVpc: publicStateful.applicationVpc,
});

/**
 * Private Example
 *
 * Stateful: Atlas application vpc and atlas instance with AWS PrivateLink
 * Stateless: Lambda with a security group, Secrets Manager AWS PrivateLink and Connection secret
 */
const privateStateful = new PrivateExampleStatefulStack(
	app,
	'PrivateExampleStatefulStack'
);
new PrivateExampleStatelessStack(app, 'PrivateExampleStatelessStack', {
	atlasVpc: privateStateful.applicationVpc,
	atlasSecurityGroupId: privateStateful.atlasSecurityGroupId,
});
