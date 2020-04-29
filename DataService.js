const rx = require('rxjs');

module.exports = {
    /* Statics */
    BEFORE_GAME: 'game not started',
    IN_ELECTION: 'candidates',
    IN_MIR_VOTE: 'voting for mir',
    BEFORE_FIRST_NIGHT: 'before first night start',
    NIGHT: 'night starts',
    SECOND_NIGHT_HALF: 'after wolfs voted',
    IN_DAY: 'vote and discussion time',
    /* roles */
    HybridWolf: 'hybridWolf',
    Oracle: 'oracle',
    Witch: 'witch',
    Priest: 'priest',
    Hunter: 'hunter',
    Werewolf: 'werewolf',
    Villager: 'villager',
    /* Globals */
    //getters
    electionMessage: () => global.electionMessage,
    state: () => global.state,
    players: (role) => { if (!role || role === '') return global.players; else return global.players.filter(v => v.role === role); },
    narrator: () => global.Narrator,
    MIR: () => global.MIR,
    Server: () => global.guild,
    messageChannel: () => global.messageChannel,
    voiceChannel: () => global.voiceChannel,
    wolfChannel: () => global.wolfChannel,
    client: () => global.client,
    //setters
    setElectionMessage: (em) => global.electionMessage = em,
    setState: (s) => global.state = s,
    setPlayers: (p) => global.players = p,
    setNarrator: (n) => global.Narrator = n,
    setMIR: (m) => global.MIR = m,
    setServer: (s) => global.guild = s,
    setMessageChannel: (c) => global.messageChannel = c,
    setVoiceChannel: (vc) => global.voiceChannel = vc,
    setWolfChannel: (wc) => global.wolfChannel = wc,
    setClient: (c) => global.client = c,
    /* Subjects */
    hunter: () => global.hunterSubject.asObservable(),
    pushHunter: (t) => {
        global.hunterSubject.next(t);
    },

    /* functions */
    init() {
        this.setPlayers([]);
        this.setState(this.BEFORE_GAME);

        global.hunterSubject = new rx.Subject();

    },
    fillPlayerList(Players) {
        Players.forEach(user => {

            const player = user.user;

            if (player.bot) return;

            player['voted'] = false;
            player['target'] = null;
            player['life'] = 1;
            player['candidate'] = { on: false, count: [] };
            player['role'] = this.Villager;
            global.players.push(player);
        });
    },
    reset() {
        global.players.forEach(player => {
            player.candidate = { on: false, count: [] };
            player['voted'] = false;
            player['target'] = null;
        });
    },
    voteMessage(description, target, filter) {

        target.send(description);

        let filteredPlayers = global.players.filter(filter);

        filteredPlayers.forEach(async player => (await target.send(`${player.username}`)).react('👍'));
    },
    NextNightHalf() {

        const priest = this.players(this.Priest)[0];
        const mogly = this.players(this.HybridWolf)[0];
        const oracle = this.players(this.Oracle)[0];
        const wolfs = this.players(this.Werewolf);

        if (priest && priest.life > 0 && !priest.target) return false;
        else if (oracle && oracle.life > 0 && !oracle.target) return false;
        else if (mogly && mogly.life > 0 && !mogly.target) return false;

        let goNext = true;

        wolfs.forEach(wolf => goNext = goNext && wolf.voted);

        return goNext;
    }
}