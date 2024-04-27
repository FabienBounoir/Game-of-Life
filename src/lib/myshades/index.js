import generateTailwindColorFamily from "./generateTailwindColorFamily";
import tailwindColors3 from "./tailwind3";

/**
 * @param {Record<string, string>} args
 * @returns {Promise<import("vite").Plugin>}
 */
const myshades = async (args = {}) => {
    let keys = Object.entries(args);

    for (const [key, hex] of keys) {
        const shades = generateTailwindColorFamily(hex, tailwindColors3);

        shades.forEach((shade) => {
            document.body.style.setProperty(`--${key}-${shade.number}`, shade.hexcode);
        });
    }

    console.log("myshades plugin loaded", document.documentElement.style);
};

export default myshades;
