
module.exports = {
    name: 'play',
    description: 'first action',
    execute(message) {

        if (global.playing === false) {

            global.playing = true;

        } else {
            return message.channel.send('game is in progress now wait to the next round');
        }

        global.Players = [];
        global.Narrator = message.author;
        Players = message.guild.channels.cache.find(channel => channel.name === "loup-garou").members;
        global.channel = message.guild.channels.cache.find(channel => channel.name === "loup-garou-chat");

        console.log('play started');

        // starting message
        this.StartingMessage(message);

        // init values
        // distribute roles
        this.init(Players, message);

    },
    init(Players, message) {



        Players.forEach(user => {
            if (!user.user.bot)
                global.Players.push(user.user);

        });

        Players = global.Players.slice();

        global.Players.forEach(player => {

            player['isPlaying'] = true;
            player['talked'] = false;
            player['voted'] = false;
            player['father'] = null;
            player['select'] = null;
            player['candidate'] = false;

        });

        /* werewolf */
        let index = this.randomIntFromInterval(0, Players.length - 1);
        let user = Players[index];
        user['role'] = 'werewolf';
        global.Roles.werewolf[0] = { user };
        Players.splice(index, 1);

        index = this.randomIntFromInterval(0, Players.length - 1);
        user = Players[index];
        user['role'] = 'werewolf';
        global.Roles.werewolf[1] = { user };
        Players.splice(index, 1);

        index = this.randomIntFromInterval(0, Players.length - 1);
        user = Players[index];
        user['role'] = 'werewolf';
        global.Roles.werewolf[2] = { user };
        Players.splice(index, 1);

        /* Oracle */
        index = this.randomIntFromInterval(0, Players.length - 1);
        user = Players[index];
        user['role'] = 'Oracle';
        global.Roles.oracle = { user };
        Players.splice(index, 1);

        /* witch */
        index = this.randomIntFromInterval(0, Players.length - 1);
        user = Players[index];
        user['role'] = 'witch';
        global.Roles.witch = { user };
        Players.splice(index, 1);

        /* hybridWolf */
        index = this.randomIntFromInterval(0, Players.length - 1);
        user = Players[index];
        user['role'] = 'hybridWolf';
        global.Roles.hybridWolf = { user };
        Players.splice(index, 1);

        /* Priest */
        index = this.randomIntFromInterval(0, Players.length - 1);
        user = Players[index];
        user['role'] = 'Priest';
        global.Roles.priest = { user };
        Players.splice(index, 1);

        /* hunter */
        index = this.randomIntFromInterval(0, Players.length - 1);
        user = Players[index];
        user['role'] = 'hunter';
        global.Roles.hunter = { user };
        Players.splice(index, 1);

        /* villagers */
        Players.forEach(user => {
            global.Roles.villagers.push(user);
        });


        console.log(global.Roles);

    },
    StartingMessage(message) {

        message.channel.send('<@' + message.author.id + '>' + 'is now the narrator of this party , ENJOY !');

        message.channel.send('Players List : ' + Players.size);

        Players.forEach(user => {
            /* users */
            if (user.user.username === 'CorvO') {
                message.channel.send('<@' + user.user.id + '>' + '👃');
            } else
                message.channel.send('<@' + user.user.id + '>');
        });
    },
    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};

