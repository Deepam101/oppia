// Copyright 2014 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Service for displaying different types of modals depending
 * on the type of response received as a result of the autosaving request.
 */


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveValidationFailModalComponent } from 'pages/exploration-editor-page/modal-templates/save-validation-fail-modal.controller.ts';
import { SaveVersionMismatchModalComponent } from 'pages/exploration-editor-page/modal-templates/save-version-mismatch-modal.controller.ts';
import { LostChangesModalComponent } from 'pages/exploration-editor-page/modal-templates/lost-changes-modal.controller.ts';
import { downgradeInjectable } from '@angular/upgrade/static';
import { ExplorationChange } from 'domain/exploration/exploration-draft.model';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AutosaveInfoModalsService {
  private _isModalOpen = false;
  constructor(
      private ngbModal: NgbModal
  ) {}

  showNonStrictValidationFailModal(): void {
    this.ngbModal.open(
      SaveValidationFailModalComponent,
      {
        backdrop: 'static',
      }).result.then(function() {
      this._isModalOpen = false;
    }, function() {
      this._isModalOpen = false;
    });

    this._isModalOpen = true;
  }
  isModalOpen(): boolean {
    return this._isModalOpen;
  }
  showVersionMismatchModal(lostChanges: ExplorationChange[]): void {
    let modalRef = this.ngbModal.open(
      SaveVersionMismatchModalComponent,
      {
        backdrop: 'static',
        windowClass: 'oppia-autosave-version-mismatch-modal'
      });
    modalRef.componentInstance.lostChanges = lostChanges;
    modalRef.result.then(function() {
      this._isModalOpen = false;
    }, function() {
      this._isModalOpen = false;
    });
    this._isModalOpen = true;
  }
  showLostChangesModal(
      lostChanges: ExplorationChange[], explorationId: string): void {
    const modalRef = this.ngbModal.open(
      LostChangesModalComponent,
      {
        backdrop: 'static',
        windowClass: 'oppia-lost-changes-modal'
      });
    modalRef.componentInstance.lostChanges = lostChanges;
    modalRef.result.then(function() {
      this._isModalOpen = false;
    }, function() {
      // When the user clicks on discard changes button, signal backend
      // to discard the draft and reload the page thereafter.
      this.localStorageService.removeExplorationDraft(explorationId);
      this._isModalOpen = false;
    });
    this._isModalOpen = true;
  }
}

angular.module('oppia').factory(
  'AutosaveInfoModalsService',
  downgradeInjectable(AutosaveInfoModalsService));

