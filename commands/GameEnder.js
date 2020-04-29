const DATA = require('../DataService');
const sizeof = require('object-sizeof')

module.exports = {
    name: 'end',
    description: 'end Game',
    async execute(message, args) {

      console.log(sizeof(global.game));
      DATA.setState(DATA.BEFORE_GAME);
      DATA.setPlayers([]);
      DATA.setNarrator(null);
      DATA.setElectionMessage(null);
      DATA.setMIR(null);
      DATA.messageChannel().send('GAME STOPPED');

    },
};



