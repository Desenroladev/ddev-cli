"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var database_1 = require("../../../database/database");
var BaseService = /** @class */ (function () {
    function BaseService() {
        this.template = [];
        this.folder_file = '';
        this.file_name = "dmlapi_{{table_name}}_{{tag}}.sql";
        this.codigo = '';
        this.tag = '';
        this.db = new database_1.Database();
    }
    BaseService.prototype.build = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var resolve, file_name;
            var _this = this;
            return __generator(this, function (_a) {
                resolve = path.resolve('/');
                this.folder_file = data.folder_file || resolve;
                file_name = this.file_name;
                file_name = file_name.replace('{{schema_create}}', data.schema_create);
                file_name = file_name.replace('{{table_name}}', data.table_name);
                file_name = file_name.replace('{{tag}}', this.tag);
                this.codigo = this.template.map(function (tpl) {
                    return tpl.replace(/\{{schema_create}}/gi, data.schema_create)
                        .replace(/\{{table_name}}/gi, data.table_name)
                        .replace(/\{{schema_data}}/gi, data.schema_data)
                        .replace(/\{{tag}}/gi, _this.tag)
                        .replace(/\{{segment}}/gi, (data.segment || ''))
                        .replace(/\{{ano}}/gi, new Date().getFullYear() + '');
                }).join('\n-------------------------------------------------------------------\n');
                return [2 /*return*/, {
                        file_name: file_name,
                        codigo: this.codigo
                    }];
            });
        });
    };
    BaseService.prototype.toFile = function (build) {
        return __awaiter(this, void 0, void 0, function () {
            var file_name, codigo, path_file;
            return __generator(this, function (_a) {
                file_name = build.file_name, codigo = build.codigo;
                file_name = file_name || this.file_name;
                codigo = codigo || this.codigo;
                path_file = this.folder_file + "/" + file_name;
                fs.writeFile(path.resolve(path_file), codigo, function (err) {
                    if (err) {
                        throw err;
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    return BaseService;
}());
exports.BaseService = BaseService;
