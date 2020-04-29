const DATA = require('../DataService');

module.exports = {
    name: 'play',
    description: 'first action',
    async execute(message, args) {

        /* init values */

        if (DATA.state() === DATA.BEFORE_GAME) {

            DATA.setState(DATA.IN_ELECTION);
            DATA.setNarrator(message.author);

        } else {
            message.author.send('game already started and ' + DATA.narrator().username + ' is narrator :bookmark: ');
            message.delete();
            return;
        }


        DATA.setServer(message.guild);
        DATA.setMessageChannel(message.guild.channels.cache.find(channel => channel.name === "loup-garou-chat"));
        DATA.setVoiceChannel(message.guild.channels.cache.find(channel => channel.name === "loup-garou-voice"));

        let Players = DATA.voiceChannel().members;

        console.log('play started');

        /* distribute roles */

        DATA.fillPlayerList(Players);

        Players = DATA.players().slice();

        /* werewolf */
        for (let i = 0; i < args[0]; i++) {
            Players = this.newPlayer(Players, DATA.Werewolf);
        }
        /* hybridWolf */
        if (args.includes('-hw'))
            Players = this.newPlayer(Players, DATA.HybridWolf);
        /* Oracle */
        if (args.includes('-o'))
            Players = this.newPlayer(Players, DATA.Oracle);
        /* witch */
        if (args.includes('-w'))
            Players = this.newPlayer(Players, DATA.Witch);
        /* Priest */
        if (args.includes('-p'))
            Players = this.newPlayer(Players, DATA.Priest);
        /* hunter */
        if (args.includes('-h'))
            Players = this.newPlayer(Players, DATA.Hunter);


        Players = DATA.players();

        Players.forEach(player => player.send('your role is: ' + player.role));

        let wolfsList = DATA.players(DATA.Werewolf);
        // create wolfs room
        let wolfChannel = message.guild.channels.cache.find(channel => channel.name === "wolfs-chat");

        if (!wolfChannel) {
            // if werewolf channel does not exist create one
            wolfChannel = await DATA.Server().channels.create('wolfs-chat', {
                type: 'text',
                permissionOverwrites: [
                    { id: DATA.Server().id, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'] },
                    //  get all players => map to permission option object format => spread array
                    ...wolfsList.map(v => { return { id: v.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] } }),
                ],
            });
        } else {
            // update roles only 
            wolfChannel.updateOverwrite(wolfChannel.guild.roles.everyone, { VIEW_CHANNEL: false });
            wolfsList.forEach(wolf => {
                wolfChannel.updateOverwrite(wolf.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
            });
            
        }
        // set wolf channel
        DATA.setWolfChannel(wolfChannel);
        // invite wolf to channel
        const invite = await wolfChannel.createInvite();
        wolfsList.forEach(player => {
            player.send('please join wolfs channel ' + invite.url);
        });
        // starting message
        DATA.messageChannel().send('<@' + message.author.id + '>  is now the narrator of this party , ENJOY !');
        DATA.messageChannel().send('Players List : ' + Players.length);
        
        let tag = '';
        Players.forEach((user) => {
            tag += '<@' + user.id + '> \n';
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



