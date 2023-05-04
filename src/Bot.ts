import { Client, Events, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import Roll from "./commands/Roll";
import * as dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;
const GUILD_ID = process.env.GUILD_ID as string;

console.log("Bot is starting...");

const client = new Client({
	intents: [],
});

const rest = new REST({ version: "10" }).setToken(TOKEN);

client.once(Events.ClientReady, (c) => {
	c.user.setActivity("Keep rollin', rollin', rollin', rollin'");
	console.log("Discord bot ready!");
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

async function main() {
	try {
		const commands = [];
		commands.push(Roll.data.toJSON());

		await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
	} catch (err) {
		console.log(err);
	}
}

main();
