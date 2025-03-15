const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// API Gateway Endpoint
<<<<<<< HEAD
const API_GATEWAY_URL = 'https://z55rzwz8q7.execute-api.us-west-2.amazonaws.com/prod/ssdp4300-a03-db-manager';
=======
const API_GATEWAY_URL = process.env.API_GATEWAY_URL;
>>>>>>> d27c879 (all requirements met)

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    console.log('Fetching todos from API Gateway...');
    const response = await axios.get(`${API_GATEWAY_URL}`);

    // Check if the response contains an error from Lambda
    if (response.data && response.data.errorType) {
      console.error('Lambda Error:', response.data);
      throw new Error(response.data.errorMessage || 'Lambda function error');
    }

    // Ensure we have an array of todos
    const todos = Array.isArray(response.data) ? response.data : [];
    console.log('API Gateway Response:', todos);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error.message);
    if (error.response) {
      console.error('API Gateway Response:', error.response.data);
      console.error('Status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to fetch todos', details: error.message });
  }
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Todo text is required' });
    }

    const todo = {
      id: uuidv4(),
      text: text,
    };

    // Format the request for Lambda
    const lambdaPayload = {
      operation: 'create',
      payload: {
        Item: todo,
      },
    };

    await axios.post(`${API_GATEWAY_URL}`, lambdaPayload);
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error adding todo:', error);
    if (error.response) {
      console.error('Lambda Response:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to add todo', details: error.message });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

<<<<<<< HEAD
    // Format the request for Lambda
    const lambdaPayload = {
      operation: 'delete',
      payload: {
        Id: id,
      },
    };

    await axios.delete(`${API_GATEWAY_URL}`, lambdaPayload);
=======
    const lambdaPayload = {
      operation: 'delete',
      payload: {
        TableName: '',
        Key: {
          id: id,
        },
      },
    };

    await axios.post(`${API_GATEWAY_URL}`, lambdaPayload);
>>>>>>> d27c879 (all requirements met)
    res.status(204).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Update a todo
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    console.log('Updating todo:', id, text);

    if (!text) {
      return res.status(400).json({ error: 'Todo text is required' });
    }

<<<<<<< HEAD
    // Format the request for Lambda
    const lambdaPayload = {
      operation: 'update',
      payload: {
        Id: id,
        Text: text,
      },
    };

    const response = await axios.put(`${API_GATEWAY_URL}`, lambdaPayload);
    res.status(200).json(response.data);
=======
    const lambdaPayload = {
      operation: 'update',
      payload: {
        TableName: '',
        Key: {
          id: id,
        },
        UpdateExpression: 'SET #text = :text',
        ExpressionAttributeNames: {
          '#text': 'text',
        },
        ExpressionAttributeValues: {
          ':text': text,
        },
      },
    };

    await axios.post(`${API_GATEWAY_URL}`, lambdaPayload);
    res.status(204).json({ message: 'Todo updated successfully' });
>>>>>>> d27c879 (all requirements met)
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Serve the main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/help', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'help.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
