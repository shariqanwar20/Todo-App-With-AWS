import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();

export const getTodo = async () => {
  const params = {
    TableName: process.env.TABLE_NAME!,
  };

  try {
    const data = await docClient.scan(params).promise();
    return data.Items;
  } catch (e) {
    console.log(e);
    return null;
  }
};
