"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ItemFactory_1 = require("../items/ItemFactory");
var UnitFactory_1 = require("../units/UnitFactory");
var RoomCorridorDungeonGenerator_1 = require("./generation/RoomCorridorDungeonGenerator");
var BlobDungeonGenerator_1 = require("./generation/BlobDungeonGenerator");
var types_1 = require("../types/types");
var RandomUtils_1 = require("../utils/RandomUtils");
function createRandomMap(mapLayout, tileSet, level, width, height, numEnemies, numItems) {
    var dungeonGenerator = _getDungeonGenerator(mapLayout, tileSet);
    return dungeonGenerator.generateDungeon(level, width, height, numEnemies, UnitFactory_1.default.createRandomEnemy, numItems, ItemFactory_1.default.createRandomItem);
}
function _getDungeonGenerator(mapLayout, tileSet) {
    switch (mapLayout) {
        case types_1.MapLayout.ROOMS_AND_CORRIDORS: {
            var minRoomDimension = RandomUtils_1.randInt(6, 6);
            var maxRoomDimension = RandomUtils_1.randInt(9, 9);
            var minRoomPadding = 0;
            return new RoomCorridorDungeonGenerator_1.default(tileSet, minRoomDimension, maxRoomDimension, minRoomPadding);
        }
        case types_1.MapLayout.BLOB:
            return new BlobDungeonGenerator_1.default(tileSet);
    }
}
exports.default = { createRandomMap: createRandomMap };
//# sourceMappingURL=MapFactory.js.map