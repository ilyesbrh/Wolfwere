const DATA = require('../DataService');

module.exports = {
    name: 'candidate',
    description: 'stand for elections',
    async execute(reaction, author) {

        if (reaction.message.id !== DATA.electionMessage().id) return;

        let elected = DATA.players().find(v => v.id === author.id);

        if (!elected){
            console.log('user not found');
            return
        }
        
        if (elected.candidate.on) return author.send('already candidate') && false ;

        elected.candidate.on = true;

        author.send('u are now a candidate to be Elected');

        await DATA.messageChannel().send('<@' + author.id + '> is available to be elected');
        
        return true;
    }

};

