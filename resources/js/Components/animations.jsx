import { motion } from "framer-motion";

let reducedMotionCache = null;

export function useReducedMotion() {
    if (typeof window === "undefined") return false;
    if (reducedMotionCache === null) {
        reducedMotionCache = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return reducedMotionCache;
}

const defaultTransition = {
    duration: 0.5,
    ease: "easeOut",
};

const defaultRevealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

export function AnimatedPage({ children }) {
    const reduced = useReducedMotion();
    if (reduced) return children;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}

export function AnimatedSection({ children, delay = 0, className, as = "div", ...props }) {
    const Tag = as;
    const reduced = useReducedMotion();
    if (reduced) return <Tag className={className} {...props}>{children}</Tag>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...defaultTransition, delay }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function Reveal({ children, className, delay = 0, ...props }) {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className} {...props}>{children}</div>;

    return (
        <motion.div
            variants={defaultRevealVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...defaultTransition, delay }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

const staggerContainerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const staggerChildVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function StaggerGrid({ children, className, staggerDelay = 0.05, ...props }) {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className} {...props}>{children}</div>;

    return (
        <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className={className}
            {...props}
        >
            {Array.isArray(children)
                ? children.map((child, i) => (
                    <motion.div key={i} variants={staggerChildVariants}>
                        {child}
                    </motion.div>
                  ))
                : children}
        </motion.div>
    );
}

export function MotionButton({ children, className, style, whileHover, whileTap, ...props }) {
    const reduced = useReducedMotion();
    if (reduced) {
        return <button className={className} style={style} {...props}>{children}</button>;
    }

    return (
        <motion.button
            whileHover={whileHover || { scale: 1.03 }}
            whileTap={whileTap || { scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={className}
            style={style}
            {...props}
        >
            {children}
        </motion.button>
    );
}

export function MotionLink({ children, className, style, whileHover, whileTap, ...props }) {
    const reduced = useReducedMotion();
    if (reduced) {
        const Tag = props.href ? "a" : "button";
        return <Tag className={className} style={style} {...props}>{children}</Tag>;
    }

    const MotionTag = motion[props.href ? "a" : "button"];

    return (
        <MotionTag
            whileHover={whileHover || { scale: 1.03 }}
            whileTap={whileTap || { scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={className}
            style={style}
            {...props}
        >
            {children}
        </MotionTag>
    );
}

export function MotionDiv({ children, className, whileHover, whileTap, ...props }) {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className} {...props}>{children}</div>;

    return (
        <motion.div
            whileHover={whileHover}
            whileTap={whileTap}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
