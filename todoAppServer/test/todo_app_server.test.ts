import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as TodoAppServer from '../lib/todo_app_server-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TodoAppServer.TodoAppServerStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
