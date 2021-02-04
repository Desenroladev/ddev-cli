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
exports.MtaService = void 0;
var base_service_1 = require("../base/base.service");
var MtaService = /** @class */ (function (_super) {
    __extends(MtaService, _super);
    function MtaService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.file_name = "inbound_{{table_name}}_{{tag}}.sql";
        _this.tag = 'mta';
        _this.template = ["\ncreate or replace function {{schema_create}}.inbound_{{table_name}}_{{tag}}(fr_data jsonb)\nreturns jsonb\nlanguage plpgsql\nAS $function$\n    ------------------------------------------------------------------\n    -- livsync: Quality Assurance Testing\n    ------------------------------------------------------------------\n    -- (c) Copyright 2020 Antoniel Lima (antonielliimma@gmail.com)\n    -- (c) Copyright 2020 desenroladev.com.br\n    ------------------------------------------------------------------\n    -- {{schema_create}}.inbound_{{table_name}}_{{tag}}: Map Transform Apply API\n    ------------------------------------------------------------------\n    declare\n    lv_index        int;\n    lv_source_id    varchar(150);\n    lv_id           uuid;\n    lr_data         jsonb[];\n    lv_i\t        jsonb;\n    lv_erros        jsonb := '[]';\n    lv_erro         jsonb := '{}';\n    lv_rec   \t\trecord;\n    ------------------------------------------\n    lr_{{table_name}}_arr       {{schema_data}}.{{table_name}}[];\n    lr_{{table_name}}           {{schema_data}}.{{table_name}};\n    ------------------------------------------\n    lv_apply_start  timestamp;\n    lv_apply_end    timestamp;\nbegin\n    ------------------------------------------------------------------------------------\n    lv_apply_start := clock_timestamp();\n    ------------------------------------------------------------------------------------\n    if (fr_data is not null) then\n        lr_data := {{schema_create}}.inbound_{{table_name}}_scatter(fr_payload => fr_data);\n    ---------------------------{{schema_data}}.livnow_pessoa-------------------------------------\n        if (lr_data is not null) then\n        lv_rec := {{schema_create}}.inbound_{{table_name}}_inspect(fv_jsonb => lr_data);\n        lv_erros := lv_erros || lv_rec.\"erros\";\n    ------------------------------------------------------------------------------------\n    lr_{{table_name}}_arr := {{schema_data}}.dmlapi_{{table_name}}_j2c(fv_jsonb => lv_rec.\"data\");\n    ------------------------LOOP--------------------------------------------------------                                    \n        lv_index := 1;\n        foreach lr_{{table_name}} in array lr_{{table_name}}_arr loop\n            ---------------------------------------------------\n            lv_source_id := lr_{{table_name}}.source_id;\n            ---------------------------------------------------\n            select \n            p.id into lv_id\n            from {{schema_data}}.{{table_name}} p \n            where p.source_id = lv_source_id;\n            ---------------------------------------------------\n            if lv_id is null then\n            lv_id := gen_random_uuid();\n            end if;\n            ---------------------------------------------------\n            lr_{{table_name}}.id            := lv_id;\n            lr_{{table_name}}_arr[lv_index] := lr_{{table_name}};\n            lv_index := lv_index + 1;\n        end loop;\n    --------------------------------------------------------------------\n        lv_erro  := {{schema_data}}.dmlapi_{{table_name}}_merge(fr_data => lr_{{table_name}}_arr);\n        lv_erros := lv_erros || lv_erro;\n    ------------------------------------------------------------------------------------\n        end if;\n    end if;\n\n    lv_apply_end := clock_timestamp();\n    raise info '{{schema_create}}.inbound_{{table_name}}_mta in [%]', (lv_apply_end - lv_apply_start);\n    return lv_erros;\n    --commit; -- ERROR: cannot commit while a subtransaction is active\n    exception when others then\n        raise;\n    end;\n$function$;\n"];
        return _this;
    }
    return MtaService;
}(base_service_1.BaseService));
exports.MtaService = MtaService;
