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
 * @fileoverview Unit tests for LostChangesModalController.
 */

import { TestBed } from '@angular/core/testing';
import { UtilsService } from 'services/utils.service';
import { LoggerService } from 'services/contextual/logger.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

fdescribe('Lost Changes Modal Controller', () => {
  let ngbModalInstance : NgbModal;
  let log : LoggerService;
  let logSpy = null;
  const explorationId = '0';
  const lostChanges = [{
    cmd: 'add_state',
    state_name: 'State name',
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilsService,
        LoggerService,
        explorationId,
        lostChanges,
        ngbModalInstance
      ]
    });
    log = TestBed.get(LoggerService);
    logSpy = spyOn(log, 'error').and.callThrough();
    ngbModalInstance = jasmine.createSpyObj(
      'ngbModalInstance', ['close', 'dismiss']);

    it('should evaluates lostChanges when controller is initialized', () => {
      expect(lostChanges[0].cmd).toBe('add_state');
      expect(lostChanges[0].state_name).toBe('State name');
      expect(logSpy).toHaveBeenCalledWith(
        'Lost changes: ' + JSON.stringify(lostChanges));
    });
  });
});
