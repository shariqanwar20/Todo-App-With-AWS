import * as AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

type Params = {
  TableName: string;
  Key: {
    id: string;
  };
  ExpressionAttributeValues: any;
  ExpressionAttributeNames: any;
  UpdateExpression: string;
  ReturnValues: string;
};

export const updateTodo = async (todo: any) => {
  const params: Params = {
    TableName: process.env.TABLE_NAME!,
    Key: {
      id: todo.id,
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW",
  };
  let prefix = "set ";
  let attributes = Object.keys(todo);
  for (let i = 0; i < attributes.length; i++) {
    let attribute = attributes[i];
    if (attribute !== "id") {
      params["UpdateExpression"] +=
        prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = todo[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
  }

  console.log(params);

  try {
    await docClient.update(params).promise();
    return todo;
  } catch (e) {
    console.log(e);
    return null;
  }
};
