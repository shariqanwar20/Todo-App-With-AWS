import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as lambda from "@aws-cdk/aws-lambda";
import * as ddb from "@aws-cdk/aws-dynamodb";

export class TodoAppServerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const todoApi = new appsync.GraphqlApi(this, "TodoAppGraphQlApi", {
      name: "GraphqlApiForTodoApp",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
    });

    const todoLambdaFn = new lambda.Function(this, "TodoLambdaFunction", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("functions"),
      handler: "main.handler",
      timeout: cdk.Duration.seconds(10),
    });

    const todoTable = new ddb.Table(this, "TodoTable", {
      tableName: "TodoTable",
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });
    todoTable.grantFullAccess(todoLambdaFn);
    todoLambdaFn.addEnvironment("TABLE_NAME", todoTable.tableName);

    const lambdaDataSource = todoApi.addLambdaDataSource(
      "LambdaDataSource",
      todoLambdaFn
    );

    lambdaDataSource.createResolver({
      typeName: "Query",
      fieldName: "getTodos",
    });

    lambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "addTodo",
    });

    lambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "updateTodo",
    });

    lambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteTodo",
    });

    new cdk.CfnOutput(this, "GraphqlUrl", {
      value: todoApi.graphqlUrl,
    });

    new cdk.CfnOutput(this, "GraphqlApiKey", {
      value: todoApi.apiKey!,
    });

    new cdk.CfnOutput(this, "StackRegion", {
      value: this.region,
    });
  }
}
