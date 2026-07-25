export type RandomSource = () => number;

/**
 * 같은 seed를 사용하면 항상 같은 난수 순서를 반환합니다.
 *
 * 개발 중 경기 결과를 재현하기 위해 사용합니다.
 */
export function createSeededRandom(
  seed: number,
): RandomSource {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;

    let value = state;

    value = Math.imul(
      value ^ (value >>> 15),
      value | 1,
    );

    value ^= value + Math.imul(
      value ^ (value >>> 7),
      value | 61,
    );

    return (
      ((value ^ (value >>> 14)) >>> 0) /
      4294967296
    );
  };
}

export function randomInteger(
  minimum: number,
  maximum: number,
  random: RandomSource,
): number {
  return Math.floor(
    random() * (maximum - minimum + 1),
  ) + minimum;
}

type WeightedItem<T> = {
  value: T;
  weight: number;
};

/**
 * 각 값의 weight를 기준으로 하나를 무작위 선택합니다.
 */
export function weightedChoice<T>(
  items: WeightedItem<T>[],
  random: RandomSource,
): T {
  if (items.length === 0) {
    throw new Error(
      "weightedChoice에는 하나 이상의 항목이 필요합니다.",
    );
  }

  const totalWeight = items.reduce(
    (sum, item) =>
      sum + Math.max(item.weight, 0),
    0,
  );

  if (totalWeight <= 0) {
    return items[0].value;
  }

  let cursor = random() * totalWeight;

  for (const item of items) {
    cursor -= Math.max(item.weight, 0);

    if (cursor <= 0) {
      return item.value;
    }
  }

  return items[items.length - 1].value;
}

export function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.max(
    minimum,
    Math.min(maximum, value),
  );
}