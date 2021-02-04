
import { BaseService } from '../base/base.service';


export class C2jService extends BaseService {
    
    tag = 'c2j';
    template = [`
create or replace function {{schema_create}}.dmlapi_{{table_name}}_{{tag}}(
    ft_data             {{schema_data}}.{{table_name}}[]
)
returns jsonb
language plpgsql
as $function$
------------------------------------------------------------------
-- LIVNOW: LIV Noop Of Work
------------------------------------------------------------------
-- (c) Copyright {{ano}} Antoniel Lima (antonielliimma@gmail.com)
-- (c) Copyright {{ano}} desenroladev.com.br
------------------------------------------------------------------
-- {{schema_data}}.{{table_name}}[]: collection to json
------------------------------------------------------------------
declare
    
begin
    return array_to_json(ft_data);
end;
$function$
;
`];

}
