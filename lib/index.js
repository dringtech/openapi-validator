const OpenAPISchemaValidator = require('openapi-schema-validator').default;
const YAML = require('yaml');
const fs = require('promise-fs');
const validator = new OpenAPISchemaValidator({ version: 3 });

async function loadSpec(path) {
  const spec = YAML.parse(await fs.readFile(path, { encoding: 'utf-8' }))
  return spec;
}

async function validate(spec) {
  return validator.validate(spec);
}

async function lint(spec) {
  const errors = [];
  const noOperationId = Object.entries(spec.paths).map(([path, methods]) => {
    return Object.entries(methods)
      .filter(([method, definition]) => definition.operationId === undefined)
      .map((([method, definition]) => `paths.${path}.${method}`));
  }).filter(_ => _.length > 0);

  return { noOperationId };
}

module.exports = {
  loadSpec,
  validate,
  lint,
}
