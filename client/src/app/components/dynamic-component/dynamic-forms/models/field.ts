import { UntypedFormGroup } from '@angular/forms';
import { FieldConfig } from './field-config';

export interface Field {
  config: FieldConfig,
  group: UntypedFormGroup
}