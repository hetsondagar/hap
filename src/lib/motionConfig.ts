import { Variants, Transition } from "framer-motion";

export const easing: Transition["ease"] = [0.4, 0, 0.2, 1];

export const fadeIn: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easing } },
};

export const slideFadeX: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: easing } },
  exit: { opacity: 0, x: 10, transition: { duration: 0.2, ease: easing } },
};

export const popIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: easing } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2, ease: easing } },
};

export const flipSpring = (flipped: boolean): Variants => ({
  animate: {
    rotateY: flipped ? 180 : 0,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 28,
      mass: 0.8,
    },
    transformStyle: "preserve-3d",
  },
  initial: { rotateY: flipped ? 180 : 0, transformStyle: "preserve-3d" },
});

export const hoverFloat: Variants = {
  rest: { y: 0, rotateX: 0, rotateY: 0, transition: { duration: 0.2, ease: easing } },
  hover: { y: -4, transition: { duration: 0.2, ease: easing } },
};


