// Express.JS Setup
const express = require('express')
const path = require('path');
const app = express();
const port = 3000;

// MongoDB Setup
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bnoyes2:CS422_Group7@cs422.xaw8yts.mongodb.net/?retryWrites=true&w=majority&appName=CS422";
const { ObjectId } = require('mongodb'); // 这样引入ObjectId

// Create MongoDB Client Interface
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



// Set the view engine to ejs (template filesystem)
app.set('view engine', 'ejs');

// Define the views directory
app.set('views', path.join(__dirname, 'public/views'))

app.use(express.static(path.join(__dirname, "public")));

//Add middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let loggedInUser = null;
function forceLogin(res) {
  return res.redirect('/login');
}

// get all tasks
app.get('/tasks', async (req, res) => {
  // Verify that user is logged in.
  if (!loggedInUser) return forceLogin(res);

  await client.connect();
  const db = client.db('pawpal');
  const tasks = db.collection('tasks');
  const allTasks = await tasks.find({}).toArray();
  res.render('tasks', { user: loggedInUser, tasks: allTasks });
});

app.get('/api/tasks', async (req, res) => {
  await client.connect();
  const db = client.db('pawpal');
  const tasks = db.collection('tasks');
  const allTasks = await tasks.find({}).toArray();
  res.json(allTasks); // Send JSON data
});

app.post('/api/tasks/accept/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    await client.connect();
    const db = client.db('pawpal');
    const tasks = db.collection('tasks');

    const updateResult = await tasks.updateOne(
      { _id: new ObjectId(taskId) }, // This is because in the database, the _id field expects an Object Id instead of a regular string.
      { $set: { acceptance: true, AcceptedBy: loggedInUser.username } }
    );

    if (updateResult.matchedCount === 0) {
      res.status(404).json({ message:"Task not found"});
    } else {
      res.status(200).json({ message: "Task accepted" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error accepting task"});
  } finally {
    await client.close();
  }
});

app.post('/api/tasks/create/', async (req, res) => {
  let { title, description, urgency, duration, periodStart, periodEnd, taskDate } = req.body;
  try {
    await client.connect();
    const db = client.db('pawpal');
    const tasks = db.collection('tasks');

    let task = {
      title: title,
      description: description,
      urgency: urgency,
      PeriodStart: periodStart,
      PeriodEnd: periodEnd,
      duration: duration,
      acceptance: false,
      Start: false,
      Done: false,
      taskDate: taskDate
    }

    await tasks.insertOne(task);

    res.status(200).json({ message: "Task created" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error deleting task"});
  } finally {
    await client.close();
  }
});

app.post('/api/tasks/delete/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    await client.connect();
    const db = client.db('pawpal');
    const tasks = db.collection('tasks');

    await tasks.deleteOne({ _id: new ObjectId(taskId) });

    res.status(200).json({ message: "Task deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error deleting task"});
  } finally {
    await client.close();
  }
});

app.post('/api/tasks/cancel/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    await client.connect();
    const db = client.db('pawpal');
    const tasks = db.collection('tasks');

    const updateResult = await tasks.updateOne(
      { _id: new ObjectId(taskId) }, // This is because in the database, the _id field expects an Object Id instead of a regular string.
      { $set: { acceptance: false, AcceptedBy: "" } }
    );

    if (updateResult.matchedCount === 0) {
      res.status(404).json({ message:"Task not found"});
    } else {
      res.status(200).json({ message: "Task canceled" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error cancelling task"});
  } finally {
    await client.close(); 
  }
});

app.post('/api/tasks/start/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    await client.connect();
    const db = client.db('pawpal');
    const tasks = db.collection('tasks');

    const updateResult = await tasks.updateOne(
      { _id: new ObjectId(taskId) },
      { $set: { Start: true, StartAt: new Date() } } // Simultaneously set Start to true and StartAt to the current time
    );

    if (updateResult.matchedCount === 0) {
      res.status(404).json({ message:"Task not found"});
    } else {
      res.status(200).json({ message: "Task started" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error starting task"});
  } finally {
    await client.close();
  }
});

app.post('/api/tasks/complete/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    await client.connect();
    const db = client.db('pawpal');
    const tasks = db.collection('tasks');

    const updateResult = await tasks.updateOne(
      { _id: new ObjectId(taskId) }, 
      { $set: { Done: true, EndAt: new Date() } }
    );

    if (updateResult.matchedCount === 0) {
      res.status(404).json({ message:"Task not found"});
    } else {
      res.status(200).json({ message: "Task Done" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error Completing task"});
  } finally {
    await client.close(); 
  }
});

// Profile Page
app.get('/profile', async (req, res) => {
  // Verify that user is logged in.
  if (!loggedInUser) return forceLogin(res);

  // Connect to client
  await client.connect();

  // Select database and collection
  let db = client.db('pawpal');
  let users = db.collection('users');

  // Build query and search for user
  let query = { username: loggedInUser.username };
  let user = await users.findOne(query);
  console.log(user);

  // Render template
  res.render('profile', user);

  // Close database
  await client.close();
});

app.post('/api/profile/edit', async (req, res) => {
  let { newUsername, newDescription } = req.body;
  console.log(newUsername);
  console.log(newDescription);

  await client.connect();
  const db = client.db('pawpal');
  const tasks = db.collection('users');
  await tasks.updateOne({ username: loggedInUser.username }, { $set: { username: newUsername, description: newDescription } });

  loggedInUser.username = newUsername;
  res.json({ message: 'Edit Successful.' });
});

// Tasks Page
// app.get('/tasks', (req, res) => {
//   res.render('tasks');
// });

// Calendar Page
app.get('/calendar', (req, res) => {
  // Verify that user is logged in.
  if (!loggedInUser) return forceLogin(res);

  res.render('calendar', loggedInUser);
});

app.get('/progress', function(req, res) {
  // Verify that user is logged in.
  if (!loggedInUser) return forceLogin(res);

  res.render('progress', loggedInUser); // FIXXXXX
});

// Login Page
app.get('/login', (req, res) => {
  loggedInUser = null;
  res.render('login');
});

app.post('/api/login', async (req, res) => {
  let { username, password } = req.body;
  console.log(username);
  console.log(password);

  await client.connect();
  const db = client.db('pawpal');
  const tasks = db.collection('users');
  const user = await tasks.findOne({ username: username });

  if (!user) return res.status(404).send('User not found.');
  if (password != user.password) return res.status(401).send('Incorrect password.');

  loggedInUser = user;
  res.json({ message: 'Login Successful.' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});