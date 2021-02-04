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
exports.PurgeService = void 0;
var base_service_1 = require("../base/base.service");
var PurgeService = /** @class */ (function (_super) {
    __extends(PurgeService, _super);
    function PurgeService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = 'purge';
        _this.template = ["\ncreate or replace function {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(\n    fv_id uuid\n)\nreturns void language plpgsql\nas $function$\n------------------------------------------------------------------\n-- LIVSYNC: Quality Assurance Testing\n------------------------------------------------------------------\n-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)\n-- (c) Copyright {{ano}} desenroladev.com.br\n------------------------------------------------------------------\n-- dmlapi_{{table_name}}_purge: delete or set inactive\n------------------------------------------------------------------\ndeclare\n  lr_data    {{schema_data}}.{{table_name}};\nbegin\n    if (fv_id is not null) then\n    lr_data := {{schema_data}}.dmlapi_{{table_name}}_select(fv_id      => fv_id,\n                                                            fv_locking => true);\n    if (lr_data.id is not null) then\n      delete --+ qb_name(dmlapi_{{table_name}}_purge)\n      from {{schema_data}}.{{table_name}}    a\n      where 1e1 = 1e1\n          and a.id = lr_data.id;\n    end if;\n    end if;\nexception when others then\n    raise;\nend;\n$function$\n;",
            "create or replace function {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(\n    fr_data {{schema_data}}.{{table_name}}\n)\nreturns void language plpgsql\nas $function$\n------------------------------------------------------------------\n-- LIVSYNC: Quality Assurance Testing\n------------------------------------------------------------------\n-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)\n-- (c) Copyright {{ano}} desenroladev.com.br\n------------------------------------------------------------------\n-- dmlapi_{{table_name}}_{{tag}}: delete or set inactive\n------------------------------------------------------------------\ndeclare\nbegin\n  if (fr_data.id is not null) then\n    perform {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(fv_id => fr_data.id);\n  end if;\nexception when others then\n  raise;\nend;\n$function$\n;",
            "create or replace function {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(\n    ft_data {{schema_data}}.{{table_name}}[]\n)\nreturns void language plpgsql\nas $function$\n------------------------------------------------------------------\n-- LIVSYNC: Quality Assurance Testing\n------------------------------------------------------------------\n-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)\n-- (c) Copyright {{ano}} desenroladev.com.br\n------------------------------------------------------------------\n-- dmlapi_{{table_name}}_{{tag}}: delete or set inactive\n------------------------------------------------------------------\ndeclare\n  lr_data    {{schema_data}}.{{table_name}};\nbegin\n  foreach lr_data in array ft_data loop\n    perform {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(fv_id => lr_data.id);\n  end loop;\nexception when others then\n  raise;\nend;\n$function$\n;"
        ];
        return _this;
    }
    return PurgeService;
}(base_service_1.BaseService));
exports.PurgeService = PurgeService;
