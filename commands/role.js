
const DATA = require('../DataService');
module.exports = {
    name: 'role',
    description: 'get my role',
    execute(message) {

        if (DATA.state() === DATA.BEFORE_GAME) {
            message.author.send("Game not started yet");
            return;
        }

        try {
            
            let user = DATA.players().find(v => v.id === message.author.id);
            
            if (user.role) {
                message.author.send(user.role);
            } else {
                message.author.send("Villager");
            }

        } catch (error) {
            message.author.send('you are not in game');
        }
    },

};

