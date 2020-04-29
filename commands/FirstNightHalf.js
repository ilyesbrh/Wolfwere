
const DATA = require('../DataService');

module.exports = {
    name: 'night',
    description: 'get my role',
    async execute(message, args) {

        if (DATA.state() === DATA.BEFORE_FIRST_NIGHT) {

            // hybrid wolf select father
            const mogly = DATA.players(DATA.HybridWolf)[0];
            if (mogly && mogly.life > 0) {
                DATA.voteMessage('please select your father :', mogly, p => p.id !== mogly.id);
            }
        }
        DATA.setState(DATA.NIGHT);
        
        // mute all
        for (let member of DATA.voiceChannel().members) {
            member[1].voice.setMute(true);
        }
        // reset vote 
        DATA.reset();
        

        // Ask for vote from wolfs

        DATA.voteMessage('vote for someone to kill:', DATA.wolfChannel(), p => p.life > 0 && p.role !== DATA.Werewolf);

        // ask priest for target

        const priest = DATA.players(DATA.Priest)[0];

        if (priest && priest.life > 0) DATA.voteMessage('react to one of the players to Protect:', priest, p =>  p.life > 0 && priest.target.id !== p.id );

        // ask oracle for target

        const oracle = DATA.players(DATA.Oracle)[0];

        if (oracle && oracle.life > 0) DATA.voteMessage('react to one of the players to reveal role:', oracle, p =>  p.life > 0 );

    }
};

