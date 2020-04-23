
module.exports = {
    name: 'candidate',
    description: 'get my role',
    execute(message) {

        if (!global.Players) {
            message.author.send("Game not started yet");
            return;
        }
        try {

            let user = global.Players.find(v => v.id === message.author.id);

            user.candidate = true;

            message.author.send('u are now a candidate to be Elected');

            let channel = global.channel;

            channel.send('<@'+message.author.id+'> is available to be elected');
            console.log(channel);
            console.log('-------------------------------');
            console.log(global.Players);


        } catch (error) {

        }
    },

};

