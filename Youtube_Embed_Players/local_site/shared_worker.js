// worker.js
const connections = [];

onconnect = function (e) {
    const port = e.ports[0];
    connections.push(port);

    port.onmessage = function (msg) {
        // When any site sends a message, broadcast it to EVERYONE ELSE
        connections.forEach(conn => {
            if (conn !== port) {
                conn.postMessage(msg.data);
            }
        });
    };

    port.start();
};
