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
 * @fileoverview Unit tests for AutosaveInfoModalsService.
 */

import { LocalStorageService } from 'services/local-storage.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UrlInterpolationService } from
  'domain/utilities/url-interpolation.service';
import { AutosaveInfoModalsService } from './autosave-info-modals.service';

fdescribe('AutosaveInfoModalsService', () => {
  let autosaveInfoModalsService: AutosaveInfoModalsService;
  let ngbModal = null;
  const explorationId = '0';
  const lostChanges = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        UrlInterpolationService,
        NgbModal,
        AutosaveInfoModalsService
      ]
    });
    autosaveInfoModalsService = TestBed.get(AutosaveInfoModalsService);
    ngbModal = TestBed.get(NgbModal);
  });

  it('should call ngbModal open when opening non strict validation fail' +
    ' modal', () => {
    const modalOpenSpy = spyOn(ngbModal, 'open').and.callThrough();
    autosaveInfoModalsService.showNonStrictValidationFailModal();
    expect(modalOpenSpy).toHaveBeenCalled();
  });

  it('should close non strict validation fail modal successfully',
    fakeAsync(() => {
      expect(autosaveInfoModalsService.isModalOpen()).toBe(false);
      spyOn(ngbModal, 'open').and.returnValue({
        result: Promise.resolve()
      });
      autosaveInfoModalsService.showNonStrictValidationFailModal();
      expect(autosaveInfoModalsService.isModalOpen()).toBe(true);
      tick(1000);

      expect(autosaveInfoModalsService.isModalOpen()).toBe(false);
    }));

  it('should handle rejects when closing non strict validation fail modal',
    () => {
      expect(autosaveInfoModalsService.isModalOpen()).toBe(false);
      spyOn(ngbModal, 'open').and.returnValue({
        result: Promise.reject()
      });
      autosaveInfoModalsService.showNonStrictValidationFailModal();
      expect(autosaveInfoModalsService.isModalOpen()).toBe(true);
      tick(1000);
      expect(autosaveInfoModalsService.isModalOpen()).toBe(false);
    });

  it('should call ngbModal open when opening version mismatch' +
    ' modal', () => {
    const modalOpenSpy = spyOn(ngbModal, 'open').and.callThrough();
    autosaveInfoModalsService.showVersionMismatchModal(lostChanges);
    expect(modalOpenSpy).toHaveBeenCalled();
  });

  it('should close version mismatch modal successfully', () => {
    expect(autosaveInfoModalsService.isModalOpen()).toBe(false);
    spyOn(ngbModal, 'open').and.returnValue({
      result: Promise.resolve()
    });
    autosaveInfoModalsService.showVersionMismatchModal(lostChanges);
    expect(autosaveInfoModalsService.isModalOpen()).toBe(true);
    tick(1000);
    expect(autosaveInfoModalsService.isModalOpen()).toBe(false);
  });

  it('should handle rejects when dismissing save version mismatch modal',
    () => {
      expect(autosaveInfoModalsService.isModalOpen()).toBe(false);
      spyOn(ngbModal, 'open').and.returnValue({
        result: Promise.reject()
      });
      autosaveInfoModalsService.showVersionMismatchModal(lostChanges);
      expect(autosaveInfoModalsService.isModalOpen()).toBe(true);
      tick(1000);
      expect(autosaveInfoModalsService.isModalOpen()).toBe(false);
    });

  it('should call ngbModal open when opening show lost changes modal',
    () => {
      const modalOpenSpy = spyOn(ngbModal, 'open').and.callThrough();
      autosaveInfoModalsService.showLostChangesModal(
        lostChanges, explorationId);
      expect(modalOpenSpy).toHaveBeenCalled();
    });

  it('should close show lost changes modal successfully', () => {
    expect(autosaveInfoModalsService.isModalOpen()).toBe(false);
    spyOn(ngbModal, 'open').and.returnValue({
      result: Promise.resolve()
    });
    autosaveInfoModalsService.showLostChangesModal(lostChanges, explorationId);
    expect(autosaveInfoModalsService.isModalOpen()).toBe(true);
    tick(1000);
    expect(autosaveInfoModalsService.isModalOpen()).toBe(false);
  });

  it('should handle reject when dismissing show lost changes modal', () => {
    expect(autosaveInfoModalsService.isModalOpen()).toBe(false);
    spyOn(ngbModal, 'open').and.returnValue({
      result: Promise.reject()
    });
    autosaveInfoModalsService.showLostChangesModal(lostChanges, explorationId);
    expect(autosaveInfoModalsService.isModalOpen()).toBe(true);
    tick(1000);
    expect(autosaveInfoModalsService.isModalOpen()).toBe(false);
  });
});
