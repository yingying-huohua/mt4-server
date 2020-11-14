/**
 *
 */
export interface BaseTask {
    before():void;
    doTask():void;
    after():void;
}
