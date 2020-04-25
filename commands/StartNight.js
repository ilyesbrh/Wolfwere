
const DATA = require('../DataService');
const Discord = require('discord.js');

module.exports = {
    name: 'night',
    description: 'get my role',
    async execute(message, args) {

        if (DATA.state() === DATA.BEFORE_FIRST_NIGHT || true) {

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
            const invite = await wolfChannel.createInvite();

            DATA.players('werewolf').forEach(player => {
                player.send('please join wolfs channel ' + invite.url);
            });
        }
        this.init(message);

    },
    init(message) {

        // mute all
        for (let member of DATA.voiceChannel().members) {
            member[1].voice.setMute(true);
        }
        // reset vote 
        DATA.players().forEach(player => {
            player.candidate = { on: false, count: [] };
            player.voted = false;
        });
        // 
    },
    start(message) {
        if (DATA.state() !== DATA.BEFORE_FIRST_NIGHT) {
            message.author.send("you can use this command only after [!village vote end]");
            message.delete();
            return;
        }
        DATA.setState(DATA.IN_MIR_VOTE);

        let nar = DATA.narrator();

        if (nar.id !== message.author.id) {
            message.delete();
            message.author.send('only narrator can execute this command');
            return;
        }


        DATA.messageChannel().send('Vote started please react for one of the candidate :');

        DATA.players().forEach(async (player, i) => {

            if (!player.candidate.on) return;

            let playerVotingMessage = await DATA.messageChannel().send(`${i}. <@${player.id}>`);

            playerVotingMessage.react('👍');
        });
    }
};

