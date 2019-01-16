import _ from "lodash";
import Ajv from "ajv"; // JSON verification library
import * as Transformers from "./transformers";

/**
 * Used for transforming and validating config objects
 */
export default class ConfigTransformer {
  /**
   * Constructs a new transformer
   */
  constructor() {
    this._type = "main";
    this.ajv = new Ajv({ "allErrors": true });
  }

  /**
   * Returns the config schema for the given version
   * @param {number} version The schema version to get
   */
  _getSchema(version) {
    return Transformers.schemaMatrix[this._type][`v${version}`];
  }

  /**
   * @return {number} The latest available config version
   */
  get latest() {
    return _.max(Transformers.versions[this._type]);
  }

  /**
   * Transforms the given configuration to the latest version
   * @param {object} config The config object to transform
   */
  transform(config) { // TODO: Implement checksum stuff
    const cVer = config.version;
    let newConfig = config;
    if (cVer < this.latest) {
      for (let i = cVer + 1; i <= this.latest; i++) {
        newConfig = Transformers.converterMatrix[this._type][`v${i}`](newConfig);
        if (!this.validateSync(newConfig, i)) {
          throw new SyntaxError(`Config file ${this._type} failed to validate after transformation from ${i - 1} to ${i}`);
        }
      }
    }
    return newConfig;
  }

  /**
   * Performs a non-mutating validation on the given config
   * @param {object} config The configuration object to validate
   * @param {number} version The schema version to validate against
   */
  async validate(config, version) {
    const test = await this.ajv.compileAsync(this._getSchema(version));
    return test(config);
  }

  /**
   * Performs a synchronous non-mutating validation on the given config
   * @param {object} config The configuration object to validate
   * @param {number} version The schema version to validate against
   */
  validateSync(config, version) {
    const test = this.ajv.compile(this._getSchema(version));
    return test(config);
  }
}
