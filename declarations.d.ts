declare module '*';

declare module Mongo {

    interface Collection {
        aggregate(args: any, filter: any): Array<any>;
    }
}
