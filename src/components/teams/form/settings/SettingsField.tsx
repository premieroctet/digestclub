import { Input, Select, TextArea } from '@/components/Input';
import { useFormContext } from 'react-hook-form';
import { TextFieldData } from './form-data';

export default function SettingsField({
  id,
  input,
  inputType,
  defaultValue,
  label,
  placeholder,
  registerOptions,
  prefix,
  rightElement,
  selectDefault,
  selectOptions,
  maxLength,
}: TextFieldData) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <fieldset
      aria-invalid={!!errors[id]}
      className="group w-full flex flex-col gap-2 items-stretch"
    >
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>

      <div className="mt-2 w-full">
        <>
          {input === 'select' && selectOptions?.length && (
            <Select
              {...register(id, {
                ...(!!registerOptions && registerOptions),
              })}
              defaultValue={selectDefault}
              options={selectOptions}
            />
          )}
          {input === 'text' && (
            <div className="px-3 py-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
              {!!prefix && (
                <span className="flex select-none items-center text-gray-500 sm:text-base">
                  {prefix}
                </span>
              )}
              <Input
                className="flex-1 pl-1 !ring-0 !shadow-none"
                placeholder={placeholder}
                defaultValue={defaultValue || ''}
                type={inputType}
                {...register(id, {
                  ...(!!registerOptions && registerOptions),
                })}
              />
              {rightElement && (
                <span
                  className="text-gray-500 flex items-center p-2"
                  aria-hidden
                >
                  {rightElement}
                </span>
              )}
            </div>
          )}
          {input === 'textarea' && (
            <TextArea
              defaultValue={defaultValue || ''}
              placeholder={placeholder}
              maxLength={maxLength}
              {...register(id, {
                ...(!!registerOptions && registerOptions),
              })}
            />
          )}
        </>
        {!!errors[id] && (
          <p className="mt-3 text-sm leading-6 text-red-500">
            {errors[id]?.message?.toString()}
          </p>
        )}
      </div>
    </fieldset>
  );
}
