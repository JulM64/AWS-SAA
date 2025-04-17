import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class EcoCollecteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Table DynamoDB
    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Bucket S3
    const uploadsBucket = new s3.Bucket(this, 'EcoUploads', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Cognito
    const userPool = new cognito.UserPool(this, 'EcoUserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'EcoUserPoolClient', {
      userPool,
    });

    // Lambda
    const backendFn = new lambda.Function(this, 'BackendFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      environment: {
        TABLE_NAME: usersTable.tableName,
      },
    });

    usersTable.grantReadWriteData(backendFn);

    // API Gateway
    const api = new apigateway.LambdaRestApi(this, 'EcoApi', {
      handler: backendFn,
    });

    new cdk.CfnOutput(this, 'API URL', { value: api.url });
    new cdk.CfnOutput(this, 'Bucket Name', { value: uploadsBucket.bucketName });
    new cdk.CfnOutput(this, 'User Pool Id', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'User Pool Client Id', { value: userPoolClient.userPoolClientId });
  }
}

//import * as cdk from 'aws-cdk-lib';
//import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

//export class EcoCollecteStack extends cdk.Stack {
 // constructor(scope: Construct, id: string, props?: cdk.StackProps) {
   // super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'EcoCollecteQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
//  }
//}
