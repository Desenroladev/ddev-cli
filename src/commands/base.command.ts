
export abstract class BaseCommand {
    abstract execute(options: any) : Promise<any>;
}