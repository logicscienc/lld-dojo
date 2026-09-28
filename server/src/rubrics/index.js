import { parkingLotRubric } from "./parkingLotRubric.js";
import { vendingMachineRubric } from "./vendingMachineRubric.js";
import { elevatorRubric } from "./elevatorRubric.js";

const rubrics = {
  [parkingLotRubric.problem]: parkingLotRubric,
  [vendingMachineRubric.problem]: vendingMachineRubric,
  [elevatorRubric.problem]: elevatorRubric,
};

export function getRubric(problemSlug) {
  return rubrics[problemSlug] ?? null;
}