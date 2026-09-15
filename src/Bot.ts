import { Client, Events, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import Roll from "./commands/Roll";
import * as dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;

console.log("Bot is starting...");

const client = new Client({
	intents: [],
});

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function registerGuildCommands(guildId: string) {
	const commands = [Roll.data.toJSON()];
	await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), { body: commands });
}

async function registerAllGuildCommands() {
	for (const guild of client.guilds.cache.values()) {
		try {
			await registerGuildCommands(guild.id);
			console.log(`Registered commands for guild: ${guild.name} (${guild.id})`);
		} catch (err) {
			console.log(`Failed to register commands for guild ${guild.id}:`, err);
		}
	}
}

client.once(Events.ClientReady, async (c) => {
	c.user.setActivity("Keep rollin', rollin', rollin', rollin'");
	console.log("Discord bot ready!");
	await registerAllGuildCommands();
});

client.on(Events.GuildCreate, async (guild) => {
	try {
		await registerGuildCommands(guild.id);
		console.log(`Registered commands for new guild: ${guild.name} (${guild.id})`);
	} catch (err) {
		console.log(`Failed to register commands for new guild ${guild.id}:`, err);
	}
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === "roll") {
		try {
			await Roll.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	}
});

client.login(TOKEN);
