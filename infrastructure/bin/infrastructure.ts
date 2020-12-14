#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { App } from '@aws-cdk/core';

const config = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
};

const app: App = new cdk.App();
new InfrastructureStack(app, 'InfrastructureStack', config);
