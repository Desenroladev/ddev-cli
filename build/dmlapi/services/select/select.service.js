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
exports.SelectService = void 0;
var base_service_1 = require("../base/base.service");
var SelectService = /** @class */ (function (_super) {
    __extends(SelectService, _super);
    function SelectService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = 'select';
        _this.template = ["\ncreate or replace function {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(\n    fv_id uuid, \n    fv_locking boolean default false\n)\nreturns {{schema_data}}.{{table_name}}\n    language plpgsql\nas $function$\n------------------------------------------------------------------\n-- LIVNOW: LIV Noop Of Work\n------------------------------------------------------------------\n-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)\n-- (c) Copyright {{ano}} desenroladev.com.br\n------------------------------------------------------------------\n-- {{schema_data}}.{{table_name}}: select to record\n------------------------------------------------------------------\ndeclare\n    fr_data {{schema_data}}.{{table_name}};\nbegin\n    if (fv_id is not null) then\n    if (fv_locking) then\n        select --+ qb_name(dmlapi_{{table_name}}_select)\n                a.*\n        into fr_data\n        from {{schema_data}}.{{table_name}}    a\n        where 1e1 = 1e1\n            and a.id = fv_id\n            for update nowait;\n    else\n        select --+ qb_name(dmlapi_{{table_name}}_select)\n                a.*\n        into fr_data\n        from {{schema_data}}.{{table_name}}    a\n        where 1e1 = 1e1\n            and a.id = fv_id;\n    end if;\n    end if;\n    return fr_data;\nend;\n$function$\n;"];
        return _this;
    }
    return SelectService;
}(base_service_1.BaseService));
exports.SelectService = SelectService;
