"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const surrealdb_js_1 = require("surrealdb.js");
const zod_1 = require("zod");
const config_json_1 = __importDefault(require("./config.json"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const db = new surrealdb_js_1.Surreal();
const Product = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    stan: zod_1.z.object({
        text: zod_1.z.string(),
        other: zod_1.z.string()
    })
});
app.get("/prod/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        return express_1.response.status(400).json({
            message: "you should provide a product id"
        });
    }
    yield db.connect("http://127.0.0.1:8000/rpc", {
        namespace: 'kacor',
        database: 'products',
        auth: {
            username: config_json_1.default.db.username,
            password: config_json_1.default.db.passwd,
        }
    });
    const shit = yield db.select("product:" + id);
    return res.status(200).json(shit);
}));
app.post("/prod/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key } = req.body;
        if (!key) {
            return res.status(400).json({
                message: "invalid key"
            });
        }
        if (key == config_json_1.default.key) {
            yield db.connect("http://127.0.0.1:8000/rpc", {
                namespace: 'kacor',
                database: 'products',
                auth: {
                    username: config_json_1.default.db.username,
                    password: config_json_1.default.db.passwd,
                }
            });
            const shit = yield db.select("product");
            return res.status(200).json({
                shit
            });
        }
        else {
            return res.status(200).json({
                message: "are you tanmay?"
            });
        }
    }
    catch (e) {
        return res.status(400).json({
            error: "408"
        });
    }
}));
app.post("/prod/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const product = Product.parse(body);
        yield db.connect("http://127.0.0.1:8000/rpc", {
            namespace: 'kacor',
            database: 'products',
            auth: {
                username: config_json_1.default.db.username,
                password: config_json_1.default.db.passwd,
            }
        });
        yield db.create("product", {
            product,
            tify: Math.random().toString(36).slice(2, 12)
        });
        return res.status(200).json({
            message: "great!"
        });
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: e.issues
            });
        }
    }
}));
app.listen(3131, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("http://localhost:3131");
}));
