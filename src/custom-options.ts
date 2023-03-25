import { CustomKey } from './custom-key';
import { CustomValue } from './custom-value';

/**
 * Custom options which can be defined by developer and attached to a metadata. This
 * allows to define custom behaviours for type manager plugins. Custom key is a unique typed key
 * defined in the code. It allows to get back strongly typed values.
 * 
 * @type {CustomOptions}
 */
export type CustomOptions = Array<[CustomKey<any>, CustomValue]>;
