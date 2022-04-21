# Command Line Upscaler

## Setup

```sh
yarn install
```

## Usage

The program will take jpgs in the supplied folder and convert them to to an upscaled version with the same name within the "scaled" directory of the targeted folder. If that folder exists, it will be replaced by the command. 

For example, this will create an upscaled version of every jpg in the `\smol_photos` directory and write them to `\smol_photos\scaled`:
```sh
node .\index.mjs upscale "C:\Media\smol_photos"
```