// worker.js
const ports = new Set();

onconnect = function(e) {
    const port = e.ports[0];
    ports.add(port);

    port.onmessage = function(msg) {
        // Broadcaster: Send to EVERY port in the Set
        ports.forEach(p => {
            try {
                p.postMessage(msg.data);
            } catch (e) {
                // If a port is dead (tab closed), remove it
                ports.delete(p);
            }
        });
    };

    port.start();
};
