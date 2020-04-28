
const DATA = require('../DataService');

module.exports = {
    name: 'night',
    description: 'get my role',
    async execute(message, args) {

        let target = DATA.players().reduce((p, v) => (p.candidate.count.length > v.candidate.count.length ? p : v));
        target.life --;

        DATA.setState(DATA.SECOND_HALF);

        // Ask witch for vote
        const witch = DATA.players(DATA.Witch)[0];

        if (witch.isPlaying) DATA.voteMessage('react to one of the players to kill or revive if dead :', witch, p => { p.isPlaying });
        if (target.life > 0) witch.send(`Wolfs killed ${target.username} react for him to revive`);

        
    }
};

