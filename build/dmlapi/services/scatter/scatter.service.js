"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ScatterService = void 0;
var base_service_1 = require("../base/base.service");
var path = __importStar(require("path"));
var ScatterService = /** @class */ (function (_super) {
    __extends(ScatterService, _super);
    function ScatterService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.file_name = "inbound_{{table_name}}_{{tag}}.sql";
        _this.tag = 'scatter';
        _this.template = [
            "create or replace function {{schema_create}}.inbound_{{table_name}}_{{tag}}(\n    fr_payload in jsonb\n)   returns jsonb[]\nlanguage plpgsql\nas $function$\n------------------------------------------------------------------\n-- LIVNOW: LIV Noop Of Work\n------------------------------------------------------------------\n-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)\n-- (c) Copyright {{ano}} desenroladev.com.br\n------------------------------------------------------------------\n-- {{schema_data}}.{{table_name}}: scatter to jsonb[]\n------------------------------------------------------------------\ndeclare\nbegin\n    return {{schema_create}}.inbound_generic_{{tag}}(fr_payload, '{{segment}}');\nend;\n$function$\n;\n"
        ];
        _this.tpl_generic = [
            "create or replace function {{schema_create}}.inbound_generic_{{tag}}(\n    fr_payload in jsonb,\n    fr_segment in varchar\n) returns jsonb[]\n  language plpgsql\nas $function$\n------------------------------------------------------------------\n-- LIVNOW: LIV Noop Of Work\n------------------------------------------------------------------\n-- (c) Copyright 2020 Antoniel Lima (antonielliimma@gmail.com)\n-- (c) Copyright 2020 desenroladev.com.br\n------------------------------------------------------------------\n-- generic: scatter to jsonb\n------------------------------------------------------------------\ndeclare\n------------------------------------------------------------------\n    cur_payload cursor for \n        select\n            jsonb_array_elements(fr_payload->'data') as segment;\n-------------------------------------------------------------------\n    lv_data    jsonb[];\n------------------------------------------------------------------\n    lv_payload jsonb;\n    lv_index   int;\n    lv_aux     varchar(100);\n    lv_seg     varchar(500);\n    lv_arr     varchar(100)[];\nbegin\n-------------------------------------------------------------------\n    lv_index := 1;\n    lv_seg   := '';\n-------------------------------------------------------------------\n    select \n        string_to_array(cast(fr_payload->>'segment' as varchar), '/') \n        into lv_arr;\n-------------------------------------------------------------------\n    foreach lv_aux in array lv_arr \n    loop \n        if lv_index > 2 then\n            lv_seg := lv_seg ||'/'|| lv_aux;\n        end if;\n        lv_index := lv_index + 1;\n    end loop;\n-------------------------------------------------------------------\n    if lv_seg <> fr_segment then\n        raise exception 'segmento: % invalido', fr_payload->'segment';\n    end if;\n-------------------------------------------------------------------\n    lv_index := 1;\n    if (fr_payload is not null) then\n        for lv_payload in cur_payload \n        loop\n            lv_data[lv_index] := lv_payload.segment;\n            lv_index          := lv_index + 1;\n        end loop;\n    end if;\n-------------------------------------------------------------------\n    return lv_data;\nend;\n$function$\n;"
        ];
        return _this;
    }
    ScatterService.prototype.buildGeneric = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var resolve, file_name, codigo, build;
            return __generator(this, function (_a) {
                resolve = path.resolve('/');
                this.folder_file = data.folder_file || resolve;
                file_name = "inbound_generic_{{tag}}.sql";
                file_name = file_name.replace('{{tag}}', this.tag);
                codigo = this.tpl_generic[0];
                codigo = codigo.replace('{{schema_create}}', data.schema_create);
                codigo = codigo.replace('{{table_name}}', data.table_name);
                codigo = codigo.replace('{{tag}}', this.tag);
                build = {
                    file_name: file_name,
                    codigo: codigo
                };
                this.toFile(build);
                return [2 /*return*/];
            });
        });
    };
    return ScatterService;
}(base_service_1.BaseService));
exports.ScatterService = ScatterService;
