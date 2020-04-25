module.exports = {
    /* Statics */
    BEFORE_GAME: 'game not started',
    IN_ELECTION: 'candidates',
    IN_MIR_VOTE: 'voting for mir',
    BEFORE_FIRST_NIGHT: 'before first night start',
    /* Globals */
    //getters
    electionMessage: () => global.electionMessage,
    state: () => global.state,
    roles: () => global.roles,
    players: (role) => { if (!role || role === '') return global.players; else return global.players.filter(v => v.role === role); },
    narrator: () => global.Narrator,
    MIR: () => global.MIR,
    messageChannel: () => global.messageChannel,
    voiceChannel: () => global.voiceChannel,
    client: () => global.client,
    //setters
    setElectionMessage: (em) => global.electionMessage = em,
    setState: (s) => global.state = s,
    setRoles: (r) => global.roles = r,
    setPlayers: (p) => global.players = p,
    setNarrator: (n) => global.Narrator = n,
    setMIR: (m) => global.MIR = m,
    setMessageChannel: (c) => global.messageChannel = c,
    setVoiceChannel: (vc) => global.voiceChannel = vc,
    setClient: (c) => global.client = c,
    /* functions */
    init() {
        this.setPlayers([]);
        this.setState(this.BEFORE_GAME);
        this.setRoles({
            werewolf: [{}, {}, {}],
            oracle: {},
            priest: {},
            hybridWolf: {},
            hunter: {},
            witch: {},
            villagers: []
        });
    },
}