"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItems = void 0;
const getItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = req.app.locals.db;
        const shoppingCartCollection = client
            .db("Shop")
            .collection("shoppingCartItem");
        const items = yield shoppingCartCollection.find().toArray();
        res.status(200).json(items);
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.getItems = getItems;
//# sourceMappingURL=itemsController.js.map