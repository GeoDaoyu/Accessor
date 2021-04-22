export class Accessor {
  constructor(obj?: any);

  declaredClass: string;

  get<T>(propertyName: string): T;
  get(propertyName: string): any;
  set<T>(propertyName: string, value: T): this;
  set(props: Set<any>): this;
  watch(path: string | string[], callback: WatchCallback): WatchHandle;

  protected notifyChange(propertyName: string): void;
  protected _get(propertyName: string): any;
  protected _get<T>(propertyName: string): T;
  protected _set<T>(propertyName: string, value: T): this;
}

export type WatchCallback = (newValue: any, oldValue: any, propertyName: string, target: Accessor) => void;

export interface WatchHandle extends Object {
  /**
   * Removes the watch handle.
   */
  remove(): void;
}