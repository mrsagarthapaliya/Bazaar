const { getAllUser, getUserById } = require("./controller");

app.get('/user', getAllUser);
app.get('/user/:id', getUserById)
