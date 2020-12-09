/*
  Copyright 2020 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import path from 'path';
import getLowdefyVersion from './getLowdefyVersion';
import createPrint from './print';
import { cacheDirectoryPath, outputDirectoryPath } from './directories';

async function createContext(options = {}) {
  const context = {};

  context.print = createPrint({
    basic: options.basicPrint,
  });

  context.baseDirectory = path.resolve(options.baseDirectory || process.cwd());
  context.cacheDirectory = path.resolve(context.baseDirectory, cacheDirectoryPath);
  if (options.outputDirectory) {
    context.outputDirectory = path.resolve(options.outputDirectory);
  } else {
    context.outputDirectory = path.resolve(context.baseDirectory, outputDirectoryPath);
  }

  context.version = await getLowdefyVersion(context);
  return context;
}

export default createContext;
