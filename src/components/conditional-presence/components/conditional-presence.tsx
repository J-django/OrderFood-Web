import { AnimatePresence, motion } from "motion/react";
import type { ConditionalPresenceProps } from "../types";

function ConditionalPresence({ children, show }: ConditionalPresenceProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export { ConditionalPresence };
