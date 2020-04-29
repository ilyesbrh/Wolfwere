
const DATA = require('../DataService');
const Discord = require('discord.js');

module.exports = {
    name: 'vote',
    description: 'get my role',
    execute(message, args) {

        if (args[0] === 'start')
            this.start(message);
        else if (args[0] === 'end') {
            if (DATA.state() === DATA.IN_MIR_VOTE) return this.MirVote();
            else if (DATA.state() === DATA.IN_DAY) return this.DayVote();
            else {
                DATA.narrator().send("this command can be executed now");
                message.delete();
                return;
            }
        }
    },
    DayVote() {

        let executedPlayer = DATA.players().reduce((previous, player) => (!player.life > 0 || previous.candidate.count.length > player.candidate.count.length) ? previous : player);

        DATA.messageChannel(`<@${executedPlayer.id}> is executed by the village his role was ${executedPlayer.role} \n .`);
        executedPlayer.life -= 2;
        /* dimo9ratia ak fahem xD */
        DATA.players().forEach(player => {
            if (!player.life > 0) return;
            let m = `<@${player.id}> gets ${player.candidate.count.length} from:`;
            player.candidate.count.forEach(voter => {
                m = m + ` <@${voter.id}>`;
            });

            DATA.messageChannel().send(m);
        });
        
        require('../commands/FirstNightHalf').execute();

        return true;
    },
    MirVote() {
        DATA.setState(DATA.BEFORE_FIRST_NIGHT);

        let MIR = DATA.players().reduce((previous, player) => (!player.candidate.on || previous.candidate.count.length > player.candidate.count.length) ? previous : player);

        DATA.setMIR(MIR);

        /* dimo9ratia ak fahem xD */
        DATA.players().forEach(player => {
            if (!player.candidate.on) return;
            let m = `<@${player.id}> gets ${player.candidate.count.length} from:`;
            player.candidate.count.forEach(voter => {
                m = m + ` <@${voter.id}>`;
            });

            DATA.messageChannel().send(m);
        })

        //let MIRAvatar = message.guild.members.cache.find((v)=> v.id === MIR.id).user.avatarURL();

        const MIRDeclaration = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(MIR.tag)
            .setAuthor('Won elections for MIR')
            .setDescription('won vote by: ' + MIR.candidate.count.length + ' vote')
            .setThumbnail(MIR.avatarURL())
            .setTimestamp();

        DATA.messageChannel().send(MIRDeclaration);

        require('../commands/FirstNightHalf').execute();

        return true;
    },
    start(message) {
        if (message && DATA.state() !== DATA.IN_ELECTION) {
            message.author.send("the next command must be [!village vote start]");
            message.delete();
            return;
        }
        DATA.setState(DATA.IN_MIR_VOTE);

        if (DATA.narrator().id !== message.author.id) {
            message.delete();
            message.author.send('only narrator can execute this command');
            return;
        }

        DATA.voteMessage('Vote started please react for one of the candidate :', DATA.messageChannel(), p => p.candidate.on);

    }
};

