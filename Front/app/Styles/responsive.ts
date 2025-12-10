import { scale, moderateScale, verticalScale } from "react-native-size-matters";

export const rS = (size: number) => {
  return scale(size);
};

export const vS = (size: number) => {
  return verticalScale(size);
};

export const mS = (size: number, factor?: number) => {
  return moderateScale(size, factor);
};
