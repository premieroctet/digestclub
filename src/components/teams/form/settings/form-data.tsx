import { SelectOptionProps } from '@/components/Input';
import { ImGithub } from '@react-icons/all-files/im/ImGithub';
import { ImLink } from '@react-icons/all-files/im/ImLink';
import { ImTwitter } from '@react-icons/all-files/im/ImTwitter';
import { RegisterOptions } from 'react-hook-form';

export const FIELDS = {
  avatar: 'avatar',
  bio: 'bio',
  name: 'name',
  website: 'website',
  github: 'github',
  twitter: 'twitter',
  color: 'color',
  prompt: 'prompt',
} as const;

export type FieldName = (typeof FIELDS)[keyof typeof FIELDS];

export interface TextFieldData {
  id: FieldName;
  input: 'text' | 'textarea' | 'select';
  inputType: 'text' | 'email' | 'password' | 'url';
  defaultValue?: string;
  label: string;
  placeholder: string;
  registerOptions?: RegisterOptions;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  prefix?: string;
  selectDefault?: string;
  selectOptions?: SelectOptionProps[];
  maxLength?: number;
}

export const textFieldsData: TextFieldData[] = [
  {
    id: FIELDS.name,
    input: 'text',
    inputType: 'text',
    label: 'Name',
    placeholder: 'Team name',
    registerOptions: {
      required: 'Team name is required',
    },
  },
  {
    id: FIELDS.bio,
    input: 'textarea',
    inputType: 'text',
    label: 'Bio',
    placeholder: 'Tell us about your team',
    registerOptions: {
      maxLength: {
        value: 160,
        message: 'Bio must be less than 160 characters',
      },
    },
  },
  {
    id: FIELDS.website,
    input: 'text',
    inputType: 'url',
    label: 'Website',
    rightElement: <ImLink />,
    placeholder: 'https://company.io',
  },
  {
    id: FIELDS.github,
    input: 'text',
    inputType: 'text',
    label: 'Github',
    rightElement: <ImGithub />,
    prefix: '@',
    placeholder: '',
  },
  {
    id: FIELDS.twitter,
    input: 'text',
    inputType: 'text',
    label: 'Twitter',
    rightElement: <ImTwitter />,
    prefix: '@',
    placeholder: '',
  },
  {
    id: FIELDS.prompt,
    input: 'textarea',
    inputType: 'text',
    label: 'Summary generator prompt',
    placeholder:
      'Add a custom prompt for bookmark summary generation. Your prompt will be followed by : + article content',
    maxLength: 4000,
  },
];
