const os = require('os');
const interfaces = os.networkInterfaces();

for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`App is running on: http://${iface.address}:3000`);
    }
  }
}
