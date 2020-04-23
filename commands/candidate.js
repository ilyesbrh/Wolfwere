
module.exports = {
    name: 'candidate',
    description: 'get my role',
    execute(message) {

        if (!global.Players) {
            message.author.send("Game not started yet");
            return;
        }
        try {
            
            message.author.send('u are now a candidate to be Elected');

        } catch (error) {

        }
    },

};

