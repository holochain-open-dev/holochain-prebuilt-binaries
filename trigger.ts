import axios, { AxiosError, AxiosResponse } from "axios";
import {Octokit} from "octokit";
import { Command } from 'commander';
import 'dotenv/config';


async function main() {
  const program = new Command();
  program
    .name('trigger')
    .description('Trigger github action to install, build, and publish holochain prebuilt binaries')
    .version('1.0.0')
    .requiredOption('-c, --hc_version <string>', 'holochain_cli version')
    .requiredOption('-h, --holochain_version <string>', 'holochain version')
    .requiredOption('-l, --lair_version <string>', 'lair-keystore version');
  program.parse();

  const { lair_version, holochain_version, hc_version } = program.opts();

  const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH_TOKEN
  })

  try {
    await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
      owner: 'holochain-open-dev',
      repo: 'holochain-prebuilt-binaries',
      event_type: `install-release-all`,
      client_payload: {
        lair_version,
        holochain_version,
        hc_version,
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    console.log(`Triggered workflow for lair-keystore v${lair_version}, holochain_cli v${hc_version}, holochain v${holochain_version}` );
  } catch(e) {
    //@ts-ignore
    console.error(e);
  }
}

main();