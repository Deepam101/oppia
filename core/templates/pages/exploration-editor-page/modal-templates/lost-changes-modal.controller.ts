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

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LostChangeObjectFactory } from 'domain/exploration/LostChangeObjectFactory';
import { LoggerService } from 'services/contextual/logger.service';
import { ExplorationChange } from 'domain/exploration/exploration-draft.model';
import { Component } from '@angular/core';

/**
 * @fileoverview Controller for lost changes modal.
 */

import { ConfirmOrCancelModalComponent } from 'components/common-layout-directives/common-elements/confirm-or-cancel-modal.controller.ts';

@Component({
  selector: 'lost-changes-modal',
  templateUrl: './lost-changes-modal.template.html',
  styleUrls: []
})
export class LostChangesModalComponent extends ConfirmOrCancelModalComponent {
  lostChanges : ExplorationChange[];
  constructor(
    private lostChangeObjectFactory: LostChangeObjectFactory,
    public ngbModal : NgbActiveModal,
    private log: LoggerService,
  ) {
    super(ngbModal);

    this.lostChanges = this.lostChanges.map(
      this.lostChangeObjectFactory.createNew);
    this.log.error('Lost changes: ' + JSON.stringify(lostChanges));
  }
}

