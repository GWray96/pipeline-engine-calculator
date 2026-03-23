"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Landing from "@/components/landing";
import Calculator from "@/components/calculator";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!started ? (
        <motion.div
          key="landing"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Landing onStart={() => setStarted(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="calculator"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Calculator />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
