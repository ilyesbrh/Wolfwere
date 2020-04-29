const DATA = require('../DataService');

module.exports = {
    name: 'end',
    description: 'end Game',
    async execute(message, args) {

      DATA.setState(DATA.BEFORE_GAME);
      DATA.setPlayers([]);
      DATA.setNarrator(null);
      DATA.setElectionMessage(null);
      DATA.setMIR(null);
      DATA.messageChannel().send('GAME STOPPED');
    },
};



