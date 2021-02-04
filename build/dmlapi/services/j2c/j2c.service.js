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
exports.J2cService = void 0;
var base_service_1 = require("../base/base.service");
var J2cService = /** @class */ (function (_super) {
    __extends(J2cService, _super);
    function J2cService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = 'j2c';
        _this.template = ["\ncreate or replace function {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(\n    fv_jsonb    jsonb[]\n) returns {{schema_data}}.{{table_name}}[]\n    language plpgsql\nas $function$\n------------------------------------------------------------------\n-- LIVNOW: LIV Noop Of Work\n------------------------------------------------------------------\n-- (c) Copyright 2020 Antoniel Lima (antonielliimma@gmail.com)\n-- (c) Copyright 2020 desenroladev.com.br\n------------------------------------------------------------------\n-- {{schema_data}}.{{table_name}}[]: jsonb to collection\n------------------------------------------------------------------\ndeclare\n    lr_rrow         {{schema_data}}.{{table_name}};\n    lr_jrow         jsonb;\n    lr_count        int := 1;\n    lv_data         {{schema_data}}.{{table_name}}[];\nbegin\n    foreach lr_jrow in array fv_jsonb loop\n        lr_rrow := {{schema_create}}.dmlapi_{{table_name}}_j2r(fv_jsonb => lr_jrow);\n        lv_data[lr_count] := lr_rrow;\n        lr_count = lr_count + 1;\n    end loop;\n    return lv_data;\nend;\n$function$\n;\n"];
        return _this;
    }
    return J2cService;
}(base_service_1.BaseService));
exports.J2cService = J2cService;
