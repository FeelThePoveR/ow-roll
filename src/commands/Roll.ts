import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import characterData from "../data/characters.json";
import Chance from "chance";

let damageCharacters = characterData.damage;
let supportCharacters = characterData.support;
let tankCharacters = characterData.tank;

const chance = new Chance();
const discordMaxLineLength = 61;

const Roll = {
	data: new SlashCommandBuilder()
		.setName("roll")
		.setDescription("Roll for your next OW characters")
		.addStringOption((option) => option.setName("names").setDescription("Name of people that you want to roll characters for (split by a ',')").setRequired(true)),
	async execute(interaction: any) {
		const namesString = interaction.options.getString("names");

		const tempNamesList = namesString.split(",");

		let namesList = [] as any[];

		tempNamesList.forEach((element: string) => {
			element = element.trim();
			element = element.charAt(0).toUpperCase() + element.slice(1);

			namesList.push(element);
		});

		const tankCharsReq = await fetch("https://overfast-api.tekrop.fr/heroes?role=tank&locale=en-us");
		const dmgCharsReq = await fetch("https://overfast-api.tekrop.fr/heroes?role=damage&locale=en-us");
		const supportCharsReq = await fetch("https://overfast-api.tekrop.fr/heroes?role=support&locale=en-us");

		if (tankCharsReq.ok && dmgCharsReq.ok && supportCharsReq.ok) {
			tankCharacters = await tankCharsReq.json();
			damageCharacters = await dmgCharsReq.json();
			supportCharacters = await supportCharsReq.json();
		}

		const tankRolls = chance.unique(chance.natural, namesList.length, { min: 0, max: tankCharacters.length - 1 });
		const dmgRolls = chance.unique(chance.natural, namesList.length, { min: 0, max: damageCharacters.length - 1 });
		const suppRolls = chance.unique(chance.natural, namesList.length, { min: 0, max: supportCharacters.length - 1 });

		let fields = [] as any[];

		for (let i = 0; i < namesList.length; i++) {
			const separatorLength = Math.floor(discordMaxLineLength - namesList[i].length) / 2;
			fields.push({
				name: " ",
				value:
					"```" +
					String(namesList[i])
						.padStart(separatorLength + namesList[i].length, "-")
						.padEnd(discordMaxLineLength, "-") +
					"```",
			});

			fields.push({ name: "Tank", value: tankCharacters[tankRolls[i]].name, inline: true });
			fields.push({ name: "Damage", value: damageCharacters[dmgRolls[i]].name, inline: true });
			fields.push({ name: "Support", value: supportCharacters[suppRolls[i]].name, inline: true });
		}

		const embed = new EmbedBuilder().setColor(0x0099ff).addFields(fields);

		await interaction.reply({ embeds: [embed] });
	},
};

export default Roll;
