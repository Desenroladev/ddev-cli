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
exports.J2rService = void 0;
var base_service_1 = require("../base/base.service");
var path = __importStar(require("path"));
var J2rService = /** @class */ (function (_super) {
    __extends(J2rService, _super);
    function J2rService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = 'j2r';
        _this.template = ["\ncreate or replace function {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(\n    fv_jsonb jsonb\n)\nreturns {{schema_data}}.{{table_name}}\nlanguage plpgsql\nas $function$\n------------------------------------------------------------------\n-- LIVNOW: LIV Noop Of Work\n------------------------------------------------------------------\n-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)\n-- (c) Copyright {{ano}} desenroladev.com.br\n------------------------------------------------------------------\n-- {{schema_data}}.{{table_name}}: jsonb to record\n------------------------------------------------------------------\ndeclare\n    lr_data             {{schema_data}}.{{table_name}};\n    lr_empty            {{schema_data}}.{{table_name}};\n    lr_data_inclusao    varchar;\n    lv_data             {{schema_data}}.{{table_name}};\nbegin\n    ------------------------------------------------------------\n    lr_data_inclusao := '\"'||coalesce(cast(fv_jsonb->>'data_inclusao' as timestamp), clock_timestamp())||'\"';\n    select jsonb_set(fv_jsonb, '{\"data_inclusao\"}', lr_data_inclusao::jsonb) into fv_jsonb;\n    ------------------------------------------------------------\n    if fv_jsonb->>'pessoa_source_id' is not null then                                                              --009 uuid\n        select \n            jsonb_set(fv_jsonb, '{\"pessoa_id\"}', ('\"'||p.id||'\"')::jsonb) into fv_jsonb\n        from livnow.livnow_pessoa p \n        where p.source_id = fv_jsonb->>'pessoa_source_id';                        \n    end if;\n    ------------------------------------------------------------\n    {{j2r_rows}}\n    return lv_data;\nend;\n$function$;"];
        return _this;
    }
    J2rService.prototype.formartaComZero = function (numero, casas) {
        if (casas === void 0) { casas = 3; }
        var txt = '' + numero;
        for (var i = 0; i < (casas - ('' + numero).length); i++) {
            txt = '0' + txt;
        }
        return txt;
    };
    J2rService.prototype.gerarEspacos = function (column_name, max_length) {
        if (max_length === void 0) { max_length = 40; }
        var i = 0;
        var count = (max_length - column_name.length);
        var espaco = '';
        while (i++ < count) {
            espaco += ' ';
        }
        return espaco;
    };
    J2rService.prototype.build = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var resolve, sql, columns, tpl_row, rows, j2r_rows, file_name, template;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resolve = path.resolve('/');
                        this.folder_file = data.folder_file || resolve;
                        sql = "select \n                        column_name, \n                        ordinal_position,\n                        data_type,\n                        udt_name,\n                        character_maximum_length,\n                        numeric_precision,\n                        is_nullable\n                    from information_schema.columns \n                    where table_name = :table_name\n                        and table_schema = :table_schema\n                        and table_catalog = :table_catalog\n                    order by ordinal_position";
                        return [4 /*yield*/, this.db.query(sql, data)];
                    case 1:
                        columns = _a.sent();
                        tpl_row = "lv_data.{{column_name}} {{espaco_left}} = fv_jsonb ->> '{{column_name}}'; {{espaco_rigth}} --{{ordem}} {{data_type}}";
                        rows = columns.map(function (one) {
                            var espaco_left = _this.gerarEspacos(one.column_name);
                            var espaco_rigth = _this.gerarEspacos(one.column_name);
                            var ordem = _this.formartaComZero(one.ordinal_position, 3);
                            var data_type = one.data_type;
                            if (one.character_maximum_length > 0) {
                                data_type += "(" + one.character_maximum_length + ")";
                            }
                            if (one.is_nullable == 'YES') {
                                data_type += " not null";
                            }
                            return tpl_row.replace(/\{{column_name}}/gi, one.column_name)
                                .replace(/\{{espaco_left}}/gi, espaco_left) //coloca 50 espaços a esquerda
                                .replace(/\{{espaco_rigth}}/gi, espaco_rigth) //coloca 50 espaços a direita
                                .replace(/\{{ordem}}/gi, ordem)
                                .replace(/\{{data_type}}/gi, data_type);
                        });
                        j2r_rows = rows.join('\n    ');
                        file_name = this.file_name;
                        file_name = file_name.replace('{{schema_create}}', data.schema_create);
                        file_name = file_name.replace('{{table_name}}', data.table_name);
                        file_name = file_name.replace('{{tag}}', this.tag);
                        template = this.template.map(function (tpl) {
                            return tpl.replace(/\{{schema_create}}/gi, data.schema_create)
                                .replace(/\{{table_name}}/gi, data.table_name)
                                .replace(/\{{schema_data}}/gi, data.schema_data)
                                .replace(/\{{ano}}/gi, new Date().getFullYear() + '')
                                .replace(/\{{tag}}/gi, _this.tag)
                                .replace(/\{{j2r_rows}}/gi, j2r_rows);
                        }).join('\n\n\n----------------------------------------------------');
                        this.codigo = template;
                        return [2 /*return*/, {
                                file_name: file_name,
                                codigo: template
                            }];
                }
            });
        });
    };
    return J2rService;
}(base_service_1.BaseService));
exports.J2rService = J2rService;
