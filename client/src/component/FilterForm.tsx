import { Criteria } from "../store/types";
import { useStateCriteria, useStateSetCriteria } from "../store/assets";
import { Select } from "../atoms/Select";
import { ChangeEvent } from "react";

const criteriaOption = [
  Criteria.ALL,
  Criteria.GAME,
  Criteria.NATURE,
  Criteria.PEOPLE,
  Criteria.SCIENCE,
  Criteria.SHAPE,
  Criteria.TECH,
].map((criteria) => ({ label: criteria, value: criteria }));

export const FilterForm = () => {
  // Shared state

  const criteria = useStateCriteria();
  const setCriteria = useStateSetCriteria();

  // Event listener

  const onChangeCriteria = async (ev: ChangeEvent) => {
    ev.preventDefault();
    const target = ev.target as HTMLSelectElement;
    const value = target.value as Criteria;
    setCriteria(value);
  };

  return (
    <div className="min-w-[150px]">
      <Select
        label="Criteria"
        value={criteria}
        options={criteriaOption}
        onChange={onChangeCriteria}
      />
    </div>
  );
};
