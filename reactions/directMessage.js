const DATA = require('../DataService');

module.exports = {
    name: 'Direct message reaction',
    description: 'handle direct messages reactions with VIP users',
    async execute(reaction, author) {

        let target = DATA.players().find((user) => user.username === reaction.message.content);
        let VIP = DATA.players().find((user) => user.id === author.id);

        if ((!target && VIP.role !== DATA.Witch) || !VIP || (!VIP.life > 0 && VIP.id !== DATA.MIR().id)) return false;

        let result = false;

        if (VIP.role === DATA.HybridWolf) result = this.mogly(VIP, target);

        if (VIP.role === DATA.Priest) result = this.priest(VIP, target);

        if (VIP.role === DATA.Witch) result = this.witch(VIP, target);

        if (VIP.role === DATA.Oracle) result = this.oracle(VIP, target);

        if (VIP.role === DATA.Hunter) result = this.hunter(VIP, target);

        if (VIP.role === DATA.Hunter) result = this.MIR(VIP, target);

        return result;
    },
    MIR(VIP, target) {

        DATA.setMIR(target);
        DATA.messageChannel().send(`<@${VIP.id}> died his role was ${VIP.role} and selected <@${target.id}> as his successor`);
        VIP.life--;
        require('../commands/BeforeDayStart').execute();
    },
    mogly(VIP, target) {

        if (DATA.NIGHT !== DATA.state()) return VIP.send('wait to until we send you targets') && false;

        if (VIP.target) VIP.send('you already selected your father');

        VIP.target = target;

        VIP.send(`you have selected ${target.username} as your father`);

        return true;

    },
    hunter(VIP, target) {

        if (VIP.target) VIP.send('you already selected your target');

        VIP.target = target;

        target.life = target.life - 2;

        if (VIP.id !== DATA.MIR().id) VIP.life--;

        VIP.send(`you have selected ${target.username} to kill`);

        DATA.messageChannel().send(`<@${VIP.id}> died his role was ${VIP.role} and killed <@${target.id}> who was ${target.role}`);

        require('../commands/BeforeDayStart').execute();

        return true;

    },
    priest(VIP, target) {

        if (DATA.NIGHT !== DATA.state()) return VIP.send('wait to until we send you targets') && false;

        if (VIP.target) VIP.send('you already selected someone to protect today');

        VIP.target = target;
        target.life++;

        VIP.send(`you have selected ${target.username} to protect`);

        if (DATA.NextNightHalf()) require(`./commands/SecondNightHalf`).execute();

        return true;

    },
    oracle(VIP, target) {

        if (DATA.NIGHT !== DATA.state()) return VIP.send('wait to until we send you targets') && false;

        if (VIP.target) VIP.send('you already selected someone to view today');

        VIP.send(`${target.username} is a ${target.role}`);

        VIP.target = target;

        if (DATA.NextNightHalf()) require(`../commands/SecondNightHalf`).execute();

        return true;
    },
    witch(VIP, target) {

        if (DATA.SECOND_NIGHT_HALF !== DATA.state()) return VIP.send('wait to until we send you targets') && false;

        if (VIP['revive'] && VIP['kill']) {
            VIP.send(`you lost all your power`);
        }
        else if (!DATA.SECOND_HALF) {
            VIP.send(`wait until wolfs kill someone`);
        }
        else if (!target) {
            VIP.send(`you chosen to did nothing this night`);
        }
        else if (target.life < 1) {
            target.life++;
            VIP.send(`you revived ${target.username}`);
            VIP['revive'] = target;
        } else {
            target.life--;
            VIP.send(`you killed ${target.username}`);
            VIP['kill'] = target;
        }

        require('../commands/BeforeDayStart').execute();

        return true;
    },




};

