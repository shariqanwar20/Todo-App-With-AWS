#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TodoAppServerStack } from '../lib/todo_app_server-stack';

const app = new cdk.App();
new TodoAppServerStack(app, 'TodoAppServerStack');
