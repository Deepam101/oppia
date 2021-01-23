// Copyright 2020 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Controller for version mismatch modal.
 */

import { WindowRef } from 'services/contextual/window-ref.service';
import { ExplorationDataService } from 'pages/exploration-editor-page/services/exploration-data.service.ts';
import { LostChangeObjectFactory } from 'domain/exploration/LostChangeObjectFactory';
import { LoggerService } from 'services/contextual/logger.service';
import { ExplorationChange } from 'domain/exploration/exploration-draft.model';

export class SaveVersionMismatchModalController {
  MSECS_TO_REFRESH: number = 20;
  constructor(
    private windowRef: WindowRef,
    private explorationDataService : ExplorationDataService,
    private lostChanges: ExplorationChange[],
    private lostChangeObjectFactory: LostChangeObjectFactory,
    private loggerservice : LoggerService
  ) {
    let haslostChanges = (this.lostChanges && this.lostChanges.length > 0);

    if (haslostChanges) {
      // TODO(sll): This should also include changes to exploration
      // properties (such as the exploration title, category, etc.).
      lostChanges = this.lostChanges.map(
        this.lostChangeObjectFactory.createNew);
      this.loggerservice.error(
        'Lost changes: ' + JSON.stringify(this.lostChanges));
    }
  }
  _refreshPage(delay: number): void {
    setTimeout(() => {
      this.windowRef.nativeWindow.location.reload();
    }, delay);
  }
  // When the user clicks on discard changes button, signal backend
  // to discard the draft and reload the page thereafter.
  discardChanges(): void {
    this.explorationDataService.discardDraft().then(() => {
      this._refreshPage(this.MSECS_TO_REFRESH);
    });
  }
}

