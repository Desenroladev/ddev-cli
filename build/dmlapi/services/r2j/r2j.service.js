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
exports.R2jService = void 0;
var base_service_1 = require("../base/base.service");
var R2jService = /** @class */ (function (_super) {
    __extends(R2jService, _super);
    function R2jService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = 'r2j';
        _this.template = ["\ncreate or replace function {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(\n    fr_data {{schema_data}}.{{table_name}}\n)\nreturns jsonb\n    language plpgsql\nAS $function$\n------------------------------------------------------------------\n-- LIVNOW: LIV Noop Of Work\n------------------------------------------------------------------\n-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)\n-- (c) Copyright {{ano}} desenroladev.com.br\n------------------------------------------------------------------\n-- {{schema_data}}.{{table_name}}: record to jsonb\n------------------------------------------------------------------\ndeclare\n    lv_jsonb jsonb;\nbegin\n    lv_jsonb := row_to_json(fr_data,  -- record\n                            true);    -- pretty_bool\n    return lv_jsonb;\nend;\n$function$\n;"];
        return _this;
    }
    return R2jService;
}(base_service_1.BaseService));
exports.R2jService = R2jService;
