import { Command } from 'commander';
import { readdirSync, writeFileSync, rmdirSync, existsSync, mkdirSync } from 'fs';
import tfnode from '@tensorflow/tfjs-node';
// import Upscaler from 'upscaler/node-gpu';
import Upscaler from 'upscaler/node';

const upscaler = new Upscaler({
  model: 'div2k-2x',
  scale: 2,
});

const program = new Command();

const commandHandler = async (dir) => {
  const outputPath = `${dir}\\scaled`;

  const makeFile = (data) => {
    if (!data.endsWith('jpg')) return;
    const path = `${outputPath}\\${data}`;
    upscaler.upscale(`${dir}\\${data}`, { output: 'tensor' }).then(async (result) => {
      const newImg = await tfnode.node.encodeJpeg(result);
      console.log(`Writing: ${path}`);
      writeFileSync(path, newImg);
    });
  };

  if (existsSync(outputPath)) {
    rmdirSync(outputPath, { recursive: true, force: true });
  }

  mkdirSync(outputPath);

  readdirSync(dir).map(makeFile);
};

program.command('upscale')
  .argument('<string>', 'path')
  .action(commandHandler);

program.parse();
