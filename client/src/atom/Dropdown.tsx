import React, { ChangeEvent } from 'react';

interface Prop {
  options: string[];
  value?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export const Dropdown = (props: Prop) => {
  return (
    <select
      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      value={props.value}
      onChange={props.onChange}>
      {props.options.map((option, idx) => (
        <option key={idx}>{option}</option>
      ))}
    </select>
  )
}