import { readFileSync } from 'fs';
import YAML from 'yaml';

export function loadYamlConfig(path: string) {
  const file = readFileSync(path, { encoding: 'utf8' });
  return YAML.parse(file);
  }