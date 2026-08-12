export type Capitalization = 'UPPERCASE' | 'LOWERCASE' | 'AS_IS';

// Mismos idiomas que el selector de idioma de la app (LangSelector)
export type LanguageProfile = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt';

export interface FieldDefinition {
  id: string;
  label: string; // The UI label or i18n key for the form field
  capitalization: Capitalization;
  type?: 'text' | 'select';
  options?: string[];
}

export interface BranchFormatTemplate {
  id: string;
  name: string;
  templateString: string;
  fields: FieldDefinition[];
  language: LanguageProfile; // Idioma usado para el saneado de caracteres (ñ, /, etc.)
  isReadonly: boolean;
  isVisible: boolean;
}
