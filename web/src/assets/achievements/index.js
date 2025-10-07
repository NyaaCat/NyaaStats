export default Object.fromEntries(
  Object.entries(import.meta.glob('./*.png', {eager: true}))
    .map(([path, module]) => [path.slice('./'.length, -'.png'.length), module.default]),
)
