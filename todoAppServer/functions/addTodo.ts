import * as AWS from "aws-sdk";
import { randomBytes } from "crypto";

const docClient = new AWS.DynamoDB.DocumentClient();

export const addTodo = async (todo: any) => {
  const params = {
    TableName: process.env.TABLE_NAME!,
    Item: {
      id: randomBytes(32).toString('hex'),
      title: todo.title,
      done: false,
      userToken: todo.userToken
    },
  };

  try {
    await docClient.put(params).promise();
    return params.Item;
  } catch (e) {
    console.log(e);
    return null;
  }
};
