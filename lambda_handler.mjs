import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({ region: 'us-west-2' });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// Define the name of the DDB table to perform the CRUD operations on
const tableName = 'ssdp4300-a03-apigateway-lambda-table';

export const handler = async (event, context) => {
  // If no operation is specified, default to getting all todos
  if (!event.operation) {
    try {
      const response = await ddbDocClient.send(
        new ScanCommand({
          TableName: tableName,
        })
      );
      return response.Items || [];
    } catch (error) {
      console.error('Error scanning table:', error);
      throw error;
    }
  }

  // Handle specific CRUD operations
  const operation = event.operation;

  if (operation === 'echo') {
    return event.payload;
  } else {
    if (!event.payload) {
      throw new Error('Payload is required for CRUD operations');
    }

    event.payload.TableName = tableName;
    let response;

    try {
      switch (operation) {
        case 'create':
          response = await ddbDocClient.send(new PutCommand(event.payload));
          break;
        case 'read':
          response = await ddbDocClient.send(new GetCommand(event.payload));
          break;
        case 'update':
          response = await ddbDocClient.send(new UpdateCommand(event.payload));
          break;
        case 'delete':
          response = await ddbDocClient.send(new DeleteCommand(event.payload));
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
      console.log('Operation response:', response);
      return response;
    } catch (error) {
      console.error(`Error performing ${operation} operation:`, error);
      throw error;
    }
  }
};
