import * as AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

export const deleteTodo = async (todoId: String) => {
  const params = {
    TableName: process.env.TABLE_NAME!,
    Key: {
      id: todoId,
    },
  };

  try {
    await docClient.delete(params).promise();
    return todoId;
  } catch (e) {
    console.log(e);
    return null;
  }
};
