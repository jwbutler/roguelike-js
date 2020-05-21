"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var UnitSprite_1 = require("./UnitSprite");
var PlayerSprite = /** @class */ (function (_super) {
    __extends(PlayerSprite, _super);
    function PlayerSprite(unit, paletteSwaps) {
        return _super.call(this, unit, 'player', paletteSwaps, { dx: -4, dy: -20 }) || this;
    }
    return PlayerSprite;
}(UnitSprite_1.default));
exports.default = PlayerSprite;
//# sourceMappingURL=PlayerSprite.js.map