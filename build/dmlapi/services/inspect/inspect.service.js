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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectService = void 0;
var base_service_1 = require("../base/base.service");
var InspectService = /** @class */ (function (_super) {
    __extends(InspectService, _super);
    function InspectService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.file_name = "inbound_{{table_name}}_{{tag}}.sql";
        _this.tag = 'inspect';
        _this.template = [
            "create or replace function {{schema_create}}.inbound_{{table_name}}_{{tag}}(\n    fv_jsonb jsonb[]\n)\n    returns table(data jsonb[], erros jsonb)\n    language plpgsql\nas $function$\n------------------------------------------------------------------\n-- LIVNOW: LIV Noop Of Work\n------------------------------------------------------------------\n-- (c) Copyright 2020 Antoniel Lima (antonielliimma@gmail.com)\n-- (c) Copyright 2020 desenroladev.com.br\n------------------------------------------------------------------\n-- {{schema_data}}.{{table_name}}[]: jsonb to collection\n------------------------------------------------------------------\ndeclare\n    lr_rrow         {{schema_data}}.{{table_name}};\n    lr_jrow         jsonb;\n    lr_count        int     := 1;\n    lv_data         jsonb[];\n    lv_erro         jsonb   := '{}';\n    lv_erros        jsonb   := '[]';\n    lr_data         jsonb   := '[]';\nbegin\n--------------------------------------------------------------------------------------------\n    foreach lr_jrow in array fv_jsonb loop   \n    begin\n--------------------------------------------------------------------------------------------\n        perform {{schema_data}}.dmlapi_{{table_name}}_j2r(fv_jsonb => lr_jrow);\n        lv_data[lr_count] := lr_jrow;\n        lr_count = lr_count + 1;\n--------------------------------------------------------------------------------------------\n    exception when others then\n--------------------------------------------------------------------------------------------\n        lr_count = lr_count + 1;\n        lv_erro := lr_jrow::jsonb || jsonb_build_object('erros', jsonb_build_object(\n                                                                    'code', sqlstate, \n                                                                    'sqlstate', sqlerrm\n                                                                )\n                                                        );\n        lv_erros := lv_erros || lv_erro;\n    end;\n--------------------------------------------------------------------------------------------\n    end loop;\n--------------------------------------------------------------------------------------------\n    return query select lv_data, lv_erros;\nend;\n$function$\n;\n"
        ];
        return _this;
    }
    return InspectService;
}(base_service_1.BaseService));
exports.InspectService = InspectService;
