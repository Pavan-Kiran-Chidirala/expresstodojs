const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());
let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running...");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();
//App1
app.get("/todos/", async (request, response) => {
  const { status = "", priority = "", search_q = "" } = request.query;
  const query = `
        SELECT *
        FROM todo
        WHERE status LIKE '%${status}%' AND priority LIKE '%${priority}%' AND todo LIKE '%${search_q}%';
    `;
  const dbResponse = await db.all(query);
  response.send(dbResponse);
});
//App2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `
        SELECT *
        FROM todo
        WHERE id= ${todoId};
    `;
  const dbResponse = await db.get(query);
  response.send(dbResponse);
});
//App3
app.post("/todos/", async (request, response) => {
  const details = request.body;
  const { id, todo, priority, status } = details;
  const query = `
        INSERT INTO todo(id,todo,priority,status)
        VALUES (${id},'${todo}','${priority}','${status}');
    `;
  await db.run(query);
  response.send("Todo Successfully Added");
});
//App4
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const details = request.body;
  const { todo = "", status = "", priority = "" } = details;
  if (todo != "") {
    const query = `
        UPDATE todo
        SET todo= '${todo}'
        WHERE id= ${todoId};
        `;
    await db.run(query);
    response.send("Todo Updated");
  } else if (status != "") {
    const query = `
        UPDATE todo
        SET status= '${status}'
        WHERE id= ${todoId};
        `;
    await db.run(query);
    response.send("Status Updated");
  } else if (priority != "") {
    const query = `
        UPDATE todo
        SET priority= '${priority}'
        WHERE id= ${todoId};
        `;
    await db.run(query);
    response.send("Priority Updated");
  }
});
//App5
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `
        DELETE FROM todo
        WHERE id= ${todoId};
    `;
  await db.run(query);
  response.send("Todo Deleted");
});
module.exports = app;
