"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type MotionBlockProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className = "", delay = 0 }: MotionBlockProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = "", delay = 0 }: MotionBlockProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "show"}
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.12,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: MotionBlockProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        prefersReducedMotion
          ? undefined
          : {
              hidden: { opacity: 0, y: 22 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
              },
            }
      }
    >
      {children}
    </motion.div>
  );
}

export const MotionDiv = motion.div;
