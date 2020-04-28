const DATA = require('../DataService');

module.exports = {
    name: 'play',
    description: 'first action',
    async execute(message) {

        /* init values */

        if (DATA.state() === DATA.BEFORE_GAME) {

            DATA.setState(DATA.IN_ELECTION);
            DATA.setNarrator(message.author);

        } else {
            message.author.send('game already started and ' + DATA.narrator().username + ' is narrator :bookmark: ');
            message.delete();
            return;
        }

        
        DATA.setMessageChannel(message.guild.channels.cache.find(channel => channel.name === "loup-garou-chat"));
        DATA.setVoiceChannel(message.guild.channels.cache.find(channel => channel.name === "loup-garou"));
        
        let Players = DATA.voiceChannel().members;

        console.log('play started');

        /* distribute roles */
        
        DATA.fillPlayerList(Players);

        Players = DATA.players().slice();

        try {

            /* hybridWolf */
            Players = this.newPlayer(Players, DATA.HybridWolf);
            /* Oracle */
            Players = this.newPlayer(Players, DATA.Oracle);
            /* witch */
            Players = this.newPlayer(Players, DATA.Witch);
            /* Priest */
            Players = this.newPlayer(Players, DATA.Priest);
            /* hunter */
            Players = this.newPlayer(Players, DATA.Hunter);

            /* werewolf */
            Players = this.newPlayer(Players, DATA.Werewolf);
            Players = this.newPlayer(Players, DATA.Werewolf);
            Players = this.newPlayer(Players, DATA.Werewolf);

        } catch (error) {console.log(error)}

        Players = DATA.players();
        
        Players.forEach(player => {
            player.send('your role is: ' + player.role);
        });
        // starting message

        DATA.messageChannel().send('<@' + message.author.id + '>  is now the narrator of this party , ENJOY !');

        DATA.messageChannel().send('Players List : ' + Players.length);

        let tag = '';
        Players.forEach(user => {

            tag = tag + '<@' + user.id + '> \n';
        });

        DATA.messageChannel().send(tag);

        DATA.messageChannel().send('if you want to be elected react to this with :thumbsup:').then(
            m => {
                DATA.setElectionMessage(m);
                m.react('👍');

            }
        );
    },

    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    newPlayer(Players, role) {
        let index = this.randomIntFromInterval(0, Players.length - 1);
        let user = Players[index];
        user['role'] = role;
        Players.splice(index, 1);
        return Players;
    }
};



