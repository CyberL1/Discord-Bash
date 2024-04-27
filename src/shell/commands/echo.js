export const run = (interaction, args) => {
  interaction.editReply(args.join(" "));
};
