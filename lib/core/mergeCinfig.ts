interface StratFn {
  (val1: unknown, val2: unknown): any
}

const defaultStrat: StratFn = (val1, val2) => {
  return val2 ?? val1
}

const fromVal2Strat: StratFn = (_val1, val2) => {
  if (typeof val2 != null) {
    return val2
  }
}
