export type FormatOperation =
  | 'UPPERCASE'
  | 'LOWERCASE'
  | 'REPLACE_SLASHES' // replace '/' with '-o-'
  | 'REPLACE_DOTS' // replace '.' with '-'
  | 'REPLACE_SPACES' // replace ' ' with '-'
  | 'REMOVE_MULTIPLE_DASHES'
  | 'SET_NY' // replace 'ñ' with 'ny'
  | 'REMOVE_ACCENTS'
  | 'REMOVE_SPECIAL_CHARS' // remove everything except a-zA-Z0-9-
  | 'BASIC_CLEAN'; // combination of replace dots, spaces, multiple dashes and special chars

export interface FieldDefinition {
  id: string;
  label: string; // The UI label or i18n key for the form field
  operations: FormatOperation[];
}

export interface BranchFormatTemplate {
  id: string;
  name: string;
  templateString: string;
  fields: FieldDefinition[];
  isReadonly: boolean;
  isVisible: boolean;
}
