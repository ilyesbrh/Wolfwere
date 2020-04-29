
const DATA = require('../DataService');

module.exports = {
    name: 'resume night',
    description: 'Second half night actions',
    async execute(message, args) {

        if (!DATA.NextNightHalf()) return console.log('please do all actions');

        let target = DATA.players().reduce((p, v) => (p.candidate.count.length > v.candidate.count.length ? p : v));

        target.life--;

        DATA.setState(DATA.SECOND_NIGHT_HALF);

        // Ask witch for vote
        const witch = DATA.players(DATA.Witch)[0];

        if (witch && witch.life > 0 && (!witch.revive || !witch.kill)) {
            if (target.life < 1) witch.send(`Wolfs killed ${target.username} react for him below to revive`);
            DATA.voteMessage('react to one of the players to kill or revive if dead :', witch, p => { p.life > 0 });
        }else{
            require('./BeforeDayStart').execute();
        }

        return true;
    }
};

