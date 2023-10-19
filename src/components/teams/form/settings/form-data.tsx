import { ImGithub } from '@react-icons/all-files/im/ImGithub';
import { ImTwitter } from '@react-icons/all-files/im/ImTwitter';
import { ImLink } from '@react-icons/all-files/im/ImLink';
import { RegisterOptions } from 'react-hook-form';

export const FIELDS = {
  bio: 'bio',
  name: 'name',
  website: 'website',
  github: 'github',
  twitter: 'twitter',
  color: 'color',
} as const;

export type FieldName = (typeof FIELDS)[keyof typeof FIELDS];

export interface FieldData {
  id: FieldName;
  input: 'text' | 'textarea';
  inputType: 'text' | 'email' | 'password' | 'url';
  defaultValue?: string;
  label: string;
  placeholder: string;
  registerOptions?: RegisterOptions;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  prefix?: string;
}

export const fieldsData: FieldData[] = [
  {
    id: FIELDS.name,
    input: 'text',
    inputType: 'text',
    label: 'Team name',
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
];
