export type FormId = string;

export type FieldType =
  | "text"
  | "textarea"
  | "tel"
  | "number"
  | "date"
  | "boolean"
  | "yesNo"
  | "triState"
  | "select"
  | "multiSelect"
  | "multiText"
  | "table"
  | "object"
  | "auditFinding";

export type BaseField = {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
};

export type OptionField = BaseField & {
  options: readonly string[];
};

export type AuditFindingField = BaseField & {
  type: "auditFinding";
  findingOptions: readonly ("CONFORMS" | "MINOR_NC" | "MAJOR_NC" | "OFI")[];
  evidence?: { required?: boolean };
};

export type TableColumn =
  | (BaseField & { type: Exclude<FieldType, "table" | "object"> })
  | OptionField;

export type TableField = BaseField & {
  type: "table";
  columns: readonly TableColumn[];
};

export type ObjectField = BaseField & {
  type: "object";
  properties: Record<string, BaseField | OptionField>;
};

export type Field = BaseField | OptionField | AuditFindingField | TableField | ObjectField;

export type FormSection = {
  id: string;
  title: string;
  fields: readonly Field[];
};

export type FormDefinition = {
  id: FormId;
  title: string;
  tags: readonly string[];
  complexityLevel: 1 | 2 | 3 | 4 | 5;
  source: { name: string; type: string; evidence: string };
  sections: readonly FormSection[];
};

export type FormCatalog = {
  schemaVersion: string;
  forms: readonly FormDefinition[];
};

// Response payload (what you persist)
export type FormResponse = {
  formId: FormId;
  submittedAt: string; // ISO string
  answers: Record<string, unknown>; // keyed by field.id
};

export type FormComplexity = 1 | 2 | 3 | 4 | 5;

export type FormMeta = {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  complexityLevel: FormComplexity;
  image: {
    alt: string;
    src: string; // public/ path or remote URL
  };
};

export type FormsMetaResponse = {
  forms: FormMeta[];
};