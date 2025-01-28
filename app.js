const http = require('http');
const port = 3000;

const app = http.createServer(function (req, res) {
    res.write("Hello, I'm a cute penguin!");
    res.end();
});

app.listen(port);
console.log(`Server started on port ${port}...`);
