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

export class SaveVersionMismatchModalController {
  constructor(
    private windowRef: WindowRef
  ) {}

   MSECS_TO_REFRESH: number = 20;
   _refreshPage(delay: number): void {
     setTimeout(() => {
       this.windowRef.nativeWindow.location.reload();
     }, delay);
   }
   // When the user clicks on discard changes button, signal backend
   // to discard the draft and reload the page thereafter.
   discardChanges(): void {
     ExplorationDataService.discardDraft(() => {
       this._refreshPage(this.MSECS_TO_REFRESH);
     });
   }

    hasLostChanges = (lostChanges && lostChanges.length > 0);
    if(hasLostChanges) {
      // TODO(sll): This should also include changes to exploration
      // properties (such as the exploration title, category, etc.).
      lostChanges = lostChanges.map(
        LostChangeObjectFactory.createNew);
      $log.error('Lost changes: ' + JSON.stringify(lostChanges));
    }
}

