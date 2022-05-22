const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription('pauses the currently playing song'),
    async execute(interaction, player){
        console.log(interaction);

        if (!interaction.member.voice.channelId) {
            return await interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
        }

        const queue = player.getQueue(interaction.guild);

        if(queue === null || queue === undefined){
            return await  interaction.reply({content: "Queue has not been created yet, use the /play command to get the party started!"});
        }

        if (!queue.nowPlaying()) {
            return await interaction.reply({ content: "Queue is not currently active", ephemeral: true });
        }
        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
        }

        // queue.clear();
        queue.setPaused(true);
        return await interaction.reply({ content: "Bot is paused"});
    }
}