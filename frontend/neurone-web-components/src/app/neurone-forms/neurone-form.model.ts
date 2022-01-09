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
  title: string;
  hint: string;
  name: string;
  value: string;
  placeholder?: string;
  type: string;
  stars: number;
  choices?: string[];
  scaleOptions: JsonScaleControls;
  validators: JsonFormValidators;
}

export interface JsonFormData {
  formName: string;
  controls: JsonFormControls[];
}
