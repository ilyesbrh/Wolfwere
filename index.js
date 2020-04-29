const fs = require('fs');
const Discord = require('discord.js');
const DATA = require('./DataService');
const sizeof = require('object-sizeof')

const { prefix, token } = {
	prefix: "!village",
	token: process.env.token
};


const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("guildCreate", async guild => {

    let category = await guild.channels.create("Loup Garou", {type:'category'});

    guild.channels.create('loup-garou-chat', {
        type: 'text',
        parent: category,
        permissionOverwrites: [
            { id: guild.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] },
        ],
    });
    guild.channels.create('loup-garou-voice', {
        type: 'voice',
        parent: category,
        permissionOverwrites: [
            { id: guild.id, allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'], deny: ['STREAM'] },
        ],
    });

});

client.once('ready', () => {
    DATA.init();
    DATA.setClient(client);
    console.log('Ready!');
});

client.on('message', message => {

    if (message.channel.name !== 'loup-garou-chat') return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix) && !message.author.bot) return message.delete();

    if (DATA.state() !== DATA.BEFORE_GAME && DATA.players().find((v) => message.author.id === v.id) === -1) {
        message.author.send('you are not a player in this game wait to next round');
        message.delete();
    }

    const args = message.content.slice(prefix.length).split(/ +/);

    args.shift();
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return message.delete();

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});


client.on('messageReactionAdd', async (reaction, user) => {

    // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
    try {
        await reaction.fetch();
    } catch (error) {
        console.log('Something went wrong when fetching the message: ', error);
        // Return as `reaction.message.author` may be undefined/null
        return;
    }

    if (reaction.message.author.id !== "702648013507788981" || user.id === "702648013507788981") return;

    let result = false;
    if (reaction.message.channel.type === "dm")
        result = await require('./reactions/directMessage').execute(reaction, user);
    else if (DATA.state() === DATA.IN_ELECTION)
        result = await require('./reactions/candidate').execute(reaction, user);
    else if (DATA.state() === DATA.IN_MIR_VOTE || DATA.IN_DAY === DATA.state())
        result = await require('./reactions/voting').execute(reaction, user);
    else if (DATA.state() === DATA.NIGHT && reaction.message.channel.id === DATA.wolfChannel().id)
        result = await require('./reactions/wolfVote').execute(reaction, user);
    else
        reaction.users.remove(user);


    /* if not authorized */
    if (!result && reaction.message.channel.type !== "dm") reaction.users.remove(user);

    /*  
        const msg = await channel.fetchMessage(MessageID);
        msg.reactions.resolve("REACTION EMOJI, 
        REACTION OBJECT OR REACTION ID").users.remove("ID OR OBJECT OF USER TO REMOVE"); 
    */
});




client.login(token);
