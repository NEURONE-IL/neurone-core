export interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: boolean;
  maxLength?: boolean;
  pattern?: string;
  nullValidator?: boolean;
}

export interface JsonScaleControls {
  min: number;
  max: number;
  step: number;
  minLabel?: string;
  maxLabel?: string
}

export interface JsonFormControls {
  title: string; // main question / query
  hint: string; // small text below the input
  name: string; // internal ID
  placeholder?: string; // // placeholder answer
  rows?: number; // number of rows (textarea only)
  type: string;
  stars: number;
  choices?: string[];
  scaleOptions: JsonScaleControls;
  validators: JsonFormValidators;
}

export interface JsonFormData {
  formName: string;
  questions: JsonFormControls[];
}
