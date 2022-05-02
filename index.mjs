import { Command } from 'commander';
import { eachLimit } from 'async';
import { readdirSync, writeFileSync, rmdirSync, existsSync, mkdirSync } from 'fs';
import tfnode from '@tensorflow/tfjs-node';
// import Upscaler from 'upscaler/node-gpu';
import Upscaler from 'upscaler/node';

const upscaler = new Upscaler({
  model: 'idealo/gans',
  // scale: 2,
});

const program = new Command();

const commandHandler = async (dir) => {
  const outputPath = `${dir}\\scaled`;

  const makeFile = (data, callback) => {
    if (!data.endsWith('jpg')) return callback();
    const path = `${outputPath}\\${data}`;
    console.log(`Starting: ${path}`);
    return upscaler.upscale(`${dir}\\${data}`, { output: 'tensor' }).then(async (result) => {
      const newImg = await tfnode.node.encodeJpeg(result);
      console.log(`Writing: ${path}`);
      writeFileSync(path, newImg);
      callback();
    });
  };

  if (existsSync(outputPath)) {
    rmdirSync(outputPath, { recursive: true, force: true });
  }

  mkdirSync(outputPath);

  // readdirSync(dir).map(makeFile);
  eachLimit(readdirSync(dir), 1, makeFile);
};

program.command('upscale')
  .argument('<string>', 'path')
  .action(commandHandler);

program.parse();
