import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import characterData from "../data/characters.json";

const damageCharacters = characterData.damage;
const supportCharacters = characterData.support;
const tankCharacters = characterData.tank;

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

		let tempDmg = damageCharacters;
		let tempSup = supportCharacters;
		let tempTank = tankCharacters;

		let rolledChars = [] as any[];

		namesList.forEach((name: string) => {
			let rollTankInt = rollRandomInt(tempTank.length);
			let rollDmgInt = rollRandomInt(tempDmg.length);
			let rollSupInt = rollRandomInt(tempSup.length);

			rolledChars.push({ name: name, tank: tempTank[rollTankInt], dmg: tempDmg[rollDmgInt], sup: tempSup[rollSupInt] });

			tempDmg.splice(rollDmgInt, 1);
			tempSup.splice(rollSupInt, 1);
			tempTank.splice(rollTankInt, 1);
		});

		let fields = [] as any[];

		let separatorString = "----------------------------";

		for (let i = 0; i < rolledChars.length; i++) {
			fields.push({ name: " ", value: "```" + separatorString + String(rolledChars[i].name) + separatorString + "```" });

			fields.push({ name: "Tank", value: rolledChars[i].tank, inline: true });
			fields.push({ name: "Damage", value: rolledChars[i].dmg, inline: true });
			fields.push({ name: "Support", value: rolledChars[i].sup, inline: true });
		}

		const embed = new EmbedBuilder().setColor(0x0099ff).addFields(fields);

		await interaction.reply({ embeds: [embed] });
	},
};

function rollRandomInt(max: number) {
	return (Math.random() * max) | 0;
}

export default Roll;
