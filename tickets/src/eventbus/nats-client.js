const nats = require('node-nats-streaming')
class NatsWrapper{
    constructor(){
        this.client = null;
    }
    connect(clusterID, clientID, url) {
        return new Promise((resolve, reject) => {
            const MAX_RETRIES = 5;
            let retries = 0;

            const tryConnect = () => {
                this.client = nats.connect(clusterID, clientID, { url });

                this.client.on('connect', () => {
                    console.log('NATS connected');
                    resolve();
                });

                this.client.on('error', (err) => {
                    console.error('NATS connection error:', err.message);
                    retries++;
                    if (retries >= MAX_RETRIES) {
                        reject(new Error('Max retries reached. Unable to connect to NATS.'));
                    } else {
                        setTimeout(tryConnect, 5000); // Retry after 5 seconds
                    }
                });
            };

            tryConnect();
        });
    }

    getClient(){
        if(this.client){
            return this.client
        }
        console.log("client is not ready!!");
        return
    }
}

module.exports = new NatsWrapper();