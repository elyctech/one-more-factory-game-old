const {
  extrudeTilesetToImage
} = require("tile-extruder");

const assetsPath = `${__dirname}/../src/ui/assets`;
const distPath = `${__dirname}/../dist/assets`;

const extrusionAssets = new Map([
  [
    `${assetsPath}/environment.png`,
    {
      "tileHeight": 32,
      "tileWidth": 32
    }
  ],
  [
    `${assetsPath}/environment2.png`,
    {
      "tileHeight": 32,
      "tileWidth": 32
    }
  ],
  [
    `${assetsPath}/objects1.png`,
    {
      "tileHeight": 32,
      "tileWidth": 32
    }
  ]
]);

for (let [asset, options] of extrusionAssets) {
  const {
    tileHeight,
    tileWidth
  } = options;

  extrudeTilesetToImage(
    tileWidth,
    tileHeight,
    asset,
    asset.replace(".png", "-extruded.png")
  );
}
