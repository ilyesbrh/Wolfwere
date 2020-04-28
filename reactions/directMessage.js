const DATA = require('../DataService');

module.exports = {
    name: 'Direct message reaction',
    description: 'handle direct messages reactions with VIP users',
    async execute(reaction, author) {

        let target = DATA.players().find((user) => user.username === reaction.message.content);
        let VIP = DATA.players().find((user) => user.id === author.id);

        if (!target || !VIP || !VIP.isPlaying || VIP.voted) return false;

        let result = false;

        if (VIP.role === DATA.HybridWolf) result = this.mogly(VIP, target);

        if (VIP.role === DATA.Priest) result = this.priest(VIP, target);

        if (VIP.role === DATA.Witch) result = this.witch(VIP, target);

        if (VIP.role === DATA.Oracle) result = this.oracle(VIP, target);

        NextNightHalf();

        return result;
    },
    mogly(VIP, target) {

        VIP.target = target;

        VIP.send(`you have selected ${target.username} as your father`);

        return true;

    },
    priest(VIP, target) {

        VIP.target = target;
        target.life ++;

        VIP.send(`you have selected ${target.username} to protect`);

        VIP.voted = true;
        return true;
        
    },
    oracle(VIP, target) {
        
        VIP.send(`${target.username} is a ${target.role}`);
        
        VIP.voted = true;
        return true;
    },
    witch(VIP, target) {

        
    },




};

