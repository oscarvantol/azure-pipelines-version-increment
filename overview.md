# Azure Pipelines Version Increment

Version-Increment takes a version (semver) from an input **variable** (This is a variable of the pipeline, not the yaml)  and bump it according to your settings. After this it will overwrite the input variable in the build definition so that its state is saved for the next run. In order to make this work you also need to add the **Edit build pipeline** permission to the **Build service**

## Example usage in an azurepipelines.yml file
The following example shows the version-increment-task updating the **input variable** 'packageVersion' with a patch version **(1.0.3 > 1.0.4)** when it is a build from the master branch and from another branch it will update it with a prerelease version **(1.0.3 > 1.0.4.preview.1)**.


```
...
  # update to the next patch version if it is the master branch
  - task: version-increment-task@2
    inputs:
      incrementType: patch
      versionVariable: packageVersion
    condition: and(succeeded(), eq(variables['build.sourceBranch'], 'refs/heads/master'))
    displayName: Generate version number

  # update to the next prerelease version if it is **not** the master branch
  - task: version-increment-task@2
    inputs:
      incrementType: prerelease
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
