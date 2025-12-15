export type SchemaVersion = "1.0";

export type FormSource = {
  name: string;
  type: string;
  evidence: string;
};

export type FieldBase = {
  id: string;
  label: string;
  required?: boolean;
};

export type TextField = FieldBase & { type: "text" };
export type TelField = FieldBase & { type: "tel" };
export type DateField = FieldBase & { type: "date" };
export type TextareaField = FieldBase & { type: "textarea" };

export type YesNoField = FieldBase & { type: "yesNo"; options: ["Yes", "NO"] };
export type TriStateField = FieldBase & {
  type: "triState";
  options: ["Yes", "NO", "NA"];
};
export type BooleanField = FieldBase & { type: "boolean" };
export type MultiTextField = FieldBase & { type: "multiText" };

export type AuditFindingOption = "CONFORMS" | "MINOR_NC" | "MAJOR_NC" | "OFI";
export type AuditFindingField = FieldBase & {
  type: "auditFinding";
  findingOptions: AuditFindingOption[];
  evidence?: { required?: boolean };
};

export type TableColumn =
  | (FieldBase & { type: "text" })
  | (FieldBase & { type: "date" })
  | (FieldBase & { type: "multiText" });

export type TableField = FieldBase & {
  type: "table";
  columns: TableColumn[];
};

export type ObjectProperty =
  | (FieldBase & { type: "text" })
  | (FieldBase & { type: "textarea" })
  | (FieldBase & { type: "multiText" });

export type ObjectField = FieldBase & {
  type: "object";
  properties: Record<string, ObjectProperty>;
};

export type Field =
  | TextField
  | TelField
  | DateField
  | TextareaField
  | YesNoField
  | TriStateField
  | BooleanField
  | MultiTextField
  | AuditFindingField
  | TableField
  | ObjectField;

export type FormSection = {
  id: string;
  title: string;
  fields: Field[];
};

export type FormSchema = {
  id: string;
  title: string;
  source: FormSource;
  complexityLevel: number;
  sections: FormSection[];
};

export type FormsCatalog = {
  schemaVersion: SchemaVersion;
  forms: FormSchema[];
};

/** Answers (kept flexible, but still typed) */
export type FormAnswers = Record<string, unknown>;