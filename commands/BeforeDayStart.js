
const DATA = require('../DataService');

module.exports = {
    name: 'day',
    description: 'day comes with lot of deaths!',
    async execute(message, args) {

        let hunter = DATA.players(DATA.Hunter)[0];
        // if Hunter dies Ask for target
        if (hunter && !hunter.target && hunter.life < 1) {
            DATA.voteMessage('please select your successor before you die :\')', hunter, p => p.life > 0);
            return;
        }

        // if MIR dies Ask for successor
        if (DATA.MIR().life < 1) {
            DATA.voteMessage('please select your successor before you die :\')', DATA.MIR(), p => p.life > 0)
            return;
        }

        // if mogly father dies turn to wolf
        let mogly = DATA.players(DATA.HybridWolf)[0];

        if (mogly && mogly.target.life < 1) {
            mogly.role = DATA.Werewolf;
            // update roles only 
            let wolfChannel = DATA.wolfChannel();
            wolfChannel.updateOverwrite(wolfChannel.guild.roles.everyone, { VIEW_CHANNEL: false });
            wolfsList.forEach(wolf => {
                wolfChannel.updateOverwrite(wolf.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
            });
            mogly.send('your father died :\') , you are a wolf now !');
        }

        // reset
        DATA.reset();

        // Declare Night actions 
        DATA.players().forEach(player => {
            if (player.life !== 0) return;
            DATA.messageChannel().send(`<@${player.id}> died yesterday and he was a ${player.role}`);
            player.life--;
        });

        // Vote vote someone to execute during the day
        DATA.setState(DATA.IN_DAY);
        // unmute all
        for (let member of DATA.voiceChannel().members) {
            member[1].voice.setMute(false);
        }

        if(DATA.players(DATA.Werewolf).length === 0){
            DATA.messageChannel().send('Villagers Win');
            require('./GameEnder').execute();
            return true;
        }
        else if((DATA.players().length - DATA.players(DATA.Werewolf).length) === 0 ){
            DATA.messageChannel().send('wolfs Win');
            require('./GameEnder').execute();
            return true;
        }

        DATA.messageChannel().send('A new Day has begun')
        DATA.voteMessage('Vote for someone to execute after discussion !', DATA.messageChannel(), p => p.life > 0);

        return true;

    }
};

