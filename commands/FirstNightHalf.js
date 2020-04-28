
const DATA = require('../DataService');

module.exports = {
    name: 'night',
    description: 'get my role',
    async execute(message, args) {

        if (DATA.state() === DATA.BEFORE_FIRST_NIGHT) {

            // hybrid wolf select father
            const mogly = DATA.players('hybridWolf')[0];
            mogly.send('please select your father :')

            DATA.players().forEach(async (player, i) => {

                if (player.id === mogly.id) return;

                let playerVotingMessage = await mogly.send(`${player.username}`);
                playerVotingMessage.react('👍');

            });

            // create wolfs room

            let wolfChannel = message.guild.channels.cache.find(channel => channel.name === "wolfs-chat");

            if (!wolfChannel) {
                wolfChannel = await message.guild.channels.create('wolfs-chat', {
                    type: 'text',
                    permissionOverwrites: [
                        { id: message.guild.id, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'] },
                        //  get all players => map to permission option object format => spread array
                        ...DATA.players('werewolf').map(v => { return { id: v.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] } }),
                    ],
                });
            } else {
                wolfChannel.updateOverwrite(wolfChannel.guild.roles.everyone, { VIEW_CHANNEL: false });
                DATA.players('werewolf').forEach(wolf => {
                    wolfChannel.updateOverwrite(wolf.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                });
            }
            DATA.setWolfChannel(wolfChannel);
            const invite = await wolfChannel.createInvite();

            DATA.players('werewolf').forEach(player => {
                player.send('please join wolfs channel ' + invite.url);
            });
        }
        // mute all
        for (let member of DATA.voiceChannel().members) {
            member[1].voice.setMute(true);
        }
        // reset vote 
        DATA.reset();

        DATA.setState(DATA.NIGHT);

        // Ask for vote from wolfs

        DATA.voteMessage('vote for someone to kill:', DATA.wolfChannel(), p => { p.isPlaying && p.role !== DATA.Werewolf });

        // ask priest for target

        const priest = DATA.players(DATA.Priest)[0];

        if (priest.isPlaying) DATA.voteMessage('react to one of the players to Protect:', priest, p => { p.isPlaying && priest.target.id !== p.id });

        // ask oracle for target

        const oracle = DATA.players(DATA.Oracle)[0];

        if (oracle.isPlaying) DATA.voteMessage('react to one of the players to reveal role:', oracle, p => { p.isPlaying });

    }
};

