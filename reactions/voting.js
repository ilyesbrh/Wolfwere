const DATA = require('../DataService');

module.exports = {
    name: 'vote',
    description: 'vote for someone',
    async execute(reaction, author) {

        // find elected in players list
        let player = DATA.players().find((user) => user.username === reaction.message.content);
        // find voter in players list
        let voter = DATA.players().find((user) => user.id === author.id);

        // if user does not exist in game or is not a candidate 
        if (!player) return console.log('player not found') && false;
        if (!player.candidate.on && DATA.state() === DATA.IN_MIR_VOTE) return console.log('player not candidate') && false;
        if (!(player.life > 0) && DATA.state() === DATA.IN_DAY) return console.log('player not alive') && false;

        // if voter voted already voted or not in game
        if (!voter || voter.voted) return author.send(`you already voted`) && false;

        player.candidate.count.push(voter);
        voter.voted = true;

        author.send(`you voted for ${player.username}`);

        return true;
    }

};

