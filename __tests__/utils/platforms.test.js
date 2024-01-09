const { OS_PLATFORM, platform, separator } = require("../../utils/platforms");

describe("platforms utility", () => {
    it("should define OS_PLATFORM with the correct values", () => {
        expect(OS_PLATFORM.WINDOWS).toBe("win32");
        expect(OS_PLATFORM.MACOS).toBe("darwin");
    });

    describe("platform", () => {
        it("should be a string", () => {
            expect(typeof platform).toBe("string");
        });
    });

    describe("separator", () => {
        it("should be a string", () => {
            expect(typeof separator).toBe("string");
        });

        it("should be a backslash for Windows", () => {
            Object.defineProperty(process, "platform", {
                value: "win32",
            });
            const windowsSeparator = require("../../utils/platforms").separator;
            expect(windowsSeparator).toBe("\\");
        });
    });
});
