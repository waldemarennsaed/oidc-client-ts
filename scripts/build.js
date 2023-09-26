#!/usr/bin/env node
const { buildSync } = require("esbuild");
const { join } = require("path");
const fs = require("fs");

const { dependencies, peerDependencies, version } = require("../package.json");

const opts = {
    entryPoints: ["src/index.ts"],
    absWorkingDir: join(__dirname, ".."),
    bundle: true,
    sourcemap: true,
};

const external = Object.keys({ ...dependencies, ...peerDependencies });

try {
    // esm
    buildSync({
        ...opts,
        platform: "neutral",
        outfile: "dist/esm/oidc-client-ts.js",
        external,
    });
    // generate package.json for esm
    const distPackageJson = { type: "module" , version };
    fs.writeFileSync("dist/esm/package.json", JSON.stringify(distPackageJson, null, 2) + "\n");

    // node
    buildSync({
        ...opts,
        platform: "node",
        outfile: "dist/umd/oidc-client-ts.js",
        external,
    });

    // browser (self contained)
    buildSync({
        ...opts,
        platform: "browser",
        outfile: "dist/browser/oidc-client-ts.js",
        globalName: "oidc",
    });
    // browser-min (self contained)
    buildSync({
        ...opts,
        platform: "browser",
        outfile: "dist/browser/oidc-client-ts.min.js",
        globalName: "oidc",
        minify: true,
    });
} catch (err) {
    // esbuild handles error reporting
    process.exitCode = 1;
}
