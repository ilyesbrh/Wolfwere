const DATA = require('../DataService');

module.exports = {
    name: 'play',
    description: 'first action',
    execute(message) {


        if (DATA.state() === DATA.BEFORE_GAME) {

            DATA.setState(DATA.IN_ELECTION);
            DATA.setNarrator(message.author);

        } else {
            message.author.send('game already started and ' + DATA.narrator().username + ' is narrator :bookmark: ');
            message.delete();
            return;
        }

        DATA.setVoiceChannel(message.guild.channels.cache.find(channel => channel.name === "loup-garou"));
        let Players = DATA.voiceChannel().members;
        DATA.setMessageChannel(message.guild.channels.cache.find(channel => channel.name === "loup-garou-chat"));

        console.log('play started');


        // init values
        // distribute roles
        this.init(Players, message);

        // starting message
        this.StartingMessage(message);
    },
    async init(Players) {

        Players.forEach(user => {
            if (!user.user.bot)
                DATA.players().push(user.user);
        });

        Players = DATA.players().slice();

        DATA.players().forEach(player => {

            player['isPlaying'] = true;
            player['talked'] = false;
            player['voted'] = false;
            player['select'] = null;
            player['candidate'] = { on: false, count: [] };

        });

        try {

            /* hybridWolf */
            let index = this.randomIntFromInterval(0, Players.length - 1);
            let user = Players[index];
            user['role'] = 'hybridWolf';
            user['father'] = null;
            DATA.roles().hybridWolf = { user };
            Players.splice(index, 1);

            /* werewolf */
            index = this.randomIntFromInterval(0, Players.length - 1);
            user = Players[index];
            user['role'] = 'werewolf';
            DATA.roles().werewolf[0] = { user };
            Players.splice(index, 1);

            index = this.randomIntFromInterval(0, Players.length - 1);
            user = Players[index];
            user['role'] = 'werewolf';
            DATA.roles().werewolf[1] = { user };
            Players.splice(index, 1);

            index = this.randomIntFromInterval(0, Players.length - 1);
            user = Players[index];
            user['role'] = 'werewolf';
            DATA.roles().werewolf[2] = { user };
            Players.splice(index, 1);

            /* Oracle */
            index = this.randomIntFromInterval(0, Players.length - 1);
            user = Players[index];
            user['role'] = 'Oracle';
            DATA.roles().oracle = { user };
            Players.splice(index, 1);

            /* witch */
            index = this.randomIntFromInterval(0, Players.length - 1);
            user = Players[index];
            user['role'] = 'witch';
            DATA.roles().witch = { user };
            Players.splice(index, 1);

            /* Priest */
            index = this.randomIntFromInterval(0, Players.length - 1);
            user = Players[index];
            user['role'] = 'Priest';
            DATA.roles().priest = { user };
            Players.splice(index, 1);

            /* hunter */
            index = this.randomIntFromInterval(0, Players.length - 1);
            user = Players[index];
            user['role'] = 'hunter';
            DATA.roles().hunter = { user };
            Players.splice(index, 1);

            /* villagers */
            Players.forEach(user => {
                user['role'] = 'villager';
                DATA.roles().villagers.push(user);
            });

            for (const player in DATA.players()) {
                await player.send('your role is: ' + player.role);
            }


        } catch (error) {
            console.log(error);
            return;
        }


        console.log(DATA.roles());

    },
    StartingMessage(message) {

        let Players = DATA.players();

        message.channel.send('<@' + message.author.id + '>  is now the narrator of this party , ENJOY !');

        message.channel.send('Players List : ' + Players.length);

        let tag = '';
        Players.forEach(user => {

            tag = tag + '<@' + user.id + '> \n';
        });

        message.channel.send(tag);

        message.channel.send('if you want to be elected react to this with :thumbsup:').then(
            m => {
                DATA.setElectionMessage(m);
                m.react('👍');

            });


    },
    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};

