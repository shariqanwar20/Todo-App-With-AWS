import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as lambda from "@aws-cdk/aws-lambda";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as cognito from '@aws-cdk/aws-cognito';

export class TodoAppServerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const userPool = new cognito.UserPool(this, "UserPoolForTodo", {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      userVerification: {
        emailSubject: "Hello, Welcome to my Todo Application",
        emailBody: 'Hello {username}, Thanks for signing up to our Todo app! Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        email: {
          required: true,
          mutable: false
        },
        fullname: {
          required: true,
          mutable: true
        }
      },
      passwordPolicy: {
        requireDigits: true,
        requireLowercase: true,
        requireSymbols: true,
        requireUppercase: true,
        minLength: 8
      }
    })

    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      generateSecret: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true
        },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
        callbackUrls: ["https://localhost:8000/todo"],
        logoutUrls: ["https://localhost:8000"]
      }
    })

    const domain = userPool.addDomain("TodoDomainName", {
      cognitoDomain: {
        domainPrefix: "todo-app-shariq"
      }
    })

    const signInUrl = domain.signInUrl(userPoolClient, {
      redirectUri: "https://localhost:8000/todo"
    })

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
