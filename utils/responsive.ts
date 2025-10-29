import { Dimensions, Platform, PixelRatio, StatusBar } from 'react-native';

const { width: screenWidth, height: rawScreenHeight } = Dimensions.get('window');

// Guideline sizes are based on a typical mobile device 
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 500;

// On Android the status bar (and sometimes navigation bar) reduces usable height.
// Subtract StatusBar.currentHeight when available so vertical scaling feels correct.
const androidStatusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
const screenHeight = Platform.OS === 'android' ? rawScreenHeight - androidStatusBarHeight : rawScreenHeight;

/**
 * Scales a size based on the screen width.
 * @param size The size to scale.
 * @returns The scaled size.
 */
const scale = (size: number) => (screenWidth / guidelineBaseWidth) * size;

/**
 * Scales a size based on the screen height.
 * @param size The size to scale.
 * @returns The scaled size.
 */
const verticalScale = (size: number) => (screenHeight / guidelineBaseHeight) * size;

/**
 * Scales a size moderately, taking into account both width and height.
 * @param size The size to scale.
 * @param factor The factor to use for scaling.
 * @returns The scaled size.
 */
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

/**
 * Calculates a responsive font size based on the screen dimensions.
 * @param size The base font size.
 * @returns The responsive font size.
 */
const responsiveFontSize = (size: number) => {
  const scaleValue = Math.min(screenWidth / guidelineBaseWidth, screenHeight / guidelineBaseHeight);
  const newSize = size * scaleValue;
  if (Platform.OS === 'android') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export { scale, verticalScale, moderateScale, responsiveFontSize };
