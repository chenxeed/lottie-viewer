import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Criteria } from "../store/types";
import { useStateCriteria, useStateSetCriteria } from "../store/assets";

const criteriaOption = [
  Criteria.ALL,
  Criteria.GAME,
  Criteria.NATURE,
  Criteria.PEOPLE,
  Criteria.SCIENCE,
  Criteria.SHAPE,
  Criteria.TECH,
];

export const FilterForm = () => {
  const criteria = useStateCriteria();
  const setCriteria = useStateSetCriteria();

  const onChangeCriteria = async (ev: SelectChangeEvent) => {
    ev.preventDefault();
    const target = ev.target as HTMLSelectElement;
    const value = target.value as Criteria;
    setCriteria(value);
  };

  return (
    <div className="relative w-[300px]">
      <div className="md:flex w-full px-3 mb-6 md:mb-0 lg:absolute lg:top-0 lg:left-[">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-2">
          Criteria
        </label>
        <div className="mt-2 md:mt-0 md:ml-2 w-full">
          <Box sx={{ minWidth: 80, maxWidth: 200, width: "full" }}>
            <FormControl fullWidth>
              <Select
                id="filter-criteria"
                value={criteria}
                onChange={onChangeCriteria}
              >
                {criteriaOption.map((criteria, idx) => (
                  <MenuItem key={idx} value={criteria}>
                    {criteria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
    </div>
  );
};
