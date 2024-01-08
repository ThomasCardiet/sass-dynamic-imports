const OS_PLATFORM = {
    WINDOWS: "win32",
    MACOS: "darwin",
};

const platform = process.platform;
const separator = platform === OS_PLATFORM.WINDOWS ? "\\" : "/";

module.exports = {
    OS_PLATFORM,
    platform,
    separator,
};
