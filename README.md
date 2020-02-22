# azure-pipelines-version-increment
This is the code for the Azure Devops Pipines extension 'version-increment'. What it does is take a version (semver) from an input variable and bump it according to your settings. After this it will overwrite the input variable in the build definition so that its state is saved for the next run.

## Example usage in a azurepipelines.yml file
The following example shows the version-increment-task updating the input variable 'packageVersion' with a patch version **(1.0.3 > 1.0.4)** when it is a build from the master branch and from another branch it will update it with a prerelease version **(1.0.3 > 1.0.4.preview.1)**.

```
...
  # update to the next patch version if it is the master branch
  - task: version-increment-task@0
    inputs:
      incrementType: patch
      versionVariable: packageVersion
    condition: and(succeeded(), eq(variables['build.sourceBranch'], 'refs/heads/master'))
    displayName: Generate version number

  # update to the next prerelease version if it is **not** the master branch
  - task: version-increment-task@0
    inputs:
      incrementType: patch
      versionVariable: packageVersion
    condition: and(succeeded(), ne(variables['build.sourceBranch'], 'refs/heads/master'))
    displayName: Generate preview version number

  # package project a nuget using the variable packageVersion
  - task: DotNetCoreCLI@2
    inputs:
      command: 'pack'
      packagesToPack: '$(projectPath)'
      configuration: '$(configuration)'
      versioningScheme: byEnvVar
      versionEnvVar: packageVersion
    displayName: create release package
...

```


## how to build and pack
If you want something similar but different or just play around with the code be my guest. If you want to build it need to run some commands.
If you want to create your own from scratch, visit [the official docs](https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node?view=azure-devops).

* install node
* npm install -g tfx-cli 
* npm run build-it
* npm run pack-it