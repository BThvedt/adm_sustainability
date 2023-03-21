export enum ScormStatusString {
  passed = "passed", // sets completion to 'complete', succss to 'passed', cannot be unset
  completed = "completed", // sets completed to 'complete', no effect on success. If success is failed.. resets to unkown
  failed = "failed", // sets 'success' to failed, completion to 'incomplete'
  incomplete = "incomplete", // default once the user has started the course.. should be unknonwn. undoes 'failed'.. resets to unknon
  // browsed = "browsed",
  // not_attempted = "not attempted",
}

// Animate CSS ^4.1.1
export enum TAttnSeek {
  BOUNCE = "animate__animated animate__bounce",
  FLASH = "animate__animated animate__flash",
  PULSE = "animate__animated animate__pulse",
  RUBBER_BAND = "animate__animated animate__rubberBand",
  SHAKE_X = "animate__animated animate__shakeX",
  SHAKE_Y = "animate__animated animate__shakeY",
  HEAD_SHAKE = "animate__animated animate__headShake",
  SWING = "animate__animated animate__swing",
  TADA = "animate__animated animate__tada",
  WOBBLE = "animate__animated animate__wobble",
  JELLO = "animate__animated animate__jello",
  HEART_BEAT = "animate__animated animate__heartBeat",
  FLIP = "animate__animated animate__flip",
}

export enum TEnter {
  BACK_IN_DOWN = "animate__animated animate__backInDown",
  BACK_IN_LEFT = "animate__animated animate__backInLeft",
  BACK_IN_RIGHT = "animate__animated animate__backInRight",
  BACK_IN_UP = "animate__animated animate__backInUp",
  BOUNCE_IN = "animate__animated animate__bounceIn",
  BOUNCE_IN_DOWN = "animate__animated animate__bounceInDown",
  BOUNCE_IN_LEFT = "animate__animated animate__bounceInLeft",
  BOUNCE_IN_RIGHT = "animate__animated animate__bounceInRight",
  BOUNCE_IN_UP = "animate__animated animate__bounceInUp",
  FADE_IN = "animate__animated animate__fadeIn",
  FADE_IN_DOWN = "animate__animated animate__fadeInDown",
  FADE_IN_DOWN_BIG = "animate__animated animate__fadeInDownBig",
  FADE_IN_LEFT = "animate__animated animate__fadeInLeft",
  FADE_IN_LEFT_BIG = "animate__animated animate__fadeInLeftBig",
  FADE_IN_RIGHT = "animate__animated animate__fadeInRight",
  FADE_IN_RIGHT_BIG = "animate__animated animate__fadeInRightBig",
  FADE_IN_UP = "animate__animated animate__fadeInUp",
  FADE_IN_UP_BIG = "animate__animated animate__fadeInUpBig",
  FADE_IN_TOP_LEFT = "animate__animated animate__fadeInTopLeft",
  FADE_IN_TOP_RIGHT = "animate__animated animate__fadeInTopRight",
  FADE_IN_BOTTOM_LEFT = "animate__animated animate__fadeInBottomLeft",
  FADE_IN_BOTTOM_RIGHT = "animate__animated animate__fadeInBottomRight",
  FLIP_IN_X = "animate__animated animate__flipInX",
  FLIP_IN_Y = "animate__animated animate__flipIny",
  LIGHT_SPEED_IN_RIGHT = "animate__animated animate__lightSpeedInRight",
  LIGHT_SPEED_IN_LEFT = "animate__animated animate__lightSpeedInLeft",
  ROTATE_IN = "animate__animated animate__rotateIn",
  ROTATE_IN_DOWN_LEFT = "animate__animated animate__rotateInDownLeft",
  ROTATE_IN_DOWN_RIGHT = "animate__animated animate__rotateInDownRight",
  ROTATE_IN_UP_LEFT = "animate__animated animate__rotateInUpLeft",
  ROTATE_IN_UP_RIGHT = "animate__animated animate__rotateInUpRight",
  JACK_IN_THE_BOX = "animate__animated animate__jackInTheBox",
  ROLL_IN = "animate__animated animate__rollIn",
  ZOOM_IN = "animate__animated animate__zoomIn",
  ZOOM_IN_DOWN = "animate__animated animate__zoomInDown",
  ZOOM_IN_LEFT = "animate__animated animate__zoomInLeft",
  ZOOM_IN_RIGHT = "animate__animated animate__zoomInRight",
  ZOOM_IN_UP = "animate__animated animate__zoomInUp",
  SLIDE_IN_DONW = "animate__animated animate__slideInDown",
  SLIDE_IN_LEFT = "animate__animated animate__slideInLeft",
  SLIDE_IN_RIGHT = "animate__animated animate__slideInRight",
  SLIDE_IN_UP = "animate__animated animate__slideInUp",
}

export enum TExit {
  BACK_OUT_DOWN = "animate__animated animate__backOutDown",
  BACK_OUT_LEFT = "animate__animated animate__backOutLeft",
  BACK_OUT_RIGHT = "animate__animated animate__backOutRight",
  BACK_OUT_UP = "animate__animated animate__backOutUp",
  BOUNCE_OUT = "animate__animated animate__bounceOut",
  BOUNCE_OUT_DOWN = "animate__animated animate__bounceOutDown",
  BOUNCE_OUT_LEFT = "animate__animated animate__bounceOutLeft",
  BOUNCE_OUT_RIGHT = "animate__animated animate__bounceOutRight",
  BOUNCE_OUT_UP = "animate__animated animate__bounceOutUp",
  FADE_OUT = "animate__animated animate__fadeOut",
  FADE_OUT_DOWN = "animate__animated animate__fadeOutDown",
  FADE_OUT_DOWN_BIG = "animate__animated animate__fadeOutDownBig",
  FADE_OUT_LEFT = "animate__animated animate__fadeOutLeft",
  FADE_OUT_LEFT_BIG = "animate__animated animate__fadeOutLeftBig",
  FADE_OUT_RIGHT = "animate__animated animate__fadeOutRight",
  FADE_OUT_RIGHT_BIG = "animate__animated animate__fadeOutRightBig",
  FADE_OUT_UP = "animate__animated animate__fadeOutUp",
  FADE_OUT_UP_BIG = "animate__animated animate__fadeOutUpBig",
  FADE_OUT_TOP_LEFT = "animate__animated animate__fadeOutTopLeft",
  FADE_OUT_TOP_RIGHT = "animate__animated animate__fadeOutTopRight",
  FADE_OUT_BOTTOM_RIGHT = "animate__animated animate__fadeOutBottomRight",
  FADE_OUT_BOTTOM_LEFT = "animate__animated animate__fadeOutBottomLeft",
  FLIP_OUT_X = "animate__animated animate__flipOutX",
  FLIP_OUT_Y = "animate__animated animate__flipOutY",
  LIGHT_SPEED_OUT_RIGHT = "animate__animated animate__lightSpeedOutRight",
  LIGHT_SPEED_OUT_LEFT = "animate__animated animate__lightSpeedOutLeft",
  ROTATE_OUT = "animate__animated animate__rotateOut",
  ROTATE_OUT_DOWN_LEFT = "animate__animated animate__rotateOutDownLeft",
  ROTATE_OUT_DOWN_RIGHT = "animate__animated animate__rotateOutDownRight",
  ROTATE_OUT_UP_LEFT = "animate__animated animate__rotateOutUpLeft",
  ROTATE_OUT_UP_RIGHT = "animate__animated animate__rotateOutUpRight",
  HINGE = "animate__animated animate__hinge",
  ROLL_OUT = "animate__animated animate__rollOut",
  ZOOM_OUT = "animate__animated animate__zoomOut",
  ZOOM_OUT_DOWN = "animate__animated animate__zoomOutDown",
  ZOOM_OUT_LEFT = "animate__animated animate__zoomOutLeft",
  ZOOM_OUT_RIGHT = "animate__animated animate__zoomOutRight",
  ZOOM_OUT_UP = "animate__animated animate__zoomOutUp",
  SLIDE_OUT_DOWN = "animate__animated animate__slideOutDown",
  SLIDE_OUT_LEFT = "animate__animated animate__slideOutLeft",
  SLIDE_OUT_RIGHT = "animate__animated animate__slideOutRight",
  SLIDE_OUT_UP = "animate__animated animate__slideOutUp",
}

// the way these work TTimes (should be TTimeClasses) and TDuration should always have the same keys
export enum TTimes {
  SLOW = "slow-speed",
  REGULAR = "regular-speed",
  MEDIUM = "medium-speed",
  FAST = "fast-speed",
  VERY_FAST = "very-fast-speed",
}

export enum TDuration {
  SLOW = 1500,
  REGULAR = 1000,
  MEDIUM = 600,
  FAST = 300,
  VERY_FAST = 150,
}

// enum Transitions {
//   AttnSeek: AttnSeek
//   Enter: Enter
//   Exits: Exits
//   Times: Times
// }
