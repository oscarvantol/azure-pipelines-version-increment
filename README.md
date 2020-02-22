# azure-pipelines-version-increment
This is the code for the Azure Devops Pipines extension 'version-increment'. What it does is take a version (semver) from an input variable and bump it according to your settings. After this it will overwrite the input variable in the build definition so that its state is saved for the next run.

## Example usage in a azurepipelines.yml file

```
yaml
```


## how to build and pack
If you want something similar but different or just play around with the code be my guest. If you want to build it need to run some commands.
If you want to create your own from scratch, visit [the official docs](https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node?view=azure-devops).

* install node
* npm install -g tfx-cli 
* npm run build-it
* npm run pack-it