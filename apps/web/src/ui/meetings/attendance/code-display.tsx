import { motion } from "framer-motion";

export const CodeDisplay: React.FC<{ code: string }> = (props) => {
  return (
    <div className="flex gap-4">
      {props.code.split("").map((item, idx) => (
        <div
          key={idx}
          className="flex h-16 w-12 items-center justify-center rounded-lg bg-accent-secondary md:h-20 md:w-16"
        >
          <motion.p
            className="font-mono text-2xl font-semibold uppercase md:text-3xl"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{
              delay: idx * 0.1,
            }}
          >
            {item}
          </motion.p>
        </div>
      ))}
    </div>
  );
};
