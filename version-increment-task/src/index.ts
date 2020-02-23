import tl = require('azure-pipelines-task-lib/task');
import * as rm from 'typed-rest-client';
import { inc } from 'semver';
import btoa = require('btoa');


async function run() {
    try {
        const versionVariable: string = tl.getInput('versionVariable', false) || 'version';
        const dryRun: boolean = tl.getInput('dryRun', false) == 'true';
        const incrementType: string = (tl.getInput('incrementType', false) || 'patch');
        const previewName: string =(tl.getInput('previewName', false) || 'preview');

        let buildDefinitionId = tl.getVariable('System.DefinitionId');
        let accessToken = tl.getVariable('System.AccessToken');
        let collectionUri = tl.getVariable('System.CollectionUri');
        let teamProject = tl.getVariable('System.TeamProject');

        const client = new rm.RestClient('', collectionUri, undefined, { headers: { 'Authorization': 'Basic ' + btoa(":" + accessToken) } });

        let response = await client.get(`${teamProject}/_apis/build/definitions/${buildDefinitionId}?api-version=5.0`);
        var buildDefinition: any = response.result as any;
        console.log(versionVariable + '=' + buildDefinition.variables[versionVariable].value);
        console.log(`Incrementing version with: ${incrementType}`);
        buildDefinition.variables[versionVariable].value = inc(buildDefinition.variables[versionVariable].value, incrementType as 'major' | 'minor' | 'patch' | 'prerelease', undefined, previewName);
        console.log(versionVariable + '=' + buildDefinition.variables[versionVariable].value);
        tl.setVariable(`${versionVariable}Next`, buildDefinition.variables[versionVariable].value);

        console.log(`dryRun param is set to: ${dryRun}`);
        if (!dryRun) {
            console.log('Attempting to update pipeline definition...');
            await client.replace(`${teamProject}/_apis/build/definitions/${buildDefinitionId}?api-version=5.0`, buildDefinition);
            tl.setVariable(versionVariable, buildDefinition.variables[versionVariable].value);
        }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();