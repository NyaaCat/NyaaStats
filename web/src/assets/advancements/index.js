export default Object.entries(import.meta.glob('./*/*.{png,gif}', {eager: true}))
  .map(([path, module]) => [...path.slice('./'.length, -'.png'.length).split('/'), module.default])
  .reduce((data, [group, name, url]) => {
    data[group] ??= {}
    data[group][name] = url
    return data
  }, {})
