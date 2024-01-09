const {
    formatCssVar,
    minimifyCss,
    formatCss,
} = require("../../utils/css-format");

describe("css-format utility functions", () => {
    describe("formatCssVar", () => {
        it("should replace environment variables in CSS content", () => {
            process.env.TEST_VAR = "replacement";
            const inputCss = "background: url(env(TEST_VAR));";
            const outputCss = "background: url(replacement);";
            expect(formatCssVar(inputCss)).toBe(outputCss);
        });
    });

    describe("minimifyCss", () => {
        it("should minimify CSS by removing comments and unnecessary whitespaces", () => {
            const inputCss = `@minimify;
                        /* Comment */
                        .class {
                          color: red; /* Another comment */
                        }`;
            const outputCss = ".class{color:red;}";
            expect(minimifyCss(inputCss)).toBe(outputCss);
        });

        it("should not change CSS if @minimify key is not present", () => {
            const inputCss = ".class { color: red; }";
            expect(minimifyCss(inputCss)).toBe(inputCss);
        });
    });

    describe("formatCss", () => {
        it("should apply both CSS variable formatting and minimification", () => {
            process.env.TEST_VAR = "black";
            const inputCss =
                "@minimify; .class { color: env(TEST_VAR); /* Comment */ }";
            const outputCss = ".class{color:black;}";
            expect(formatCss(inputCss)).toBe(outputCss);
        });
    });
});
