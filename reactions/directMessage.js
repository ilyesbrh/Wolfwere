const DATA = require('../DataService');

module.exports = {
    name: 'Direct message reaction',
    description: 'handle direct messages reactions with VIP users',
    async execute(reaction, author) {

        let target = DATA.players().find((user) => user.username === reaction.message.content);
        let VIP = DATA.players().find((user) => user.id === author.id);

        if (!target || !VIP) return;

        if (VIP.role === 'hybridWolf') this.mogly(reaction, VIP , target);

        return true;
    },
    mogly(reaction, VIP , target) {

        VIP.father = target;

        VIP.send(`you have selected ${target.username} as your father`);

    }

};

