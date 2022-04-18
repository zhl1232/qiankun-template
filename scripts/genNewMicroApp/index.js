const infoCollector = require("./infoCollector")
const tplReplacer = require("./tplReplacer")

async function run() {
  const meta = await infoCollector()
  console.log(meta)
  tplReplacer(meta)
}

run()
