
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://bnoyes2:CS422_Group7@cs422.xaw8yts.mongodb.net/?retryWrites=true&w=majority&appName=CS422";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Preset task data
const presetTasks = [
  { title: "Walk Dogs", description: "Walk the dogs for 30 minutes.", urgency: "Urgent", PeriodStart: "21:00", PeriodEnd:"22:00", duration:"Short", acceptance: false, Start:false, Done: false, StartAt:"", EndAt:"", AcceptedBy: "",taskDate: "2024-04-18"},
  { title: "Feed Cats", description: "Feed the cats. Make sure to clean the bowls.", urgency: "Normal", PeriodStart: "21:00", PeriodEnd:"22:00", duration:"Medium", acceptance: false, Start:false, Done: false, StartAt:"", EndAt:"", AcceptedBy: "",taskDate: "2024-04-18"},
  { title: "Clean Rooms", description: "Clean the rooms for dogs.", urgency: "Urgent", PeriodStart: "04:00", PeriodEnd:"23:00", duration:"Long", acceptance: false, Start:false, Done: false, StartAt:"", EndAt:"", AcceptedBy: "",taskDate: "2024-04-18"},
  { title: "Wash Dogs", description: "Wash the dirty dog.", urgency: "Normal", PeriodStart: "03:00", PeriodEnd:"22:00", duration:"Short", acceptance: false, Start:false, Done: false, StartAt:"", EndAt:"", AcceptedBy: "",taskDate: "2024-04-16"},
  { title: "Walk Dogs", description: "Walk the dogs for 30 minutes.", urgency: "Urgent", PeriodStart: "07:00", PeriodEnd:"21:00", duration:"Medium", acceptance: false, Start:false, Done: false, StartAt:"", EndAt:"", AcceptedBy: "",taskDate: "2024-04-17"},
  { title: "Walk Dogs", description: "Walk the dogs for 30 minutes.", urgency: "Low Priority", PeriodStart: "20:00", PeriodEnd:"21:00", duration:"Long", acceptance: false, Start:false, Done: false, StartAt:"", EndAt:"", AcceptedBy: "",taskDate: "2024-04-17"},
];

async function seedTasks() {
  try {
    await client.connect();
    const db = client.db('pawpal'); 
    const tasksCollection = db.collection('tasks'); 

    // Insert preset tasks into the collection
    const result = await tasksCollection.insertMany(presetTasks);
    console.log(`${result.insertedCount} tasks were inserted`);
  } catch (err) {
    console.error('Error inserting tasks:', err);
  } finally {
    await client.close();
  }
}

seedTasks();