export const run = (interaction, args) => {
  interaction.editReply(args.join(" "));
};

export const info = {
  name: "echo",
};
