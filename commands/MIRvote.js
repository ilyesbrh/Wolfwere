
const DATA = require('../DataService');
const Discord = require('discord.js');

module.exports = {
    name: 'vote',
    description: 'get my role',
    execute(message, args) {

        if (args[0] === 'start')
            this.start(message);
        else if (args[0] === 'end')
            this.end(message);
    },
    end(message) {
        if (DATA.state() !== DATA.IN_MIR_VOTE) {
            message.author.send("this command can be executed only after [!village vote start]");
            message.delete();
            return;
        }
        DATA.setState(DATA.BEFORE_FIRST_NIGHT);

        let MIR;
        DATA.players().forEach((player) => {
            if (!player.candidate.on) return;

            let m = `<@${player.id}> gets ${player.candidate.count.length} from:`;
            player.candidate.count.forEach(voter => {
                m = m + ` <@${voter.id}>`;
            });
            
            DATA.messageChannel().send(m);
            
            if (!MIR || MIR.candidate.count.length < player.candidate.count.length)
                MIR = player;

        });

        let MIRAvatar = message.guild.members.cache.find((v)=> v.id === MIR.id).user.avatarURL();

        const MIRDeclaration = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(MIR.tag)
            .setAuthor('Won elections for MIR')
            .setDescription('won vote by: '+MIR.candidate.count.length+' vote')
            .setThumbnail(MIRAvatar)
            .setTimestamp();

        DATA.messageChannel().send(MIRDeclaration);


    },
    start(message) {
        if (DATA.state() !== DATA.IN_ELECTION) {
            message.author.send("the next command must be [!village vote start]");
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

