/**
 * Propagates widget dev package.json into widget dist package.json
 * 
 * TODO: Should live in the framework module, should be a gulp plugin
 */

import * as fs from './fsPromises';

// TODO: Clean up the types up in this mofo

export function createDistPackage(sourceFilePath: string, destFilePath: string) {
    return fs.readFile(sourceFilePath, 'utf8')
        .then((src: string) => JSON.parse(src))
        .then((packageDetails: any) => processPackage(packageDetails))
        .then((obj: any) => JSON.stringify(obj, null, 2))
        .then((src: string) => fs.writeFile(destFilePath, src, 'utf8'));
}

export function processPackage(packageDetails:any) {
    // Delete some things unneeded for the distributed artefact
    packageDetails.scripts = {};
    delete packageDetails.devDependencies;
    delete packageDetails.prepublishOnly;

    // Tweak some settings
    if (packageDetails.main) {
        packageDetails.main = packageDetails.main.replace('dist/','');
    }
    if (packageDetails.types) {
        packageDetails.types = packageDetails.types.replace('dist/','');
    }

    // // TODO: Ability to publish from dist
    // packageDetails.scripts.prepublishOnly = 'echo "NOT YET" && exit 1';

    return packageDetails;
}

