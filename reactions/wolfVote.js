const DATA = require('../DataService');

module.exports = {
    name: 'wolf',
    description: 'vote for someone to kill',
    async execute(reaction, author) {

        
        let target = DATA.players().find((user) => user.username === reaction.message.content);
        let VIP = DATA.players().find((user) => user.id === author.id);

        if (!target || !VIP || !VIP.isPlaying || VIP.voted) return false;

        target.candidate.count.push(VIP);
        VIP.voted = true;

        author.send(`you voted for ${player.username}`);

        return true;
    }

};