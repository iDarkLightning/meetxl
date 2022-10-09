import React from "react";
import { motion } from "framer-motion";

export const SectionWrapper: React.FC<React.PropsWithChildren> = (props) => (
  <motion.section
    className="flex flex-col gap-6"
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
  >
    {props.children}
  </motion.section>
);
